const fs = require('fs');
const path = require('path');
const github = require('@actions/github');

async function run() {
	const token = process.env.GITHUB_TOKEN;
	const octokit = github.getOctokit(token);
	const context = github.context;

	const prNumber = context.payload.pull_request.number;
	const prAuthor = context.payload.pull_request.user.login;
	const prHeadSha = context.payload.pull_request.head.sha;
	
	async function fail(message) {
		await octokit.rest.issues.createComment({
			owner: context.repo.owner,
			repo: context.repo.repo,
			issue_number: prNumber,
			body: `❌ **Validation Failed:** ${message}`
		});
		process.exit(1);
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
		if (reservedKeywords.includes(subdomain)) {
			await fail(`The subdomain **'${subdomain}'** is a reserved keyword and cannot be registered.`);
		}

		// Fetch the changed file content from the PR head commit safely
		const { data: contentResp } = await octokit.rest.repos.getContent({
			owner: context.repo.owner,
			repo: context.repo.repo,
			path: file.filename,
			ref: prHeadSha,
		});
		if (!contentResp || Array.isArray(contentResp) || !contentResp.content) {
			await fail("Unable to retrieve file content from the pull request.");
		}
		const fileContent = Buffer.from(contentResp.content, contentResp.encoding || 'base64').toString('utf8');
		let data;
		try {
			data = JSON.parse(fileContent);
		} catch (e) {
			await fail(`Invalid JSON: ${e.message}`);
		}

		if (!data.owner || !data.owner.github) {
			await fail("Missing 'owner.github' field in JSON.");
		}
		if (data.owner.github.toLowerCase() !== prAuthor.toLowerCase()) {
			await fail(`Owner username '${data.owner.github}' does not match PR author '${prAuthor}'.`);
		}
		if (!data.record || (Object.keys(data.record).includes('NS') || Object.keys(data.record).includes('MX'))) {
			await fail("NS and MX records are not allowed.");
		}

		console.log("✅ Validation successful!");

	} catch (error) {
		await fail(error.message);
	}
}

run();