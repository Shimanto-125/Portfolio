-- Database schema for NEURAL_PORTFOLIO

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    category VARCHAR(100) NOT NULL, -- e.g., 'Languages', 'ML/DL', 'DevOps'
    neural_depth VARCHAR(50) DEFAULT 'L8',
    latency VARCHAR(50) DEFAULT '0.5ms',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    duration VARCHAR(100) NOT NULL, -- e.g., '2020 - 2024'
    grade VARCHAR(100), -- e.g., 'CGPA: 3.82'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. QUALIFICATIONS TABLE (Certifications/Milestones)
CREATE TABLE IF NOT EXISTS public.qualifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., 'Degree', 'Certification', 'Work'
    duration VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. RESEARCH TABLE
CREATE TABLE IF NOT EXISTS public.researches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    authors TEXT NOT NULL,
    publisher VARCHAR(255),
    year VARCHAR(50),
    link VARCHAR(255),
    pdf_url VARCHAR(255),
    image_url TEXT,
    is_visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    github_url VARCHAR(255),
    live_url VARCHAR(255),
    is_visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. SITE METADATA TABLE (Settings like CV Url, live status)
CREATE TABLE IF NOT EXISTS public.site_metadata (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.researches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_metadata ENABLE ROW LEVEL SECURITY;

-- Create Public Read-Only Access Policies
CREATE POLICY "Allow public read-only access" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.qualifications FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.researches FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.site_metadata FOR SELECT USING (true);

-- Create Authenticated Write Access Policies
CREATE POLICY "Allow authenticated full control" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.qualifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.researches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.site_metadata FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed Initial Data
INSERT INTO public.site_metadata (key, value) VALUES
('cv_url', '#'),
('is_available', 'true'),
('hero_role', 'ML Trainer & Engineer'),
('hero_sub_role', 'Competitive Programmer')
ON CONFLICT (key) DO NOTHING;

-- Seed default skills
INSERT INTO public.skills (name, percentage, category, neural_depth, latency) VALUES
('Critical thinking', 92, 'Critical', 'L9', '0.4ms'),
('Python & ML Dev', 85, 'ML & Dev', 'L8', '0.8ms'),
('Competitive Programming', 98, 'Competitive', 'L10', '0.1ms'),
('Cloud & DevOps', 80, 'DevOps', 'L7', '1.2ms')
ON CONFLICT DO NOTHING;

-- Seed default projects
INSERT INTO public.projects (title, description, image_url, tags, github_url, live_url) VALUES
('GameHub: The Ultimate Livestreaming Platform', 'A Twitch clone built with Next.js, Prisma, and Tailwind. Features RTMP/WHIP streaming, real-time chat, and advanced search.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8j-JpM35uqQH05Qt-6ivwmYoCORyXCV9hrjnIpgYgOkQkGhQBogG-2FFK8YYLItt5K5FNiLrW5PNUFmAsSwrs1jWX-ed0H0ufDBaOMoLNYc903WA7c2lghJM9jgK6q-_ZICraOIo55czk2giYPVtCNZuU-WibYdokOm5iJ17falZR7CvfovW8R7Uj8pluTMewmO_nO2AJmOMlYL5GrVV18nU82dUXeecw5rspcVmDMdiSZyj-QxOrgwEd54oIugLHyGxNra4K6XFQ', ARRAY['Next.js', 'Prisma', 'Tailwind'], 'https://github.com', 'https://example.com'),
('Google Docs 2.0: Real-Time Collaboration', 'Full-stack app with real-time editing, comments, and notifications. Built with Next.js 14, Firebase, and TipTap editor.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8j-JpM35uqQH05Qt-6ivwmYoCORyXCV9hrjnIpgYgOkQkGhQBogG-2FFK8YYLItt5K5FNiLrW5PNUFmAsSwrs1jWX-ed0H0ufDBaOMoLNYc903WA7c2lghJM9jgK6q-_ZICraOIo55czk2giYPVtCNZuU-WibYdokOm5iJ17falZR7CvfovW8R7Uj8pluTMewmO_nO2AJmOMlYL5GrVV18nU82dUXeecw5rspcVmDMdiSZyj-QxOrgwEd54oIugLHyGxNra4K6XFQ', ARRAY['TypeScript', 'Node.js', 'Firebase'], 'https://github.com', 'https://example.com'),
('CloudDrive: Secure File Management', 'Modern file storage platform with role-based permissions, folder hierarchies, advanced search, and seamless syncing.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8j-JpM35uqQH05Qt-6ivwmYoCORyXCV9hrjnIpgYgOkQkGhQBogG-2FFK8YYLItt5K5FNiLrW5PNUFmAsSwrs1jWX-ed0H0ufDBaOMoLNYc903WA7c2lghJM9jgK6q-_ZICraOIo55czk2giYPVtCNZuU-WibYdokOm5iJ17falZR7CvfovW8R7Uj8pluTMewmO_nO2AJmOMlYL5GrVV18nU82dUXeecw5rspcVmDMdiSZyj-QxOrgwEd54oIugLHyGxNra4K6XFQ', ARRAY['React', 'AWS', 'PostgreSQL'], 'https://github.com', 'https://example.com')
ON CONFLICT DO NOTHING;

-- Seed default education
INSERT INTO public.education (institution, degree, department, duration, grade, description) VALUES
('American International University-Bangladesh', 'Bachelor of Science in Computer Science & Engineering', 'CSE', '2020 - 2024', 'CGPA: 3.82', 'Specialized in Intelligent Systems and Algorithms. Active member of AIUB Computer Club and Competitive Programming Wing.')
ON CONFLICT DO NOTHING;

-- Seed default qualifications
INSERT INTO public.qualifications (title, subtitle, type, duration) VALUES
('Bachelor of Science in Computer Science', 'Neural Institute of Technology', 'Degree', '2019 - 2023'),
('Machine Learning Specialization', 'DataCore Academy', 'Certification', 'Completed')
ON CONFLICT DO NOTHING;
