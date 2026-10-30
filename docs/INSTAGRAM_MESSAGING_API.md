# Instagram Direct Business Messaging API Specifications

Author: **Yogeshwar Kumar** ([GitHub: @inyogeshwar](https://github.com/inyogeshwar))

Official Meta Developer Documentation References:
- [Get Started with Instagram Messaging](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/get-started)
- [Send Message API](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/send-message)
- [Message Reactions](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/sender-actions)
- [Attachment Upload API](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/attachment-upload)
- [Private Replies](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/private-replies)
- [Human Agent Escalation](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/human-agent-escalation)

---

## 1. Direct Messaging Attachments & Audio Specifications

Meta enforces strict container and size requirements for Instagram Direct attachments:

| Attachment Type | Allowed Formats | Max File Size | Constraints |
| :--- | :--- | :--- | :--- |
| **Audio / Voice** | `.m4a`, `.aac`, `.wav`, `.mp4` | **25 MB** | ⚠️ `.mp3` and `.ogg` are **NOT** supported by Meta for Instagram Direct audio notes. |
| **Image** | `.jpg`, `.png`, `.gif` | **8 MB** | Direct public image URLs without HTTP redirects. |
| **Video** | `.mp4` (H.264 + AAC) | **25 MB** | Standard MP4 video stream. |
| **File / Documents**| `.pdf`, `.doc`, `.zip` | **25 MB** | Downloadable inline in chat. |

---

## 2. Message Reactions (Double-Tap Heart ❤️)

To place an emoji reaction on any message:
```http
POST /v26.0/{PAGE_ID}/messages
Content-Type: application/json

{
  "recipient": {
    "id": "<IGSID>"
  },
  "sender_action": "react",
  "payload": {
    "message_id": "<MESSAGE_ID>",
    "reaction": "❤️"
  }
}
```

To remove (unreact):
```json
{
  "recipient": { "id": "<IGSID>" },
  "sender_action": "unreact",
  "payload": { "message_id": "<MESSAGE_ID>" }
}
```

---

## 3. Exact Quoted / Threaded Replies (`reply_to`)

To reply directly to a specific message so that the quoted bubble appears above your reply:
```http
POST /v26.0/{PAGE_ID}/messages
Content-Type: application/json

{
  "recipient": {
    "id": "<IGSID>"
  },
  "message": {
    "text": "Your reply message text goes here"
  },
  "reply_to": {
    "mid": "<MESSAGE_ID>"
  }
}
```

---

## 4. Reusable Attachment Upload API

Instead of re-uploading large PDFs, images, or audio files on every single user DM, upload them once:
```http
POST /v26.0/{PAGE_ID}/message_attachments
Content-Type: application/json

{
  "platform": "instagram",
  "message": {
    "attachment": {
      "type": "audio",
      "payload": {
        "url": "https://yourdomain.com/voice.m4a",
        "is_reusable": true
      }
    }
  }
}
```
**Response**:
```json
{
  "attachment_id": "2410889129444395"
}
```

Then deliver immediately to any chatter using `attachment_id`:
```json
{
  "recipient": { "id": "<IGSID>" },
  "message": {
    "attachment": {
      "type": "audio",
      "payload": {
        "attachment_id": "2410889129444395"
      }
    }
  }
}
```
