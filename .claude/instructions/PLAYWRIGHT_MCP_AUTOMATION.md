# Playwright MCP Automation - AI Execution Guide

**Purpose**: AI agent instructions for efficient Playwright MCP automation of the application.

**CRITICAL**: This document is written FOR AI AGENTS. Humans should read frontend testing guides.

---

## 🎯 AI Execution Principles
---

**For human developers**: See [PLAYWRIGHT_TESTING_GUIDE.md](../guidelines/PLAYWRIGHT_TESTING_GUIDE.md) for Playwright setup, configuration, and testing philosophy.

---

## Related Guidelines

**Token Efficiency**: Follow [TOKEN_EFFICIENCY.md](../guidelines/TOKEN_EFFICIENCY.md) principles:
- Use parallel tool calls when possible
- Prefer `take_snapshot` (50ms) over `take_screenshot` (1500ms)
- Batch operations with `fill_form` instead of loops

**Validation**: Follow [VALIDATION_PATTERNS.md](../guidelines/VALIDATION_PATTERNS.md):
- Critical UI changes (auth, PHI/PII) require Codex validation
- Visual testing for Medium+ risk changes with Figma designs

**Visual Testing**: See [VISUAL_TESTING_PROTOCOL.md](VISUAL_TESTING_PROTOCOL.md) for Figma design comparison workflow.

---


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

## ⚡ Simple Tasks Fast Path (< 5 MCP calls)

**For agents**: If your task fits one of these patterns, use this fast path. Otherwise, read full document below.

### Pattern 1: Navigate + Screenshot
```javascript
mcp__playwright__browser_navigate({ url: "http://localhost:3000/app/scheduler" })
mcp__playwright__browser_take_screenshot({ filename: "specs/visual-tests/scheduler.png" })
```
**Use when**: User wants visual proof of page state (no interaction needed)

### Pattern 2: Navigate + Element Screenshot
```javascript
mcp__playwright__browser_navigate({ url: "http://localhost:3000/app/scheduler" })
mcp__playwright__browser_snapshot()
mcp__playwright__browser_take_screenshot({
  element: "Dialog",
  ref: "[ref-from-snapshot]",
  filename: "specs/visual-tests/dialog.png"
})
```
**Use when**: User wants screenshot of specific visible element

### Pattern 3: Click + Screenshot
```javascript
mcp__playwright__browser_snapshot()
mcp__playwright__browser_click({ element: "Settings button", ref: "[ref-from-snapshot]" })
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({ filename: "specs/visual-tests/after_click.png" })
```
**Use when**: User wants to see result of single interaction

**If your task is NOT one of these simple patterns** (e.g., requires authentication, complex interactions, form filling), continue reading full document below.

---

## 🎯 Chrome DevTools vs Playwright Decision Tree

**Choose the right tool for your task:**

### Use Chrome DevTools MCP (`claude --chrome`)

**When**:
- ✅ **Development debugging** - Real-time console errors, network inspection
- ✅ **UI verification during development** - Live browser with authenticated session
- ✅ **Testing with authenticated sessions** - Uses existing Chrome login state (session sharing)
- ✅ **Console error investigation** - Native console API access
- ✅ **Visual testing with live feedback** - GIF recording, interactive debugging
- ✅ **Interactive workflows** - Can pause for manual input (CAPTCHAs, confirmations)

**Advantages**:
- Session sharing (skip re-authentication 70% of the time)
- Console logs and network requests inspection
- GIF recording for documentation
- Live debugging with visible browser state

**Limitations**:
- Chrome only (no Firefox, Safari)
- Requires visible browser window (no headless mode)
- Beta feature (less stable than Playwright)
- WSL not supported

**Token Efficiency**:
- Existing session: 450 tokens vs 1,500 (70% savings)
- Console inspection: Direct API vs manual screenshot analysis

### Use Playwright MCP

**When**:
- ✅ **Formal E2E test suites** - Headless automation for CI/CD
- ✅ **Cross-browser testing** - Chrome, Firefox, Safari support
- ✅ **Visual regression testing** - Screenshot comparison workflows
- ✅ **Automated test runs** - No user interaction needed
- ✅ **Stable production testing** - Mature, reliable, production-ready

**Advantages**:
- Headless automation (CI/CD friendly)
- Cross-browser support
- Mature and stable
- Screenshot-based visual regression

**Limitations**:
- No session sharing (must re-authenticate each time)
- No console inspection capabilities
- No GIF recording
- Cannot pause for manual input

**Token Efficiency**:
- Consistent performance (no session variability)
- Optimized for batch operations

### Decision Matrix

| Use Case | Recommended Tool | Rationale |
|----------|-----------------|-----------|
| **Implementing new feature** → verify it works | Chrome DevTools | Session sharing, console errors, live debugging |
| **Visual testing against Figma** | Chrome DevTools | Live browser, authenticated session, GIF recording |
| **Debugging "app not working" issue** | Chrome DevTools | Console inspection, network analysis, real-time errors |
| **Pre-commit verification** | Chrome DevTools | Fast (session sharing), console check, visual verification |
| **Writing E2E test suite** | Playwright | Headless, cross-browser, CI/CD integration |
| **Visual regression tests (automated)** | Playwright | Screenshot comparison, stable baselines |
| **Cross-browser compatibility testing** | Playwright | Multi-browser support |

### Skills Integration

**Chrome DevTools Skills** (use with `claude --chrome`):
- `/debug-console` - Capture and analyze console errors (60% token savings)
- `/auth-verify` - Authenticate with session sharing (70% token savings when session exists)
- `/visual-test-figma` - Live visual comparison with Figma designs

**Playwright Workflows** (no Chrome required):
- E2E test creation (headless, CI/CD)
- Cross-browser testing
- Screenshot-based visual regression

**Rule of Thumb**: Chrome DevTools for development/debugging, Playwright for testing/CI.

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

### Token Efficiency Metrics

**Goal**: Minimize tokens consumed while maintaining quality (see [TOKEN_EFFICIENCY.md](../guidelines/TOKEN_EFFICIENCY.md))

| Pattern | MCP Calls | Time | Tokens Read | Efficiency Rating |
|---------|-----------|------|-------------|-------------------|
| Simple screenshot | 2 | 1.5s | 500 | ✅ Optimal |
| Login workflow | 4-6 | 2-5s | 1,500 | ✅ Optimal |
| Calendar setup | 7-10 | 5s | 3,000 | ✅ Good |
| Complex workflow | 8-15 | 5-12s | 5,000 | ✅ Good |
| Screenshot-based (OLD) | 20+ | 30s+ | 10,000+ | ❌ Avoid |

**Token Efficiency Rules** (from [TOKEN_EFFICIENCY.md](../guidelines/TOKEN_EFFICIENCY.md)):

1. **Parallel tool calls** → Reduce API round-trips (save 30-50% tokens)
2. **Bounded exploration** → Use `head_limit` on snapshots (save 80-95% tokens)
3. **DOM validation** → `snapshot` (50 tokens) > `screenshot` (2,000 tokens)
4. **Batch operations** → `fill_form` > loop of individual fills (save 40-60% tokens)
5. **Skip full read** → Use Simple Tasks fast path if task is simple (save 90% tokens)

**Performance Targets**:
- Simple tasks (<5 MCP calls): <1,000 tokens
- Complex workflows (5-15 calls): <5,000 tokens
- Token waste: <5% (failed/duplicate operations)
- Success rate: >95% (context-aware execution)

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

**Format**: Concise workflow tables (see Simple Tasks section for basic patterns)

| Workflow | Prerequisites | Key Steps | Operations | Success Criteria |
|----------|--------------|-----------|------------|------------------|
| **Show all shifts for today** | snapshot → check auth + sections | 1. snapshot → verify today visible<br>2. click +X more (if exists)<br>3. snapshot → count shifts | 8-12 calls<br>5-8 sec | [data-kind="shift"] count > 0 in today's cell or day view |
| **Verify login works (E2E test)** | none | 1. navigate → /auth/sign-in<br>2. snapshot → get refs<br>3. fill_form → email/password<br>4. click → Sign in<br>5. wait 2s<br>6. snapshot → verify URL, avatar | 6 calls<br>5 sec | URL = /app/*, [data-slot="avatar"] present, "Schedule" heading exists |
| **Find Support shifts on Oct 31** | snapshot → check auth + sections | 1. snapshot → find [data-date="2025-10-31"]<br>2. click → Oct 31 cell or +X more<br>3. type → "Support" in search<br>4. snapshot → count filtered shifts | 10-15 calls<br>8-12 sec | [data-kind="shift"] containing "Support" text, count > 0 |

### Context-Aware Workflow Pattern

**All complex workflows follow this pattern**:

```javascript
// 1. Check prerequisites (snapshot → parse state)
mcp__playwright__browser_snapshot()
// Parse: authenticated? ([data-slot="avatar"] exists)
// Parse: sections selected? (combobox shows "+N more")
// Parse: correct page/view? (URL, headings, dialogs)

// 2. Execute missing prerequisites (if needed)
if (!authenticated) { /* run auth workflow */ }
if (!sections_selected) { /* run calendar setup */ }

// 3. Execute main task (batched operations)
mcp__playwright__browser_click({ element: "...", ref: "..." })
mcp__playwright__browser_type({ element: "...", ref: "...", text: "..." })
// Wait after state changes: mcp__playwright__browser_wait_for({ time: 1 })

// 4. Validate with DOM (snapshot → query elements)
mcp__playwright__browser_snapshot()
// Query: [data-kind="shift"] count, text content, attributes
// Success: Expected elements exist with correct state
```

### Detailed Example Walkthrough

**Workflow**: "Show me all shifts for today"

**Step-by-step execution**:

1. **Initial context check**:
   - `snapshot` → Check for `[data-slot="avatar"]` (authenticated?)
   - `snapshot` → Check 2nd `[role="combobox"]` text (sections selected?)
   - If missing → Run prerequisite workflows first

2. **Navigate to today**:
   - `snapshot` → Find `[data-date="YYYY-MM-DD"]` for today
   - If not visible → Click "Today" button
   - `wait_for({ time: 1 })` → Wait for calendar refetch (500ms)

3. **Access day shifts**:
   - `snapshot` → Check today's cell for `+X more` text
   - If `+X more` exists → Click it to open day view
   - If not → Shifts already visible, count them

4. **Validate result**:
   - `snapshot` → Count `[data-kind="shift"]` elements
   - Report count and shift details to user

**Token efficiency**:
- Old approach: 200 lines of pseudocode (~4,000 tokens)
- New approach: 4-step table (~400 tokens)
- **Savings**: 90% token reduction

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
