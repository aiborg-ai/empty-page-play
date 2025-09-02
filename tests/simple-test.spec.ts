import { test, expect } from '@playwright/test';

test.describe('Simple Diagnostic Test', () => {
  test('should load the application', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for any content to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
    
    // Check what's actually on the page
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for any visible text
    const bodyText = await page.locator('body').innerText();
    console.log('First 500 chars of body:', bodyText.substring(0, 500));
    
    // Check for login elements with more flexible selectors
    const emailInputs = await page.locator('input[type="email"]').count();
    const passwordInputs = await page.locator('input[type="password"]').count();
    const textInputs = await page.locator('input[type="text"]').count();
    const buttons = await page.locator('button').count();
    
    console.log('Found elements:');
    console.log('- Email inputs:', emailInputs);
    console.log('- Password inputs:', passwordInputs);
    console.log('- Text inputs:', textInputs);
    console.log('- Buttons:', buttons);
    
    // Check for any headings
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    if (h1Count > 0) {
      const h1Text = await page.locator('h1').first().innerText();
      console.log('First H1:', h1Text);
    }
    if (h2Count > 0) {
      const h2Text = await page.locator('h2').first().innerText();
      console.log('First H2:', h2Text);
    }
    
    // Basic assertions
    expect(title).toContain('InnoSpot');
  });
  
  test('should check authentication state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if we're on login or main app
    const signInText = await page.locator('text=/sign in/i').count();
    const loginText = await page.locator('text=/login/i').count();
    const registerText = await page.locator('text=/register/i').count();
    const dashboardText = await page.locator('text=/dashboard/i').count();
    const showcaseText = await page.locator('text=/showcase/i').count();
    
    console.log('Auth state indicators:');
    console.log('- Sign In text:', signInText);
    console.log('- Login text:', loginText);
    console.log('- Register text:', registerText);
    console.log('- Dashboard text:', dashboardText);
    console.log('- Showcase text:', showcaseText);
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
  });
});