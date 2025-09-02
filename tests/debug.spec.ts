import { test, expect } from '@playwright/test';

test.describe('Debug Tests', () => {
  test('check app initialization', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', err => console.log('Page error:', err));
    
    // Navigate to the app
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait a bit for React to mount
    await page.waitForTimeout(3000);
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if root element has content
    const rootContent = await page.locator('#root').innerHTML();
    console.log('Root element has content:', rootContent.length > 0);
    
    if (rootContent.length > 100) {
      console.log('Root content preview:', rootContent.substring(0, 100) + '...');
    } else {
      console.log('Root content:', rootContent);
    }
    
    // Check for any visible text
    const bodyText = await page.locator('body').innerText();
    console.log('Body text length:', bodyText.length);
    if (bodyText.length > 0) {
      console.log('Body text preview:', bodyText.substring(0, 200));
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('Screenshot saved as debug-screenshot.png');
    
    // Check network errors
    const errors = [];
    page.on('requestfailed', request => {
      errors.push(`${request.url()} - ${request.failure().errorText}`);
    });
    
    await page.waitForTimeout(1000);
    
    if (errors.length > 0) {
      console.log('Network errors:', errors);
    }
    
    // Basic assertion - page should load
    await expect(page).toHaveURL('http://localhost:8081/');
  });
});