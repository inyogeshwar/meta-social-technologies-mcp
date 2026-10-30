/**
 * Test Suite: Direct Messaging (Text, Voice Note M4A, Reusable Attachment)
 * Author: Yogeshwar Kumar (https://github.com/inyogeshwar)
 */

const https = require('https');

const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;
const RECIPIENT_ID = process.env.TEST_RECIPIENT_ID;

if (!TOKEN || !PAGE_ID || !RECIPIENT_ID) {
  console.error('❌ Error: Missing required environment variables.');
  console.error('Please set FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID, and TEST_RECIPIENT_ID before running messaging tests.');
  process.exit(1);
}

function post(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      method: 'POST',
      hostname: 'graph.facebook.com',
      path: `/v26.0${endpoint}?access_token=${TOKEN}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else reject(new Error(parsed.error ? parsed.error.message : body));
        } catch (e) {
          reject(new Error(`Failed to parse: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('====================================================');
  console.log('🚀 DIRECT MESSAGING & AUDIO VOICE NOTE TEST');
  console.log(`   Recipient IGSID: ${RECIPIENT_ID}`);
  console.log('====================================================\n');

  try {
    // 1. Text DM
    console.log('💬 1. Sending Text DM...');
    const textRes = await post(`/${PAGE_ID}/messages`, {
      recipient: { id: RECIPIENT_ID },
      message: { text: 'Automated test suite message from MCP Server!' }
    });
    console.log(`   ✅ Text DM delivered! Message ID: ${textRes.message_id}\n`);

    // 2. Audio Voice Note (M4A)
    console.log('🎙️ 2. Sending Audio Voice Note (.m4a)...');
    const audioRes = await post(`/${PAGE_ID}/messages`, {
      recipient: { id: RECIPIENT_ID },
      message: {
        attachment: {
          type: 'audio',
          payload: {
            url: 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.m4a',
            is_reusable: true
          }
        }
      }
    });
    console.log(`   ✅ Audio Voice Note delivered! Message ID: ${audioRes.message_id}`);
    console.log(`   📎 Registered Attachment ID: ${audioRes.attachment_id || 'N/A'}\n`);

    console.log('====================================================');
    console.log('🎉 DIRECT MESSAGING TEST PASSED!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Messaging test failed:', err.message);
    process.exit(1);
  }
}

run();
