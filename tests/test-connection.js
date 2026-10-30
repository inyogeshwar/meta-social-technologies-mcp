/**
 * Test Suite: Meta Graph API Connection Check
 * Author: Yogeshwar Kumar (https://github.com/inyogeshwar)
 */

const https = require('https');
const path = require('path');
require('fs');

const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;
const INSTAGRAM_ID = process.env.INSTAGRAM_ID;

if (!TOKEN || !PAGE_ID || !INSTAGRAM_ID) {
  console.error('❌ Error: Missing required environment variables.');
  console.error('Please set FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID, and INSTAGRAM_ID in your environment or .env before running tests.');
  console.error('Example:');
  console.error('  export FB_PAGE_ACCESS_TOKEN="your_token"');
  console.error('  export FB_PAGE_ID="your_page_id"');
  console.error('  export INSTAGRAM_ID="your_instagram_id"');
  process.exit(1);
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('====================================================');
  console.log('🚀 META SOCIAL TECHNOLOGIES: CONNECTION TEST');
  console.log('   Author: Yogeshwar Kumar (https://github.com/inyogeshwar)');
  console.log('====================================================\n');

  try {
    console.log(`📡 1. Checking Facebook Page (ID: ${PAGE_ID})...`);
    const pageUrl = `https://graph.facebook.com/v26.0/${PAGE_ID}?fields=id,name,fan_count,category,link&access_token=${TOKEN}`;
    const pageData = await get(pageUrl);
    if (pageData.error) throw new Error(pageData.error.message);
    console.log(`   ✅ Connected to Page: "${pageData.name}" (${pageData.category})`);
    console.log(`   🔗 Link: ${pageData.link || 'N/A'}\n`);

    console.log(`📸 2. Checking Instagram Account (ID: ${INSTAGRAM_ID})...`);
    const igUrl = `https://graph.facebook.com/v26.0/${INSTAGRAM_ID}?fields=id,username,name,biography,followers_count,media_count&access_token=${TOKEN}`;
    const igData = await get(igUrl);
    if (igData.error) throw new Error(igData.error.message);
    console.log(`   ✅ Connected to Instagram: @${igData.username} ("${igData.name}")`);
    console.log(`   👥 Followers: ${igData.followers_count} | Media Count: ${igData.media_count}`);
    console.log(`   📝 Bio: "${igData.biography || ''}"\n`);

    console.log('====================================================');
    console.log('🎉 ALL CONNECTIONS VERIFIED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    process.exit(1);
  }
}

run();
