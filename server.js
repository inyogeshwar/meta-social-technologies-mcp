/**
 * Meta Social Technologies Local MCP Server v4.0 (Enhanced with Official Meta Documentation Suite)
 * Enterprise Instagram Business Messaging & Facebook Automation Suite
 * Features:
 *  - Core Publishing: Posts, Photos, Reels
 *  - Comment Automation: Fetching, Auto-Liking, Auto-Replying
 *  - Direct Messaging: Text, Images, Voice/Audio, PDFs/Files
 *  - Advanced Messaging: Sender Actions (typing_on, mark_seen), Quick Replies, Button Templates, Generic Carousels
 *  - Follow-to-Unlock Growth Funnel (ManyChat / Superprofile style)
 *  - Conversation Moderation & Thread Inspection
 *  - Ice Breakers & Persistent Menu Management
 *  - ig.me Referral Links Generator
 *  - Human Agent Escalation (7-day window with HUMAN_AGENT tag)
 *  - Attachment Upload API (Reusable Attachment IDs)
 *  - Account & Media Analytics / Insights
 */

const readline = require('readline');
const https = require('https');

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;
const INSTAGRAM_ID = process.env.INSTAGRAM_ID;
const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME || 'your_instagram_handle';
const GRAPH_API_BASE = 'https://graph.facebook.com/v26.0';
const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const THREADS_ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN;
const THREADS_USER_ID = process.env.THREADS_USER_ID;

if (!PAGE_ACCESS_TOKEN || !PAGE_ID || !INSTAGRAM_ID) {
  console.error('[WARN] Missing required environment variables: FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID, or INSTAGRAM_ID.');
  console.error('[WARN] Please set these in your environment or MCP configuration (e.g. mcp_config.json).');
}

// Helper for making Threads API calls
async function threadsRequest(endpoint, method = 'GET', data = null, isJson = false) {
  if (!THREADS_ACCESS_TOKEN) {
    throw new Error('THREADS_ACCESS_TOKEN is not configured. Please set THREADS_ACCESS_TOKEN in your environment or MCP config.');
  }
  return new Promise((resolve, reject) => {
    let url = `${THREADS_API_BASE}${endpoint}`;
    const urlObj = new URL(url);
    urlObj.searchParams.set('access_token', THREADS_ACCESS_TOKEN);

    let postData = '';
    const headers = {};

    if ((method === 'POST' || method === 'DELETE') && data) {
      if (isJson) {
        postData = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
      } else {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined && value !== null) {
            params.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
          }
        }
        postData = params.toString();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      method: method,
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: headers
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error ? parsed.error.message : body));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response (${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    if ((method === 'POST' || method === 'DELETE') && postData) {
      req.write(postData);
    }
    req.end();
  });
}

// Helper for making Graph API calls (handles query strings, URL-encoded & JSON payloads)
async function graphRequest(endpoint, method = 'GET', data = null, isJson = false) {
  return new Promise((resolve, reject) => {
    let url = `${GRAPH_API_BASE}${endpoint}`;
    const urlObj = new URL(url);

    urlObj.searchParams.set('access_token', PAGE_ACCESS_TOKEN);

    let postData = '';
    const headers = {};

    if ((method === 'POST' || method === 'DELETE') && data) {
      if (isJson) {
        postData = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
      } else {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined && value !== null) {
            params.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
          }
        }
        postData = params.toString();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      method: method,
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: headers
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error ? parsed.error.message : body));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response (${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    if ((method === 'POST' || method === 'DELETE') && postData) {
      req.write(postData);
    }
    req.end();
  });
}

// Tool Definitions

// Official Meta Graph API Error Codes Database
const META_ERROR_CODES = [
  { code: -2, subcode: 2207003, title: 'Download Timeout', message: 'It takes too long to download the media.', solution: 'A timeout occurred while downloading the media. Ensure your server responds quickly and retry.' },
  { code: -2, subcode: 2207020, title: 'Media Expired', message: 'The media you are trying to access has expired.', solution: 'Generate a new container ID and retry upload within 24 hours.' },
  { code: -1, subcode: 2207001, title: 'Instagram Server Error', message: 'Instagram internal server error.', solution: 'Temporary Meta server error. Wait 30 seconds and retry.' },
  { code: -1, subcode: 2207032, title: 'Create Media Failed', message: 'Create media fail, please try to re-create media.', solution: 'Failed to create a media container. Re-check file URL and retry.' },
  { code: -1, subcode: 2207053, title: 'Upload Error', message: 'Unknown upload error during video processing.', solution: 'Generate a new media container and use resumable upload session for large videos.' },
  { code: 1, subcode: 2207057, title: 'Invalid Thumbnail Offset', message: 'Thumbnail offset must be >= 0 and < video duration.', solution: 'Provide thumbnail offset in milliseconds within the video duration.' },
  { code: 4, subcode: 2207051, title: 'Spam Rate Limit / Restriction', message: 'Action restricted to protect community.', solution: 'Meta suspected repetitive actions as spam. Increase delay between requests and avoid duplicate links.' },
  { code: 9, subcode: 2207042, title: 'Publishing Quota Exceeded', message: 'Daily Content Publishing API limit reached (50 posts/24h).', solution: 'The account reached the 50 published posts limit in 24 hours. Wait for the rolling 24h window to reset.' },
  { code: 24, subcode: 2207006, title: 'Media Not Found / Permission Denied', message: 'The media cannot be found or token lacks permissions.', solution: 'Verify token has instagram_basic and instagram_content_publish permissions.' },
  { code: 24, subcode: 2207008, title: 'Container Builder Expired', message: 'Media builder creation ID does not exist or expired.', solution: 'Wait 30-60 seconds for processing or recreate container.' },
  { code: 25, subcode: 2207050, title: 'Account Restricted', message: 'Instagram Professional account is restricted or checkpointed.', solution: 'Log in to Instagram app on smartphone and complete verification/security prompts.' },
  { code: 100, subcode: 2207023, title: 'Unknown Media Type', message: 'Media type not recognized.', solution: 'Use supported media_type: IMAGE, VIDEO, REELS, STORIES, or CAROUSEL.' },
  { code: 100, subcode: 2207028, title: 'Invalid Carousel Count', message: 'Carousels need between 2 and 20 photos/videos.', solution: 'Provide at least 2 items and no more than 20 items in children parameter.' },
  { code: 100, subcode: 2207040, title: 'Too Many User Tags', message: 'Cannot use more than 20 @ tags per post.', solution: 'Reduce user tags to 20 or fewer.' },
  { code: 100, subcode: 2018007, title: 'Invalid Direct Audio Format', message: 'Audio format rejected in Direct Message.', solution: 'Instagram Direct strictly requires .m4a, .aac, or .wav containers (MP3/OGG unsupported).' },
  { code: 190, subcode: null, title: 'Invalid / Expired Access Token', message: 'The access token is expired or revoked.', solution: 'Re-authenticate with Facebook/Instagram Login or exchange for a fresh 60-day token.' },
  { code: 352, subcode: 2207026, title: 'Unsupported Video Codec', message: 'Video format is not supported.', solution: 'Ensure video is MP4/MOV container with H.264 video codec and AAC audio codec.' },
  { code: 9004, subcode: 2207052, title: 'Media URL Unreachable', message: 'Media could not be fetched from URI.', solution: 'Ensure media URL is public (HTTP 200), does not require auth, and has valid SSL certificate.' },
  { code: 9007, subcode: 2207027, title: 'Media Processing Incomplete', message: 'Media is not ready for publishing.', solution: 'Poll GET /<container_id>?fields=status_code until status is FINISHED before publishing.' },
  { code: 36000, subcode: 2207004, title: 'Image Too Large', message: 'Image size exceeds maximum limit.', solution: 'Compress image to less than 8 MiB.' },
  { code: 36003, subcode: 2207009, title: 'Invalid Aspect Ratio', message: 'Submitted image aspect ratio is not supported.', solution: 'Crop image within aspect ratio range 4:5 (0.8) to 1.91:1.' },
  { code: 36004, subcode: 2207010, title: 'Caption Too Long', message: 'Caption exceeds maximum character limit.', solution: 'Shorten caption to max 2,200 characters and max 30 hashtags.' }
];

function resolveMetaError(code, subcode) {
  const match = META_ERROR_CODES.find(e => 
    String(e.code) === String(code) && 
    (subcode === undefined || subcode === null || String(e.subcode) === String(subcode))
  );
  if (match) return match;
  return {
    code,
    subcode,
    title: 'Meta Graph API Error',
    message: `Error code ${code} ${subcode ? '(' + subcode + ')' : ''}`,
    solution: 'Refer to official Meta error documentation in docs/meta-api-reference/instagram-platform/instagram-graph-api/reference/error-codes.md'
  };
}

const TOOLS = [

    // --- 11. Official Meta Discovery & Intelligence (Docs-Powered) ---
    {
      name: 'discover_business_profile',
      description: 'Discover details about any public Instagram Business or Creator account (followers, media count, bio, website, and recent public posts) using Meta Business Discovery API.',
      inputSchema: {
        type: 'object',
        properties: {
          username: { type: 'string', description: 'Target Instagram @username to discover (e.g. "natgeo" or "nike").' },
          include_media: { type: 'boolean', description: 'Whether to also fetch their recent 5 public posts (default: true).' }
        },
        required: ['username']
      }
    },
    {
      name: 'search_instagram_hashtag',
      description: 'Search Instagram hashtags to retrieve their official static hashtag ID.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Hashtag string without # (e.g. "reels", "travel", "ai").' }
        },
        required: ['query']
      }
    },
    {
      name: 'get_hashtag_top_media',
      description: 'Fetch the most popular top photo and video media for a specific hashtag ID.',
      inputSchema: {
        type: 'object',
        properties: {
          hashtag_id: { type: 'string', description: 'Hashtag ID obtained from search_instagram_hashtag.' },
          limit: { type: 'number', description: 'Number of media objects (default: 10, max: 50).' }
        },
        required: ['hashtag_id']
      }
    },
    {
      name: 'get_hashtag_recent_media',
      description: 'Fetch recently published media tagged with a specific hashtag ID.',
      inputSchema: {
        type: 'object',
        properties: {
          hashtag_id: { type: 'string', description: 'Hashtag ID obtained from search_instagram_hashtag.' },
          limit: { type: 'number', description: 'Number of media objects (default: 10, max: 50).' }
        },
        required: ['hashtag_id']
      }
    },
    {
      name: 'get_content_publishing_limit',
      description: 'Query your account real-time Content Publishing API quota usage (50 posts per 24 hours rolling limit).',
      inputSchema: {
        type: 'object',
        properties: {
          since: { type: 'number', description: 'Optional Unix timestamp within the last 24h. Omit for full 24h usage.' }
        }
      }
    },
    {
      name: 'moderate_comment',
      description: 'Moderate an Instagram comment: hide, unhide, or permanently delete.',
      inputSchema: {
        type: 'object',
        properties: {
          comment_id: { type: 'string', description: 'Instagram Comment ID to moderate.' },
          action: { type: 'string', enum: ['hide', 'unhide', 'delete'], description: 'Action to perform.' }
        },
        required: ['comment_id', 'action']
      }
    },
    {
      name: 'get_instagram_stories',
      description: 'Fetch active 24-hour stories published on your Instagram account.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Number of stories to fetch (default: 10).' }
        }
      }
    },
    {
      name: 'get_media_children',
      description: 'Retrieve individual child media items (photos/videos) from a carousel post.',
      inputSchema: {
        type: 'object',
        properties: {
          media_id: { type: 'string', description: 'Carousel media ID.' }
        },
        required: ['media_id']
      }
    },
    {
      name: 'publish_instagram_carousel',
      description: 'Create and publish an Instagram carousel album containing 2 to 20 images or videos.',
      inputSchema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string', description: 'Public image or video URL.' },
                is_video: { type: 'boolean', description: 'Set true if this child item is a video.' }
              },
              required: ['url']
            },
            description: 'List of 2 to 20 media items.'
          },
          caption: { type: 'string', description: 'Post caption with hashtags.' },
          is_ai_generated: { type: 'boolean', description: 'Self-disclose that media is AI generated.' }
        },
        required: ['items']
      }
    },
    {
      name: 'get_error_code_info',
      description: 'Lookup official Meta Graph API error code & subcode to get recommended solutions and causes.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'number', description: 'Meta error code (e.g. 100, 190, 4, 9, 2207042).' },
          subcode: { type: 'number', description: 'Optional Meta error subcode (e.g. 2018007, 2207004).' }
        },
        required: ['code']
      }
    },

  // --- 1. Profile & Account ---
  {
    name: 'get_page_profile',
    description: 'Get profile details, followers, and information for your Facebook Page.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_instagram_profile',
    description: 'Get profile info, followers count, bio, and media count for your Instagram account.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_user_profile',
    description: 'Fetch profile details for an Instagram user by IGSID (username, name, profile pic, follow status).',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'Instagram Scoped User ID (IGSID).' }
      },
      required: ['user_id']
    }
  },

  // --- 2. Publishing Tools ---
  {
    name: 'publish_facebook_post',
    description: 'Publish a status update or text message to your Facebook Page.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'The text content of the post.' },
        link: { type: 'string', description: 'Optional link URL to attach.' }
      },
      required: ['message']
    }
  },
  {
    name: 'publish_facebook_photo',
    description: 'Publish a photo with caption to your Facebook Page.',
    inputSchema: {
      type: 'object',
      properties: {
        photo_url: { type: 'string', description: 'Publicly accessible URL of the photo.' },
        caption: { type: 'string', description: 'Caption for the photo.' }
      },
      required: ['photo_url']
    }
  },
  {
    name: 'publish_instagram_photo',
    description: 'Publish a photo post with caption and hashtags to your Instagram account.',
    inputSchema: {
      type: 'object',
      properties: {
        image_url: { type: 'string', description: 'Direct public URL of the image (JPG/PNG).' },
        caption: { type: 'string', description: 'Caption and hashtags for the post.' }
      },
      required: ['image_url']
    }
  },
  {
    name: 'publish_instagram_reel',
    description: 'Publish a video reel with caption to your Instagram account.',
    inputSchema: {
      type: 'object',
      properties: {
        video_url: { type: 'string', description: 'Direct public URL of the MP4 video file.' },
        caption: { type: 'string', description: 'Caption and hashtags for the reel.' }
      },
      required: ['video_url']
    }
  },

  // --- 3. Feeds & Posts Listing ---
  {
    name: 'get_facebook_posts',
    description: 'Fetch recent posts published on the your Facebook Page.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max number of posts to fetch (default: 5).' }
      }
    }
  },
  {
    name: 'get_instagram_media',
    description: 'Fetch recent media (posts/reels) published on your Instagram account.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max number of media items to fetch (default: 5).' }
      }
    }
  },

  // --- 4. Comments Automation ---
  {
    name: 'get_media_comments',
    description: 'Fetch comments for an Instagram post or reel with commenter details and like counts.',
    inputSchema: {
      type: 'object',
      properties: {
        media_id: { type: 'string', description: 'The ID of the Instagram post or reel.' },
        limit: { type: 'number', description: 'Max comments to retrieve (default: 15).' }
      },
      required: ['media_id']
    }
  },
  {
    name: 'reply_to_comment',
    description: 'Post a public reply to a specific comment on an Instagram post or reel.',
    inputSchema: {
      type: 'object',
      properties: {
        comment_id: { type: 'string', description: 'The ID of the comment to reply to.' },
        message: { type: 'string', description: 'The text of the public reply.' }
      },
      required: ['comment_id', 'message']
    }
  },
  {
    name: 'like_comment',
    description: 'Like an Instagram comment on behalf of your account.',
    inputSchema: {
      type: 'object',
      properties: {
        comment_id: { type: 'string', description: 'The ID of the comment to like.' }
      },
      required: ['comment_id']
    }
  },

  // --- 5. Core DM & Follow-Gating Automation ---
  {
    name: 'send_instagram_private_reply',
    description: 'Send a private Direct Message (DM) to an Instagram user in response to their comment.',
    inputSchema: {
      type: 'object',
      properties: {
        comment_id: { type: 'string', description: 'The comment ID of the user to message.' },
        message_text: { type: 'string', description: 'The message text or link to send.' }
      },
      required: ['comment_id', 'message_text']
    }
  },
  {
    name: 'send_instagram_dm',
    description: 'Send a Direct Message (text, image, audio/voice, or PDF/file) to an Instagram user by their IGSID. Supports quoting/replying to an exact message (threaded reply). For audio, supported formats are AAC, M4A, WAV, or MP4 up to 25MB.',
    inputSchema: {
      type: 'object',
      properties: {
        recipient_id: { type: 'string', description: 'Instagram Scoped User ID (IGSID).' },
        message_text: { type: 'string', description: 'Text message to send.' },
        reply_to_message_id: {
          type: 'string',
          description: 'Optional Message ID (mid) of a specific message to quote and reply to (exact message threaded reply).'
        },
        attachment_type: {
          type: 'string',
          enum: ['image', 'audio', 'video', 'file'],
          description: 'Type of attachment: "image", "audio" (voice note), "video", or "file" (PDF/docs).'
        },
        attachment_url: {
          type: 'string',
          description: 'Public direct URL to the attachment file (PDF, audio M4A/WAV/AAC, image JPG/PNG, MP4 video). Direct raw URL without redirects.'
        },
        attachment_id: {
          type: 'string',
          description: 'Reusable attachment ID (obtained from upload_reusable_attachment or previous message). If provided, attachment_url is ignored.'
        }
      },
      required: ['recipient_id']
    }
  },
  {
    name: 'react_to_message',
    description: 'React to a specific Instagram Direct Message with an emoji (e.g. double-tap heart "❤️", "👍", "🔥", etc.) or unreact.',
    inputSchema: {
      type: 'object',
      properties: {
        recipient_id: { type: 'string', description: 'Instagram Scoped User ID (IGSID) of the chatter.' },
        message_id: { type: 'string', description: 'Unique Message ID (mid) of the message to react to.' },
        reaction: {
          type: 'string',
          description: 'Emoji to react with (default: "❤️" for double-tap heart). Leave empty or pass action="unreact" to remove reaction.'
        },
        action: {
          type: 'string',
          enum: ['react', 'unreact'],
          description: 'Action to perform: "react" (default) or "unreact".'
        }
      },
      required: ['recipient_id', 'message_id']
    }
  },
  {
    name: 'check_user_follows_account',
    description: 'Check whether an Instagram user follows your account (Follower Verification).',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'Instagram User ID (IGSID).' }
      },
      required: ['user_id']
    }
  },
  {
    name: 'run_instagram_comment_growth_funnel',
    description: 'ManyChat/Superprofile style automated funnel: scans comments for keywords (e.g. "guide"), likes the comment, replies publicly, and DMs the guide/link with a "User Must Follow" gate.',
    inputSchema: {
      type: 'object',
      properties: {
        media_id: {
          type: 'string',
          description: 'The Instagram media ID (or pass "latest" for newest post/reel).'
        },
        keyword: {
          type: 'string',
          description: 'Trigger keyword in comments (e.g., "guide", "link"). Case-insensitive.'
        },
        public_reply_template: {
          type: 'string',
          description: 'Public reply under the comment (e.g. "Check your DM! I sent you the guide 📥").'
        },
        like_matching_comments: {
          type: 'boolean',
          description: 'Whether to auto-like matching comments (default: true).'
        },
        require_follow: {
          type: 'boolean',
          description: 'The Follow Catch: If true, checks if user follows your account before unlocking content (default: true).'
        },
        follow_gate_message: {
          type: 'string',
          description: 'Message sent if user does NOT follow (e.g. "Hey! 👋 Please follow your account first to unlock the guide! Once followed, reply DONE!").'
        },
        unlocked_content_text: {
          type: 'string',
          description: 'The message and link delivered once user is verified as a follower.'
        },
        attachment_type: {
          type: 'string',
          enum: ['file', 'image', 'audio', 'video'],
          description: 'Optional attachment type (e.g., "file" for PDF, "audio" for voice note).'
        },
        attachment_url: {
          type: 'string',
          description: 'Direct public URL to the PDF, audio file (M4A/WAV/AAC), or image.'
        },
        attachment_id: {
          type: 'string',
          description: 'Optional reusable attachment ID instead of URL.'
        }
      },
      required: ['keyword', 'unlocked_content_text']
    }
  },

  // --- 6. Advanced Business Messaging Templates ---
  {
    name: 'send_sender_action',
    description: 'Trigger sender actions in Instagram chat: typing indicator ("typing_on", "typing_off") or mark as seen ("mark_seen").',
    inputSchema: {
      type: 'object',
      properties: {
        recipient_id: { type: 'string', description: 'Instagram User ID (IGSID).' },
        action: {
          type: 'string',
          enum: ['typing_on', 'typing_off', 'mark_seen'],
          description: 'Sender action to perform.'
        }
      },
      required: ['recipient_id', 'action']
    }
  },
  {
    name: 'send_quick_replies',
    description: 'Send a message with interactive Quick Reply buttons that users can tap in Instagram DMs.',
    inputSchema: {
      type: 'object',
      properties: {
        recipient_id: { type: 'string', description: 'Instagram User ID (IGSID).' },
        message_text: { type: 'string', description: 'Question or prompt text.' },
        quick_replies: {
          type: 'array',
          description: 'Array of up to 13 quick replies.',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Button title (up to 20 chars).' },
              payload: { type: 'string', description: 'Developer payload sent back on tap.' }
            },
            required: ['title', 'payload']
          }
        }
      },
      required: ['recipient_id', 'message_text', 'quick_replies']
    }
  },
  {
    name: 'send_button_template',
    description: 'Send a Button Template message (text with up to 3 action buttons: URL links or postback triggers).',
    inputSchema: {
      type: 'object',
      properties: {
        recipient_id: { type: 'string', description: 'Instagram User ID (IGSID).' },
        text: { type: 'string', description: 'Message body text.' },
        buttons: {
          type: 'array',
          description: 'Array of up to 3 buttons.',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['web_url', 'postback'], description: 'Button type.' },
              title: { type: 'string', description: 'Button label.' },
              url: { type: 'string', description: 'Destination URL (required if type is web_url).' },
              payload: { type: 'string', description: 'Postback payload (required if type is postback).' }
            },
            required: ['type', 'title']
          }
        }
      },
      required: ['recipient_id', 'text', 'buttons']
    }
  },
  {
    name: 'send_generic_template',
    description: 'Send a Generic Template carousel card (image, title, subtitle, and action buttons) to Instagram chat.',
    inputSchema: {
      type: 'object',
      properties: {
        recipient_id: { type: 'string', description: 'Instagram User ID (IGSID).' },
        elements: {
          type: 'array',
          description: 'Carousel items (up to 10 elements).',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Card title (up to 80 chars).' },
              subtitle: { type: 'string', description: 'Card subtitle.' },
              image_url: { type: 'string', description: 'Card image URL.' },
              buttons: {
                type: 'array',
                description: 'Up to 3 buttons on the card.',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['web_url', 'postback'] },
                    title: { type: 'string' },
                    url: { type: 'string' },
                    payload: { type: 'string' }
                  },
                  required: ['type', 'title']
                }
              }
            },
            required: ['title']
          }
        }
      },
      required: ['recipient_id', 'elements']
    }
  },
  {
    name: 'send_human_agent_message',
    description: 'Send a message using the HUMAN_AGENT escalation tag (allows human agents to reply up to 7 days outside the 24-hr window).',
    inputSchema: {
      type: 'object',
      properties: {
        recipient_id: { type: 'string', description: 'Instagram User ID (IGSID).' },
        message_text: { type: 'string', description: 'The human agent response text.' }
      },
      required: ['recipient_id', 'message_text']
    }
  },
  {
    name: 'upload_reusable_attachment',
    description: 'Upload an attachment to Meta servers using Attachment Upload API to get a reusable attachment_id for fast zero-reupload DM delivery.',
    inputSchema: {
      type: 'object',
      properties: {
        attachment_type: {
          type: 'string',
          enum: ['file', 'image', 'audio', 'video'],
          description: 'Type of attachment: "file" (PDF/docs), "image", "audio", or "video".'
        },
        url: { type: 'string', description: 'Direct public URL to the file to upload.' }
      },
      required: ['attachment_type', 'url']
    }
  },

  // --- 7. Conversation Moderation ---
  {
    name: 'get_conversations',
    description: 'Fetch active Instagram direct message conversations/threads, participant IDs, and unread counts.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max number of threads to fetch (default: 10).' }
      }
    }
  },
  {
    name: 'get_conversation_messages',
    description: 'Fetch messages within a specific conversation thread on Instagram.',
    inputSchema: {
      type: 'object',
      properties: {
        conversation_id: { type: 'string', description: 'ID of the conversation thread.' },
        limit: { type: 'number', description: 'Max messages to fetch (default: 10).' }
      },
      required: ['conversation_id']
    }
  },

  // --- 8. Profile Features (Ice Breakers & Persistent Menu) ---
  {
    name: 'manage_ice_breakers',
    description: 'View, set, or delete Instagram Ice Breakers (frequently asked questions shown to new chatters).',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['get', 'set', 'delete'], description: 'Action: "get", "set", or "delete".' },
        ice_breakers: {
          type: 'array',
          description: 'Required if action is "set": List of up to 4 questions and payloads.',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string', description: 'FAQ prompt text (up to 80 chars).' },
              payload: { type: 'string', description: 'Postback payload string.' }
            },
            required: ['question', 'payload']
          }
        }
      },
      required: ['action']
    }
  },
  {
    name: 'manage_persistent_menu',
    description: 'View, set, or delete the Instagram Persistent Menu (navigation menu in the chat composer).',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['get', 'set', 'delete'], description: 'Action: "get", "set", or "delete".' },
        call_to_actions: {
          type: 'array',
          description: 'Required if action is "set": Menu items (up to 20 items).',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['web_url', 'postback'] },
              title: { type: 'string', description: 'Menu item title.' },
              url: { type: 'string', description: 'URL for web_url items.' },
              payload: { type: 'string', description: 'Payload for postback items.' }
            },
            required: ['type', 'title']
          }
        }
      },
      required: ['action']
    }
  },
  {
    name: 'generate_ig_me_link',
    description: 'Generate an ig.me short link (https://ig.me/m/your_username?ref=...) that opens Instagram DMs directly with a tracking/referral payload.',
    inputSchema: {
      type: 'object',
      properties: {
        ref_payload: {
          type: 'string',
          description: 'Optional referral code/tag (e.g., "free_guide", "bio_link", "yt_video").'
        }
      }
    }
  },

  // --- 9. Analytics & Insights ---
  {
    name: 'get_instagram_account_insights',
    description: 'Fetch account-level metrics (reach, content interactions, accounts engaged) for your account.',
    inputSchema: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28'],
          description: 'Time period for insights (default: "day").'
        }
      }
    }
  },
  {
    name: 'get_instagram_media_insights',
    description: 'Fetch post/reel metrics (reach, saved count, total interactions) for a specific Instagram post.',
    inputSchema: {
      type: 'object',
      properties: {
        media_id: { type: 'string', description: 'Instagram Media ID of the post or reel.' }
      },
      required: ['media_id']
    }
  },

  // --- 10. Threads API Automation ---
  {
    name: 'get_threads_profile',
    description: 'Fetch profile details, username, bio, and picture for your Threads account.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'Optional Threads User ID (defaults to configured THREADS_USER_ID or "me").' }
      }
    }
  },
  {
    name: 'publish_threads_post',
    description: 'Publish a post (text, image, or video) to your Threads account using the official Threads API.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The text content or caption of the thread post (up to 500 characters).' },
        media_type: {
          type: 'string',
          enum: ['TEXT', 'IMAGE', 'VIDEO'],
          description: 'Type of post: "TEXT", "IMAGE", or "VIDEO" (default: auto-detected).'
        },
        image_url: { type: 'string', description: 'Public URL to image (required if media_type is IMAGE).' },
        video_url: { type: 'string', description: 'Public URL to video (required if media_type is VIDEO).' }
      },
      required: ['text']
    }
  },
  {
    name: 'get_threads_posts',
    description: 'Fetch recent published threads and posts for your Threads account.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of recent threads to retrieve (default: 5).' }
      }
    }
  },
  {
    name: 'reply_to_threads_post',
    description: 'Publish a reply to a specific post/thread on Threads.',
    inputSchema: {
      type: 'object',
      properties: {
        thread_id: { type: 'string', description: 'The ID of the thread to reply to.' },
        text: { type: 'string', description: 'The reply text.' }
      },
      required: ['thread_id', 'text']
    }
  },
  {
    name: 'get_threads_insights',
    description: 'Fetch insights (views, likes, replies, reposts, quotes) for a specific thread or the Threads profile.',
    inputSchema: {
      type: 'object',
      properties: {
        thread_id: { type: 'string', description: 'Optional Thread ID. If omitted, fetches account-level metrics.' }
      }
    }
  }
];

// Tool Execution Logic
async function callTool(name, args) {
  switch (name) {
    // 1. Profile Tools
    case 'get_page_profile': {
      const res = await graphRequest(`/${PAGE_ID}?fields=id,name,fan_count,followers_count,category,link,about`);
      return JSON.stringify(res, null, 2);
    }
    case 'get_instagram_profile': {
      const res = await graphRequest(`/${INSTAGRAM_ID}?fields=id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url`);
      return JSON.stringify(res, null, 2);
    }
    case 'get_user_profile': {
      const res = await graphRequest(`/${args.user_id}?fields=name,username,profile_pic,follower_count,is_user_follow_business,is_business_follow_user`);
      return JSON.stringify(res, null, 2);
    }

    // 2. Publishing Tools
    case 'publish_facebook_post': {
      const postData = { message: args.message };
      if (args.link) postData.link = args.link;
      const res = await graphRequest(`/${PAGE_ID}/feed`, 'POST', postData);
      return JSON.stringify({ success: true, post_id: res.id, message: 'Facebook post published!' }, null, 2);
    }
    case 'publish_facebook_photo': {
      const postData = { url: args.photo_url };
      if (args.caption) postData.caption = args.caption;
      const res = await graphRequest(`/${PAGE_ID}/photos`, 'POST', postData);
      return JSON.stringify({ success: true, post_id: res.id, message: 'Facebook photo published!' }, null, 2);
    }
    case 'publish_instagram_photo': {
      const container = await graphRequest(`/${INSTAGRAM_ID}/media`, 'POST', {
        image_url: args.image_url,
        caption: args.caption || ''
      });
      const publish = await graphRequest(`/${INSTAGRAM_ID}/media_publish`, 'POST', {
        creation_id: container.id
      });
      return JSON.stringify({
        success: true,
        instagram_media_id: publish.id,
        creation_id: container.id,
        message: 'Instagram photo published!'
      }, null, 2);
    }
    case 'publish_instagram_reel': {
      const container = await graphRequest(`/${INSTAGRAM_ID}/media`, 'POST', {
        media_type: 'REELS',
        video_url: args.video_url,
        caption: args.caption || ''
      });
      await new Promise(r => setTimeout(r, 5000));
      const publish = await graphRequest(`/${INSTAGRAM_ID}/media_publish`, 'POST', {
        creation_id: container.id
      });
      return JSON.stringify({
        success: true,
        instagram_reel_id: publish.id,
        creation_id: container.id,
        message: 'Instagram reel published!'
      }, null, 2);
    }

    // 3. Media Listing
    case 'get_facebook_posts': {
      const limit = args && args.limit ? args.limit : 5;
      const res = await graphRequest(`/${PAGE_ID}/posts?fields=id,message,created_time,permalink_url&limit=${limit}`);
      return JSON.stringify(res.data || res, null, 2);
    }
    case 'get_instagram_media': {
      const limit = args && args.limit ? args.limit : 5;
      const res = await graphRequest(`/${INSTAGRAM_ID}/media?fields=id,caption,media_type,permalink,timestamp,like_count,comments_count&limit=${limit}`);
      return JSON.stringify(res.data || res, null, 2);
    }

    // 4. Comments Automation
    case 'get_media_comments': {
      const limit = args && args.limit ? args.limit : 15;
      const res = await graphRequest(`/${args.media_id}/comments?fields=id,text,timestamp,username,like_count,from&limit=${limit}`);
      return JSON.stringify(res.data || res, null, 2);
    }
    case 'reply_to_comment': {
      const res = await graphRequest(`/${args.comment_id}/replies`, 'POST', {
        message: args.message
      });
      return JSON.stringify({ success: true, reply_id: res.id, message: 'Replied to comment successfully!' }, null, 2);
    }
    case 'like_comment': {
      const res = await graphRequest(`/${INSTAGRAM_ID}/likes`, 'POST', {
        comment_id: args.comment_id
      });
      return JSON.stringify({ success: true, message: 'Comment liked successfully!' }, null, 2);
    }

    // 5. Direct Messaging & Private Replies
    case 'send_instagram_private_reply': {
      const payload = {
        recipient: { comment_id: args.comment_id },
        message: { text: args.message_text }
      };
      const res = await graphRequest(`/${PAGE_ID}/messages`, 'POST', payload, true);
      return JSON.stringify({ success: true, result: res, message: 'Private reply DM sent to commenter!' }, null, 2);
    }
    case 'send_instagram_dm': {
      const messageObj = {};
      if (args.message_text) messageObj.text = args.message_text;
      if (args.attachment_type) {
        if (args.attachment_id) {
          messageObj.attachment = {
            type: args.attachment_type,
            payload: {
              attachment_id: args.attachment_id
            }
          };
        } else if (args.attachment_url) {
          messageObj.attachment = {
            type: args.attachment_type,
            payload: {
              url: args.attachment_url,
              is_reusable: true
            }
          };
        }
      }
      const payload = {
        recipient: { id: args.recipient_id },
        message: messageObj
      };
      if (args.reply_to_message_id) {
        payload.reply_to = { mid: args.reply_to_message_id };
      }
      const res = await graphRequest(`/${PAGE_ID}/messages`, 'POST', payload, true);
      return JSON.stringify({ success: true, result: res, message: 'Instagram DM sent successfully!' }, null, 2);
    }
    case 'react_to_message': {
      const action = args.action || 'react';
      const reactionPayload = {
        message_id: args.message_id
      };
      if (action === 'react') {
        reactionPayload.reaction = args.reaction || '❤️';
      }
      const payload = {
        recipient: { id: args.recipient_id },
        sender_action: action,
        payload: reactionPayload
      };
      const res = await graphRequest(`/${PAGE_ID}/messages`, 'POST', payload, true);
      return JSON.stringify({
        success: true,
        action: action,
        reaction: action === 'react' ? (args.reaction || '❤️') : null,
        message_id: args.message_id,
        recipient_id: args.recipient_id,
        result: res
      }, null, 2);
    }
    case 'check_user_follows_account': {
      try {
        const res = await graphRequest(`/${args.user_id}?fields=is_user_follow_business,is_business_follow_user,name,username`);
        return JSON.stringify({
          user_id: args.user_id,
          username: res.username || '',
          name: res.name || '',
          is_user_follow_business: Boolean(res.is_user_follow_business),
          status: res.is_user_follow_business ? 'FOLLOWING' : 'NOT_FOLLOWING'
        }, null, 2);
      } catch (err) {
        return JSON.stringify({
          user_id: args.user_id,
          is_user_follow_business: false,
          status: 'UNVERIFIED',
          note: 'Profile query requires active user conversation consent.'
        }, null, 2);
      }
    }
    case 'run_instagram_comment_growth_funnel': {
      let targetMediaId = args.media_id;
      if (!targetMediaId || targetMediaId.toLowerCase() === 'latest') {
        const mediaRes = await graphRequest(`/${INSTAGRAM_ID}/media?fields=id&limit=1`);
        if (!mediaRes.data || mediaRes.data.length === 0) {
          throw new Error('No media posts found on the Instagram account.');
        }
        targetMediaId = mediaRes.data[0].id;
      }

      const keywordLower = args.keyword.trim().toLowerCase();
      const commentsRes = await graphRequest(`/${targetMediaId}/comments?fields=id,text,timestamp,username,from&limit=25`);
      const allComments = commentsRes.data || [];

      const matchingComments = allComments.filter(c => {
        const text = (c.text || '').toLowerCase();
        return text.includes(keywordLower);
      });

      const processed = [];
      const followGatePrompt = args.follow_gate_message || `Hey! 👋 Thanks for commenting on your account! To unlock your exclusive content/guide, please follow your account first! Once followed, reply 'DONE' here to get it 🎁`;

      for (const comment of matchingComments) {
        const commentId = comment.id;
        const commenterUsername = comment.username || (comment.from ? comment.from.username : 'there');
        const commenterId = comment.from ? comment.from.id : null;

        const actionLog = {
          comment_id: commentId,
          username: commenterUsername,
          comment_text: comment.text,
          liked: false,
          public_reply_sent: false,
          dm_sent: false,
          status: ''
        };

        if (args.like_matching_comments !== false) {
          try {
            await graphRequest(`/${INSTAGRAM_ID}/likes`, 'POST', { comment_id: commentId });
            actionLog.liked = true;
          } catch (e) {
            actionLog.like_error = e.message;
          }
        }

        if (args.public_reply_template) {
          try {
            const replyText = args.public_reply_template.replace('{username}', commenterUsername);
            await graphRequest(`/${commentId}/replies`, 'POST', { message: replyText });
            actionLog.public_reply_sent = true;
          } catch (e) {
            actionLog.public_reply_error = e.message;
          }
        }

        let isFollowing = false;
        if (args.require_follow !== false && commenterId) {
          try {
            const userCheck = await graphRequest(`/${commenterId}?fields=is_user_follow_business`);
            isFollowing = Boolean(userCheck.is_user_follow_business);
          } catch (e) {
            isFollowing = false;
          }
        } else {
          isFollowing = true;
        }

        try {
          if (!isFollowing && args.require_follow !== false) {
            const gateText = followGatePrompt.replace('{username}', commenterUsername);
            await graphRequest(`/${PAGE_ID}/messages`, 'POST', {
              recipient: { comment_id: commentId },
              message: { text: gateText }
            }, true);
            actionLog.dm_sent = true;
            actionLog.status = 'FOLLOW_GATE_SENT (Must follow your account)';
          } else {
            const unlockedText = args.unlocked_content_text.replace('{username}', commenterUsername);
            const messageObj = { text: unlockedText };

            if (args.attachment_type) {
              if (args.attachment_id) {
                messageObj.attachment = {
                  type: args.attachment_type,
                  payload: {
                    attachment_id: args.attachment_id
                  }
                };
              } else if (args.attachment_url) {
                messageObj.attachment = {
                  type: args.attachment_type,
                  payload: {
                    url: args.attachment_url,
                    is_reusable: true
                  }
                };
              }
            }

            await graphRequest(`/${PAGE_ID}/messages`, 'POST', {
              recipient: { comment_id: commentId },
              message: messageObj
            }, true);
            actionLog.dm_sent = true;
            actionLog.status = 'UNLOCKED_CONTENT_SENT';
          }
        } catch (e) {
          actionLog.dm_error = e.message;
          actionLog.status = 'DM_FAILED';
        }

        processed.push(actionLog);
      }

      return JSON.stringify({
        media_id: targetMediaId,
        keyword: args.keyword,
        total_comments_checked: allComments.length,
        matching_comments_found: matchingComments.length,
        processed_count: processed.length,
        results: processed
      }, null, 2);
    }

    // 6. Advanced Templates & Sender Actions
    case 'send_sender_action': {
      const payload = {
        recipient: { id: args.recipient_id },
        sender_action: args.action
      };
      const res = await graphRequest(`/${PAGE_ID}/messages`, 'POST', payload, true);
      return JSON.stringify({ success: true, result: res, action: args.action }, null, 2);
    }
    case 'send_quick_replies': {
      const qrs = args.quick_replies.map(q => ({
        content_type: 'text',
        title: q.title,
        payload: q.payload
      }));
      const payload = {
        recipient: { id: args.recipient_id },
        message: {
          text: args.message_text,
          quick_replies: qrs
        }
      };
      const res = await graphRequest(`/${PAGE_ID}/messages`, 'POST', payload, true);
      return JSON.stringify({ success: true, result: res }, null, 2);
    }
    case 'send_button_template': {
      const payload = {
        recipient: { id: args.recipient_id },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: args.text,
              buttons: args.buttons
            }
          }
        }
      };
      const res = await graphRequest(`/${PAGE_ID}/messages`, 'POST', payload, true);
      return JSON.stringify({ success: true, result: res }, null, 2);
    }
    case 'send_generic_template': {
      const payload = {
        recipient: { id: args.recipient_id },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: args.elements
            }
          }
        }
      };
      const res = await graphRequest(`/${PAGE_ID}/messages`, 'POST', payload, true);
      return JSON.stringify({ success: true, result: res }, null, 2);
    }
    case 'send_human_agent_message': {
      const payload = {
        recipient: { id: args.recipient_id },
        message: { text: args.message_text },
        tag: 'HUMAN_AGENT'
      };
      const res = await graphRequest(`/${PAGE_ID}/messages`, 'POST', payload, true);
      return JSON.stringify({ success: true, result: res, tag: 'HUMAN_AGENT' }, null, 2);
    }
    case 'upload_reusable_attachment': {
      const payload = {
        platform: 'instagram',
        message: {
          attachment: {
            type: args.attachment_type,
            payload: {
              is_reusable: true,
              url: args.url
            }
          }
        }
      };
      const res = await graphRequest(`/${PAGE_ID}/message_attachments`, 'POST', payload, true);
      return JSON.stringify({ success: true, attachment_id: res.attachment_id, result: res }, null, 2);
    }

    // 7. Conversation Moderation
    case 'get_conversations': {
      const limit = args && args.limit ? args.limit : 10;
      const res = await graphRequest(`/${PAGE_ID}/conversations?platform=instagram&fields=id,updated_time,unread_count,participants&limit=${limit}`);
      return JSON.stringify(res.data || res, null, 2);
    }
    case 'get_conversation_messages': {
      const limit = args && args.limit ? args.limit : 10;
      const res = await graphRequest(`/${args.conversation_id}/messages?fields=id,message,created_time,from,attachments&limit=${limit}`);
      return JSON.stringify(res.data || res, null, 2);
    }

    // 8. Ice Breakers, Persistent Menu, ig.me Links
    case 'manage_ice_breakers': {
      if (args.action === 'get') {
        const res = await graphRequest(`/${PAGE_ID}/messenger_profile?fields=ice_breakers&platform=instagram`);
        return JSON.stringify(res, null, 2);
      } else if (args.action === 'set') {
        const payload = {
          platform: 'instagram',
          ice_breakers: args.ice_breakers
        };
        const res = await graphRequest(`/${PAGE_ID}/messenger_profile`, 'POST', payload, true);
        return JSON.stringify({ success: true, result: res, message: 'Ice Breakers configured successfully!' }, null, 2);
      } else if (args.action === 'delete') {
        const payload = {
          platform: 'instagram',
          fields: ['ice_breakers']
        };
        const res = await graphRequest(`/${PAGE_ID}/messenger_profile`, 'DELETE', payload, true);
        return JSON.stringify({ success: true, result: res, message: 'Ice Breakers removed.' }, null, 2);
      }
      break;
    }
    case 'manage_persistent_menu': {
      if (args.action === 'get') {
        const res = await graphRequest(`/${PAGE_ID}/messenger_profile?fields=persistent_menu&platform=instagram`);
        return JSON.stringify(res, null, 2);
      } else if (args.action === 'set') {
        const payload = {
          platform: 'instagram',
          persistent_menu: [
            {
              locale: 'default',
              composer_input_disabled: false,
              call_to_actions: args.call_to_actions
            }
          ]
        };
        const res = await graphRequest(`/${PAGE_ID}/messenger_profile`, 'POST', payload, true);
        return JSON.stringify({ success: true, result: res, message: 'Persistent menu configured!' }, null, 2);
      } else if (args.action === 'delete') {
        const payload = {
          platform: 'instagram',
          fields: ['persistent_menu']
        };
        const res = await graphRequest(`/${PAGE_ID}/messenger_profile`, 'DELETE', payload, true);
        return JSON.stringify({ success: true, result: res, message: 'Persistent menu removed.' }, null, 2);
      }
      break;
    }
    case 'generate_ig_me_link': {
      let link = `https://ig.me/m/${INSTAGRAM_USERNAME}`;
      if (args && args.ref_payload) {
        link += `?ref=${encodeURIComponent(args.ref_payload)}`;
      }
      return JSON.stringify({
        username: INSTAGRAM_USERNAME,
        ig_me_url: link,
        ref_payload: args && args.ref_payload ? args.ref_payload : null,
        description: 'Tapping this link immediately opens a DM chat with your account with tracking referral payload.'
      }, null, 2);
    }

    // 9. Analytics & Insights
    case 'get_instagram_account_insights': {
      const period = args && args.period ? args.period : 'day';
      const res = await graphRequest(`/${INSTAGRAM_ID}/insights?metric=reach,total_interactions,accounts_engaged&period=${period}&metric_type=total_value`);
      return JSON.stringify(res.data || res, null, 2);
    }
    case 'get_instagram_media_insights': {
      const res = await graphRequest(`/${args.media_id}/insights?metric=reach,saved,total_interactions`);
      return JSON.stringify(res.data || res, null, 2);
    }

    // 10. Threads API Tools
    case 'get_threads_profile': {
      const targetId = (args && args.user_id) || THREADS_USER_ID || 'me';
      const res = await threadsRequest(`/${targetId}?fields=id,username,name,threads_profile_picture_url,threads_biography`);
      return JSON.stringify(res, null, 2);
    }
    case 'publish_threads_post': {
      const targetId = (args && args.user_id) || THREADS_USER_ID || 'me';
      const mediaType = args.media_type || (args.image_url ? 'IMAGE' : args.video_url ? 'VIDEO' : 'TEXT');
      const containerData = {
        media_type: mediaType,
        text: args.text
      };
      if (args.image_url) containerData.image_url = args.image_url;
      if (args.video_url) containerData.video_url = args.video_url;

      // Step 1: Create Container
      const container = await threadsRequest(`/${targetId}/threads`, 'POST', containerData);
      const creationId = container.id;

      // Wait 3-4s for media processing if video/image
      if (mediaType !== 'TEXT') {
        await new Promise(r => setTimeout(r, 4000));
      }

      // Step 2: Publish Container
      const publish = await threadsRequest(`/${targetId}/threads_publish`, 'POST', {
        creation_id: creationId
      });

      return JSON.stringify({
        success: true,
        thread_id: publish.id,
        creation_id: creationId,
        message: 'Thread post published successfully to Threads!'
      }, null, 2);
    }
    case 'get_threads_posts': {
      const targetId = (args && args.user_id) || THREADS_USER_ID || 'me';
      const limit = (args && args.limit) || 5;
      const res = await threadsRequest(`/${targetId}/threads?fields=id,media_type,permalink,text,timestamp,shortcode&limit=${limit}`);
      return JSON.stringify(res.data || res, null, 2);
    }
    case 'reply_to_threads_post': {
      const targetId = (args && args.user_id) || THREADS_USER_ID || 'me';
      const containerData = {
        media_type: 'TEXT',
        text: args.text,
        reply_to_id: args.thread_id
      };
      const container = await threadsRequest(`/${targetId}/threads`, 'POST', containerData);
      const publish = await threadsRequest(`/${targetId}/threads_publish`, 'POST', {
        creation_id: container.id
      });
      return JSON.stringify({
        success: true,
        reply_id: publish.id,
        thread_id: args.thread_id,
        message: 'Replied to thread successfully!'
      }, null, 2);
    }
    case 'get_threads_insights': {
      const targetId = (args && args.thread_id) || THREADS_USER_ID || 'me';
      const metrics = args && args.thread_id ? 'views,likes,replies,reposts,quotes' : 'views,likes,replies,reposts,quotes,followers_count';
      const res = await threadsRequest(`/${targetId}/threads_insights?metric=${metrics}`);
      return JSON.stringify(res.data || res, null, 2);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Stdio JSON-RPC MCP Server Loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request;
  try {
    request = JSON.parse(trimmed);
  } catch (e) {
    console.error('Invalid JSON received:', trimmed);
    return;
  }

  const { id, method, params } = request;

  if (id === undefined || id === null) {
    if (method === 'notifications/initialized') {
      console.error('Meta Social Technologies MCP Server v4.0 initialized (45 Enterprise Tools active).');
    }
    return;
  }

  try {
    switch (method) {
      case 'initialize':
        send({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: {
              name: 'meta_social_technologies',
              version: '4.0.0'
            }
          }
        });
        break;

      case 'ping':
        send({ jsonrpc: '2.0', id, result: {} });
        break;

      case 'tools/list':
        send({
          jsonrpc: '2.0',
          id,
          result: { tools: TOOLS }
        });
        break;

      case 'tools/call': {
        const { name, arguments: args } = params || {};
        try {
          const output = await callTool(name, args);
          send({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: output }]
            }
          });
        } catch (err) {
          send({
            jsonrpc: '2.0',
            id,
            result: {
              isError: true,
              content: [{ type: 'text', text: `Error calling ${name}: ${err.message}` }]
            }
          });
        }
        break;
      }

      default:
        send({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        });
        break;
    }
  } catch (err) {
    send({
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: err.message }
    });
  }
});

console.error('Meta Social Technologies MCP Server v4.0 listening on stdio (45 Enterprise Tools active).');
