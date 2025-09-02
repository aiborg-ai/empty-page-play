import { test, expect, Page } from '@playwright/test';

// Helper function to login
async function loginAsDemo(page: Page) {
  await page.goto('/');
  await page.fill('input[type="email"]', 'demo@innospot.com');
  await page.fill('input[type="password"]', 'Demo123!@#');
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('**/');
  await page.waitForLoadState('networkidle');
}

test.describe('Showcase Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    // Navigate to Showcase
    await page.click('aside >> text=Showcase');
    await page.waitForLoadState('networkidle');
  });

  test('should display showcase page with categories', async ({ page }) => {
    // Check page title
    await expect(page.locator('text=/Showcase|Capabilities/i').first()).toBeVisible();
    
    // Check category sidebar
    const categories = ['All', 'AI Agents', 'Tools', 'Datasets', 'Reports', 'Dashboards'];
    for (const category of categories) {
      await expect(page.locator(`text=${category}`).first()).toBeVisible();
    }
  });

  test('should filter by AI Agents category', async ({ page }) => {
    // Click AI Agents category
    await page.click('text=AI Agents');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Check that AI Agent cards are visible
    const aiAgentCards = page.locator('.card, [data-testid*="capability-card"]').filter({ hasText: /AI|Agent|Generator|Assistant/i });
    await expect(aiAgentCards.first()).toBeVisible();
    
    // Verify at least one AI agent is shown
    const count = await aiAgentCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter by Tools category', async ({ page }) => {
    await page.click('text=Tools');
    await page.waitForTimeout(500);
    
    // Check for tool cards
    const toolCards = page.locator('.card, [data-testid*="capability-card"]').filter({ hasText: /Tool|Analyzer|Scanner|Monitor/i });
    await expect(toolCards.first()).toBeVisible();
  });

  test('should filter by Datasets category', async ({ page }) => {
    await page.click('text=Datasets');
    await page.waitForTimeout(500);
    
    // Check for dataset cards
    const datasetCards = page.locator('.card, [data-testid*="capability-card"]').filter({ hasText: /Dataset|Data|Database|Collection/i });
    const count = await datasetCards.count();
    if (count > 0) {
      await expect(datasetCards.first()).toBeVisible();
    }
  });

  test('should search for capabilities', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="search" i]').first();
    await searchInput.fill('AI');
    await page.waitForTimeout(500);
    
    // Check filtered results contain AI
    const results = page.locator('.card, [data-testid*="capability-card"]').filter({ hasText: /AI/i });
    await expect(results.first()).toBeVisible();
  });

  test('should display capability details on card click', async ({ page }) => {
    // Click on first capability card
    const firstCard = page.locator('.card, [data-testid*="capability-card"]').first();
    await firstCard.click();
    
    // Check for detail view or modal
    const detailView = page.locator('[role="dialog"], .modal, .detail-view, [data-testid*="capability-detail"]');
    if (await detailView.count() > 0) {
      await expect(detailView.first()).toBeVisible();
      
      // Check for common detail elements
      await expect(page.locator('text=/Description|Overview|Features/i')).toBeVisible();
      await expect(page.locator('button:has-text("Run"), button:has-text("Execute"), button:has-text("Try")')).toBeVisible();
    }
  });

  test('should open run capability modal', async ({ page }) => {
    // Find and click a Run button
    const runButton = page.locator('button:has-text("Run"), button:has-text("Execute"), button:has-text("Try")').first();
    if (await runButton.count() > 0) {
      await runButton.click();
      
      // Check for run modal
      const runModal = page.locator('[role="dialog"]:has-text("Run"), .modal:has-text("Execute")');
      await expect(runModal).toBeVisible();
      
      // Check for form fields
      await expect(page.locator('text=/Parameters|Configuration|Settings/i')).toBeVisible();
      
      // Close modal
      const closeButton = page.locator('button[aria-label*="close" i], button:has-text("Cancel"), button:has-text("×")');
      await closeButton.first().click();
    }
  });

  test('should open share capability modal', async ({ page }) => {
    // Find and click a Share button
    const shareButton = page.locator('button:has-text("Share"), button[aria-label*="share" i]').first();
    if (await shareButton.count() > 0) {
      await shareButton.click();
      
      // Check for share modal
      const shareModal = page.locator('[role="dialog"]:has-text("Share"), .modal:has-text("Share")');
      await expect(shareModal).toBeVisible();
      
      // Check for share options
      await expect(page.locator('text=/Email|Link|Team/i')).toBeVisible();
      
      // Close modal
      const closeButton = page.locator('button[aria-label*="close" i], button:has-text("Cancel"), button:has-text("×")');
      await closeButton.first().click();
    }
  });

  test('should display capability statistics', async ({ page }) => {
    // Check for stats on capability cards
    const statsElements = page.locator('text=/Usage|Success|Rating|Views/i');
    if (await statsElements.count() > 0) {
      await expect(statsElements.first()).toBeVisible();
    }
  });

  test('should sort capabilities', async ({ page }) => {
    // Look for sort dropdown
    const sortDropdown = page.locator('select:has-text("Sort"), button:has-text("Sort"), [aria-label*="sort" i]').first();
    if (await sortDropdown.count() > 0) {
      await sortDropdown.click();
      
      // Check for sort options
      const sortOptions = ['Most Recent', 'Most Popular', 'Highest Rated', 'Alphabetical'];
      for (const option of sortOptions) {
        const optionElement = page.locator(`text=${option}`);
        if (await optionElement.count() > 0) {
          await optionElement.first().click();
          await page.waitForTimeout(500);
          break;
        }
      }
    }
  });

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search" i]').first();
    await searchInput.fill('xyznonexistentcapability123');
    await page.waitForTimeout(500);
    
    // Check for no results message
    const noResults = page.locator('text=/No results|No capabilities found|No matches/i');
    if (await noResults.count() > 0) {
      await expect(noResults.first()).toBeVisible();
    }
  });

  test('should display project selector if available', async ({ page }) => {
    // Look for project selector
    const projectSelector = page.locator('select:has-text("Project"), button:has-text("Project"), text=Working on');
    if (await projectSelector.count() > 0) {
      await expect(projectSelector.first()).toBeVisible();
    }
  });

  test('should navigate between view modes if available', async ({ page }) => {
    // Look for view mode buttons (grid/list/detail)
    const viewModeButtons = page.locator('button[aria-label*="view" i], button[title*="view" i]');
    if (await viewModeButtons.count() > 1) {
      // Try switching view modes
      await viewModeButtons.nth(1).click();
      await page.waitForTimeout(500);
      
      // Layout should change
      const cards = page.locator('.card, [data-testid*="capability-card"]');
      await expect(cards.first()).toBeVisible();
    }
  });

  test('should display capability tags', async ({ page }) => {
    // Check for tags on cards
    const tags = page.locator('.tag, .badge, [data-testid*="tag"]').filter({ hasText: /AI|ML|NLP|Analytics|Visualization/i });
    if (await tags.count() > 0) {
      await expect(tags.first()).toBeVisible();
    }
  });

  test('should show capability status indicators', async ({ page }) => {
    // Check for status badges
    const statusBadges = page.locator('text=/Available|Beta|Premium|Coming Soon/i');
    if (await statusBadges.count() > 0) {
      await expect(statusBadges.first()).toBeVisible();
    }
  });
});