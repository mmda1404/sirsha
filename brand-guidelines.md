# Meraki Media — Brand Guidelines
### Reference file for all UI, dashboard, document, and content creation

---

## Brand Essence

**Tagline:** "High-Tech with Soul"
**Core Idea:** Technology that feels warm, not cold. Where precision meets humanity.
**Tone:** Confident, warm, intelligent, intentional. Never sterile. Never cold.

---

## Logo Strategy

### Assets
- **Light Version:** [logo-light.png](file:///Users/michelle.anderson/Desktop/GravityClaw/assets/logo-light.png) (For use on dark/indigo backgrounds)
- **Dark Version:** [logo-dark.png](file:///Users/michelle.anderson/Desktop/GravityClaw/assets/logo-dark.png) (For use on light/cream backgrounds)

### Usage Rules
- **Mission Control Sidebar & Dark UI:** Use `logo-light.png`.
- **Invoices, Documents, & Lead Magnets:** Use `logo-dark.png` (on white/cream backgrounds).
- **Integrity:**
    - Never stretch, distort, or recolor the logo.
    - Always maintain clear space around the logo.

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|---|---|---|
| Deep Indigo | `#2C0B63` | Primary backgrounds, hero sections, dark UI surfaces |
| Vivid Violet | `#5C00FF` | Primary brand color, buttons, highlights, active states |

### Accent Colors
| Name | Hex | Usage |
|---|---|---|
| Gold | `#C9A84C` | Warm accents, premium elements, borders, icons |
| Cream | `#F5F0E8` | Light backgrounds, text on dark, warm neutral |
| Warm White | `#FAF8F5` | Cards, surfaces, clean space |

### Gradient
- **Primary Gradient:** Violet `#5C00FF` → Deep Indigo `#2C0B63`
- **Direction:** Top-left to bottom-right (135deg) for digital elements
- **Usage:** Hero sections, CTA buttons, highlighted cards, decorative elements

### Extended UI Colors
| Name | Hex | Usage |
|---|---|---|
| Surface Dark | `#1A0840` | Card backgrounds on dark mode |
| Surface Mid | `#3D1A7A` | Secondary cards, hover states |
| Border Subtle | `#4A2090` | Card borders, dividers |
| Text Primary | `#FAF8F5` | Main body text on dark |
| Text Secondary | `#C4B0E0` | Secondary text, captions, labels |
| Success | `#4ECCA3` | Confirmation states, completed tasks |
| Warning | `#F5A623` | Alerts, pending states |
| Error | `#E85D75` | Error states, destructive actions |

---

## Typography

### Hierarchy
- **Display / Hero:** Large, bold, high-contrast — commands attention
- **Headings:** Clean, modern sans-serif — confident and clear
- **Body:** Readable, light weight — never cramped
- **Labels/UI:** Uppercase tracking on small labels for a tech feel

### Font Pairing (Recommended Google Fonts)
| Role | Font | Weight |
|---|---|---|
| Primary / Headings | `Space Grotesk` | 500, 600, 700 |
| Body / UI | `Inter` | 300, 400, 500 |
| Accent / Display | `Syne` | 700, 800 |

### Rules
- No serif fonts
- Futuristic but humanistic — clean lines, good letter spacing
- Generous line height for readability (1.6 on body)
- Letter spacing: `0.05em` on uppercase labels and buttons

---

## Visual Style

### Overall Aesthetic
- **Minimalist high-contrast** — lots of breathing room, bold focal points
- **Glass morphism** on cards — subtle frosted glass effect with soft borders
- **Warm light streaks** — organic diagonal light elements as decorative texture
- **Editorial lighting feel** — warm, flattering, not clinical

### UI Components

**Cards:**
- Background: `rgba(61, 26, 122, 0.4)` with `backdrop-filter: blur(12px)`
- Border: `1px solid rgba(92, 0, 255, 0.3)`
- Border radius: `16px`
- Shadow: `0 8px 32px rgba(44, 11, 99, 0.4)`

**Buttons (Primary):**
- Background: Gradient `#5C00FF → #2C0B63`
- Text: Warm White `#FAF8F5`
- Border radius: `10px`
- Padding: `12px 24px`
- Hover: Brighten gradient, add subtle glow `box-shadow: 0 0 20px rgba(92, 0, 255, 0.5)`

**Buttons (Secondary):**
- Background: Transparent
- Border: `1px solid #5C00FF`
- Text: `#5C00FF`
- Hover: Fill with `rgba(92, 0, 255, 0.1)`

**Buttons (Accent):**
- Background: Gold `#C9A84C`
- Text: Deep Indigo `#2C0B63`
- Use sparingly for premium CTAs

**Input Fields:**
- Background: `rgba(26, 8, 64, 0.6)`
- Border: `1px solid rgba(92, 0, 255, 0.4)`
- Focus border: `#5C00FF`
- Text: Warm White
- Placeholder: `#C4B0E0`
- Border radius: `10px`

**Navigation / Sidebar:**
- Background: Deep Indigo `#2C0B63`
- Active item: Vivid Violet `#5C00FF` with soft left border
- Hover: `rgba(92, 0, 255, 0.15)`
- Icons: Light violet or gold for active

**Status Badges:**
- Active / Live: Teal `#4ECCA3` — soft glow
- Pending: Gold `#F5A623`
- Completed: Muted violet
- Error: Warm red `#E85D75`

---

## Textures & Effects

- **Glass interfaces:** Use backdrop blur and semi-transparent surfaces throughout
- **Light streaks:** Subtle diagonal warm gradient overlays (gold/cream) as background texture on hero areas
- **Soft glows:** Violet glow effects on active elements, never harsh neons
- **Grain texture:** Very subtle noise overlay (3-5% opacity) on backgrounds to add warmth and depth
- **Motion:** Smooth, intentional. Ease-in-out transitions (300ms). No jarring or excessive animation.

---

## What To Avoid

- ❌ Cold blue/cyan cyberpunk neons
- ❌ Pure black backgrounds (use Deep Indigo instead)
- ❌ Pure white — always use Cream or Warm White
- ❌ Harsh shadows or overly clinical layouts
- ❌ Serif fonts
- ❌ Cluttered layouts — always preserve white (cream) space
- ❌ Generic stock tech imagery (circuit boards, binary code aesthetics)
- ❌ Overly corporate or stiff design language

---

## Imagery Direction

- **Human-centric:** Smiling faces, connection, warmth — not just screens and code
- **Lighting:** Editorial, warm, flattering
- **Mood:** Aspirational but accessible. Successful but approachable.
- **When using UI mockups:** Show real human interaction with the interface

---

## Dashboard-Specific Guidelines

When building the Mission Control dashboard:

- Default to **dark mode** (Deep Indigo base) with a light mode toggle
- Use glass cards throughout — never flat opaque blocks
- Sidebar in Deep Indigo, main content slightly lighter (`#1A0840`)
- Gold accents for important metrics and highlights
- Warm White text on all dark surfaces
- Status indicators use the colored badge system above
- Section headers in `Space Grotesk` 600 weight
- Data tables: alternating row backgrounds `rgba(92, 0, 255, 0.05)` and `transparent`
- Charts/graphs: Violet gradient fills, gold accent lines
- Empty states: Gentle violet illustration or icon, never just grey text

---

## Voice & Tone (for all written content)

- **Confident but not arrogant**
- **Warm but professional**
- **Direct — no fluff**
- **Bilingual aware** (English primary, French-friendly)
- **Authentic** — sounds like a real person, not a corporation
- First person when speaking as the brand: "We help..." or "I help..." depending on context
- Avoid buzzword soup — say what you mean, simply

---

*Meraki Media Digital Agency*
*"High-Tech with Soul"*
