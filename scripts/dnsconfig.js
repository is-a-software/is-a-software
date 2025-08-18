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
    const localFilesDir = path.join(__dirname, '..', DOMAIN_FOLDER);
    const localFiles = fs.readdirSync(localFilesDir).filter(f => f.endsWith('.json'));

    if (localFiles.length === 0) {
        console.warn("Warning: The 'domains' directory is empty. Aborting sync to prevent accidental deletions.");
        return; 
    }

    for (const file of localFiles) {
        const subdomain = path.basename(file, '.json');
        const fullDomain = subdomain === "@" ? BASE_DOMAIN : `${subdomain}.${BASE_DOMAIN}`;
        
        const fileContent = fs.readFileSync(path.join(localFilesDir, file), 'utf8');
        const data = JSON.parse(fileContent);

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
    console.log(`Found ${desiredRecords.size} desired records in local files.`);

    console.log("Fetching existing DNS records from Cloudflare...");
    const existingRecordsData = await apiRequest('/dns_records');
    const existingRecords = new Map(existingRecordsData.result.map(r => [r.name, r]));
    console.log(`Found ${existingRecords.size} existing records on Cloudflare.`);

    for (const [fullName, recordData] of desiredRecords.entries()) {
        if (existingRecords.has(fullName)) {
            const existing = existingRecords.get(fullName);
            if (existing.type !== recordData.type || existing.content !== recordData.content || existing.proxied !== recordData.proxied) {
                console.log(`Updating record for ${fullName}...`);
                await apiRequest(`/dns_records/${existing.id}`, 'PUT', recordData);
            }
        } else {
            console.log(`Creating new record for ${fullName}...`);
            await apiRequest('/dns_records', 'POST', recordData);
        }
    }

    for (const [fullName, recordData] of existingRecords.entries()) {
        if (['A', 'AAAA', 'CNAME'].includes(recordData.type)) {
            if (!desiredRecords.has(fullName)) {
                console.log(`Deleting orphaned record for ${fullName}...`);
                await apiRequest(`/dns_records/${recordData.id}`, 'DELETE');
            }
        }
    }

    console.log("DNS sync process complete!");
}

main().catch(err => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
});
