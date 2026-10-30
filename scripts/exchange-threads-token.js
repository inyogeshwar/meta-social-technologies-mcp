/**
 * Threads 60-Day Token Exchange Helper
 * Based on Meta Threads API & Ashar Gentek's Guide
 * Author: Yogeshwar Kumar (https://github.com/inyogeshwar)
 *
 * Usage:
 *   node scripts/exchange-threads-token.js <SHORT_LIVED_TOKEN> <APP_SECRET>
 * Or set environment variables:
 *   THREADS_SHORT_TOKEN=... THREADS_APP_SECRET=... node scripts/exchange-threads-token.js
 */

const https = require('https');

const shortToken = process.argv[2] || process.env.THREADS_SHORT_TOKEN;
const appSecret = process.argv[3] || process.env.THREADS_APP_SECRET;

if (!shortToken || !appSecret) {
  console.log('========================================================');
  console.log('🔄 Threads API 60-Day Token Exchanger');
  console.log('========================================================\n');
  console.log('Exchanges a 1-hour short-lived token for a 60-day long-lived token.\n');
  console.log('Usage:');
  console.log('  node scripts/exchange-threads-token.js <SHORT_TOKEN> <APP_SECRET>\n');
  console.log('Example:');
  console.log('  node scripts/exchange-threads-token.js "THQW..." "your_app_secret"\n');
  process.exit(1);
}

const url = `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${encodeURIComponent(appSecret)}&access_token=${encodeURIComponent(shortToken)}`;

console.log('🔄 Exchanging short-lived token with Meta Threads API...');

https.get(url, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      if (data.error) {
        console.error('\n❌ Meta API Error:', data.error.message);
        process.exit(1);
      }
      console.log('\n========================================================');
      console.log('🎉 60-DAY LONG-LIVED THREADS TOKEN GENERATED!');
      console.log('========================================================');
      console.log('Token Type:', data.token_type || 'Bearer');
      console.log('Expires In:', Math.round((data.expires_in || 5184000) / 86400), 'days (approx 60 days)');
      console.log('\nYour 60-Day Access Token:');
      console.log(data.access_token);
      console.log('========================================================\n');
      console.log('💡 Next Step: Add this token as THREADS_ACCESS_TOKEN in your mcp_config.json');
    } catch (e) {
      console.error('\n❌ Failed to parse response:', body);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('\n❌ Network error:', err.message);
  process.exit(1);
});
