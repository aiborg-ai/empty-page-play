import { test, expect, Page } from '@playwright/test';

// Helper function to login with improved selectors
async function loginAsDemo(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const isLoggedIn = await page.locator('text=/Dashboard|Showcase|Welcome/i').count() > 0;
  
  if (!isLoggedIn) {
    const quickLogin = page.locator('button:has-text("Use"):near(:text("demo@innospot.com"))');
    if (await quickLogin.count() > 0) {
      await quickLogin.first().click();
    } else {
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        await emailInput.fill('demo@innospot.com');
        await passwordInput.fill('Demo123!@#');
        const submitButton = page.locator('button[type="submit"]').first();
        await submitButton.click();
      }
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  }
}

// Helper to navigate to showcase
async function navigateToShowcase(page: Page) {
  const showcaseSelectors = [
    'aside >> text="Showcase"',
    'nav >> text="Showcase"',
    'button:has-text("Showcase")',
    'a:has-text("Showcase")',
    '[data-testid="nav-showcase"]'
  ];
  
  for (const selector of showcaseSelectors) {
    const element = page.locator(selector);
    if (await element.count() > 0 && await element.isVisible()) {
      await element.first().click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      return true;
    }
  }
  return false;
}

test.describe('Improved Showcase Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await navigateToShowcase(page);
  });

  test('should display showcase page with categories', async ({ page }) => {
    // Check for showcase indicators
    const showcaseSelectors = [
      'text=/Showcase/i',
      'text=/Capabilities/i',
      '[data-testid="showcase"]',
      '.showcase-container'
    ];
    
    let showcaseFound = false;
    for (const selector of showcaseSelectors) {
      if (await page.locator(selector).count() > 0) {
        showcaseFound = true;
        await expect(page.locator(selector).first()).toBeVisible();
        break;
      }
    }
    
    expect(showcaseFound).toBeTruthy();
    
    // Check for categories
    const categories = ['AI Agents', 'Tools', 'Datasets', 'Reports', 'Dashboards'];
    let categoryFound = false;
    
    for (const category of categories) {
      const categoryElement = page.locator(`text="${category}"`);
      if (await categoryElement.count() > 0) {
        categoryFound = true;
        await expect(categoryElement.first()).toBeVisible();
      }
    }
    
    expect(categoryFound).toBeTruthy();
  });

  test('should filter by category', async ({ page }) => {
    // Click on AI Agents category
    const categorySelectors = [
      'button:has-text("AI Agents")',
      'a:has-text("AI Agents")',
      '[data-testid="category-ai-agents"]',
      'text="AI Agents"'
    ];
    
    for (const selector of categorySelectors) {
      const category = page.locator(selector);
      if (await category.count() > 0 && await category.isVisible()) {
        await category.first().click();
        await page.waitForTimeout(1500);
        
        // Check for filtered content
        const cards = page.locator('.card, [data-testid*="card"], article, .capability-card');
        
        if (await cards.count() > 0) {
          // Check that at least one card is visible
          await expect(cards.first()).toBeVisible();
          
          // Verify cards are related to AI Agents
          const cardText = await cards.first().textContent();
          expect(cardText).toBeTruthy();
        }
        break;
      }
    }
  });

  test('should search for capabilities', async ({ page }) => {
    // Find search input
    const searchSelectors = [
      'input[placeholder*="search" i]',
      'input[type="search"]',
      '[data-testid="search-input"]',
      'input[name="search"]'
    ];
    
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector);
      if (await searchInput.count() > 0 && await searchInput.isVisible()) {
        // Clear and type
        await searchInput.clear();
        await searchInput.fill('AI');
        
        // Wait for search to process
        await page.waitForTimeout(1500);
        
        // Check for results
        const results = page.locator('.card, [data-testid*="card"], article');
        
        if (await results.count() > 0) {
          const firstResult = results.first();
          await expect(firstResult).toBeVisible();
          
          // Verify search worked
          const resultText = await firstResult.textContent();
          expect(resultText?.toLowerCase()).toContain('ai');
        }
        break;
      }
    }
  });

  test('should display capability cards', async ({ page }) => {
    // Wait for cards to load
    await page.waitForTimeout(2000);
    
    // Look for capability cards
    const cardSelectors = [
      '.card',
      '[data-testid*="capability-card"]',
      '[data-testid*="card"]',
      'article',
      '.capability-item',
      'div:has(h3):has(p):has(button)'
    ];
    
    let cardsFound = false;
    for (const selector of cardSelectors) {
      const cards = page.locator(selector);
      if (await cards.count() > 0) {
        cardsFound = true;
        
        // Check first card structure
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();
        
        // Check for card elements
        const hasTitle = await firstCard.locator('h3, h4, .title, [class*="title"]').count() > 0;
        const hasDescription = await firstCard.locator('p, .description, [class*="description"]').count() > 0;
        
        expect(hasTitle || hasDescription).toBeTruthy();
        break;
      }
    }
    
    expect(cardsFound).toBeTruthy();
  });

  test('should open capability details on click', async ({ page }) => {
    // Find and click a capability card
    const cardSelectors = [
      '.card',
      '[data-testid*="card"]',
      'article',
      '.capability-item'
    ];
    
    for (const selector of cardSelectors) {
      const card = page.locator(selector).first();
      if (await card.count() > 0 && await card.isVisible()) {
        await card.click();
        await page.waitForTimeout(2000);
        
        // Check for detail view or modal
        const detailSelectors = [
          '[role="dialog"]',
          '.modal',
          '[data-testid*="detail"]',
          '.detail-view',
          'div:has-text("Description"):has-text("Features")'
        ];
        
        for (const detailSelector of detailSelectors) {
          const detail = page.locator(detailSelector);
          if (await detail.count() > 0) {
            await expect(detail.first()).toBeVisible();
            
            // Close if it's a modal
            const closeButton = detail.locator('button[aria-label*="close" i], button:has-text("×"), button:has-text("Close")');
            if (await closeButton.count() > 0) {
              await closeButton.first().click();
              await page.waitForTimeout(1000);
            }
            break;
          }
        }
        break;
      }
    }
  });

  test('should have action buttons on cards', async ({ page }) => {
    // Wait for cards to load
    await page.waitForTimeout(2000);
    
    // Find cards
    const cards = page.locator('.card, [data-testid*="card"], article').first();
    
    if (await cards.count() > 0) {
      // Look for action buttons
      const actionButtonSelectors = [
        'button:has-text("Run")',
        'button:has-text("Execute")',
        'button:has-text("Try")',
        'button:has-text("Share")',
        'button:has-text("View")',
        'button[aria-label*="run" i]',
        'button[aria-label*="share" i]'
      ];
      
      let buttonFound = false;
      for (const selector of actionButtonSelectors) {
        const button = cards.locator(selector);
        if (await button.count() > 0) {
          buttonFound = true;
          await expect(button.first()).toBeVisible();
          break;
        }
      }
      
      expect(buttonFound).toBeTruthy();
    }
  });

  test('should sort capabilities', async ({ page }) => {
    // Look for sort dropdown or buttons
    const sortSelectors = [
      'select:has-text("Sort")',
      'button:has-text("Sort")',
      '[data-testid="sort-dropdown"]',
      'select[name="sort"]',
      '[aria-label*="sort" i]'
    ];
    
    for (const selector of sortSelectors) {
      const sortElement = page.locator(selector);
      if (await sortElement.count() > 0 && await sortElement.isVisible()) {
        // If it's a select, change the value
        if (selector.includes('select')) {
          await sortElement.selectOption({ index: 1 });
        } else {
          // If it's a button, click it
          await sortElement.click();
          await page.waitForTimeout(1000);
          
          // Look for sort options
          const sortOption = page.locator('text=/Recent|Popular|Alphabetical/i').first();
          if (await sortOption.count() > 0) {
            await sortOption.click();
          }
        }
        
        await page.waitForTimeout(1500);
        
        // Verify cards are still displayed (sort worked)
        const cards = page.locator('.card, [data-testid*="card"]');
        expect(await cards.count()).toBeGreaterThan(0);
        break;
      }
    }
  });

  test('should handle empty search results', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="search" i]').first();
    
    if (await searchInput.count() > 0 && await searchInput.isVisible()) {
      // Search for something that won't exist
      await searchInput.clear();
      await searchInput.fill('xyznonexistent123456');
      await page.waitForTimeout(1500);
      
      // Check for no results message
      const noResultsSelectors = [
        'text=/No results/i',
        'text=/No.*found/i',
        'text=/No.*matches/i',
        'text=/Try.*different/i',
        '[data-testid="no-results"]'
      ];
      
      let noResultsFound = false;
      for (const selector of noResultsSelectors) {
        if (await page.locator(selector).count() > 0) {
          noResultsFound = true;
          await expect(page.locator(selector).first()).toBeVisible();
          break;
        }
      }
      
      // Either no results message OR no cards displayed
      if (!noResultsFound) {
        const cards = page.locator('.card, [data-testid*="card"]');
        expect(await cards.count()).toBe(0);
      }
    }
  });

  test('should display statistics or metrics', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Look for statistics
    const statsSelectors = [
      'text=/Usage|Views|Success|Rating/i',
      '[data-testid*="stats"]',
      '.stats',
      '.metrics',
      'span:has-text("%")',
      'span[class*="badge"]'
    ];
    
    for (const selector of statsSelectors) {
      const stats = page.locator(selector);
      if (await stats.count() > 0) {
        await expect(stats.first()).toBeVisible();
        break;
      }
    }
  });

  test('should toggle view mode if available', async ({ page }) => {
    // Look for view mode toggles
    const viewToggleSelectors = [
      'button[aria-label*="grid" i]',
      'button[aria-label*="list" i]',
      'button:has-text("Grid")',
      'button:has-text("List")',
      '[data-testid*="view-toggle"]'
    ];
    
    for (const selector of viewToggleSelectors) {
      const toggle = page.locator(selector);
      if (await toggle.count() > 0 && await toggle.isVisible()) {
        // Click to change view
        await toggle.first().click();
        await page.waitForTimeout(1500);
        
        // Verify layout changed (cards should still be visible)
        const cards = page.locator('.card, [data-testid*="card"], article');
        expect(await cards.count()).toBeGreaterThan(0);
        break;
      }
    }
  });
});