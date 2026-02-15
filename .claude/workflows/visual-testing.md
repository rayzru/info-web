# Visual Testing Protocol

## Overview
All UI features with Figma design mocks MUST be visually tested using Playwright MCP to ensure pixel-perfect alignment with designs before considering implementation complete.

## Mandatory Visual Testing Requirements

### When Visual Testing is Required
Visual testing is MANDATORY for:
1. ✅ New UI components with Figma designs
2. ✅ UI component modifications that affect visual appearance
3. ✅ Layout changes to existing components
4. ✅ Styling updates (colors, spacing, typography, borders, shadows)
5. ✅ Responsive design implementations
6. ✅ Animation or transition implementations

### When Visual Testing Can Be Skipped
Visual testing may be skipped for:
1. ❌ Backend-only changes (API, database, business logic)
2. ❌ Changes without Figma designs or visual specifications
3. ❌ Pure data/state management changes with no UI impact
4. ❌ Unit test additions without UI changes

## Risk-Based Visual Testing

**Follow validation risk matrix** from [VALIDATION_PATTERNS.md](../guidelines/VALIDATION_PATTERNS.md):
- **Critical Risk** (PHI/PII UI, auth flows): Visual testing + Codex validation MANDATORY
- **High Risk** (Multi-component layouts): Visual testing MANDATORY
- **Medium Risk** (Single component with Figma): Visual testing RECOMMENDED
- **Low Risk** (Minor CSS tweaks): Visual testing OPTIONAL

**Token Efficiency**: See [TOKEN_EFFICIENCY.md](../guidelines/TOKEN_EFFICIENCY.md) for efficient screenshot workflows and when to use Playwright MCP vs manual testing.

**Browser Automation**: See [PLAYWRIGHT_MCP_AUTOMATION.md](PLAYWRIGHT_MCP_AUTOMATION.md) for AI-optimized automation patterns.

## Visual Testing Workflow

### Phase 1: Design Reference Acquisition
1. **Obtain Figma Node ID** from the design specification or issue
2. **Extract Figma Screenshot** using `mcp__figma__get_screenshot`
   ```typescript
   mcp__figma__get_screenshot({
     nodeId: "9406-230152", // From Figma URL: node-id=9406-230152
     clientLanguages: "typescript",
     clientFrameworks: "react,next.js"
   })
   ```
3. **Document design specifications** (colors, spacing, typography, layout)

### Phase 2: Implementation Screenshot
1. **Start the application** (if not already running)
   ```bash
   cd front-end.iss-free && bun run dev
   ```
2. **Use Playwright MCP** to capture implementation screenshot
   ```typescript
   // Navigate to the feature
   mcp__playwright__browser_navigate({ url: "http://localhost:3000/path" })

   // Take snapshot for interaction
   mcp__playwright__browser_snapshot()

   // Interact to reach desired state (e.g., open dialog, select item)
   mcp__playwright__browser_click({ element: "...", ref: "..." })

   // Take final screenshot
   mcp__playwright__browser_take_screenshot({
     filePath: "specs/visual-tests/[feature-name]_implementation.png",
     format: "png"
   })
   ```

### Phase 3: Visual Comparison & Verification
1. **Side-by-side comparison** of Figma vs Implementation
2. **Verify alignment** for:
   - ✅ **Layout structure** (flex, grid, positioning)
   - ✅ **Spacing** (padding, margin, gap)
   - ✅ **Typography** (font size, weight, line height, color)
   - ✅ **Colors** (background, text, borders, shadows)
   - ✅ **Component positioning** (header, sidebar, content areas)
   - ✅ **Responsive behavior** (if applicable)
   - ✅ **Interactive states** (hover, focus, active, disabled)

3. **Document discrepancies** in implementation tracking file
4. **Fix issues** and repeat Phase 2-3 until alignment is achieved

### Phase 4: Documentation
1. **Document visual test results** in spec file or commit message:
   ```markdown
   ## Visual Testing Results

   ### Test Date: 2025-10-13

   #### Figma Reference
   - Node ID: 9406-230152
   - Design URL: https://www.figma.com/design/...?node-id=9406-230152

   #### Implementation Screenshots
   - Location: specs/visual-tests/[feature-name]_implementation.png
   - Browser: Chrome (Playwright)
   - Viewport: 1280x720

   #### Verification Checklist
   - [x] Layout structure matches Figma
   - [x] Spacing is pixel-perfect
   - [x] Typography matches design tokens
   - [x] Colors match design system
   - [x] Component positioning correct
   - [ ] Discrepancy: Entity badge positioning off by 8px

   #### Issues Found
   1. **Entity badge positioning** - Badge appears 8px lower than design
      - Expected: Aligned with title baseline
      - Actual: Aligned with description baseline
      - Fix: Update flex items-start to items-center in header
   ```

2. **Commit visual test artifacts**:
   - Figma screenshots: `specs/visual-tests/[feature-name]_figma.png`
   - Implementation screenshots: `specs/visual-tests/[feature-name]_implementation_v[N].png`
   - Comparison annotations (if created): `specs/visual-tests/[feature-name]_comparison.png`

## Playwright MCP Commands Reference

### Browser Navigation
```typescript
// Navigate to URL
mcp__playwright__browser_navigate({ url: "http://localhost:3000/scheduler" })

// Navigate back
mcp__playwright__browser_navigate_back()
```

### Page Interaction
```typescript
// Take snapshot (required before interaction)
mcp__playwright__browser_snapshot()

// Click element
mcp__playwright__browser_click({
  element: "Settings button",
  ref: "ref-from-snapshot"
})

// Fill form field
mcp__playwright__browser_fill({
  uid: "ref-from-snapshot",
  value: "test input"
})

// Hover over element
mcp__playwright__browser_hover({ uid: "ref-from-snapshot" })
```

### Screenshot Capture
```typescript
// Full page screenshot
mcp__playwright__browser_take_screenshot({
  filePath: "specs/visual-tests/feature_fullpage.png",
  fullPage: true,
  format: "png"
})

// Element screenshot
mcp__playwright__browser_take_screenshot({
  element: "Settings dialog",
  ref: "ref-from-snapshot",
  filePath: "specs/visual-tests/feature_element.png",
  format: "png"
})

// Viewport screenshot (default)
mcp__playwright__browser_take_screenshot({
  filePath: "specs/visual-tests/feature_viewport.png",
  format: "png",
  quality: 90 // For JPEG/WebP only
})
```

### Browser Management
```typescript
// Resize browser
mcp__playwright__browser_resize({ width: 1280, height: 720 })

// List open pages
mcp__playwright__browser_tabs({ action: "list" })

// Create new tab
mcp__playwright__browser_tabs({ action: "new" })

// Close tab
mcp__playwright__browser_tabs({ action: "close", index: 1 })
```

## Integration with Feature Builder Workflow

### Updated Feature Builder Checklist
```markdown
- [ ] Implementation complete
- [ ] Code review approved
- [ ] **Visual testing complete (if UI changes with Figma designs)**
  - [ ] Figma screenshot extracted
  - [ ] Implementation screenshot captured
  - [ ] Visual comparison verified
  - [ ] All discrepancies documented and resolved
- [ ] Automated tests written and passing
- [ ] Final Codex-high validation
```

## Common Visual Testing Scenarios

### Scenario 1: Dialog/Modal Component
```typescript
// 1. Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:3000/scheduler" })

// 2. Take snapshot
mcp__playwright__browser_snapshot()

// 3. Open dialog
mcp__playwright__browser_click({ element: "Settings button", ref: "..." })

// 4. Wait for dialog
mcp__playwright__browser_wait_for({ text: "Settings", timeout: 5000 })

// 5. Take snapshot of dialog
mcp__playwright__browser_snapshot()

// 6. Screenshot dialog
mcp__playwright__browser_take_screenshot({
  element: "Settings dialog",
  ref: "...",
  filePath: "specs/visual-tests/settings_dialog.png"
})
```

### Scenario 2: Form Component
```typescript
// Navigate and open form
mcp__playwright__browser_navigate({ url: "http://localhost:3000/users" })
mcp__playwright__browser_snapshot()

// Fill form fields
mcp__playwright__browser_fill_form({
  elements: [
    { uid: "first-name-input", value: "John" },
    { uid: "last-name-input", value: "Doe" }
  ]
})

// Screenshot filled form
mcp__playwright__browser_take_screenshot({
  filePath: "specs/visual-tests/user_form_filled.png"
})
```

### Scenario 3: Responsive Design
```typescript
// Desktop view
mcp__playwright__browser_resize({ width: 1920, height: 1080 })
mcp__playwright__browser_navigate({ url: "http://localhost:3000/scheduler" })
mcp__playwright__browser_take_screenshot({
  filePath: "specs/visual-tests/scheduler_desktop.png",
  fullPage: true
})

// Tablet view
mcp__playwright__browser_resize({ width: 768, height: 1024 })
mcp__playwright__browser_take_screenshot({
  filePath: "specs/visual-tests/scheduler_tablet.png",
  fullPage: true
})

// Mobile view
mcp__playwright__browser_resize({ width: 375, height: 667 })
mcp__playwright__browser_take_screenshot({
  filePath: "specs/visual-tests/scheduler_mobile.png",
  fullPage: true
})
```

## Error Handling

### Common Issues and Solutions

1. **Element not found**
   - **Cause**: Snapshot not taken before interaction
   - **Solution**: Always call `mcp__playwright__browser_snapshot()` before interactions

2. **Screenshot too dark/light**
   - **Cause**: Theme or contrast issues
   - **Solution**: Verify theme settings, check CSS variables

3. **Layout shifts during screenshot**
   - **Cause**: Animations or loading states
   - **Solution**: Wait for elements to stabilize using `mcp__playwright__browser_wait_for()`

4. **Dialog/modal not visible**
   - **Cause**: Z-index or positioning issues
   - **Solution**: Verify dialog is actually open, check console messages

## Best Practices

1. ✅ **Always extract Figma screenshots first** before implementation
2. ✅ **Document viewport sizes** used for screenshots
3. ✅ **Test all interactive states** (default, hover, focus, disabled)
4. ✅ **Capture both full page and component-level screenshots**
5. ✅ **Use consistent naming conventions** for screenshot files
6. ✅ **Commit all visual test artifacts** to version control
7. ✅ **Update implementation tracking files** with visual test results
8. ✅ **Retest after fixing discrepancies** to verify alignment

## Automation Opportunities

Consider automating visual regression testing using:
- Playwright's `toHaveScreenshot()` matcher
- Percy, Chromatic, or similar visual testing platforms
- CI/CD integration for automated visual diffs

## Checklist for Agents

Before marking any UI feature as complete, verify:

- [ ] Figma node ID obtained and screenshot extracted
- [ ] Implementation screenshot captured using Playwright MCP
- [ ] Visual comparison performed (layout, spacing, typography, colors)
- [ ] All discrepancies documented in implementation tracking file
- [ ] Screenshots committed to `specs/visual-tests/` directory
- [ ] Implementation tracking file updated with visual test results
- [ ] No visual regressions introduced to other components
- [ ] Responsive behavior tested (if applicable)
- [ ] Interactive states tested (if applicable)

---

**IMPORTANT**: This protocol MUST be followed for all UI implementations with Figma designs. Skipping visual testing may result in UI inconsistencies and user experience issues.
