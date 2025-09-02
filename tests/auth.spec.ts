import { test, expect } from '@playwright/test';

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

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form on initial visit', async ({ page }) => {
    // Check for login form elements
    await expect(page.locator('h1:has-text("Sign In")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test('should navigate between login and register forms', async ({ page }) => {
    // Start on login page
    await expect(page.locator('h1:has-text("Sign In")')).toBeVisible();
    
    // Navigate to register
    await page.click('button:has-text("Register here")');
    await expect(page.locator('h1:has-text("Register")')).toBeVisible();
    
    // Navigate back to login
    await page.click('button:has-text("sign in with demo credentials")');
    await expect(page.locator('h1:has-text("Sign In")')).toBeVisible();
  });

  test('should login with demo user credentials', async ({ page }) => {
    // Fill login form
    await page.fill('input[type="email"]', DEMO_USERS.demo.email);
    await page.fill('input[type="password"]', DEMO_USERS.demo.password);
    
    // Submit form
    await page.click('button:has-text("Sign in")');
    
    // Wait for navigation to dashboard/showcase
    await page.waitForURL('**/');
    
    // Check for logged in state - should see header with user info
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('text=Demo User').or(page.locator('text=demo@innospot.com'))).toBeVisible({ timeout: 10000 });
  });

  test('should login with researcher credentials', async ({ page }) => {
    await page.fill('input[type="email"]', DEMO_USERS.researcher.email);
    await page.fill('input[type="password"]', DEMO_USERS.researcher.password);
    await page.click('button:has-text("Sign in")');
    
    await page.waitForURL('**/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('text=Research User').or(page.locator('text=researcher@innospot.com'))).toBeVisible({ timeout: 10000 });
  });

  test('should login with commercial credentials', async ({ page }) => {
    await page.fill('input[type="email"]', DEMO_USERS.commercial.email);
    await page.fill('input[type="password"]', DEMO_USERS.commercial.password);
    await page.click('button:has-text("Sign in")');
    
    await page.waitForURL('**/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('text=Commercial User').or(page.locator('text=commercial@innospot.com'))).toBeVisible({ timeout: 10000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign in")');
    
    // Should show error message
    await expect(page.locator('text=/invalid|error|failed/i')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.fill('input[type="email"]', DEMO_USERS.demo.email);
    await page.fill('input[type="password"]', DEMO_USERS.demo.password);
    await page.click('button:has-text("Sign in")');
    await page.waitForURL('**/');
    
    // Find and click logout/sign out button
    const signOutButton = page.locator('button:has-text("Sign Out")').or(page.locator('button:has-text("Logout")'));
    await signOutButton.click();
    
    // Should redirect to login page
    await expect(page.locator('h1:has-text("Sign In")')).toBeVisible({ timeout: 5000 });
  });

  test('should handle registration form submission', async ({ page }) => {
    // Navigate to register
    await page.click('button:has-text("Register here")');
    
    // Fill registration form
    await page.fill('input[placeholder*="name" i]', 'Test User');
    await page.fill('input[type="email"]', 'testuser@example.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    
    // Check for password confirmation field if exists
    const confirmPassword = page.locator('input[placeholder*="confirm" i][type="password"]');
    if (await confirmPassword.count() > 0) {
      await confirmPassword.fill('TestPassword123!');
    }
    
    // Submit form
    await page.click('button:has-text("Create Account")').or(page.locator('button:has-text("Sign Up")'));
    
    // Should either succeed or show appropriate message
    await expect(page.locator('text=/success|verify|confirm|already exists/i')).toBeVisible({ timeout: 10000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign in")');
    
    // Should show validation error
    const emailInput = page.locator('input[type="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test('should require password', async ({ page }) => {
    await page.fill('input[type="email"]', DEMO_USERS.demo.email);
    // Don't fill password
    await page.click('button:has-text("Sign in")');
    
    // Should show validation error or required indicator
    const passwordInput = page.locator('input[type="password"]');
    const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });
});