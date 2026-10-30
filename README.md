# Meta Social Technologies MCP Server & Automation Suite

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/Model_Context_Protocol-1.0-blue.svg)](https://modelcontextprotocol.io/)
[![Meta Graph API](https://img.shields.io/badge/Meta_Graph_API-v26.0-0668E1.svg)](https://developers.facebook.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Created_by-Yogeshwar_Kumar-orange.svg)](https://github.com/inyogeshwar)

> An enterprise-grade **Model Context Protocol (MCP)** server and AI automation engine for **Facebook Pages**, **Instagram Business/Creator accounts**, and **Threads**.
> Build ManyChat & Superprofile-style comment funnels, send audio voice notes, trigger double-tap heart reactions, execute threaded quoted replies, and publish content seamlessly using AI agents.

---

## 👨‍💻 Author & Attribution

- **Developer**: Yogeshwar Kumar
- **GitHub**: [@inyogeshwar](https://github.com/inyogeshwar)
- **YouTube Guide**: [Integrate FB Page + Instagram (Lifetime Permanent Access Token)](https://www.youtube.com/watch?v=CzsbItgqRlg)
- **Target Platforms**: Facebook Pages, Instagram Professional Accounts, and Threads Profiles

---

## ⚡ Core Features

- 📢 **Publishing**: Facebook status updates, photo posts, Instagram photos, and Instagram Reels (MP4).
- 💬 **Direct Messaging**: Deliver text, images, PDF files, and audio voice notes (`.m4a`, `.wav`, `.aac`).
- 🎙️ **Voice Notes & Audio**: Strict adherence to Meta container specifications with zero-reupload via `upload_reusable_attachment`.
- ❤️ **Message Reactions**: Trigger double-tap heart (`❤️`), fire (`🔥`), thumbs-up (`👍`), or remove reactions on any message ID.
- 🎯 **Threaded Quoted Replies**: Quote specific messages in Instagram DMs using `reply_to` message ID.
- 🎁 **Follow-to-Unlock Growth Funnel**: Automated ManyChat-style funnel that checks follower status before unlocking exclusive download links.
- ⚡ **Interactive Templates**: Quick reply pills, button action cards, and horizontal scrollable generic carousels.
- 🛠️ **Chat Moderation**: Ice Breakers FAQ configuration, Persistent composer menu, and `ig.me` tracking link generator.
- 📊 **Analytics**: Real-time account and media-level reach, saves, and interaction insights.

---

## 🏗️ Architecture

```text
┌────────────────────────────────────────────────────────┐
│              AI Agent (Google Antigravity / Claude)    │
└───────────────────────────┬────────────────────────────┘
                            │ (JSON-RPC over Stdio)
┌───────────────────────────▼────────────────────────────┐
│         meta-social-technologies-mcp Server            │
│                     (server.js)                        │
└───────────────────────────┬────────────────────────────┘
                            │ (HTTPS REST v26.0 & Threads v1.0)
┌───────────────────────────▼────────────────────────────┐
│                    Meta Graph API                      │
│      ┌────────────────────┼────────────────────┐       │
│      ▼                    ▼                    ▼       │
│  Facebook Page        Instagram             Threads    │
└────────────────────────────────────────────────────────┘
```

---

## 🧰 Complete Tool Catalog (32 Tools across Facebook, Instagram & Threads)

| Category | Tool Name | Description |
| :--- | :--- | :--- |
| **Profile** | `get_page_profile` | Profile details and fan count for Facebook Page. |
| | `get_instagram_profile` | Bio, follower count, and media stats for your account. |
| | `get_user_profile` | Look up username, profile photo, and follower status of any chatter. |
| **Publishing** | `publish_facebook_post` | Publish text status and links to Facebook Page. |
| | `publish_facebook_photo` | Post photo with caption to Facebook Page. |
| | `publish_instagram_photo` | Post image with caption and hashtags to Instagram. |
| | `publish_instagram_reel` | Post video reels with caption to Instagram feed. |
| | `get_facebook_posts` | Fetch recent Facebook posts. |
| | `get_instagram_media` | Fetch recent Instagram media posts and reels. |
| **Comments** | `get_media_comments` | Read comments on a specific post or reel. |
| | `reply_to_comment` | Post a public reply to any comment. |
| | `like_comment` | Like a comment on behalf of your account. |
| **Direct DMs** | `send_instagram_dm` | Send text, PDF, image, or M4A/WAV audio. Supports `reply_to_message_id`. |
| | `send_instagram_private_reply`| Send a private DM in response to a user's comment. |
| | `react_to_message` | Double-tap heart (`❤️`) or emoji reaction to a specific message ID. |
| **Funnel** | `check_user_follows_account` | Check if a chatter follows your account. |
| | `run_instagram_comment_growth_funnel` | Complete ManyChat-style keyword auto-reply & follow-gated DM delivery. |
| **Interactive** | `send_sender_action` | Trigger `typing_on`, `typing_off`, or `mark_seen`. |
| | `send_quick_replies` | Interactive pill buttons (up to 13 buttons). |
| | `send_button_template` | Structured text with up to 3 action buttons. |
| | `send_generic_template` | Scrollable carousel cards with images and links. |
| | `send_human_agent_message` | Send messages outside the 24-hr window up to 7 days (`HUMAN_AGENT`). |
| | `upload_reusable_attachment`| Pre-upload media to get reusable `attachment_id`. |
| **Chat UX** | `get_conversations` | List active DM conversations and unread counts. |
| | `get_conversation_messages` | Read message history in a conversation thread. |
| | `manage_ice_breakers` | Get, set, or delete FAQs for new chatters. |
| | `manage_persistent_menu` | Configure permanent composer bottom menu. |
| | `generate_ig_me_link` | Generate `https://ig.me/m/your_username?ref=...` links. |
| **Analytics** | `get_instagram_account_insights`| Account reach, profile views, and impressions. |
| | `get_instagram_media_insights` | Reach, saves, and interaction metrics for posts. |
| **Threads API** | `get_threads_profile` | Bio, username, and stats for your Threads profile. |
| | `publish_threads_post` | Publish text (up to 500 chars), photos, or video threads. |
| | `get_threads_posts` | Fetch recent published threads and permalinks. |
| | `reply_to_threads_post` | Post automated replies to thread conversations. |
| | `get_threads_insights` | Pull views, likes, replies, and reposts metrics. |

---

## 🚀 Quickstart: Universal Setup (Windows, macOS & Linux)

### Option A: One-Click Interactive Setup Wizard (Easiest)
1. Clone the repository:
   ```bash
   git clone https://github.com/inyogeshwar/meta-social-technologies-mcp.git
   cd meta-social-technologies-mcp
   ```
2. Run the cross-platform setup script:
   ```bash
   npm run setup
   ```
3. Enter your Page Access Token and Page/Instagram IDs when prompted.
   *The script automatically detects your OS (Windows, Mac, or Linux), writes your `mcp_config.json`, and installs the Antigravity Skill!*

---

### Option B: Manual Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your credentials:
   ```env
   FB_PAGE_ACCESS_TOKEN=your_permanent_page_token
   FB_PAGE_ID=your_page_id
   INSTAGRAM_ID=your_instagram_id
   ```
3. Add to your Antigravity config:
   - **Windows**: `%USERPROFILE%\.gemini\config\mcp_config.json`
   - **macOS / Linux**: `~/.gemini/config/mcp_config.json`
   ```json
   {
     "mcpServers": {
       "meta_social_technologies": {
         "command": "node",
         "args": ["/absolute/path/to/meta-social-technologies-mcp/server.js"],
         "env": {
           "FB_PAGE_ACCESS_TOKEN": "YOUR_TOKEN",
           "FB_PAGE_ID": "YOUR_PAGE_ID",
           "INSTAGRAM_ID": "YOUR_INSTAGRAM_ID"
         }
       }
     }
   }
   ```
   *(For full OS-specific paths and Claude Desktop / Cursor instructions, see [docs/UNIVERSAL_SETUP_GUIDE.md](docs/UNIVERSAL_SETUP_GUIDE.md)).*

---

### 🧪 Test Your Installation
```bash
# Verify Page & Instagram connectivity
npm test

# Verify text DM & audio voice note delivery
npm run test:messaging

# Verify double-tap heart & quoted reply
npm run test:reactions
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE) © 2026 Yogeshwar Kumar.
