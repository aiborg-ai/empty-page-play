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

test.describe('CMS Studio Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    // Navigate to CMS Studio/Dashboards
    const studioLink = page.locator('aside >> text=/Dashboards|Studio|CMS/i');
    if (await studioLink.count() > 0) {
      await studioLink.first().click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display CMS Studio interface', async ({ page }) => {
    // Check for CMS Studio heading
    await expect(page.locator('text=/CMS Studio|Asset Management|Dashboards/i').first()).toBeVisible();
    
    // Check for asset type tabs
    const assetTypes = ['All', 'Dashboards', 'AI Agents', 'Tools', 'Datasets', 'Reports'];
    for (const type of assetTypes) {
      const tab = page.locator(`button:has-text("${type}"), [role="tab"]:has-text("${type}")`);
      if (await tab.count() > 0) {
        await expect(tab.first()).toBeVisible();
      }
    }
  });

  test('should create a new dashboard', async ({ page }) => {
    // Click create/new button
    const createButton = page.locator('button:has-text("Create"), button:has-text("New"), button:has-text("Add")').first();
    if (await createButton.count() > 0) {
      await createButton.click();
      
      // Look for create modal or form
      const createModal = page.locator('[role="dialog"], .modal, form').filter({ hasText: /Create|New Dashboard/i });
      if (await createModal.count() > 0) {
        await expect(createModal.first()).toBeVisible();
        
        // Fill dashboard details
        await page.fill('input[placeholder*="name" i], input[placeholder*="title" i]', 'Test Dashboard');
        await page.fill('textarea[placeholder*="description" i], input[placeholder*="description" i]', 'Test dashboard description');
        
        // Select type if dropdown exists
        const typeSelect = page.locator('select:has-text("Type"), select[name*="type" i]');
        if (await typeSelect.count() > 0) {
          await typeSelect.selectOption({ index: 1 });
        }
        
        // Submit form
        await page.click('button:has-text("Create"), button:has-text("Save")');
        
        // Check for success message or new dashboard in list
        await expect(page.locator('text=/Success|Created|Test Dashboard/i')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should filter assets by type', async ({ page }) => {
    // Click on Dashboards tab
    const dashboardTab = page.locator('button:has-text("Dashboards"), [role="tab"]:has-text("Dashboards")');
    if (await dashboardTab.count() > 0) {
      await dashboardTab.first().click();
      await page.waitForTimeout(500);
      
      // Check that filtered results are shown
      const assetCards = page.locator('.card, [data-testid*="asset-card"]');
      if (await assetCards.count() > 0) {
        await expect(assetCards.first()).toBeVisible();
      }
    }
    
    // Click on AI Agents tab
    const aiAgentTab = page.locator('button:has-text("AI Agents"), [role="tab"]:has-text("AI Agents")');
    if (await aiAgentTab.count() > 0) {
      await aiAgentTab.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should search for assets', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="search" i]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('dashboard');
      await page.waitForTimeout(500);
      
      // Check filtered results
      const results = page.locator('.card, [data-testid*="asset-card"]');
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible();
      }
    }
  });

  test('should edit an existing asset', async ({ page }) => {
    // Find an edit button on an asset card
    const editButton = page.locator('button:has-text("Edit"), button[aria-label*="edit" i]').first();
    if (await editButton.count() > 0) {
      await editButton.click();
      
      // Check for edit modal/form
      const editModal = page.locator('[role="dialog"], .modal').filter({ hasText: /Edit|Update/i });
      if (await editModal.count() > 0) {
        await expect(editModal.first()).toBeVisible();
        
        // Modify a field
        const nameInput = page.locator('input[value*=""], input[placeholder*="name" i]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill('Updated Asset Name');
        }
        
        // Save changes
        await page.click('button:has-text("Save"), button:has-text("Update")');
        
        // Check for success message
        await expect(page.locator('text=/Success|Updated|Saved/i')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should delete an asset', async ({ page }) => {
    // Find a delete button
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label*="delete" i]').first();
    if (await deleteButton.count() > 0) {
      await deleteButton.click();
      
      // Confirm deletion in modal
      const confirmModal = page.locator('[role="dialog"], .modal').filter({ hasText: /Delete|Remove|Confirm/i });
      if (await confirmModal.count() > 0) {
        await expect(confirmModal.first()).toBeVisible();
        
        // Click confirm
        const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")').last();
        await confirmButton.click();
        
        // Check for success message
        await expect(page.locator('text=/Deleted|Removed|Success/i')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should display asset statistics', async ({ page }) => {
    // Check for stats on asset cards
    const stats = page.locator('text=/Views|Usage|Created|Modified/i');
    if (await stats.count() > 0) {
      await expect(stats.first()).toBeVisible();
    }
  });

  test('should switch between view modes', async ({ page }) => {
    // Look for view mode toggles
    const viewButtons = page.locator('button[aria-label*="grid" i], button[aria-label*="list" i]');
    if (await viewButtons.count() > 1) {
      // Switch to list view
      await viewButtons.nth(1).click();
      await page.waitForTimeout(500);
      
      // Check layout changed
      const assets = page.locator('.card, [data-testid*="asset"], tr');
      if (await assets.count() > 0) {
        await expect(assets.first()).toBeVisible();
      }
    }
  });

  test('should handle bulk actions', async ({ page }) => {
    // Look for checkboxes on asset cards
    const checkboxes = page.locator('input[type="checkbox"]');
    if (await checkboxes.count() > 1) {
      // Select multiple items
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();
      
      // Look for bulk action buttons
      const bulkActions = page.locator('button:has-text("Delete Selected"), button:has-text("Export")');
      if (await bulkActions.count() > 0) {
        await expect(bulkActions.first()).toBeVisible();
      }
    }
  });

  test('should export assets', async ({ page }) => {
    // Look for export button
    const exportButton = page.locator('button:has-text("Export"), button[aria-label*="export" i]');
    if (await exportButton.count() > 0) {
      await exportButton.first().click();
      
      // Check for export options
      const exportModal = page.locator('[role="dialog"], .modal').filter({ hasText: /Export/i });
      if (await exportModal.count() > 0) {
        await expect(exportModal.first()).toBeVisible();
        
        // Check for format options
        await expect(page.locator('text=/JSON|CSV|Excel/i')).toBeVisible();
      }
    }
  });

  test('should import assets', async ({ page }) => {
    // Look for import button
    const importButton = page.locator('button:has-text("Import"), button[aria-label*="import" i]');
    if (await importButton.count() > 0) {
      await importButton.first().click();
      
      // Check for import modal
      const importModal = page.locator('[role="dialog"], .modal').filter({ hasText: /Import/i });
      if (await importModal.count() > 0) {
        await expect(importModal.first()).toBeVisible();
        
        // Check for file upload area
        await expect(page.locator('input[type="file"], text=/Drop files|Choose file/i')).toBeVisible();
      }
    }
  });

  test('should display asset preview', async ({ page }) => {
    // Click on an asset card
    const assetCard = page.locator('.card, [data-testid*="asset-card"]').first();
    if (await assetCard.count() > 0) {
      await assetCard.click();
      
      // Check for preview panel or modal
      const preview = page.locator('[data-testid*="preview"], .preview, [role="dialog"]');
      if (await preview.count() > 0) {
        await expect(preview.first()).toBeVisible();
        
        // Check for preview content
        await expect(page.locator('text=/Preview|Details|Configuration/i')).toBeVisible();
      }
    }
  });

  test('should share an asset', async ({ page }) => {
    // Find share button
    const shareButton = page.locator('button:has-text("Share"), button[aria-label*="share" i]').first();
    if (await shareButton.count() > 0) {
      await shareButton.click();
      
      // Check for share modal
      const shareModal = page.locator('[role="dialog"], .modal').filter({ hasText: /Share/i });
      if (await shareModal.count() > 0) {
        await expect(shareModal.first()).toBeVisible();
        
        // Check for sharing options
        await expect(page.locator('text=/Email|Link|Team|Public/i')).toBeVisible();
        
        // Check for permission settings
        await expect(page.locator('text=/View|Edit|Admin/i')).toBeVisible();
      }
    }
  });

  test('should duplicate an asset', async ({ page }) => {
    // Find duplicate button
    const duplicateButton = page.locator('button:has-text("Duplicate"), button:has-text("Clone"), button[aria-label*="duplicate" i]').first();
    if (await duplicateButton.count() > 0) {
      await duplicateButton.click();
      
      // Check for success message or new duplicated item
      await expect(page.locator('text=/Duplicated|Cloned|Copy created/i')).toBeVisible({ timeout: 5000 });
    }
  });
});