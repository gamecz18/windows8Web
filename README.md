# Windows 8 + Liquid Glass Landing Page

Moderní úvodní stránka kombinující ikonický Windows 8 Metro design s Apple liquid glass efektem (glassmorphism).

## ✨ Funkce

- **Windows 8 Metro Design**: Barevné dlaždice ve stylu Windows 8 s živými informacemi
- **Liquid Glass Effect**: Glassmorphism efekt s rozmazáním pozadí a průhledností
- **Animované pozadí**: Plynulé gradientní koule s parallax efektem
- **Interaktivní dlaždice**: Hover efekty, tilt animace a ripple efekt při kliknutí
- **Live Tiles**: Dynamicky aktualizované informace (čas, úkoly, statistiky)
- **Responzivní design**: Optimalizováno pro všechny velikosti obrazovek
- **Klávesnicová navigace**: Podpora Tab a Enter pro přístupnost
- **Optimalizace výkonu**: Automatické pozastavení animací při neaktivní záložce

## 🎨 Barevné schéma

Používá autentické Windows 8 Metro barvy:
- Modrá (#0078d4)
- Fialová (#8e44ad)
- Zelená (#00a300)
- Oranžová (#ff8c00)
- Červená (#e74c3c)
- Tyrkysová (#00aba9)
- Růžová (#e91e63)
- Žlutá (#ffc107)
- Indigo (#6a00ff)
- Azurová (#00bcd4)
- Limetková (#8bc34a)
- Jantarová (#ff9800)

## 🚀 Použití

1. Otevřete `index.html` v moderním webovém prohlížeči
2. Užijte si interaktivní prostředí

```bash
# Jednoduchý local server
python -m http.server 8000
# nebo
npx serve
```

Poté otevřete `http://localhost:8000` v prohlížeči.

## 📁 Struktura projektu

```
windows8Web/
├── index.html      # Hlavní HTML struktura
├── styles.css      # CSS styly s glassmorphism efekty
├── script.js       # JavaScript pro interakce a animace
└── README.md       # Dokumentace
```

## 🎯 Klíčové technologie

- **Glassmorphism**: backdrop-filter pro skleněný efekt
- **CSS Grid**: Responzivní rozložení dlaždicí
- **CSS Animations**: Plynulé animace a přechody
- **Vanilla JavaScript**: Bez závislostí, čistý JS
- **SVG ikony**: Vektorové ikony pro ostrý vzhled

## 🔧 Přizpůsobení

### Změna barev dlaždicí

V `styles.css` upravte CSS proměnné:

```css
:root {
    --metro-blue: #0078d4;
    --metro-purple: #8e44ad;
    /* ... další barvy */
}
```

### Přidání nové dlaždice

V `index.html` přidejte nový div s třídou `.tile`:

```html
<div class="tile medium glass-tile tile-blue">
    <div class="tile-content">
        <div class="icon">
            <!-- SVG ikona -->
        </div>
        <h2>Název dlaždice</h2>
        <div class="live-info">Informace</div>
    </div>
</div>
```

Velikosti dlaždicí:
- `small`: 1×1 (150px × 150px)
- `medium`: 2×1 (320px × 150px)
- `large`: 2×2 (320px × 320px)

## 🌐 Kompatibilita prohlížečů

- Chrome/Edge 76+
- Firefox 103+
- Safari 9+
- Opera 63+

Poznámka: `backdrop-filter` vyžaduje moderní prohlížeč.

## 📱 Responzivní breakpointy

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px
- Small Mobile: < 480px

## ⚡ Výkonnostní optimalizace

- Animace pozadí se pozastavují při neaktivní záložce
- Respektuje `prefers-reduced-motion` pro uživatele s citlivostí na pohyb
- Optimalizované CSS animace s `transform` a `opacity`
- Debounced event handlers pro lepší výkon

## 📄 Licence

Tento projekt je open-source a volně k použití.

## 🤝 Přispění

Návrhy na vylepšení a pull requesty jsou vítány!

---

Vytvořeno s ❤️ ve stylu Windows 8 a Apple
