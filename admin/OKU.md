# HALİS yönetim paneli — giriş yönergesi

Panel sunucusuz çalışır. Menü ve görseller, tarayıcıdan GitHub’a kaydedilir; GitHub Pages birkaç dakika içinde siteyi yeniden yayınlar.

**Jetonu (token) kimseyle paylaşma, sohbete veya koda yapıştırma.** Yalnızca bu sayfadaki alana yaz. Varsayılan olarak yalnızca bu tarayıcı oturumunda tutulur; “Bu cihazda hatırla” dersen aynı tarayıcının yerel deposunda kalır. İsteğe bağlı PIN, jetonu değil giriş ekranını korur.

## İnce ayarlı GitHub jetonu oluşturma

1. GitHub’da oturum aç (bu depoyu yöneten hesap: **levoddos-png**).
2. **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.**
   Doğrudan: [https://github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens)
3. **Token name:** örneğin `halis-admin`.
4. **Expiration:** 90 gün veya ihtiyacına göre. Süresi bitince paneli açamazsın; yeni jeton üretmen gerekir.
5. **Resource owner:** `levoddos-png`.
6. **Repository access:** *Only select repositories* → yalnızca **`halis-xr9ty4xzh1`**.
7. **Permissions → Repository permissions:**
   - **Contents:** **Read and write**
   - Metadata zaten zorunludur (Read-only).
   Başka izin verme.
8. **Generate token.** Jeton yalnızca bir kez gösterilir; kopyala ve paneldeki alana yapıştır.
9. İstersen “Bu cihazda hatırla”yı işaretle ve bir PIN belirle. Ortak cihazda hatırlatma, PIN koy.

Jeton çalındıysa veya gerekmezse GitHub’dan hemen iptal et (**Settings → Fine-grained tokens → Revoke**).

## Kayıt sonrası

“Kaydet ve yayınla” deyince `data/menu.json` ve varsa `img/products/<ürün-id>.webp` bu depoya işlenir. Canlı menünün güncellenmesi genelde 1–2 dakika sürer. Sayfayı yenilerken tarayıcı önbelleğini de temizlemen gerekebilir.

Şema: depodaki `data/SCHEMA.md`.
