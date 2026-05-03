// Replace literal \uXXXX sequences in HTML (outside <script> blocks) with actual unicode chars.
// Inside <script> blocks they're valid JS escapes — leave them alone.
import fs from 'fs';

const FILES = ['SALES.html', 'APPLY.html', 'WINS.html', 'HELP.html', 'PRIVACY.html', 'TERMS.html'];

function unescapeText(text) {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

let totalFixed = 0;
for (const file of FILES) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  // Split keeping the script tags as separators
  const parts = html.split(/(<script>[\s\S]*?<\/script>)/g);
  let fileFixes = 0;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('<script>')) continue;
    const before = parts[i];
    const after = unescapeText(before);
    if (after !== before) {
      const matches = before.match(/\\u[0-9a-fA-F]{4}/g) || [];
      fileFixes += matches.length;
      parts[i] = after;
    }
  }
  if (fileFixes > 0) {
    fs.writeFileSync(file, parts.join(''), 'utf8');
    console.log(`${file}: fixed ${fileFixes} escape(s)`);
    totalFixed += fileFixes;
  }
}
console.log(`Total escapes unescaped: ${totalFixed}`);
