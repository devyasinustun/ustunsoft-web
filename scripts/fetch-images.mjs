// Uygulama ikon ve ekran görüntülerini Google Play'den indirir, WebP'ye çevirir
// ve public/apps/<slug>/ altına yazar. Çalıştırma: node scripts/fetch-images.mjs
// Çıktıdaki boyutlar ve accentColor önerisi content/apps.json'a elle işlenir.
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const SOURCES = {
  "tabu-mabu": {
    icon: "6Q_TzttjATbb5VMVXD5a7sG4o9Yw67sM7sMB5GBES48ELY3_OwQvaPERU0PKESfTOxdMe1bvuAHO_6-uR7YKAQ",
    screenshots: [
      "aZG4BlgMCa_Xna9_HJDStVh99HGp2aIsBopgXuSVwNSIhiww5M2qwqZMRfsXpk46qmYsO58oKjcFqQbfoaxpGQ",
      "x3vyxrt6it0-O6ufD_z1_ZyCeALo1-Vb57kW2DAPI-Cqu0m2HJe-1dQKzzch1Bho8Xjby0SUBY6DGnJHbDzY",
      "MAVlvOzIZNGNdlSInRzdfjtwdoe6Z1Y3a_Ao56Y0zTbyvlZ_Qv9DWmzYkqW8yzJby3VKrkauKYP7EmtjK1ztJw",
      "Y0O1mmWYQo7mOTALAh0kUF43j0kk1lG8WSdPMYr_8q4f_EIYiS4gI76yFOMZ9kkg_KkfB4I2p1C5Cn8XGh7XjQ",
      "57TblmmafuI6I2Co-0QVdWv_0nrJPeMYtelhKH3SqRl2eHBT86y5mslL581Jt1sbid6Pgf78YcvtSXPIfqbP2w",
      "Ii-e1GVQa-QSAA45rUZX0SNOHcNinNvKXIZnLznsTeyKVjHGIgHkATJZBOujDARn-nTFS-UPAN2_CfwH6LCcUtM",
      "v3Q4PEJugkwUWUd6jdFQg20VDUZUaCVcWhPKCv_jLWahmtt0btQI1lj8xgDZ1hS1plbCXtrDfqRM01BTW-2hSw",
    ],
  },
  "score-master": {
    icon: "dmjH4qHHz7qqR8JWzLeqdEdsxEg0KpI20FBOmcX7_1Vzd1rPf2bTR6k-rADpi-SVj4MnQWRjVvMb4_xMyuhGUA",
    screenshots: [
      "s030HwQAmRD0IKny-mNsLG5JykL_S6elntTlImtKYc0oW0qtHhXL0mh6YfZJfBpj0VFJ3CSIX5ujBe4_HZDGkw",
      "QYk75VZCK3v30uljwp0lTVxs2hlObOFtuMQbIIjc9fiLp4OJsblU3IkNN0cuxLKVDluxb2K7e19MVxH8_OZpfg",
      "vfuLkueF8Q19yh1FrUb8DHE5KkrQDTSahM_tq9At4krvovy7GZ1lZ3vKh66w_kwuxesnb32NecfvhULIQvbU1g",
      "j6z06RsJn9c-oR3qfm-gwJew6GSK4kLA0UhkuwbbGsiwxxnLOWkEY6ZY9L5WyLfeP9MXMoGquF8lqcHW8c5y8w",
      "43uldwamEQJNuodV3PSlW8rUxWtPIcASecFXVSyVRvfKlGqEVQLAOGaCHNB7i-nzYawxv--zlwatwT9NwjBeYg",
      "Q1oMGI1ph95aO8xXkD4EUzmaNX0QE5rr1LnCiPu1rzaLDF_1e4YFj2RgAkqvqLfboNIGeThvGcOGaRJo6UynXQ",
    ],
  },
};

const ICON_SIZE = 512;
const SCREENSHOT_MAX_EDGE = 1080;

async function download(id) {
  const res = await fetch(`https://play-lh.googleusercontent.com/${id}=s0`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

const contrastWithWhite = (rgb) => 1.05 / (luminance(rgb) + 0.05);
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

// Baskın rengi, beyaz zeminde AA (4.5:1) kontrastını geçene kadar koyulaştırır.
function accessibleTone(rgb) {
  let tone = rgb;
  while (contrastWithWhite(tone) < 4.5) tone = tone.map((v) => v * 0.96);
  return toHex(tone);
}

const report = {};
for (const [slug, source] of Object.entries(SOURCES)) {
  const dir = `public/apps/${slug}`;
  mkdirSync(dir, { recursive: true });
  report[slug] = { screenshots: [], skipped: [] };

  const iconBuffer = await download(source.icon);
  await sharp(iconBuffer)
    .resize(ICON_SIZE, ICON_SIZE)
    .webp({ quality: 90 })
    .toFile(`${dir}/icon.webp`);
  const { dominant } = await sharp(iconBuffer).stats();
  const rgb = [dominant.r, dominant.g, dominant.b];
  report[slug].dominant = toHex(rgb);
  report[slug].accentColor = accessibleTone(rgb);

  let index = 1;
  for (const id of source.screenshots) {
    try {
      const info = await sharp(await download(id))
        .resize({
          width: SCREENSHOT_MAX_EDGE,
          height: SCREENSHOT_MAX_EDGE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toFile(`${dir}/screenshot-${index}.webp`);
      report[slug].screenshots.push({
        src: `/apps/${slug}/screenshot-${index}.webp`,
        width: info.width,
        height: info.height,
      });
      index++;
    } catch (error) {
      report[slug].skipped.push(`${id.slice(0, 12)}…: ${error.message}`);
    }
  }
}

console.log(JSON.stringify(report, null, 2));
