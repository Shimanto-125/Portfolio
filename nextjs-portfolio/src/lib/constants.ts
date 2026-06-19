// Fallback data used when Supabase is not configured or returns no data

// Converts Google Drive share URLs to embeddable thumbnail URLs
export function resolveImageUrl(url: string): string {
  if (!url) return '';
  // https://drive.google.com/file/d/FILE_ID/...
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w800`;
  // https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w800`;
  // https://drive.google.com/uc?id=FILE_ID or export=view&id=FILE_ID
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w800`;
  return url;
}

export const FALLBACK_METADATA = {
  cv_url: 'https://drive.google.com/file/d/1V0C248sTu0yZ7dHiXjijHwUwsAsQvQRt/view?usp=sharing',
  is_available: 'true',
  hero_image_url: '',
  hero_role: 'ML Trainer & Engineer',
  hero_sub_role: 'ML Engineer,Competitive Programmer',
  hero_greeting: '',
  hero_description: '',
  hero_primary_btn: '',
  hero_secondary_btn: '',
  // Social links
  social_github: 'https://github.com/Shimanto-125',
  social_linkedin: 'https://www.linkedin.com/in/abir-shimanto-b10197291',
  social_email: 'abirshimantoas83@gmail.com',
  // About section
  about_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzcZFE2TGsKjdvARr6X48nWSMDPWpCE07g3GDvp3wbVr5EQLtoZkdQxSz-GVSiwMhnF3CoywQnZhOjY4Loms-M8SFU51S5hCJ6Jh067BDUfizGQheulXcfxZ8vlcO5phS32x4WZYQfmuCIpLPRZD0eleOiEOx-1dew8UiG-0x7DJYdU3QlWmHhyAGmoZUwCJh3j4UCCehN4uNPeJ0LGE6xwJZejVJufsqEG2PxyV4gj8C-HF3hF8PbNuG9haDxkHEAKGtOMmeprMlG',
  about_bio: 'I am a machine learning architect and trainer specializing in high-performance neural computation and intelligent digital ecosystems. I bridge brutal backend efficiency with state-of-the-art AI networks, creating resilient systems that scale and adapt.',
  about_experience: '3+ Years Professional AI/ML Engineering & Training',
  about_projects_label: '150+ Nodes',
  about_tech_desc: 'Core Engine: TensorFlow, PyTorch, React, Node.js, and Docker.',
  // Contact section
  contact_email: 'abirshimantoas83@gmail.com',
  contact_location: 'Dhaka, Bangladesh',
  contact_github: 'https://github.com/Shimanto-125',
  contact_linkedin: 'https://www.linkedin.com/in/abir-shimanto-b10197291',
  // Footer
  footer_title: 'ML Trainer',
  footer_name: 'Abir Shimanto',
};

export const FALLBACK_EDUCATION = [
  {
    id: 'fallback-edu-1',
    institution: 'American International University-Bangladesh',
    degree: 'Bachelor of Science in Computer Science & Engineering',
    department: 'CSE',
    duration: '2020 - 2024',
    grade: 'CGPA: 3.82',
    description:
      'Specialized in Intelligent Systems and Algorithms. Active member of AIUB Computer Club and Competitive Programming Wing.',
  },
];

export const FALLBACK_QUALIFICATIONS = [
  {
    id: 'fallback-qual-1',
    title: 'Bachelor of Science in Computer Science',
    subtitle: 'Dhaka City College(NU)',
    type: 'Degree',
    duration: '2021 - 2026',
  },
  {
    id: 'fallback-qual-2',
    title: 'Machine Learning Specialization',
    subtitle: 'DataCore Academy',
    type: 'Certification',
    duration: 'Completed',
  },
];

export const FALLBACK_SKILLS = [
  { id: 'fallback-skill-1', name: 'Critical thinking', percentage: 92, category: 'Critical', neural_depth: 'L9', latency: '0.4ms' },
  { id: 'fallback-skill-2', name: 'Python & ML Dev', percentage: 85, category: 'ML & Dev', neural_depth: 'L8', latency: '0.8ms' },
  { id: 'fallback-skill-3', name: 'Competitive Programming', percentage: 98, category: 'Competitive', neural_depth: 'L10', latency: '0.1ms' },
  { id: 'fallback-skill-4', name: 'Cloud & DevOps', percentage: 80, category: 'DevOps', neural_depth: 'L7', latency: '1.2ms' },
];

export const FALLBACK_RESEARCHES = [
  {
    id: 'fallback-res-1',
    title: 'Neural Network Optimization Patterns',
    authors: 'Md. Abir Shimanto',
    publisher: 'Neural Systems',
    year: '2023',
    link: '#',
    pdf_url: '#',
    image_url: '',
  },
  {
    id: 'fallback-res-2',
    title: 'Distributed Ledger Efficiency',
    authors: 'Md. Abir Shimanto',
    publisher: 'Distributed Systems',
    year: '2022',
    link: '#',
    pdf_url: '#',
    image_url: '',
  },
];

export const FALLBACK_PROJECTS = [
  {
    id: 'fallback-proj-1',
    title: 'GameHub: The Ultimate Livestreaming Platform',
    description:
      'A Twitch clone built with Next.js, Prisma, and Tailwind. Features RTMP/WHIP streaming, real-time chat, and advanced search.',
    image_url: '',
    tags: ['Next.js', 'Prisma', 'Tailwind'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
  },
  {
    id: 'fallback-proj-2',
    title: 'Google Docs 2.0: Real-Time Collaboration',
    description:
      'Full-stack app with real-time editing, comments, and notifications. Built with Next.js 14, Firebase, and TipTap editor.',
    image_url: '',
    tags: ['TypeScript', 'Node.js', 'Firebase'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
  },
  {
    id: 'fallback-proj-3',
    title: 'CloudDrive: Secure File Management',
    description:
      'Modern file storage platform with role-based permissions, folder hierarchies, advanced search, and seamless syncing.',
    image_url: '',
    tags: ['React', 'AWS', 'PostgreSQL'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
  },
];

export const FALLBACK_COMPETITIVE_PROFILES = [
  {
    id: 'cp-1',
    platform: 'codeforces',
    username: 'Shimanto-125',
    profile_url: 'https://codeforces.com/profile/Shimanto-125',
    problems_solved: 0,
    rank: 'Pupil',
    rating: 0,
    display_order: 0,
    is_visible: true,
  },
  {
    id: 'cp-2',
    platform: 'leetcode',
    username: 'AbirShimanto',
    profile_url: 'https://leetcode.com/u/AbirShimanto',
    problems_solved: 0,
    rank: '',
    rating: 0,
    display_order: 1,
    is_visible: true,
  },
  {
    id: 'cp-3',
    platform: 'codechef',
    username: 'shimanto125',
    profile_url: 'https://www.codechef.com/users/shimanto125',
    problems_solved: 0,
    rank: '3★',
    rating: 0,
    display_order: 2,
    is_visible: true,
  },
];

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#technologies', label: 'Technologies' },
  { href: '#qualifications', label: 'Qualifications' },
  { href: '#researches', label: 'Research' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact Me' },
];

export const TECH_STACK = [
  { name: 'Python', label: 'PY', type: 'text' },
  { name: 'JavaScript', label: 'JS', type: 'text' },
  { name: 'TypeScript', label: 'TS', type: 'text' },
  { name: 'React', icon: 'deployed_code', type: 'icon' },
  { name: 'Next.js', icon: 'change_history', type: 'icon' },
  { name: 'Node.js', icon: 'javascript', type: 'icon' },
  { name: 'MongoDB', icon: 'database', type: 'icon' },
  { name: 'PostgreSQL', icon: 'storage', type: 'icon' },
  { name: 'Docker', icon: 'dock', type: 'icon' },
  { name: 'Kubernetes', icon: 'hub', type: 'icon' },
  { name: 'Tailwind CSS', icon: 'palette', type: 'icon' },
  { name: 'Git', icon: 'account_tree', type: 'icon' },
  { name: 'AWS', icon: 'cloud', type: 'icon' },
];
