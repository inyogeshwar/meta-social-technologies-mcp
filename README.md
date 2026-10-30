# Meta Social Technologies MCP Server & Automation Suite v4.0

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/Model_Context_Protocol-1.0-blue.svg)](https://modelcontextprotocol.io/)
[![Meta Graph API](https://img.shields.io/badge/Meta_Graph_API-v26.0-0668E1.svg)](https://developers.facebook.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Created_by-Yogeshwar_Kumar-orange.svg)](https://github.com/inyogeshwar)

> An enterprise-grade **Model Context Protocol (MCP)** server and AI automation suite for **Facebook Pages**, **Instagram Business/Creator accounts**, and **Threads**.
> Build ManyChat & Superprofile-style comment funnels, send audio voice notes (`.m4a`), trigger double-tap reactions (`❤️`), execute threaded quoted replies, publish carousels, discover competitor accounts, track hashtags, and troubleshoot errors using official Meta specifications.

---

## 👨‍💻 Author & Attribution

- **Developer**: Yogeshwar Kumar
- **GitHub**: [@inyogeshwar](https://github.com/inyogeshwar)
- **Target Platforms**: Facebook Pages, Instagram Professional Accounts, and Threads Profiles
- **Official Docs Mirror**: Complete offline archive of 70 official Meta Markdown guides located in [`docs/meta-api-reference/`](./docs/meta-api-reference/)

---

## ⚡ Core Capabilities (45 Enterprise Tools)

1. 🔍 **Business Discovery & Intelligence**:
   - `discover_business_profile`: Search any public creator/brand to inspect followers, bio, media count, website, and top posts.
   - `search_instagram_hashtag`: Lookup static hashtag IDs from Meta's database.
   - `get_hashtag_top_media` & `get_hashtag_recent_media`: Fetch top-performing or recent reels/posts for any hashtag.
   - `get_content_publishing_limit`: Check rolling 24-hour rate limit quota usage (50 posts limit).
2. 📢 **Publishing & Media Production**:
   - `publish_instagram_carousel`: Publish multi-image/video carousel albums (2 to 20 items) with optional `is_ai_generated` label.
   - `publish_instagram_reel`: Upload and publish MP4 video reels.
   - `publish_instagram_photo`: Post images with captions and hashtags.
   - `publish_facebook_post` & `publish_facebook_photo`: Post status and photos to Facebook Pages.
   - `get_instagram_stories`: Read active 24-hour stories.
   - `get_media_children`: Inspect individual items in carousel albums.
3. 💬 **Direct Messaging & Rich Media**:
   - `send_instagram_dm`: Deliver text, links, images, PDFs, and audio voice notes.
   - `react_to_message`: Send double-tap heart (`❤️`), flame (`🔥`), or thumbs-up reactions.
   - `send_sender_action`: Show `typing_on` indicator or `mark_seen`.
   - `send_quick_replies`: Send interactive pill buttons.
   - `send_button_template` & `send_generic_template`: Send card buttons and horizontal carousels.
   - `send_human_agent_message`: 7-day extended messaging window with `HUMAN_AGENT` tag.
   - `upload_reusable_attachment`: Upload media once to obtain reusable attachment ID.
4. 🛡️ **Comment Moderation & Funnels**:
   - `moderate_comment`: Hide, unhide, or delete comments on any post or reel.
   - `reply_to_comment` & `like_comment`: Publicly reply and auto-like comments.
   - `send_instagram_private_reply`: Privately DM a commenter.
   - `run_instagram_comment_growth_funnel`: End-to-end ManyChat/Superprofile-style Follow-to-Unlock automation.
5. 🧵 **Threads API Studio**:
   - `get_threads_profile`: Fetch profile info, bio, and picture.
   - `publish_threads_post`: Publish 500-char text, images, or video threads.
   - `get_threads_posts`: Inspect recent published threads.
   - `reply_to_threads_post`: Automated reply to thread discussions.
   - `get_threads_insights`: Real-time views, likes, replies, and repost analytics.
6. 🛠️ **Troubleshooting & Error Resolver**:
   - `get_error_code_info`: Official Meta explanation, cause, and exact fix for codes (100, 190, 2207004, 2207042, etc.).

---

## 🚀 Quick Setup

### 1. Configuration (`.env` or MCP Config)
```bash
FB_PAGE_ACCESS_TOKEN=your_facebook_page_access_token
FB_PAGE_ID=your_facebook_page_id
INSTAGRAM_ID=your_instagram_professional_account_id
INSTAGRAM_USERNAME=your_instagram_handle
THREADS_ACCESS_TOKEN=your_threads_access_token
THREADS_USER_ID=your_threads_user_id
```

### 2. Antigravity / Claude Desktop MCP Configuration
Add to your `mcp_config.json`:
```json
{
  "mcpServers": {
    "meta_social_technologies": {
      "command": "node",
      "args": ["D:\\meta-social-technologies-mcp\\server.js"],
      "env": {
        "FB_PAGE_ACCESS_TOKEN": "YOUR_FB_PAGE_ACCESS_TOKEN",
        "FB_PAGE_ID": "YOUR_FB_PAGE_ID",
        "INSTAGRAM_ID": "YOUR_INSTAGRAM_ID",
        "INSTAGRAM_USERNAME": "your_instagram_handle",
        "THREADS_ACCESS_TOKEN": "YOUR_THREADS_ACCESS_TOKEN",
        "THREADS_USER_ID": "YOUR_THREADS_USER_ID"
      }
    }
  }
}
```

---

## 📚 Official Meta Documentation Archive

The `docs/meta-api-reference/` directory contains an offline archive of all 70 official Meta Markdown guides:
- [Setup & Webhooks Guide](docs/meta-api-reference/instagram-platform/webhooks/setup.md)
- [Content Publishing & Resumable Uploads](docs/meta-api-reference/instagram-platform/content-publishing.md)
- [Business Discovery API Reference](docs/meta-api-reference/instagram-platform/instagram-graph-api/reference/ig-user/business_discovery.md)
- [Hashtag Search & Top Media](docs/meta-api-reference/instagram-platform/instagram-graph-api/reference/ig-hashtag/top-media.md)
- [Comment Moderation Guide](docs/meta-api-reference/instagram-platform/comment-moderation.md)
- [Meta Graph API Error Codes Guide](docs/meta-api-reference/instagram-platform/instagram-graph-api/reference/error-codes.md)

---

## 🔒 Security & Privacy Notice
This repository contains **zero hardcoded credentials**, tokens, or private IDs. All secrets are loaded dynamically via environment variables or encrypted databases.

Licensed under the MIT License. Built by Yogeshwar Kumar.
