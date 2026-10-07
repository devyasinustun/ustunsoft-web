// Build çıktısında dokunulmaz üç adresi kontrol eder.
// Biri eksik ya da kaynağından farklıysa hata verip çıkar (CI kırmızıya döner).
import { existsSync, readFileSync } from "node:fs";

const errors = [];

function sameAsSource(src, out) {
  if (!existsSync(src)) return errors.push(`${src} bulunamadı`);
  if (!existsSync(out)) return errors.push(`${out} bulunamadı`);
  if (!readFileSync(src).equals(readFileSync(out))) errors.push(`${out} kaynağıyla aynı değil`);
}

sameAsSource("public/docs/privacy.html", "out/docs/privacy.html");
sameAsSource("public/docs/terms.html", "out/docs/terms.html");

const adsLine = "google.com, pub-8573448238100670, DIRECT, f08c47fec0942fa0";
if (!existsSync("out/app-ads.txt")) errors.push("out/app-ads.txt bulunamadı");
else if (readFileSync("out/app-ads.txt", "utf8").trim() !== adsLine)
  errors.push("app-ads.txt içeriği hatalı");

if (errors.length) {
  console.error(errors.map((e) => "HATA: " + e).join("\n"));
  process.exit(1);
}
console.log("OK: /docs/privacy.html, /docs/terms.html, /app-ads.txt");
