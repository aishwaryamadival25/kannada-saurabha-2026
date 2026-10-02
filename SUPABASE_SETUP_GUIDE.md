# Kannada Saurabha 2026 — Supabase Setup & Deployment Guide

This guide details the final manual configuration steps required to connect your **Kannada Saurabha 2026** website to your real Supabase project.

---

## ⚠️ CRITICAL SECURITY WARNING

> [!CAUTION]
> **NEVER** expose or insert your Supabase **`service_role`** key or any database secret password into frontend JavaScript, HTML, GitHub repositories, or client-accessible files.
>
> You must **ONLY** use:
> - **Project URL**
> - **anon (public)** publishable key
>
> All security and access control is enforced directly by PostgreSQL **Row Level Security (RLS)**.

---

## Step-by-Step Setup Guide

### Step 1: Create a Supabase Project
1. Log in to [https://supabase.com](https://supabase.com) and click **New Project**.
2. Name your project (e.g. `kannada-saurabha-2026`).
3. Set a strong database password and select the region nearest your users (e.g. `South Asia (Mumbai)`).
4. Wait ~1–2 minutes for the database to provision.

---

### Step 2: Open SQL Editor & Run Schema
1. In the left navigation of your Supabase dashboard, click the **SQL Editor** icon.
2. Click **New Query**.
3. Open [`supabase/schema.sql`](file:///Users/chittaranjanhosmani/Downloads/kannada-vaibhava-2026-antigravity-ready/supabase/schema.sql) from this project workspace.
4. Copy its entire content, paste it into the Supabase SQL editor, and click **Run**.
5. This automatically:
   - Creates all 12 tables (`admin_profiles`, `home_content`, `events`, `event_coordinators`, `conclave_professors`, `student_committee`, `management_committee`, `guests`, `sponsorship_packages`, `sponsors`, `gallery`, `venue`, `schedule`).
   - Enables **Row Level Security (RLS)** across all tables.
   - Enforces public `SELECT` policies for anonymous visitors.
   - Enforces admin-only `INSERT`, `UPDATE`, and `DELETE` policies tied to `admin_profiles.role = 'admin'`.
   - Sets up the public `media` storage bucket and RLS policies.
   - Seeds default website data.

---

### Step 3: Create the Admin User
1. In your Supabase dashboard, navigate to **Authentication** > **Users**.
2. Click **Add User** > **Create User**.
3. Enter your administrator email (e.g. `admin@hkbk.edu.in`) and a secure password.
4. Toggle **Auto Confirm User?** to **ON**.
5. Click **Create User**.

---

### Step 4: Copy Admin User UUID
1. In the user list under **Authentication** > **Users**, locate the admin account you just created.
2. Click the copy icon next to the **User UID** (a UUID like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

---

### Step 5: Authorize Admin Profile
1. Return to the **SQL Editor** in your Supabase dashboard.
2. Run the following SQL query, replacing the placeholders with your copied UUID and email:

```sql
INSERT INTO public.admin_profiles (user_id, email, role)
VALUES (
  'YOUR_ADMIN_USER_UUID',
  'YOUR_ADMIN_EMAIL',
  'admin'
)
ON CONFLICT (user_id)
DO UPDATE SET
  email = EXCLUDED.email,
  role = 'admin';
```

---

### Step 6: Copy Supabase Project Credentials
1. In your Supabase dashboard, navigate to **Project Settings** (gear icon) > **API**.
2. Copy your:
   - **Project URL** (e.g. `https://yourprojectid.supabase.co`)
   - **Project API Keys** > `anon` / `public` key

---

### Step 7: Configure Frontend Credentials
1. Open [`js/supabase-config.js`](file:///Users/chittaranjanhosmani/Downloads/kannada-vaibhava-2026-antigravity-ready/js/supabase-config.js).
2. Replace the placeholders with your copied credentials:

```javascript
// <<< PASTE YOUR SUPABASE PROJECT URL HERE >>>
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

// <<< PASTE YOUR SUPABASE PUBLISHABLE (ANON) KEY HERE >>>
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_PUBLIC_ANON_OR_PUBLISHABLE_KEY";
```

*(Save the file after replacing the placeholders with your real URL and anon key).*

---

### Step 8: Run the Website Locally
Start a local static web server from the project directory:

```bash
# Using Python 3
python3 -m http.server 8000
```

---

### Step 9: Test Public Website
1. Open [http://localhost:8000/index.html](http://localhost:8000/index.html).
2. Confirm the website loads without requiring login.
3. Verify that all content renders and that NO Add/Edit/Delete buttons appear for visitors.

---

### Step 10: Test Admin Portal (`/admin`)
1. Open [http://localhost:8000/admin/index.html](http://localhost:8000/admin/index.html) or [http://localhost:8000/admin.html](http://localhost:8000/admin.html).
2. Attempt logging in with incorrect credentials → verify it fails.
3. Log in with your admin credentials created in Step 3 → verify the Admin Dashboard opens.

---

### Step 11: Test Content Management (CRUD)
In the Admin Dashboard:
1. Go to **Events** > click **+ Add New Event**.
2. Enter an English title (e.g., `Kannada Debate`) and click **Translate to Kannada** → confirm semantic Kannada translation appears.
3. Save the event → verify success notification.
4. Open the public page [http://localhost:8000/index.html#events](http://localhost:8000/index.html#events) → confirm the new event appears.
5. Refresh the browser → verify the event persists directly from Supabase.
6. Return to Admin, edit or delete the event → confirm the change reflects on the public site.
7. Click **Sign Out** in Admin → verify you are logged out and redirected to login.

---

### Step 12: Public Deployment
Deploy the project directory to any static web hosting provider:
- **Vercel**: Run `npx vercel` in this folder
- **Netlify**: Drag-and-drop the folder or link via GitHub
- **Cloudflare Pages / Firebase Hosting / GitHub Pages**: Deploy directory directly
