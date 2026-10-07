@AGENTS.md

# ustunsoft.com

ustunsoft'un (Yasin Üstün, İstanbul) kurumsal sitesi. Mobil uygulama ve oyunlarımızı tanıtır, Google Play'e yönlendirir. Next.js statik export olarak build alınır, GitHub Pages üzerinden https://ustunsoft.com köküne yayınlanır. Benimle Türkçe konuş.

## Dokunulmaz adresler (en yüksek öncelik)

Yayındaki uygulamalarım ve AdMob bu üç adrese bağlı. Build çıktısında tam bu yollarda, yönlendirmesiz ve kaynaklarıyla byte byte aynı bulunmalılar:

- `/docs/privacy.html` ← `public/docs/privacy.html`
- `/docs/terms.html` ← `public/docs/terms.html`
- `/app-ads.txt` ← `public/app-ads.txt` (tek satır: `google.com, pub-8573448238100670, DIRECT, f08c47fec0942fa0`)

Kurallar:

- Bu üç dosyanın adını, yerini ve içeriğini değiştirme; formatlama, minify etme. `.prettierignore` onları korur, oradan çıkarma.
- privacy.html ve terms.html birbirine `./privacy.html` ve `./terms.html` ile bağlı; aynı klasörde kalırlar.
- `app/` altında `docs` adında route oluşturma. `/docs` yolu bu statik dosyalara ait.
- Footer'daki Gizlilik ve Koşullar linkleri doğrudan `/docs/privacy.html` ve `/docs/terms.html` adresine gider. Bu metinleri sitede ayrı sayfa olarak kopyalama, uygulamaya özel gizlilik sayfası üretme.
- privacy.html ve terms.html'i yalnızca ben açıkça istersem güncelle (örneğin yeni bir uygulamayı Kapsam bölümüne eklemek).
- `npm run verify` her build'den sonra geçmeli. Geçmiyorsa iş bitmemiştir.

## Komutlar

- `npm run dev`: yerel geliştirme
- `npm run lint`, `npm run build`, `npm run verify`: her commit'ten önce üçü de hatasız geçmeli
- `npm run format`: Prettier
- Build çıktısı `out/` klasörüne yazılır

## Teknoloji

- Next.js App Router, TypeScript strict, Tailwind CSS
- `next.config.ts`: `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`. basePath yok ve asla eklenmeyecek.
- i18n: next-intl, statik export uyumlu (middleware yok; `generateStaticParams` + `setRequestLocale`). `tr` varsayılan, `en` ikinci dil. Her metin iki dilde de eksiksiz olmalı.
- URL'ler: `/tr/`, `/en/`, `/[locale]/apps/`, `/[locale]/apps/[slug]/`, `/[locale]/about/`, `/[locale]/contact/`, `/[locale]/support/`, `/[locale]/legal/contact-form/`
- İkonlar lucide-react, animasyon motion paketi (ölçülü). Başka UI kütüphanesi ekleme, bileşenleri kendin yaz.
- Analytics yok. Eklenirse çerez onayı gerekir, bana sormadan ekleme.
- İletişim formu Web3Forms kullanır; anahtar `NEXT_PUBLIC_WEB3FORMS_KEY` ortam değişkeninden gelir. Anahtar yoksa build kırılmaz, form yerine e-posta linki görünür.

## Veri katmanı

- Uygulamalar `content/apps.json` içinde. Tipler `types/app.ts`'te, zod ile doğrulanır.
- Bileşenler JSON'u doğrudan import etmez. Tek erişim noktası `lib/apps.ts`: `getApps()`, `getAppBySlug()`, `getFeaturedApps()`. İleride bu fonksiyonların içi ASP.NET Core Web API'ye fetch'e dönecek; imzalarını koru.
- `status`: `"published"` veya `"coming-soon"`. coming-soon uygulama "Yakında" etiketiyle görünür, store butonu yerine pasif durum gösterilir.
- Uygulama görselleri `public/apps/<slug>/` altında.
- İndirme, puan gibi rakamlar sadece apps.json'dan hesaplanır.

## Metin kuralları

- Sitedeki hiçbir ifade `/docs/privacy.html` ile çelişmemeli. Uygulamalarda AdMob reklamı var, bu yüzden "hiç veri toplamıyoruz" deme. Doğru ifadeler: "hesap gerekmez", "oyun ve skor verileriniz cihazınızda kalır", "sunucumuza veri gönderilmez".
- Metinler kısa, somut ve insan yazmış gibi olsun. "Dijital dönüşüm", "inovatif çözümler", "geleceği şekillendiriyoruz" gibi kalıplar kullanma.
- Uydurma müşteri yorumu, sahte logo duvarı ya da şişirilmiş rakam kullanma.
- İletişim ve destek e-postası: ustunsoft.development@gmail.com. Konum sadece "İstanbul, Türkiye"; açık adres yazılmaz.

## Tasarım

Canlı, net, kendinden emin bir ürün stüdyosu hissi ver. Site "yapay zekayla üretilmiş şablon" gibi görünmemeli. Düz renk blokları, cesur tipografi, sıkı grid kullan.

- Renkler: mürekkep `#12141C`, zemin `#F7F5F0`, kart `#FFFFFF`, ana marka turuncusu `#FF5A1F` (CTA, vurgu), ikincil mavi `#2B59FF` (link, ikincil vurgu). Uygulama kart ve detaylarında her uygulamanın kendi `accentColor`'u kullanılır.
- Turuncu ve mavi küçük gövde metninde kullanılmaz. Kontrast her yerde WCAG AA'yı geçmeli.
- Fontlar: başlıklar Bricolage Grotesque (büyük, kalın, sıkı satır aralığı), gövde Instrument Sans. `next/font` ile, latin-ext subset'iyle yükle; ğ ü ş ı İ ö ç doğru görünmeli.
- Köşe yuvarlaklığı tutarlı, yaklaşık 12px.
- Ana görsel malzeme uygulamalarımızın gerçek ikonları ve ekran görüntüleri.
- Kaçın: mor/mavi gradyanlar, gradyan metin, parlayan blob ya da aurora arka planlar, her yerde glassmorphism, ağır gölgeler; her bölümün "ortalı başlık + 3 ikonlu kart" kalıbında olması (asimetrik grid, sola yaslı başlıklar, büyük rakamlarla çeşitlendir); emoji ikon, stok fotoğraf, AI illüstrasyon; gereksiz animasyon (sadece hafif hover ve scroll reveal).
- Erişilebilirlik: klavyeyle gezinme, görünür focus, alt metinler, `prefers-reduced-motion`. `<html lang>` dile göre ayarlanır. Türkçe büyük harfe çevirmede `toLocaleUpperCase("tr")` kullan (i/İ sorunu).
- Responsive: 360px'ten 1440px+'ya kadar, mobil menü dahil.

## Git ve GitHub

- `main` yayındaki halidir; ona yapılan her push siteyi yayınlar. main'e doğrudan commit atma, her iş PR ile girer.
- Her iş ayrı dalda yapılır: `feat/…`, `fix/…`, `content/…`, `chore/…`. Commit mesajları `feat:`, `fix:`, `content:`, `chore:` ile başlar.
- İş bitince: `gh pr create` → `gh pr checks --watch` → kırmızıysa düzelt → `gh pr merge --squash --delete-branch` → `git switch main` ve `git pull`.
- Ortam Windows ve PowerShell. Satır sonları LF (`.gitattributes`).

## Asla

- main'e force push
- Alan adı, DNS veya GitHub Pages custom domain ayarına dokunmak
- GitHub secret'larına değer yazmak
- `next.config.ts`'e basePath eklemek
- Dokunulmaz üç dosyayı değiştirmek veya taşımak
