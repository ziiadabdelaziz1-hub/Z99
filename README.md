# Z99 Creative Studio — Production Repository

Monolithic cyber-scenography, architectural 3D projection mapping, and immersive visual engineering platform.

---

## 📁 Repository & Delivery Architecture

```
Z99/
├── public/                 # Production Web Platform (Vercel Output Directory)
│   ├── assets/             # Optimized WebP graphics, brand assets, vector logos
│   ├── projects/           # Master Portfolio Gallery & 13 Deep-Dive Case Studies
│   │   ├── index.html      # Portfolio Index Hub
│   │   └── project-*.html  # Individual Case Studies
│   ├── index.html          # Official Homepage & High-Impact Showreel
│   ├── brand-activations.html
│   ├── projection-mapping.html
│   ├── stadium-concerts.html
│   ├── luxury-weddings.html
│   ├── privacy.html & terms.html
│   ├── presentation.html   # Fullscreen Interactive Client Pitch Deck
│   ├── 404.html            # Custom Interactive Scenography 404
│   ├── styles.css          # Design tokens & cyber-luxury design system
│   ├── main.js             # GSAP timeline animations, mobile touch, prefetch
│   ├── presentation.js     # Deck navigation, keyboard, and touch controller
│   ├── .htaccess           # Apache / Hostinger Fallback Config (Grade A+ Security)
│   ├── robots.txt          # Web crawler rules
│   └── sitemap.xml         # Search engine index
│
├── vercel.json             # Vercel Deployment & Security Manifest (outputDirectory: "public")
├── .gitignore              # Repository safety rules
├── .vercelignore           # Deployment exclusion rules
├── .gitattributes          # Git line-ending normalization
│
└── _vault/                 # Local Studio Archive & Tools (Git-Ignored)
    ├── 01_raw_masters/     # Raw 3D wireframes, laser scans, and high-res photography
    ├── 02_marketing_distribution/
    │   └── UPLOAD_GUIDE.md # Official YouTube titles, tags, descriptions, and video links
    ├── 03_client_references/ # Client feedback archives & visual review pages
    └── 04_build_tools/     # Python optimization & path validation utilities
```

---

## 🚀 Deployment

- **Hosting Platform**: Vercel (Production URL: `https://z9-creative-studio.vercel.app/`)
- **Root Directory**: `.`
- **Output Directory**: `public`
- **Clean URLs**: Enabled (`/projects`, `/luxury-weddings`, etc.)
- **Security Rating**: Grade A+ (Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options)

---

## 🎬 Video Assets
All video media is hosted and streamed in full resolution via **YouTube**:
- Complete video URLs, tags, timestamps, and upload metadata are documented in `_vault/02_marketing_distribution/UPLOAD_GUIDE.md`.
