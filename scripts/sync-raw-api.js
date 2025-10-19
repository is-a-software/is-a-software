const fs = require('fs');
const path = require('path');

async function generateRawAPI() {
  const domainsDir = path.join(__dirname, '../domains');
  const outputFile = path.join(__dirname, '../domains.json');
  
  console.log('🔄 Generating raw API data...');
  
  const allDomains = [];
  
  try {
    // Read all domain files
    const files = fs.readdirSync(domainsDir);
    console.log(`📁 Found ${files.length} files in domains folder`);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(domainsDir, file);
          const domainData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const subdomain = file.replace('.json', '');
          
          // Skip system files (starting with _)
          if (subdomain.startsWith('_')) {
            console.log(`⏭️  Skipping system file: ${file}`);
            continue;
          }
          
          // Validate required fields
          if (!domainData.owner?.github || !domainData.record) {
            console.warn(`⚠️  Invalid data in ${file}: missing owner or record`);
            continue;
          }
          
          // Create API format
          const apiDomain = {
            domain: subdomain,
            owner: {
              github: domainData.owner.github
            },
            record: domainData.record
          };
          
          // Add proxy field only if it exists and is true
          if (domainData.proxy === true) {
            apiDomain.proxy = true;
          }
          
          allDomains.push(apiDomain);
          console.log(`✅ Processed: ${subdomain}.is-a.software (${domainData.owner.github})`);
          
        } catch (error) {
          console.error(`❌ Error processing ${file}:`, error.message);
        }
      }
    }
    
    // Sort domains alphabetically by domain name
    allDomains.sort((a, b) => a.domain.localeCompare(b.domain));
    
    // Write to output file
    fs.writeFileSync(outputFile, JSON.stringify(allDomains, null, 2));
    
    console.log('\n📊 Generation Summary:');
    console.log(`   Total domains processed: ${allDomains.length}`);
    console.log(`   Output file: domains.json`);
    console.log(`   File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
    
    // Show statistics
    const ownerStats = {};
    const recordTypes = {};
    
    allDomains.forEach(domain => {
      // Count by owner
      ownerStats[domain.owner.github] = (ownerStats[domain.owner.github] || 0) + 1;
      
      // Count by record type
      const recordType = Object.keys(domain.record)[0];
      recordTypes[recordType] = (recordTypes[recordType] || 0) + 1;
    });
    
    console.log('\n📈 Statistics:');
    console.log(`   Unique owners: ${Object.keys(ownerStats).length}`);
    console.log(`   Record types: ${Object.entries(recordTypes).map(([type, count]) => `${type}(${count})`).join(', ')}`);
    console.log(`   Top contributors: ${Object.entries(ownerStats).sort(([,a], [,b]) => b - a).slice(0, 3).map(([owner, count]) => `${owner}(${count})`).join(', ')}`);
    
    console.log('\n✅ Raw API data generated successfully!');
    
  } catch (error) {
    console.error('❌ Failed to generate API data:', error);
    process.exit(1);
  }
}

// Run the generator
generateRawAPI();