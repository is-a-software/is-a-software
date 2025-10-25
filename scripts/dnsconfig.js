const fs = require('fs');
const path = require('path');

const CF_API_TOKEN = process.env.CLOUDFLARE_TOKEN;
const CF_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

const DOMAIN_FOLDER = "domains"; 
const BASE_DOMAIN = "is-a.software";
const API_BASE_URL = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}`;

async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = {
        "Authorization": `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json"
    };

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorText = await response.text();
        
        // Handle specific Cloudflare errors more gracefully
        if (response.status === 400 && (errorText.includes('81058') || errorText.toLowerCase().includes('identical record already exists'))) {
            console.log('⚠️  Record is already identical, skipping update...');
            return { success: true, message: 'Record already identical' };
        }
        
        throw new Error(`Cloudflare API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    if (method.toUpperCase() === 'DELETE') {
        return response.text();
    }
    return response.json();
}

async function main() {
    if (!CF_API_TOKEN || !CF_ZONE_ID) {
        console.error("Error: Cloudflare API token or Zone ID is not set in environment variables.");
        process.exit(1);
    }

    const desiredRecords = new Map();
    const vercelTxtRecords = new Map(); // Map to track _vercel TXT records by unique ID
    const localFilesDir = path.join(__dirname, '..', DOMAIN_FOLDER);
    const localFiles = fs.readdirSync(localFilesDir).filter(f => f.endsWith('.json'));

    if (localFiles.length === 0) {
        console.warn("Warning: The 'domains' directory is empty. Aborting sync to prevent accidental deletions.");
        return; 
    }

    for (const file of localFiles) {
        const subdomain = path.basename(file, '.json');
        
        const fileContent = fs.readFileSync(path.join(localFilesDir, file), 'utf8');
        const data = JSON.parse(fileContent);

        // Special handling for _vercel.* files - they create TXT records at _vercel subdomain
        if (subdomain.startsWith('_vercel.')) {
            const recordType = Object.keys(data.record)[0];
            if (recordType.toUpperCase() === 'TXT') {
                const vercelDomain = `_vercel.${BASE_DOMAIN}`;
                const content = Array.isArray(data.record[recordType]) ? data.record[recordType][0] : data.record[recordType];
                
                // Use filename as unique identifier for each _vercel TXT record
                const uniqueKey = `${vercelDomain}_${file}`;
                vercelTxtRecords.set(uniqueKey, {
                    type: 'TXT',
                    name: vercelDomain,
                    content: content,
                    proxied: false, // TXT records are never proxied
                    ttl: 1,
                    sourceFile: file // Track source file for logging
                });
            }
            continue; // Skip adding to regular desiredRecords
        }

        // Handle regular domains
        const fullDomain = subdomain === "@" ? BASE_DOMAIN : `${subdomain}.${BASE_DOMAIN}`;
        
        const recordType = Object.keys(data.record)[0];
        const content = Array.isArray(data.record[recordType]) ? data.record[recordType][0] : data.record[recordType];

        desiredRecords.set(fullDomain, {
            type: recordType.toUpperCase(),
            name: fullDomain,
            content: content,
            proxied: data.proxy === true,
            ttl: 1 
        });
    }

    // Add all _vercel TXT records to desired records
    for (const [key, record] of vercelTxtRecords) {
        desiredRecords.set(key, record);
    }
    console.log(`Found ${desiredRecords.size} desired records in local files.`);

    console.log("Fetching existing DNS records from Cloudflare...");
    const existingRecordsData = await apiRequest('/dns_records');
    const existingRecords = existingRecordsData.result;
    console.log(`Found ${existingRecords.length} existing records on Cloudflare.`);

    // Group existing records by domain name and type for easier comparison
    const existingByDomain = new Map();
    for (const record of existingRecords) {
        const key = `${record.name}_${record.type}`;
        if (!existingByDomain.has(key)) {
            existingByDomain.set(key, []);
        }
        existingByDomain.get(key).push(record);
    }

    // Create/Update desired records
    for (const [uniqueKey, recordData] of desiredRecords.entries()) {
        const domainTypeKey = `${recordData.name}_${recordData.type}`;
        const existingForDomain = existingByDomain.get(domainTypeKey) || [];
        
        // For _vercel TXT records, find matching record by content
        if (recordData.name === `_vercel.${BASE_DOMAIN}` && recordData.type === 'TXT') {
            const existingMatch = existingForDomain.find(r => r.content === recordData.content);
            
            if (existingMatch) {
                // Check if update is needed (compare all relevant fields)
                const existingTTL = existingMatch.ttl;
                const desiredTTL = recordData.ttl;
                
                const needsUpdate = 
                    existingMatch.proxied !== recordData.proxied || 
                    (existingTTL !== desiredTTL && !(existingTTL === 1 && desiredTTL === 1));
                
                if (needsUpdate) {
                    console.log(`Updating _vercel TXT record from ${recordData.sourceFile}:`);
                    console.log(`  Proxied: ${existingMatch.proxied} -> ${recordData.proxied} ${existingMatch.proxied !== recordData.proxied ? '(CHANGED)' : '(SAME)'}`);
                    console.log(`  TTL: ${existingTTL} -> ${desiredTTL} ${existingTTL !== desiredTTL ? '(CHANGED)' : '(SAME)'}`);
                    
                    try {
                        await apiRequest(`/dns_records/${existingMatch.id}`, 'PUT', recordData);
                        console.log(`✓ Successfully updated _vercel TXT record`);
                    } catch (error) {
                        console.log(`⚠️  Failed to update _vercel TXT record: ${error.message}`);
                    }
                } else {
                    console.log(`✓ _vercel TXT record from ${recordData.sourceFile} is already up to date`);
                }
            } else {
                console.log(`Creating new _vercel TXT record from ${recordData.sourceFile}...`);
                try {
                    await apiRequest('/dns_records', 'POST', recordData);
                    console.log(`✓ Successfully created _vercel TXT record`);
                } catch (error) {
                    console.log(`⚠️  Failed to create _vercel TXT record: ${error.message}`);
                }
            }
        } else {
            // Handle regular single records (A, AAAA, CNAME, etc.)
            const existing = existingForDomain[0]; // Should only be one for these types
            
            if (existing) {
                // Check if update is needed (compare all relevant fields)
                // Note: Cloudflare might return ttl: 1 but we also set ttl: 1, so normalize comparison
                const existingTTL = existing.ttl;
                const desiredTTL = recordData.ttl;
                
                const needsUpdate = 
                    existing.content !== recordData.content || 
                    existing.proxied !== recordData.proxied ||
                    (existingTTL !== desiredTTL && !(existingTTL === 1 && desiredTTL === 1));
                
                if (needsUpdate) {
                    console.log(`Updating record for ${recordData.name}:`);
                    console.log(`  Content: "${existing.content}" -> "${recordData.content}" ${existing.content !== recordData.content ? '(CHANGED)' : '(SAME)'}`);
                    console.log(`  Proxied: ${existing.proxied} -> ${recordData.proxied} ${existing.proxied !== recordData.proxied ? '(CHANGED)' : '(SAME)'}`);
                    console.log(`  TTL: ${existingTTL} -> ${desiredTTL} ${existingTTL !== desiredTTL ? '(CHANGED)' : '(SAME)'}`);
                    
                    try {
                        await apiRequest(`/dns_records/${existing.id}`, 'PUT', recordData);
                        console.log(`✓ Successfully updated record for ${recordData.name}`);
                    } catch (error) {
                        console.log(`⚠️  Failed to update record for ${recordData.name}: ${error.message}`);
                    }
                } else {
                    console.log(`✓ Record for ${recordData.name} is already up to date`);
                }
            } else {
                console.log(`Creating new record for ${recordData.name}...`);
                try {
                    await apiRequest('/dns_records', 'POST', recordData);
                    console.log(`✓ Successfully created record for ${recordData.name}`);
                } catch (error) {
                    console.log(`⚠️  Failed to create record for ${recordData.name}: ${error.message}`);
                }
            }
        }
    }

    // Collect all desired TXT record contents for _vercel subdomain
    const desiredVercelContents = new Set();
    for (const [uniqueKey, recordData] of desiredRecords.entries()) {
        if (recordData.name === `_vercel.${BASE_DOMAIN}` && recordData.type === 'TXT') {
            desiredVercelContents.add(recordData.content);
        }
    }

    // Delete orphaned records
    for (const record of existingRecords) {
        const shouldKeep = (() => {
            // Keep TXT records that might be system-managed
            if (record.type === 'TXT' && record.name !== `_vercel.${BASE_DOMAIN}`) {
                return true;
            }
            
            // For _vercel TXT records, only keep if they match desired content
            if (record.name === `_vercel.${BASE_DOMAIN}` && record.type === 'TXT') {
                return desiredVercelContents.has(record.content);
            }
            
            // For other record types (A, AAAA, CNAME), check if we have a desired record for this domain
            if (['A', 'AAAA', 'CNAME'].includes(record.type)) {
                for (const [uniqueKey, recordData] of desiredRecords.entries()) {
                    if (recordData.name === record.name && recordData.type === record.type) {
                        return true;
                    }
                }
                return false;
            }
            
            return true; // Keep other record types
        })();

        if (!shouldKeep) {
            console.log(`Deleting orphaned record for ${record.name} (${record.type}: ${record.content})...`);
            await apiRequest(`/dns_records/${record.id}`, 'DELETE');
        }
    }

    console.log("DNS sync process complete!");
}

main().catch(err => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
});
