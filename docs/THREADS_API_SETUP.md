# Threads API Integration & 60-Day Token Setup Guide

Author: **Yogeshwar Kumar** ([GitHub: @inyogeshwar](https://github.com/inyogeshwar))  
Target: Meta Threads API Integration (v1.0)  
Suite: Model Context Protocol (MCP) Server & Automation Tools

---

## 1. Overview

Unlike Facebook Pages and Instagram which run on `graph.facebook.com`, the **Threads API** operates on its own dedicated base URL: **`https://graph.threads.net/v1.0`**.

Meta issues Threads tokens with either a **1-hour** or **60-day** lifespan. This guide outlines the exact, battle-tested procedure (demonstrated in the *n8n Threads Integration* tutorial) to obtain a **60-day auto-refreshing token** and automate publishing text, images, and video threads.

---

## 2. Integrated Threads MCP Tools (5 Tools)

Your MCP server includes complete native implementations for the Threads API:

| Tool Name | Endpoint | Description |
| :--- | :--- | :--- |
| **`get_threads_profile`** | `GET /me` | Fetch Threads bio, username, follower count, and profile picture. |
| **`publish_threads_post`** | `POST /{user_id}/threads` & `threads_publish` | Two-step container publishing for text, image, or video threads. |
| **`get_threads_posts`** | `GET /{user_id}/threads` | Fetch recent published threads and permalinks. |
| **`reply_to_threads_post`** | `POST /{user_id}/threads` with `reply_to_id` | Post a threaded reply to any thread conversation. |
| **`get_threads_insights`** | `GET /{user_id}/threads_insights` | Fetch views, likes, replies, reposts, and quote metrics. |

---

## 3. Step-by-Step: Getting Your 60-Day Threads Token

### Step 1: Create a Dedicated Threads Meta App
1. Go to [developers.facebook.com](https://developers.facebook.com/) and click **Create App**.
2. Give your app a name (e.g., `Threads Auto Posting`).
3. Select the use case: **"Access the Threads API"** (do NOT use standard business apps).
4. Link it to your Business Portfolio and click **Create App**.

### Step 2: Add Threads Tester Role
1. In the left sidebar of your app dashboard, click **App roles** > **Roles**.
2. Click **Add People** and select **Threads Tester**.
3. Search for your Threads username.
4. Click **Add**. The status will display as `Pending`.

### Step 3: Accept the Invite in Threads App
1. Open the Threads app on your phone (or web at [threads.net](https://threads.net/)):
   - Go to your **Profile** > Tap **Settings** (gear icon).
   - Go to **Account** > **Website permissions** > **Invitations**.
   - Tap **Accept** on the invitation from your app.
2. Refresh your Meta App dashboard. The status changes to **Active**.

### Step 4: Generate Your 60-Day Access Token

#### Scenario A: Direct 60-Day Token from Dashboard (Easiest)
1. Go to your Meta App dashboard > Threads Settings.
2. Click **Generate access token**.
3. Log in with your Threads account and click **Continue**.
4. Copy the generated token.
5. Check its validity at [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken). If it shows **"Expires in about 2 months"**, you're done!

#### Scenario B: Exchange 1-Hour Token for 60 Days (Via Helper Script)
If you generate a token via Graph API Explorer that only lasts 1 hour, exchange it for a 60-day token using the included helper script:

```bash
# Run token exchanger:
node scripts/exchange-threads-token.js <YOUR_1_HOUR_TOKEN> <YOUR_APP_SECRET>
```

Or via direct HTTP GET request:
```http
GET https://graph.threads.net/access_token
  ?grant_type=th_exchange_token
  &client_secret=YOUR_APP_SECRET
  &access_token=YOUR_1_HOUR_SHORT_TOKEN
```
**Response**:
```json
{
  "access_token": "THQW...",
  "token_type": "bearer",
  "expires_in": 5184000
}
```
*(5,184,000 seconds = exactly 60 days).*

---

## 4. Two-Step Publishing Pipeline (Handled by MCP)

Meta requires publishing to happen in two distinct steps:

```text
Step 1: Create Media Container
POST https://graph.threads.net/v1.0/{threads_user_id}/threads
Payload:
  - media_type: "TEXT" | "IMAGE" | "VIDEO"
  - text: "Your post content here"
  - image_url: "https://yourdomain.com/photo.jpg" (if image)
  - video_url: "https://yourdomain.com/clip.mp4" (if video)
Response: { "id": "CREATION_ID" }
         │
         ▼
Step 2: Publish Container
POST https://graph.threads.net/v1.0/{threads_user_id}/threads_publish
Payload:
  - creation_id: "CREATION_ID"
Response: { "id": "PUBLISHED_THREAD_ID" }
```

In your MCP server, the `publish_threads_post` tool executes both steps automatically in sequence.

---

## 5. Adding to Antigravity MCP Config

Add `THREADS_ACCESS_TOKEN` and `THREADS_USER_ID` to `%USERPROFILE%\.gemini\config\mcp_config.json`:

```json
{
  "mcpServers": {
    "meta_social_technologies": {
      "command": "node",
      "args": ["D:\\meta-social-technologies-mcp\\server.js"],
      "env": {
        "FB_PAGE_ACCESS_TOKEN": "YOUR_FB_PAGE_TOKEN",
        "FB_PAGE_ID": "YOUR_PAGE_ID",
        "INSTAGRAM_ID": "YOUR_INSTAGRAM_ID",
        "THREADS_ACCESS_TOKEN": "YOUR_60_DAY_THREADS_TOKEN",
        "THREADS_USER_ID": "YOUR_THREADS_ACCOUNT_ID"
      }
    }
  }
}
```
