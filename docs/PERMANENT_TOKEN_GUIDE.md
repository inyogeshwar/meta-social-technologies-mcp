# Meta Permanent (Lifetime) Access Token Guide

Author: **Yogeshwar Kumar** ([YouTube Tutorial](https://www.youtube.com/watch?v=CzsbItgqRlg) | [GitHub: @inyogeshwar](https://github.com/inyogeshwar))

This guide details how to generate a **permanent, never-expiring Meta Page & Instagram Access Token** using Meta Business Suite System Users and Graph API Explorer.

---

## 1. Prerequisites
- Personal Facebook Account with Admin access to your Facebook Page.
- Facebook Page (e.g., `Your Facebook Page`, Page ID: `YOUR_PAGE_ID`).
- Instagram Professional (Business/Creator) account linked to the Facebook Page.
- Meta Business Portfolio ([business.facebook.com](https://business.facebook.com)).
- Meta Developer App ([developers.facebook.com](https://developers.facebook.com)).

---

## 2. Step-by-Step Walkthrough

### Step 1: Link Instagram to Your Facebook Page
1. Switch into your **Facebook Page profile** on Facebook.
2. Navigate to **Settings & Privacy** > **Settings** > **Linked Accounts**.
3. Select **Instagram** > **Connect Account** and log in to link your Instagram account.

### Step 2: Add Assets to Your Meta Business Portfolio
1. Go to [business.facebook.com](https://business.facebook.com) > **Business Settings**.
2. Under **Accounts**:
   - **Pages**: Add your Facebook Page.
   - **Instagram Accounts**: Confirm your Instagram account is listed.
   - **Apps**: Link your Meta Developer App.

### Step 3: Create a System User & Assign Assets
1. Under **Users** in Business Settings, click **System Users**.
2. Click **Add** to create an Admin System User (e.g., `automation_user`).
3. Click **Assign Assets**:
   - **Pages**: Select your Page -> Toggle **Full Control** (Manage Page).
   - **Apps**: Select your App -> Toggle **Full Control**.
   - **Instagram Accounts**: Select your Instagram Account -> Toggle **Full Control**.
4. Click **Save Changes**.

### Step 4: Generate the Permanent System User Token
1. In **System Users**, click **Generate Token** for your assigned App.
2. **Token Expiry**: Select **Never** (Lifetime).
3. **Select Permissions**:
   - `instagram_basic`
   - `instagram_content_publish`
   - `instagram_manage_comments`
   - `instagram_manage_insights`
   - `instagram_manage_messages`
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_manage_engagement`
   - `pages_read_user_content`
   - `pages_messaging`
   - `business_management`
4. Click **Generate Token** and copy the string.

### Step 5: Exchange for Page & Instagram Permanent Token
1. Open the [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/).
2. Select your Meta App in the top dropdown.
3. Paste the System User Token into the **Access Token** field.
4. Set the API request to:
   ```http
   GET me/accounts
   ```
5. Click **Submit**.
6. The JSON response returns your Facebook Page details:
   ```json
   {
     "data": [
       {
         "access_token": "YOUR_PERMANENT_PAGE_ACCESS_TOKEN",
         "category": "Creator",
         "name": "Your Page Name",
         "id": "123456789012345"
       }
     ]
   }
   ```
7. Copy the `access_token` inside the `data` array. **This is your permanent, never-expiring Page + Instagram Access Token.**
8. Verify at [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken). Confirm that **Expires: Never**.
