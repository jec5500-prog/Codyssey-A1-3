---
name: SPOT Design System
description: Global Spatial Design Intelligence — Dark Gray & Neon Orange Edition
colors:
  primary: "#f97316"
  primary-light: "#fdba74"
  primary-dark: "#9a3412"
  neutral-bg: "#121214"
  surface-card: "#18181b"
  surface-muted: "#27272a"
  text-main: "#f4f4f5"
  text-muted: "#a1a1aa"
  border-default: "#27272a"
  border-active: "#f97316"
typography:
  display:
    fontFamily: "var(--font-sans, system-ui, sans-serif)"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: "1.2"
  headline:
    fontFamily: "var(--font-sans, system-ui, sans-serif)"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: "1.3"
  title:
    fontFamily: "var(--font-sans, system-ui, sans-serif)"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.4"
  body:
    fontFamily: "var(--font-sans, system-ui, sans-serif)"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5"
  label:
    fontFamily: "var(--font-mono, monospace)"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1"
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  card-spot:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.xl}"
    padding: "0px"
---

# Design System: SPOT Global Spatial Design Intelligence

## Overview

**Creative North Star: "The Spatial Design Radar"**

SPOT is a high-contrast dark field intelligence platform designed for spatial design researchers, visual merchandisers, and store planners. The visual identity evokes a modern tactical radar HUD: deep graphite and dark zinc surfaces form an unobtrusive stage for vibrant spatial imagery, punctuated by electric neon orange telemetry accents (`#f97316`) that highlight key AI insights and location data.

The system prioritizes high-density data legibility in mobile field conditions as well as desktop analysis mode. Crisp glassmorphism, subtle micro-borders, and tactile action triggers ensure the interface feels precise, responsive, and authoritative.

**Key Characteristics:**
- Deep zinc dark theme (`#121214`) minimizing visual fatigue during field research
- Tactical neon orange accents (`#f97316`) reserved strictly for high-priority telemetry and primary actions
- Glassmorphic overlay cards (`backdrop-blur-md` with semi-transparent borders)
- Dual typography pairing clean sans-serif UI type with monospace telemetry data labels

## Colors

The SPOT palette uses a dark zinc foundation with high-visibility neon telemetry accents.

### Primary
- **Neon Telemetry Orange** (`#f97316` / `rgb(249, 115, 22)`): Primary actions, active navigation states, radar pin highlights, and critical CTA triggers.
- **Orange Highlight** (`#fdba74`): Subtle text accents, badge highlights, and active micro-indicators.
- **Orange Deep** (`#9a3412`): Hover state for primary buttons, telemetry border accents, and shadow glows.

### Neutral
- **Deep Void Background** (`#121214`): Full canvas background setting a high-contrast dark environment.
- **Zinc Surface Card** (`#18181b`): Elevated container background for cards, modals, and panel sections.
- **Zinc Surface Muted** (`#27272a`): Secondary container fills, input fields, scrollbar thumbs, and hover surfaces.
- **Pure White Main Text** (`#f4f4f5`): High-contrast primary headlines, titles, and body content.
- **Zinc Muted Text** (`#a1a1aa`): Secondary descriptions, metadata captions, and inactive tab labels.

### Named Rules
**The Telemetry Rarity Rule.** Neon orange (`#f97316`) is used on ≤10% of any given screen area. Its high contrast ensures instant focus on key spatial insights.
**The Void Surface Rule.** Background containers must use dark zinc tones (`#121214` to `#18181b`); pure black (`#000000`) is never used for card surfaces.

## Typography

**Display Font:** System UI / Tailwind Sans (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
**Body Font:** System UI / Tailwind Sans
**Label/Mono Font:** Monospace (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New"`)

**Character:** Clean, functional sans-serif for reading structure paired with technical monospace labels for coordinates, timestamps, and metric scores.

### Hierarchy
- **Display** (Bold, `clamp(1.75rem, 4vw, 2.5rem)`, line-height 1.2): Main page headers and hero title banners.
- **Headline** (Bold, `1.25rem` / `20px`, line-height 1.3): Section titles, modal headers, and primary feature titles.
- **Title** (Semi-bold, `1rem` / `16px`, line-height 1.4): Card titles, brand names, and sub-headers.
- **Body** (Regular, `0.875rem` / `14px`, line-height 1.5): Standard descriptions, narrative text, and AI analysis reports.
- **Label** (Semi-bold Monospace, `0.75rem` / `12px`, letter-spacing `0.05em` uppercase): Category tags, GPS coordinates, timestamps, and confidence scores.

### Named Rules
**The Telemetry Label Rule.** Data attributes (GPS, timestamps, category tags, confidence scores) are strictly formatted in monospace font with uppercase tracking.

## Layout

SPOT uses a fluid grid layout with a max-width container (`max-w-7xl`, `1280px`) centered horizontally with responsive padding (`px-4 sm:px-6 lg:px-8`).

- **Grid Columns:** Responsive 1-column mobile layout scaling to 2-column tablet and 3/4-column desktop grid for spot cards.
- **Spacing Rhythm:** 8px base spacing scale (`8px`, `16px`, `24px`, `32px`).
- **Navigation Dock:** Sticky top navigation bar on desktop, switching to fixed bottom-docked touch navigation bar on mobile viewports.

## Elevation & Depth

SPOT relies on dark tonal surface layering paired with glassmorphism and subtle border glows rather than heavy drop shadows.

### Shadow Vocabulary
- **Card Rest State:** `shadow-xl` (`0 20px 25px -5px rgba(0, 0, 0, 0.5)`) with subtle `border-zinc-800/80` stroke.
- **Card Hover State:** `shadow-2xl shadow-orange-950/40` (`hover:border-orange-500/60`), creating a subtle warm accent glow on hover.
- **Glass Overlay:** `backdrop-blur-md bg-[#121214]/85 border border-zinc-800/60` for floating badges and sticky controls.

### Named Rules
**The Tactile Glow Rule.** Cards and interactive containers are flat at rest with subtle border strokes. Hover states elevate with an orange-tinted depth glow (`shadow-orange-950/40`).

## Shapes

- **Card Shells:** `rounded-2xl` (`16px`) corner radius for major content cards and modals.
- **Buttons & Inputs:** `rounded-xl` (`12px`) for primary touch targets.
- **Badges & Chips:** `rounded-lg` (`8px`) with semi-transparent borders.
- **Pills & Status Indicators:** `rounded-full` (`9999px`) for online indicators and category pills.

## Components

### Buttons
- **Shape:** Rounded corners (`12px` / `rounded-xl`).
- **Primary:** `bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition-all`.
- **Secondary:** `bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:text-white`.

### Spot Cards
- **Corner Style:** `rounded-2xl` (`16px`).
- **Background:** `#18181b` with `border border-zinc-800/80`.
- **Hover:** Translucent orange border (`border-orange-500/60`) and scale animation (`group-hover:scale-105`).
- **Overlay:** Bottom gradient fade (`from-[#121214] via-[#121214]/20 to-transparent`).

### Navigation Bar
- **Desktop:** Floating bar with glassmorphic backdrop (`bg-[#121214]/90 backdrop-blur-md border-b border-zinc-800/80`).
- **Active Tab:** `text-orange-400 font-semibold` with glowing indicator pill.

### Form Inputs & Filters
- **Style:** `bg-[#18181b] border border-zinc-700/80 text-zinc-100 rounded-xl px-4 py-2 focus:border-orange-500 focus:outline-none`.

## Do's and Don'ts

### Do:
- **Do** use `#f97316` (Neon Orange) for active states, primary triggers, and key spatial metrics.
- **Do** format technical metadata (coordinates, tags, timestamps) using monospace uppercase typography.
- **Do** apply `backdrop-blur-md` on floating control overlays and badges for legibility against image content.

### Don't:
- **Don't** use bright high-saturation background colors; keep canvases dark zinc (`#121214`).
- **Don't** overuse neon orange on body text or secondary components; keep accent density under 10%.
- **Don't** drop card borders completely; use `border-zinc-800/80` to preserve structural separation in dark mode.
