## Page Designs

### 1. Landing Page

**Hero Section:**

- Full viewport height (or close)
- Background: Cream `#FEFBF8`
- Centered content
  **Layout:**
- Logo/branding at top (simple, small)
- Large serif headline: "Search your Mitsuha" (48-56px, serif, warm brown)
- Subheading: "Connect teachers and students through organized learning" (18px, sans, secondary text)
- Two CTA buttons vertically stacked:
  - Primary: "Get Started" (terracotta)
  - Secondary: "Sign In" (bordered)
- Optional: Subtle hero image or illustration (warm tones, editorial style)
  **Vibe:** Magazine cover, sophisticated, warm, inviting

---

### 2. Authentication Pages (Login & Register)

**Layout:**

- Centered card on cream background
- Max width: 380px
- Clean, minimal form
  **Login Page:**
- Heading: "Welcome back" (serif, 32px)
- Subheading: "Sign in to continue" (sans, secondary)
- Email field with label
- Password field with label
- "Forgot password?" link (ghost button)
- Sign in button (primary)
- "Create account?" link at bottom
  **Register Page:**
- Heading: "Join KIMI NO" (serif, 32px)
- First name field
- Last name field
- Email field
- Password field with requirements shown below
- Password strength indicator (optional, subtle)
- Terms & privacy checkbox
- Sign up button
- "Already have account?" link
  **Form Styling:**
- Labels above each field (serif, 14px)
- Clean inputs with terracotta borders on focus
- Generous spacing between fields (16px)
- Error messages in warm red
- No inline icons, keep it minimal

---

### 3. Dashboard / Classes Page

**Top Bar:**

- Logo "KIMI NO" on left (serif, warm brown)
- Right side: User menu (avatar circle + dropdown)
- Background: Slightly warmer than page `#F5EFE9` or same cream
- Border bottom: 1px `#D9CFC5`
- Height: 60px
- Padding: 16px horizontal
  **Main Content:**
- Left padding: 40px
- Right padding: 40px
- Top padding: 32px
  **Header Section:**
- Title: "Your Classes" (serif, 40px, warm brown)
- Subtitle: "Manage and explore your learning" (sans, 16px, secondary text)
- Right-aligned button: "+ Add Class" (primary button)
- Spacing below: 32px
  **Class Grid:**
- Grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Gap: 24px
- Card style as defined above
- Each card:
  - Title: "Class Name" (serif, 20px, warm brown)
  - Description: One line max (sans, 14px, secondary)
  - Stats row: "12 Students • 5 Subjects" (sans, 12px, tertiary)
  - Hover: Lift effect + subtle terracotta border
    **Empty State:**
- "No classes yet" heading (serif, 24px)
- "Create one to get started" (sans, 14px, secondary)
- Create button (primary)
- Icon or illustration (optional, warm tones)
  **Whitespace:** Generous, breathing room

---

### 4. Class Detail Page

**Top Navigation:**

- Back arrow button (left)
- Class title (serif, 28px, warm brown)
- Settings/menu icon (right, if admin)
- Border bottom: 1px `#D9CFC5`
  **Content Sections (Scrollable):**

**A. Overview Card**

- Class name (serif, 32px)
- Description (sans, 16px, secondary)
- Stats: "12 Members • 5 Subjects" (sans, 14px, tertiary)
- Edit button (if admin, ghost button, gray)
  **B. Members Section**
- Heading: "Members" (serif, 20px)
- Member count badge: "(12)"
- "+ Add Member" button (if admin, secondary button, right-aligned)
- Member list:
  - Each row: Name (bold sans), Email (gray sans), Role badge
  - Role: "Teacher" (terracotta badge) or "Student" (warm sage badge)
  - Hover row: background `#F5EFE9`
  - Remove icon/button (if admin, right side)
    **C. Subjects Section**
- Heading: "Subjects" (serif, 20px)
- "+ Add Subject" button (if admin)
- Subject cards or list items:
  - Name (serif, 18px)
  - Description (sans, 14px, secondary)
  - Document count badge (12-14px, subtle)
  - Clickable to view subject
    **D. Settings Section (if admin)**
- Edit class info (button)
- Delete class (button, error color)
  **Design:** Clean, card-based, with generous vertical spacing (24-32px between sections)

---

### 5. Add Member Modal

**Trigger:** "+ Add Member" button

**Modal:**

- Centered overlay
- Max width: 420px
- Clean, minimal
  **Content:**
- Title: "Add Student" (serif, 24px)
- Subtitle: "Invite by email address" (sans, 14px, secondary)
- Email input with label (16px)
- Error message area (if email not found)
- Success message area (if added)
- Button: "Add Member" (primary, full width)
- Spacing: 16px between elements
  **States:**
- Default: Empty input, ready
- Loading: Spinner in button, disabled
- Success: Green check, "Added and notified!" message
- Error: Red message, "Email not registered"

---

### 6. Subject Detail Page

**Layout:** Similar to class detail

**Header:**

- Back button, subject name (serif, 28px)
  **Sections:**
- Subject description (sans, 16px)
- Document list:
  - File name (sans, 16px)
  - File type + size (sans, 12px, secondary)
  - Upload date (sans, 12px, tertiary)
  - Download button (ghost)
  - Delete button (if admin, error red)
- "+ Add Document" button (if admin)

---

### 7. Notifications Panel

**Bell Icon Location:** Top right corner of every page

**Icon & Badge:**

- Bell icon (24px, `#3D3531`)
- Unread badge: Red circle, white number (if unread > 0)
- Size: 44x44px clickable area
  **Dropdown Panel (on click):**
- Positioned top right
- Width: 320px max
- Background: `#FEFBF8`
- Border: 1px `#D9CFC5`
- Border radius: 12px
- Box shadow: 0 4px 12px rgba(61, 53, 49, 0.12)
  **Content:**
- Title: "Notifications" (serif, 16px, optional)
- Empty state: "You're all caught up" (sans, 14px, secondary)
- Notification items:
  - Title (sans, 14px, bold)
  - Message (sans, 13px, secondary)
  - Timestamp (sans, 11px, tertiary)
  - Read state: Unread bg `#F5EFE9`, read bg transparent
  - Hover: Subtle bg change
- Scroll if more than 5
- View all link (optional, bottom, ghost button)

---

### 8. User Profile / Settings Page

**Layout:**

- Same top bar
- Content: 40px padding horizontal
  **Header Section:**
- User avatar (circular, 80px, initials)
- Name (serif, 28px)
- Email (sans, 14px, secondary)
- Edit button (secondary button)
  **Tabs:**
- "Created Classes" tab
- "Joined Classes" tab
- Tab underline: `#C87A6E` for active
  **Tab Content:**
- Similar class cards as dashboard
- Grid layout
  **Settings Section:**
- Theme toggle (optional, disabled if dark-only)
- Notifications toggle
- Other preferences
  **Logout Button:**
- Full width secondary button
- Error/warm red color
- Margin top: 32px

---

## Interactions & Animations

**Transitions:** All 150-200ms, ease-out timing

**Hover Effects:**

- Buttons: Color shift (darker terracotta)
- Cards: Lift + shadow increase
- Rows: Subtle bg color to `#F5EFE9`
- Links: Underline
  **Active/Click:**
- Buttons: Scale down to 0.98x
- Inputs: Terracotta border + glow
  **Loading:**
- Spinner: Rotating circle (lucide `Loader2`)
- Button disabled, opacity-70
  **Feedback:**
- Success: Green checkmark, brief message
- Error: Red message, stays until dismissed
- Toast notifications (if needed): Bottom right, auto-dismiss 4s

---

## Responsive Design

**Mobile (375px):**

- Stack all elements vertically
- Full width with 16px padding
- Single column grid
- Larger touch targets (44px minimum)
- Modal: Full width with 16px padding
  **Tablet (768px):**
- 2 columns for class grid
- Modal: 90% width max 420px
- Sidebar navigation (optional)
  **Desktop (1200px+):**
- 3 columns for class grid
- Optimal line length for reading
- Full featured layout

---

## Accessibility

**Must Have:**

- Color contrast: WCAG AA (4.5:1 for text)
- Focus indicators: Visible terracotta outline
- Keyboard navigation: Tab through all interactive elements
- Form labels: Associated with inputs
- Error messages: Clear, descriptive, linked to fields
- Loading indicators: Text + spinner for screen readers
  **Nice to Have:**
- WCAG AAA contrast where possible
- Reduced motion support
- Skip to content link
- Semantic HTML

---

## Deliverables Expected

**For each page, provide:**

- Desktop view (1200px)
- Tablet view (768px)
- Mobile view (375px)
  **State variations:**
- Default/empty
- Filled/with data
- Hover states
- Focus states
- Loading states
- Error states
- Success states
  **Extras:**
- Component specifications (sizing, spacing, colors)
- Typography scale with font sizes
- Color palette reference
- Icon recommendations
- Animation timing specs

---

## Design Inspiration & Feeling

**Think of these contemporary products:**

- Linear.app (warm, minimal)
- Basehub (editorial, soothing)
- Notion's newer design (clean, humanist)
- Superhuman (warm colors, premium)
- Substack (editorial, readable)
  **Vibe:** Warm hug, editorial sophistication, contemporary minimalism, humanist digital design

**NOT:** Cold corporate, bright neon, dark/gloomy, overly playful, cluttered

---

## Technical Notes

**Will be built with:**

- React 18+
- Tailwind CSS (custom color config)
- Lucide React (icons)
- Modern standards
  **Will support:**
- Real-time notifications
- File uploads
- Form validation
- Responsive design
- Accessible focus management

---
