-- Database schema for NEURAL_PORTFOLIO
-- Run this entire script in Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    category VARCHAR(100) NOT NULL,
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
    duration VARCHAR(100) NOT NULL,
    grade VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. QUALIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.qualifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. RESEARCHES TABLE
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

-- 7. SITE METADATA TABLE
CREATE TABLE IF NOT EXISTS public.site_metadata (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. COMPETITIVE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.competitive_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(100) NOT NULL,
    username VARCHAR(255) NOT NULL,
    profile_url VARCHAR(255),
    problems_solved INTEGER DEFAULT 0,
    rank VARCHAR(100),
    rating INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.researches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_profiles ENABLE ROW LEVEL SECURITY;

-- Public Read-Only Access Policies
CREATE POLICY "Allow public read-only access" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.qualifications FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.researches FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.site_metadata FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.competitive_profiles FOR SELECT USING (true);

-- Authenticated Write Access Policies
CREATE POLICY "Allow authenticated full control" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.qualifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.researches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.site_metadata FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.competitive_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed Initial Metadata
INSERT INTO public.site_metadata (key, value) VALUES
('cv_url', 'https://drive.google.com/file/d/1V0C248sTu0yZ7dHiXjijHwUwsAsQvQRt/view?usp=sharing'),
('is_available', 'true'),
('hero_role', 'ML Trainer & Engineer'),
('hero_sub_role', 'ML Engineer,Competitive Programmer'),
('hero_greeting', ''),
('hero_description', ''),
('hero_primary_btn', 'Say Hello'),
('hero_secondary_btn', 'Download CV'),
('social_github', 'https://github.com/Shimanto-125'),
('social_linkedin', 'https://www.linkedin.com/in/abir-shimanto-b10197291'),
('social_email', 'abirshimantoas83@gmail.com'),
('about_image_url', ''),
('about_bio', 'I am a machine learning architect and trainer specializing in high-performance neural computation and intelligent digital ecosystems.'),
('about_experience', '3+ Years Professional AI/ML Engineering & Training'),
('about_projects_label', '150+ Nodes'),
('about_tech_desc', 'Core Engine: TensorFlow, PyTorch, React, Node.js, and Docker.'),
('contact_email', 'abirshimantoas83@gmail.com'),
('contact_location', 'Dhaka, Bangladesh'),
('contact_github', 'https://github.com/Shimanto-125'),
('contact_linkedin', 'https://www.linkedin.com/in/abir-shimanto-b10197291'),
('footer_title', 'ML Trainer'),
('footer_name', 'Abir Shimanto')
ON CONFLICT (key) DO NOTHING;

-- Seed default skills
INSERT INTO public.skills (name, percentage, category, neural_depth, latency) VALUES
('Critical thinking', 92, 'Critical', 'L9', '0.4ms'),
('Python & ML Dev', 85, 'ML & Dev', 'L8', '0.8ms'),
('Competitive Programming', 98, 'Competitive', 'L10', '0.1ms'),
('Cloud & DevOps', 80, 'DevOps', 'L7', '1.2ms')
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

-- Seed default competitive profiles
INSERT INTO public.competitive_profiles (platform, username, profile_url, problems_solved, rank, rating, display_order) VALUES
('codeforces', 'Shimanto-125', 'https://codeforces.com/profile/Shimanto-125', 0, 'Pupil', 0, 0),
('leetcode', 'AbirShimanto', 'https://leetcode.com/u/AbirShimanto', 0, '', 0, 1),
('codechef', 'shimanto125', 'https://www.codechef.com/users/shimanto125', 0, '3 Star', 0, 2)
ON CONFLICT DO NOTHING;

-- Seed default projects
INSERT INTO public.projects (title, description, image_url, tags, github_url, live_url) VALUES
('GameHub: The Ultimate Livestreaming Platform', 'A Twitch clone built with Next.js, Prisma, and Tailwind. Features RTMP/WHIP streaming, real-time chat, and advanced search.', '', ARRAY['Next.js', 'Prisma', 'Tailwind'], 'https://github.com', 'https://example.com'),
('Google Docs 2.0: Real-Time Collaboration', 'Full-stack app with real-time editing, comments, and notifications. Built with Next.js 14, Firebase, and TipTap editor.', '', ARRAY['TypeScript', 'Node.js', 'Firebase'], 'https://github.com', 'https://example.com'),
('CloudDrive: Secure File Management', 'Modern file storage platform with role-based permissions, folder hierarchies, advanced search, and seamless syncing.', '', ARRAY['React', 'AWS', 'PostgreSQL'], 'https://github.com', 'https://example.com')
ON CONFLICT DO NOTHING;
