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

// ── DOM Ready ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

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

    // ── THEME STATE MANAGER ───────────────────────────────────
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon      = document.getElementById("theme-icon");
    const htmlElement    = document.documentElement;

    const currentTheme = localStorage.getItem("theme") || "dark";
    if (currentTheme === "dark") {
        htmlElement.classList.add("dark");
        themeIcon.textContent = "dark_mode";
    } else {
        htmlElement.classList.remove("dark");
        themeIcon.textContent = "light_mode";
    }

    themeToggleBtn?.addEventListener("click", () => {
        if (htmlElement.classList.contains("dark")) {
            htmlElement.classList.remove("dark");
            themeIcon.textContent = "light_mode";
            localStorage.setItem("theme", "light");
            showToast("System Protocol", "Light mode parameters loaded.", "light_mode");
        } else {
            htmlElement.classList.add("dark");
            themeIcon.textContent = "dark_mode";
            localStorage.setItem("theme", "dark");
            showToast("System Protocol", "Dark mode parameters loaded.", "dark_mode");
        }
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
