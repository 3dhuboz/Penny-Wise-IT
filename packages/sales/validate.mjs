// Pre-deploy guard: parse every <script> block in SALES.html / APPLY.html / WINS.html
// to catch syntax errors before they take down sign-in (lesson learned).
import fs from 'fs';

const FILES = [
  'SALES.html',
  'APPLY.html',
  'WINS.html',
  'HELP.html',
  'PRIVACY.html',
  'TERMS.html',
  'ADMIN.html',
  'ADMIN_APPS.html',
  'ADMIN_LEADS.html',
  'ADMIN_TEAM.html',
  'ADMIN_SUPPORT.html',
];
let failed = false;

for (const file of FILES) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const blocks = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
  for (let i = 0; i < blocks.length; i++) {
    const code = blocks[i].replace(/<\/?script>/g, '');
    try {
      new Function(code);
    } catch (e) {
      console.error(`\u274C ${file} script block ${i + 1}: ${e.message}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('\u2705 All inline JS validates cleanly');
