/**
 * Vercel Subdomain Validation Module
 * 
 * This module handles validation for _vercel subdomain files.
 * Pattern: _vercel.xyz.json creates a TXT record at _vercel subdomain for xyz domain
 * 
 * Requirements:
 * - User must own the base domain (xyz.json) to create _vercel.xyz.json
 * - Validates ownership across all file operations (add, modify, delete, rename)
 */

/**
 * Checks if a filename represents a _vercel subdomain file
 * @param {string} filename - The file path (e.g., "domains/_vercel.example.json")
 * @returns {boolean} - True if this is a _vercel subdomain file
 */
function isVercelSubdomain(filename) {
    // Must contain "_vercel." and be in the format domains/_vercel.something.json
    const pattern = /^domains\/_vercel\.[a-zA-Z0-9.-]+\.json$/;
    return pattern.test(filename);
}

/**
 * Extracts the base domain name from a _vercel subdomain filename
 * @param {string} filename - The _vercel file path (e.g., "domains/_vercel.example.json")
 * @returns {string|null} - The base domain name (e.g., "example") or null if not a _vercel file
 */
function getBaseSubdomain(filename) {
    if (!isVercelSubdomain(filename)) {
        return null;
    }
    return filename.replace('domains/_vercel.', '').replace('.json', '');
}

/**
 * Validates that a _vercel file contains proper TXT records
 * @param {Object} octokit - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {string} filename - The _vercel file path
 * @param {string} ref - The git reference to check (usually prHeadSha for new content)
 * @returns {Promise<Object>} - { isValid: boolean, error: string|null }
 */
async function validateVercelTxtRecord(octokit, context, filename, ref) {
    try {
        console.log(`🔍 Validating TXT records in _vercel file: ${filename}`);
        
        const { data: fileContent } = await octokit.rest.repos.getContent({
            owner: context.repo.owner,
            repo: context.repo.repo,
            path: filename,
            ref: ref,
        });
        
        const content = Buffer.from(fileContent.content, 'base64').toString('utf8');
        let data;
        
        try {
            data = JSON.parse(content);
        } catch (e) {
            return {
                isValid: false,
                error: `Invalid JSON in _vercel file: ${e.message}`
            };
        }
        
        // Check if record field exists
        if (!data.record) {
            return {
                isValid: false,
                error: "_vercel files must contain a 'record' field with TXT record data."
            };
        }
        
        // Check if TXT record exists
        if (!data.record.TXT) {
            return {
                isValid: false,
                error: "_vercel files must contain a TXT record. Please add a 'TXT' field in the 'record' object."
            };
        }
        
        // Validate TXT record format
        const txtRecord = data.record.TXT;
        if (typeof txtRecord !== 'string' && !Array.isArray(txtRecord)) {
            return {
                isValid: false,
                error: "TXT record must be a string or array of strings."
            };
        }
        
        // If it's an array, validate each entry
        if (Array.isArray(txtRecord)) {
            for (const record of txtRecord) {
                if (typeof record !== 'string') {
                    return {
                        isValid: false,
                        error: "All TXT record entries must be strings."
                    };
                }
            }
        }
        
        console.log('✅ _vercel file contains valid TXT record');
        return {
            isValid: true,
            error: null
        };
        
    } catch (error) {
        if (error.status === 404) {
            return {
                isValid: false,
                error: "Unable to retrieve _vercel file content."
            };
        }
        throw error;
    }
}

/**
 * Validates that a user owns the base domain for a _vercel subdomain operation
 * @param {Object} octokit - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {string} baseSubdomain - The base domain name (e.g., "example")
 * @param {string} prAuthor - The PR author's username
 * @param {string} ref - The git reference to check (usually prBaseSha)
 * @returns {Promise<Object>} - { isValid: boolean, owner: string|null, error: string|null }
 */
async function validateBaseOwnership(octokit, context, baseSubdomain, prAuthor, ref) {
    const baseDomainFile = `domains/${baseSubdomain}.json`;
    
    try {
        console.log(`🔍 Checking if base domain file exists: ${baseDomainFile}`);
        
        const { data: baseDomainContent } = await octokit.rest.repos.getContent({
            owner: context.repo.owner,
            repo: context.repo.repo,
            path: baseDomainFile,
            ref: ref,
        });
        
        const baseContent = Buffer.from(baseDomainContent.content, 'base64').toString('utf8');
        const baseData = JSON.parse(baseContent);
        const baseOwner = baseData?.owner?.github?.toLowerCase();
        
        console.log(`✅ Base domain owner: ${baseOwner}, PR author: ${prAuthor}`);
        
        if (baseOwner !== prAuthor.toLowerCase()) {
            return {
                isValid: false,
                owner: baseOwner,
                error: `You can only manage _vercel TXT record files for domains you own. The base domain '${baseSubdomain}' belongs to '${baseOwner}'.`
            };
        }
        
        return {
            isValid: true,
            owner: baseOwner,
            error: null
        };
        
    } catch (error) {
        if (error.status === 404) {
            return {
                isValid: false,
                owner: null,
                error: `You can only manage _vercel TXT record files for existing domains. The base domain '${baseSubdomain}.json' does not exist.`
            };
        }
        throw error;
    }
}

/**
 * Validates _vercel subdomain file addition
 * @param {Object} octokit - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {string} filename - The file being added
 * @param {string} prAuthor - The PR author's username
 * @param {string} prBaseSha - The base branch SHA
 * @param {string} prHeadSha - The PR head SHA (for checking new file content)
 * @returns {Promise<Object>} - { isValid: boolean, message: string }
 */
async function validateVercelAddition(octokit, context, filename, prAuthor, prBaseSha, prHeadSha) {
    const baseSubdomain = getBaseSubdomain(filename);
    if (!baseSubdomain) {
        return { isValid: false, message: "Invalid _vercel subdomain filename" };
    }
    
    // First validate base domain ownership
    const ownershipValidation = await validateBaseOwnership(octokit, context, baseSubdomain, prAuthor, prBaseSha);
    
    if (!ownershipValidation.isValid) {
        return { isValid: false, message: ownershipValidation.error };
    }
    
    // Then validate TXT record content
    const txtValidation = await validateVercelTxtRecord(octokit, context, filename, prHeadSha);
    
    if (!txtValidation.isValid) {
        return { isValid: false, message: txtValidation.error };
    }
    
    console.log('✅ Vercel TXT record subdomain authorization passed');
    return { isValid: true, message: "Vercel subdomain addition authorized (ownership and TXT record verified)" };
}

/**
 * Validates _vercel subdomain file deletion
 * @param {Object} octokit - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {string} filename - The file being deleted
 * @param {string} prAuthor - The PR author's username
 * @param {string} prBaseSha - The base branch SHA
 * @returns {Promise<Object>} - { isValid: boolean, message: string }
 */
async function validateVercelDeletion(octokit, context, filename, prAuthor, prBaseSha) {
    const baseSubdomain = getBaseSubdomain(filename);
    if (!baseSubdomain) {
        return { isValid: false, message: "Invalid _vercel subdomain filename" };
    }
    
    const validation = await validateBaseOwnership(octokit, context, baseSubdomain, prAuthor, prBaseSha);
    
    if (!validation.isValid) {
        // Special case: if base domain doesn't exist, allow deletion for cleanup
        if (validation.owner === null) {
            console.log('⚠️ Base domain not found, allowing _vercel TXT record deletion for cleanup');
            return { isValid: true, message: "Vercel TXT record deletion authorized (cleanup)" };
        }
        return { isValid: false, message: validation.error };
    }
    
    console.log('✅ Vercel TXT record deletion authorized');
    return { isValid: true, message: "Vercel TXT record deletion authorized" };
}

/**
 * Validates _vercel subdomain file modification
 * @param {Object} octokit - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {string} filename - The file being modified
 * @param {string} prAuthor - The PR author's username
 * @param {string} prBaseSha - The base branch SHA
 * @param {string} prHeadSha - The PR head SHA (for checking modified file content)
 * @returns {Promise<Object>} - { isValid: boolean, message: string }
 */
async function validateVercelModification(octokit, context, filename, prAuthor, prBaseSha, prHeadSha) {
    const baseSubdomain = getBaseSubdomain(filename);
    if (!baseSubdomain) {
        return { isValid: false, message: "Invalid _vercel subdomain filename" };
    }
    
    // First validate base domain ownership
    const ownershipValidation = await validateBaseOwnership(octokit, context, baseSubdomain, prAuthor, prBaseSha);
    
    if (!ownershipValidation.isValid) {
        return { isValid: false, message: ownershipValidation.error };
    }
    
    // Then validate TXT record content in the modified file
    const txtValidation = await validateVercelTxtRecord(octokit, context, filename, prHeadSha);
    
    if (!txtValidation.isValid) {
        return { isValid: false, message: txtValidation.error };
    }
    
    console.log('✅ Vercel TXT record modification authorized');
    return { isValid: true, message: "Vercel TXT record modification authorized" };
}

/**
 * Validates _vercel subdomain file rename operation
 * @param {Object} octokit - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {string} oldFilename - The old filename
 * @param {string} newFilename - The new filename
 * @param {string} prAuthor - The PR author's username
 * @param {string} prBaseSha - The base branch SHA
 * @returns {Promise<Object>} - { isValid: boolean, message: string }
 */
async function validateVercelRename(octokit, context, oldFilename, newFilename, prAuthor, prBaseSha) {
    const oldIsVercel = isVercelSubdomain(oldFilename);
    const newIsVercel = isVercelSubdomain(newFilename);
    
    // Validate old file if it's a _vercel subdomain
    if (oldIsVercel) {
        const oldBaseSubdomain = getBaseSubdomain(oldFilename);
        const oldValidation = await validateBaseOwnership(octokit, context, oldBaseSubdomain, prAuthor, prBaseSha);
        
        if (!oldValidation.isValid) {
            return { 
                isValid: false, 
                message: oldValidation.error.replace('manage', 'rename')
            };
        }
    }
    
    // Validate new file if it's a _vercel subdomain
    if (newIsVercel) {
        const newBaseSubdomain = getBaseSubdomain(newFilename);
        const newValidation = await validateBaseOwnership(octokit, context, newBaseSubdomain, prAuthor, prBaseSha);
        
        if (!newValidation.isValid) {
            return { 
                isValid: false, 
                message: newValidation.error.replace('manage', 'rename to')
            };
        }
    }
    
    console.log('✅ Vercel TXT record rename authorized');
    return { isValid: true, message: "File rename authorized" };
}

module.exports = {
    isVercelSubdomain,
    getBaseSubdomain,
    validateBaseOwnership,
    validateVercelTxtRecord,
    validateVercelAddition,
    validateVercelDeletion,
    validateVercelModification,
    validateVercelRename
};
