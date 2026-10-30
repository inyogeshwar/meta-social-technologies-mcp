# Universal Setup Guide (Windows, macOS & Linux)

Author: **Yogeshwar Kumar** ([GitHub: @inyogeshwar](https://github.com/inyogeshwar))  
Repository: [meta-social-technologies-mcp](https://github.com/inyogeshwar/meta-social-technologies-mcp)

This guide explains the simplest way for **anyone** to set up this MCP server and Skill on their PC (Windows), Mac (macOS), or Linux machine.

---

## ⚡ Method 1: One-Click Automatic Setup (Recommended for Everyone)

We provide an interactive setup script that automatically detects your operating system, configures your MCP settings, and installs the skill.

### 1. Prerequisites
- **Node.js** (v18 or higher): Download from [nodejs.org](https://nodejs.org/).
- **Git**: Download from [git-scm.com](https://git-scm.com/).

### 2. Clone the Repository
Open your terminal (Command Prompt / PowerShell on Windows, Terminal on Mac/Linux):
```bash
git clone https://github.com/inyogeshwar/meta-social-technologies-mcp.git
cd meta-social-technologies-mcp
```

### 3. Run the Setup Wizard
```bash
npm run setup
```
The wizard will prompt you:
1. Enter your Meta Page Access Token
2. Enter your Facebook Page ID
3. Enter your Instagram Account ID
4. (Optional) Enter Threads Token & Threads ID

**What the script automatically does:**
- Detects your exact OS (Windows, Mac, or Linux).
- Automatically writes your `mcp_config.json` with the proper file paths.
- Automatically installs the global Antigravity Skill.
- Creates a local `.env` file (kept private by `.gitignore`) for running tests.

---

## 🛠️ Method 2: Manual Setup by Operating System

If you prefer to configure manually or use Claude Desktop / Cursor:

### 1. Google Antigravity Configuration Paths

| Operating System | Config File Location |
| :--- | :--- |
| **Windows** | `%USERPROFILE%\.gemini\config\mcp_config.json` *(e.g. `C:\Users\YourName\.gemini\config\mcp_config.json`)* |
| **macOS** | `~/.gemini/config/mcp_config.json` *(e.g. `/Users/YourName/.gemini/config/mcp_config.json`)* |
| **Linux** | `~/.gemini/config/mcp_config.json` *(e.g. `/home/YourName/.gemini/config/mcp_config.json`)* |

#### JSON Configuration Snippet:

**On Windows:**
```json
{
  "mcpServers": {
    "meta_social_technologies": {
      "command": "node",
      "args": [
        "C:\\path\\to\\meta-social-technologies-mcp\\server.js"
      ],
      "env": {
        "FB_PAGE_ACCESS_TOKEN": "YOUR_PERMANENT_PAGE_ACCESS_TOKEN",
        "FB_PAGE_ID": "YOUR_PAGE_ID",
        "INSTAGRAM_ID": "YOUR_INSTAGRAM_ACCOUNT_ID"
      }
    }
  }
}
```

**On macOS / Linux:**
```json
{
  "mcpServers": {
    "meta_social_technologies": {
      "command": "node",
      "args": [
        "/Users/YourName/meta-social-technologies-mcp/server.js"
      ],
      "env": {
        "FB_PAGE_ACCESS_TOKEN": "YOUR_PERMANENT_PAGE_ACCESS_TOKEN",
        "FB_PAGE_ID": "YOUR_PAGE_ID",
        "INSTAGRAM_ID": "YOUR_INSTAGRAM_ACCOUNT_ID"
      }
    }
  }
}
```

---

### 2. Installing the Antigravity Skill Manually

To enable the AI agent to understand comment growth funnels, voice notes, and double-tap heart reactions:

- **Windows**: Copy the folder `skills\meta-social-automation` to:
  `%USERPROFILE%\.gemini\config\skills\meta-social-automation\`
- **macOS / Linux**: Copy the folder `skills/meta-social-automation` to:
  `~/.gemini/config/skills/meta-social-automation/`

Or run this one-line command:
- **Windows (PowerShell)**:
  ```powershell
  New-Item -ItemType Directory -Force "$HOME\.gemini\config\skills\meta-social-automation"; Copy-Item "skills\meta-social-automation\SKILL.md" "$HOME\.gemini\config\skills\meta-social-automation\SKILL.md"
  ```
- **macOS / Linux (Bash/Zsh)**:
  ```bash
  mkdir -p ~/.gemini/config/skills/meta-social-automation && cp skills/meta-social-automation/SKILL.md ~/.gemini/config/skills/meta-social-automation/SKILL.md
  ```

---

### 3. Claude Desktop Configuration Paths

If using with Anthropic's Claude Desktop:

| Operating System | Claude Config Path |
| :--- | :--- |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

Add the same `mcpServers` block shown above and restart Claude Desktop.

---

## 🧪 Testing Your Installation

Verify connectivity on any operating system:
```bash
npm test
```
If you see `🎉 ALL CONNECTIONS VERIFIED SUCCESSFULLY!`, you are completely ready to use your AI agent for social media automation!
