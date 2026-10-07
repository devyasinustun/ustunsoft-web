// Logodan favicon setini, sitede kullanılan logo işaretini ve Open Graph görselini üretir.
// Kaynak: brand/logo-source.jpg. Çalıştırma: node scripts/make-brand-assets.mjs
// Bricolage Grotesque'i Google Fonts'tan geçici klasöre indirir; çıktılar public/ altına yazılır.
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const SOURCE = "brand/logo-source.jpg";
const INK = "#12141C";
const PAPER = "#F7F5F0";
const BRAND = "#FF5A1F";
const WHITE = "#FFFFFF";

// Kaynak görselin açık gri zeminini saydamlaştırır. Zemin renksiz, logo doygun renkli olduğu
// için saydamlık pikselin renk doygunluğundan çıkarılır; kenar piksellerine karışmış zemin
// rengi geri alınır ki koyu zeminde açık renkli hale kalmasın.
async function extractMark() {
  const { data, info } = await sharp(SOURCE).removeAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const background = 240;
  const out = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const rgb = [data[i], data[i + 1], data[i + 2]];
    const chroma = Math.max(...rgb) - Math.min(...rgb);
    const alpha = Math.min(1, Math.max(0, (chroma - 12) / 36));
    for (let c = 0; c < 3; c++) {
      const value = alpha > 0 ? (rgb[c] - (1 - alpha) * background) / alpha : 0;
      out[o + c] = Math.min(255, Math.max(0, Math.round(value)));
    }
    out[o + 3] = Math.round(alpha * 255);
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer();
}

const mark = await extractMark();

// İşareti kare bir tuvale, kenar boşluğuyla ortalar. background verilmezse zemin saydam kalır.
async function icon(size, { padding = 0.08, background } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const fitted = await sharp(mark)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: fitted, gravity: "center" }])
    .png({ compressionLevel: 9 })
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

// Header, footer ve 404'teki wordmark'ın yanında duran işaret (saydam zemin).
const logo = await sharp(mark)
  .resize({ height: 96 })
  .webp({ quality: 90, alphaQuality: 100 })
  .toBuffer({ resolveWithObject: true });
writeFileSync("public/logo.webp", logo.data);

writeFileSync("public/favicon.ico", ico(await icon(48, { padding: 0.02 }), 48));
writeFileSync("public/icon-192.png", await icon(192, { padding: 0.04 }));
writeFileSync("public/icon-512.png", await icon(512, { padding: 0.04 }));
// iOS saydam zemini siyaha boyar; bu yüzden beyaz zemin ve daha geniş boşluk.
writeFileSync("public/apple-touch-icon.png", await icon(180, { padding: 0.14, background: WHITE }));

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

// Open Graph görseli: 1200×630, zemin rengi, solda logo, yanında wordmark, altta turuncu şerit.
const ogMark = await sharp(mark).resize({ height: 250 }).toBuffer({ resolveWithObject: true });
const wordmark = await text("ustunsoft", INK, 98);
const tagline = await text("mobil uygulamalar ve oyunlar", INK, 34);
const textLeft = 90 + ogMark.info.width + 50;
const og = await sharp({ create: { width: 1200, height: 630, channels: 3, background: PAPER } })
  .composite([
    { input: ogMark.data, left: 90, top: 170 },
    { input: wordmark.data, left: textLeft, top: 225 },
    { input: tagline.data, left: textLeft, top: 225 + wordmark.info.height + 34 },
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

console.log(
  `public/logo.webp (${logo.info.width}×${logo.info.height}), favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png, og.png yazıldı`,
);
