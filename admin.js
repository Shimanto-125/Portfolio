// ============================================================
// Md. Abir Shimanto — Admin Panel Controller
// Stack: Supabase Client SDK + ImgBB API + Dynamic Forms
// ============================================================

let supabaseClient = null;
let imgbbApiKey = "";

// Initialize connections on load
document.addEventListener("DOMContentLoaded", () => {
    initConnections();
    setupAuthListeners();
    setupTabControls();
    setupFirstTimeSetup();
    checkActiveSession();
});

// First-time setup form (on login screen, shown when no credentials exist)
function setupFirstTimeSetup() {
    const supabaseUrl = window.ENV?.SUPABASE_URL || localStorage.getItem("SUPABASE_URL");
    const supabaseKey = window.ENV?.SUPABASE_ANON_KEY || localStorage.getItem("SUPABASE_ANON_KEY");

    // Show the setup section on the login page only if no credentials found
    if (!supabaseUrl || !supabaseKey) {
        const setupSection = document.getElementById("setup-section");
        if (setupSection) setupSection.classList.remove("hidden");
    }

    const setupForm = document.getElementById("setup-credentials-form");
    if (setupForm) {
        setupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const url = document.getElementById("setup-supabase-url").value.trim();
            const key = document.getElementById("setup-supabase-key").value.trim();
            const imgbb = document.getElementById("setup-imgbb-key").value.trim();

            if (!url || !key) {
                showToast("Missing Credentials", "Supabase URL and Anon Key are required.", "error");
                return;
            }

            localStorage.setItem("SUPABASE_URL", url);
            localStorage.setItem("SUPABASE_ANON_KEY", key);
            if (imgbb) localStorage.setItem("IMGBB_API_KEY", imgbb);

            showToast("Credentials Saved", "Reinitializing connection...", "check_circle");
            setTimeout(() => window.location.reload(), 1000);
        });
    }
}

function toggleSetup() {
    const wrapper = document.getElementById("setup-form-wrapper");
    const icon = document.getElementById("setup-toggle-icon");
    const label = document.getElementById("setup-toggle-label");
    const isHidden = wrapper.classList.contains("hidden");

    wrapper.classList.toggle("hidden", !isHidden);
    icon.textContent = isHidden ? "expand_less" : "expand_more";
    label.textContent = isHidden ? "Hide Setup" : "First Time? Configure Supabase";
}

// Initialize Supabase & ImgBB connections
function initConnections() {
    const supabaseUrl = window.ENV?.SUPABASE_URL || localStorage.getItem("SUPABASE_URL");
    const supabaseAnonKey = window.ENV?.SUPABASE_ANON_KEY || localStorage.getItem("SUPABASE_ANON_KEY");
    imgbbApiKey = window.ENV?.IMGBB_API_KEY || localStorage.getItem("IMGBB_API_KEY") || "";

    // Fill credentials form inputs
    const credUrlInput = document.getElementById("cred-supabase-url");
    const credKeyInput = document.getElementById("cred-supabase-key");
    const credImgbbInput = document.getElementById("cred-imgbb-key");
    if (credUrlInput) credUrlInput.value = supabaseUrl || "";
    if (credKeyInput) credKeyInput.value = supabaseAnonKey || "";
    if (credImgbbInput) credImgbbInput.value = imgbbApiKey || "";

    if (supabaseUrl && supabaseAnonKey && typeof supabase !== "undefined") {
        try {
            supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
        } catch (e) {
            console.error("Supabase client creation failed:", e);
            showToast("System Error", "Failed to initialize Supabase client.", "error");
        }
    } else {
        showToast("Configuration Missing", "Supabase URL and Anon Key are required. Check your API credentials tab.", "warning");
        // Open credentials tab immediately if keys are missing and logged in
        switchTab("credentials");
    }
}

// Credentials Form Submission
const credentialsForm = document.getElementById("credentials-form");
if (credentialsForm) {
    credentialsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = document.getElementById("cred-supabase-url").value.trim();
        const key = document.getElementById("cred-supabase-key").value.trim();
        const imgbb = document.getElementById("cred-imgbb-key").value.trim();

        localStorage.setItem("SUPABASE_URL", url);
        localStorage.setItem("SUPABASE_ANON_KEY", key);
        localStorage.setItem("IMGBB_API_KEY", imgbb);

        showToast("Credentials Saved", "Local credentials updated. Reinitializing...", "check_circle");
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
}

// Check if user session already exists
async function checkActiveSession() {
    if (!supabaseClient) return;
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (session && !error) {
            showDashboard();
        } else {
            showLogin();
        }
    } catch (e) {
        showLogin();
    }
}

// Auth UI control toggles
function showDashboard() {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("dashboard-container").classList.remove("hidden");
    loadAllData();
}

function showLogin() {
    document.getElementById("login-container").classList.remove("hidden");
    document.getElementById("dashboard-container").classList.add("hidden");
}

// Set up Auth Form and Logout Handlers
function setupAuthListeners() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("login-submit");
            const originalBtnText = submitBtn.innerHTML;

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            if (!supabaseClient) {
                showToast("Connection Error", "Cannot login. Supabase client is not configured.", "error");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Verifying credentials...</span><span class="material-symbols-outlined animate-spin text-sm">sync</span>`;

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) {
                    showToast("Authentication Failed", error.message, "error");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                } else {
                    showToast("Access Granted", "Telemetry session established successfully.", "check_circle");
                    setTimeout(() => {
                        showDashboard();
                    }, 1000);
                }
            } catch (err) {
                showToast("Auth Exception", err.message || "Unknown error", "error");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
            showToast("Session Terminated", "Security tokens cleared successfully.", "info");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
}

// Tab Switching Controls
function setupTabControls() {
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabName = btn.getAttribute("data-tab");
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update sidebar buttons styling
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
        if (btn.getAttribute("data-tab") === tabName) {
            btn.classList.add("text-primary", "bg-primary/10");
            btn.classList.remove("text-on-surface-variant");
        } else {
            btn.classList.remove("text-primary", "bg-primary/10");
            btn.classList.add("text-on-surface-variant");
        }
    });

    // Update panels visibility
    const panels = document.querySelectorAll(".tab-panel");
    panels.forEach(panel => {
        if (panel.getAttribute("id") === `tab-${tabName}`) {
            panel.classList.remove("hidden");
        } else {
            panel.classList.add("hidden");
        }
    });
}

// Global data loading function
function loadAllData() {
    if (!supabaseClient) return;
    loadMetadata();
    loadSkills();
    loadEducation();
    loadQualifications();
    loadProjects();
    loadResearch();
}

// ============================================================
// 1. SITE METADATA / SETTINGS CRUD
// ============================================================
async function loadMetadata() {
    try {
        const { data, error } = await supabaseClient.from("site_metadata").select("*");
        if (error) throw error;

        const metadataMap = {};
        data.forEach(item => { metadataMap[item.key] = item.value; });

        document.getElementById("meta-hero-role").value = metadataMap.hero_role || "";
        document.getElementById("meta-hero-sub-role").value = metadataMap.hero_sub_role || "";
        document.getElementById("meta-cv-url").value = metadataMap.cv_url || "";
        document.getElementById("meta-is-available").value = metadataMap.is_available || "true";

        const heroImageUrl = metadataMap.hero_image_url || "";
        document.getElementById("meta-hero-image-url").value = heroImageUrl;
        if (heroImageUrl) {
            document.getElementById("meta-hero-preview-img").src = heroImageUrl;
            document.getElementById("meta-hero-image-preview").classList.remove("hidden");
        }
    } catch (e) {
        showToast("Error Loading Settings", e.message, "error");
    }
}

const metadataForm = document.getElementById("metadata-form");
if (metadataForm) {
    metadataForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById("meta-save-btn");
        const originalBtnHTML = saveBtn.innerHTML;

        const hero_role = document.getElementById("meta-hero-role").value.trim();
        const hero_sub_role = document.getElementById("meta-hero-sub-role").value.trim();
        const cv_url = document.getElementById("meta-cv-url").value.trim();
        const is_available = document.getElementById("meta-is-available").value;
        let hero_image_url = document.getElementById("meta-hero-image-url").value.trim();

        // Handle ImgBB upload if file selected
        const fileInput = document.getElementById("meta-hero-image-file");
        if (fileInput && fileInput.files.length > 0) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<span>Uploading Image...</span><span class="material-symbols-outlined animate-spin text-base">sync</span>`;
            const uploadedUrl = await uploadImageToImgBB(fileInput.files[0]);
            if (uploadedUrl) {
                hero_image_url = uploadedUrl;
                document.getElementById("meta-hero-image-url").value = hero_image_url;
                document.getElementById("meta-hero-preview-img").src = hero_image_url;
                document.getElementById("meta-hero-image-preview").classList.remove("hidden");
            } else {
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalBtnHTML;
                return;
            }
        }

        // Update preview for direct URL input
        if (hero_image_url) {
            document.getElementById("meta-hero-preview-img").src = hero_image_url;
            document.getElementById("meta-hero-image-preview").classList.remove("hidden");
        }

        const payload = [
            { key: 'hero_role', value: hero_role },
            { key: 'hero_sub_role', value: hero_sub_role },
            { key: 'cv_url', value: cv_url },
            { key: 'is_available', value: is_available },
            { key: 'hero_image_url', value: hero_image_url }
        ];

        try {
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<span>Saving...</span><span class="material-symbols-outlined animate-spin text-base">sync</span>`;
            const { error } = await supabaseClient.from("site_metadata").upsert(payload, { onConflict: 'key' });
            if (error) throw error;
            showToast("Settings Updated", "Global settings updated successfully.", "check_circle");
        } catch (err) {
            showToast("Settings Error", err.message, "error");
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnHTML;
        }
    });
}

// ============================================================
// 2. SKILL METRICS CRUD
// ============================================================
async function loadSkills() {
    try {
        const { data, error } = await supabaseClient.from("skills").select("*").order("category");
        if (error) throw error;

        const tbody = document.getElementById("skills-table-body");
        tbody.innerHTML = data.map(skill => `
            <tr>
                <td class="px-6 py-4 font-bold text-glow">${skill.name}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <span class="w-8 font-semibold">${skill.percentage}%</span>
                        <div class="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-primary" style="width: ${skill.percentage}%"></div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4"><span class="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs">${skill.category}</span></td>
                <td class="px-6 py-4 text-xs font-mono text-on-surface-variant">${skill.neural_depth || 'L8'} / ${skill.latency || '0.5ms'}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button onclick="editSkill('${skill.id}', '${escapeHtml(skill.name)}', ${skill.percentage}, '${escapeHtml(skill.category)}', '${escapeHtml(skill.neural_depth)}', '${escapeHtml(skill.latency)}')" class="text-primary hover:underline text-xs">Edit</button>
                    <button onclick="deleteSkill('${skill.id}')" class="text-red-400 hover:underline text-xs">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        showToast("Error Loading Skills", e.message, "error");
    }
}

function openSkillModal() {
    document.getElementById("skill-id").value = "";
    document.getElementById("skill-name").value = "";
    document.getElementById("skill-percentage").value = "80";
    document.getElementById("skill-category").value = "";
    document.getElementById("skill-depth").value = "L8";
    document.getElementById("skill-latency").value = "0.5ms";
    document.getElementById("skill-modal-title").textContent = "Add New Skill";
    openModal("skill-modal");
}

function editSkill(id, name, percentage, category, depth, latency) {
    document.getElementById("skill-id").value = id;
    document.getElementById("skill-name").value = name;
    document.getElementById("skill-percentage").value = percentage;
    document.getElementById("skill-category").value = category;
    document.getElementById("skill-depth").value = depth || "L8";
    document.getElementById("skill-latency").value = latency || "0.5ms";
    document.getElementById("skill-modal-title").textContent = "Edit Skill Metrics";
    openModal("skill-modal");
}

const skillForm = document.getElementById("skill-form");
if (skillForm) {
    skillForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("skill-id").value;
        const name = document.getElementById("skill-name").value.trim();
        const percentage = parseInt(document.getElementById("skill-percentage").value);
        const category = document.getElementById("skill-category").value.trim();
        const neural_depth = document.getElementById("skill-depth").value.trim() || "L8";
        const latency = document.getElementById("skill-latency").value.trim() || "0.5ms";

        const payload = { name, percentage, category, neural_depth, latency };

        try {
            let res;
            if (id) {
                res = await supabaseClient.from("skills").update(payload).eq("id", id);
            } else {
                res = await supabaseClient.from("skills").insert(payload);
            }
            if (res.error) throw res.error;
            showToast("Skill Saved", "Metrics updated successfully.", "check_circle");
            closeModal("skill-modal");
            loadSkills();
        } catch (err) {
            showToast("Skill Error", err.message, "error");
        }
    });
}

async function deleteSkill(id) {
    if (!confirm("Are you sure you want to remove this skill record?")) return;
    try {
        const { error } = await supabaseClient.from("skills").delete().eq("id", id);
        if (error) throw error;
        showToast("Skill Removed", "Record purged.", "check_circle");
        loadSkills();
    } catch (e) {
        showToast("Deletion Error", e.message, "error");
    }
}

// ============================================================
// 3. EDUCATION CRUD
// ============================================================
async function loadEducation() {
    try {
        const { data, error } = await supabaseClient.from("education").select("*").order("created_at", { ascending: true });
        if (error) throw error;

        const container = document.getElementById("education-list-container");
        container.innerHTML = data.map(item => `
            <div class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4 hover:border-primary/20 transition-all">
                <div class="space-y-1 flex-1">
                    <span class="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded uppercase font-bold">${item.grade || 'GRADUATE'}</span>
                    <h4 class="text-lg font-bold">${item.degree}</h4>
                    <p class="text-sm font-semibold text-primary-container">${item.institution} (${item.duration})</p>
                    ${item.department ? `<p class="text-xs text-on-surface-variant/80">Department: ${item.department}</p>` : ''}
                    ${item.description ? `<p class="text-xs text-on-surface-variant mt-2 leading-relaxed whitespace-pre-line">${item.description}</p>` : ''}
                </div>
                <div class="flex gap-2">
                    <button onclick="editEducation('${item.id}', '${escapeHtml(item.institution)}', '${escapeHtml(item.degree)}', '${escapeHtml(item.department)}', '${escapeHtml(item.duration)}', '${escapeHtml(item.grade)}', '${escapeHtml(item.description)}')" class="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs rounded border border-white/10 text-primary">Edit</button>
                    <button onclick="deleteEducation('${item.id}')" class="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-xs rounded border border-red-500/20 text-red-400">Delete</button>
                </div>
            </div>
        `).join('') || `<p class="text-xs text-on-surface-variant italic">No education records loaded. Seed tables or add records.</p>`;
    } catch (e) {
        showToast("Error Loading Education", e.message, "error");
    }
}

function openEducationModal() {
    document.getElementById("education-id").value = "";
    document.getElementById("edu-institution").value = "";
    document.getElementById("edu-degree").value = "";
    document.getElementById("edu-department").value = "";
    document.getElementById("edu-grade").value = "";
    document.getElementById("edu-duration").value = "";
    document.getElementById("edu-description").value = "";
    document.getElementById("education-modal-title").textContent = "Add Academic Record";
    openModal("education-modal");
}

function editEducation(id, institution, degree, department, duration, grade, description) {
    document.getElementById("education-id").value = id;
    document.getElementById("edu-institution").value = institution;
    document.getElementById("edu-degree").value = degree;
    document.getElementById("edu-department").value = department;
    document.getElementById("edu-grade").value = grade;
    document.getElementById("edu-duration").value = duration;
    document.getElementById("edu-description").value = description;
    document.getElementById("education-modal-title").textContent = "Edit Academic Record";
    openModal("education-modal");
}

const educationForm = document.getElementById("education-form");
if (educationForm) {
    educationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("education-id").value;
        const institution = document.getElementById("edu-institution").value.trim();
        const degree = document.getElementById("edu-degree").value.trim();
        const department = document.getElementById("edu-department").value.trim();
        const grade = document.getElementById("edu-grade").value.trim();
        const duration = document.getElementById("edu-duration").value.trim();
        const description = document.getElementById("edu-description").value.trim();

        const payload = { institution, degree, department, grade, duration, description };

        try {
            let res;
            if (id) {
                res = await supabaseClient.from("education").update(payload).eq("id", id);
            } else {
                res = await supabaseClient.from("education").insert(payload);
            }
            if (res.error) throw res.error;
            showToast("Education Record Saved", "Successfully stored degree details.", "check_circle");
            closeModal("education-modal");
            loadEducation();
        } catch (err) {
            showToast("Saving Error", err.message, "error");
        }
    });
}

async function deleteEducation(id) {
    if (!confirm("Delete this academic record from database?")) return;
    try {
        const { error } = await supabaseClient.from("education").delete().eq("id", id);
        if (error) throw error;
        showToast("Record Deleted", "purged from server database.", "check_circle");
        loadEducation();
    } catch (e) {
        showToast("Error Deleting", e.message, "error");
    }
}

// ============================================================
// 4. QUALIFICATIONS CRUD
// ============================================================
async function loadQualifications() {
    try {
        const { data, error } = await supabaseClient.from("qualifications").select("*").order("created_at", { ascending: true });
        if (error) throw error;

        const container = document.getElementById("qualifications-list-container");
        container.innerHTML = data.map(item => `
            <div class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4 hover:border-secondary/20 transition-all">
                <div class="space-y-1 flex-1">
                    <span class="text-[10px] font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded uppercase font-bold">${item.type}</span>
                    <h4 class="text-lg font-bold">${item.title}</h4>
                    <p class="text-sm font-semibold text-on-surface-variant">${item.subtitle} (${item.duration})</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editQualification('${item.id}', '${escapeHtml(item.title)}', '${escapeHtml(item.subtitle)}', '${escapeHtml(item.type)}', '${escapeHtml(item.duration)}')" class="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs rounded border border-white/10 text-primary">Edit</button>
                    <button onclick="deleteQualification('${item.id}')" class="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-xs rounded border border-red-500/20 text-red-400">Delete</button>
                </div>
            </div>
        `).join('') || `<p class="text-xs text-on-surface-variant italic">No qualification records loaded. Seed tables or add records.</p>`;
    } catch (e) {
        showToast("Error Loading Qualifications", e.message, "error");
    }
}

function openQualificationModal() {
    document.getElementById("qualification-id").value = "";
    document.getElementById("qual-title").value = "";
    document.getElementById("qual-subtitle").value = "";
    document.getElementById("qual-type").value = "Degree";
    document.getElementById("qual-duration").value = "";
    document.getElementById("qualification-modal-title").textContent = "Add Milestone Record";
    openModal("qualification-modal");
}

function editQualification(id, title, subtitle, type, duration) {
    document.getElementById("qualification-id").value = id;
    document.getElementById("qual-title").value = title;
    document.getElementById("qual-subtitle").value = subtitle;
    document.getElementById("qual-type").value = type;
    document.getElementById("qual-duration").value = duration;
    document.getElementById("qualification-modal-title").textContent = "Edit Milestone Record";
    openModal("qualification-modal");
}

const qualificationForm = document.getElementById("qualification-form");
if (qualificationForm) {
    qualificationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("qualification-id").value;
        const title = document.getElementById("qual-title").value.trim();
        const subtitle = document.getElementById("qual-subtitle").value.trim();
        const type = document.getElementById("qual-type").value;
        const duration = document.getElementById("qual-duration").value.trim();

        const payload = { title, subtitle, type, duration };

        try {
            let res;
            if (id) {
                res = await supabaseClient.from("qualifications").update(payload).eq("id", id);
            } else {
                res = await supabaseClient.from("qualifications").insert(payload);
            }
            if (res.error) throw res.error;
            showToast("Qualification Saved", "Successfully stored qualification milestone.", "check_circle");
            closeModal("qualification-modal");
            loadQualifications();
        } catch (err) {
            showToast("Saving Error", err.message, "error");
        }
    });
}

async function deleteQualification(id) {
    if (!confirm("Delete this milestone record from database?")) return;
    try {
        const { error } = await supabaseClient.from("qualifications").delete().eq("id", id);
        if (error) throw error;
        showToast("Record Deleted", "purged from server database.", "check_circle");
        loadQualifications();
    } catch (e) {
        showToast("Error Deleting", e.message, "error");
    }
}

// ============================================================
// 5. PROJECTS CRUD (Includes ImgBB integration)
// ============================================================
async function loadProjects() {
    try {
        const { data, error } = await supabaseClient.from("projects").select("*").order("created_at", { ascending: false });
        if (error) throw error;

        const container = document.getElementById("projects-grid-container");
        container.innerHTML = data.map(item => `
            <div class="glass-panel rounded-2xl overflow-hidden border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all">
                <div class="p-6 space-y-4">
                    <div class="aspect-video w-full rounded-xl overflow-hidden border border-white/5 bg-background relative">
                        <img src="${item.image_url || 'https://example.com'}" alt="${item.title}" class="w-full h-full object-cover opacity-80">
                        ${!item.is_visible ? `<div class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs text-red-400 font-bold uppercase tracking-widest">Hidden / Invisible</div>` : ''}
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-lg font-bold truncate">${item.title}</h4>
                        <p class="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">${item.description}</p>
                    </div>
                    <div class="flex flex-wrap gap-1.5 pt-2">
                        ${(item.tags || []).map(tag => `<span class="px-2 py-0.5 bg-white/5 text-[10px] rounded">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="p-6 pt-0 border-t border-white/5 flex gap-3 mt-auto">
                    <button onclick="editProject('${item.id}', '${escapeHtml(item.title)}', '${escapeHtml(item.description)}', '${escapeHtml(item.image_url)}', '${escapeHtml((item.tags || []).join(', '))}', '${escapeHtml(item.github_url)}', '${escapeHtml(item.live_url)}', ${item.is_visible})" class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-xs rounded border border-white/10 text-primary font-semibold text-center">Edit</button>
                    <button onclick="deleteProject('${item.id}')" class="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-xs rounded border border-red-500/20 text-red-400 font-semibold text-center">Delete</button>
                </div>
            </div>
        `).join('') || `<p class="text-xs text-on-surface-variant italic col-span-2">No projects loaded. Add one to show on portfolio.</p>`;
    } catch (e) {
        showToast("Error Loading Projects", e.message, "error");
    }
}

function openProjectModal() {
    document.getElementById("project-id").value = "";
    document.getElementById("proj-title").value = "";
    document.getElementById("proj-description").value = "";
    document.getElementById("proj-image-url").value = "";
    document.getElementById("proj-image-file").value = "";
    document.getElementById("proj-tags").value = "";
    document.getElementById("proj-github").value = "";
    document.getElementById("proj-live").value = "";
    document.getElementById("proj-visible").checked = true;
    document.getElementById("project-modal-title").textContent = "Add Project Record";
    openModal("project-modal");
}

function editProject(id, title, description, imageUrl, tags, github, live, visible) {
    document.getElementById("project-id").value = id;
    document.getElementById("proj-title").value = title;
    document.getElementById("proj-description").value = description;
    document.getElementById("proj-image-url").value = imageUrl;
    document.getElementById("proj-image-file").value = "";
    document.getElementById("proj-tags").value = tags;
    document.getElementById("proj-github").value = github;
    document.getElementById("proj-live").value = live;
    document.getElementById("proj-visible").checked = visible;
    document.getElementById("project-modal-title").textContent = "Edit Project Record";
    openModal("project-modal");
}

const projectForm = document.getElementById("project-form");
if (projectForm) {
    projectForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = projectForm.querySelector("button[type='submit']");
        const originalBtnText = submitBtn.innerHTML;

        const id = document.getElementById("project-id").value;
        const title = document.getElementById("proj-title").value.trim();
        const description = document.getElementById("proj-description").value.trim();
        let image_url = document.getElementById("proj-image-url").value.trim();
        const tags = document.getElementById("proj-tags").value.split(',').map(t => t.trim()).filter(Boolean);
        const github_url = document.getElementById("proj-github").value.trim();
        const live_url = document.getElementById("proj-live").value.trim();
        const is_visible = document.getElementById("proj-visible").checked;

        // Image file upload
        const fileInput = document.getElementById("proj-image-file");
        if (fileInput.files.length > 0) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Uploading Image...</span><span class="material-symbols-outlined animate-spin text-sm">sync</span>`;
            
            const uploadedUrl = await uploadImageToImgBB(fileInput.files[0]);
            if (uploadedUrl) {
                image_url = uploadedUrl;
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return; // Stop on upload failure
            }
        }

        const payload = { title, description, image_url, tags, github_url, live_url, is_visible };

        try {
            let res;
            if (id) {
                res = await supabaseClient.from("projects").update(payload).eq("id", id);
            } else {
                res = await supabaseClient.from("projects").insert(payload);
            }
            if (res.error) throw res.error;
            showToast("Project Saved", "Database updated successfully.", "check_circle");
            closeModal("project-modal");
            loadProjects();
        } catch (err) {
            showToast("Error Saving Project", err.message, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

async function deleteProject(id) {
    if (!confirm("Purge this project entry from the database?")) return;
    try {
        const { error } = await supabaseClient.from("projects").delete().eq("id", id);
        if (error) throw error;
        showToast("Project Purged", "Record cleared from database.", "check_circle");
        loadProjects();
    } catch (e) {
        showToast("Error Deleting", e.message, "error");
    }
}

// ============================================================
// 6. RESEARCH PAPERS CRUD (Includes ImgBB integration)
// ============================================================
async function loadResearch() {
    try {
        const { data, error } = await supabaseClient.from("researches").select("*").order("created_at", { ascending: false });
        if (error) throw error;

        const container = document.getElementById("research-grid-container");
        container.innerHTML = data.map(item => `
            <div class="glass-panel rounded-2xl overflow-hidden border-white/5 flex flex-col justify-between hover:border-secondary/20 transition-all">
                <div class="p-6 space-y-4">
                    <div class="aspect-video w-full rounded-xl overflow-hidden border border-white/5 bg-background relative">
                        <img src="${item.image_url || 'https://example.com'}" alt="${item.title}" class="w-full h-full object-cover opacity-80">
                        ${!item.is_visible ? `<div class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs text-red-400 font-bold uppercase tracking-widest">Hidden / Invisible</div>` : ''}
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-lg font-bold truncate">${item.title}</h4>
                        <p class="text-xs text-secondary/80 font-medium">Authors: ${item.authors}</p>
                        <p class="text-xs text-on-surface-variant font-mono">Publisher: ${item.publisher} (${item.year})</p>
                    </div>
                </div>
                <div class="p-6 pt-0 border-t border-white/5 flex gap-3 mt-auto">
                    <button onclick="editResearch('${item.id}', '${escapeHtml(item.title)}', '${escapeHtml(item.authors)}', '${escapeHtml(item.publisher)}', '${escapeHtml(item.year)}', '${escapeHtml(item.image_url)}', '${escapeHtml(item.link)}', '${escapeHtml(item.pdf_url)}', ${item.is_visible})" class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-xs rounded border border-white/10 text-primary font-semibold text-center">Edit</button>
                    <button onclick="deleteResearch('${item.id}')" class="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-xs rounded border border-red-500/20 text-red-400 font-semibold text-center">Delete</button>
                </div>
            </div>
        `).join('') || `<p class="text-xs text-on-surface-variant italic col-span-2">No researches loaded. Add one to show on portfolio.</p>`;
    } catch (e) {
        showToast("Error Loading Research", e.message, "error");
    }
}

function openResearchModal() {
    document.getElementById("research-id").value = "";
    document.getElementById("res-title").value = "";
    document.getElementById("res-authors").value = "";
    document.getElementById("res-publisher").value = "";
    document.getElementById("res-year").value = "";
    document.getElementById("res-image-url").value = "";
    document.getElementById("res-image-file").value = "";
    document.getElementById("res-link").value = "";
    document.getElementById("res-pdf-url").value = "";
    document.getElementById("res-visible").checked = true;
    document.getElementById("research-modal-title").textContent = "Add Publication";
    openModal("research-modal");
}

function editResearch(id, title, authors, publisher, year, imageUrl, link, pdfUrl, visible) {
    document.getElementById("research-id").value = id;
    document.getElementById("res-title").value = title;
    document.getElementById("res-authors").value = authors;
    document.getElementById("res-publisher").value = publisher;
    document.getElementById("res-year").value = year;
    document.getElementById("res-image-url").value = imageUrl;
    document.getElementById("res-image-file").value = "";
    document.getElementById("res-link").value = link;
    document.getElementById("res-pdf-url").value = pdfUrl;
    document.getElementById("res-visible").checked = visible;
    document.getElementById("research-modal-title").textContent = "Edit Publication";
    openModal("research-modal");
}

const researchForm = document.getElementById("research-form");
if (researchForm) {
    researchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = researchForm.querySelector("button[type='submit']");
        const originalBtnText = submitBtn.innerHTML;

        const id = document.getElementById("research-id").value;
        const title = document.getElementById("res-title").value.trim();
        const authors = document.getElementById("res-authors").value.trim();
        const publisher = document.getElementById("res-publisher").value.trim();
        const year = document.getElementById("res-year").value.trim();
        let image_url = document.getElementById("res-image-url").value.trim();
        const link = document.getElementById("res-link").value.trim();
        const pdf_url = document.getElementById("res-pdf-url").value.trim();
        const is_visible = document.getElementById("res-visible").checked;

        // Image file upload
        const fileInput = document.getElementById("res-image-file");
        if (fileInput.files.length > 0) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Uploading Thumbnail...</span><span class="material-symbols-outlined animate-spin text-sm">sync</span>`;
            
            const uploadedUrl = await uploadImageToImgBB(fileInput.files[0]);
            if (uploadedUrl) {
                image_url = uploadedUrl;
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }
        }

        const payload = { title, authors, publisher, year, image_url, link, pdf_url, is_visible };

        try {
            let res;
            if (id) {
                res = await supabaseClient.from("researches").update(payload).eq("id", id);
            } else {
                res = await supabaseClient.from("researches").insert(payload);
            }
            if (res.error) throw res.error;
            showToast("Research Saved", "Publication details updated successfully.", "check_circle");
            closeModal("research-modal");
            loadResearch();
        } catch (err) {
            showToast("Error Saving Research", err.message, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

async function deleteResearch(id) {
    if (!confirm("Purge this research entry from the database?")) return;
    try {
        const { error } = await supabaseClient.from("researches").delete().eq("id", id);
        if (error) throw error;
        showToast("Research Purged", "Record cleared from database.", "check_circle");
        loadResearch();
    } catch (e) {
        showToast("Error Deleting", e.message, "error");
    }
}

// ============================================================
// IMAGE UPLOAD SYSTEM (ImgBB integration)
// ============================================================
async function uploadImageToImgBB(file) {
    if (!imgbbApiKey) {
        showToast("API Key Missing", "ImgBB API Key is required. Please set it in the API Credentials tab.", "error");
        return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            showToast("Upload Success", "Image hosted successfully on ImgBB.", "check_circle");
            return result.data.url;
        } else {
            showToast("Upload Failed", result.error.message || "Unknown ImgBB API error.", "error");
            return null;
        }
    } catch (err) {
        showToast("Upload Exception", "Network error uploading to ImgBB API.", "error");
        return null;
    }
}

// ============================================================
// CORE UI PROTOCOLS (Helper Functions)
// ============================================================
function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}

// Escapes dynamic variables safely for insertion into string templates
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Direct toast generation system
function showToast(title, message, iconName = "notifications") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "glass-panel p-4 rounded-xl flex items-start gap-3 border-primary-container/20 shadow-lg pointer-events-auto min-w-[280px] max-w-[350px] transition-all duration-300 transform translate-x-[120%] opacity-0";
    
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
            <span class="material-symbols-outlined text-lg">${iconName}</span>
        </div>
        <div class="flex-1 min-w-0">
            <div class="text-xs font-mono text-primary uppercase font-bold tracking-wider truncate">${title}</div>
            <div class="text-xs mt-1 leading-normal">${message}</div>
        </div>
        <button class="text-on-surface-variant hover:text-primary transition-colors focus:outline-none shrink-0 cursor-pointer" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
    `;

    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = "translateX(0)";
        toast.style.opacity = "1";
    }, 50);

    // Auto animate out
    setTimeout(() => {
        toast.style.transform = "translateX(120%)";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}
