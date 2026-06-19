'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { resolveImageUrl } from '@/lib/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

const inp = "w-full bg-[var(--color-surface-container)]/60 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[var(--color-primary-container)] focus:outline-none transition-all text-sm";
const labelCls = "block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5";

async function uploadToStorage(file: File, folder: string = 'uploads'): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  const ext = file.name.split('.').pop() || 'png';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}_${safeName}`;
  const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path);
  return data.publicUrl;
}

function ImageUploadField({ value, onChange, folder = 'tech-icons' }: { value: string; onChange: (url: string) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadToStorage(file, folder);
      onChange(url);
    } catch (err: AnyData) {
      setUploadError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className={labelCls}>Image / Logo</label>
      <div className="flex gap-2 items-start">
        <div className="flex-1 space-y-2">
          <input
            name="image_url"
            className={inp}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://example.com/logo.png or Google Drive link"
          />
          <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border border-dashed border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] transition-all text-xs text-[var(--color-on-surface-variant)] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="material-symbols-outlined text-sm">{uploading ? 'sync' : 'upload'}</span>
            <span>{uploading ? 'Uploading...' : 'Upload from device'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
          {uploadError && <p className="text-[10px] text-red-400">{uploadError}. Make sure &apos;portfolio-images&apos; bucket exists in Supabase Storage.</p>}
        </div>
        {value && (
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-[var(--glass-border)] flex items-center justify-center bg-[var(--color-surface-container)]/40 shrink-0">
            <img src={resolveImageUrl(value)} alt="preview" className="w-10 h-10 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
      </div>
    </div>
  );
}

function TechnologyModal({ editingItem, technologiesList, onSubmit, onCancel }: {
  editingItem: AnyData;
  technologiesList: AnyData[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<string>(editingItem?.type || 'icon');
  const [imageUrl, setImageUrl] = useState<string>(editingItem?.image_url || '');

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-glow text-[var(--color-primary)]">{editingItem ? 'Edit Technology' : 'Add Technology'}</h3>
      <input type="hidden" name="id" defaultValue={editingItem?.id || ''} />
      <input type="hidden" name="image_url" value={imageUrl} readOnly />
      <div><label className={labelCls}>Name</label><input name="name" required className={inp} defaultValue={editingItem?.name || ''} placeholder="Python" /></div>
      <div>
        <label className={labelCls}>Display Type</label>
        <select name="type" required className={inp} value={type} onChange={e => setType(e.target.value)}>
          <option value="icon">Icon (Material Symbol)</option>
          <option value="text">Text Label (e.g. JS, PY)</option>
          <option value="image">Image / Logo</option>
        </select>
      </div>

      {type === 'text' && (
        <div>
          <label className={labelCls}>Text Label</label>
          <input name="label" className={inp} defaultValue={editingItem?.label || ''} placeholder="PY" />
        </div>
      )}

      {type === 'icon' && (
        <div>
          <label className={labelCls}>Material Icon Name</label>
          <input name="icon" className={inp} defaultValue={editingItem?.icon || ''} placeholder="deployed_code" />
          <p className="mt-1 text-[10px] text-[var(--color-on-surface-variant)] font-mono opacity-60">Examples: deployed_code, javascript, database, storage, cloud, hub, palette, dock, account_tree</p>
        </div>
      )}

      {type === 'image' && (
        <ImageUploadField value={imageUrl} onChange={setImageUrl} />
      )}

      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Display Order</label><input name="display_order" type="number" min="0" className={inp} defaultValue={editingItem?.display_order ?? technologiesList.length} /></div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_visible" defaultChecked={editingItem?.is_visible ?? true} className="rounded border-[var(--glass-border)]" />
            <span className="text-xs text-[var(--color-on-surface-variant)]">Show on portfolio</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-xs cursor-pointer">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-lg text-xs cursor-pointer">Submit</button>
      </div>
    </form>
  );
}

type Tab = 'metadata' | 'siteinfo' | 'skills' | 'education' | 'qualifications' | 'projects' | 'research' | 'competitive' | 'technologies';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'metadata', label: 'Hero Settings', icon: 'settings' },
  { id: 'siteinfo', label: 'About & Contact', icon: 'manage_accounts' },
  { id: 'skills', label: 'Skill Metrics', icon: 'memory' },
  { id: 'education', label: 'Education', icon: 'school' },
  { id: 'qualifications', label: 'Qualifications', icon: 'workspace_premium' },
  { id: 'projects', label: 'Projects', icon: 'terminal' },
  { id: 'research', label: 'Research Papers', icon: 'biotech' },
  { id: 'competitive', label: 'CP Profiles', icon: 'emoji_events' },
  { id: 'technologies', label: 'Technologies', icon: 'hub' },
];

function escapeHtml(str: string) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('metadata');

  // Data states
  const [metaHeroRole, setMetaHeroRole] = useState('');
  const [metaHeroSubRole, setMetaHeroSubRole] = useState('');
  const [metaCvUrl, setMetaCvUrl] = useState('');
  const [metaAvailable, setMetaAvailable] = useState('true');

  const [metaHeroGreeting, setMetaHeroGreeting] = useState('');
  const [metaHeroDescription, setMetaHeroDescription] = useState('');
  const [metaHeroPrimaryBtn, setMetaHeroPrimaryBtn] = useState('');
  const [metaHeroSecondaryBtn, setMetaHeroSecondaryBtn] = useState('');
  const [metaHeroImageUrl, setMetaHeroImageUrl] = useState('');
  // Social links
  const [metaSocialGithub, setMetaSocialGithub] = useState('');
  const [metaSocialLinkedin, setMetaSocialLinkedin] = useState('');
  const [metaSocialEmail, setMetaSocialEmail] = useState('');
  // About section
  const [metaAboutImageUrl, setMetaAboutImageUrl] = useState('');
  const [metaAboutBio, setMetaAboutBio] = useState('');
  const [metaAboutExperience, setMetaAboutExperience] = useState('');
  const [metaAboutProjectsLabel, setMetaAboutProjectsLabel] = useState('');
  const [metaAboutTechDesc, setMetaAboutTechDesc] = useState('');
  // Contact section
  const [metaContactEmail, setMetaContactEmail] = useState('');
  const [metaContactLocation, setMetaContactLocation] = useState('');
  const [metaContactGithub, setMetaContactGithub] = useState('');
  const [metaContactLinkedin, setMetaContactLinkedin] = useState('');
  // Footer
  const [metaFooterTitle, setMetaFooterTitle] = useState('');
  const [metaFooterName, setMetaFooterName] = useState('');

  const [skillsList, setSkillsList] = useState<AnyData[]>([]);
  const [educationList, setEducationList] = useState<AnyData[]>([]);
  const [qualificationsList, setQualificationsList] = useState<AnyData[]>([]);
  const [projectsList, setProjectsList] = useState<AnyData[]>([]);
  const [researchList, setResearchList] = useState<AnyData[]>([]);
  const [competitiveList, setCompetitiveList] = useState<AnyData[]>([]);
  const [technologiesList, setTechnologiesList] = useState<AnyData[]>([]);

  // Modal states
  const [modal, setModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<AnyData>(null);

  // Check session
  useEffect(() => {
    async function check() {
      if (!supabase) { setChecking(false); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { setLoggedIn(true); }
      setChecking(false);
    }
    check();
  }, []);

  // Load data when logged in
  const loadAll = useCallback(async () => {
    if (!supabase) return;
    // Metadata
    const { data: md } = await supabase.from('site_metadata').select('*');
    if (md) {
      const map: Record<string, string> = {};
      md.forEach((i: AnyData) => { map[i.key] = i.value; });
      setMetaHeroRole(map.hero_role || '');
      setMetaHeroSubRole(map.hero_sub_role || '');
      setMetaCvUrl(map.cv_url || '');
      setMetaAvailable(map.is_available || 'true');
      setMetaHeroGreeting(map.hero_greeting || '');
      setMetaHeroDescription(map.hero_description || '');
      setMetaHeroPrimaryBtn(map.hero_primary_btn || '');
      setMetaHeroSecondaryBtn(map.hero_secondary_btn || '');
      setMetaHeroImageUrl(map.hero_image_url || '');
      setMetaSocialGithub(map.social_github || '');
      setMetaSocialLinkedin(map.social_linkedin || '');
      setMetaSocialEmail(map.social_email || '');
      setMetaAboutImageUrl(map.about_image_url || '');
      setMetaAboutBio(map.about_bio || '');
      setMetaAboutExperience(map.about_experience || '');
      setMetaAboutProjectsLabel(map.about_projects_label || '');
      setMetaAboutTechDesc(map.about_tech_desc || '');
      setMetaContactEmail(map.contact_email || '');
      setMetaContactLocation(map.contact_location || '');
      setMetaContactGithub(map.contact_github || '');
      setMetaContactLinkedin(map.contact_linkedin || '');
      setMetaFooterTitle(map.footer_title || '');
      setMetaFooterName(map.footer_name || '');
    }
    // Skills
    const { data: sk } = await supabase.from('skills').select('*').order('category');
    if (sk) setSkillsList(sk);
    // Education
    const { data: ed } = await supabase.from('education').select('*').order('created_at', { ascending: true });
    if (ed) setEducationList(ed);
    // Qualifications
    const { data: ql } = await supabase.from('qualifications').select('*').order('created_at', { ascending: true });
    if (ql) setQualificationsList(ql);
    // Projects
    const { data: pj } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (pj) setProjectsList(pj);
    // Research
    const { data: rs } = await supabase.from('researches').select('*').order('created_at', { ascending: false });
    if (rs) setResearchList(rs);
    // Competitive Profiles
    const { data: cp } = await supabase.from('competitive_profiles').select('*').order('display_order');
    if (cp) setCompetitiveList(cp);
    // Technologies
    const { data: tc } = await supabase.from('technologies').select('*').order('display_order');
    if (tc) setTechnologiesList(tc);
  }, []);

  useEffect(() => { if (loggedIn) loadAll(); }, [loggedIn, loadAll]);

  // Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return alert('Supabase not configured');
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); setLoginLoading(false); return; }
    setLoggedIn(true);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setLoggedIn(false);
  };

  // CRUD helpers
  const saveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const payload = [
      { key: 'hero_role', value: metaHeroRole },
      { key: 'hero_sub_role', value: metaHeroSubRole },
      { key: 'cv_url', value: metaCvUrl },
      { key: 'is_available', value: metaAvailable },
      { key: 'hero_greeting', value: metaHeroGreeting },
      { key: 'hero_description', value: metaHeroDescription },
      { key: 'hero_primary_btn', value: metaHeroPrimaryBtn },
      { key: 'hero_secondary_btn', value: metaHeroSecondaryBtn },
      { key: 'hero_image_url', value: metaHeroImageUrl },
    ];
    const { error } = await supabase.from('site_metadata').upsert(payload, { onConflict: 'key' });
    alert(error ? error.message : 'Settings saved!');
  };

  const deleteItem = async (table: string, id: string) => {
    if (!supabase || !confirm('Delete this record?')) return;
    await supabase.from(table).delete().eq('id', id);
    loadAll();
  };

  const saveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      name: fd.get('name') as string,
      percentage: parseInt(fd.get('percentage') as string),
      category: fd.get('category') as string,
      neural_depth: fd.get('neural_depth') as string || 'L8',
      latency: fd.get('latency') as string || '0.5ms',
    };
    const id = fd.get('id') as string;
    if (id) { await supabase.from('skills').update(payload).eq('id', id); }
    else { await supabase.from('skills').insert(payload); }
    setModal(null);
    loadAll();
  };

  const saveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      institution: fd.get('institution') as string,
      degree: fd.get('degree') as string,
      department: fd.get('department') as string,
      grade: fd.get('grade') as string,
      duration: fd.get('duration') as string,
      description: fd.get('description') as string,
    };
    const id = fd.get('id') as string;
    if (id) { await supabase.from('education').update(payload).eq('id', id); }
    else { await supabase.from('education').insert(payload); }
    setModal(null);
    loadAll();
  };

  const saveQualification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      title: fd.get('title') as string,
      subtitle: fd.get('subtitle') as string,
      type: fd.get('type') as string,
      duration: fd.get('duration') as string,
    };
    const id = fd.get('id') as string;
    if (id) { await supabase.from('qualifications').update(payload).eq('id', id); }
    else { await supabase.from('qualifications').insert(payload); }
    setModal(null);
    loadAll();
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      image_url: fd.get('image_url') as string,
      tags: (fd.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      github_url: fd.get('github_url') as string,
      live_url: fd.get('live_url') as string,
      is_visible: (form.querySelector('input[name=is_visible]') as HTMLInputElement)?.checked ?? true,
    };
    const id = fd.get('id') as string;
    if (id) { await supabase.from('projects').update(payload).eq('id', id); }
    else { await supabase.from('projects').insert(payload); }
    setModal(null);
    loadAll();
  };

  const saveResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      title: fd.get('title') as string,
      authors: fd.get('authors') as string,
      publisher: fd.get('publisher') as string,
      year: fd.get('year') as string,
      image_url: fd.get('image_url') as string,
      link: fd.get('link') as string,
      pdf_url: fd.get('pdf_url') as string,
      is_visible: (form.querySelector('input[name=is_visible]') as HTMLInputElement)?.checked ?? true,
    };
    const id = fd.get('id') as string;
    if (id) { await supabase.from('researches').update(payload).eq('id', id); }
    else { await supabase.from('researches').insert(payload); }
    setModal(null);
    loadAll();
  };

  const saveSiteInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const payload = [
      { key: 'social_github', value: metaSocialGithub },
      { key: 'social_linkedin', value: metaSocialLinkedin },
      { key: 'social_email', value: metaSocialEmail },
      { key: 'about_image_url', value: metaAboutImageUrl },
      { key: 'about_bio', value: metaAboutBio },
      { key: 'about_experience', value: metaAboutExperience },
      { key: 'about_projects_label', value: metaAboutProjectsLabel },
      { key: 'about_tech_desc', value: metaAboutTechDesc },
      { key: 'contact_email', value: metaContactEmail },
      { key: 'contact_location', value: metaContactLocation },
      { key: 'contact_github', value: metaContactGithub },
      { key: 'contact_linkedin', value: metaContactLinkedin },
      { key: 'footer_title', value: metaFooterTitle },
      { key: 'footer_name', value: metaFooterName },
    ];
    const { error } = await supabase.from('site_metadata').upsert(payload, { onConflict: 'key' });
    alert(error ? error.message : 'Site info saved!');
  };

  const saveCompetitive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      platform: fd.get('platform') as string,
      username: fd.get('username') as string,
      profile_url: fd.get('profile_url') as string,
      problems_solved: parseInt(fd.get('problems_solved') as string) || 0,
      rank: fd.get('rank') as string,
      rating: parseInt(fd.get('rating') as string) || 0,
      display_order: parseInt(fd.get('display_order') as string) || 0,
      is_visible: (form.querySelector('input[name=is_visible]') as HTMLInputElement)?.checked ?? true,
    };
    const id = fd.get('id') as string;
    if (id) { await supabase.from('competitive_profiles').update(payload).eq('id', id); }
    else { await supabase.from('competitive_profiles').insert(payload); }
    setModal(null);
    loadAll();
  };

  const saveTechnology = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const type = fd.get('type') as string;
    const payload = {
      name: fd.get('name') as string,
      type,
      label: type === 'text' ? fd.get('label') as string : null,
      icon: type === 'icon' ? fd.get('icon') as string : null,
      image_url: type === 'image' ? fd.get('image_url') as string : null,
      display_order: parseInt(fd.get('display_order') as string) || 0,
      is_visible: (form.querySelector('input[name=is_visible]') as HTMLInputElement)?.checked ?? true,
    };
    const id = fd.get('id') as string;
    if (id) { await supabase.from('technologies').update(payload).eq('id', id); }
    else { await supabase.from('technologies').insert(payload); }
    setModal(null);
    loadAll();
  };


  if (checking) return <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dim)]"><span className="material-symbols-outlined text-4xl animate-spin text-[var(--color-primary)]">sync</span></div>;

  // LOGIN
  if (!loggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-background)] p-6">
        <div className="glass-panel w-full max-w-md p-8 rounded-3xl space-y-6 shadow-2xl relative border-[var(--color-primary)]/20">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--color-primary)]/10 blur-[50px] rounded-full" />
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 items-center justify-center text-[var(--color-primary)] mb-2">
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-glow">Neural Admin Login</h1>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Authorize core system configuration</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={labelCls}>Security ID (Email)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inp} />
            </div>
            <div>
              <label className={labelCls}>Access Key (Password)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inp} />
            </div>
            <button type="submit" disabled={loginLoading} className="w-full py-3.5 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50">
              <span>{loginLoading ? 'Verifying...' : 'Initiate Authentication'}</span>
              <span className={`material-symbols-outlined text-base ${loginLoading ? 'animate-spin' : ''}`}>{loginLoading ? 'sync' : 'login'}</span>
            </button>
          </form>
          <div className="text-center border-t border-[var(--glass-border)] pt-4">
            <a href="/" className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Return to Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-[var(--color-surface-dim)] text-[var(--color-on-surface)]">
      {/* Header */}
      <header className="border-b border-[var(--glass-border)] bg-[var(--color-background)]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-primary-container)] rounded-lg flex items-center justify-center text-[var(--color-on-primary)] font-bold text-sm">AS</div>
            <div>
              <h2 className="font-bold text-sm leading-none text-glow text-[var(--color-primary)]">Md. Abir Shimanto</h2>
              <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">System Terminal v3.0</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="px-4 py-1.5 glass-panel rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[var(--color-on-surface)]/5 transition-all">
              <span className="material-symbols-outlined text-base">open_in_new</span> Live Portfolio
            </a>
            <button onClick={handleLogout} className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-red-500/20 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-base">logout</span> Terminate
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1 sticky top-24">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === t.id ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-on-surface)]/5'}`}>
                <span className="material-symbols-outlined">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-6">
          {/* METADATA TAB */}
          {activeTab === 'metadata' && (
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">General Configuration</h3>
              <form onSubmit={saveMetadata} className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Hero Role Title</label><input className={inp} value={metaHeroRole} onChange={e => setMetaHeroRole(e.target.value)} /></div>
                  <div>
                    <label className={labelCls}>Hero Sub-role Title</label>
                    <input className={inp} value={metaHeroSubRole} onChange={e => setMetaHeroSubRole(e.target.value)} placeholder="ML Engineer,Competitive Programmer" />
                    <p className="mt-1 text-[10px] text-[var(--color-on-surface-variant)] font-mono opacity-60">Comma দিয়ে আলাদা করলে typing loop-এ cycle করবে — e.g. ML Engineer,Competitive Programmer,Full Stack Dev</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div><label className={labelCls}>Hero Greeting (HTML allowed)</label><textarea className={inp} rows={2} value={metaHeroGreeting} onChange={e => setMetaHeroGreeting(e.target.value)} placeholder="Hey, I'm <br /> <span class='text-[var(--color-primary-container)]'>Md. Abir Shimanto 👋</span>" /></div>
                  <div><label className={labelCls}>Hero Description (HTML allowed)</label><textarea className={inp} rows={2} value={metaHeroDescription} onChange={e => setMetaHeroDescription(e.target.value)} placeholder="🚀 Empowering future innovators..." /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Primary Button Text</label><input className={inp} value={metaHeroPrimaryBtn} onChange={e => setMetaHeroPrimaryBtn(e.target.value)} placeholder="Say Hello" /></div>
                  <div><label className={labelCls}>Secondary Button Text</label><input className={inp} value={metaHeroSecondaryBtn} onChange={e => setMetaHeroSecondaryBtn(e.target.value)} placeholder="Download CV" /></div>
                </div>
                <ImageUploadField value={metaHeroImageUrl} onChange={setMetaHeroImageUrl} folder="hero" />
                <div><label className={labelCls}>CV Download URL</label><input className={inp} value={metaCvUrl} onChange={e => setMetaCvUrl(e.target.value)} /></div>
                <div><label className={labelCls}>Status</label>
                  <select className={inp} value={metaAvailable} onChange={e => setMetaAvailable(e.target.value)}>
                    <option value="true">Available</option><option value="false">Unavailable</option>
                  </select>
                </div>
                <button type="submit" className="px-6 py-2.5 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">Save Configuration</button>
              </form>
            </section>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">Skill Proficiency Matrix</h3>
                <button onClick={() => { setEditingItem(null); setModal('skill'); }} className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">add</span> Add Skill
                </button>
              </div>
              <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b border-[var(--glass-border)] bg-[var(--color-on-surface)]/5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    <th className="px-6 py-4">Name</th><th className="px-6 py-4">%</th><th className="px-6 py-4">Category</th><th className="px-6 py-4 text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[var(--glass-border)]">
                    {skillsList.map(s => (
                      <tr key={s.id}>
                        <td className="px-6 py-4 font-bold">{s.name}</td>
                        <td className="px-6 py-4">{s.percentage}%</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-[var(--color-on-surface)]/5 border border-[var(--glass-border)] rounded text-xs">{s.category}</span></td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => { setEditingItem(s); setModal('skill'); }} className="text-[var(--color-primary)] hover:underline text-xs cursor-pointer">Edit</button>
                          <button onClick={() => deleteItem('skills', s.id)} className="text-red-400 hover:underline text-xs cursor-pointer">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">Academic Records</h3>
                <button onClick={() => { setEditingItem(null); setModal('education'); }} className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">add</span> Add Record
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {educationList.map(item => (
                  <div key={item.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded uppercase font-bold">{item.grade || 'GRADUATE'}</span>
                      <h4 className="text-lg font-bold">{item.degree}</h4>
                      <p className="text-sm font-semibold text-[var(--color-primary-container)]">{item.institution} ({item.duration})</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(item); setModal('education'); }} className="px-3 py-1 bg-[var(--color-on-surface)]/5 text-xs rounded border border-[var(--glass-border)] text-[var(--color-primary)] cursor-pointer">Edit</button>
                      <button onClick={() => deleteItem('education', item.id)} className="px-3 py-1 bg-red-500/10 text-xs rounded border border-red-500/20 text-red-400 cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* QUALIFICATIONS TAB */}
          {activeTab === 'qualifications' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">Milestones & Credentials</h3>
                <button onClick={() => { setEditingItem(null); setModal('qualification'); }} className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">add</span> Add Milestone
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {qualificationsList.map(item => (
                  <div key={item.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded uppercase font-bold">{item.type}</span>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">{item.subtitle} ({item.duration})</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(item); setModal('qualification'); }} className="px-3 py-1 bg-[var(--color-on-surface)]/5 text-xs rounded border border-[var(--glass-border)] text-[var(--color-primary)] cursor-pointer">Edit</button>
                      <button onClick={() => deleteItem('qualifications', item.id)} className="px-3 py-1 bg-red-500/10 text-xs rounded border border-red-500/20 text-red-400 cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">Portfolio Projects</h3>
                <button onClick={() => { setEditingItem(null); setModal('project'); }} className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">add</span> Add Project
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsList.map(item => (
                  <div key={item.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 space-y-3 flex-1">
                      <h4 className="text-lg font-bold truncate">{item.title}</h4>
                      <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-2">{item.description}</p>
                      {!item.is_visible && <span className="text-[10px] text-red-400 font-bold uppercase">Hidden</span>}
                    </div>
                    <div className="p-6 pt-0 flex gap-3">
                      <button onClick={() => { setEditingItem(item); setModal('project'); }} className="flex-1 py-1.5 bg-[var(--color-on-surface)]/5 text-xs rounded border border-[var(--glass-border)] text-[var(--color-primary)] font-semibold text-center cursor-pointer">Edit</button>
                      <button onClick={() => deleteItem('projects', item.id)} className="px-4 py-1.5 bg-red-500/10 text-xs rounded border border-red-500/20 text-red-400 cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SITE INFO TAB */}
          {activeTab === 'siteinfo' && (
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">About & Contact Configuration</h3>
              <form onSubmit={saveSiteInfo} className="space-y-8">

                {/* Social Links (Hero sidebar) */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">share</span> Social Links (Hero Sidebar)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className={labelCls}>GitHub URL</label><input className={inp} value={metaSocialGithub} onChange={e => setMetaSocialGithub(e.target.value)} placeholder="https://github.com/..." /></div>
                    <div><label className={labelCls}>LinkedIn URL</label><input className={inp} value={metaSocialLinkedin} onChange={e => setMetaSocialLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                    <div><label className={labelCls}>Email</label><input className={inp} value={metaSocialEmail} onChange={e => setMetaSocialEmail(e.target.value)} placeholder="you@example.com" /></div>
                  </div>
                </div>

                {/* About Section */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">person</span> About Section
                  </h4>
                  <div>
                    <label className={labelCls}>About Image URL (Google Drive share link or direct GIF/image URL)</label>
                    <input className={inp} value={metaAboutImageUrl} onChange={e => setMetaAboutImageUrl(e.target.value)} placeholder="https://drive.google.com/file/d/... or https://example.com/image.gif" />
                    {metaAboutImageUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden w-24 h-24 border border-[var(--glass-border)]">
                        <img src={resolveImageUrl(metaAboutImageUrl)} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                  <div><label className={labelCls}>Bio Text</label><textarea className={inp} rows={4} value={metaAboutBio} onChange={e => setMetaAboutBio(e.target.value)} placeholder="I am a..." /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Experience Text</label><input className={inp} value={metaAboutExperience} onChange={e => setMetaAboutExperience(e.target.value)} placeholder="3+ Years Professional..." /></div>
                    <div><label className={labelCls}>Projects Label (badge)</label><input className={inp} value={metaAboutProjectsLabel} onChange={e => setMetaAboutProjectsLabel(e.target.value)} placeholder="150+ Nodes" /></div>
                  </div>
                  <div><label className={labelCls}>Tech Stack Description</label><input className={inp} value={metaAboutTechDesc} onChange={e => setMetaAboutTechDesc(e.target.value)} placeholder="Core Engine: TensorFlow, PyTorch..." /></div>
                </div>

                {/* Contact Section */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-[var(--color-tertiary)] uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">contact_mail</span> Contact Section
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Email</label><input className={inp} value={metaContactEmail} onChange={e => setMetaContactEmail(e.target.value)} placeholder="you@example.com" /></div>
                    <div><label className={labelCls}>Location</label><input className={inp} value={metaContactLocation} onChange={e => setMetaContactLocation(e.target.value)} placeholder="Dhaka, BD" /></div>
                    <div><label className={labelCls}>GitHub URL</label><input className={inp} value={metaContactGithub} onChange={e => setMetaContactGithub(e.target.value)} placeholder="https://github.com/..." /></div>
                    <div><label className={labelCls}>LinkedIn URL</label><input className={inp} value={metaContactLinkedin} onChange={e => setMetaContactLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">bottom_navigation</span> Footer
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Footer Title (e.g. ML Trainer)</label><input className={inp} value={metaFooterTitle} onChange={e => setMetaFooterTitle(e.target.value)} placeholder="ML Trainer" /></div>
                    <div><label className={labelCls}>Footer Name (e.g. Abir Shimanto)</label><input className={inp} value={metaFooterName} onChange={e => setMetaFooterName(e.target.value)} placeholder="Abir Shimanto" /></div>
                  </div>
                </div>

                <button type="submit" className="px-6 py-2.5 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">Save All Site Info</button>
              </form>
            </section>
          )}

          {/* COMPETITIVE TAB */}
          {activeTab === 'competitive' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">Competitive Programming Profiles</h3>
                <button onClick={() => { setEditingItem(null); setModal('competitive'); }} className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">add</span> Add Profile
                </button>
              </div>
              <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b border-[var(--glass-border)] bg-[var(--color-on-surface)]/5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    <th className="px-6 py-4">Platform</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Solved</th>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Visible</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[var(--glass-border)]">
                    {competitiveList.map(s => (
                      <tr key={s.id}>
                        <td className="px-6 py-4 font-bold capitalize">{s.platform}</td>
                        <td className="px-6 py-4 font-mono text-xs">{s.username}</td>
                        <td className="px-6 py-4">{s.problems_solved}</td>
                        <td className="px-6 py-4">{s.rank || '—'}</td>
                        <td className="px-6 py-4">{s.rating || '—'}</td>
                        <td className="px-6 py-4">{s.display_order}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${s.is_visible ? 'text-green-400' : 'text-red-400'}`}>
                            {s.is_visible ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => { setEditingItem(s); setModal('competitive'); }} className="text-[var(--color-primary)] hover:underline text-xs cursor-pointer">Edit</button>
                          <button onClick={() => deleteItem('competitive_profiles', s.id)} className="text-red-400 hover:underline text-xs cursor-pointer">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TECHNOLOGIES TAB */}
          {activeTab === 'technologies' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">Tech Stack</h3>
                <button onClick={() => { setEditingItem(null); setModal('technology'); }} className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">add</span> Add Technology
                </button>
              </div>
              <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b border-[var(--glass-border)] bg-[var(--color-on-surface)]/5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Label / Icon</th>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Visible</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[var(--glass-border)]">
                    {technologiesList.map(t => (
                      <tr key={t.id}>
                        <td className="px-6 py-4 font-bold">{t.name}</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-[var(--color-on-surface)]/5 border border-[var(--glass-border)] rounded text-xs">{t.type}</span></td>
                        <td className="px-6 py-4 font-mono text-xs">{t.type === 'text' ? t.label : t.icon}</td>
                        <td className="px-6 py-4">{t.display_order}</td>
                        <td className="px-6 py-4"><span className={`text-xs font-bold ${t.is_visible ? 'text-green-400' : 'text-red-400'}`}>{t.is_visible ? 'Yes' : 'No'}</span></td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => { setEditingItem(t); setModal('technology'); }} className="text-[var(--color-primary)] hover:underline text-xs cursor-pointer">Edit</button>
                          <button onClick={() => deleteItem('technologies', t.id)} className="text-red-400 hover:underline text-xs cursor-pointer">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* RESEARCH TAB */}
          {activeTab === 'research' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-glow text-[var(--color-primary)]">Research & Publications</h3>
                <button onClick={() => { setEditingItem(null); setModal('research'); }} className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] text-xs font-bold rounded-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">add</span> Add Publication
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {researchList.map(item => (
                  <div key={item.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 space-y-3 flex-1">
                      <h4 className="text-lg font-bold truncate">{item.title}</h4>
                      <p className="text-xs text-[var(--color-secondary)]/80">Authors: {item.authors}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] font-mono">{item.publisher} ({item.year})</p>
                      {!item.is_visible && <span className="text-[10px] text-red-400 font-bold uppercase">Hidden</span>}
                    </div>
                    <div className="p-6 pt-0 flex gap-3">
                      <button onClick={() => { setEditingItem(item); setModal('research'); }} className="flex-1 py-1.5 bg-[var(--color-on-surface)]/5 text-xs rounded border border-[var(--glass-border)] text-[var(--color-primary)] font-semibold text-center cursor-pointer">Edit</button>
                      <button onClick={() => deleteItem('researches', item.id)} className="px-4 py-1.5 bg-red-500/10 text-xs rounded border border-red-500/20 text-red-400 cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ═══════ MODALS ═══════ */}
      {modal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal(null)}>
          <div className="glass-panel w-full max-w-xl p-6 rounded-3xl space-y-4 relative border-[var(--color-primary)]/20 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* SKILL MODAL */}
            {modal === 'skill' && (
              <form onSubmit={saveSkill} className="space-y-4">
                <h3 className="text-lg font-bold text-glow text-[var(--color-primary)]">{editingItem ? 'Edit Skill' : 'Add Skill'}</h3>
                <input type="hidden" name="id" defaultValue={editingItem?.id || ''} />
                <div><label className={labelCls}>Skill Name</label><input name="name" required className={inp} defaultValue={editingItem?.name || ''} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Percentage</label><input name="percentage" type="number" min="0" max="100" required className={inp} defaultValue={editingItem?.percentage || 80} /></div>
                  <div><label className={labelCls}>Category</label><input name="category" required className={inp} defaultValue={editingItem?.category || ''} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Neural Depth</label><input name="neural_depth" className={inp} defaultValue={editingItem?.neural_depth || 'L8'} /></div>
                  <div><label className={labelCls}>Latency</label><input name="latency" className={inp} defaultValue={editingItem?.latency || '0.5ms'} /></div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-xs cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-lg text-xs cursor-pointer">Submit</button>
                </div>
              </form>
            )}

            {/* EDUCATION MODAL */}
            {modal === 'education' && (
              <form onSubmit={saveEducation} className="space-y-4">
                <h3 className="text-lg font-bold text-glow text-[var(--color-primary)]">{editingItem ? 'Edit Education' : 'Add Education'}</h3>
                <input type="hidden" name="id" defaultValue={editingItem?.id || ''} />
                <div><label className={labelCls}>Institution</label><input name="institution" required className={inp} defaultValue={editingItem?.institution || ''} /></div>
                <div><label className={labelCls}>Degree</label><input name="degree" required className={inp} defaultValue={editingItem?.degree || ''} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2"><label className={labelCls}>Department</label><input name="department" className={inp} defaultValue={editingItem?.department || ''} /></div>
                  <div><label className={labelCls}>Grade</label><input name="grade" className={inp} defaultValue={editingItem?.grade || ''} /></div>
                </div>
                <div><label className={labelCls}>Duration</label><input name="duration" required className={inp} defaultValue={editingItem?.duration || ''} /></div>
                <div><label className={labelCls}>Description</label><textarea name="description" rows={3} className={inp} defaultValue={editingItem?.description || ''} /></div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-xs cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-lg text-xs cursor-pointer">Submit</button>
                </div>
              </form>
            )}

            {/* QUALIFICATION MODAL */}
            {modal === 'qualification' && (
              <form onSubmit={saveQualification} className="space-y-4">
                <h3 className="text-lg font-bold text-glow text-[var(--color-primary)]">{editingItem ? 'Edit Qualification' : 'Add Qualification'}</h3>
                <input type="hidden" name="id" defaultValue={editingItem?.id || ''} />
                <div><label className={labelCls}>Title</label><input name="title" required className={inp} defaultValue={editingItem?.title || ''} /></div>
                <div><label className={labelCls}>Subtitle</label><input name="subtitle" required className={inp} defaultValue={editingItem?.subtitle || ''} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Type</label>
                    <select name="type" required className={inp} defaultValue={editingItem?.type || 'Degree'}>
                      <option>Degree</option><option>Certification</option><option>Milestone</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Duration</label><input name="duration" required className={inp} defaultValue={editingItem?.duration || ''} /></div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-xs cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-lg text-xs cursor-pointer">Submit</button>
                </div>
              </form>
            )}

            {/* PROJECT MODAL */}
            {modal === 'project' && (
              <form onSubmit={saveProject} className="space-y-4">
                <h3 className="text-lg font-bold text-glow text-[var(--color-primary)]">{editingItem ? 'Edit Project' : 'Add Project'}</h3>
                <input type="hidden" name="id" defaultValue={editingItem?.id || ''} />
                <div><label className={labelCls}>Title</label><input name="title" required className={inp} defaultValue={editingItem?.title || ''} /></div>
                <div><label className={labelCls}>Description</label><textarea name="description" required rows={3} className={inp} defaultValue={editingItem?.description || ''} /></div>
                <div>
                  <label className={labelCls}>Image URL (Google Drive link, GIF, or any direct image URL)</label>
                  <input name="image_url" className={inp} defaultValue={editingItem?.image_url || ''} placeholder="https://drive.google.com/file/d/... or https://example.com/image.gif" />
                </div>
                <div><label className={labelCls}>Tags (comma-separated)</label><input name="tags" className={inp} defaultValue={editingItem?.tags?.join(', ') || ''} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>GitHub URL</label><input name="github_url" className={inp} defaultValue={editingItem?.github_url || ''} /></div>
                  <div><label className={labelCls}>Live URL</label><input name="live_url" className={inp} defaultValue={editingItem?.live_url || ''} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="is_visible" defaultChecked={editingItem?.is_visible ?? true} className="rounded border-[var(--glass-border)] text-[var(--color-primary-container)]" />
                  <label className="text-xs text-[var(--color-on-surface-variant)]">Publish live</label>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-xs cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-lg text-xs cursor-pointer">Submit</button>
                </div>
              </form>
            )}

            {/* COMPETITIVE MODAL */}
            {modal === 'competitive' && (
              <form onSubmit={saveCompetitive} className="space-y-4">
                <h3 className="text-lg font-bold text-glow text-[var(--color-primary)]">{editingItem ? 'Edit CP Profile' : 'Add CP Profile'}</h3>
                <input type="hidden" name="id" defaultValue={editingItem?.id || ''} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Platform</label>
                    <select name="platform" required className={inp} defaultValue={editingItem?.platform || 'codeforces'}>
                      <option value="codeforces">Codeforces</option>
                      <option value="leetcode">LeetCode</option>
                      <option value="codechef">CodeChef</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Username</label><input name="username" required className={inp} defaultValue={editingItem?.username || ''} /></div>
                </div>
                <div><label className={labelCls}>Profile URL</label><input name="profile_url" required className={inp} defaultValue={editingItem?.profile_url || ''} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelCls}>Problems Solved</label><input name="problems_solved" type="number" min="0" className={inp} defaultValue={editingItem?.problems_solved || 0} /></div>
                  <div><label className={labelCls}>Rank / Stars</label><input name="rank" className={inp} defaultValue={editingItem?.rank || ''} placeholder="e.g. Pupil, 3★" /></div>
                  <div><label className={labelCls}>Rating</label><input name="rating" type="number" min="0" className={inp} defaultValue={editingItem?.rating || 0} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Display Order (0=top-right, 1=left, 2=bottom-right)</label><input name="display_order" type="number" min="0" max="2" className={inp} defaultValue={editingItem?.display_order ?? 0} /></div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="is_visible" defaultChecked={editingItem?.is_visible ?? true} className="rounded border-[var(--glass-border)]" />
                      <span className="text-xs text-[var(--color-on-surface-variant)]">Show on portfolio</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-xs cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-lg text-xs cursor-pointer">Submit</button>
                </div>
              </form>
            )}

            {/* TECHNOLOGY MODAL */}
            {modal === 'technology' && (
              <TechnologyModal
                editingItem={editingItem}
                technologiesList={technologiesList}
                onSubmit={saveTechnology}
                onCancel={() => setModal(null)}
              />
            )}

            {/* RESEARCH MODAL */}
            {modal === 'research' && (
              <form onSubmit={saveResearch} className="space-y-4">
                <h3 className="text-lg font-bold text-glow text-[var(--color-primary)]">{editingItem ? 'Edit Publication' : 'Add Publication'}</h3>
                <input type="hidden" name="id" defaultValue={editingItem?.id || ''} />
                <div><label className={labelCls}>Paper Title</label><input name="title" required className={inp} defaultValue={editingItem?.title || ''} /></div>
                <div><label className={labelCls}>Authors</label><input name="authors" required className={inp} defaultValue={editingItem?.authors || ''} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Publisher</label><input name="publisher" className={inp} defaultValue={editingItem?.publisher || ''} /></div>
                  <div><label className={labelCls}>Year</label><input name="year" className={inp} defaultValue={editingItem?.year || ''} /></div>
                </div>
                <div>
                  <label className={labelCls}>Thumbnail URL (Google Drive link, GIF, or any direct image URL)</label>
                  <input name="image_url" className={inp} defaultValue={editingItem?.image_url || ''} placeholder="https://drive.google.com/file/d/... or https://example.com/image.gif" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>External Link</label><input name="link" className={inp} defaultValue={editingItem?.link || ''} /></div>
                  <div><label className={labelCls}>PDF URL</label><input name="pdf_url" className={inp} defaultValue={editingItem?.pdf_url || ''} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="is_visible" defaultChecked={editingItem?.is_visible ?? true} className="rounded border-[var(--glass-border)] text-[var(--color-primary-container)]" />
                  <label className="text-xs text-[var(--color-on-surface-variant)]">Publish live</label>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-xs cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-lg text-xs cursor-pointer">Submit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
