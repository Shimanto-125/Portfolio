'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import {
  FALLBACK_METADATA,
  FALLBACK_EDUCATION,
  FALLBACK_QUALIFICATIONS,
  FALLBACK_SKILLS,
  FALLBACK_RESEARCHES,
  FALLBACK_PROJECTS,
  FALLBACK_COMPETITIVE_PROFILES,
} from '@/lib/constants';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import TechnologiesSection from '@/components/sections/TechnologiesSection';
import EducationSection from '@/components/sections/EducationSection';
import QualificationsSection from '@/components/sections/QualificationsSection';
import ResearchSection from '@/components/sections/ResearchSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ScrollProgressTrack from '@/components/ScrollProgressTrack';

const NeuronCanvas = dynamic(() => import('@/components/NeuronCanvas'), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

export default function HomePage() {
  const [metadata, setMetadata] = useState(FALLBACK_METADATA);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [education, setEducation] = useState<AnyData[]>(FALLBACK_EDUCATION);
  const [qualifications, setQualifications] = useState<AnyData[]>(FALLBACK_QUALIFICATIONS);
  const [skills, setSkills] = useState<AnyData[]>(FALLBACK_SKILLS);
  const [researches, setResearches] = useState<AnyData[]>(FALLBACK_RESEARCHES);
  const [projects, setProjects] = useState<AnyData[]>(FALLBACK_PROJECTS);
  const [competitiveProfiles, setCompetitiveProfiles] = useState<AnyData[]>(FALLBACK_COMPETITIVE_PROFILES);
  const [technologies, setTechnologies] = useState<AnyData[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!supabase) { setMetadataLoaded(true); return; }

      try {
        // Site Metadata
        const { data: metaData } = await supabase.from('site_metadata').select('*');
        if (metaData) {
          const map: Record<string, string> = {};
          metaData.forEach((item: { key: string; value: string }) => { map[item.key] = item.value; });
          setMetadata((prev) => ({ ...prev, ...map }));
        }
        setMetadataLoaded(true);

        // Education
        const { data: eduData } = await supabase.from('education').select('*').order('created_at', { ascending: true });
        if (eduData && eduData.length > 0) setEducation(eduData);

        // Qualifications
        const { data: qualData } = await supabase.from('qualifications').select('*').order('created_at', { ascending: true });
        if (qualData && qualData.length > 0) setQualifications(qualData);

        // Skills
        const { data: skillData } = await supabase.from('skills').select('*').order('created_at', { ascending: true });
        if (skillData && skillData.length > 0) setSkills(skillData);

        // Researches
        const { data: resData } = await supabase.from('researches').select('*').eq('is_visible', true).order('created_at', { ascending: true });
        if (resData && resData.length > 0) setResearches(resData);

        // Projects
        const { data: projData } = await supabase.from('projects').select('*').eq('is_visible', true).order('created_at', { ascending: true });
        if (projData && projData.length > 0) setProjects(projData);

        // Competitive Profiles
        const { data: cpData } = await supabase.from('competitive_profiles').select('*').order('display_order');
        if (cpData && cpData.length > 0) setCompetitiveProfiles(cpData);

        // Technologies
        const { data: techData } = await supabase.from('technologies').select('*').eq('is_visible', true).order('display_order');
        if (techData && techData.length > 0) setTechnologies(techData);
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
        setMetadataLoaded(true);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <NeuronCanvas />
      <Navbar />

      {/* <main className="max-w-7xl mx-auto px-4 md:px-16 pt-16 pb-16"> */}
      <main className="max-w-7xl mx-auto px-4 md:px-16 pt-16 pb-16 relative">
        <HeroSection
          heroRole={metadata.hero_role}
          heroSubRole={metadata.hero_sub_role}
          cvUrl={metadata.cv_url}
          heroGreeting={metadata.hero_greeting}
          heroDescription={metadata.hero_description}
          heroPrimaryBtn={metadata.hero_primary_btn}
          heroSecondaryBtn={metadata.hero_secondary_btn}
          heroImageUrl={metadata.hero_image_url}
          heroImageReady={metadataLoaded}
          competitiveProfiles={competitiveProfiles}
          socialGithub={metadata.social_github}
          socialLinkedin={metadata.social_linkedin}
          socialEmail={metadata.social_email}
        />

        {/* Scroll indicator */}
        <button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          {/* className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity mt-20 cursor-pointer mx-auto" */}
          className="flex md:hidden flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity mt-20 cursor-pointer mx-auto"
        >
          <span className="material-symbols-outlined animate-bounce">mouse</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll Down</span>
        </button>
      <ScrollProgressTrack />

        <AboutSection
          aboutImageUrl={metadata.about_image_url}
          aboutBio={metadata.about_bio}
          aboutExperience={metadata.about_experience}
          aboutProjectsLabel={metadata.about_projects_label}
          aboutTechDesc={metadata.about_tech_desc}
          isAvailable={metadata.is_available}
        />
        <SkillsSection skills={skills} />
        <TechnologiesSection items={technologies} />
        <EducationSection items={education} />
        <QualificationsSection items={qualifications} />
        <ResearchSection items={researches} />
        <ProjectsSection items={projects} />
        <ContactSection
          contactEmail={metadata.contact_email}
          contactLocation={metadata.contact_location}
          contactGithub={metadata.contact_github}
          contactLinkedin={metadata.contact_linkedin}
        />
      </main>

      <Footer
        footerTitle={metadata.footer_title}
        footerName={metadata.footer_name}
      />
    </>
  );
}
