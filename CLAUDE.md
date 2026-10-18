# CLAUDE.md — AI Developer & Content Management Guide

> **Context for Claude, Cursor, ChatGPT, and AI Coding Assistants**
> This repository is the production platform for **Z99 Creative Studio** (Architectural 3D Projection Mapping, Stadium Concerts, Brand Activations, and Luxury Weddings).
> Follow these instructions strictly when modifying code, creating new case studies, or updating content.

---

## 🏗️ Project Architecture

```
Z99/
├── public/                     # PRODUCTION OUTPUT DIRECTORY (Vercel serves from here)
│   ├── assets/                 # Web assets (logos, icons, moodboards, project visuals)
│   │   └── projects/           # Project gallery imagery organized by slug
│   ├── projects/               # CASE STUDIES & PORTFOLIO HUB
│   │   ├── index.html          # Master Portfolio Gallery Hub (/projects)
│   │   ├── project-template.html # Blueprint for creating new case studies
│   │   └── project-*.html      # 13 Individual deep-dive case studies
│   ├── index.html              # Main Homepage & Hero Showreel
│   ├── brand-activations.html  # Discipline Hub: Brand Activations
│   ├── projection-mapping.html # Discipline Hub: 3D Projection Mapping
│   ├── stadium-concerts.html   # Discipline Hub: Arena & Stadium Shows
│   ├── luxury-weddings.html    # Discipline Hub: Luxury Immersive Weddings
│   ├── presentation.html       # Interactive 16:9 Fullscreen Client Pitch Deck
│   ├── privacy.html & terms.html # Legal & compliance pages
│   ├── 404.html                # Custom 404 Error Page
│   ├── styles.css              # Central Cyber-Luxury Design System
│   ├── main.js                 # Core Interactive Engine (modals, filter, drawer, touch)
│   ├── presentation.js         # Pitch deck keyboard/touch controller
│   ├── .htaccess               # Apache / Hostinger fallback config
│   ├── robots.txt              # Crawler permissions
│   └── sitemap.xml             # Search engine indexing manifest
│
├── vercel.json                 # Vercel Deployment Config (outputDirectory: "public")
├── README.md                   # Executive project overview
└── CLAUDE.md                   # This file (AI instructions)
```

---

## 🎨 Design System & Visual Tokens

The platform uses a bespoke **Monolithic Cyber-Luxury Scenography** design system defined in `public/styles.css`. Never use Tailwind or external CSS frameworks.

### Color Tokens
- **Void Black (Canvas)**: `#030303` (`--void-black`)
- **Obsidian Dark (Cards)**: `#0a0a0a` (`--obsidian`)
- **Acid Lime (Accent)**: `#d7ff3f` (`--acid`)
- **Neon Cyan (Secondary Accent)**: `#00f0ff` (`--neon-cyan`)
- **Pure White (Headings)**: `#ffffff`
- **Muted Gray (Body copy)**: `#888888` / `#a0a0a0`
- **Graphite (Borders)**: `#1a1a1a` (`--graphite`)

### Typography
- **Headings & Technical Tags**: `'Space Grotesk', sans-serif`
- **Editorial Copy**: `'Inter', sans-serif`

### Common UI Components
- **Section Label**: `<span class="section-tag">// 01. SECTION NAME</span>`
- **Primary Button**: `<a href="..." class="btn btn-primary">Button Text</a>`
- **Secondary Button**: `<a href="..." class="btn btn-secondary">Button Text</a>`
- **Filter Pills**: `<button class="category-pill active" data-filter="all">All</button>`

---

## 📝 How to Add a New Case Study (Step-by-Step for AI)

Follow these exact steps when asked to add a new project:

### Step 1: Duplicate the Template
Copy `public/projects/project-template.html` and name it:
`public/projects/project-[slug].html` *(e.g., `project-red-sea.html`)*.

### Step 2: Add Project Imagery
Place images in `public/assets/projects/[slug]/` (prefer `.webp` or compressed `.jpg`).

### Step 3: Populate Content in `public/projects/project-[slug].html`
- Update `<title>` and `<meta name="description">`.
- Update hero title, category badge, and metadata cards (Client, Location, Surface Area, Lumens).
- Update the Challenge, Solution, and Execution paragraphs.
- Update the Moodboard / Gallery grid with your image paths (`../assets/projects/[slug]/1.webp`).
- **CRITICAL PATH RULE**: Because this file is inside `public/projects/`, all relative paths MUST have `../`:
  - Stylesheet: `<link rel="stylesheet" href="../styles.css?v=14">`
  - Scripts: `<script src="../main.js?v=14"></script>`
  - Assets: `<img src="../assets/..." />`
  - Links to root pages: `href="../index.html"`, `href="../luxury-weddings.html"`, etc.
  - Links to portfolio: `href="index.html"` (points to `public/projects/index.html`).
  - Sibling case studies: `href="project-byd.html"` (no `../` needed between siblings).

### Step 4: Register in the Master Portfolio (`public/projects/index.html`)
Add a new project card into the `.projects-grid`:
```html
<div class="project-card" data-category="projection-mapping">
  <div class="project-card-media">
    <img src="../assets/projects/[slug]/hero.webp" alt="Project Title" loading="lazy">
    <span class="project-badge">3D PROJECTION MAPPING</span>
  </div>
  <div class="project-card-body">
    <span class="project-location">Location, Country</span>
    <h3 class="project-title">Project Name</h3>
    <p class="project-desc">Short summary of the project.</p>
    <a href="project-[slug].html" class="btn btn-secondary btn-sm">Explore Case Study →</a>
  </div>
</div>
```
Valid categories for `data-category`:
- `projection-mapping`
- `brand-activations`
- `stadium-concerts`
- `luxury-weddings`

### Step 5: (Optional) Add to Category Hub Page
If relevant, add a card to the corresponding discipline page (`public/projection-mapping.html`, `brand-activations.html`, `stadium-concerts.html`, or `luxury-weddings.html`). Remember in root pages, the link is `href="projects/project-[slug].html"`.

### Step 6: Update `public/sitemap.xml`
Add the new URL:
```xml
<url>
  <loc>https://z9-creative-studio.vercel.app/projects/project-[slug]</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## ⚠️ Critical Rules for AI (What NOT to Do)

1. **DO NOT move files out of `public/`**: Vercel is configured with `"outputDirectory": "public"`. Moving HTML files to the root will break the deployment.
2. **DO NOT remove `.htaccess` or `vercel.json`**: These contain strict Grade A+ security headers and URL rewrites.
3. **DO NOT add external bloated libraries**: The site runs on vanilla JS + CSS for maximum performance (sub-second load times). Keep it lean.
4. **DO NOT hardcode full localhost paths**: Always use relative paths (`../` when inside `projects/`, `./` or direct names when in `public/`).
5. **Videos**: Always embed via YouTube iframe inside `.cinema-video-wrapper` rather than storing huge `.mp4` files in the repository.
