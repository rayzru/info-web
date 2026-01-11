# Playwright Testing Guide - Frontend E2E Testing

## Overview

This guide covers end-to-end (E2E) testing with Playwright for the frontend application. Playwright provides automated browser testing with support for authentication, network interception, and visual testing.

## Table of Contents

1. [Setup and Configuration](#setup-and-configuration)
2. [Authentication Flow](#authentication-flow)
3. [Writing Tests](#writing-tests)
4. [Running Tests](#running-tests)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)
7. [Debugging](#debugging)

## Setup and Configuration

### Prerequisites

---

**For AI agents**: See [PLAYWRIGHT_MCP_AUTOMATION.md](../instructions/PLAYWRIGHT_MCP_AUTOMATION.md) for AI-optimized automation patterns with Playwright MCP.

---

- Bun package manager installed
- Development server running (`bun dev`)
- Backend API accessible

### Project Structure

```
front-end.iss-free/
├── playwright.config.ts          # Playwright configuration
├── tests/                         # Test files
│   ├── auth.setup.ts             # Authentication setup
│   └── *.spec.ts                 # Test specifications
└── playwright/                    # Playwright artifacts
    ├── .auth/                    # Authentication state (gitignored)
    └── test-results/             # Test results and screenshots
```

### Configuration

The `playwright.config.ts` file contains:

- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Test Directory**: `./tests`
- **Setup Project**: Runs `auth.setup.ts` before all tests
- **Browser Projects**: Chromium, Firefox, WebKit (all use authenticated state)
- **Web Server**: Automatically starts dev server if not running

## Authentication Flow

### How It Works

1. The `tests/auth.setup.ts` file runs BEFORE all tests
2. It logs in with test credentials and saves the session state
3. All subsequent tests use this saved authentication state
4. No need to manually log in for each test

### Authentication Setup File

Located at `tests/auth.setup.ts`:

```typescript
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/scheduler.json';

setup('authenticate as scheduler', async ({ page }) => {
  // Navigate to login
  await page.goto('/app/auth/sign-in');
  await page.waitForLoadState('networkidle');

  // Fill credentials
  await page.locator('input[type="email"]').fill('Renee.Waters61@gmail.com');
  await page.locator('input[type="password"]').fill('password');

  // Submit and wait for navigation
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/app/**', { timeout: 10000 });

  // Verify authentication
  await expect(page.getByRole('heading', { name: 'Schedule' })).toBeVisible({ timeout: 10000 });

  // Save authenticated state
  await page.context().storageState({ path: authFile });
});
```

### Test Credentials

**Scheduler Role**:
- Email: `Renee.Waters61@gmail.com`
- Password: `password`

**Important**: Never commit authentication files. The `playwright/.auth/` directory is gitignored.

## Writing Tests

### Basic Test Structure

```typescript
import { expect, test } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate to page (authentication is automatic)
    await page.goto('/app/scheduler');
    await page.waitForLoadState('networkidle');

    // Interact with elements
    const button = page.getByRole('button', { name: 'Click Me' });
    await button.click();

    // Assert expectations
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Locator Strategies

**Prefer semantic locators** (in order of preference):

1. **By Role** (BEST):
```typescript
page.getByRole('button', { name: 'Sign In' })
page.getByRole('heading', { name: 'Schedule' })
page.getByRole('combobox')
```

2. **By Text**:
```typescript
page.getByText('Welcome')
page.getByLabel('Email Address')
```

3. **By Test ID** (for dynamic content):
```typescript
page.getByTestId('user-list')
```

4. **CSS Selectors** (last resort):
```typescript
page.locator('[cmdk-list]')
page.locator('.sections-combobox')
```

### Waiting for Elements

```typescript
// Wait for element to be visible
await element.waitFor({ state: 'visible', timeout: 10000 });

// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for URL change
await page.waitForURL('**/app/scheduler');

// Wait using expect (preferred)
await expect(element).toBeVisible({ timeout: 10000 });
```

## Running Tests

### Run All Tests

```bash
# Run all tests
bun playwright test

# Run specific test file
bun playwright test tests/sections-combobox-height.spec.ts

# Run in headed mode (see browser)
bun playwright test --headed

# Run specific browser
bun playwright test --project=chromium
```

### UI Mode (Interactive Testing)

```bash
# Open Playwright UI
bun playwright test --ui
```

### Show Report

```bash
# Open HTML report
bun playwright show-report
```

## Best Practices

### 1. Test Independence

Each test should be completely independent:

```typescript
test('independent test', async ({ page }) => {
  // Start fresh - don't rely on previous test state
  await page.goto('/app/scheduler');

  // Set up any required state
  // Perform actions
  // Verify results
});
```

### 2. Use Page Object Model for Complex Pages

```typescript
// page-objects/scheduler.page.ts
export class SchedulerPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/app/scheduler');
    await this.page.waitForLoadState('networkidle');
  }

  async openSectionsCombobox() {
    const button = this.page.locator('button[role="combobox"]').nth(1);
    await button.click();
  }

  async selectSection(sectionName: string) {
    await this.page.getByText(sectionName).click();
  }
}

// In test
test('use page object', async ({ page }) => {
  const scheduler = new SchedulerPage(page);
  await scheduler.goto();
  await scheduler.openSectionsCombobox();
  await scheduler.selectSection('Cardiology');
});
```

### 3. Explicit Waits Over Arbitrary Delays

```typescript
// ❌ BAD
await page.click('button');
await page.waitForTimeout(2000);

// ✅ GOOD
await page.click('button');
await expect(page.getByText('Success')).toBeVisible();
```

### 4. Handle Dynamic Content

```typescript
// Wait for specific content to load
await expect(page.locator('[cmdk-list]')).toContainText('Section Name');

// Wait for network requests
await page.waitForResponse(resp =>
  resp.url().includes('/api/graphql') && resp.status() === 200
);
```

### 5. Test Accessibility

```typescript
import { expect, test } from '@playwright/test';

test('should be accessible', async ({ page }) => {
  await page.goto('/app/scheduler');

  // Check for proper ARIA attributes
  await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded');

  // Test keyboard navigation
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
});
```

## Common Patterns

### Testing Dropdowns/Comboboxes

```typescript
test('dropdown selection', async ({ page }) => {
  await page.goto('/app/scheduler');

  // Open dropdown
  const combobox = page.getByRole('combobox').first();
  await combobox.click();

  // Wait for dropdown content
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // Select option
  await page.getByText('Option Name').click();

  // Verify selection
  await expect(combobox).toHaveText('Option Name');
});
```

### Testing Forms

```typescript
test('form submission', async ({ page }) => {
  await page.goto('/app/settings');

  // Fill form
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');

  // Submit
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait for success
  await expect(page.getByText('Settings saved')).toBeVisible();
});
```

### Testing Modals/Dialogs

```typescript
test('modal interaction', async ({ page }) => {
  await page.goto('/app/scheduler');

  // Open modal
  await page.getByRole('button', { name: 'Create Shift' }).click();

  // Wait for modal
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();

  // Interact with modal
  await modal.getByLabel('Shift Name').fill('Night Shift');

  // Close modal
  await modal.getByRole('button', { name: 'Save' }).click();
  await expect(modal).not.toBeVisible();
});
```

### Testing with GraphQL

```typescript
test('graphql request', async ({ page }) => {
  // Intercept GraphQL request
  await page.route('**/api/graphql', async route => {
    const postData = route.request().postDataJSON();

    if (postData.operationName === 'GetSections') {
      // Mock response
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            sections: [{ id: '1', displayName: 'Test Section' }]
          }
        })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/app/scheduler');
});
```

## Debugging

### Visual Debugging

```bash
# Run in headed mode with slow motion
bun playwright test --headed --slow-mo=1000

# Debug specific test
bun playwright test --debug tests/my-test.spec.ts
```

### Screenshots and Videos

Automatically captured on failure (configured in `playwright.config.ts`):

```typescript
// Manual screenshot
await page.screenshot({ path: 'screenshot.png' });

// Screenshot of specific element
await element.screenshot({ path: 'element.png' });
```

### Console Logs

```typescript
test('with console logs', async ({ page }) => {
  // Listen to console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('/app/scheduler');
});
```

### Network Inspection

```typescript
test('network debugging', async ({ page }) => {
  // Log all network requests
  page.on('request', request =>
    console.log('>>', request.method(), request.url())
  );

  page.on('response', response =>
    console.log('<<', response.status(), response.url())
  );

  await page.goto('/app/scheduler');
});
```

## Integration with CI/CD

### Running in CI

```bash
# Install browsers (CI only)
bunx playwright install --with-deps

# Run tests in CI mode
bun playwright test --reporter=html
```

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  playwright-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: bun install
      - name: Install Playwright Browsers
        run: bunx playwright install --with-deps
      - name: Run Playwright tests
        run: bun playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Alignment with Testing Philosophy

This guide aligns with the project's testing philosophy from `CLAUDE.md`:

- ✅ **Test new features** - All new UI functionality requires E2E tests
- ✅ **Maintain coverage** - Don't reduce existing test coverage
- ✅ **Test edge cases** - Empty states, error conditions, boundary cases
- ✅ **Integration over mocking** - Prefer real browser/API tests
- ✅ **Run tests before completion** - `bun playwright test` before marking work done
- ✅ **90% frontend coverage goal** - Enforced by e2e-test-specialist workflow

## Testing Workflow Integration

Playwright tests integrate with the agent workflow:

1. **feature-builder** or **frontend-developer** creates the feature
2. **frontend-developer** routes to **e2e-test-specialist** for critical user flows (see [nfr-matrix.md](../context/nfr-matrix.md))
3. **e2e-test-specialist** writes Playwright tests with WCAG 2.1 AA compliance
4. Tests must pass before **code-reviewer** final audit
5. **test-analyzer** handles systematic failures (>3 tests)

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Assertions Guide](https://playwright.dev/docs/test-assertions)

## Support

For questions or issues:
- Check the [Playwright Discord](https://aka.ms/playwright/discord)
- Review existing tests in `/tests` directory
- Consult the e2e-test-specialist agents
