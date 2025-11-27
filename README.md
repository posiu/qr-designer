# QR Designer – Advanced Visual QR Generator

QR Designer is a modern browser-based web application (React + TypeScript + Vite + Tailwind CSS) for generating visually enhanced QR codes.  
It supports multiple QR data types, custom colors, themes, rounded corners, optional logos, PNG/SVG export, embed code generation, and a built-in local gallery.

The entire project runs fully client-side (no backend).  
It is optimized for development inside **Cursor** with seamless Git/GitHub integration.

---

## 🚀 Project Goals

- Create a **free**, aesthetically pleasing QR generator.
- Enable full customization of QR style (colors, rounded corners, logo, presets).
- Support multiple QR types:
  - URL  
  - Plain text  
  - Wi-Fi 
- Allow download in **PNG** and **SVG** formats.
- Provide **embed code** (`<img src="...">`) for websites.
- Store generated QR codes in a **local gallery** using localStorage.
- Make the project easy to modify and extend in Cursor using AI.
- Prepare the structure for advanced future features (rounded dots, gradients, presets, brand kits, etc.).

---

## 🧠 Core Technical Assumptions

- 100% browser-based application (no backend).
- Must run offline after initial load.
- Tailwind CSS v4 for styling.
- React + TypeScript + Vite = fast, modern, scalable stack.
- QR generation based on:
  - Canvas API (PNG)
  - `qrcode` library (PNG & SVG)
- Files and architecture should be simple and modular.
- README serves as the main documentation for Cursor AI.

---

## 🧰 Technology Stack

### Frontend Framework
- **React 18**
- **TypeScript**
- **Vite**

### Styling
- **Tailwind CSS v4**
- Custom canvas clipping for rounded corners

### QR Generation
- **qrcode** (for PNG + SVG output)

### Browser APIs
- Canvas API  
- LocalStorage  
- FileReader  
- Web Share API  
- Clipboard API  

### Tooling
- **Cursor** – main IDE  
- **Git & GitHub** – version control  
- **Vercel** (recommended) or Netlify – hosting

---

## ✨ Current Features

### ✔ QR Data Types
- URL  
- Plain text  
- Wi-Fi (WPA, WEP, open networks)

### ✔ Appearance Customization
- Foreground & background colors
- Size slider (256–1024 px)
- Logo upload (PNG/JPG/SVG)
- Logo positions:
  - center  
  - top-left  
  - top-right  
  - bottom-left  
  - bottom-right  
- Automatic white rounded background behind the logo
- Rounded QR **outer corners** (canvas clipping)
- Preset themes:
  - Classic
  - Midnight
  - Sunset
  - Aqua

### ✔ Export Options
- Download **PNG**
- Download **SVG**
- Copy HTML embed code `<img src="data:image/png;base64,...">`
- Share via Web Share API (on supported devices)

### ✔ Local Gallery
- Automatically saves last 50 generated QR codes
- Thumbnail previews
- Click to restore QR to preview panel

---

## 🎯 Roadmap (Planned Features)

- Real **rounded QR dots**  
  (via migration to `qr-code-styling`)
- Gradient themes
- Drag-and-drop logo repositioning
- Saving/exporting QR style as JSON
- Importing style presets
- QR scannability/validation checks
- Dark mode UI
- Mobile-optimized layout
- Dedicated SettingsPanel and GalleryPanel components
- Brand kits (custom colors, logos)
- Animated QR (GIF/WebM)
- Integration with a link shortener API
- Built-in accessibility improvements

---

## 🏗 Project Architecture

qr-designer/
├── src/
│ ├── components/
│ │ └── QrCanvas.tsx # Renders QR to canvas with rounded corners + logo overlay
│ ├── lib/
│ │ └── generateQr.ts # PNG + SVG generation helpers
│ ├── App.tsx # Main UI, forms, export, gallery, presets
│ ├── index.css # Tailwind v4 setup
│ ├── main.tsx # React app bootstrap
│
├── public/
│
├── README.md
├── TODO.md
├── package.json
├── vite.config.ts
└── tsconfig.json

---

## 🔧 Local Development

### Install dependencies
```bash
npm install

### Run development server
npm run dev

### App loads at
http://localhost:5173

---

## 🏗 Production Build
npm run build
npm run preview

### Build output is stored in
dist/

---

## 🌐 Deployment (Recommended: Vercel)
- Connect your GitHub account to Vercel
- Import repository: posiu/qr-designer
- Configure:
  - Build command: npm run build
  - Output directory: dist
- Deploy

Every git push to the main branch triggers an automatic redeploy.

---

## 🔧 Git/GitHub Workflow
### Initialize repository (done once)
git init

### Standard commit workflowgit 
add .
git commit -m "Short description of changes"
git push

### Recommended commit naming
- feat: add Wi-Fi support
- feat: add SVG export
- feat: add gallery
- feat: add color presets
- fix: prevent crash when sharing
- refactor: extract QR generator logic
- style: improve Tailwind classes
- docs: update README
- chore: update dependencies

### Project Rule
- Always update README.md before pushing major updates to GitHub.
- README must always reflect the current state of the project, because Cursor AI relies heavily on it.

---

##🧑‍💻 Working with Cursor
- README.md and TODO.md serve as the source of truth for Cursor AI.
- After adding new features or refactoring → update README first.
- Use explicit instructions when asking Cursor AI, for example:
  - "Extract export section in App.tsx into a separate component ExportPanel."
  - "Refactor QrCanvas to support rounded dots using qr-code-styling while keeping all existing features."
- After each significant change:
  - Update README
  - Commit
  - Push

### AI Tips for Cursor
- Keep file structure synchronized with README.
- Keep variable/feature names clear and consistent.
- Use small, frequent commits for best assistance.

---

## 📋 Backlog / TODO
- A full backlog is maintained in TODO.md.
- It contains all planned tasks, grouped by priority.

---

## 📜 License
- MIT License — free for private and commercial use.

---

## 👤 Author
GitHub: https://github.com/posiu
This project is developed as a personal tool and a learning playground for frontend engineering.