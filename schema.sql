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

-- 8. TECHNOLOGIES TABLE
CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    label VARCHAR(50),
    icon VARCHAR(255),
    type VARCHAR(50) NOT NULL DEFAULT 'icon',
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. COMPETITIVE PROFILES TABLE
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
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (safe to re-run)
DROP POLICY IF EXISTS "Allow public read-only access" ON public.skills;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.education;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.qualifications;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.researches;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.projects;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.site_metadata;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.technologies;
DROP POLICY IF EXISTS "Allow public read-only access" ON public.competitive_profiles;

DROP POLICY IF EXISTS "Allow authenticated full control" ON public.skills;
DROP POLICY IF EXISTS "Allow authenticated full control" ON public.education;
DROP POLICY IF EXISTS "Allow authenticated full control" ON public.qualifications;
DROP POLICY IF EXISTS "Allow authenticated full control" ON public.researches;
DROP POLICY IF EXISTS "Allow authenticated full control" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated full control" ON public.site_metadata;
DROP POLICY IF EXISTS "Allow authenticated full control" ON public.technologies;
DROP POLICY IF EXISTS "Allow authenticated full control" ON public.competitive_profiles;

-- Public Read-Only Access Policies
CREATE POLICY "Allow public read-only access" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.qualifications FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.researches FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.site_metadata FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON public.competitive_profiles FOR SELECT USING (true);

-- Authenticated Write Access Policies
CREATE POLICY "Allow authenticated full control" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.qualifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.researches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.site_metadata FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.technologies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full control" ON public.competitive_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

