# TODO – QR Designer

List of planned tasks in order of implementation.

## 🔥 High Priority

- [x] ~~Migration to `qr-code-styling` for support of:~~
  - [x] ~~rounded dots~~
  - [x] ~~styled corners~~
  - [x] ~~gradients~~
- [x] ~~SettingsPanel component (Refactor App.tsx)~~
- [x] ~~GalleryPanel component~~
- [x] ~~Drag & drop logo (any position)~~
- [x] ~~Advanced presets (gradients, neon, monochrome)~~

## 🧩 Medium Priority

- [x] ~~Export configuration to JSON file~~
- [x] ~~Import presets from JSON~~
- [x] ~~Automatic QR tests (check if code works and is scannable)~~
- [x] ~~Dark mode UI~~
- [x] ~~SVG generation optimization~~

## 🎨 Low Priority

- [ ] Animated QR (GIF/WebM)
- [ ] Custom module shapes
- [ ] Integration with shorten.link API (shortener)
- [ ] "Brand kit" mode: save multiple logos + colors

## ✅ Completed in this session

### Option A - Architecture refactoring
- [x] App.tsx refactoring - component extraction
- [x] Wi-Fi QR codes implementation
- [x] SVG export addition
- [x] Local gallery with localStorage (50 items)
- [x] Web Share API
- [x] Support for different data types (URL, Text, Wi-Fi)

### Option B - Migration to qr-code-styling
- [x] Installation and configuration of qr-code-styling
- [x] AdvancedQrGenerator creation with full API
- [x] Implementation of 6 rounded dot types
- [x] Gradient support (linear and radial)
- [x] Corner styling (corner squares and dots)
- [x] 5 predefined gradient presets
- [x] Toggle mode between simple and advanced generator

### Option C - Remaining TODO features
- [x] Drag & drop positioning for logo with interactive handles
- [x] Dark mode with automatic system preference detection
- [x] Mobile responsiveness with layout optimization
- [x] Validation system with intelligent data checking
- [x] Error handling with ErrorBoundary and notifications
- [x] Notification system with 4 types (success, error, warning, info)

## 🛠 System Tasks

- [x] ~~README update after each stage~~
- [ ] Commit + push after each major feature
- [ ] Maintain README ↔ code consistency
