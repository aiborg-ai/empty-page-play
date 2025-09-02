# InnoSpot Playwright Testing Guide

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Improved Test Suites](#improved-test-suites)
- [Writing New Tests](#writing-new-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)
- [Common Issues & Solutions](#common-issues--solutions)

## Overview

This guide provides comprehensive documentation for the Playwright end-to-end testing suite for the InnoSpot Patent Intelligence Platform. The test suite includes both standard and improved versions with enhanced resilience, better selectors, and robust wait strategies.

## Installation

### Prerequisites
- Node.js 16+ installed
- InnoSpot application set up locally
- Chrome, Firefox, or Safari browser

### Install Playwright

```bash
# Install Playwright and its dependencies
npm install --save-dev @playwright/test

# Install browsers (Chrome, Firefox, WebKit)
npx playwright install

# Install system dependencies (Linux only)
npx playwright install-deps
```

### Verify Installation

```bash
# Check Playwright version
npx playwright --version

# Run a simple test
npx playwright test tests/basic-smoke.spec.ts
```

## Test Structure

```
tests/
├── Standard Tests
│   ├── auth.spec.ts              # Basic authentication tests
│   ├── navigation.spec.ts        # Basic navigation tests
│   ├── showcase.spec.ts          # Basic showcase tests
│   ├── cms-studio.spec.ts        # CMS Studio tests
│   ├── search-filter.spec.ts     # Search & filter tests
│   └── innovation-hub.spec.ts    # Innovation Hub tests
│
├── Improved Tests (Recommended)
│   ├── auth-improved.spec.ts     # Enhanced auth with better selectors
│   ├── navigation-improved.spec.ts # Navigation with retry logic
│   └── showcase-improved.spec.ts  # Showcase with wait strategies
│
└── Utility Tests
    ├── basic-smoke.spec.ts       # Quick smoke tests
    └── simple-test.spec.ts       # Diagnostic tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run all improved tests (recommended)
npx playwright test tests/*-improved.spec.ts

# Run specific test file
npx playwright test tests/auth-improved.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run with specific timeout
npx playwright test --timeout=60000
```

### NPM Scripts

```bash
# Quick test commands
npm run test:auth        # Run authentication tests
npm run test:nav         # Run navigation tests
npm run test:showcase    # Run showcase tests
npm run test:cms         # CMS Studio tests
npm run test:search      # Search/Filter tests
npm run test:innovation  # Innovation Hub tests

# Utility commands
npm run test:headed      # Run with browser visible
npm run test:debug       # Run in debug mode
npm run test:ui          # Open Playwright UI
npm run test:report      # View last test report
npm run test:codegen     # Generate new tests
```

## Test Suites

### Standard Test Suites

These are the original test suites with basic selectors and assertions:

| Test Suite | Tests | Description |
|------------|-------|-------------|
| `auth.spec.ts` | 10 | Login, logout, registration |
| `navigation.spec.ts` | 15 | Sidebar, breadcrumbs, menus |
| `showcase.spec.ts` | 15 | Capabilities, filtering, search |
| `cms-studio.spec.ts` | 14 | Asset management, CRUD operations |
| `search-filter.spec.ts` | 14 | Patent search, filters, sorting |
| `innovation-hub.spec.ts` | 10 | AI tools, visualizations |

## Improved Test Suites

### 🌟 Enhanced Test Files (Recommended)

These improved tests include better selectors, wait strategies, and error handling:

#### 1. **Authentication Tests - Improved** (`auth-improved.spec.ts`)

**Key Features:**
- Multiple selector strategies for resilience
- Smart wait functions for React initialization
- Handles both manual login and auto-login scenarios
- Session persistence verification

**Test Cases:**
```typescript
✓ Display login form on initial visit
✓ Navigate between login and register forms
✓ Login with demo user credentials
✓ Handle invalid credentials gracefully
✓ Validate email format
✓ Show/hide password toggle
✓ Handle quick demo login buttons
✓ Persist login state
```

**Usage Example:**
```typescript
// Helper function with smart waiting
async function waitForAppReady(page: Page) {
  await page.waitForLoadState('networkidle');
  const spinner = page.locator('.spinner, .loading');
  if (await spinner.count() > 0) {
    await spinner.waitFor({ state: 'hidden', timeout: 10000 });
  }
  await page.waitForTimeout(1000); // React render time
}
```

#### 2. **Navigation Tests - Improved** (`navigation-improved.spec.ts`)

**Key Features:**
- Retry logic for flaky navigation elements
- Smart login detection (skips if already logged in)
- Responsive viewport testing
- Keyboard navigation support

**Test Cases:**
```typescript
✓ Display sidebar navigation
✓ Navigate to all main sections
✓ Handle breadcrumb navigation
✓ Toggle mobile menu
✓ Display user menu
✓ Handle keyboard navigation
✓ Maintain navigation state on refresh
```

**Retry Pattern Example:**
```typescript
async function clickNavItem(page: Page, text: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const selectors = [
        `aside >> text="${text}"`,
        `nav >> text="${text}"`,
        `button:has-text("${text}")`
      ];
      // Try multiple selectors...
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
}
```

#### 3. **Showcase Tests - Improved** (`showcase-improved.spec.ts`)

**Key Features:**
- Flexible card detection
- Smart search with debounce handling
- Category filtering with fallbacks
- Empty state handling

**Test Cases:**
```typescript
✓ Display showcase page with categories
✓ Filter by category
✓ Search for capabilities
✓ Display capability cards
✓ Open capability details
✓ Have action buttons on cards
✓ Sort capabilities
✓ Handle empty search results
✓ Display statistics or metrics
✓ Toggle view mode
```

## Writing New Tests

### Test Template with Best Practices

```typescript
import { test, expect, Page } from '@playwright/test';

// Helper: Wait for app initialization
async function waitForAppReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // React render buffer
  
  // Wait for loading indicators to disappear
  const loadingSelectors = ['.spinner', '.loading', '[data-testid="loading"]'];
  for (const selector of loadingSelectors) {
    const element = page.locator(selector);
    if (await element.count() > 0) {
      await element.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
  }
}

// Helper: Login with resilience
async function loginAsDemo(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForAppReady(page);
  
  // Check if already logged in
  const isLoggedIn = await page.locator('text=/Dashboard|Showcase/i').count() > 0;
  if (isLoggedIn) return;
  
  // Try multiple login strategies
  const strategies = [
    // Quick login button
    async () => {
      const quickBtn = page.locator('button:has-text("Use"):near(:text("demo@innospot.com"))');
      if (await quickBtn.count() > 0) {
        await quickBtn.first().click();
        return true;
      }
      return false;
    },
    // Manual form fill
    async () => {
      const email = page.locator('input[type="email"]').first();
      const password = page.locator('input[type="password"]').first();
      if (await email.isVisible() && await password.isVisible()) {
        await email.fill('demo@innospot.com');
        await password.fill('Demo123!@#');
        await page.locator('button[type="submit"]').first().click();
        return true;
      }
      return false;
    }
  ];
  
  for (const strategy of strategies) {
    if (await strategy()) {
      await waitForAppReady(page);
      break;
    }
  }
}

test.describe('Feature Tests with Best Practices', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('should perform action with multiple selectors', async ({ page }) => {
    // Use multiple selectors for resilience
    const selectors = [
      '[data-testid="target-element"]',  // Preferred: data-testid
      'button:has-text("Action")',       // Fallback: text content
      '.action-button',                  // Last resort: class
    ];
    
    let elementFound = false;
    for (const selector of selectors) {
      const element = page.locator(selector);
      if (await element.count() > 0 && await element.isVisible()) {
        await element.click();
        elementFound = true;
        break;
      }
    }
    
    expect(elementFound).toBeTruthy();
  });

  test('should handle dynamic content', async ({ page }) => {
    // Wait for dynamic content with timeout
    await page.waitForSelector('.dynamic-content', { 
      state: 'visible',
      timeout: 15000 
    }).catch(() => {
      // Graceful fallback
      console.log('Dynamic content not loaded, checking alternative');
    });
    
    // Alternative assertion
    const hasContent = await page.locator('.content, .alternative-content').count() > 0;
    expect(hasContent).toBeTruthy();
  });
});
```

## Best Practices

### 1. **Selector Strategy**

```typescript
// BEST: Use data-testid attributes
await page.click('[data-testid="submit-button"]');

// GOOD: Use semantic HTML and ARIA
await page.click('button[type="submit"]');
await page.click('[role="button"][aria-label="Submit"]');

// OK: Use text content (can break with i18n)
await page.click('button:has-text("Submit")');

// AVOID: Classes and IDs (can change frequently)
await page.click('.submit-btn');
await page.click('#submitButton');
```

### 2. **Wait Strategies**

```typescript
// Wait for network to settle
await page.waitForLoadState('networkidle');

// Wait for specific element
await page.waitForSelector('.content', { timeout: 10000 });

// Wait with fallback
await page.waitForSelector('.primary').catch(async () => {
  await page.waitForSelector('.fallback');
});

// Custom wait function
async function waitForAnimation(page: Page) {
  await page.waitForTimeout(500); // Animation duration
}
```

### 3. **Assertion Patterns**

```typescript
// Flexible assertions
const hasAuthForm = await page.locator('form').isVisible();
const hasDashboard = await page.locator('.dashboard').isVisible();
expect(hasAuthForm || hasDashboard).toBeTruthy();

// Retry assertions
await expect(async () => {
  const text = await page.locator('.status').textContent();
  expect(text).toContain('Ready');
}).toPass({ timeout: 10000 });

// Soft assertions (continue on failure)
await expect.soft(page.locator('.optional')).toBeVisible();
```

### 4. **Error Handling**

```typescript
// Graceful element checking
const element = page.locator('.maybe-exists');
if (await element.count() > 0) {
  await element.click();
}

// Try-catch for non-critical actions
try {
  await page.click('.nice-to-have');
} catch (error) {
  console.log('Optional element not found, continuing...');
}

// Timeout with custom message
await page.waitForSelector('.critical', { timeout: 5000 })
  .catch(() => {
    throw new Error('Critical element not found - app may not be initialized');
  });
```

## CI/CD Integration

### GitHub Actions Configuration

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npx playwright test tests/*-improved.spec.ts
      
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Debugging

### Visual Debugging

```bash
# Step through test execution
npx playwright test --debug

# See browser while running
npx playwright test --headed

# Slow down execution
npx playwright test --headed --slow-mo=1000

# Take screenshots on each step
npx playwright test --screenshot=on
```

### Trace Viewer

```bash
# Record trace on failure
npx playwright test --trace on-first-retry

# Record trace always
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Console Logging

```typescript
test('debug test', async ({ page }) => {
  // Log page URL
  console.log('Current URL:', page.url());
  
  // Log element count
  const count = await page.locator('.card').count();
  console.log('Found cards:', count);
  
  // Log page content
  const text = await page.locator('body').innerText();
  console.log('Page text:', text.substring(0, 200));
  
  // Take debug screenshot
  await page.screenshot({ path: 'debug.png' });
});
```

## Troubleshooting

### Common Issues and Solutions

#### 1. **Tests Timing Out**

**Problem:** Tests fail with timeout errors

**Solutions:**
```typescript
// Increase test timeout
test.setTimeout(60000); // 60 seconds

// Increase action timeout in config
use: {
  actionTimeout: 30000,
  navigationTimeout: 60000,
}

// Add explicit waits
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000); // React render buffer
```

#### 2. **Element Not Found**

**Problem:** Cannot find element on page

**Solutions:**
```typescript
// Use multiple selectors
const selectors = [
  '[data-testid="element"]',
  'button:has-text("Text")',
  '.fallback-class'
];

for (const selector of selectors) {
  if (await page.locator(selector).count() > 0) {
    await page.locator(selector).click();
    break;
  }
}

// Wait for element
await page.waitForSelector('.element', { 
  state: 'visible',
  timeout: 15000 
});

// Check if element exists before interacting
if (await page.locator('.element').count() > 0) {
  await page.locator('.element').click();
}
```

#### 3. **Flaky Tests**

**Problem:** Tests pass sometimes, fail others

**Solutions:**
```typescript
// Add retry logic
async function clickWithRetry(page: Page, selector: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.click(selector);
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
}

// Wait for animations
await page.waitForTimeout(500); // Animation buffer

// Wait for network
await page.waitForLoadState('networkidle');

// Use stable selectors
await page.click('[data-testid="stable-element"]');
```

#### 4. **Authentication Issues**

**Problem:** Login fails or app auto-logs in

**Solutions:**
```typescript
// Check if already logged in
const isLoggedIn = await page.locator('.dashboard').count() > 0;
if (!isLoggedIn) {
  // Perform login
}

// Try multiple login methods
const quickLogin = page.locator('button:has-text("Quick Login")');
if (await quickLogin.count() > 0) {
  await quickLogin.click();
} else {
  // Manual login
  await page.fill('input[type="email"]', 'user@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
}

// Clear storage between tests
test.beforeEach(async ({ context }) => {
  await context.clearCookies();
  await context.clearPermissions();
});
```

#### 5. **React/SPA Issues**

**Problem:** Page not fully loaded, React components not rendered

**Solutions:**
```typescript
// Wait for React to initialize
async function waitForReact(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // React render buffer
  
  // Wait for React indicator
  await page.waitForFunction(() => {
    return window.React || document.querySelector('[data-reactroot]');
  });
}

// Wait for specific React component
await page.waitForSelector('[data-testid="app-ready"]', {
  timeout: 30000
});

// Check for loading spinners
const spinner = page.locator('.spinner, .loading');
if (await spinner.count() > 0) {
  await spinner.waitFor({ state: 'hidden' });
}
```

## Configuration Reference

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  // Timeouts
  timeout: 30000,           // 30s per test
  expect: {
    timeout: 10000,         // 10s for assertions
  },
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,   // 15s for actions
    navigationTimeout: 30000, // 30s for navigation
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 8080,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## Test Data Reference

### Demo Users

```javascript
const DEMO_USERS = {
  demo: {
    email: 'demo@innospot.com',
    password: 'Demo123!@#',
    role: 'Standard User'
  },
  researcher: {
    email: 'researcher@innospot.com',
    password: 'Research123!@#',
    role: 'Research User'
  },
  commercial: {
    email: 'commercial@innospot.com',
    password: 'Commercial123!@#',
    role: 'Commercial User'
  }
};
```

## Quick Reference

### Most Common Commands

```bash
# Development
npm run dev                                    # Start app
npx playwright test --debug                    # Debug tests
npx playwright test --headed                   # Watch tests run
npx playwright codegen http://localhost:8080   # Generate tests

# Running Tests
npm test                                        # Run all tests
npx playwright test tests/*-improved.spec.ts   # Run improved tests
npx playwright test --grep @smoke              # Run by tag
npx playwright test --project=chromium         # Specific browser

# Reports
npx playwright show-report                     # View HTML report
npx playwright test --reporter=list            # Console output
npx playwright test --reporter=json            # JSON output

# Debugging
npx playwright test --trace on                 # Record trace
npx playwright show-trace trace.zip            # View trace
npx playwright test --screenshot=on            # Screenshots
```

## Performance Tips

1. **Run tests in parallel** (default behavior)
2. **Use `--grep` to run specific tests** during development
3. **Reuse authentication state** between tests when possible
4. **Use `test.describe.serial()` only when necessary**
5. **Implement Page Object Model** for complex pages
6. **Cache selectors** in variables when used multiple times
7. **Use `test.skip()` for known issues** instead of commenting out

## Support & Resources

- **Playwright Documentation:** https://playwright.dev
- **GitHub Issues:** Report bugs in the repository
- **Best Practices:** https://playwright.dev/docs/best-practices
- **API Reference:** https://playwright.dev/docs/api/class-playwright
- **Community:** https://github.com/microsoft/playwright/discussions

---

*Last Updated: 2024*
*Playwright Version: 1.54.2*
*InnoSpot Version: 2.0.0*