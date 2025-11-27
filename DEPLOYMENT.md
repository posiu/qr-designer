# 🚀 Deployment Guide - QR Designer

## Best Free Hosting Options

### 1. 🥇 **Vercel** (RECOMMENDED)
**Why it's the best:**
- ✅ Free plan: unlimited projects
- ✅ Automatic deployment from GitHub
- ✅ Custom domain: `your-name.vercel.app`
- ✅ Very fast CDN
- ✅ Zero configuration for React/Vite

**Instructions:**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select `qr-designer` repository
5. Vercel will automatically detect Vite and configure the build
6. Click "Deploy"

**Done!** The application will be available at `https://qr-designer-[random].vercel.app`

---

### 2. 🥈 **Netlify**
**Advantages:**
- ✅ Free plan: 100GB bandwidth/month
- ✅ Drag & drop deployment or GitHub integration
- ✅ Custom domain: `your-name.netlify.app`
- ✅ Contact form (if needed)

**Instructions:**
1. Build the project: `npm run build`
2. Go to https://netlify.com
3. Drag the `dist` folder onto the page
4. Or connect with GitHub for auto-deployment

---

### 3. 🥉 **GitHub Pages**
**Advantages:**
- ✅ Completely free
- ✅ GitHub integration
- ✅ Domain: `username.github.io/qr-designer`

**Instructions:**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://username.github.io/qr-designer"
}
```
3. Run: `npm run deploy`

---

### 4. **Firebase Hosting**
**Advantages:**
- ✅ Google infrastructure
- ✅ Very fast
- ✅ Domain: `project-id.web.app`

**Instructions:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. `firebase login`
3. `firebase init hosting`
4. Select `dist` folder
5. `npm run build && firebase deploy`

---

## 🎯 RECOMMENDATION: Vercel

**Why Vercel:**
1. **Easiest** - zero configuration
2. **Fastest** - deployment in 30 seconds
3. **Automatic** - every push = new deployment
4. **Professional** - used by the biggest companies
5. **Analytics** - traffic statistics for free

## 📋 Steps for Vercel:

### Step 1: Preparation
```bash
# Make sure the project builds
npm run build

# Check if everything works locally
npm run preview
```

### Step 2: GitHub
1. Create a repository on GitHub (if you don't have one yet)
2. Push code:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Vercel
1. Go to https://vercel.com
2. "Sign up" with GitHub
3. "New Project"
4. "Import" your repository
5. Vercel will automatically detect:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

### Step 4: Done! 🎉
- The application will be available at a unique URL
- Every push to GitHub = automatic redeploy
- You can add your own domain in settings

## 🔧 Configuration for Vite

If you plan to use your own domain, add to `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // for your own domain
  // base: '/qr-designer/', // for GitHub Pages
})
```

## 🌐 After deployment

Your application will be available 24/7 at addresses like:
- Vercel: `https://qr-designer-abc123.vercel.app`
- Netlify: `https://amazing-name-123456.netlify.app`
- GitHub Pages: `https://username.github.io/qr-designer`

**Everything works offline** - users can use the application without internet after the first load!
