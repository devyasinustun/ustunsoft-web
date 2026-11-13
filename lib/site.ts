export const SITE_NAME = "ustunsoft";
export const SITE_URL = "https://ustunsoft.com";
export const CONTACT_EMAIL = "ustunsoft.development@gmail.com";

export const PRIVACY_PATH = "/docs/privacy.html";
export const TERMS_PATH = "/docs/terms.html";

export const FOUNDER = {
  name: "Yasin Üstün",
  photo: "/about/yasin-ustun.webp",
  site: { tr: "https://yasinustun.ustunsoft.com/", en: "https://yasinustun.ustunsoft.com/en/" },
  linkedin: "https://www.linkedin.com/in/yasin-%C3%BCst%C3%BCn-aa80669b/",
} as const;

// Kök sayfa ve 404, ziyaretçinin son seçtiği dili bu anahtardan okur.
export const LOCALE_STORAGE_KEY = "locale";
