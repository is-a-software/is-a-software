const fs = require('fs');
const path = require('path');
const github = require('@actions/github');
const vercelValidation = require('./_vercel');

// DNS Record Validation Functions
function isValidIPv4(ip) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
}

function isValidIPv6(ip) {
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    return ipv6Regex.test(ip) || /^(?:[0-9a-fA-F]{1,4}:){1,7}:$/.test(ip) || /^:(?:[0-9a-fA-F]{1,6})[0-9a-fA-F]{1,4}$/.test(ip);
}

function isValidDomain(domain) {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain) && !domain.includes('..') && domain.length <= 253;
}

function validateSubdomainName(name, recordTypes = []) {
    const errors = [];
    
    // Allow underscores for TXT records only
    const hasTxtRecord = recordTypes.some(type => type.toUpperCase() === 'TXT');
    const allowUnderscore = hasTxtRecord;
    
    if (!name || name.length === 0) {
        errors.push('Subdomain name cannot be empty');
        return errors;
    }
    
    // Check total length (DNS allows up to 253 characters for full domain)
    if (name.length > 200) {
        errors.push('Subdomain name cannot exceed 200 characters');
    }
    
    // Check individual labels (parts between dots) - each must be <= 63 characters
    const labels = name.split('.');
    for (const label of labels) {
        if (label.length > 63) {
            errors.push('Each part of the subdomain (between dots) cannot exceed 63 characters');
            break;
        }
        if (label.length === 0) {
            errors.push('Subdomain cannot have empty parts (consecutive dots or leading/trailing dots)');
            break;
        }
    }
    
    if (name.startsWith('-') || name.endsWith('-')) {
        errors.push('Subdomain name cannot start or end with a hyphen');
    }
    
    const validChars = allowUnderscore ? /^[a-z0-9._-]+$/ : /^[a-z0-9.-]+$/;
    if (!validChars.test(name)) {
        if (allowUnderscore) {
            errors.push('Subdomain name can only contain lowercase letters, numbers, periods, hyphens, and underscores (for TXT records)');
        } else {
            errors.push('Subdomain name can only contain lowercase letters, numbers, periods, and hyphens');
        }
    }
    
    if (name.includes('..')) {
        errors.push('Subdomain name cannot contain consecutive periods');
    }
    
    return errors;
}

function validateRecordValue(type, value) {
    const errors = [];
    
    switch (type.toUpperCase()) {
        case 'A':
            if (!isValidIPv4(value)) {
                errors.push('A record must contain a valid IPv4 address');
            }
            break;
            
        case 'AAAA':
            if (!isValidIPv6(value)) {
                errors.push('AAAA record must contain a valid IPv6 address');
            }
            break;
            
        case 'CNAME':
            if (value.includes('http://') || value.includes('https://')) {
                errors.push('CNAME record cannot contain http:// or https://');
            }
            if (!isValidDomain(value)) {
                errors.push('CNAME record must contain a valid domain name');
            }
            break;
            
        case 'MX':
            const mxParts = value.split(' ');
            if (mxParts.length !== 2) {
                errors.push('MX record must be in format "priority domain"');
            } else {
                const [priority, domain] = mxParts;
                if (!/^\d+$/.test(priority) || parseInt(priority) > 65535) {
                    errors.push('MX priority must be a number between 0 and 65535');
                }
                if (!isValidDomain(domain)) {
                    errors.push('MX record must contain a valid domain name');
                }
            }
            break;
            
        case 'TXT':
            if (value.length > 255) {
                errors.push('TXT record cannot exceed 255 characters');
            }
            break;
            
        case 'NS':
            if (!isValidDomain(value)) {
                errors.push('NS record must contain a valid domain name');
            }
            break;
            
        default:
            // Allow other record types without specific validation
            break;
    }
    
    return errors;
}

async function validateSubdomainAndRecords(filename, content) {
    const subdomain = path.basename(filename, '.json').toLowerCase();
    
    let data;
    try {
        data = JSON.parse(content);
    } catch (e) {
        await fail(`Invalid JSON: ${e.message}`);
    }
    
    // Validate subdomain name (allow underscores for TXT records)
    const recordTypes = data.record ? Object.keys(data.record) : [];
    const subdomainErrors = validateSubdomainName(subdomain, recordTypes);
    if (subdomainErrors.length > 0) {
        await fail(`Invalid subdomain name: ${subdomainErrors.join(', ')}`);
    }
    
    // Validate DNS record values
    if (data.record) {
        for (const [recordType, recordValue] of Object.entries(data.record)) {
            const validationErrors = validateRecordValue(recordType, recordValue);
            if (validationErrors.length > 0) {
                await fail(`Invalid ${recordType} record: ${validationErrors.join(', ')}`);
            }
        }
    }
}

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
					// For regular domains, validate subdomain name and DNS records
					const content = Buffer.from(
						file.content,
						file.encoding || "base64"
					).toString("utf8");
					await validateSubdomainAndRecords(file.filename, content);
					
					// Validate the file owner matches PR author
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
					// For regular domains, validate subdomain name and DNS records
					const content = Buffer.from(
						file.content,
						file.encoding || "base64"
					).toString("utf8");
					await validateSubdomainAndRecords(file.filename, content);
					
					// Check file ownership
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