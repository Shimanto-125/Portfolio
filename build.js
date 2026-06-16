const fs = require('fs');
const path = require('path');

let env = {};
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key) {
        env[key] = val;
      }
    }
  });
}

const SUPABASE_URL = process.env.SUPABASE_URL || env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '';
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || env.IMGBB_API_KEY || '';

const config = `// Generated file. Do not commit.
window.ENV = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_ANON_KEY: "${SUPABASE_ANON_KEY}",
  IMGBB_API_KEY: "${IMGBB_API_KEY}"
};`;

fs.writeFileSync(path.join(__dirname, 'config.js'), config);
console.log('config.js generated successfully.');
