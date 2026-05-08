# Kundli Page UI Redesign — Sacred / Temple Theme

**Date:** 2026-05-08  
**Status:** Approved

## Overview

Redesign the `/kundli` page from its current plain minimal style to a rich **Sacred / Temple** aesthetic: deep burgundy backgrounds, gold (#c9a84c) accents, ornate borders, serif typography, and ceremonial details. Layout stays as a **fixed sidebar** (form on the left, chart on the right).

## Visual Language

| Token | Value |
|---|---|
| Background (page) | `#0d0500` (near-black burgundy) |
| Background (sidebar) | `rgba(201,168,76,0.03)` |
| Background (inputs) | `rgba(255,255,255,0.03)` |
| Gold primary | `#c9a84c` |
| Gold bright | `#f0d080` (lagna highlight) |
| Text primary | `#e8d5a0` |
| Text muted | `rgba(201,168,76,0.5)` |
| Border | `rgba(201,168,76,0.2–0.4)` |
| Error/retrograde | `#e07050` |
| Exalted/own sign | `#80d080` |
| Font | Georgia / serif (body), Cinzel (headings via CSS var already in project) |

## Components to Restyle

### 1. `app/kundli/page.tsx` — Page Header
- Background: `linear-gradient(90deg, #1a0800, #3d1000, #1a0800)`
- Bottom border: shimmering gold line (`linear-gradient` transparent → gold → transparent)
- Left: `← Home` back link (routes to `/`)
- Center: `✦ FREE KUNDLI GENERATOR ✦` in Cinzel, gold; subtitle in muted gold
- Right: email + Sign out / Sign in button with gold border

### 2. `components/KundliPageClient.tsx` — Page body background
- Change `bg-[#fffaf5]` → `bg-[#0d0500]`
- Sidebar border: `border-[rgba(201,168,76,0.2)]`
- Main area: dark background

### 3. `components/BirthDetailsForm.tsx` — Sidebar form
- Sidebar background: `rgba(201,168,76,0.03)`
- Section title: `— BIRTH DETAILS —` centered, gold, letter-spaced
- Labels: gold muted, all-caps, tracked
- Inputs: dark fill, gold border (`rgba(201,168,76,0.25)`), gold text, gold placeholder
- Generate button: gold gradient (`#8b1a00 → #c9a84c → #8b1a00`), dark text, `✦` ornaments on each side

### 4. `components/KundliChart.tsx` — North Indian chart
- Chart wrapper: dark background, gold border, inner glow (`box-shadow: 0 0 20px rgba(201,168,76,0.08)`)
- Diagonal lines: gold at 40% opacity
- House labels: gold text
- Lagna sign: brighter gold (`#f0d080`)
- Section title: `— BIRTH CHART (LAGNA) —` in small caps gold
- Ornamental divider below: `✦ ✦ ✦` in muted gold

### 5. `components/PlanetTable.tsx` — Planet positions table
- Table headers: muted gold, letter-spaced
- Table rows: gold text, dark hover state
- Retrograde symbol `℞`: red-orange `#e07050`
- Exalted / own sign: green `#80d080`
- Debilitated: red-orange `#e07050`
- Row dividers: `rgba(201,168,76,0.08)`

### 6. `components/KundliPageClient.tsx` — Save bar & misc
- Save Chart button: transparent fill, gold border, gold text
- "Save to unlock" hint: italic muted gold
- All section titles: `— TITLE —` format, 8px, letter-spacing 3px, gold, with bottom border

### 7. `components/InterpretationPanel.tsx` — AI interpretation
- Container: dark fill, gold border
- Topic tabs: gold border, muted gold text; active tab has `rgba(201,168,76,0.1)` fill
- Body text: muted gold, italic, generous line-height (1.8)

## Navigation
- Add `← Home` link in page header that routes to `/`
- No global Navbar on the kundli page (keep its own standalone header)

## Out of Scope
- No layout changes (sidebar stays fixed)
- No logic changes — styling only
- No mobile-specific redesign in this iteration

## Files to Edit
1. `app/kundli/page.tsx`
2. `app/kundli/components/KundliPageClient.tsx`
3. `app/kundli/components/BirthDetailsForm.tsx`
4. `app/kundli/components/KundliChart.tsx`
5. `app/kundli/components/PlanetTable.tsx`
6. `app/kundli/components/InterpretationPanel.tsx`
7. `app/kundli/components/AuthButton.tsx`
