// One-off generator for placeholder PWA icons.
// Run: node generate-icons.mjs
// Replace the output PNGs with real artwork before launch.

import zlib from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// Diagonal gradient orange→yellow→green to match the wordmark dot
function pixel(x, y, size) {
  const t = (x + y) / (size * 2);
  // 3-stop gradient: #fb923c → #fbbf24 → #34d399
  let r, g, b;
  if (t < 0.5) {
    const k = t / 0.5;
    r = Math.round(0xfb + (0xfb - 0xfb) * k);
    g = Math.round(0x92 + (0xbf - 0x92) * k);
    b = Math.round(0x3c + (0x24 - 0x3c) * k);
  } else {
    const k = (t - 0.5) / 0.5;
    r = Math.round(0xfb + (0x34 - 0xfb) * k);
    g = Math.round(0xbf + (0xd3 - 0xbf) * k);
    b = Math.round(0x24 + (0x99 - 0x24) * k);
  }
  return [r, g, b];
}

// Carve a "P" mark on top so the icon isn't featureless
function isPGlyph(x, y, size) {
  const cx = size * 0.30, cy = size * 0.20;
  const w = size * 0.42, h = size * 0.60;
  const stroke = size * 0.10;
  // Vertical bar
  if (x >= cx && x < cx + stroke && y >= cy && y < cy + h) return true;
  // Top horizontal
  if (x >= cx && x < cx + w && y >= cy && y < cy + stroke) return true;
  // Right vertical (top half)
  if (x >= cx + w - stroke && x < cx + w && y >= cy && y < cy + h * 0.5) return true;
  // Mid horizontal
  if (x >= cx && x < cx + w && y >= cy + h * 0.5 - stroke && y < cy + h * 0.5) return true;
  return false;
}

function createPng(size) {
  const rowSize = 1 + size * 3;
  const raw = Buffer.alloc(rowSize * size);
  for (let y = 0; y < size; y++) {
    const off = y * rowSize;
    raw[off] = 0;
    for (let x = 0; x < size; x++) {
      const idx = off + 1 + x * 3;
      if (isPGlyph(x, y, size)) {
        raw[idx] = 0x0b; raw[idx + 1] = 0x0f; raw[idx + 2] = 0x1a; // brand bg
      } else {
        const [r, g, b] = pixel(x, y, size);
        raw[idx] = r; raw[idx + 1] = g; raw[idx + 2] = b;
      }
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

const targets = [
  { size: 192, file: 'public/icons/icon-192.png' },
  { size: 512, file: 'public/icons/icon-512.png' },
];

for (const { size, file } of targets) {
  const out = join(__dirname, file);
  writeFileSync(out, createPng(size));
  console.log(`wrote ${out} (${size}x${size})`);
}
