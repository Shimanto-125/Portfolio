// ============================================================
// Md. Abir Shimanto — Portfolio Animation Controller
// Stack: GSAP + ScrollTrigger | Lenis | Motion (Framer Motion)
// Safety: all animation libs wrapped in guards — core UI always works
// ============================================================

// ── Lenis Smooth Scroll ──────────────────────────────────────
let lenis;
try {
    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.9,
        });

        // Sync GSAP ticker with Lenis RAF loop
        if (typeof gsap !== "undefined") {
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback: use requestAnimationFrame
            function rafLoop(time) {
                lenis.raf(time);
                requestAnimationFrame(rafLoop);
            }
            requestAnimationFrame(rafLoop);
        }
    }
} catch (e) {
    console.warn("Lenis init failed:", e);
}

// ── FALLBACK TELEMETRY DATA ──────────────────────────────────
const FALLBACK_METADATA = {
    cv_url: '#',
    is_available: 'true',
    hero_role: 'ML Trainer & Engineer',
    hero_sub_role: 'Competitive Programmer'
};

const FALLBACK_EDUCATION = [
    {
        institution: 'American International University-Bangladesh',
        degree: 'Bachelor of Science in Computer Science & Engineering',
        department: 'CSE',
        duration: '2020 - 2024',
        grade: 'CGPA: 3.82',
        description: 'Specialized in Intelligent Systems and Algorithms. Active member of AIUB Computer Club and Competitive Programming Wing.'
    }
];

const FALLBACK_QUALIFICATIONS = [
    {
        title: 'Bachelor of Science in Computer Science',
        subtitle: 'Neural Institute of Technology',
        type: 'Degree',
        duration: '2019 - 2023'
    },
    {
        title: 'Machine Learning Specialization',
        subtitle: 'DataCore Academy',
        type: 'Certification',
        duration: 'Completed'
    }
];

const FALLBACK_SKILLS = [
    { name: 'Critical thinking', percentage: 92, category: 'Critical', neural_depth: 'L9', latency: '0.4ms' },
    { name: 'Python & ML Dev', percentage: 85, category: 'ML & Dev', neural_depth: 'L8', latency: '0.8ms' },
    { name: 'Competitive Programming', percentage: 98, category: 'Competitive', neural_depth: 'L10', latency: '0.1ms' },
    { name: 'Cloud & DevOps', percentage: 80, category: 'DevOps', neural_depth: 'L7', latency: '1.2ms' }
];

const FALLBACK_RESEARCHES = [
    {
        title: 'Neural Network Optimization Patterns',
        authors: 'Md. Abir Shimanto',
        publisher: 'Neural Systems',
        year: '2023',
        link: '#',
        pdf_url: '#',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzcZFE2TGsKjdvARr6X48nWSMDPWpCE07g3GDvp3wbVr5EQLtoZkdQxSz-GVSiwMhnF3CoywQnZhOjY4Loms-M8SFU51S5hCJ6Jh067BDUfizGQheulXcfxZ8vlcO5phS32x4WZYQfmuCIpLPRZD0eleOiEOx-1dew8UiG-0x7DJYdU3QlWmHhyAGmoZUwCJh3j4UCCehN4uNPeJ0LGE6xwJZejVJufsqEG2PxyV4gj8C-HF3hF8PbNuG9haDxkHEAKGtOMmeprMlG'
    },
    {
        title: 'Distributed Ledger Efficiency',
        authors: 'Md. Abir Shimanto',
        publisher: 'Distributed Systems',
        year: '2022',
        link: '#',
        pdf_url: '#',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzcZFE2TGsKjdvARr6X48nWSMDPWpCE07g3GDvp3wbVr5EQLtoZkdQxSz-GVSiwMhnF3CoywQnZhOjY4Loms-M8SFU51S5hCJ6Jh067BDUfizGQheulXcfxZ8vlcO5phS32x4WZYQfmuCIpLPRZD0eleOiEOx-1dew8UiG-0x7DJYdU3QlWmHhyAGmoZUwCJh3j4UCCehN4uNPeJ0LGE6xwJZejVJufsqEG2PxyV4gj8C-HF3hF8PbNuG9haDxkHEAKGtOMmeprMlG'
    }
];

const FALLBACK_PROJECTS = [
    {
        title: 'GameHub: The Ultimate Livestreaming Platform',
        description: 'A Twitch clone built with Next.js, Prisma, and Tailwind. Features RTMP/WHIP streaming, real-time chat, and advanced search.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8j-JpM35uqQH05Qt-6ivwmYoCORyXCV9hrjnIpgYgOkQkGhQBogG-2FFK8YYLItt5K5FNiLrW5PNUFmAsSwrs1jWX-ed0H0ufDBaOMoLNYc903WA7c2lghJM9jgK6q-_ZICraOIo55czk2giYPVtCNZuU-WibYdokOm5iJ17falZR7CvfovW8R7Uj8pluTMewmO_nO2AJmOMlYL5GrVV18nU82dUXeecw5rspcVmDMdiSZyj-QxOrgwEd54oIugLHyGxNra4K6XFQ',
        tags: ['Next.js', 'Prisma', 'Tailwind'],
        github_url: 'https://github.com',
        live_url: 'https://example.com'
    },
    {
        title: 'Google Docs 2.0: Real-Time Collaboration',
        description: 'Full-stack app with real-time editing, comments, and notifications. Built with Next.js 14, Firebase, and TipTap editor.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8j-JpM35uqQH05Qt-6ivwmYoCORyXCV9hrjnIpgYgOkQkGhQBogG-2FFK8YYLItt5K5FNiLrW5PNUFmAsSwrs1jWX-ed0H0ufDBaOMoLNYc903WA7c2lghJM9jgK6q-_ZICraOIo55czk2giYPVtCNZuU-WibYdokOm5iJ17falZR7CvfovW8R7Uj8pluTMewmO_nO2AJmOMlYL5GrVV18nU82dUXeecw5rspcVmDMdiSZyj-QxOrgwEd54oIugLHyGxNra4K6XFQ',
        tags: ['TypeScript', 'Node.js', 'Firebase'],
        github_url: 'https://github.com',
        live_url: 'https://example.com'
    },
    {
        title: 'CloudDrive: Secure File Management',
        description: 'Modern file storage platform with role-based permissions, folder hierarchies, advanced search, and seamless syncing.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8j-JpM35uqQH05Qt-6ivwmYoCORyXCV9hrjnIpgYgOkQkGhQBogG-2FFK8YYLItt5K5FNiLrW5PNUFmAsSwrs1jWX-ed0H0ufDBaOMoLNYc903WA7c2lghJM9jgK6q-_ZICraOIo55czk2giYPVtCNZuU-WibYdokOm5iJ17falZR7CvfovW8R7Uj8pluTMewmO_nO2AJmOMlYL5GrVV18nU82dUXeecw5rspcVmDMdiSZyj-QxOrgwEd54oIugLHyGxNra4K6XFQ',
        tags: ['React', 'AWS', 'PostgreSQL'],
        github_url: 'https://github.com',
        live_url: 'https://example.com'
    }
];

// Initialize Supabase Client
let supabaseClient = null;
try {
    const supabaseUrl = window.ENV?.SUPABASE_URL || localStorage.getItem("SUPABASE_URL");
    const supabaseAnonKey = window.ENV?.SUPABASE_ANON_KEY || localStorage.getItem("SUPABASE_ANON_KEY");
    if (supabaseUrl && supabaseAnonKey && typeof supabase !== "undefined") {
        supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
    }
} catch (err) {
    console.error("Supabase connection failed:", err);
}

// ── NEURON CANVAS ANIMATION ──────────────────────────────────
function initNeuronCanvas() {
    const canvas = document.getElementById("neuron-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track particles
    const particles = [];
    const maxParticles = Math.min(80, Math.floor((width * height) / 18000));
    const connectionDistance = 120;
    
    // Track mouse
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            // Palette matches the theme (electric cyan and violet)
            this.color = Math.random() > 0.5 ? "rgba(125, 216, 255," : "rgba(196, 170, 255,";
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundaries
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction push
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 1.2;
                    this.y += Math.sin(angle) * force * 1.2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + " 0.6)";
            ctx.fill();
        }
    }

    // Spawn particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Render nodes and connect synapses
        const isDark = document.documentElement.classList.contains("dark");
        if (isDark) {
            canvas.style.opacity = "0.35";
        } else {
            canvas.style.opacity = "0.08"; // Make it very subtle on light theme
        }

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();

            // Synapse lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Match line color
                    ctx.strokeStyle = isDark ? `rgba(125, 216, 255, ${alpha})` : `rgba(0, 112, 160, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
}

// ── DOM Ready ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // ── INITIALIZE NEURON CANVAS ────────────────────────────────
    initNeuronCanvas();

    // ── GSAP ANIMATIONS ─────────────────────────────────────
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Sync lenis with ScrollTrigger
        if (lenis) {
            lenis.on("scroll", ScrollTrigger.update);
        }

        // ── NAVBAR ENTRANCE ──────────────────────────────────
        gsap.from("nav", {
            opacity: 0, y: -30, duration: 0.9, ease: "power3.out", delay: 0.1,
            clearProps: "all"
        });

        // ── HERO ENTRANCE (staggered sequence) ───────────────
        const heroTl = gsap.timeline({
            defaults: { ease: "power3.out", clearProps: "all" }
        });

        heroTl
            .from("#hero h1", { opacity: 0, y: 55, duration: 1, delay: 0.3 })
            .from("#hero h2", { opacity: 0, y: 30, duration: 0.7 }, "-=0.4")
            .from("#hero p",  { opacity: 0, y: 20, duration: 0.6 }, "-=0.35")
            .from("#hero .flex.flex-wrap.gap-3", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
            .from("#hero .flex.items-center.gap-3, #hero .flex.flex-col.gap-4",
                  { opacity: 0, x: -20, duration: 0.5 }, "-=0.3")
            .from("#hero .relative.flex.justify-center",
                  { opacity: 0, scale: 0.85, duration: 1, ease: "back.out(1.4)" }, "-=0.7")
            .from("#hero .floating",
                  { opacity: 0, y: 25, stagger: 0.18, duration: 0.7, ease: "back.out(1.6)" }, "-=0.5");

        // ── SCROLL-TRIGGERED SECTION REVEALS ─────────────────
        document.querySelectorAll("section:not(#hero)").forEach((section) => {
            const heading = section.querySelector("h2, h3");
            const cards   = section.querySelectorAll(
                ".glass-panel:not(nav *), [class*='rounded-2xl']:not(nav *)"
            );
            const textEls = section.querySelectorAll("p, li");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 82%",
                    toggleActions: "play none none none",
                }
            });

            if (heading) {
                tl.from(heading, {
                    opacity: 0, y: 40, duration: 0.8, ease: "power3.out", clearProps: "all"
                });
            }
            if (textEls.length) {
                tl.from(textEls, {
                    opacity: 0, y: 18, stagger: 0.07, duration: 0.6,
                    ease: "power2.out", clearProps: "all"
                }, "-=0.4");
            }
            if (cards.length) {
                tl.from(cards, {
                    opacity: 0, y: 28, scale: 0.96, stagger: 0.1, duration: 0.65,
                    ease: "back.out(1.3)", clearProps: "all"
                }, "-=0.35");
            }
        });

        // ── BACKGROUND BLOB PARALLAX ─────────────────────────
        const blobs = document.querySelectorAll("#bg-orbs > div");
        blobs.forEach((blob, i) => {
            gsap.to(blob, {
                yPercent: i % 2 === 0 ? 35 : -35,
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 2,
                }
            });
        });

        // ── SCROLL INDICATOR FADE ─────────────────────────────
        gsap.to("#scroll-indicator", {
            opacity: 0, y: -12, ease: "none",
            scrollTrigger: {
                trigger: "#hero",
                start: "bottom 85%",
                end: "bottom 60%",
                scrub: true,
            }
        });

    } else {
        // No GSAP — make sure all elements are visible
        console.warn("GSAP not loaded — skipping animations.");
    }

    // ── MOTION (FRAMER MOTION VANILLA) MICRO-INTERACTIONS ────
    // The CDN exposes the library as window.Motion
    try {
        const MotionLib = window.Motion;
        if (MotionLib && typeof MotionLib.animate === "function") {
            const { animate, hover, stagger } = MotionLib;

            // CTA button spring hover
            document.querySelectorAll("a[href='#contact'], #download-cv").forEach((btn) => {
                hover(btn, () => {
                    animate(btn, { scale: 1.06 }, { type: "spring", stiffness: 400, damping: 20 });
                    return () => animate(btn, { scale: 1 }, { type: "spring", stiffness: 300, damping: 18 });
                });
            });

            // Nav link lift
            document.querySelectorAll(".nav-link").forEach((link) => {
                hover(link, () => {
                    animate(link, { y: -2 }, { type: "spring", stiffness: 500, damping: 25 });
                    return () => animate(link, { y: 0 }, { type: "spring", stiffness: 400, damping: 22 });
                });
            });

            // Social icon bounce
            document.querySelectorAll(
                "[aria-label='GitHub'], [aria-label='LinkedIn'], [aria-label='Gmail']"
            ).forEach((icon) => {
                hover(icon, () => {
                    animate(icon, { scale: 1.18, rotate: 8 }, { type: "spring", stiffness: 500, damping: 18 });
                    return () => animate(icon, { scale: 1, rotate: 0 }, { type: "spring", stiffness: 380, damping: 20 });
                });
            });

            // Glass card hover lift
            document.querySelectorAll(".glass-panel:not(nav)").forEach((card) => {
                hover(card, () => {
                    animate(card, { scale: 1.02, y: -5 }, { type: "spring", stiffness: 350, damping: 22 });
                    return () => animate(card, { scale: 1, y: 0 }, { type: "spring", stiffness: 280, damping: 20 });
                });
            });
        }
    } catch (e) {
        console.warn("Motion micro-interactions failed:", e);
    }

    // Load dynamic content from Supabase
    loadDynamicData();

    // ── ANCHOR SMOOTH SCROLL ROUTER ──────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetEl, { offset: -80 });
                } else {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    async function loadDynamicData() {
        // 1. Site Metadata Settings
        let metadata = { ...FALLBACK_METADATA };
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('site_metadata').select('*');
                if (!error && data) {
                    data.forEach(item => {
                        metadata[item.key] = item.value;
                    });
                }
            } catch (err) {}
        }
        
        // Update CV & Hero
        window.cv_url = metadata.cv_url || '#';
        const heroRoleEl = document.getElementById("hero-role-title");
        if (heroRoleEl && metadata.hero_role) {
            heroRoleEl.textContent = metadata.hero_role;
        }
        const heroSubroleEl = document.getElementById("hero-subrole-title");
        if (heroSubroleEl && metadata.hero_sub_role) {
            heroSubroleEl.textContent = metadata.hero_sub_role;
        }
        
        // Update Status indicator in About section if available
        const statusBadge = document.querySelector("#about [class*='text-[10px] font-label-sm']");
        if (statusBadge) {
            const isAvail = metadata.is_available === 'true';
            statusBadge.textContent = isAvail ? 'Status: Available' : 'Status: Unavailable';
            statusBadge.className = isAvail 
                ? 'text-[10px] font-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase'
                : 'text-[10px] font-label-sm text-error bg-error/10 px-2 py-0.5 rounded-full uppercase';
        }

        // 2. Load Education
        let educationList = FALLBACK_EDUCATION;
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('education').select('*').order('created_at', { ascending: true });
                if (!error && data && data.length > 0) educationList = data;
            } catch (err) {}
        }
        renderEducation(educationList);

        // 3. Load Qualifications
        let qualificationsList = FALLBACK_QUALIFICATIONS;
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('qualifications').select('*').order('created_at', { ascending: true });
                if (!error && data && data.length > 0) qualificationsList = data;
            } catch (err) {}
        }
        renderQualifications(qualificationsList);

        // 4. Load Skills
        let skillsList = FALLBACK_SKILLS;
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('skills').select('*').order('created_at', { ascending: true });
                if (!error && data && data.length > 0) skillsList = data;
            } catch (err) {}
        }
        renderSkills(skillsList);

        // 5. Load Researches
        let researchesList = FALLBACK_RESEARCHES;
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('researches').select('*').eq('is_visible', true).order('created_at', { ascending: true });
                if (!error && data && data.length > 0) researchesList = data;
            } catch (err) {}
        }
        renderResearches(researchesList);

        // 6. Load Projects
        let projectsList = FALLBACK_PROJECTS;
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('projects').select('*').eq('is_visible', true).order('created_at', { ascending: true });
                if (!error && data && data.length > 0) projectsList = data;
            } catch (err) {}
        }
        renderProjects(projectsList);

        // Refresh Lenis & ScrollTrigger positions dynamically
        setTimeout(() => {
            if (lenis) {
                lenis.resize();
            }
            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }
        }, 300);
    }

    function renderEducation(items) {
        const container = document.getElementById("education-container");
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="glass-panel p-8 rounded-3xl border-primary/10 group hover:bg-primary/5 transition-all duration-500 flex gap-6 items-start">
                <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 bloom-primary flex-shrink-0">
                    <span class="material-symbols-outlined text-3xl">school</span>
                </div>
                <div class="space-y-2 w-full">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <span class="text-[10px] font-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">${item.grade || 'GRADUATE'}</span>
                        <span class="text-[10px] font-label-sm text-on-surface-variant">${item.duration}</span>
                    </div>
                    <h4 class="font-headline-md text-xl">${item.degree}</h4>
                    <p class="font-body-md text-sm text-primary-container font-semibold">${item.institution}</p>
                    ${item.department ? `<p class="text-xs text-on-surface-variant/80">Department: ${item.department}</p>` : ''}
                    ${item.description ? `<p class="font-body-md text-sm text-on-surface-variant leading-relaxed mt-2">${item.description}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    function renderQualifications(items) {
        const container = document.getElementById("qualifications-container");
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="glass-panel p-8 rounded-3xl border-secondary/10 group hover:bg-secondary/5 transition-all duration-500 flex gap-6 items-start">
                <div class="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(192,193,255,0.3)] flex-shrink-0">
                    <span class="material-symbols-outlined text-3xl">${item.type === 'Degree' ? 'school' : 'workspace_premium'}</span>
                </div>
                <div class="space-y-2 w-full">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase">${item.type}</span>
                        <span class="text-[10px] font-label-sm text-on-surface-variant">${item.duration}</span>
                    </div>
                    <h4 class="font-headline-md text-xl">${item.title}</h4>
                    <p class="font-body-md text-sm text-on-surface-variant">${item.subtitle}</p>
                </div>
            </div>
        `).join('');
    }

    function renderSkills(items) {
        const container = document.getElementById("skills-container");
        if (!container) return;
        
        // Group skills by category
        const groups = {};
        items.forEach(skill => {
            if (!groups[skill.category]) {
                groups[skill.category] = [];
            }
            groups[skill.category].push(skill);
        });

        container.innerHTML = Object.keys(groups).map(category => `
            <div class="glass-panel p-6 rounded-3xl border-primary/15 hover:border-primary/40 transition-all duration-300 flex flex-col gap-6 relative group">
                <div class="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 class="font-headline-md text-lg text-primary tracking-wider uppercase font-semibold">${category}</h4>
                    <span class="text-[9px] font-label-sm text-outline opacity-60">LOAD_BALANCED</span>
                </div>
                <div class="flex flex-col gap-6">
                    ${groups[category].map(skill => `
                        <div class="space-y-2 relative group/item">
                            <div class="flex justify-between items-center">
                                <span class="font-headline-md text-sm text-on-surface font-medium">${skill.name}</span>
                                <span class="text-[10px] font-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full">${skill.neural_depth || 'L8'}</span>
                            </div>
                            <div class="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                <div class="h-full bg-primary-container shadow-[0_0_10px_var(--glow-color)] transition-all duration-1000" style="width: ${skill.percentage}%"></div>
                            </div>
                            <div class="flex justify-between text-[9px] font-label-sm text-on-surface-variant opacity-60">
                                <span>SYNAPSE: ${skill.percentage}%</span>
                                <span>LATENCY: ${skill.latency || '0.5ms'}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    function renderResearches(items) {
        const container = document.getElementById("researches-container");
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="glass-panel p-6 rounded-3xl border-primary/10 group hover:bg-primary/5 transition-all duration-500 flex flex-col justify-between gap-6">
                <div>
                    <div class="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative border border-white/5">
                        <img src="${item.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzcZFE2TGsKjdvARr6X48nWSMDPWpCE07g3GDvp3wbVr5EQLtoZkdQxSz-GVSiwMhnF3CoywQnZhOjY4Loms-M8SFU51S5hCJ6Jh067BDUfizGQheulXcfxZ8vlcO5phS32x4WZYQfmuCIpLPRZD0eleOiEOx-1dew8UiG-0x7DJYdU3QlWmHhyAGmoZUwCJh3j4UCCehN4uNPeJ0LGE6xwJZejVJufsqEG2PxyV4gj8C-HF3hF8PbNuG9haDxkHEAKGtOMmeprMlG'}" alt="${item.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">${item.publisher || 'Research'}</span>
                            <span class="text-[10px] font-label-sm text-on-surface-variant">${item.year || '2026'}</span>
                        </div>
                        <h4 class="font-headline-md text-xl text-glow-hover transition-colors line-clamp-2">${item.title}</h4>
                        <p class="text-xs text-secondary/80 font-medium">Authors: ${item.authors}</p>
                    </div>
                </div>
                <div class="flex gap-3 mt-auto">
                    ${item.pdf_url ? `
                        <a href="${item.pdf_url}" target="_blank" class="flex-1 py-3 glass-panel border border-primary/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/40 transition-all text-center">
                            <span class="material-symbols-outlined text-sm">description</span> Read Paper
                        </a>
                    ` : ''}
                    ${item.link ? `
                        <a href="${item.link}" target="_blank" class="flex-1 py-3 glass-panel border border-secondary/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-secondary/10 hover:border-secondary/40 transition-all text-center">
                            <span class="material-symbols-outlined text-sm">open_in_new</span> View Details
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    function renderProjects(items) {
        const container = document.getElementById("projects-container");
        if (!container) return;
        container.innerHTML = items.map((item, idx) => {
            const colors = ['primary', 'secondary', 'tertiary'];
            const color = colors[idx % 3];
            const tagsHtml = (item.tags || []).map(tag => `
                <span class="px-3 py-1 bg-${color}/10 border border-${color}/20 rounded-full text-[10px] font-label-sm text-${color}">${tag}</span>
            `).join('');

            return `
                <div class="glass-panel rounded-3xl overflow-hidden border border-white/10 group hover:border-${color}/40 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between">
                    <div>
                        <div class="aspect-video overflow-hidden relative">
                            <img alt="${item.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" src="${item.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8j-JpM35uqQH05Qt-6ivwmYoCORyXCV9hrjnIpgYgOkQkGhQBogG-2FFK8YYLItt5K5FNiLrW5PNUFmAsSwrs1jWX-ed0H0ufDBaOMoLNYc903WA7c2lghJM9jgK6q-_ZICraOIo55czk2giYPVtCNZuU-WibYdokOm5iJ17falZR7CvfovW8R7Uj8pluTMewmO_nO2AJmOMlYL5GrVV18nU82dUXeecw5rspcVmDMdiSZyj-QxOrgwEd54oIugLHyGxNra4K6XFQ'}">
                            <div class="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent opacity-60"></div>
                        </div>
                        <div class="p-6 space-y-4">
                            <h4 class="font-headline-md text-xl text-${color}-container font-bold">${item.title}</h4>
                            <p class="font-body-md text-sm text-on-surface-variant leading-relaxed line-clamp-3">${item.description}</p>
                            <div class="flex flex-wrap gap-2 pt-2">
                                ${tagsHtml}
                            </div>
                        </div>
                    </div>
                    <div class="p-6 pt-0 flex gap-3">
                        ${item.github_url ? `
                            <a class="flex-1 py-2 glass-panel border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all" href="${item.github_url}" target="_blank" rel="noopener noreferrer">
                                <span class="material-symbols-outlined text-sm">code</span> GitHub
                            </a>
                        ` : ''}
                        ${item.live_url ? `
                            <a class="flex-1 py-2 bg-${color}-container text-on-${color} rounded-xl text-xs font-bold flex items-center justify-center gap-2 bloom-${color} hover:scale-105 transition-all text-center font-bold" href="${item.live_url}" target="_blank" rel="noopener noreferrer">
                                <span class="material-symbols-outlined text-sm">rocket_launch</span> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // ── THEME STATE MANAGER ───────────────────────────────────
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon      = document.getElementById("theme-icon");
    const htmlElement    = document.documentElement;

    const applyTheme = (theme) => {
        htmlElement.classList.remove("dark");
        if (theme === "dark") {
            htmlElement.classList.add("dark");
            themeIcon.textContent = "dark_mode";
        } else {
            themeIcon.textContent = "light_mode";
        }
        localStorage.setItem("theme", theme);
    };

    const currentTheme = localStorage.getItem("theme") || "dark";
    applyTheme(currentTheme);

    themeToggleBtn?.addEventListener("click", () => {
        let newTheme = "dark";
        if (htmlElement.classList.contains("dark")) {
            newTheme = "light";
            showToast("System Protocol", "Light mode parameters loaded.", "light_mode");
        } else {
            newTheme = "dark";
            showToast("System Protocol", "Dark mode parameters loaded.", "dark_mode");
        }
        applyTheme(newTheme);
    });

    // ── MOBILE NAVIGATION DRAWER ──────────────────────────────
    const mobileMenu       = document.getElementById("mobile-menu");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenuClose  = document.getElementById("mobile-menu-close");
    const mobileNavLinks   = document.querySelectorAll(".mobile-nav-link");

    const openMobileMenu = () => {
        mobileMenu?.classList.remove("translate-x-full");
        mobileMenu?.classList.add("translate-x-0");
        document.body.style.overflow = "hidden";
        // Animate nav links in with Motion if available
        try {
            if (window.Motion?.animate) {
                const links = mobileMenu?.querySelectorAll("a");
                if (links?.length) {
                    window.Motion.animate(links,
                        { opacity: [0, 1], x: [30, 0] },
                        { delay: window.Motion.stagger(0.08), duration: 0.4 }
                    );
                }
            }
        } catch (e) {}
    };

    const closeMobileMenu = () => {
        mobileMenu?.classList.remove("translate-x-0");
        mobileMenu?.classList.add("translate-x-full");
        document.body.style.overflow = "";
    };

    mobileMenuToggle?.addEventListener("click", openMobileMenu);
    mobileMenuClose?.addEventListener("click", closeMobileMenu);
    mobileNavLinks.forEach(link => link.addEventListener("click", closeMobileMenu));

    // ── ACTIVE NAV LINK HIGHLIGHTING ──────────────────────────
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const observerOptions = {
        root: null,
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("nav-active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("nav-active");
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // ── CONTACT FORM ─────────────────────────────────────────
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("form-submit");
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Transmitting Data...</span>
                <span class="material-symbols-outlined animate-spin">sync</span>
            `;

            setTimeout(() => {
                const name = document.getElementById("form-name").value;
                showToast("Transmission Successful",
                    `Telemetry verified. Thank you, ${name}! Your transmission has been uploaded.`,
                    "check_circle");
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        });
    }

    // ── DOWNLOAD CV ──────────────────────────────────────────
    const downloadCvBtn = document.getElementById("download-cv");
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener("click", () => {
            showToast("CV Node Response",
                "Initiating download of Md. Abir Shimanto's CV (ML Trainer & Engineer).",
                "download");
            if (window.cv_url && window.cv_url !== '#') {
                setTimeout(() => {
                    window.open(window.cv_url, "_blank");
                }, 1000);
            }
        });
    }

    // ── TOAST NOTIFICATION SYSTEM ─────────────────────────────
    function showToast(title, message, iconName = "notifications") {
        const toastContainer = document.getElementById("toast-container");
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "glass-panel p-4 rounded-xl flex items-start gap-3 border-primary-container/20 shadow-lg pointer-events-auto toast-in min-w-[280px] max-w-[350px]";

        toast.innerHTML = `
            <div class="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container flex-shrink-0">
                <span class="material-symbols-outlined text-lg">${iconName}</span>
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-xs font-label-sm text-primary uppercase font-bold tracking-wider truncate">${title}</div>
                <div class="text-xs font-body-md text-on-surface mt-1 leading-normal">${message}</div>
            </div>
            <button class="text-on-surface-variant hover:text-primary transition-colors focus:outline-none flex-shrink-0 class-close">
                <span class="material-symbols-outlined text-sm">close</span>
            </button>
        `;

        const closeBtn = toast.querySelector(".class-close");
        const dismissToast = () => {
            toast.classList.remove("toast-in");
            toast.classList.add("toast-out");
            toast.addEventListener("animationend", () => toast.remove());
        };

        if (closeBtn) closeBtn.addEventListener("click", dismissToast);
        setTimeout(dismissToast, 4000);
        toastContainer.appendChild(toast);
    }
});
