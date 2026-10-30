# Meta Official Postman Instagram API Collection Guide

Author: **Yogeshwar Kumar** ([GitHub: @inyogeshwar](https://github.com/inyogeshwar))  
Reference Collection: [Meta Instagram API on Postman API Network (Collection 6yqw8pt)](https://www.postman.com/meta/instagram/collection/6yqw8pt/instagram-api)

---

## 1. Overview of Meta's Postman Collection

Meta maintains an official collection on the Postman API Network for testing the **Instagram Graph API**. It provides pre-configured HTTP requests for testing all features available to Instagram Business & Creator accounts.

---

## 2. Postman Collection Endpoints vs. MCP Server Tool Mappings

The table below demonstrates how every core endpoint in Meta's Postman collection maps directly to your local **`meta_social_technologies`** MCP server:

| Postman Folder & Request | HTTP Method & Endpoint | Corresponding MCP Server Tool |
| :--- | :--- | :--- |
| **Account & Profile** | `GET /{ig_user_id}?fields=...` | `get_instagram_profile` |
| **Media Publishing - Photo** | `POST /{ig_user_id}/media`<br>`POST /{ig_user_id}/media_publish` | `publish_instagram_photo` |
| **Media Publishing - Reels** | `POST /{ig_user_id}/media` (`media_type=REELS`)<br>`POST /{ig_user_id}/media_publish` | `publish_instagram_reel` |
| **Media Discovery** | `GET /{ig_user_id}/media` | `get_instagram_media` |
| **Comments - Fetch** | `GET /{media_id}/comments` | `get_media_comments` |
| **Comments - Reply** | `POST /{comment_id}/replies` | `reply_to_comment` |
| **Comments - Like** | `POST /{ig_user_id}/likes` | `like_comment` |
| **Messaging - Private Reply** | `POST /{page_id}/messages` (`recipient.comment_id`) | `send_instagram_private_reply` |
| **Messaging - Send Direct DM**| `POST /{page_id}/messages` (Text, Image, PDF) | `send_instagram_dm` |
| **Messaging - Audio / Voice** | `POST /{page_id}/messages` (`attachment.type=audio`) | `send_instagram_dm` (with M4A/WAV) |
| **Messaging - Reactions** | `POST /{page_id}/messages` (`sender_action=react`) | `react_to_message` |
| **Messaging - Quoted Replies**| `POST /{page_id}/messages` (`reply_to.mid`) | `send_instagram_dm` (`reply_to_message_id`) |
| **Messaging - Sender Actions**| `POST /{page_id}/messages` (`typing_on`, `mark_seen`) | `send_sender_action` |
| **Messaging - Quick Replies** | `POST /{page_id}/messages` (`quick_replies`) | `send_quick_replies` |
| **Messaging - Button Template**| `POST /{page_id}/messages` (`template_type=button`) | `send_button_template` |
| **Messaging - Generic Carousel**| `POST /{page_id}/messages` (`template_type=generic`) | `send_generic_template` |
| **Messaging - Reusable Assets**| `POST /{page_id}/message_attachments` | `upload_reusable_attachment` |
| **Conversation Threads** | `GET /{page_id}/conversations?platform=instagram` | `get_conversations` |
| **Conversation History** | `GET /{conversation_id}/messages` | `get_conversation_messages` |
| **Messenger Profile - FAQs** | `POST /{page_id}/messenger_profile` (`ice_breakers`) | `manage_ice_breakers` |
| **Messenger Profile - Menu** | `POST /{page_id}/messenger_profile` (`persistent_menu`) | `manage_persistent_menu` |
| **Insights - User** | `GET /{ig_user_id}/insights` | `get_instagram_account_insights` |
| **Insights - Media** | `GET /{media_id}/insights` | `get_instagram_media_insights` |

---

## 3. How to Use the Postman Collection for Testing

### Step 1: Fork the Collection to Your Postman Workspace
1. Open [https://www.postman.com/meta/instagram/collection/6yqw8pt/instagram-api](https://www.postman.com/meta/instagram/collection/6yqw8pt/instagram-api).
2. Click **Fork** in the top right to copy the collection into your personal Postman workspace.

### Step 2: Configure Postman Environment Variables
Set the following variables in your Postman environment (use placeholders for sensitive values):
```text
base_url: https://graph.facebook.com/v26.0
user_access_token: <YOUR_PERMANENT_PAGE_TOKEN>
page_id: <YOUR_PAGE_ID>
ig_user_id: <YOUR_INSTAGRAM_ACCOUNT_ID>
```

### Step 3: Why MCP is Superior to Raw Postman for AI Agents
While Postman requires manual clicking, copy-pasting JSON payloads, and handling two-step container polling manually, your **MCP Server** automates the entire flow:
- Auto-detects whether media is text, image, or video.
- Automatically handles two-step container creation and publishing.
- Enforces strict media formats (e.g. converting/checking `.m4a` / `.wav` for voice notes).
- Enables your Antigravity AI pair programmer to execute any action via natural language chat.
