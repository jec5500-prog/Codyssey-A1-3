# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16, React 19, Tailwind CSS, Google Gemini AI (`@google/genai`), Supabase (`@supabase/supabase-js`), Leaflet (`react-leaflet`)

## Users

Retail designers, Visual Merchandisers (VMD), spatial designers, branding/store planners, and design trend analysts.

## Product Purpose

SPOT is an AI-powered global spatial design intelligence platform for capturing spatial design data from field photos, extracting multimodal AI insights, and exploring/comparing location-based design spot records worldwide.

## Positioning

AI-assisted automated spatial attribute extraction (colors, materials, lighting, style, composition) combined with EXIF GPS mapping, comparative spatial analysis across regions/categories, and trend dashboarding tailored for spatial and retail design professionals.

## Operating Context

Field photo capture (mobile camera/upload), spatial design research, competitor store analysis, spatial trend reporting, and location-based spot discovery.

## Capabilities and Constraints

- Photo upload & camera capture with EXIF location/timestamp auto-extraction
- Multimodal AI analysis (Gemini AI with fallback mock engine) for extracting HEX colors, materials, lighting, style, composition, key objects, and confidence score
- Explore view with filtering, search, verification state, and sorting
- Compare view for side-by-side regional or categorical design element comparison
- Insight dashboard (requires min 2 verified spots)
- Map view (Leaflet / Mapbox integration)
- Saved spots & user profile management
- Technical constraint: Supabase DB/Auth/Storage integration, Vercel deployment

## Brand Commitments

Name: SPOT (Global Spatial Design Intelligence)
Deployed URL: https://real-time-visaul-sharing.vercel.app/

## Evidence on Hand

- Codebase in `src/`
- Documentation: `README.md`, `SERVICE_PLAN.md`, `DELIVERY_PLAN.md`
- Working API integrations: Gemini AI, Supabase, Leaflet

## Product Principles

1. Frictionless Field Capture: Auto-extract EXIF spatial metadata and offer fallback manual pin placement.
2. Production Reliability: Graceful degradation to mock analysis when API key/calls fail, keeping UX seamless.
3. Actionable Spatial Insights: Focus on structured, comparative design parameters (materials, lighting, HEX color palettes) over generic tags.

## Accessibility & Inclusion

Responsive web interface optimized for mobile field capture and desktop analytical workflows.
