# Playwright MCP Automation - AI Execution Guide

**Purpose**: AI agent instructions for efficient Playwright MCP automation of the Intrigma scheduler application.

**CRITICAL**: This document is written FOR AI AGENTS. Humans should read frontend testing guides.

---

## 🎯 AI Execution Principles

### Performance Rules (MANDATORY)

1. **DOM Queries First** - `take_snapshot` is 100x faster than screenshots
2. **Batch Operations** - Use `fill_form` for multiple fields, never loop individual `fill` calls
3. **Context Awareness** - Understand page state BEFORE acting (analyze snapshot first)
4. **Selector Strategy** - Priority: `data-testid` > `role` > `aria-label` > text
5. **Validate with DOM** - Check element properties, not visual appearance

### Anti-Patterns (NEVER DO THIS)

❌ `navigate → screenshot → click → screenshot → fill → screenshot → verify screenshot`
❌ Loop multiple `fill` calls for a form
❌ Screenshot-based validation
❌ Blind clicking without context awareness
❌ Skipping section selection (shifts won't appear!)

### Fast Patterns (ALWAYS DO THIS)

✅ `take_snapshot → analyze context → batch action → DOM validation`
✅ `fill_form([{field1: value1}, {field2: value2}])` for multi-field forms
✅ Check `take_snapshot` results for element state before screenshots
✅ Understand page context (which view? filters? selections?)
✅ Select sections FIRST before expecting calendar data

---

## 🚀 Core Workflows (Optimized for Speed)

### Authentication (3 operations, <2 seconds)

```javascript
// Step 1: Navigate
mcp__playwright__browser_navigate({
  url: "http://localhost:3000/app/auth/sign-in"
})

// Step 2: Take snapshot to get field refs
mcp__playwright__browser_snapshot()

// Step 3: Fill form in one operation
mcp__playwright__browser_fill_form({
  fields: [
    {
      name: "Work Email Address",
      type: "textbox",
      ref: "[email-field-ref]",
      value: "Renee.Waters61@gmail.com"
    },
    {
      name: "Password",
      type: "textbox",
      ref: "[password-field-ref]",
      value: "password"
    }
  ]
})

// Step 4: Submit (ref from snapshot)
mcp__playwright__browser_click({
  element: "Sign in button",
  ref: "[submit-button-ref]"
})

// Step 5: Verify success (DOM query, not screenshot)
// Wait for URL change or "Schedule" heading to appear
```

**Result**: Authenticated in 3-4 MCP calls instead of 10+

---

### Calendar Setup (CRITICAL SEQUENCE)

**⚠️ MANDATORY**: Sections MUST be selected or calendar shows "Nothing is here"

```javascript
// Step 1: Take snapshot to understand current state
mcp__playwright__browser_snapshot()
// Analyze: Are sections already selected? What's the current view?

// Step 2: Open sections combobox (2nd combobox on page)
mcp__playwright__browser_click({
  element: "Sections combobox",
  ref: "[sections-combobox-ref]"  // From snapshot
})

// Step 3: Take snapshot of dialog
mcp__playwright__browser_snapshot()

// Step 4: Select all sections
// IMPORTANT: Tri-state checkbox - may need to click twice
// If label says "Select None" (partially selected):
//   Click once → deselects all (label becomes "Select All")
//   Click twice → selects all (label becomes "Select None" ✓)
mcp__playwright__browser_click({
  element: "Select all checkbox",
  ref: "[select-checkbox-ref]"
})

// Step 5: Close dialog (Escape key)
mcp__playwright__browser_press_key({ key: "Escape" })

// Step 6: Wait for calendar to update
mcp__playwright__browser_wait_for({ time: 1 })

// Step 7: Verify success with DOM query
mcp__playwright__browser_snapshot()
// Check: Does sections combobox show "+N more"?
// Check: Are shift elements ([data-kind="shift"]) now visible?
```

**Result**: Sections selected in 7 operations with context awareness

---

### Adjust Calendar View (Optional but Recommended)

```javascript
// Best practice: Use "2 Weeks" view for better shift visibility

// Step 1: Take snapshot
mcp__playwright__browser_snapshot()

// Step 2: Click weeks combobox (has text like "6 Weeks")
mcp__playwright__browser_click({
  element: "Calendar view period combobox",
  ref: "[weeks-combobox-ref]"
})

// Step 3: Take snapshot of menu
mcp__playwright__browser_snapshot()

// Step 4: Select "2 Weeks" option
mcp__playwright__browser_click({
  element: "2 Weeks menuitem",
  ref: "[2-weeks-option-ref]"
})

// Step 5: Wait for calendar refresh
mcp__playwright__browser_wait_for({ time: 1 })
```

---

### View Shifts in Day View

**Use case**: Calendar shows "+27 more" indicator, need to see all shifts

```javascript
// Step 1: Take snapshot to find "+X more" indicator
mcp__playwright__browser_snapshot()
// Look for: text matching /\+\d+ more/

// Step 2: Click "+27 more" text
mcp__playwright__browser_click({
  element: "+27 more indicator",
  ref: "[more-shifts-ref]"
})

// Step 3: Day view dialog opens - take snapshot
mcp__playwright__browser_snapshot()
// Verify: [role="dialog"] with "Day View" heading
// Now all shifts visible with [data-kind="shift"] elements

// Step 4: (Optional) Search shifts
mcp__playwright__browser_type({
  element: "Search input",
  ref: "[search-input-ref]",
  text: "Support"
})
// Shifts filter in real-time

// Step 5: Close day view when done
mcp__playwright__browser_press_key({ key: "Escape" })
```

---

### Create Shift (Day View Button)

**Use case**: Add a new shift to the schedule

```javascript
// Step 1: Navigate to desired date (if not already there)
// ... use calendar navigation ...

// Step 2: Open day view for the date
mcp__playwright__browser_snapshot()
// Find "+X more" indicator or day cell

mcp__playwright__browser_click({
  element: "+X more indicator or day cell",
  ref: "[day-ref]"
})

// Step 3: Day view opens - take snapshot
mcp__playwright__browser_snapshot()

// Step 4: Click "Create Shift" button in day view
// Look for button with plus icon or "Create" text
mcp__playwright__browser_click({
  element: "Create shift button",
  ref: "[create-btn-ref]"
})

// Step 5: Create shift dialog opens
mcp__playwright__browser_snapshot()
// Look for [role="dialog"] with "Create Shift" heading

// Step 6: Fill shift form using fill_form (batch operation)
mcp__playwright__browser_fill_form({
  fields: [
    {
      name: "Shift Type",
      type: "combobox",
      ref: "[shift-type-ref]",
      value: "Support Day"
    },
    {
      name: "Start Time",
      type: "textbox",
      ref: "[start-time-ref]",
      value: "09:00"
    },
    {
      name: "End Time",
      type: "textbox",
      ref: "[end-time-ref]",
      value: "18:00"
    }
    // ... other fields as needed
  ]
})

// Step 7: Submit form
mcp__playwright__browser_click({
  element: "Save button",
  ref: "[save-btn-ref]"
})

// Step 8: Verify shift created with DOM query
mcp__playwright__browser_snapshot()
// Check: New [data-kind="shift"] element with matching time/type
```

**Result**: Shift created in ~8-10 operations

---

### Edit Existing Shift

**Use case**: Modify shift time, type, or assignment

```javascript
// Step 1: Find and click the shift to edit
mcp__playwright__browser_snapshot()
// Look for [data-kind="shift"] with specific time/type

mcp__playwright__browser_click({
  element: "Shift to edit",
  ref: "[shift-ref]"
})

// Step 2: Shift details dialog opens
mcp__playwright__browser_snapshot()
// Look for [role="dialog"] with shift details

// Step 3: Click "Edit" button in dialog
mcp__playwright__browser_click({
  element: "Edit shift button",
  ref: "[edit-btn-ref]"
})

// Step 4: Edit form appears (may be same dialog or new one)
mcp__playwright__browser_snapshot()

// Step 5: Modify fields using fill_form
mcp__playwright__browser_fill_form({
  fields: [
    {
      name: "Start Time",
      type: "textbox",
      ref: "[start-time-ref]",
      value: "10:00"  // Changed from 09:00
    }
    // ... only fields being changed
  ]
})

// Step 6: Save changes
mcp__playwright__browser_click({
  element: "Save button",
  ref: "[save-btn-ref]"
})

// Step 7: Verify changes with DOM query
mcp__playwright__browser_snapshot()
// Check: Shift element now shows updated time
```

---

### Delete Shift

**Use case**: Remove shift from schedule

```javascript
// Step 1: Find and click the shift to delete
mcp__playwright__browser_snapshot()

mcp__playwright__browser_click({
  element: "Shift to delete",
  ref: "[shift-ref]"
})

// Step 2: Shift details dialog opens
mcp__playwright__browser_snapshot()

// Step 3: Click "Delete" button
mcp__playwright__browser_click({
  element: "Delete shift button",
  ref: "[delete-btn-ref]"
})

// Step 4: Confirmation dialog may appear
mcp__playwright__browser_snapshot()
// Look for [role="alertdialog"] with "Delete" or "Confirm"

// Step 5: Confirm deletion
mcp__playwright__browser_click({
  element: "Confirm delete button",
  ref: "[confirm-btn-ref]"
})

// Step 6: Wait for deletion to process
mcp__playwright__browser_wait_for({ time: 1 })

// Step 7: Verify shift removed with DOM query
mcp__playwright__browser_snapshot()
// Check: [data-kind="shift"] with that ID no longer exists
```

---

## 📋 Decision Tree for Common Tasks

### Task: "Show me shifts for October 31, 2025"

```
1. Take snapshot → Are sections selected?
   NO → Follow "Calendar Setup" workflow first
   YES → Continue

2. Take snapshot → Is date visible on calendar?
   NO → Navigate to period (Previous/Next buttons or period combobox)
   YES → Continue

3. Take snapshot → How many shifts visible?
   FEW (<5) → Click on day cell to see details
   MANY (>10 with "+X more") → Click "+X more" to open day view
   NONE → Verify sections are actually selected, check filters

4. Validate results with DOM query
   - Count [data-kind="shift"] elements
   - Check shift text content for dates/times
```

### Task: "Login to the application"

```
1. Navigate to /app/auth/sign-in

2. Take snapshot → Get field refs

3. Fill form in ONE operation (both email + password)

4. Click submit button

5. Verify with DOM query (NOT screenshot):
   - URL changed to /app/scheduler or /app/
   - "Schedule" heading visible
```

### Task: "Find and click a specific shift"

```
1. Take snapshot → Understand current view
   - Main calendar? → May need to open day view if "+X more" present
   - Day view? → Shifts directly clickable
   - Sections selected? → If not, no shifts visible

2. If needed: Open day view (click "+X more")

3. If needed: Search for shift (type in search input)

4. Take snapshot → Get shift element refs
   - Look for: [data-kind="shift"] with matching time/type text

5. Click shift by ref

6. Verify dialog opened: [role="dialog"] visible
```

---

## 🔍 Context Awareness Checklist

Before every action, analyze the snapshot:

### Page State Questions
- ✅ What page am I on? (auth, scheduler, request list, settings?)
- ✅ Are sections selected? (combobox shows "+N more" or single name?)
- ✅ What calendar view? (1-6 weeks?)
- ✅ What date range visible? (October 2025? November?)
- ✅ Are there visible shifts? (count [data-kind="shift"] elements)
- ✅ Is a dialog open? ([role="dialog"] present?)
- ✅ Is user authenticated? (presence of user avatar/menu)

### Element State Questions
- ✅ Is the element I need visible in the snapshot?
- ✅ What's the element's ref for MCP interaction?
- ✅ Is the element enabled/disabled? (check attributes)
- ✅ Is the element already in desired state? (checked, expanded, selected)

### Action Planning
- ✅ Can I batch this action with others? (use fill_form)
- ✅ Do I need to wait for network/state change after this action?
- ✅ How will I validate success? (which DOM property to check)

---

## ⚡ Performance Comparison

### Slow Pattern (OLD - Don't Use)
```
navigate_page          → 1000ms
take_screenshot        → 1500ms  (AI analyzes image)
click (email field)    → 200ms
take_screenshot        → 1500ms
type (email)           → 300ms
take_screenshot        → 1500ms
click (password field) → 200ms
take_screenshot        → 1500ms
type (password)        → 300ms
take_screenshot        → 1500ms
click (submit)         → 200ms
take_screenshot        → 1500ms
TOTAL: ~12,200ms (12 seconds)
```

### Fast Pattern (NEW - Always Use)
```
navigate_page          → 1000ms
take_snapshot          → 50ms   (DOM query)
fill_form (both fields)→ 400ms
click (submit)         → 200ms
take_snapshot          → 50ms   (verify)
TOTAL: ~1,700ms (1.7 seconds)
```

**7x FASTER** with context awareness and batch operations!

---

## 🎯 Selector Priority Reference

When querying snapshot results, use this priority:

### 1. data-testid (Most Reliable)
```javascript
// Preferred: Explicit test identifiers
element: "Users sidebar",
ref: "[data-testid='users-sidebar']"
```

### 2. role + aria-label (Semantic)
```javascript
// Good: Accessible, semantic selectors
element: "Logout menuitem",
ref: "[role='menuitem'][aria-label='Logout']"
```

### 3. role + text (Semantic with Content)
```javascript
// Good: Semantic with readable text
element: "Schedule heading",
ref: "[role='heading']:has-text('Schedule')"
```

### 4. data-kind (Custom Attributes)
```javascript
// App-specific: Used for shifts, calendar elements
element: "Shift element",
ref: "[data-kind='shift']"
```

### 5. label text (Form Fields)
```javascript
// Forms: Use label text for inputs
element: "Work Email Address field",
ref: "input associated with label 'Work Email Address'"
```

### 6. Text content (Last Resort)
```javascript
// Fallback: Fragile, breaks with i18n or text changes
element: "Today button",
ref: "button:has-text('Today')"
```

---

## 🐛 Common Issues & Solutions

### Issue: "Shifts not appearing on calendar"

**Diagnosis**:
```javascript
mcp__playwright__browser_snapshot()
// Check: Does sections combobox show "123" (single section) or "+25 more" (multiple)?
// Check: Are [data-kind="shift"] elements in the DOM?
```

**Solution**: Sections not selected → Run Calendar Setup workflow

---

### Issue: "Element not found"

**Diagnosis**:
```javascript
mcp__playwright__browser_snapshot()
// Question 1: Is the page fully loaded?
// Question 2: Is the element inside a collapsed section/dialog?
// Question 3: Is the selector correct from snapshot?
```

**Solutions**:
1. Wait for page load: `mcp__playwright__browser_wait_for({ time: 1 })`
2. Open containing dialog/menu first
3. Take fresh snapshot, verify ref is correct

---

### Issue: "Action succeeds but state doesn't change"

**Diagnosis**: Likely a timing issue - action happened before page was ready

**Solution**: Add wait after state-changing actions
```javascript
// After selecting sections, changing view, navigating period:
mcp__playwright__browser_wait_for({ time: 1 })  // Let useScheduleShiftsQuery complete
```

---

### Issue: "Stale element reference"

**Diagnosis**: DOM changed after initial snapshot

**Solution**: Always take fresh snapshot after state changes
```javascript
// Change state
mcp__playwright__browser_click({ element: "...", ref: "..." })

// Wait for update
mcp__playwright__browser_wait_for({ time: 1 })

// Get fresh snapshot
mcp__playwright__browser_snapshot()

// NOW query for elements
```

---

## 📊 Application Context Understanding

### Key Application Patterns

#### Radix UI Components
- Dialogs: `[role="dialog"]`
- Comboboxes: `[role="combobox"]` trigger → `[role="menu"]` dropdown → `[role="menuitem"]` options
- Menus: `[role="menu"]` → `[role="menuitem"]` items
- Checkboxes: `[type="checkbox"]` with associated labels

#### Custom Patterns
- Shifts: `[data-kind="shift"]` with variant classes:
  - Available: `.bg-green-20` (green background)
  - Assigned: `.bg-gray-50` (gray background)
  - Default: standard styling
- Calendar cells: `[data-date="YYYY-MM-DD"]` attributes
- More indicators: Text pattern `/\+\d+ more/` (e.g., "+27 more")

#### State Indicators
- Sidebar open: `[data-state="open"]`
- Sidebar closed: `[data-state="closed"]`
- User avatar: `[data-slot="avatar"]` (shows initials like "RW")
- Icons: `[data-icon="icon-name"]` or `[data-slot="icon"]`

### URLs & Routing (CRITICAL)

**All URLs MUST include `/app` prefix** (Next.js basePath)

✅ CORRECT:
- `http://localhost:3000/app/auth/sign-in`
- `http://localhost:3000/app/scheduler`
- `http://localhost:3000/app/request-list`
- `http://localhost:3000/app/settings`

❌ WRONG:
- `http://localhost:3000/auth/sign-in` → 404 Error
- `http://localhost:3000/scheduler` → 404 Error

### State Management

#### Apollo Client Queries
After actions that change calendar state (select sections, change view, navigate period):
1. Action completes immediately
2. `useScheduleShiftsQuery` refetches data (500ms)
3. DOM updates with new data

**Always wait 1 second** after state-changing actions before taking snapshot!

#### Dialog/Modal States
- Dialogs close with: Escape key OR clicking outside OR close button
- Some dialogs have unsaved data guards (warn before closing)
- Day view can be "pinned" (stays open when clicking outside)

---

## ✅ Validation Methods (DOM-First)

### Fast DOM Validation

```javascript
// After authentication
mcp__playwright__browser_snapshot()
// Check 1: URL contains "/app/scheduler" or "/app/"
// Check 2: [role="heading"] with text "Schedule" exists
// Success criteria: Both conditions true

// After selecting sections
mcp__playwright__browser_snapshot()
// Check 1: Sections combobox text includes "+N more"
// Check 2: At least one [data-kind="shift"] element exists
// Success criteria: Both conditions true

// After opening day view
mcp__playwright__browser_snapshot()
// Check 1: [role="dialog"] with "Day View" heading exists
// Check 2: Multiple [data-kind="shift"] elements visible
// Success criteria: Both conditions true
```

### When Screenshots Are Acceptable

Only use screenshots for:
- Visual regression testing (comparing layouts)
- Capturing proof of state for debugging
- User-requested visual verification

NOT for:
- Element detection (use snapshot)
- State validation (use snapshot)
- Presence checks (use snapshot)

---

## 📝 Complete Workflow Examples

### Example 1: "Show me all shifts for today"

```javascript
// Context awareness: Start with snapshot
mcp__playwright__browser_snapshot()
// Analyze snapshot results:
// - Look for [data-slot="avatar"] element → if present, authenticated = true
// - Check URL contains "/app/" → if yes, authenticated = true

// Decision: Am I authenticated?
// Check: Does snapshot contain user avatar element [data-slot="avatar"]?
const user_avatar_present = /* check snapshot for [data-slot="avatar"] */;
if (!user_avatar_present) {
  // Run authentication workflow first
  mcp__playwright__browser_navigate({ url: "http://localhost:3000/app/auth/sign-in" })
  // ... complete auth steps from Authentication workflow ...
}

// Decision: Are sections selected?
mcp__playwright__browser_snapshot()
// Check: Does sections combobox (2nd combobox) show "+N more" or single name?
// - Text like "123, +25 more" → sections selected = true
// - Text like "123" only → sections selected = false
const sections_combobox_text = /* extract text from 2nd [role="combobox"] */;
if (sections_combobox_text.includes("+") && sections_combobox_text.includes("more")) {
  // Sections are selected, continue
} else {
  // Run calendar setup workflow
  // ... complete section selection from Calendar Setup workflow ...
}

// Decision: Is today's date visible?
mcp__playwright__browser_snapshot()
// Check: Are there calendar cells with today's date attribute [data-date="2025-11-03"]?
const today_cell_present = /* check snapshot for [data-date="2025-11-03"] */;
if (!today_cell_present) {
  // Click "Today" button
  mcp__playwright__browser_click({ element: "Today button", ref: "[today-btn-ref]" })
  mcp__playwright__browser_wait_for({ time: 1 })
}

// Decision: How many shifts today?
mcp__playwright__browser_snapshot()
// Check: Does today's cell contain text matching /\+\d+ more/?
const more_indicator_present = /* check for "+X more" text in today's cell */;
if (more_indicator_present) {
  // Click "+X more" to open day view
  mcp__playwright__browser_click({ element: "+X more", ref: "[more-ref]" })
  mcp__playwright__browser_snapshot()
  // All shifts now visible in day view
} else {
  // Shifts already visible on main calendar
  // Count [data-kind="shift"] elements in today's cell
}

// Validate: DOM query for shift count
const shift_count = /* count [data-kind="shift"] elements */;
// Result: Report shift_count and details to user
```

**Operations**: ~8-12 MCP calls (context-dependent)
**Time**: ~5-8 seconds
**Old approach**: 20+ calls, 30+ seconds

---

### Example 2: "Create a test to verify login works"

```javascript
// E2E Test: Login functionality

// Step 1: Navigate to login page
mcp__playwright__browser_navigate({
  url: "http://localhost:3000/app/auth/sign-in"
})

// Step 2: Take snapshot for context and refs
mcp__playwright__browser_snapshot()
// Expected: Login form with email, password fields and submit button

// Step 3: Fill credentials (batch operation)
mcp__playwright__browser_fill_form({
  fields: [
    {
      name: "Work Email Address",
      type: "textbox",
      ref: "[email-ref-from-snapshot]",
      value: "Renee.Waters61@gmail.com"
    },
    {
      name: "Password",
      type: "textbox",
      ref: "[password-ref-from-snapshot]",
      value: "password"
    }
  ]
})

// Step 4: Submit form
mcp__playwright__browser_click({
  element: "Sign in button",
  ref: "[submit-ref-from-snapshot]"
})

// Step 5: Wait for navigation
mcp__playwright__browser_wait_for({ time: 2 })

// Step 6: Validate success with DOM query
mcp__playwright__browser_snapshot()
// Assert 1: URL changed to /app/scheduler or /app/
// Assert 2: "Schedule" heading present
// Assert 3: User avatar visible (authenticated state)
// Assert 4: No error messages present

// Result: Login test passes in ~6 operations, ~5 seconds
```

---

### Example 3: "Find Support shifts on October 31"

```javascript
// Prerequisite checks (context awareness)
mcp__playwright__browser_snapshot()

// Check 1: Authenticated?
// Look for [data-slot="avatar"] element in snapshot
const user_avatar_present = /* check snapshot for [data-slot="avatar"] */;
if (!user_avatar_present) {
  // Run auth workflow first
  // ... complete Authentication workflow ...
}

// Check 2: Sections selected?
// Check sections combobox (2nd [role="combobox"]) text
const sections_combobox_text = /* extract text from 2nd [role="combobox"] */;
const sections_selected = sections_combobox_text.includes("+") && sections_combobox_text.includes("more");
if (!sections_selected) {
  // Run calendar setup workflow
  // ... complete Calendar Setup workflow ...
}

// Step 1: Navigate to October 31 if not visible
mcp__playwright__browser_snapshot()
// Check: Does snapshot contain calendar cell with [data-date="2025-10-31"]?
const october_31_cell = /* find [data-date="2025-10-31"] in snapshot */;
if (!october_31_cell) {
  // Use Previous/Next buttons or period combobox
  // Example: Click Previous button repeatedly until October 31 appears
  // (Logic depends on current date vs target date)
  // Then take fresh snapshot to confirm
}

// Step 2: Check if day has shifts
mcp__playwright__browser_snapshot()
// Look for October 31 calendar cell content
// Check: Does cell contain text matching /\+\d+ more/?
const oct_31_cell_content = /* extract content from [data-date="2025-10-31"] cell */;
const has_more_indicator = oct_31_cell_content.match(/\+\d+ more/);

if (has_more_indicator) {
  // Many shifts - open day view
  mcp__playwright__browser_click({
    element: "+X more for Oct 31",
    ref: "[more-ref-from-oct-31-cell]"
  })
  mcp__playwright__browser_snapshot()
} else {
  // Few shifts or need day view for search
  // Click day cell to open day view
  mcp__playwright__browser_click({
    element: "Oct 31 day cell",
    ref: "[day-cell-ref]"
  })
  mcp__playwright__browser_snapshot()
}

// Step 3: Search for "Support" shifts
// Look for search input in day view: input[placeholder="Search"]
mcp__playwright__browser_type({
  element: "Search input in day view",
  ref: "[search-input-ref]",
  text: "Support"
})

// Step 4: Results filter in real-time
mcp__playwright__browser_snapshot()
// Query: Count [data-kind="shift"] elements in day view
// Filter: Only those containing "Support" in text content
const support_shifts = /* filter [data-kind="shift"] elements with "Support" text */;
const support_shift_count = support_shifts.length;

// Result: Report support_shift_count and details (time, type, assignment) to user
```

**Operations**: ~10-15 (context-dependent)
**Time**: ~8-12 seconds
**Old approach**: 30+ calls, 45+ seconds

---

## 🎓 Learning & Improvement

### After Each Workflow Execution

1. **Count MCP calls made** - Can any be batched?
2. **Measure time taken** - Any unnecessary waits?
3. **Review snapshot usage** - Did I analyze context before acting?
4. **Check validation method** - Did I use DOM queries or screenshots?
5. **Identify patterns** - Can this workflow be reused?

### Continuous Optimization

- Keep track of common patterns (authentication, calendar setup)
- Build mental model of application state (sections, views, filters)
- Understand which actions trigger data refetches (need waits)
- Learn selector patterns (data-testid, role, custom attributes)
- Recognize when to use batch operations (fill_form, fill multiple)

---

## 📋 Quick Reference Card

### Essential MCP Tools

```javascript
// Navigation
mcp__playwright__browser_navigate({ url: "..." })

// Context (ALWAYS FIRST)
mcp__playwright__browser_snapshot()

// Batch input (PREFERRED)
mcp__playwright__browser_fill_form({ fields: [...] })

// Individual input (AVOID LOOPS)
mcp__playwright__browser_type({ element: "...", ref: "...", text: "..." })

// Interaction
mcp__playwright__browser_click({ element: "...", ref: "..." })

// Keyboard
mcp__playwright__browser_press_key({ key: "Escape" })

// Waiting
mcp__playwright__browser_wait_for({ time: 1 })  // seconds
mcp__playwright__browser_wait_for({ text: "..." })  // text appears

// Validation (DOM)
mcp__playwright__browser_snapshot()  // Then analyze results

// Validation (Visual - AVOID)
mcp__playwright__browser_take_screenshot({ ... })
```

### Decision Tree Template

```
1. Take snapshot → Understand context
   - Where am I? (page, view, state)
   - What's available? (elements, options)
   - What's selected? (filters, sections)

2. Plan actions → Batch when possible
   - Can I use fill_form? (multiple fields)
   - Do I need intermediate waits? (state changes)
   - How will I validate? (DOM properties)

3. Execute → Minimize operations
   - Batch operations together
   - Take snapshots only when needed for refs
   - Wait only after state-changing actions

4. Validate → DOM queries first
   - Check element presence
   - Verify attributes/properties
   - Count elements
   - Screenshot only if visual verification required
```

---

## 🔒 Important URLs & Credentials

### Base URL
- Local development: `http://localhost:3000`
- **ALWAYS include** `/app` prefix in paths

### Test Credentials
- Email: `Renee.Waters61@gmail.com`
- Password: `password`

### Key Routes
- Login: `/app/auth/sign-in`
- Scheduler: `/app/scheduler` (default after login)
- Request List: `/app/request-list`
- Settings: `/app/settings`

---

## ✅ Pre-Flight Checklist

Before starting any UI automation task:

- [ ] Read this document in full
- [ ] Understand the user's goal (what outcome do they want?)
- [ ] Identify which workflows are needed (auth, calendar setup, etc.)
- [ ] Plan the operation sequence (context → batch → validate)
- [ ] Know how to validate success (which DOM properties to check)
- [ ] Estimate MCP call count (should be <15 for most tasks)

---

## 🎯 Success Metrics

### Target Performance
- **Authentication**: 3-4 MCP calls, <2 seconds
- **Calendar setup**: 7-10 MCP calls, ~5 seconds
- **View shifts**: 5-8 MCP calls, ~5 seconds
- **Search/filter**: 3-5 MCP calls, ~3 seconds

### Quality Indicators
- ✅ Used `take_snapshot` for 90%+ of validations
- ✅ Used `fill_form` for multi-field inputs
- ✅ Context-aware decisions (analyzed state before acting)
- ✅ Minimal MCP calls (batch operations)
- ✅ Fast execution (DOM queries, not screenshots)

### Red Flags
- ❌ More than 3 screenshots in a single workflow
- ❌ Loop of individual `fill` calls
- ❌ Blind clicking without snapshot analysis
- ❌ Forgot to select sections (shifts not appearing)
- ❌ Forgot `/app` prefix (404 errors)

---

## 📚 Version History

- **v1.0** (2025-11-03): Initial AI-optimized automation guide
  - Consolidates UI_RECIPES.md and UI_RECIPES_USAGE_GUIDE.md
  - Focuses on AI execution patterns, not human reference
  - Emphasizes performance, context awareness, batch operations
  - Provides decision trees and complete workflow examples
  - Targets 5-7x speed improvement over screenshot-based approaches

---

**Remember**: You are an AI agent executing these workflows. Think in terms of:
- **Context first** - What's the current state?
- **Batch operations** - Can I combine actions?
- **DOM validation** - Can I check properties instead of visuals?
- **Speed** - How can I minimize MCP calls?

**Goal**: Execute UI automation 5-10x faster than screenshot-based approaches while being context-aware and intelligent.
