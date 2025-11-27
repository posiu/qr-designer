# TODO – QR Designer

Lista planowanych zadań w kolejności realizacji.

## 🔥 Wysoki priorytet

- [x] ~~Migracja do `qr-code-styling` w celu obsługi:~~
  - [x] ~~rounded dots~~
  - [x] ~~stylowanych rogów~~
  - [x] ~~gradientów~~
- [x] ~~Komponent SettingsPanel (Refactor App.tsx)~~
- [x] ~~Komponent GalleryPanel~~
- [x] ~~Drag & drop logo (dowolna pozycja)~~
- [x] ~~Zaawansowane presety (gradienty, neon, monochrome)~~

## 🧩 Średni priorytet

- [x] ~~Eksport konfiguracji do pliku JSON~~
- [x] ~~Import presetów z JSON~~
- [x] ~~Automatyczne testy QR (czy kod działa i jest skanowalny)~~
- [x] ~~Tryb ciemny UI~~
- [x] ~~Optymalizacja generowania SVG~~

## 🎨 Niski priorytet

- [ ] Animowane QR (GIF/WebM)
- [ ] Własne kształty modułów
- [ ] Integracja z API shorten.link (shortener)
- [ ] Tryb "brand kit": zapis wielu logo + kolorów

## ✅ Ukończone w tej sesji

### Opcja A - Refaktoryzacja architektury
- [x] Refaktoryzacja App.tsx - wydzielenie komponentów
- [x] Implementacja obsługi Wi-Fi QR codes
- [x] Dodanie eksportu SVG
- [x] Lokalna galeria z localStorage (50 elementów)
- [x] Web Share API
- [x] Obsługa różnych typów danych (URL, Text, Wi-Fi)

### Opcja B - Migracja do qr-code-styling
- [x] Instalacja i konfiguracja qr-code-styling
- [x] Utworzenie AdvancedQrGenerator z pełnym API
- [x] Implementacja 6 typów zaokrąglonych kropek
- [x] Obsługa gradientów (linear i radial)
- [x] Stylizacja rogów (corner squares i dots)
- [x] 5 predefiniowanych presetów gradientowych
- [x] Tryb przełączania między prostym a zaawansowanym generatorem

### Opcja C - Pozostałe funkcje z TODO
- [x] Drag & drop positioning dla logo z interaktywnymi handlami
- [x] Tryb ciemny z automatyczną detekcją preferencji systemu
- [x] Mobile responsiveness z optymalizacją layoutu
- [x] System walidacji z inteligentnym sprawdzaniem danych
- [x] Error handling z ErrorBoundary i notyfikacjami
- [x] System notyfikacji z 4 typami (success, error, warning, info)

## 🛠 Zadania systemowe

- [x] ~~Aktualizacja README po każdym etapie~~
- [ ] Commit + push po każdej większej funkcji
- [ ] Utrzymanie zgodności README ↔ kod
