# Setup Guide: Antigravity, Claude Desktop & VS Code

Author: **Yogeshwar Kumar** ([GitHub: @inyogeshwar](https://github.com/inyogeshwar))

---

## 1. Antigravity IDE Integration

1. Open your Antigravity MCP configuration:
   `~/.gemini/config/mcp_config.json` (Windows: `%USERPROFILE%\.gemini\config\mcp_config.json`)
2. Add or update the `meta_social_technologies` server entry:
   ```json
   {
     "mcpServers": {
       "meta_social_technologies": {
         "command": "node",
         "args": [
           "D:\\meta-social-technologies-mcp\\server.js"
         ],
         "env": {
           "FB_PAGE_ACCESS_TOKEN": "YOUR_PERMANENT_PAGE_ACCESS_TOKEN",
           "FB_PAGE_ID": "YOUR_FACEBOOK_PAGE_ID",
           "INSTAGRAM_ID": "YOUR_INSTAGRAM_ACCOUNT_ID"
         }
       }
     }
   }
   ```
3. Restart Antigravity or refresh the MCP tools. All 27+ tools will become available in pair programming chat.

---

## 2. Claude Desktop Integration

1. Open `%APPDATA%\Claude\claude_desktop_config.json`.
2. Add the configuration:
   ```json
   {
     "mcpServers": {
       "meta-social": {
         "command": "node",
         "args": [
           "D:\\meta-social-technologies-mcp\\server.js"
         ],
         "env": {
           "FB_PAGE_ACCESS_TOKEN": "YOUR_PERMANENT_PAGE_ACCESS_TOKEN",
           "FB_PAGE_ID": "YOUR_FACEBOOK_PAGE_ID",
           "INSTAGRAM_ID": "YOUR_INSTAGRAM_ACCOUNT_ID"
         }
       }
     }
   }
   ```
3. Restart Claude Desktop.

---

## 3. Running Test Suites

From the repository root `D:\meta-social-technologies-mcp`:
```bash
# Verify Facebook Page & Instagram connectivity
npm test

# Test Text DM and Audio Voice Note delivery
npm run test:messaging

# Test Double-Tap Heart reaction & Threaded Quoted reply
npm run test:reactions
```
