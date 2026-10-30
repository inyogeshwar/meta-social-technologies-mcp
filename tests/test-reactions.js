/**
 * Test Suite: Message Reactions & Threaded Quoted Replies
 * Author: Yogeshwar Kumar (https://github.com/inyogeshwar)
 */

const https = require('https');

const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;
const RECIPIENT_ID = process.env.TEST_RECIPIENT_ID;

if (!TOKEN || !PAGE_ID || !RECIPIENT_ID) {
  console.error('❌ Error: Missing required environment variables.');
  console.error('Please set FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID, and TEST_RECIPIENT_ID before running reactions tests.');
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
  console.log('🚀 MESSAGE REACTIONS & QUOTED REPLIES TEST');
  console.log(`   Recipient IGSID: ${RECIPIENT_ID}`);
  console.log('====================================================\n');

  try {
    // 1. Send base message to react and quote to
    console.log('💬 1. Sending anchor message...');
    const anchorRes = await post(`/${PAGE_ID}/messages`, {
      recipient: { id: RECIPIENT_ID },
      message: { text: 'Anchor message for reaction & quoted reply test.' }
    });
    const targetMid = anchorRes.message_id;
    console.log(`   ✅ Anchor Message sent! Target MID: ${targetMid}\n`);

    // 2. React with Double-Tap Heart (❤️)
    console.log('❤️ 2. Reacting with Double-Tap Heart (❤️)...');
    const reactRes = await post(`/${PAGE_ID}/messages`, {
      recipient: { id: RECIPIENT_ID },
      sender_action: 'react',
      payload: {
        message_id: targetMid,
        reaction: '❤️'
      }
    });
    console.log(`   ✅ Heart reaction placed on message! Response:`, reactRes, '\n');

    // 3. Send Exact Threaded Quoted Reply (reply_to)
    console.log('💬 3. Sending Exact Quoted Reply (reply_to)...');
    const quoteRes = await post(`/${PAGE_ID}/messages`, {
      recipient: { id: RECIPIENT_ID },
      message: { text: 'Quoting anchor message successfully in test suite! 🎯' },
      reply_to: { mid: targetMid }
    });
    console.log(`   ✅ Quoted reply delivered! Message ID: ${quoteRes.message_id}\n`);

    console.log('====================================================');
    console.log('🎉 REACTIONS & QUOTE REPLIES VERIFIED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Reactions test failed:', err.message);
    process.exit(1);
  }
}

run();
