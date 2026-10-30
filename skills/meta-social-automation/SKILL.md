---
name: meta-social-automation
description: >-
  Enterprise Meta Social Technologies automation suite for Facebook Pages and Instagram Business/Creator accounts.
  Use when the user wants to auto-post to Facebook/Instagram (photos, reels, status), auto-reply to comments,
  send Direct Messages (text, links, PDF files, M4A/WAV voice notes, images), run ManyChat/Superprofile-style
  Follow-to-Unlock growth funnels, react to messages with double-tap heart (❤️), send exact threaded quoted replies,
  or manage Ice Breakers, Persistent Menus, and conversation threads.
---

# Meta Social Technologies Automation Skill

Author: **Yogeshwar Kumar** ([GitHub: @inyogeshwar](https://github.com/inyogeshwar))  
Target Account: **`your account`**

This skill teaches the AI agent how to control and automate Facebook Pages and Instagram accounts using the `meta_social_technologies` Model Context Protocol (MCP) server.

---

## Capabilities & Tool Mappings

### 1. Publishing & Content Distribution
- `publish_facebook_post`: Publish status text and optional web links to Facebook Page.
- `publish_facebook_photo`: Upload and publish photos with captions to Facebook Page.
- `publish_instagram_photo`: Post images with captions and hashtags to Instagram feed.
- `publish_instagram_reel`: Upload and publish MP4 video reels to Instagram.
- `get_facebook_posts` & `get_instagram_media`: Inspect published posts, IDs, permalinks, and captions.

### 2. Comment Automation & Moderation
- `get_media_comments`: Fetch comments, usernames, and commenter IDs on any post or reel.
- `reply_to_comment`: Post an immediate public reply to any comment.
- `like_comment`: Like a comment on behalf of the professional profile.
- `send_instagram_private_reply`: Privately DM a commenter using their `comment_id`.

### 3. Direct Messaging (DMs) & Voice Notes
- `send_instagram_dm`: Deliver DMs to any user by their `recipient_id` (IGSID):
  - **Text & Links**: Markdown/plain text formatting.
  - **Images**: Direct JPG/PNG image URLs.
  - **Documents/PDFs**: `attachment_type: "file"` with public PDF URLs.
  - **Audio / Voice Notes**: `attachment_type: "audio"`. Meta strictly requires **`m4a`**, **`aac`**, **`wav`**, or **`mp4`** formats up to 25MB (MP3/OGG are not supported by Instagram Direct).
  - **Reusable Delivery**: Use `attachment_id` to deliver pre-uploaded files with zero latency.
  - **Exact Quoted Reply**: Pass `reply_to_message_id: "<MESSAGE_ID>"` to quote the exact user message.

### 4. Interactive Experiences & Reactions
- `react_to_message`: Send a double-tap heart (`❤️`) or emoji reaction (`🔥`, `👍`) to any specific message ID, or unreact.
- `send_sender_action`: Display typing indicator (`typing_on`, `typing_off`) or mark thread as seen (`mark_seen`).
- `send_quick_replies`: Send interactive pill buttons (up to 13 choices) that users tap to reply.
- `send_button_template`: Present formatted text with up to 3 URL or postback buttons.
- `send_generic_template`: Horizontal scrollable carousel cards with images, titles, and action buttons.
- `send_human_agent_message`: 7-day extended messaging window using the `HUMAN_AGENT` tag.

### 5. Follow-to-Unlock Growth Funnel (ManyChat / Superprofile Style)
- `run_instagram_comment_growth_funnel`:
  1. Scans comments on a reel for trigger keywords (e.g., `"guide"`, `"link"`, `"preset"`).
  2. Auto-likes matching comments.
  3. Replies publicly: `"Check your DM! I just sent you the guide 📥"`.
  4. Checks if the commenter follows `your account`:
     - **If following**: Unlocks the secret link, PDF, or audio voice note directly into their DMs.
     - **If NOT following**: Sends a gate message: `"Hey! 👋 Please follow your account first to unlock! Once followed, reply DONE here to get it 🎁"`.

### 6. Profile & Thread Management
- `get_user_profile`: Inspect chatter's username, name, profile photo, and follower status.
- `get_conversations`: List active inbox threads, participants, and unread counts.
- `get_conversation_messages`: Read message history and reactions inside a thread.
- `manage_ice_breakers`: Configure FAQ prompts shown to new chatters.
- `manage_persistent_menu`: Set the permanent bottom menu in the DM composer.
- `generate_ig_me_link`: Generate `https://ig.me/m/your_username?ref=...` tracking links.
- `get_instagram_account_insights` & `get_instagram_media_insights`: Analytics and reach metrics.

### 7. Threads API Publishing & Replies
- `get_threads_profile`: Inspect `your account` Threads profile, username, and bio.
- `publish_threads_post`: Publish text threads (up to 500 chars), image threads, or video threads.
- `get_threads_posts`: Fetch recent published threads and permalinks.
- `reply_to_threads_post`: Post automated replies to specific thread conversations.
- `get_threads_insights`: Track views, likes, replies, and repost metrics.

---

## Best Practices & API Constraints

1. **24-Hour Messaging Window**: Meta permits standard automated messages within 24 hours of the user's latest interaction. For replies beyond 24 hours (up to 7 days), use `send_human_agent_message`.
2. **Audio Voice Notes**:
   - Supported extensions: `.m4a`, `.aac`, `.wav`, `.mp4`.
   - Max file size: 25 MB.
   - Do NOT use `.mp3` or `.ogg` (Meta returns Error 100 / subcode 2018007).
3. **Reusable Attachments**:
   - For high-volume broadcasts or comment funnels, call `upload_reusable_attachment` once to get an `attachment_id`, then pass `attachment_id` to `send_instagram_dm` or `run_instagram_comment_growth_funnel`.

---

## Example User Invocations

### Example 1: Run the Follow-to-Unlock Reel Funnel
```text
Run the Instagram comment growth funnel on my latest reel:
- Keyword: "guide"
- Public Reply: "Check your DM! I just sent you the link 📥"
- Require Follow: true
- Unlocked Message: "Here is your exclusive guide: https://yourdomain.com/guide.pdf 🚀"
- Attachment Type: "file"
- Attachment URL: "https://yourdomain.com/guide.pdf"
```

### Example 2: React to a Message with Double-Tap Heart
```text
React to message ID <MID> from user <RECIPIENT_ID> with ❤️
```

### Example 3: Send an Exact Quoted Reply
```text
Send a quoted reply to message ID <MID> for user <RECIPIENT_ID>:
"Replying directly to your question! Here are the details..."
```
