import { test, expect } from '@playwright/test';

test.describe('Basic Smoke Tests', () => {
  test('should load the application', async ({ page }) => {
    // Navigate to the app with increased timeout
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('InnoSpot');
    
    // Application should be running
    await expect(page).toHaveURL(/http:\/\/localhost:808\d/);
  });

  test('should have authentication elements or dashboard', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);
    
    // Either login form OR dashboard should be visible
    const hasAuthForm = await page.locator('input[type="email"], input[type="password"], text=/sign in/i, text=/login/i').first().isVisible().catch(() => false);
    const hasDashboard = await page.locator('text=/dashboard/i, text=/showcase/i, text=/welcome/i').first().isVisible().catch(() => false);
    
    expect(hasAuthForm || hasDashboard).toBeTruthy();
  });

  test('should have responsive viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    // Check mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Check tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Should not crash on any viewport
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});