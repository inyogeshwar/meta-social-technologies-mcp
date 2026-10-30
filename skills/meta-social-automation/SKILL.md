---
name: meta-social-automation
description: >-
  Enterprise Meta Social Technologies automation suite for Facebook Pages, Instagram Business/Creator accounts, and Threads.
  Use when the user wants to auto-post to Facebook/Instagram (photos, reels, carousels, status, threads), auto-reply to comments,
  moderate comments (hide, unhide, delete), send Direct Messages (text, links, PDF files, M4A/WAV voice notes, images), run
  ManyChat/Superprofile-style Follow-to-Unlock growth funnels, react to messages with double-tap heart (❤️), send exact threaded
  quoted replies, discover competitor accounts with Business Discovery, research hashtags, check publishing quotas, or troubleshoot
  Meta Graph API error codes.
---

# Meta Social Technologies Automation Skill v4.0

Author: **Yogeshwar Kumar** ([GitHub: @inyogeshwar](https://github.com/inyogeshwar))  
Target Account: **`your account`**  
Documentation Archive: **`docs/meta-api-reference/`** (70 official Meta Markdown guides)

This skill equips the AI agent with complete operational knowledge to control, automate, and monitor Facebook Pages, Instagram Professional Accounts, and Threads using the `meta_social_technologies` Model Context Protocol (MCP) server.

---

## Capabilities & Tool Mappings (45 Enterprise Tools)

### 1. Market Intelligence & Discovery
- `discover_business_profile`: Lookup any public Instagram Business or Creator account by `@username` using the Meta Business Discovery API. Inspect follower counts, media counts, biography, website, and their latest 5 public posts.
- `search_instagram_hashtag`: Query Instagram's hashtag database to obtain the global, static `hashtag_id` for any keyword.
- `get_hashtag_top_media`: Retrieve the most popular trending posts and reels tagged with a hashtag.
- `get_hashtag_recent_media`: Fetch recent media published under a hashtag.
- `get_content_publishing_limit`: Query real-time 24-hour rate limit quota usage (50 posts limit) to avoid API suspensions.

### 2. Publishing & Content Distribution
- `publish_instagram_carousel`: Publish multi-item album carousels (2 to 20 images or videos) with captions and optional `is_ai_generated` flag.
- `publish_instagram_reel`: Upload and publish MP4 video reels with captions.
- `publish_instagram_photo`: Post images with captions and hashtags to Instagram feed.
- `publish_facebook_post`: Publish status text and optional web links to Facebook Page.
- `publish_facebook_photo`: Upload and publish photos with captions to Facebook Page.
- `get_facebook_posts` & `get_instagram_media`: Inspect published posts, IDs, permalinks, and captions.
- `get_instagram_stories`: Fetch active 24-hour stories published on the account.
- `get_media_children`: Inspect individual child images or videos within a carousel album.

### 3. Comment Automation & Moderation
- `get_media_comments`: Fetch comments, usernames, and commenter IDs on any post or reel.
- `reply_to_comment`: Post an immediate public reply to any comment.
- `like_comment`: Like a comment on behalf of the professional profile.
- `moderate_comment`: Hide (`hide: true`), unhide (`hide: false`), or permanently delete (`delete`) inappropriate or spam comments.
- `send_instagram_private_reply`: Privately DM a commenter using their `comment_id`.

### 4. Direct Messaging (DMs) & Voice Notes
- `send_instagram_dm`: Deliver DMs to any user by their `recipient_id` (IGSID):
  - **Text & Links**: Markdown/plain text formatting.
  - **Images**: Direct JPG/PNG image URLs.
  - **Documents/PDFs**: `attachment_type: "file"` with public PDF URLs.
  - **Audio / Voice Notes**: `attachment_type: "audio"`. Meta strictly requires **`m4a`**, **`aac`**, or **`wav`** formats up to 25MB (MP3/OGG are not supported by Instagram Direct).
  - **Reusable Delivery**: Use `attachment_id` to deliver pre-uploaded files with zero latency.
  - **Exact Quoted Reply**: Pass `reply_to_message_id: "<MESSAGE_ID>"` to quote the exact user message.

### 5. Interactive Experiences & Reactions
- `react_to_message`: Send a double-tap heart (`❤️`), flame (`🔥`), or thumbs-up (`👍`) reaction to any specific message ID, or unreact.
- `send_sender_action`: Display typing indicator (`typing_on`, `typing_off`) or mark thread as seen (`mark_seen`).
- `send_quick_replies`: Send interactive pill buttons (up to 13 choices) that users tap to reply.
- `send_button_template`: Present formatted text with up to 3 URL or postback buttons.
- `send_generic_template`: Horizontal scrollable carousel cards with images, titles, and action buttons.
- `send_human_agent_message`: 7-day extended messaging window using the `HUMAN_AGENT` tag.

### 6. Follow-to-Unlock Growth Funnel (ManyChat / Superprofile Style)
- `run_instagram_comment_growth_funnel`:
  1. Scans comments on a reel for trigger keywords (e.g., `"guide"`, `"link"`, `"preset"`).
  2. Auto-likes matching comments.
  3. Replies publicly: `"Check your DM! I just sent you the guide 📥"`.
  4. Checks if the commenter follows `your account`:
     - **If following**: Unlocks the secret link, PDF, or audio voice note directly into their DMs.
     - **If NOT following**: Sends a gate message: `"Hey! 👋 Please follow your account first to unlock! Once followed, reply DONE here to get it 🎁"`.

### 7. Threads API Publishing & Analytics
- `get_threads_profile`: Inspect Threads profile, username, and bio.
- `publish_threads_post`: Publish text threads (up to 500 chars), image threads, or video threads.
- `get_threads_posts`: Fetch recent published threads and permalinks.
- `reply_to_threads_post`: Post automated replies to specific thread conversations.
- `get_threads_insights`: Track views, likes, replies, and repost metrics.

### 8. Offline Error Code Troubleshooting
- `get_error_code_info`: Lookup official Meta Graph API error codes, descriptions, and recommended fixes:
  - Code `9` / Subcode `2207042`: Daily publishing quota reached (50 posts limit).
  - Code `100` / Subcode `2018007`: Unsupported audio format in Direct. Must use `.m4a` or `.wav`.
  - Code `190`: Token expired. Must refresh or re-authenticate.
  - Code `36000` / Subcode `2207004`: Image exceeds 8 MiB limit.
  - Code `36003` / Subcode `2207009`: Image aspect ratio outside 4:5 to 1.91:1 range.

---

## Best Practices & API Constraints

1. **24-Hour Messaging Window**: Meta permits standard automated messages within 24 hours of the user's latest interaction. For replies beyond 24 hours (up to 7 days), use `send_human_agent_message`.
2. **Audio Voice Notes**:
   - Supported extensions: `.m4a`, `.aac`, `.wav`, `.mp4`.
   - Max file size: 25 MB.
   - Do NOT use `.mp3` or `.ogg` (Meta returns Error 100 / subcode 2018007).
3. **Daily Content Publishing Limit**:
   - Meta limits professional accounts to **50 published posts per 24 hours**.
   - Carousels count as 1 post against this quota.
   - Always call `get_content_publishing_limit` before scheduled bulk publishing.
4. **Reusable Attachments**:
   - For high-volume broadcasts or comment funnels, call `upload_reusable_attachment` once to get an `attachment_id`, then pass `attachment_id` to `send_instagram_dm` or `run_instagram_comment_growth_funnel`.

---

## Example Invocations

### Example 1: Discover a Competitor or Creator Profile
```text
Discover Instagram profile details and recent posts for @nike using business discovery.
```

### Example 2: Check Hashtag Top Media
```text
Find the hashtag ID for "reelsviral" and fetch its top 5 performing posts.
```

### Example 3: Publish an Instagram Carousel Album
```text
Publish an Instagram carousel with 3 slides:
- Slide 1: https://example.com/slide1.jpg
- Slide 2: https://example.com/slide2.jpg
- Slide 3: https://example.com/slide3.jpg
Caption: "Top 3 tips for creator growth in 2026! 🚀 #creatorgrowth #socialmediamarketing"
```

### Example 4: Check Publishing Limit & Quota Usage
```text
Check how many posts are left in my 24-hour publishing quota.
```
