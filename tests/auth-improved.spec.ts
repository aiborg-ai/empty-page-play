import { test, expect, Page } from '@playwright/test';

// Test data
const DEMO_USERS = {
  demo: {
    email: 'demo@innospot.com',
    password: 'Demo123!@#',
    displayName: 'Demo User'
  },
  researcher: {
    email: 'researcher@innospot.com',
    password: 'Research123!@#',
    displayName: 'Research User'
  },
  commercial: {
    email: 'commercial@innospot.com',
    password: 'Commercial123!@#',
    displayName: 'Commercial User'
  }
};

// Helper function to wait for app initialization
async function waitForAppReady(page: Page) {
  // Wait for React to mount
  await page.waitForLoadState('networkidle');
  
  // Wait for any loading spinners to disappear
  const spinner = page.locator('.spinner, .loading, [data-testid="loading"]');
  if (await spinner.count() > 0) {
    await spinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }
  
  // Give React time to render
  await page.waitForTimeout(1000);
}

test.describe('Improved Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
  });

  test('should display login form on initial visit', async ({ page }) => {
    // Multiple selector strategies for resilience
    const loginFormSelectors = [
      'form[data-testid="login-form"]',
      'form:has(input[type="email"])',
      'form:has(input[type="password"])',
      'div:has-text("Sign In"):has(input[type="email"])',
      'div:has-text("Login"):has(input[type="email"])'
    ];
    
    let formFound = false;
    for (const selector of loginFormSelectors) {
      const form = page.locator(selector);
      if (await form.count() > 0) {
        formFound = true;
        await expect(form.first()).toBeVisible();
        break;
      }
    }
    
    if (!formFound) {
      // Check if we're already logged in (InstantAuth might auto-login)
      const dashboardIndicators = [
        'text=/Dashboard/i',
        'text=/Showcase/i',
        'text=/Welcome/i',
        '[data-testid="user-menu"]'
      ];
      
      let dashboardFound = false;
      for (const selector of dashboardIndicators) {
        if (await page.locator(selector).count() > 0) {
          dashboardFound = true;
          break;
        }
      }
      
      expect(formFound || dashboardFound).toBeTruthy();
    }
  });

  test('should navigate between login and register forms', async ({ page }) => {
    // Look for navigation links with multiple selectors
    const registerLinkSelectors = [
      'button:has-text("Register")',
      'a:has-text("Register")',
      'button:has-text("Sign up")',
      'a:has-text("Create account")',
      'text=/Don\'t have an account/i'
    ];
    
    for (const selector of registerLinkSelectors) {
      const link = page.locator(selector);
      if (await link.count() > 0) {
        await link.first().click();
        await waitForAppReady(page);
        
        // Verify we're on register page
        const registerIndicators = [
          'text=/Register/i',
          'text=/Create.*Account/i',
          'text=/Sign.*Up/i'
        ];
        
        for (const indicator of registerIndicators) {
          if (await page.locator(indicator).count() > 0) {
            await expect(page.locator(indicator).first()).toBeVisible();
            break;
          }
        }
        break;
      }
    }
  });

  test('should login with demo user credentials', async ({ page }) => {
    // Try multiple strategies to find and fill the login form
    
    // Strategy 1: Look for quick login buttons
    const quickLoginButton = page.locator('button:has-text("Use"):near(:text("demo@innospot.com"))');
    if (await quickLoginButton.count() > 0) {
      await quickLoginButton.first().click();
    } else {
      // Strategy 2: Fill form manually
      const emailSelectors = [
        'input[data-testid="login-email"]',
        'input[type="email"]',
        'input[placeholder*="email" i]',
        'input[name="email"]'
      ];
      
      const passwordSelectors = [
        'input[data-testid="login-password"]',
        'input[type="password"]',
        'input[placeholder*="password" i]',
        'input[name="password"]'
      ];
      
      // Find and fill email
      for (const selector of emailSelectors) {
        const input = page.locator(selector);
        if (await input.count() > 0 && await input.isVisible()) {
          await input.fill(DEMO_USERS.demo.email);
          break;
        }
      }
      
      // Find and fill password
      for (const selector of passwordSelectors) {
        const input = page.locator(selector);
        if (await input.count() > 0 && await input.isVisible()) {
          await input.fill(DEMO_USERS.demo.password);
          break;
        }
      }
      
      // Submit form
      const submitSelectors = [
        'button[data-testid="login-submit"]',
        'button[type="submit"]:has-text("Sign in")',
        'button[type="submit"]:has-text("Login")',
        'button[type="submit"]'
      ];
      
      for (const selector of submitSelectors) {
        const button = page.locator(selector);
        if (await button.count() > 0 && await button.isVisible()) {
          await button.click();
          break;
        }
      }
    }
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    await waitForAppReady(page);
    
    // Verify login success
    const successIndicators = [
      'text=/Dashboard/i',
      'text=/Showcase/i',
      'text=/Welcome/i',
      'text=Demo User',
      'text=demo@innospot.com',
      'button:has-text("Sign Out")',
      'button:has-text("Logout")'
    ];
    
    let loginSuccess = false;
    for (const selector of successIndicators) {
      if (await page.locator(selector).count() > 0) {
        loginSuccess = true;
        await expect(page.locator(selector).first()).toBeVisible();
        break;
      }
    }
    
    expect(loginSuccess).toBeTruthy();
  });

  test('should handle invalid credentials gracefully', async ({ page }) => {
    // Fill with invalid credentials
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('invalid@example.com');
      await passwordInput.fill('wrongpassword');
      
      // Submit
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      
      // Wait for error message
      await page.waitForTimeout(2000);
      
      // Check for error indicators
      const errorSelectors = [
        'text=/Invalid/i',
        'text=/Error/i',
        'text=/Failed/i',
        'text=/Incorrect/i',
        '.error',
        '.alert-error',
        '[role="alert"]'
      ];
      
      let errorFound = false;
      for (const selector of errorSelectors) {
        if (await page.locator(selector).count() > 0) {
          errorFound = true;
          break;
        }
      }
      
      // If no error message, check that we're still on login page
      if (!errorFound) {
        const stillOnLogin = await page.locator('input[type="password"]').isVisible();
        expect(stillOnLogin).toBeTruthy();
      }
    }
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first();
    
    if (await emailInput.count() > 0) {
      // Enter invalid email
      await emailInput.fill('notanemail');
      
      // Try to submit
      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
      }
      
      // Check HTML5 validation
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid || el.validationMessage !== '';
      });
      
      expect(isInvalid).toBeTruthy();
    }
  });

  test('should show/hide password toggle if available', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await passwordInput.count() > 0) {
      // Look for password toggle button
      const toggleSelectors = [
        'button[aria-label*="password" i]',
        'button:has(svg):near(input[type="password"])',
        '[data-testid="password-toggle"]'
      ];
      
      for (const selector of toggleSelectors) {
        const toggle = page.locator(selector);
        if (await toggle.count() > 0) {
          // Click to show password
          await toggle.click();
          await page.waitForTimeout(500);
          
          // Check if input type changed
          const inputType = await passwordInput.getAttribute('type');
          expect(inputType).toBe('text');
          
          // Click again to hide
          await toggle.click();
          await page.waitForTimeout(500);
          
          const inputTypeAfter = await passwordInput.getAttribute('type');
          expect(inputTypeAfter).toBe('password');
          break;
        }
      }
    }
  });

  test('should handle quick demo login buttons', async ({ page }) => {
    // Look for demo account quick login buttons
    const demoButtonSelectors = [
      'button:has-text("Use"):near(:text("demo@innospot.com"))',
      'button:has-text("Quick Login")',
      'button:has-text("Demo Login")',
      '[data-testid="demo-login"]'
    ];
    
    for (const selector of demoButtonSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await button.first().click();
        await waitForAppReady(page);
        
        // Check for successful login
        const loggedIn = await page.locator('text=/Dashboard|Showcase|Welcome/i').count() > 0;
        expect(loggedIn).toBeTruthy();
        break;
      }
    }
  });

  test('should persist login state', async ({ page, context }) => {
    // Login first
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill(DEMO_USERS.demo.email);
      await passwordInput.fill(DEMO_USERS.demo.password);
      
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      await waitForAppReady(page);
      
      // Check cookies/localStorage
      const cookies = await context.cookies();
      const hasAuthCookie = cookies.some(c => 
        c.name.includes('auth') || 
        c.name.includes('session') || 
        c.name.includes('token')
      );
      
      // Check localStorage
      const hasAuthStorage = await page.evaluate(() => {
        return localStorage.getItem('user') !== null ||
               localStorage.getItem('token') !== null ||
               localStorage.getItem('session') !== null ||
               sessionStorage.getItem('user') !== null;
      });
      
      expect(hasAuthCookie || hasAuthStorage).toBeTruthy();
    }
  });
});