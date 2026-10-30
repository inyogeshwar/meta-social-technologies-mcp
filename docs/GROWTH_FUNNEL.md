# ManyChat & Superprofile Follow-to-Unlock Growth Funnel

Author: **Yogeshwar Kumar** ([GitHub: @inyogeshwar](https://github.com/inyogeshwar))

## The "Follow-to-Unlock" Catch Explained

Many creator tools like ManyChat and Superprofile charge monthly subscriptions for automated comment-to-DM funnels. This MCP server implements the exact architecture directly through Meta's Graph API for zero additional monthly cost.

---

## 1. Funnel Flowchart

```text
User comments "guide" on Reel/Post
              │
              ▼
   Auto-Like Comment & Public Reply:
   "Check your DM! I just sent you the details 📥"
              │
              ▼
    Check Follower Status:
    GET /{IGSID}?fields=is_user_follow_business
              │
     ┌────────┴────────┐
     ▼                 ▼
[Following]       [Not Following]
     │                 │
Deliver Unlocked  Deliver Follow Gate Prompt:
Content, Link,    "Hey! 👋 Please follow your account first
PDF, or Audio     to unlock the guide! Once followed, reply DONE"
Voice Note!
```

---

## 2. Using the MCP Funnel Tool

Run the tool `run_instagram_comment_growth_funnel`:
```json
{
  "media_id": "latest",
  "keyword": "guide",
  "public_reply_template": "Check your DM! I sent you the guide 📥",
  "like_matching_comments": true,
  "require_follow": true,
  "follow_gate_message": "Hey! 👋 To unlock the exclusive aesthetic guide, please follow your account first! Once followed, reply 'DONE' here to get it 🎁",
  "unlocked_content_text": "Hey {username}! 🚀 Here is your exclusive guide: https://yourdomain.com/guide.pdf Enjoy!",
  "attachment_type": "file",
  "attachment_url": "https://yourdomain.com/guide.pdf"
}
```
