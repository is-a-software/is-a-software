const fs = require('fs');
const path = require('path');
const github = require('@actions/github');
const vercelValidation = require('./_vercel');

async function run() {
	const token = process.env.GITHUB_TOKEN;
	const octokit = github.getOctokit(token);
	const context = github.context;

	const prNumber = context.payload.pull_request.number;
	const prAuthor = context.payload.pull_request.user.login;
	const prHeadSha = context.payload.pull_request.head.sha;
	const prBaseSha = context.payload.pull_request.base.sha;
	
	async function fail(message) {
		await octokit.rest.issues.createComment({
			owner: context.repo.owner,
			repo: context.repo.repo,
			issue_number: prNumber,
			body: `❌ **Validation Failed:** ${message}`
		});
		process.exit(1);
	}

	async function getOwner(path, ref){
		try {
			const { data: file } = await octokit.rest.repos.getContent({
				owner: context.repo.owner,
				repo: context.repo.repo,
				path,
				ref,
			});

			if (!file || Array.isArray(file) || !file.content) {
				await fail("Unable to retrieve file content from the pull request.");
			}
			const content = Buffer.from(
				file.content,
				file.encoding || "base64"
			).toString("utf8");

			let data;
			try {
				data = JSON.parse(content);
			} catch (e) {
				await fail(`Invalid JSON: ${e.message}`);
			}

			if (!data.owner || !data.owner.github) {
				await fail("Missing 'owner.github' field in JSON.");
			}
			if (!data.record || (Object.keys(data.record).includes('NS') || Object.keys(data.record).includes('MX'))) {
				await fail("NS and MX records are not allowed.");
			}

			return data?.owner?.github?.toLowerCase();
		} catch (error) {
			// If file doesn't exist (404), return null instead of failing
			if (error.status === 404) {
				return null;
			}
			// For other errors, re-throw
			throw error;
		}
	}

	try {
		if (!context.payload.pull_request) {
			throw new Error("This action only runs on pull requests.");
		}

		const reservedFile = fs.readFileSync(path.join(__dirname, '..', 'config', 'reserved.json'), 'utf8');
		const reservedKeywords = JSON.parse(reservedFile);

		const { data: files } = await octokit.rest.pulls.listFiles({
			owner: context.repo.owner,
			repo: context.repo.repo,
			pull_number: prNumber,
		});

		if (files.length !== 1) {
			await fail("Pull request must modify exactly one file.");
		}
		const file = files[0];
		if (!file.filename.startsWith('domains/') || !file.filename.endsWith('.json')) {
			await fail("You can only add or edit .json files in the 'domains/' folder.");
		}

		const subdomain = path.basename(file.filename, '.json').toLowerCase();
		console.log(`🏷️  Subdomain: ${subdomain}`);
		
		// Check if this is a _vercel subdomain using the validation module
		const isVercelSubdomain = vercelValidation.isVercelSubdomain(file.filename);
		
		if (isVercelSubdomain) {
			// Validate _vercel subdomain ownership and TXT record content
			const result = await vercelValidation.validateVercelAddition(
				octokit, context, file.filename, prAuthor, prBaseSha, prHeadSha
			);
			
			if (!result.isValid) {
				await fail(result.message);
			}
		} else {
			// For regular subdomains, check reserved keywords
			if (reservedKeywords.includes(subdomain)) {
				await fail(`The subdomain **'${subdomain}'** is a reserved keyword and cannot be registered.`);
			}
			console.log('✅ Subdomain is not reserved');
		}

		// Fetch the changed file content from the PR head commit safely
		switch (file.status) {
			case "removed":
				console.log('🗑️  Validating file removal...');
				
				if (isVercelSubdomain) {
					// Use the validation module for _vercel subdomain deletion
					const result = await vercelValidation.validateVercelDeletion(
						octokit, context, file.filename, prAuthor, prBaseSha
					);
					
					if (!result.isValid) {
						await fail(result.message);
					}
				} else {
					// For regular domains, check file ownership
					const removedOwner = await getOwner(file.filename, prBaseSha);
					if (!removedOwner) {
						await fail(`Unable to find the original owner of the file being deleted.`);
					}
					if (removedOwner !== prAuthor.toLowerCase()) {
						await fail(`You are not allowed to delete this file. The file belongs to '${removedOwner}'.`);
					}
					console.log('✅ File removal authorized');
				}
				break;
		    case "added":
				console.log('➕ Validating file addition...');
				
				// For _vercel subdomains, we already validated ownership above
				if (isVercelSubdomain) {
					console.log('✅ Vercel subdomain addition authorized (ownership already verified)');
				} else {
					// For regular domains, validate the file owner matches PR author
					const newOwner = await getOwner(file.filename, prHeadSha);
					if (!newOwner) {
						await fail(`Unable to retrieve owner information from the new file.`);
					}
					console.log(`👤 File owner: ${newOwner}, PR author: ${prAuthor}`);
					if (newOwner !== prAuthor.toLowerCase()) {
						await fail(`Owner username '${newOwner}' does not match PR author '${prAuthor}'.`);
					}
					console.log('✅ File addition authorized');
				}
				break;
		    case "modified":
				console.log('📝 Validating file modification...');
				
				if (isVercelSubdomain) {
					// Use the validation module for _vercel subdomain modification
					const result = await vercelValidation.validateVercelModification(
						octokit, context, file.filename, prAuthor, prBaseSha, prHeadSha
					);
					
					if (!result.isValid) {
						await fail(result.message);
					}
				} else {
					// For regular domains, check file ownership
					const oldOwner = await getOwner(file.filename, prBaseSha);
					const modifiedNewOwner = await getOwner(file.filename, prHeadSha);
					if (!modifiedNewOwner) {
						await fail(`Unable to retrieve owner information from the modified file.`);
					}
					if (oldOwner && oldOwner !== prAuthor.toLowerCase()) {
						await fail(`You are not allowed to modify this file. The file belongs to '${oldOwner}'.`);
					}
					console.log('✅ File modification authorized');
				}
				break;
			case "renamed":
				console.log('✏️ Validating file rename...');
				
				// Check if old or new file is a vercel subdomain
				const oldIsVercelSubdomain = vercelValidation.isVercelSubdomain(file.previous_filename);
				const newIsVercelSubdomain = vercelValidation.isVercelSubdomain(file.filename);
				
				// If either file involves _vercel subdomains, use the validation module
				if (oldIsVercelSubdomain || newIsVercelSubdomain) {
					const result = await vercelValidation.validateVercelRename(
						octokit, context, file.previous_filename, file.filename, prAuthor, prBaseSha
					);
					
					if (!result.isValid) {
						await fail(result.message);
					}
				} else {
					// For regular files, check ownership of both old and new files
					const renamedOldOwner = await getOwner(file.previous_filename, prBaseSha);
					if (!renamedOldOwner) {
						await fail(`Unable to retrieve owner information for the old renamed file.`);
					}
					if (renamedOldOwner !== prAuthor.toLowerCase()) {
						await fail(`You are not allowed to rename this file. The old file belongs to '${renamedOldOwner}'.`);
					}
					
					const renamedNewOwner = await getOwner(file.filename, prHeadSha);
					if (!renamedNewOwner) {
						await fail(`Unable to retrieve owner information for the new renamed file.`);
					}
					if (renamedNewOwner !== prAuthor.toLowerCase()) {
						await fail(`You are not allowed to create this file. The new file belongs to '${renamedNewOwner}'.`);
					}
				}
				
				console.log('✅ File rename authorized');
				break;
			default:
				break;
		}

		console.log("✅ Validation successful!");

	} catch (error) {
		await fail(error.message);
	}
}

run();