/**
 * Cross-Platform One-Click Setup Script (Windows, macOS, Linux)
 * Automatically configures Antigravity MCP & installs Skills
 * Author: Yogeshwar Kumar (https://github.com/inyogeshwar)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n========================================================');
  console.log('🚀 META SOCIAL TECHNOLOGIES MCP: ONE-CLICK SETUP');
  console.log('   Supports Windows, macOS & Linux');
  console.log('   Author: Yogeshwar Kumar (https://github.com/inyogeshwar)');
  console.log('========================================================\n');

  try {
    const token = (await question('🔑 1. Enter your Meta Page Access Token: ')).trim();
    if (!token) {
      console.error('❌ Token is required. Exiting.');
      process.exit(1);
    }

    const pageId = (await question('📄 2. Enter your Facebook Page ID: ')).trim();
    if (!pageId) {
      console.error('❌ Facebook Page ID is required. Exiting.');
      process.exit(1);
    }

    const igId = (await question('📸 3. Enter your Instagram Account ID: ')).trim();
    if (!igId) {
      console.error('❌ Instagram ID is required. Exiting.');
      process.exit(1);
    }

    const threadsToken = (await question('🧵 4. Enter Threads Access Token (Optional, press Enter to skip): ')).trim();
    const threadsUserId = (await question('🆔 5. Enter Threads Account ID (Optional, press Enter to skip): ')).trim();

    // 1. Detect configuration path across OS
    const homeDir = os.homedir();
    const geminiConfigDir = path.join(homeDir, '.gemini', 'config');
    const mcpConfigFile = path.join(geminiConfigDir, 'mcp_config.json');
    const serverPath = path.resolve(__dirname, '..', 'server.js');

    if (!fs.existsSync(geminiConfigDir)) {
      fs.mkdirSync(geminiConfigDir, { recursive: true });
    }

    // 2. Read or initialize mcp_config.json
    let mcpConfig = { mcpServers: {} };
    if (fs.existsSync(mcpConfigFile)) {
      try {
        mcpConfig = JSON.parse(fs.readFileSync(mcpConfigFile, 'utf8'));
        if (!mcpConfig.mcpServers) mcpConfig.mcpServers = {};
      } catch (e) {
        console.warn('⚠️ Could not parse existing mcp_config.json, creating clean config.');
      }
    }

    // 3. Configure meta_social_technologies server
    const envVars = {
      FB_PAGE_ACCESS_TOKEN: token,
      FB_PAGE_ID: pageId,
      INSTAGRAM_ID: igId
    };

    if (threadsToken) envVars.THREADS_ACCESS_TOKEN = threadsToken;
    if (threadsUserId) envVars.THREADS_USER_ID = threadsUserId;

    mcpConfig.mcpServers.meta_social_technologies = {
      command: 'node',
      args: [serverPath],
      env: envVars
    };

    fs.writeFileSync(mcpConfigFile, JSON.stringify(mcpConfig, null, 2), 'utf8');
    console.log(`\n✅ MCP Server configured in: ${mcpConfigFile}`);

    // 4. Install Antigravity Skill
    const skillSource = path.resolve(__dirname, '..', 'skills', 'meta-social-automation', 'SKILL.md');
    const skillTargetDir = path.join(geminiConfigDir, 'skills', 'meta-social-automation');
    const skillTargetFile = path.join(skillTargetDir, 'SKILL.md');

    if (fs.existsSync(skillSource)) {
      if (!fs.existsSync(skillTargetDir)) {
        fs.mkdirSync(skillTargetDir, { recursive: true });
      }
      fs.copyFileSync(skillSource, skillTargetFile);
      console.log(`✅ Global Skill installed in: ${skillTargetFile}`);
    }

    // 5. Generate local .env file (excluded by gitignore)
    const envFile = path.resolve(__dirname, '..', '.env');
    let envContent = `FB_PAGE_ACCESS_TOKEN=${token}\nFB_PAGE_ID=${pageId}\nINSTAGRAM_ID=${igId}\n`;
    if (threadsToken) envContent += `THREADS_ACCESS_TOKEN=${threadsToken}\n`;
    if (threadsUserId) envContent += `THREADS_USER_ID=${threadsUserId}\n`;

    fs.writeFileSync(envFile, envContent, 'utf8');
    console.log(`✅ Local .env generated for running tests`);

    console.log('\n========================================================');
    console.log('🎉 SETUP COMPLETE! YOUR MCP SERVER IS READY TO USE!');
    console.log('========================================================\n');
    console.log('Next Steps:');
    console.log('1. Restart Google Antigravity or refresh your MCP tools.');
    console.log('2. Run "npm test" to verify live connection.');
    console.log('3. Ask your AI: "Check my recent Instagram posts and comments"\n');

  } catch (err) {
    console.error('❌ Setup failed:', err.message);
  } finally {
    rl.close();
  }
}

main();
