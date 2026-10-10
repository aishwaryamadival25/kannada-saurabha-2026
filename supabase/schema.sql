-- ================================================================
-- KANNADA SAURABHA 2026 — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ================================================================
-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor)
-- It will create all tables, indexes, RLS policies, storage bucket,
-- and seed default data for Kannada Saurabha 2026.
-- ================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 2. ADMIN PROFILES
-- Links to Supabase auth.users. Only users with role = 'admin'
-- can perform INSERT, UPDATE, DELETE on website content.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ================================================================
-- 3. HOME CONTENT
-- Editable homepage banner, titles, dates, descriptions
-- ================================================================
CREATE TABLE IF NOT EXISTS public.home_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    content_en TEXT,
    content_kn TEXT,
    extra JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 4. EVENTS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE,
    title_en TEXT NOT NULL,
    title_kn TEXT,
    date TEXT,
    time TEXT,
    venue TEXT,
    description_en TEXT,
    description_kn TEXT,
    image_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_coordinators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    name_en TEXT NOT NULL,
    name_kn TEXT,
    phone TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 5. KARNATAKA CONCLAVE / VTU KANNADA FACULTY
-- Belongs specifically to Karnataka Conclave special event
-- ================================================================
CREATE TABLE IF NOT EXISTS public.conclave_professors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_kn TEXT,
    designation_en TEXT,
    designation_kn TEXT,
    institution_en TEXT,
    institution_kn TEXT,
    contact TEXT,
    photo_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 6. STUDENT COMMITTEE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.student_committee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_kn TEXT,
    role_en TEXT,
    role_kn TEXT,
    contact TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 7. MANAGEMENT COMMITTEE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.management_committee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_kn TEXT,
    role_en TEXT,
    role_kn TEXT,
    contact TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 8. GUESTS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_kn TEXT,
    role_en TEXT,
    role_kn TEXT,
    org_en TEXT,
    org_kn TEXT,
    description_en TEXT,
    description_kn TEXT,
    photo_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 9. SPONSORSHIP PACKAGES
-- ================================================================
CREATE TABLE IF NOT EXISTS public.sponsorship_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_kn TEXT,
    amount_en TEXT,
    amount_kn TEXT,
    description_en TEXT,
    description_kn TEXT,
    benefits_en TEXT,
    benefits_kn TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 10. SPONSORS (OUR SPONSORS SECTION)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT,
    name_kn TEXT,
    org_en TEXT,
    org_kn TEXT,
    package TEXT,
    amount TEXT,
    logo_url TEXT,
    description_en TEXT,
    description_kn TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 11. GALLERY (PHOTOS & VIDEOS)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'photo', -- 'photo' or 'video'
    url TEXT NOT NULL,
    thumb_url TEXT,
    title_en TEXT,
    title_kn TEXT,
    caption_en TEXT,
    caption_kn TEXT,
    year TEXT DEFAULT '2025',
    category TEXT DEFAULT 'all',
    video_key TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 12. VENUE & SPONSOR CONTACT
-- ================================================================
CREATE TABLE IF NOT EXISTS public.venue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_kn TEXT,
    address_en TEXT,
    address_kn TEXT,
    date TEXT,
    time TEXT,
    description_en TEXT,
    description_kn TEXT,
    image_url TEXT,
    maps_url TEXT,
    phone TEXT,
    email TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 13. SCHEDULE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_en TEXT NOT NULL,
    time_kn TEXT,
    heading_en TEXT NOT NULL,
    heading_kn TEXT,
    description_en TEXT,
    description_kn TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- Public visitors: SELECT only
-- Authenticated admins: INSERT, UPDATE, DELETE
-- ================================================================

-- admin_profiles RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read own admin profile"
ON public.admin_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage admin_profiles"
ON public.admin_profiles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Explicit schema permissions for Supabase client roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- home_content RLS
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read home_content" ON public.home_content FOR SELECT USING (true);
CREATE POLICY "Admin Insert home_content" ON public.home_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update home_content" ON public.home_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete home_content" ON public.home_content FOR DELETE TO authenticated USING (public.is_admin());

-- events RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admin Insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update events" ON public.events FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete events" ON public.events FOR DELETE TO authenticated USING (public.is_admin());

-- event_coordinators RLS
ALTER TABLE public.event_coordinators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read event_coordinators" ON public.event_coordinators FOR SELECT USING (true);
CREATE POLICY "Admin Insert event_coordinators" ON public.event_coordinators FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update event_coordinators" ON public.event_coordinators FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete event_coordinators" ON public.event_coordinators FOR DELETE TO authenticated USING (public.is_admin());

-- conclave_professors RLS
ALTER TABLE public.conclave_professors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read conclave_professors" ON public.conclave_professors FOR SELECT USING (true);
CREATE POLICY "Admin Insert conclave_professors" ON public.conclave_professors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update conclave_professors" ON public.conclave_professors FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete conclave_professors" ON public.conclave_professors FOR DELETE TO authenticated USING (public.is_admin());

-- student_committee RLS
ALTER TABLE public.student_committee ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read student_committee" ON public.student_committee FOR SELECT USING (true);
CREATE POLICY "Admin Insert student_committee" ON public.student_committee FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update student_committee" ON public.student_committee FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete student_committee" ON public.student_committee FOR DELETE TO authenticated USING (public.is_admin());

-- management_committee RLS
ALTER TABLE public.management_committee ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read management_committee" ON public.management_committee FOR SELECT USING (true);
CREATE POLICY "Admin Insert management_committee" ON public.management_committee FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update management_committee" ON public.management_committee FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete management_committee" ON public.management_committee FOR DELETE TO authenticated USING (public.is_admin());

-- guests RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read guests" ON public.guests FOR SELECT USING (true);
CREATE POLICY "Admin Insert guests" ON public.guests FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update guests" ON public.guests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete guests" ON public.guests FOR DELETE TO authenticated USING (public.is_admin());

-- sponsorship_packages RLS
ALTER TABLE public.sponsorship_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read sponsorship_packages" ON public.sponsorship_packages FOR SELECT USING (true);
CREATE POLICY "Admin Insert sponsorship_packages" ON public.sponsorship_packages FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update sponsorship_packages" ON public.sponsorship_packages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete sponsorship_packages" ON public.sponsorship_packages FOR DELETE TO authenticated USING (public.is_admin());

-- sponsors RLS
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read sponsors" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Admin Insert sponsors" ON public.sponsors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update sponsors" ON public.sponsors FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete sponsors" ON public.sponsors FOR DELETE TO authenticated USING (public.is_admin());

-- gallery RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admin Insert gallery" ON public.gallery FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update gallery" ON public.gallery FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete gallery" ON public.gallery FOR DELETE TO authenticated USING (public.is_admin());

-- venue RLS
ALTER TABLE public.venue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read venue" ON public.venue FOR SELECT USING (true);
CREATE POLICY "Admin Insert venue" ON public.venue FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update venue" ON public.venue FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete venue" ON public.venue FOR DELETE TO authenticated USING (public.is_admin());

-- schedule RLS
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read schedule" ON public.schedule FOR SELECT USING (true);
CREATE POLICY "Admin Insert schedule" ON public.schedule FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update schedule" ON public.schedule FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete schedule" ON public.schedule FOR DELETE TO authenticated USING (public.is_admin());

-- ================================================================
-- 15. STORAGE BUCKET FOR MEDIA (Images / Videos)
-- ================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Read Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Admin Upload Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin Update Media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin Delete Media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin());

-- ================================================================
-- 16. SEED INITIAL DATA (Matches existing website content)
-- ================================================================

-- Home Content Seed
INSERT INTO public.home_content (key, content_en, content_kn, extra)
VALUES
('hero', 'Kannada Saurabha 2026', 'ಕನ್ನಡ ಸೌರಭ 2026', '{"date_en":"3rd November 2026","date_kn":"೩ನೇ ನವೆಂಬರ್ ೨೦೨೬","tagline_en":"Celebrating Karnataka • Culture • Unity","tagline_kn":"ಕರ್ನಾಟಕ • ಸಂಸ್ಕೃತಿ • ಏಕತೆ"}'::jsonb),
('about_summary', 'Kannada Saurabha 2026 brings our community together to celebrate the Kannada language, Karnataka''s culture, music, dance, literature, and the spirit of unity that ties us to our roots.', 'ಕನ್ನಡ ಸೌರಭ ೨೦೨೬ ನಮ್ಮ ಸಮುದಾಯವನ್ನು ಒಗ್ಗೂಡಿಸಿ ಕನ್ನಡ ಭಾಷೆ, ಕರ್ನಾಟಕದ ಸಂಸ್ಕೃತಿ, ಸಂಗೀತ, ನೃತ್ಯ, ಸಾಹಿತ್ಯ ಮತ್ತು ನಮ್ಮ ಬೇರುಗಳೊಂದಿಗಿನ ಏಕತೆಯ ಆಚರಣೆ.', '{}'::jsonb),
('host_institution', 'HKBK Group of Institutions', 'ಎಚ್‌ಕೆಬಿಕೆ ಶಿಕ್ಷಣ ಸಂಸ್ಥೆಗಳ ಸಮೂಹ', '{"sub_en":"Committed to Academic Excellence & Cultural Heritage","sub_kn":"ಶೈಕ್ಷಣಿಕ ಶ್ರೇಷ್ಠತೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಗೆ ಬದ್ಧ"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Venue Seed
INSERT INTO public.venue (name_en, name_kn, address_en, address_kn, date, time, description_en, description_kn, maps_url, phone, email)
VALUES (
    'HKBK College of Engineering',
    'ಎಚ್‌ಕೆಬಿಕೆ ಇಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು',
    'Opp. Manyata Tech Park, Nagawara, Bengaluru, Karnataka 560045',
    'ಮಾನ್ಯತಾ ಟೆಕ್ ಪಾರ್ಕ್ ಎದುರು, ನಾಗವಾರ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ ೫೬೦೦೪೫',
    'Tuesday, 3 November 2026',
    '9:00 AM onwards',
    'State-of-the-art campus featuring an open-air amphitheatre, main auditorium, food court, and ample parking facilities for attendees.',
    'ಆಧುನಿಕ ಸೌಲಭ್ಯಗಳುಳ್ಳ ಕ್ಯಾಂಪಸ್, ತೆರೆದ ಸಭಾಂಗಣ, ಆಡಿಟೋರಿಯಂ, ಫುಡ್ ಕೋರ್ಟ್ ಮತ್ತು ವಿಶಾಲವಾದ ಪಾರ್ಕಿಂಗ್ ಸೌಲಭ್ಯವನ್ನು ಹೊಂದಿದೆ.',
    'https://maps.google.com/?q=HKBK+College+of+Engineering+Nagawara+Bengaluru',
    '9980321527',
    'jaipalreddy9980321527@gmail.com'
);

-- Schedule Seed
INSERT INTO public.schedule (time_en, time_kn, heading_en, heading_kn, description_en, description_kn, order_index)
VALUES
('9:00 – 10:00 AM', 'ಬೆಳಿಗ್ಗೆ ೯:೦೦ – ೧೦:೦೦', 'Nashik Dhol', 'ನಾಸಿಕ್ ಢೋಲ್', 'Nashik dhol from the gate to the food court.', 'ಮುಖ್ಯ ಗೇಟ್‌ನಿಂದ ಫುಡ್ ಕೋರ್ಟ್‌ವರೆಗೆ ನಾಸಿಕ್ ಢೋಲ್ ಮೆರವಣಿಗೆ.', 1),
('10:00/10:30 – 11:30 AM (max)', 'ಬೆಳಿಗ್ಗೆ ೧೦:೦೦/೧೦:೩೦ – ೧೧:೩೦ (ಗರಿಷ್ಠ)', 'Cultural Parade', 'ಸಾಂಸ್ಕೃತಿಕ ಮೆರವಣಿಗೆ', 'Cultural parade from the food court to the stage.', 'ಫುಡ್ ಕೋರ್ಟ್‌ನಿಂದ ವೇದಿಕೆಯವರೆಗೆ ಸಾಂಸ್ಕೃತಿಕ ಮೆರವಣಿಗೆ.', 2),
('11:30 AM – 12:00 PM', 'ಬೆಳಿಗ್ಗೆ ೧೧:೩೦ – ಮಧ್ಯಾಹ್ನ ೧೨:೦೦', 'Karnataka Conclave', 'ಕರ್ನಾಟಕ ಕಾನ್ಕ್ಲೇವ್', 'Special conclave session and panel discussions celebrating Karnataka''s culture, heritage, and growth.', 'ಕರ್ನಾಟಕದ ಸಂಸ್ಕೃತಿ, ಪರಂಪರೆ ಮತ್ತು ಬೆಳವಣಿಗೆಯ ಕುರಿತು ವಿಶೇಷ ಕಾನ್ಕ್ಲೇವ್ ಗೋಷ್ಠಿ.', 3),
('By 12:00 PM (max) – 1:00 PM', 'ಮಧ್ಯಾಹ್ನ ೧೨:೦೦ (ಗರಿಷ್ಠ) – ೧:೦೦', 'Main Function & Lunch', 'ಮುಖ್ಯ ಸಮಾರಂಭ ಮತ್ತು ಭೋಜನ', 'Main function: prize distribution, speeches by the Director and Principal (till 12:30–1:00 PM). Lunch is served at the same time.', 'ಮುಖ್ಯ ಸಮಾರಂಭ: ಪ್ರಶಸ್ತಿ ವಿತರಣೆ, ನಿರ್ದೇಶಕರು ಮತ್ತು ಪ್ರಾಂಶುಪಾಲರ ಭಾಷಣ (ಮಧ್ಯಾಹ್ನ ೧೨:೩೦–೧:೦೦ ರವರೆಗೆ). ಇದೇ ಸಮಯದಲ್ಲಿ ಊಟದ ವ್ಯವಸ್ಥೆ.', 4),
('Till 4:00 PM', 'ಸಂಜೆ ೪:೦೦ ರವರೆಗೆ', 'Cultural Performances', 'ಸಾಂಸ್ಕೃತಿಕ ಪ್ರದರ್ಶನಗಳು', 'Cultural performances on the main stage (e.g. Bharatanatyam, Yakshagana).', 'ಮುಖ್ಯ ವೇದಿಕೆಯಲ್ಲಿ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು (ಉದಾ: ಭರತನಾಟ್ಯ, ಯಕ್ಷಗಾನ).', 5),
('Afternoon Break', 'ವಿರಾಮ', 'Break (20 to 30 minutes)', 'ವಿರಾಮ (೨೦ ರಿಂದ ೩೦ ನಿಮಿಷ)', '20 to 30 minutes break before the evening concert.', 'ಸಂಜೆಯ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಮುನ್ನ ೨೦ ರಿಂದ ೩೦ ನಿಮಿಷಗಳ ವಿರಾಮ.', 6),
('4:30 – 7:00 PM (max)', 'ಸಂಜೆ ೪:೩೦ – ೭:೦೦ (ಗರಿಷ್ಠ)', 'Concert & Night Crackers', 'ಕನ್ಸರ್ಟ್ ಮತ್ತು ಪಟಾಕಿ ಸಂಭ್ರಮ', 'Concert with karaoke singers, band and DJ, with night crackers.', 'ಕರೋಕೆ ಗಾಯಕರು, ಬ್ಯಾಂಡ್ ಮತ್ತು ಡಿಜೆ (DJ) ಜೊತೆಗೆ ಕನ್ಸರ್ಟ್, ಹಾಗೂ ರಾತ್ರಿ ಪಟಾಕಿ ಸಂಭ್ರಮ.', 7);

-- Sponsorship Packages Seed
INSERT INTO public.sponsorship_packages (name_en, name_kn, amount_en, amount_kn, description_en, description_kn, benefits_en, benefits_kn, order_index)
VALUES
(
    'Title Sponsor',
    'ಶೀರ್ಷಿಕೆ ಪ್ರಾಯೋಜಕರು (Title Sponsor)',
    '₹1,00,000',
    '₹೧,೦೦,೦೦೦',
    'Become the principal sponsor of Kannada Saurabha 2026 with premium brand visibility throughout the event.',
    'ಸಂಪೂರ್ಣ ಕಾರ್ಯಕ್ರಮದಾದ್ಯಂತ ಪ್ರೀಮಿಯಂ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯೊಂದಿಗೆ ಕನ್ನಡ ಸೌರಭ ೨೦೨೬ ರ ಮುಖ್ಯ ಪ್ರಾಯೋಜಕರಾಗಿ.',
    'Brand name associated with the event — “Kannada Saurabha 2026, Powered by [Brand Name]”
Premium logo placement on the main event poster
Prominent branding on the main stage/backdrop
Premium banners across the event venue
Brand mention by the emcee during the event
Dedicated social media promotion
Opportunity to set up a promotional stall
Opportunity to distribute promotional materials/samples
Logo on digital creatives
Special acknowledgement during the event
Certificate/appreciation from the organising committee',
    'ಕಾರ್ಯಕ್ರಮದೊಂದಿಗೆ ಸಂಸ್ಥೆಯ ಹೆಸರು — “ಕನ್ನಡ ಸೌರಭ ೨೦೨೬, Powered by [Brand Name]”
ಮುಖ್ಯ ಕಾರ್ಯಕ್ರಮದ ಪೋಸ್ಟರ್‌ನಲ್ಲಿ ಪ್ರಮುಖ ಲೋಗೋ ಪ್ರದರ್ಶನ
ಮುಖ್ಯ ವೇದಿಕೆ ಮತ್ತು ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಪ್ರಮುಖ ಬ್ರ್ಯಾಂಡಿಂಗ್
ಕಾರ್ಯಕ್ರಮದ ಆವರಣದಾದ್ಯಂತ ಪ್ರೀಮಿಯಂ ಬ್ಯಾನರ್‌ಗಳು
ಕಾರ್ಯಕ್ರಮದ ನಿರೂಪಕರಿಂದ ಸಂಸ್ಥೆಯ ಹೆಸರಿನ ಉಲ್ಲೇಖ
ಮೀಸಲಾದ ಸಾಮಾಜಿಕ ಜಾಲತಾಣ ಪ್ರಚಾರ
ಪ್ರಚಾರ ಮಳಿಗೆ (Stall) ಸ್ಥಾಪಿಸಲು ಅವಕಾಶ
ಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳು/ಮಾದರಿಗಳನ್ನು ವಿತರಿಸುವ ಅವಕಾಶ
ಡಿಜಿಟಲ್ ಪೋಸ್ಟರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ
ಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ವಿಶೇಷ ಕೃತಜ್ಞತೆ ಮತ್ತು ಸನ್ಮಾನ
ಸಂಘಟನಾ ಸಮಿತಿಯಿಂದ ಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
    1
),
(
    'Platinum Sponsor',
    'ಪ್ಲಾಟಿನಂ ಪ್ರಾಯೋಜಕರು (Platinum Sponsor)',
    '₹50,000',
    '₹೫೦,೦೦೦',
    'A premium sponsorship opportunity offering prominent brand visibility across the event.',
    'ಕಾರ್ಯಕ್ರಮದಾದ್ಯಂತ ಪ್ರಮುಖ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯನ್ನು ಒದಗಿಸುವ ಪ್ರೀಮಿಯಂ ಪ್ರಾಯೋಜಕತ್ವದ ಅವಕಾಶ.',
    'Prominent logo placement on event creatives
Stage/venue branding
Multiple banner placements
Social media promotion
Brand mention during the event
Promotional stall opportunity
Distribution of promotional materials
Logo on selected digital promotions
Certificate/appreciation',
    'ಕಾರ್ಯಕ್ರಮದ ಕ್ರಿಯೇಟಿವ್‌ಗಳಲ್ಲಿ ಪ್ರಮುಖ ಲೋಗೋ ಪ್ರದರ್ಶನ
ವೇದಿಕೆ ಮತ್ತು ಆವರಣದಲ್ಲಿ ಬ್ರ್ಯಾಂಡಿಂಗ್
ಹಲವಾರು ಸ್ಥಳಗಳಲ್ಲಿ ಬ್ಯಾನರ್ ಪ್ರದರ್ಶನ
ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಪ್ರಚಾರ
ಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ಸಂಸ್ಥೆಯ ಉಲ್ಲೇಖ
ಪ್ರಚಾರ ಮಳಿಗೆ (Stall) ಸ್ಥಾಪಿಸಲು ಅವಕಾಶ
ಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳ ವಿತರಣೆ
ಆಯ್ದ ಡಿಜಿಟಲ್ ಪ್ರಚಾರಗಳಲ್ಲಿ ಲೋಗೋ
ಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
    2
),
(
    'Gold Sponsor',
    'ಚಿನ್ನದ ಪ್ರಾಯೋಜಕರು (Gold Sponsor)',
    '₹25,000',
    '₹೨೫,೦೦೦',
    'Gain valuable brand exposure among students and event attendees through event and promotional branding.',
    'ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಪ್ರಚಾರ ಬ್ರ್ಯಾಂಡಿಂಗ್ ಮೂಲಕ ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕರಲ್ಲಿ ಮೌಲ್ಯಯುತ ಪ್ರಚಾರ ಪಡೆಯಿರಿ.',
    'Logo placement on event banners
Logo on selected promotional creatives
Social media mention
Brand acknowledgement during the event
Promotional stall opportunity, subject to venue availability
Distribution of promotional materials
Certificate/appreciation',
    'ಕಾರ್ಯಕ್ರಮದ ಬ್ಯಾನರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ
ಆಯ್ದ ಪ್ರಚಾರ ಪೋಸ್ಟರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ
ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಉಲ್ಲೇಖ
ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಸಂಸ್ಥೆಯ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ
ಸ್ಥಳಾವಕಾಶಕ್ಕೆ ಒಳಪಟ್ಟು ಪ್ರಚಾರ ಮಳಿಗೆ ಅವಕಾಶ
ಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳ ವಿತರಣೆ
ಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
    3
),
(
    'Silver Sponsor',
    'ಬೆಳ್ಳಿ ಪ್ರಾಯೋಜಕರು (Silver Sponsor)',
    '₹10,000',
    '₹೧೦,೦೦೦',
    'Support Kannada Saurabha 2026 while receiving meaningful brand visibility during the celebration.',
    'ಸಂಭ್ರಮಾಚರಣೆಯ ಸಮಯದಲ್ಲಿ ಅರ್ಥಪೂರ್ಣ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯನ್ನು ಪಡೆಯುವುದರೊಂದಿಗೆ ಕನ್ನಡ ಸೌರಭ ೨೦೨೬ ಅನ್ನು ಬೆಂಬಲಿಸಿ.',
    'Logo placement on event banner
Logo on selected digital creatives
Social media acknowledgement
Sponsor acknowledgement during the event
Certificate/appreciation',
    'ಕಾರ್ಯಕ್ರಮದ ಬ್ಯಾನರ್‌ನಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ
ಆಯ್ದ ಡಿಜಿಟಲ್ ಕ್ರಿಯೇಟಿವ್‌ಗಳಲ್ಲಿ ಲೋಗೋ
ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಕೃತಜ್ಞತೆ
ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಪ್ರಾಯೋಜಕರ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ
ಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
    4
),
(
    'Associate Sponsor',
    'ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರು (Associate Sponsor)',
    '₹5,000',
    '₹೫,೦೦೦',
    'Support the celebration while receiving recognition as an associate sponsor.',
    'ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರಾಗಿ ಮನ್ನಣೆ ಪಡೆಯುವುದರೊಂದಿಗೆ ಸಂಭ್ರಮಾಚರಣೆಯನ್ನು ಬೆಂಬಲಿಸಿ.',
    'Logo placement with associate sponsors
Social media acknowledgement
Event acknowledgement
Certificate/appreciation',
    'ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರೊಂದಿಗೆ ಲೋಗೋ ಪ್ರದರ್ಶನ
ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಕೃತಜ್ಞತೆ
ಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ
ಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
    5
);

-- Guests Seed
INSERT INTO public.guests (name_en, name_kn, role_en, role_kn, org_en, org_kn, description_en, description_kn, photo_url, order_index)
VALUES
('Dr. K. S. Rajanna', 'ಡಾ. ಕೆ. ಎಸ್. ರಾಜಣ್ಣ', 'Chief Guest', 'ಮುಖ್ಯ ಅತಿಥಿ', 'Former State Commissioner for Persons with Disabilities', 'ಮಾಜಿ ರಾಜ್ಯ ಆಯುಕ್ತರು, ವಿಕಲಚೇತನರ ಕಲ್ಯಾಣ ಇಲಾಖೆ', 'Renowned social activist and inspirational leader dedicated to community empowerment.', 'ಖ್ಯಾತ ಸಮಾಜ ಸೇವಕರು ಮತ್ತು ಪ್ರೇರಣಾದಾಯಕ ಸಾಧಕರು.', '', 1),
('Prof. Chandrashekar Patil', 'ಪ್ರೊ. ಚಂದ್ರಶೇಖರ ಪಾಟೀಲ', 'Guest of Honour', 'ಗೌರವ ಅತಿಥಿ', 'Kannada Sahitya Parishat', 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಪರಿಷತ್ತು', 'Eminent scholar and cultural ambassador promoting Karnataka’s literary traditions.', 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಯ ಸಂರಕ್ಷಕರು.', '', 2),
('Smt. Roopa Rao', 'ಶ್ರೀಮತಿ ರೂಪಾ ರಾವ್', 'Cultural Ambassador', 'ಸಾಂಸ್ಕೃತಿಕ ರಾಯಭಾರಿ', 'Karnataka Nataka Academy', 'ಕರ್ನಾಟಕ ನಾಟಕ ಅಕಾಡೆಮಿ', 'Celebrated filmmaker and dramatist contributing to contemporary Kannada arts.', 'ಕನ್ನಡ ರಂಗಭೂಮಿ ಹಾಗೂ ಸಾಂಸ್ಕೃತಿಕ ಕ್ಷೇತ್ರದ ಖ್ಯಾತ ನಿರ್ದೇಶಕರು.', '', 3),
('Sri Manjunath Prasad', 'ಶ್ರೀ ಮಂಜುನಾಥ್ ಪ್ರಸಾದ್', 'Community Leader', 'ಸಮುದಾಯ ನಾಯಕ', 'Bengaluru Youth Forum', 'ಬೆಂಗಳೂರು ಯುವ ವೇದಿಕೆ', 'Dedicated organizer empowering student initiatives across educational institutions.', 'ಯುವ ಮಾರ್ಗದರ್ಶಕರು ಮತ್ತು ಸಮಾಜ ಸೇವಕರು.', '', 4);

-- Conclave Professors Seed
INSERT INTO public.conclave_professors (name_en, name_kn, designation_en, designation_kn, institution_en, institution_kn, contact, photo_url, order_index)
VALUES
('Dr. M. Mohan Alva', 'ಡಾ. ಎಂ. ಮೋಹನ್ ಆಳ್ವ', 'Chairman & Cultural Patron', 'ಅಧ್ಯಕ್ಷರು ಹಾಗೂ ಸಾಂಸ್ಕೃತಿಕ ಪೋಷಕರು', 'Alva''s Education Foundation, Moodbidri', 'ಆಳ್ವಾಸ್ ಶಿಕ್ಷಣ ಪ್ರತಿಷ್ಠಾನ, ಮೂಡುಬಿದಿರೆ', '+91 98450 11223', '', 1),
('Prof. B. A. Vivek Rai', 'ಪ್ರೊ. ಬಿ. ಎ. ವಿವೇಕ ರೈ', 'Former Vice Chancellor', 'ಮಾಜಿ ಕುಲಪತಿಗಳು', 'Kannada University, Hampi', 'ಕನ್ನಡ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಹಂಪಿ', '+91 94480 33445', '', 2),
('Dr. Doddarange Gowda', 'ಡಾ. ದೊಡ್ಡರಂಗೇಗೌಡ', 'Poet & Lyricist', 'ಕವಿ ಹಾಗೂ ಸಾಹಿತಿಗಳು', 'Bengaluru University', 'ಬೆಂಗಳೂರು ವಿಶ್ವವಿದ್ಯಾಲಯ', '+91 98860 55667', '', 3);

-- Gallery Seed
INSERT INTO public.gallery (type, url, thumb_url, title_en, title_kn, caption_en, caption_kn, year, category, video_key, order_index)
VALUES
('video', 'assets/videos/kannada-vaibhava-video.mp4', 'assets/images/kannada-vaibhava-2025.jpg', 'Kannada Vaibhava 2025', 'ಕನ್ನಡ ವೈಭವ 2025', 'Highlights from our vibrant 2025 cultural celebration.', '೨೦೨೫ರ ಸಾಂಸ್ಕೃತಿಕ ವೈಭವದ ಪ್ರಮುಖ ದೃಶ್ಯಗಳು.', '2025', 'videos', 'vaibhava', 1),
('video', 'assets/videos/suvarna-nudi-sambrama-video.mp4', 'assets/images/suvarna-mahothsava-2023.jpg', 'Suvarna Mahothsava 2023', 'ಸುವರ್ಣ ಮಹೋತ್ಸವ 2023', 'Energetic celebration and traditional festivities.', 'ಸುವರ್ಣ ಮಹೋತ್ಸವದ ಐತಿಹಾಸಿಕ ಸಂಭ್ರಮ.', '2023', 'videos', 'suvarna2023', 2),
('photo', 'https://images.unsplash.com/photo-1583225214464-9296029427aa?q=80&w=600&auto=format&fit=crop', '', 'Folk Dance', 'ಜಾನಪದ ನೃತ್ಯ', 'Students performing traditional folk routines.', 'ವಿದ್ಯಾರ್ಥಿಗಳಿಂದ ಸಾಂಪ್ರದಾಯಿಕ ಜಾನಪದ ನೃತ್ಯ.', '2025', 'photos', '', 3),
('photo', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=600&auto=format&fit=crop', '', 'Community Gathering', 'ಸಮುದಾಯ ಸಮಾಗಮ', 'Audience and staff celebrating together.', 'ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಭಾಗವಹಿಸಿದ ಪ್ರೇಕ್ಷಕರು.', '2025', 'photos', '', 4),
('photo', 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=600&auto=format&fit=crop', '', 'Cultural Stage', 'ಸಾಂಸ್ಕೃತಿಕ ವೇದಿಕೆ', 'Main stage decorated in state colors.', 'ಕರ್ನಾಟಕದ ವರ್ಣಗಳಲ್ಲಿ ಕಂಗೊಳಿಸಿದ ಮುಖ್ಯ ವೇದಿಕೆ.', '2025', 'photos', '', 5),
('photo', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=600&auto=format&fit=crop', '', 'Music Performance', 'ಸಂಗೀತ ಪ್ರದರ್ಶನ', 'Live musical rendition of classic melodies.', 'ಜನಪ್ರಿಯ ಕನ್ನಡ ಗೀತೆಗಳ ನೇರ ಗಾಯನ.', '2025', 'photos', '', 6);
