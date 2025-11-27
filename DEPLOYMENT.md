# 🚀 Deployment Guide - QR Designer

## Najlepsze darmowe opcje hostingu

### 1. 🥇 **Vercel** (REKOMENDOWANE)
**Dlaczego najlepsze:**
- ✅ Darmowy plan: unlimited projekty
- ✅ Automatyczny deployment z GitHub
- ✅ Własna domena: `twoja-nazwa.vercel.app`
- ✅ Bardzo szybkie CDN
- ✅ Zero konfiguracji dla React/Vite

**Instrukcja:**
1. Idź na https://vercel.com
2. Zaloguj się przez GitHub
3. Kliknij "New Project"
4. Wybierz repository `qr-designer`
5. Vercel automatycznie wykryje Vite i skonfiguruje build
6. Kliknij "Deploy"

**Gotowe!** Aplikacja będzie dostępna pod `https://qr-designer-[random].vercel.app`

---

### 2. 🥈 **Netlify**
**Zalety:**
- ✅ Darmowy plan: 100GB bandwidth/miesiąc
- ✅ Drag & drop deployment lub GitHub integration
- ✅ Własna domena: `twoja-nazwa.netlify.app`
- ✅ Formularz kontaktowy (jeśli potrzebne)

**Instrukcja:**
1. Zbuduj projekt: `npm run build`
2. Idź na https://netlify.com
3. Przeciągnij folder `dist` na stronę
4. Lub połącz z GitHub dla auto-deployment

---

### 3. 🥉 **GitHub Pages**
**Zalety:**
- ✅ Całkowicie darmowe
- ✅ Integracja z GitHub
- ✅ Domena: `username.github.io/qr-designer`

**Instrukcja:**
1. Zainstaluj gh-pages: `npm install --save-dev gh-pages`
2. Dodaj do package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://username.github.io/qr-designer"
}
```
3. Uruchom: `npm run deploy`

---

### 4. **Firebase Hosting**
**Zalety:**
- ✅ Google infrastructure
- ✅ Bardzo szybkie
- ✅ Domena: `project-id.web.app`

**Instrukcja:**
1. Zainstaluj Firebase CLI: `npm install -g firebase-tools`
2. `firebase login`
3. `firebase init hosting`
4. Wybierz folder `dist`
5. `npm run build && firebase deploy`

---

## 🎯 REKOMENDACJA: Vercel

**Dlaczego Vercel:**
1. **Najłatwiejszy** - zero konfiguracji
2. **Najszybszy** - deployment w 30 sekund
3. **Automatyczny** - każdy push = nowy deployment
4. **Profesjonalny** - używają go największe firmy
5. **Analytics** - statystyki ruchu za darmo

## 📋 Kroki dla Vercel:

### Krok 1: Przygotowanie
```bash
# Upewnij się że projekt się buduje
npm run build

# Sprawdź czy wszystko działa lokalnie
npm run preview
```

### Krok 2: GitHub
1. Stwórz repository na GitHub (jeśli jeszcze nie masz)
2. Push kod:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Krok 3: Vercel
1. Idź na https://vercel.com
2. "Sign up" przez GitHub
3. "New Project"
4. "Import" twoje repository
5. Vercel automatycznie wykryje:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Kliknij "Deploy"

### Krok 4: Gotowe! 🎉
- Aplikacja będzie dostępna pod unikalnym URL
- Każdy push na GitHub = automatyczny redeploy
- Możesz dodać własną domenę w ustawieniach

## 🔧 Konfiguracja dla Vite

Jeśli planujesz używać własnej domeny, dodaj do `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // dla własnej domeny
  // base: '/qr-designer/', // dla GitHub Pages
})
```

## 🌐 Po deployment

Twoja aplikacja będzie dostępna 24/7 pod adresem typu:
- Vercel: `https://qr-designer-abc123.vercel.app`
- Netlify: `https://amazing-name-123456.netlify.app`
- GitHub Pages: `https://username.github.io/qr-designer`

**Wszystko działa offline** - użytkownicy mogą używać aplikacji bez internetu po pierwszym załadowaniu!
