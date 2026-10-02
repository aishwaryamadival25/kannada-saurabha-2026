# Kannada Saurabha 2026 — Web App with Supabase Backend & Admin Dashboard

This project is the official **Kannada Saurabha 2026 (ಕನ್ನಡ ಸೌರಭ ೨೦೨೬)** website for HKBK Group of Institutions, migrated from client-only local storage to a centralized, production-grade **Supabase PostgreSQL database**, **Supabase Auth**, **Row Level Security (RLS)**, and an **Admin Dashboard**.

---

## 🏛 Architecture & Public / Admin Separation

1. **Public Website (`index.html`)**:
   - Reads directly from Supabase via public anonymous client.
   - Read-only experience: **No editing, adding, or deleting buttons** are visible to general visitors.
   - Preserves 100% of the original design, typography, colors, animations, responsive layout, and bilingual English/Kannada display.
   - Falls back gracefully to offline/built-in defaults if Supabase is not yet configured.

2. **Admin Portal (`/admin` / `admin/index.html` / `admin.html`)**:
   - Secure login via Supabase Authentication (Email & Password).
   - Enforces role verification through the `admin_profiles` table.
   - Content management across 11 key sections:
     1. **Home Content** (Hero tagline, dates, descriptions, institutional details)
     2. **Events** (Title, Date, Time, Venue, Descriptions, Images, Coordinators)
     3. **Karnataka Conclave / VTU Faculty** (Professors, designations, institutions, contacts, photos)
     4. **Student Committee** (Members, roles, contact numbers)
     5. **Management Committee** (Leadership, roles, contact numbers)
     6. **Guests** (Dignitaries, designations, organizations, bios, photos)
     7. **Sponsorship Packages** (Title, amount, description, benefits)
     8. **Our Sponsors** (Company, sponsor name, package, amount, logos)
     9. **Gallery** (Photos & Videos with category filters and Supabase Storage uploads)
     10. **Venue** (Auditorium name, address, Google Maps link, venue image)
     11. **Schedule** (Program timeline, time slots, activity descriptions)
   - **One-Click LocalStorage Migration**: Automatically imports existing browser data into Supabase tables without data loss or duplicates.
   - **English → Kannada Meaningful Translation**: Preserves real semantic translations (not phonetics/transliteration) for titles, roles, descriptions, and benefits.

---

## 🔐 CRITICAL SECURITY NOTICE — KEYS THAT MUST NEVER BE EXPOSED

> [!CAUTION]
> **NEVER** expose your Supabase **`service_role`** key or any database secret password in frontend JavaScript, HTML, GitHub repositories, or client-accessible files.
>
> **What is safe on the frontend:**
> - `SUPABASE_URL` (e.g. `https://xyzproject.supabase.co`)
> - `SUPABASE_ANON_KEY` / publishable key (designed specifically to identify public client requests and governed by Row Level Security)
>
> All permissions and restrictions are strictly enforced at the database engine level via **Row Level Security (RLS)**.

---

## 🚀 Supabase Setup Guide (Step-by-Step)

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account or sign in.
2. Click **New Project**.
3. Choose your organization, assign a project name (e.g. `kannada-saurabha-2026`), choose a secure database password, and select the region closest to your audience (e.g., `South Asia (Mumbai)`).
4. Wait for the database provisioning to complete (typically ~1-2 minutes).

### Step 2: Run the SQL Schema
1. In the Supabase project dashboard, open the **SQL Editor** from the left navigation bar.
2. Click **New Query**.
3. Open [`supabase/schema.sql`](file:///Users/chittaranjanhosmani/Downloads/kannada-vaibhava-2026-antigravity-ready/supabase/schema.sql) from this project repository, copy its entire contents, and paste them into the SQL editor.
4. Click **Run** (or press `Cmd/Ctrl + Enter`).
5. This script will automatically:
   - Create all 12 tables (`admin_profiles`, `home_content`, `events`, `event_coordinators`, `conclave_professors`, `student_committee`, `management_committee`, `guests`, `sponsorship_packages`, `sponsors`, `gallery`, `venue`, `schedule`).
   - Enable **Row Level Security (RLS)** on all tables.
   - Create public read-only policies (`SELECT`) for all visitors.
   - Create the `is_admin()` security function.
   - Create admin-only write policies (`INSERT`, `UPDATE`, `DELETE`) checked against `admin_profiles`.
   - Seed default initial content (events, professors, committees, gallery, venue, schedule).
   - Set up the public `media` storage bucket policies.

### Step 3: Verify the Storage Bucket
1. In the Supabase dashboard, click **Storage** in the sidebar.
2. Verify that a bucket named **`media`** exists and is marked as **Public**.
3. If it was not created automatically, click **New Bucket**, name it `media`, toggle **Public bucket** to ON, and save.

### Step 4: Create the First Admin User
1. In the Supabase dashboard, click **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your admin email (e.g. `admin@hkbk.edu.in`) and a secure password.
4. Toggle **Auto Confirm User?** to ON (so email verification is not required for immediate login).
5. Click **Create User**.
6. In the user list, copy the **User UID** (a UUID like `e3b2c1a0-4f5d-6e7a-8b9c-0d1e2f3a4b5c`).

### Step 5: Authorize Admin Profile
1. Return to the **SQL Editor** in Supabase.
2. Run the following SQL query, replacing the email and UUID with your created user's values:
   ```sql
   INSERT INTO public.admin_profiles (user_id, email, role)
   VALUES ('YOUR_COPIED_USER_UID_HERE', 'admin@hkbk.edu.in', 'admin')
   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
   ```
3. Your admin user is now fully authorized to manage website content!

### Step 6: Configure Project Credentials
1. In Supabase, navigate to **Project Settings** (gear icon) -> **API**.
2. Copy your:
   - **Project URL**
   - **Project API Keys** -> `anon` / `public` key
3. Open [`js/supabase-config.js`](file:///Users/chittaranjanhosmani/Downloads/kannada-vaibhava-2026-antigravity-ready/js/supabase-config.js) in this project.
4. Replace the placeholder values:
   ```javascript
   const SUPABASE_CONFIG = {
     url: 'https://YOUR_PROJECT_ID.supabase.co',
     anonKey: 'YOUR_SUPABASE_ANON_KEY',
     storageBucket: 'media'
   };
   ```
5. *(Optional convenience)*: You can also paste these credentials directly on the Admin Login page UI if you haven't edited the file yet—they will be saved in your browser's session storage.

---

## 💻 Running Locally

Run a local HTTP server to preview the site and test the admin dashboard:

```bash
# Using Python 3
python3 -m http.server 8000
```

- **Public Site**: Open [http://localhost:8000/index.html](http://localhost:8000/index.html)
- **Admin Portal**: Open [http://localhost:8000/admin/index.html](http://localhost:8000/admin/index.html) or [http://localhost:8000/admin.html](http://localhost:8000/admin.html)

---

## 🔄 One-Click LocalStorage Migration

If you have pre-existing events, committee members, or sponsors stored in your browser's `localStorage` from previous sessions:
1. Log in to the Admin Dashboard at `http://localhost:8000/admin/index.html`.
2. Scroll to the bottom of the left sidebar to the **Data Migration** section.
3. The dashboard will show the count of records found in your browser's localStorage.
4. Click **"Import LocalStorage into Supabase"**.
5. The migration tool uploads the records to their respective Supabase tables while skipping duplicates and preserving all English and Kannada fields.

---

## 🌐 Public Deployment

This project consists of static files (HTML, CSS, JS, assets) and can be hosted on any modern static hosting platform:

### 1. Vercel
```bash
npx vercel
```
*Note*: No server build steps required. The directory serves statically.

### 2. Netlify
Drag and drop the project folder into Netlify Drop, or connect via Git. Ensure the publish directory is the repository root.

### 3. Firebase Hosting / Cloudflare Pages / GitHub Pages
Deploy directly using their respective CLI or web dashboard.

---

## 📁 Project Directory Structure

```
kannada-vaibhava-2026/
├── index.html                 # Main public website (Read-only for visitors)
├── admin.html                 # Admin portal redirect
├── admin/
│   ├── index.html             # Admin Dashboard UI
│   ├── admin.css              # Admin Dashboard styling (isolated from public site)
│   └── admin.js               # Admin controller, Auth, CRUD & Translation
├── css/
│   └── style.css              # Original public website stylesheet
├── js/
│   ├── script.js              # Public site UI, timers, modals & Supabase integration
│   ├── supabase-config.js     # Supabase URL & publishable key configuration
│   └── supabase-data.js       # Centralized Supabase data client & offline fallback
├── supabase/
│   └── schema.sql             # Complete PostgreSQL schema, RLS policies & seed data
├── assets/
│   ├── images/                # Extracted and user-provided image assets
│   └── videos/                # Embedded video assets
└── README.md                  # This documentation
```
