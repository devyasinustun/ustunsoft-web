# ustunsoft.com

ustunsoft'un kurumsal sitesi. Next.js ile statik olarak üretilir (`output: "export"`) ve GitHub Pages üzerinden https://ustunsoft.com adresinde yayınlanır. Site Türkçe (`/tr/`) ve İngilizce (`/en/`) olarak iki dildedir.

## Dokunulmaz dosyalar

Yayındaki uygulamalar ve AdMob şu üç adrese bağlıdır. Adlarını, yerlerini ve içeriklerini değiştirmeyin; formatlamayın:

| Adres                | Kaynak                     |
| -------------------- | -------------------------- |
| `/docs/privacy.html` | `public/docs/privacy.html` |
| `/docs/terms.html`   | `public/docs/terms.html`   |
| `/app-ads.txt`       | `public/app-ads.txt`       |

- `app/` altında `docs` adında bir route oluşturmayın.
- `next.config.ts`'e `basePath` eklemeyin.
- `npm run verify` bu üç dosyanın build çıktısında kaynaklarıyla birebir aynı olduğunu kontrol eder. Geçmiyorsa yayına çıkmayın.

## Yerelde çalıştırma

Node.js 24 veya üstü gerekir.

```powershell
npm install
npm run dev
```

Site http://localhost:3000 adresinde açılır. Kök adres tarayıcı diline göre `/tr/` ya da `/en/`'e yönlendirir.

İletişim formunu yerelde görmek için kökte `.env.local` dosyası oluşturun:

```
NEXT_PUBLIC_WEB3FORMS_KEY=web3forms-anahtarınız
```

Anahtar yoksa form yerine e-posta linki görünür; build kırılmaz.

## Build ve doğrulama

Her commit'ten önce üçü de hatasız geçmelidir:

```powershell
npm run lint
npm run build
npm run verify
```

- Build çıktısı `out/` klasörüne yazılır.
- `npm run format` Prettier'ı çalıştırır.
- Çıktıya yerelde bakmak için: `npx http-server out -p 8080`

## Yeni uygulama ekleme

1. `content/apps.json` dosyasına yeni bir kayıt ekleyin. Alanlar `types/app.ts` içindeki şemayla doğrulanır; eksik ya da hatalı alan build'i durdurur. Metin alanları (`name`, `shortDescription`, `description`, `features`) hem `tr` hem `en` ister.
2. Görseller için `scripts/fetch-images.mjs` içindeki `SOURCES` listesine uygulamanın slug'ını, Google Play ikon ve ekran görüntüsü ID'lerini ekleyin, sonra çalıştırın:

   ```powershell
   node scripts/fetch-images.mjs
   ```

   Betik görselleri `public/apps/<slug>/` altına WebP olarak yazar ve her ekran görüntüsünün boyutunu ekrana basar. Bu `src`, `width`, `height` değerlerini `apps.json`'daki `screenshots` listesine, ikon yolunu `icon` alanına yazın.

3. `accentColor` için ikonla uyumlu, beyaz metinle en az 4.5:1 kontrast veren bir renk seçin. Betiğin önerdiği renk ikonun arka planını yakalayabilir; gözle kontrol edin.
4. Destek sayfasında sık sorulan sorular görünsün istiyorsanız `content/faq.json`'a aynı slug ile bir grup ekleyin.
5. Uygulama gizlilik politikasının kapsamında değilse önce `public/docs/privacy.html` güncellenmelidir. Bu dosyaya yalnızca site sahibi karar verir.

Ana sayfadaki rakamlar (toplam indirme, yayındaki uygulama sayısı, puan) `apps.json`'dan hesaplanır; elle yazılmaz.

## Yakında (coming-soon) bir uygulamayı yayına alma

`content/apps.json` içinde ilgili kayıtta:

1. `status` değerini `"published"` yapın.
2. `playUrl` ekleyin: `https://play.google.com/store/apps/details?id=<packageName>`
3. `stats` (`downloads`, varsa `rating`), `ageRating` ve `updatedAt` (`YYYY-AA`) alanlarını doldurun.
4. İkon ve ekran görüntülerini yukarıdaki betikle indirip `icon` ve `screenshots` alanlarını doldurun; `accentColor`'u ikona göre güncelleyin.
5. Geçici `shortDescription` ve `description` metinlerini mağazadaki metinlerle değiştirin.
6. Ana sayfada öne çıksın istiyorsanız `featured` değerini `true` yapın (ana sayfa ilk iki öne çıkan uygulamayı gösterir).
7. `content/faq.json`'daki soruları gözden geçirin.

`published` bir kayıtta `playUrl` yoksa build hata verir.

## Proje yapısı

| Klasör        | İçerik                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| `app/`        | Sayfalar. `(root)/` kök yönlendirme, `[locale]/` dilli sayfalar           |
| `components/` | Arayüz bileşenleri                                                        |
| `content/`    | `apps.json` (uygulamalar), `faq.json` (sık sorulan sorular)               |
| `lib/`        | Veri erişimi (`apps.ts`), istatistik, SEO ve biçimleme yardımcıları       |
| `messages/`   | Arayüz metinleri: `tr.json`, `en.json`. Her anahtar iki dosyada da olmalı |
| `types/`      | Uygulama verisinin zod şeması                                             |
| `scripts/`    | `verify-static.mjs`, `fetch-images.mjs`, `make-brand-assets.mjs`          |

Bileşenler `apps.json`'u doğrudan içe aktarmaz; veri yalnızca `lib/apps.ts` üzerinden okunur.

Logo `brand/logo-source.jpg` dosyasından üretilir. Logoyu değiştirmek için bu dosyayı yenileyip `node scripts/make-brand-assets.mjs` çalıştırın; favicon seti, `public/logo.webp` ve `public/og.png` yeniden yazılır.

## Yayın

- `main` dalı yayındaki haldir. `main`'e yapılan her push `.github/workflows/deploy.yml` ile siteyi yayınlar.
- `main`'e doğrudan commit atılmaz. Her iş ayrı dalda (`feat/…`, `fix/…`, `content/…`, `chore/…`) yapılır ve PR ile girer; PR'da CI (lint, build, verify) yeşil olmalıdır.
- İletişim formunun anahtarı GitHub'da `WEB3FORMS_KEY` secret'ı olarak durur ve build sırasında okunur.
