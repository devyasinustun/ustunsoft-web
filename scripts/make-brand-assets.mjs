// Wordmark'tan favicon setini ve Open Graph görselini üretir.
// Çalıştırma: node scripts/make-brand-assets.mjs
// Bricolage Grotesque'i Google Fonts'tan geçici klasöre indirir; çıktılar public/ altına yazılır.
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const INK = "#12141C";
const PAPER = "#F7F5F0";
const BRAND = "#FF5A1F";

async function fetchFont() {
  // Eski bir user-agent ile istenince Google Fonts woff2 yerine TTF adresi döndürür.
  const css = await (
    await fetch("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800", {
      headers: { "user-agent": "Mozilla/4.0" },
    })
  ).text();
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
  if (!url) throw new Error("Font adresi bulunamadı");
  const file = join(tmpdir(), "bricolage-grotesque-800.ttf");
  writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
  return file;
}

const fontfile = await fetchFont();

// Metni saydam zeminli, kenarları kırpılmış bir PNG olarak döndürür.
async function text(content, color, height) {
  const rendered = await sharp({
    text: {
      text: `<span foreground="${color}">${content}</span>`,
      font: "Bricolage Grotesque Ultra-Bold 60",
      fontfile,
      rgba: true,
      dpi: 300,
    },
  })
    .png()
    .toBuffer();
  return sharp(rendered).trim().resize({ height }).png().toBuffer({ resolveWithObject: true });
}

const square = (size, radius, color) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${color}"/></svg>`,
  );

// İkon: mürekkep zeminde "u" ve turuncu kare.
async function icon(size) {
  const letter = await text("u", PAPER, Math.round(size * 0.42));
  const dot = Math.round(size * 0.16);
  const gap = Math.round(size * 0.06);
  const left = Math.round((size - dot - gap - letter.info.width) / 2);
  const baseline = Math.round(size * 0.7);

  return sharp(square(size, Math.round(size * 0.22), INK))
    .composite([
      { input: square(dot, Math.round(dot * 0.25), BRAND), left, top: baseline - dot },
      { input: letter.data, left: left + dot + gap, top: baseline - letter.info.height },
    ])
    .png()
    .toBuffer();
}

// Tek PNG içeren .ico dosyası (PNG gömülü ICO biçimi).
function ico(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

writeFileSync("public/favicon.ico", ico(await icon(48), 48));
writeFileSync("public/icon-192.png", await icon(192));
writeFileSync("public/icon-512.png", await icon(512));
writeFileSync("public/apple-touch-icon.png", await icon(180));

// Open Graph görseli: 1200×630, zemin rengi, sola yaslı wordmark, altta turuncu şerit.
const wordmark = await text("ustunsoft", INK, 150);
const tagline = await text("mobil uygulamalar ve oyunlar", INK, 44);
const og = await sharp({ create: { width: 1200, height: 630, channels: 3, background: PAPER } })
  .composite([
    { input: square(64, 14, BRAND), left: 90, top: 300 },
    { input: wordmark.data, left: 180, top: 364 - wordmark.info.height },
    { input: tagline.data, left: 90, top: 420 },
    {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="40"><rect width="1200" height="40" fill="${BRAND}"/></svg>`,
      ),
      left: 0,
      top: 590,
    },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync("public/og.png", og);

console.log("public/favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png, og.png yazıldı");
