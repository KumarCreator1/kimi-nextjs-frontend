# Design Direction — Notes App

## Vibe

Reading room, not SaaS dashboard. Warm, unhurried, a little tactile —
like flipping through a well-kept notebook, not staring at a ticketing
system. Paper and ink, not glass and gradients.

---

## Color Palette

Warm neutral base + one accent. No semantic rainbow — success/error/warning
stay muted and desaturated so they don't fight the accent for attention.

| Token               | Hex       | Use                                                |
| ------------------- | --------- | -------------------------------------------------- |
| `bg-canvas`         | `#FAF6EF` | Page background — warm parchment                   |
| `bg-surface`        | `#FFFFFF` | Cards, panels                                      |
| `bg-surface-sunken` | `#F1EAE0` | Nested areas, input fields                         |
| `border-subtle`     | `#E4DACB` | Card borders, dividers                             |
| `text-primary`      | `#2B241C` | Body text — warm near-black, not pure black        |
| `text-secondary`    | `#75695A` | Captions, metadata, timestamps                     |
| `text-muted`        | `#A69B8C` | Placeholder text, disabled states                  |
| `accent`            | `#B5502E` | Terracotta — links, primary buttons, active states |
| `accent-hover`      | `#9A4224` | Accent hover/pressed                               |
| `accent-soft`       | `#F3E3D8` | Accent backgrounds — badges, selected rows         |
| `success`           | `#5C7A52` | Muted sage green — approved, ready                 |
| `warning`           | `#B8862F` | Muted amber — pending, processing                  |
| `error`             | `#A8412F` | Muted brick red — rejected, failed                 |

Reasoning: terracotta reads as book-cloth/leather-binding, warm without
being loud, and stays legible on cream at normal text weight (check
contrast ratio once implemented — aim for 4.5:1 minimum on body text).

Dark mode isn't built now (light default per your call), but these tokens
are named semantically, not as raw hex-in-components, specifically so a
dark variant can swap the token values later without touching component
code.

---

## Typography

Serif for headings (academic authority), humanist sans for body
(actual readability at small sizes) — the pairing that sells "academic"
without tipping into twee illuminated-manuscript territory.

- **Headings:** `Source Serif 4` or `Lora` — both free, both read as
  "book," neither is precious about it.
- **Body / UI:** `Inter` or `Public Sans` — neutral, highly legible at
  13–14px, doesn't compete with the serif headings for character.
- **Monospace** (file metadata, timestamps if you want a "receipt"
  feel): `IBM Plex Mono` — optional, only if you want that touch.

Scale: keep it restrained — 3–4 heading sizes, one body size, one small
size for metadata. A notes app shouldn't out-typography the notes
themselves.

---

## Shape & Depth

- **Corner radius:** 8–10px. Rounded enough to feel soft, not so round
  it reads as a mobile game (avoid the 16px+ "bubbly" look).
- **Shadows:** very soft, low-opacity, warm-tinted (not pure black
  shadow — a shadow with a hint of the accent's hue reads as "paper
  lifted slightly," not "floating card").
- **Borders over shadows** where possible — a hairline `border-subtle`
  card reads more "bound page" than a heavily-shadowed floating card.

---

## Page Inventory

1. **Login / Register** — split screen, form on one side, something
   quietly editorial on the other (not a stock illustration).
2. **My Classes** (dashboard/home) — grid of class cards, like a shelf.
   Each card: class name, creator, subject count, member count, your role.
3. **Class Detail** — subjects as a grid of "notebook" cards (doc count
   per subject), members list in a side panel, pending-requests badge
   if you're admin.
4. **Subject Detail** — documents as a list (not grid — lists scan
   faster once there are 20+ notes), each row shows AI-generated title,
   topics as small tags, status (processing/ready), file type icon.
5. **Document Viewer** — preview pane (PDF/image) + a side panel with
   AI summary, topic tags, uploader, upload date.
6. **Search Results** — triggered from a persistent top-bar search;
   results show matched snippet + topic tags, scoped to the current
   class by default.
7. **Requests / Approvals** (admin only) — pending add-member /
   remove-member / delete-document requests, approve/reject inline.
8. **Profile / Settings** — name, email, password change. Minimal.

---

## Key Component Patterns

- **Class / Subject cards** — title (serif), metadata line (sans,
  `text-secondary`), soft border, no heavy shadow. Hover: slight lift +
  accent-colored border, not a color-fill hover (stays calm).
- **Role badge** — small pill, `accent-soft` background for Admin,
  neutral `bg-surface-sunken` for Member. Understated, not a loud chip.
- **Document processing state** — while Gemini is working
  (`status: processing`), show a skeleton/pulse card with a subtle
  "still working on this one" label instead of a generic spinner —
  keeps the paper metaphor instead of feeling like a loading screen.
  On `failed`, a small inline retry affordance, not a scary red banner.
- **Topic tags** — small rounded-rect chips, `bg-surface-sunken` +
  `text-secondary`, NOT accent-colored (reserve accent for actions/links
  only, or every screen turns orange).
- **Upload dropzone** — dashed `border-subtle`, becomes `accent` dashed
  on drag-over. Supports pdf/jpg/png per your spec.
- **Request card** (admin approvals) — requester name, what they're
  asking for in plain language ("wants to remove Priya from this
  class"), Approve / Reject as a text-button pair, not heavy CTAs —
  these are routine actions, not high-drama ones.
- **Empty states** — "No notes yet in this subject" styled like a
  blank page, not a sad-mascot illustration. Keeps tone consistent.

---

## Iconography

Line icons, not filled/glyph-style — matches the "ink on paper" feel
better than solid icon sets. Lucide (already available as
`lucide-react` in this stack) fits this directly, no extra dependency.

---

## Accessibility notes to check once built

- Terracotta accent on cream background — verify 4.5:1 contrast for
  any accent text (not just accent buttons, which have more leeway).
- `text-muted` on `bg-surface-sunken` is the riskiest pairing here —
  test it before shipping the input placeholder style.
