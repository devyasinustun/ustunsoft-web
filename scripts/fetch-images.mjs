// Uygulama ikon ve ekran görüntülerini Google Play'den indirir, WebP'ye çevirir
// ve public/apps/<slug>/ altına yazar. Çalıştırma: node scripts/fetch-images.mjs [slug]
// Slug verilirse yalnızca o uygulama indirilir.
// Çıktıdaki screenshots listesi ve accentColor önerisi content/apps.json'a elle işlenir.
//
// Ekran görüntüleri mağazadaki telefon görüntüleridir; tablet görüntüleri alınmaz.
// Mağazada her dilin kendi seti varsa { tr, en } olarak verilir ve public/apps/<slug>/<dil>/
// altına yazılır. Tek set varsa dizi olarak verilir, kökte durur ve iki dilde de kullanılır.
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const LOCALES = ["tr", "en"];

const SOURCES = {
  // Mağazada tek set var.
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
    screenshots: {
      tr: [
        "NHz8DJ_8UOZ2wLfCLLvX1Tp9RQY8ONGJ14IjZETVsWIRsOkR6Sw8p3UuTuDS6elMDE5f1zKYEwmdbu78qi8TXA8",
        "O-KdgfiBZqo0aPNBoc1Ei18Vcaho-vj2M0mJdUxQxHT0gst-b_Ume3p-CjGUtS3FbH1LLbgSFCLN1axgE53k",
        "cs-N3L-aOKxZkZ0JkzMTdug5j5PvoGfYIoLaA2Hvm4hWTQiHjNZvC3YSNYckiiWf5YBWshjnYsM06Cd-Dh189A",
        "c6dAddCunnhxD0nfT4TP9NbmhQS3wCTs9rrJtzWCj7XrMlOL0MSXWnnlFNvHwuClBe2LvnW6YXyP-lEL7I90mc0",
        "TtHh3YJeK4JcnolPRhw1ZPEKsykYd4Vjh9GH7XsYIV2-XEfoJ9ihdlNOqQ_-MPLTNtbJLbTAHhulIVxLrBC4",
        "tafNp8xp20Q2vVDBpIiMlEG6AV2QL-HxohAyu0n0Rus77wI-cq9MZdEU1DpbdJMj88vPAo-w6aoLSv8gQwkCuQ",
      ],
      en: [
        "5r8gCx5bgK0JvnmCI0zgmxcfy6aigmpLPKWUiVuM2F4CRdlpwsGKBpnyOR1S69MY5OyOcG4bS-2LWwoJUMAKiWs",
        "Q9qhL4mD8zUAR6OAkp4Qp_WCdIBH6g6PEZ5bOcMzFhsM-cnw-7Bd2DHR7dT0JyHXcXhuxFQf6MNBUXp0KIjzVdw",
        "lCWl0OF7V32Pqm8utFyFmATCX58uOldTmyEypING9ji8tt8Y5oVDBbZVGSey966O2zPOqvKcRnJs8LY-tF91hA",
        "mxbK_y6h0vdIaWDDmigzk5RJinVkqgoSeVNWHwkRlkBV-nA6yXyhUXqUn1oqJxuMoVRuRArO2nDEBTP4Ocir",
        "AYoreY7mQ_mcg5ix3nBG9Itot_g_P2MdA13G3wpRUwFv_8KWYwRjpXfzj5MWhkSJktfkO6nbw-fsCE8zyZdJ7t0",
        "cHp7Y-lxA-gi1xzg4x57ywMZG-fg3eCtnf7eP-TzXexmiCa03FzLNPAud30RoHw3HMhqugoKcFcM07WX5gmZkA",
      ],
    },
  },
  scancode: {
    icon: "3-oauGAl1e3VsDr9-OtQHQVCN8r2TYoNqkWETtPY5AT2glcS0Rq7W0T6YjMoefAHeoRvQqJWTuaI1BLpEwJ5",
    screenshots: {
      tr: [
        "IwPBgabEhNqaMgENqAijXcf30KSPyKbc4WrzvZy0GOnzeQPYHygV89A6HrkaGivBo_1kTAyC4Ct55I4vSlVNYQ",
        "NHpqmn06prpnvNXzmkQyIIcQiu_BAkDDlUkUPsYqY6eLd6wHMWX-T1uu1sWNTgp5qPsvEtFfiSGSUis_QEtD",
        "ADGWMTCTOpaXhECaP0qUAVTZLJdSDaEhtpZlcnV08bw9Xhe4oCxoT4sMMq-eVnh1cNKWzTMuXusTfU7BhGFyVRc",
        "ZOxgIc8QB1b8fYQlLsgJ5Tam3mQ58A4Ot4ZhiP-zb9fQmXQS7v8ph1PbkWhI1Z09UN6LRpwWFPCb7Wrug1ItUQ",
        "FauhHKUgm63QmHShyzOmY7qE3PGJZe1XLCwviSTncRKmaWTx8wAb0zuoZyCFg9MvpxF7K-HQHfECE4cvF1yd",
        "ayeNXz_8rvli3Fih3dCWUBdshyAG3VMz9J1mqHY6o4BXKSMEd9YqNcSxfT8p0QfdRkNFK6TRKq8L0eA_sqt_",
        "bgfgd0peRxOAy2mUO9j9xNllo5OAmSkZJ_Nb0fphpcS_7tTa2G344Lrs0hOvfpa95uUl8iqD7lcI2zSkjWqg",
        "aDNMLFWVZMt4u0kDfBepy9rsxxmdJ6Y1lFlleK_ZsvKxwpr9I6vi7bu63mxQEr6YnzDewsfkMhHRmZudNn_cXA",
      ],
      en: [
        "PF2iq7sqJ6vDAvjEVzAs_lrdSlGLxKZiHKBjLSmQpK4xSOdAUKkYWCZRMS5REEEYUH2OMoug0VV-eBI3Ndte2w",
        "JpY3D2iRmAe8Lycv1ibcMYJfwefWtm06Ri6Eg8oqnQSFihNevG_FGF1cDULcaQ6wDs4mWTXl0hmCijqD9Xvf",
        "vYNiYATl8ypMkhULLKUAi-Yjli3Yx5SQkM645mlaDL2h33djl8Qr3--XE8sS9naU6kOlmuUd_HuqH2aPe9weAA",
        "5au7M-WBtJaa1AFHJFcwzB4_OrQ0tsgLMMMLsWt7gmn3QTdZ7IahQozTMWqQNHPHXWoigoWMWHGIjBII3E6w",
        "CJwIBOUNejLAQ2yOgYEKNd2s103ykp9C9uuUtXNlWi0YYuC021mW9upPHDbbggHa_tlAmKRsPaeeL4-HUlYzqkY",
        "PcayaboOg3gpH2EnJWOc6dsqtQM9ULYl8WFHSawt6xtbKC3U3XMmidCd_p3rYxR9k2kUfL_QBFHgRmR22wIelwQ",
        "aQec7BIvOmh-vfz6PVzON_X-TZlAga5LFKVlL0kGFfuYOFmFvV_jntDxgm5M4HnwYXp0KSIUw7S8xF63hIQoOA",
        "EbEw8hcswKh9lsOjaXkEuQf437khppS01NCmITBUeemat3C7wii0LHnoVVA8x1iQREnT0MaeJehAiGSK9K4_hQ",
      ],
    },
  },
  okeyro: {
    icon: "QK7Q4XJ-jgTgf8q95PBC6ymkmOEm0UkvFSNcnb4jwMVQfKRJd5vhbtJMO5HIIwMOPY9F_yeo31amTL-apUGt0kw",
    screenshots: {
      tr: [
        "SN0TZu1dHTn-djEvoyJyQSrVxCSWoSuEKE9rnN1UpLOXXHpfJsitLpcpG6r0hFJCKATPWHdz8uyzbpGcpGKHw2E",
        "IPPYRs5phQ8ps9WB6evckpu062Em3u2AJyWa2-ePwA9XbTeFmNGXC1f_Ou7Cviw6xjQCfndLXqaVNgPBtQWVqw",
        "RU-bp-oz2NJ9LRmJ90hE8_SEiLQwStG6TtuJR_PUL7Xcpss6X7KdAlX-7B50FURmQjFgnEy2nP2-d5YF2LPoCA",
        "YtE8hNojBFNGFvry6L5MjgYII2aaQoGwr0OXO8ruLvp6cJCo3DQS1KAYNPn0bO8LbgquX3RyHXOfvt_q7Fwu",
        "PeSBIXAyd6B5mQcu04yTQhIWbb2Hq_8GOVzGYeMOCYex5aBrjU5Iw8UQZQjXhnqOduRRgupU3TfCMQ_ptp5oGOE",
        "tCKDnoaBP1ElV0QtDj87uTu6qCal86hapRarX2wZCIrPvpVIpgPem_fz34p8xs9uAeXKjPs3zxFoNlrXu-ASHQA",
        "8MXtg3lDoRIE2-G6UiBtIGxjjGI4pgZX46-wdX8YfNL8rCtXHeAjTyBnEV_C7I-b7AM3LOboxVyViPX8SVpVQg",
        "3pQiYLiQkoLUF8vfOgzb9_wF7wkYhpfJu0fbYprK0XNqLE8m5uSBge6sKPBzBgsUEhbwcggwffCnKmp4wGUO",
      ],
      en: [
        "q1vwyCQzO4vumWbayyxJh8z-XlQZnc29kuF3fC0HVUCGhFBIGQQQs2QspsPu4mfPEDVWC6R4ieqHUmgERgB43po",
        "7xWShpdys-PrGODoUB07lFeYYiQmU2HYQ82hmvrgVbk3elS0XKACR-jWMQBLVd_lahKbe6Tu1EFuBTAJ-rH1r4c",
        "Z5Fpq0YN8Xt3NpeXsvJHpQ2YG1cdGIYe2THLz0quNAtY8tCqYwpnrMf1b-4x7PMF82eZ2XJ3Te5IAlCr2JFwpQ",
        "I6EGv-ggGlG2IoF4rqRt_1Df0wXX5yEKF2udQCU_c5QOjQHEM2SB-raAqPyXwDzJSqHRnv40wYfWIhH0c8XnEg",
        "9SksHLrmeRVo7PA-Xz3UpLs2iOpuNfw1geRm4PvdkxmSze_nlIxx7eiblbI0HgWdOuV1X2nfA1ISlGUP5wDVSQ",
        "lDhCr9BC5V9q_49dSOzb0wGATuM0mib1-JTIZpiC4bjyyn6MOzy9F49vLbohQ9-DFKePSSZ3ueq_k5NVbVa5CA",
        "Uxx3TDhte3yYaxQU6Pf-Nz-7aWypvWkuPmLw2E0kUIh0HJIMYf5x16Yz-J5ZCJB8j_pMcn1CDzh2kusbzhSN",
        "FU9I5qhGilG7nddTugO3gF3Y1EDK_4sWKQVu6Ss6SNmq32QtUOtqW1HBVTpKYg-NGWnhHeWyDQVVxFCAgWTfDA",
      ],
    },
  },
  peckaroo: {
    icon: "3MpXAED0ZszK21dxbwmHvvKgDXlcGv9oy9i4kVw6QMq1Hefrm45S2GO6dTuAhw4NT4xKcPLK9lQTxFfjHxX7gQ",
    screenshots: {
      tr: [
        "fmElmyYG4kGF4ouCe70AwP_ZesTc3G_vEHbSQ_T8LyQEl-1aYmKBEevRpG6TjguKGfgnqUCJzUAnlJ2QuuYhqg",
        "f4fRWhNXrcx7XFiGp2k8DFsQvivB7QPJQGDvr1csBtDnCb395ASRBslsyvX4dyT-YMkuF4AUzIZ6ggAbGzs0gQ",
        "aVqO9Kv6zvN99FSnK7o7fl6q0Yodw6GMeOZhtJder5-NTuwY4JinTZfPM9Zc-zVJvPDKWIdrelF2WQ3DXfYLjg",
        "cwIXMVhnq_zPX7kxCoyvfArT2b4155F3WxO1DePuiVmwLQRgKDjfmT6UpG833WGXa07zvELu6rLzLbbwt_t4pw",
        "jsFL-6l901eNzgaUelxfPXxQSupRQfEwhTZvSccScVeQhLV4hj1n3NHjNjurSAk1le5HcL-HChR3sKf6KuQsIA",
        "W1QYNPmT9Uh1N0aZmk8-iw_SfM_9jgpoJMXYDmRfX6bEasps5reLAjZSfrc6oWopEaunPmzSnjGfjVg_PBPWPw",
        "a02_16hy0I-C--wG2432fg8p3_x0IFyApoS-XH-tOnjQTfYgAP7ZE5rOrqm5T-fHQciEtj1yOpFmkDeOYZva",
        "ovnKo__vp69OVbcMMtt1XiAcjW295qOchOBx3BAZDgo3kzeGeLdgC0s3SoiY0klS4Oi2dYhrmzj5zWx4D1-6mw",
      ],
      en: [
        "lDULrViehRONVuzSP6td7-_qC_apZLbLC7Bjz9NRWLN05lixMKuIlVhCg-qfafcQTMfcbOue9wQxQaZmHR6PQA",
        "oz7PkbsUNxInAx0Q99tNQMdFbCuJx9XngUTEmBkTrPCvqv57MMSg8H7HA0FDDa8ixBZk6E1FELYqeEwSRcM9sgA",
        "Y0TQhLLQdXe35wqzpTnuGVWN0Jy_y61ma6ZqPfEXhC1mX68TDFIlrtEydU9zq3Hhb7RDg3M7ul0NNpwoHZgfLsQ",
        "BcYPmbd-M_GxgickKoJFQl8DKODfZCgvHBwmxhjA9Zs9Ym0nFZN_i8nAqnLivalS7fHtRGicCQqjJSuavqqfd0Q",
        "G5_Xcd_OXXO3UdDn7Q-A9kreLtJc5IasoeWrAHaNV4f_j5yQaX8LkOugWs1imP5zBfSCqKMzj1I0nXvH38UBSw",
        "oGQQgW_U78HVS6w11lUaRf3mdZin3M2r6QezFMnsZDnYIYCK8_NQARjKXGKv1ozjs_PqVzble2L-srTwG0aOxQ",
        "ezdFTmWS9tUYas0fEFnIiirHmHQne8w8keybKSSiz9_dbF8ZPN4qzgVOdfAeDmnBi0MWq8BO9Am9-SKkVXgX8A",
        "Oj6gTso43jh6YpZHlgk4NrY-iZKAAw3_AQ8AFHj0jIpUzkifo-SexebAhHQ1dEaLHNkCbQEG8ay2Qtlb6K8gs30",
      ],
    },
  },
};

// En büyük kullanım 128 CSS pikseli; 2x ekranlar için 256 yeterli.
const ICON_SIZE = 256;
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

// Görüntüleri dir/screenshot-<n>.webp olarak yazar; indirilemeyenler atlanır, sıra kaymaz.
async function saveScreenshots(ids, dir, skipped) {
  mkdirSync(dir, { recursive: true });
  const saved = [];
  for (const id of ids) {
    try {
      const file = `${dir}/screenshot-${saved.length + 1}.webp`;
      const info = await sharp(await download(id))
        .resize({
          width: SCREENSHOT_MAX_EDGE,
          height: SCREENSHOT_MAX_EDGE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toFile(file);
      saved.push({ src: file.replace(/^public/, ""), width: info.width, height: info.height });
    } catch (error) {
      skipped.push(`${id.slice(0, 12)}…: ${error.message}`);
    }
  }
  return saved;
}

const only = process.argv[2];
if (only && !SOURCES[only]) throw new Error(`Bilinmeyen slug: ${only}`);

const report = {};
for (const [slug, source] of Object.entries(SOURCES)) {
  if (only && slug !== only) continue;
  const dir = `public/apps/${slug}`;
  mkdirSync(dir, { recursive: true });
  report[slug] = { screenshots: {}, skipped: [] };

  const iconBuffer = await download(source.icon);
  await sharp(iconBuffer)
    .resize(ICON_SIZE, ICON_SIZE)
    .webp({ quality: 90 })
    .toFile(`${dir}/icon.webp`);
  const { dominant } = await sharp(iconBuffer).stats();
  const rgb = [dominant.r, dominant.g, dominant.b];
  report[slug].dominant = toHex(rgb);
  report[slug].accentColor = accessibleTone(rgb);

  const { skipped } = report[slug];
  if (Array.isArray(source.screenshots)) {
    const shared = await saveScreenshots(source.screenshots, dir, skipped);
    for (const locale of LOCALES) report[slug].screenshots[locale] = shared;
  } else {
    for (const locale of LOCALES) {
      report[slug].screenshots[locale] = await saveScreenshots(
        source.screenshots[locale],
        `${dir}/${locale}`,
        skipped,
      );
    }
  }
}

console.log(JSON.stringify(report, null, 2));
