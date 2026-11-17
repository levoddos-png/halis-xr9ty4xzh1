# HALİS menu.json şeması

Tüm okuma ve yazma `js/data.js` içindedir. Gerçek menüyü aktarırken bu dosyadaki alanı koruyun; kimlikler (`id`) kararlı olsun, sonradan değişmesin. Görseller `img/products/<ürün-id>.webp` olarak adlandırılır (yoksa ürünün `gorsel` alanı kullanılır).

Çok dilli metinler nesnedir: `{ "tr": "...", "en": "..." }`. Yalnızca Türkçe bir dizge verilirse yüklemede her iki dile kopyalanır.

## Kök

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `_aciklama` | string | İnsan notu; uygulamada gösterilmez. |
| `dukkan` | nesne | Mağaza bilgileri. |
| `haftanin_secimi` | string | Ürün `id`. |
| `cok_satanlar` | string[] | Ürün `id` listesi (sıra korunur). |
| `alerjenler` | nesne | `id → { tr, en }`. Ürünler bu id'leri tutar. |
| `ekstra_katalog` | dizi | Paylaşılan ekstralar: `{ id, ad:{tr,en}, fiyat }`. |
| `kategoriler` | dizi | Sıra, menüdeki görünen sıradır. |
| `rozetler` | nesne | `id → { ad:{tr,en}, zemin, metin }`. |
| `urunler` | dizi | Ürünler. |

## dukkan

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `ad`, `slogan`, `alt_slogan`, `aciklama` | `{tr,en}` | |
| `adres`, `telefon`, `instagram` | string | Instagram `@kullanici` olabilir. |
| `whatsapp` | string | `wa.me` için rakamlar, ülke koduyla (örn. `905xxxxxxxxx`). Boşsa form mesajı kopyalanır, WhatsApp açılmaz. |
| `whatsapp_ornek` | boolean | `true` ise numara örnek kabul edilir, kullanılmaz. |
| `wifi.ssid`, `wifi.sifre` | string | |
| `saatler` | dizi | Aşağıda. |
| `masa_sayisi` | sayı | QR üretiminde varsayılan üst sınır (ör. 20). |
| `temsili_not` | string | Bilgi sayfasındaki dipnot. |

Açık / kapalı durumu JSON'a yazılmaz; tarayıcı `saatler` ve `Europe/Istanbul` saatine göre hesaplar (`açık`, `kapalı`, `yakında kapanıyor` ≤ 30 dk).

### saatler[]

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `gunler` | `{tr,en}` | Gösterim metni. |
| `saat` | string | Gösterim, örn. `07:00 – 22:00`. |
| `acilis`, `kapanis` | string | `HH:MM`, 24 saat. Hesaplama bunlarla yapılır. |
| `gunler_id` | sayı[] | JS `Date.getDay()`: 0 Pazar … 6 Cumartesi. |
| `vurgu` | boolean | Satırı kalın gösterir. |

## kategoriler[]

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `id` | string | Kararlı, küçük harf, tireli (`serbetli-tatlilar`). |
| `ad`, `aciklama` | `{tr,en}` | |
| `renk` | hex | Bant / kart zemini, örn. `#E3792F`. |
| `metin` | CSS renk | Kart yazı rengi. |
| `acik`, `golge`, `renk_degisken` | CSS | İsteğe bağlı tema yardımcıları. |
| `temsili_urun` | string | Kart görseli için ürün `id`. |

Ürün sayısı saklanmaz; görünür (gizli olmayan) ürünlerden hesaplanır.

## urunler[]

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `id` | string | Kararlı. Görsel adı da budur. |
| `kat` | string | Kategori `id`. |
| `ad`, `kisa`, `icindekiler` | `{tr,en}` | Ad, kısa açıklama, içindekiler. |
| `fiyat` | sayı | Varsayılan / vitrin fiyatı (₺, tam sayı). Genelde ilk boy fiyatı. |
| `boy` | dizi | Ölçü / boy / porsiyon seçenekleri (zorunlu değil; yoksa `fiyat` tek seçenek olur). |
| `ekstra` | dizi | `ekstra_katalog` id'leri veya `{ id, ad:{tr,en}, fiyat }` nesneleri. Boş olabilir. |
| `alerjen` | string[] | `alerjenler` katalog id'leri (`gluten`, `sut`, `yumurta`, `soya`, `kabuklu`, `susam`, `yerfistigi`…). |
| `rozet` | string[] | `rozetler` id'leri (`yeni`, `cok-satan`, `vegan`, `glutensiz` veya özel). |
| `gorsel` | string | Göreli yol. Yeni yüklemeler: `./img/products/<id>.webp`. |
| `tukendi` | boolean | Vitrinde “Tükendi” gösterilir, listeye eklenemez. |
| `gizli` | boolean | Müşteri menüsünde hiç görünmez. |
| `ornek_fiyat` | boolean | Fiyatın örnek olduğunu işaretler. |

### boy[]

Gerçek menüdeki beden / dilim / gramaj / top sayısı buraya yazılır.

```json
{ "id": "buyuk", "ad": { "tr": "Büyük", "en": "Large" }, "fiyat": 110 }
```

`id` kararlı olsun (`kucuk`, `orta`, `buyuk`, `150-g`, `dilim`).

### ekstra

Katalogdan id:

```json
"ekstra": ["ekstra-sos", "ekstra-shot"]
```

veya ürüne özel:

```json
"ekstra": [
  { "id": "ekstra-shot", "ad": { "tr": "Ekstra shot", "en": "Extra shot" }, "fiyat": 15 }
]
```

Liste tutarı: seçilen boy fiyatı + seçilen ekstraların toplamı.

## Eski alanlar

`data.js` yüklerken şunları da kabul eder ve yeni şemaya çevirir:

- `ad` / `kisa` düz dizge → `{tr,en}`
- `porsiyon: [["4 dilim", 320], …]` → `boy`
- Eski alerjen adları (`"Süt"`, `"Kabuklu yemiş"`) → id

Kayda (admin kayıt) yalnızca yeni şema yazılır. `porsiyon` artık yazılmaz.

## Masa ve dil

- Masa numarası URL'den gelir: `?masa=12`. Yoksa gösterilmez.
- Dil `localStorage` anahtarı `halis-lang` (`tr` | `en`).

## Örnek ürün (özet)

```json
{
  "id": "baklava",
  "kat": "tatlilar",
  "ad": { "tr": "Fıstıklı Baklava", "en": "Pistachio Baklava" },
  "kisa": { "tr": "…", "en": "…" },
  "icindekiler": { "tr": "…", "en": "…" },
  "fiyat": 320,
  "boy": [
    { "id": "4-dilim", "ad": { "tr": "4 dilim", "en": "4 slices" }, "fiyat": 320 }
  ],
  "ekstra": ["ekstra-fistık"],
  "alerjen": ["gluten", "sut", "kabuklu"],
  "rozet": ["cok-satan"],
  "gorsel": "./img/products/baklava.webp",
  "tukendi": false,
  "gizli": false
}
```
