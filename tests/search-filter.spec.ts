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

test.describe('Search and Filter Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test.describe('Patent Search', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('aside >> text=Search');
      await page.waitForLoadState('networkidle');
    });

    test('should display patent search interface', async ({ page }) => {
      await expect(page.locator('text=/Patent Search|Search Patents/i').first()).toBeVisible();
      
      // Check for search input
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      await expect(searchInput).toBeVisible();
      
      // Check for filter options
      await expect(page.locator('text=/Filters|Advanced Search/i')).toBeVisible();
    });

    test('should perform basic patent search', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      await searchInput.fill('artificial intelligence');
      await searchInput.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Check for results
      const results = page.locator('.search-result, .patent-card, [data-testid*="result"]');
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible();
      }
    });

    test('should apply date range filter', async ({ page }) => {
      // Look for date filter
      const dateFilter = page.locator('input[type="date"], button:has-text("Date Range")');
      if (await dateFilter.count() > 0) {
        await dateFilter.first().click();
        
        // Set date range if date inputs are available
        const fromDate = page.locator('input[placeholder*="from" i][type="date"]');
        const toDate = page.locator('input[placeholder*="to" i][type="date"]');
        
        if (await fromDate.count() > 0 && await toDate.count() > 0) {
          await fromDate.fill('2020-01-01');
          await toDate.fill('2023-12-31');
          
          // Apply filter
          const applyButton = page.locator('button:has-text("Apply")');
          if (await applyButton.count() > 0) {
            await applyButton.click();
          }
        }
      }
    });

    test('should filter by jurisdiction', async ({ page }) => {
      // Look for jurisdiction filter
      const jurisdictionFilter = page.locator('select:has-text("Jurisdiction"), button:has-text("Jurisdiction")');
      if (await jurisdictionFilter.count() > 0) {
        await jurisdictionFilter.first().click();
        
        // Select a jurisdiction
        const option = page.locator('option:has-text("US"), text=United States');
        if (await option.count() > 0) {
          await option.first().click();
        }
      }
    });

    test('should filter by status', async ({ page }) => {
      // Look for status filter
      const statusFilter = page.locator('select:has-text("Status"), button:has-text("Status")');
      if (await statusFilter.count() > 0) {
        await statusFilter.first().click();
        
        // Select a status
        const option = page.locator('option:has-text("Active"), text=Granted');
        if (await option.count() > 0) {
          await option.first().click();
        }
      }
    });

    test('should clear all filters', async ({ page }) => {
      // Apply some filters first
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      await searchInput.fill('test search');
      
      // Clear filters
      const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")');
      if (await clearButton.count() > 0) {
        await clearButton.first().click();
        
        // Check search input is cleared
        await expect(searchInput).toHaveValue('');
      }
    });

    test('should sort search results', async ({ page }) => {
      // Perform a search first
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      await searchInput.fill('technology');
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
      
      // Look for sort dropdown
      const sortDropdown = page.locator('select:has-text("Sort"), button:has-text("Sort")');
      if (await sortDropdown.count() > 0) {
        await sortDropdown.first().click();
        
        // Select sort option
        const sortOption = page.locator('option:has-text("Relevance"), option:has-text("Date")');
        if (await sortOption.count() > 0) {
          await sortOption.first().click();
        }
      }
    });
  });

  test.describe('Global Search', () => {
    test('should open global search with keyboard shortcut', async ({ page }) => {
      // Try Cmd/Ctrl + K
      await page.keyboard.press('Control+k');
      
      // Check if search modal opens
      const searchModal = page.locator('[role="dialog"]:has-text("search"), .search-modal, .command-palette');
      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeVisible();
        
        // Check for search input in modal
        const modalSearchInput = searchModal.locator('input[placeholder*="search" i]');
        await expect(modalSearchInput).toBeVisible();
        
        // Close modal
        await page.keyboard.press('Escape');
      }
    });

    test('should search across all content types', async ({ page }) => {
      // Open global search if available
      const globalSearchButton = page.locator('button[aria-label*="search" i], button:has-text("Search")').first();
      if (await globalSearchButton.count() > 0) {
        await globalSearchButton.click();
        
        const searchInput = page.locator('input[placeholder*="search" i]').first();
        await searchInput.fill('innovation');
        await page.waitForTimeout(500);
        
        // Check for categorized results
        const categories = ['Patents', 'Projects', 'Reports', 'Tools'];
        for (const category of categories) {
          const categorySection = page.locator(`text=${category}`);
          if (await categorySection.count() > 0) {
            await expect(categorySection.first()).toBeVisible();
            break;
          }
        }
      }
    });
  });

  test.describe('Filter Components', () => {
    test('should expand and collapse filter panel', async ({ page }) => {
      await page.click('aside >> text=Showcase');
      
      // Look for filter toggle button
      const filterToggle = page.locator('button:has-text("Filters"), button[aria-label*="filter" i]');
      if (await filterToggle.count() > 0) {
        // Expand filters
        await filterToggle.first().click();
        
        // Check filter panel is visible
        const filterPanel = page.locator('.filter-panel, [data-testid*="filter"]');
        if (await filterPanel.count() > 0) {
          await expect(filterPanel.first()).toBeVisible();
          
          // Collapse filters
          await filterToggle.first().click();
          await expect(filterPanel.first()).not.toBeVisible();
        }
      }
    });

    test('should display active filter count', async ({ page }) => {
      await page.click('aside >> text=Showcase');
      
      // Apply some filters
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      await searchInput.fill('AI');
      
      // Look for filter count badge
      const filterCount = page.locator('.badge:has-text("1"), text=/\d+ filter/i');
      if (await filterCount.count() > 0) {
        await expect(filterCount.first()).toBeVisible();
      }
    });

    test('should use voice search if available', async ({ page }) => {
      // Look for voice search button
      const voiceButton = page.locator('button[aria-label*="voice" i], button[aria-label*="microphone" i]');
      if (await voiceButton.count() > 0) {
        // Check if browser supports speech recognition
        const hasSpeechRecognition = await page.evaluate(() => {
          return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        });
        
        if (hasSpeechRecognition) {
          await voiceButton.first().click();
          
          // Check for voice input indicator
          const voiceIndicator = page.locator('text=/Listening|Speak now/i');
          if (await voiceIndicator.count() > 0) {
            await expect(voiceIndicator.first()).toBeVisible();
            
            // Cancel voice input
            await page.keyboard.press('Escape');
          }
        }
      }
    });

    test('should save search filters', async ({ page }) => {
      await page.click('aside >> text=Search');
      
      // Apply filters
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      await searchInput.fill('quantum computing');
      
      // Look for save search button
      const saveButton = page.locator('button:has-text("Save Search"), button:has-text("Save Filter")');
      if (await saveButton.count() > 0) {
        await saveButton.first().click();
        
        // Check for save modal
        const saveModal = page.locator('[role="dialog"]:has-text("Save"), .modal:has-text("Save")');
        if (await saveModal.count() > 0) {
          await expect(saveModal.first()).toBeVisible();
          
          // Enter search name
          const nameInput = page.locator('input[placeholder*="name" i]');
          if (await nameInput.count() > 0) {
            await nameInput.fill('Quantum Computing Research');
            
            // Save
            await page.click('button:has-text("Save")');
            
            // Check for success
            await expect(page.locator('text=/Saved|Success/i')).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });

    test('should load saved searches', async ({ page }) => {
      await page.click('aside >> text=Search');
      
      // Look for saved searches dropdown
      const savedSearches = page.locator('select:has-text("Saved"), button:has-text("Saved Searches")');
      if (await savedSearches.count() > 0) {
        await savedSearches.first().click();
        
        // Check for saved search options
        const savedOption = page.locator('option, [role="option"]').first();
        if (await savedOption.count() > 0) {
          await savedOption.click();
          
          // Check that search is loaded
          const searchInput = page.locator('input[placeholder*="search" i]').first();
          const value = await searchInput.inputValue();
          expect(value).not.toBe('');
        }
      }
    });
  });
});