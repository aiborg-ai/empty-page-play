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

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('should display sidebar with navigation options', async ({ page }) => {
    // Check sidebar is visible
    const sidebar = page.locator('aside, [role="navigation"], .sidebar');
    await expect(sidebar).toBeVisible();
    
    // Check for main navigation items
    const navItems = [
      'Dashboard',
      'Showcase',
      'Search',
      'Projects',
      'Collections',
      'Reports',
      'Network',
      'Messages',
      'Support'
    ];
    
    for (const item of navItems) {
      await expect(sidebar.locator(`text=${item}`)).toBeVisible();
    }
  });

  test('should navigate to Dashboard', async ({ page }) => {
    await page.click('text=Dashboard');
    await expect(page.locator('h1:has-text("Dashboard"), h2:has-text("Dashboard"), text=Welcome')).toBeVisible();
  });

  test('should navigate to Showcase', async ({ page }) => {
    await page.click('aside >> text=Showcase');
    await expect(page.locator('text=/Showcase|Capabilities|Tools/i')).toBeVisible();
    
    // Check for showcase categories
    await expect(page.locator('text=AI Agents')).toBeVisible();
    await expect(page.locator('text=Tools')).toBeVisible();
    await expect(page.locator('text=Datasets')).toBeVisible();
  });

  test('should navigate to Patent Search', async ({ page }) => {
    await page.click('aside >> text=Search');
    await expect(page.locator('text=/Patent Search|Search Patents/i')).toBeVisible();
    
    // Check for search input
    await expect(page.locator('input[placeholder*="search" i]')).toBeVisible();
  });

  test('should navigate to Projects', async ({ page }) => {
    await page.click('aside >> text=Projects');
    await expect(page.locator('text=/Projects|Spaces|Workspaces/i')).toBeVisible();
    
    // Check for create project button
    await expect(page.locator('button:has-text("Create"), button:has-text("New Project")')).toBeVisible();
  });

  test('should navigate to Collections', async ({ page }) => {
    await page.click('aside >> text=Collections');
    await expect(page.locator('text=/Collections|Saved Items/i')).toBeVisible();
  });

  test('should navigate to Reports', async ({ page }) => {
    await page.click('aside >> text=Reports');
    await expect(page.locator('text=/Reports|Analytics/i')).toBeVisible();
    
    // Check for report categories
    const reportTypes = page.locator('text=/Patent Analysis|Market Research|Competitive Intelligence/i');
    await expect(reportTypes.first()).toBeVisible();
  });

  test('should navigate to Network', async ({ page }) => {
    await page.click('aside >> text=Network');
    await expect(page.locator('text=/Network|Connections|Collaborators/i')).toBeVisible();
  });

  test('should navigate to Messages', async ({ page }) => {
    await page.click('aside >> text=Messages');
    await expect(page.locator('text=/Messages|Inbox|Conversations/i')).toBeVisible();
  });

  test('should navigate to Support', async ({ page }) => {
    await page.click('aside >> text=Support');
    await expect(page.locator('text=/Support|Help|Documentation/i')).toBeVisible();
  });

  test('should expand/collapse Innovation Hub submenu', async ({ page }) => {
    // Find and click Innovation Hub
    const innovationHub = page.locator('text=Innovation Hub');
    if (await innovationHub.count() > 0) {
      await innovationHub.click();
      
      // Check for submenu items
      const submenuItems = [
        'AI Claim Generator',
        'Collision Detection',
        'Citation 3D',
        'Blockchain Provenance'
      ];
      
      for (const item of submenuItems) {
        const menuItem = page.locator(`text=${item}`);
        if (await menuItem.count() > 0) {
          await expect(menuItem).toBeVisible();
        }
      }
    }
  });

  test('should navigate to CMS Studio from Dashboard Tools', async ({ page }) => {
    // Look for Dashboards or Studio in sidebar
    const dashboardsLink = page.locator('aside >> text=/Dashboards|Studio/i');
    if (await dashboardsLink.count() > 0) {
      await dashboardsLink.first().click();
      await expect(page.locator('text=/CMS Studio|Asset Management|Dashboards/i')).toBeVisible();
      
      // Check for asset type tabs
      await expect(page.locator('text=AI Agents')).toBeVisible();
      await expect(page.locator('text=Tools')).toBeVisible();
      await expect(page.locator('text=Datasets')).toBeVisible();
    }
  });

  test('should handle breadcrumb navigation', async ({ page }) => {
    // Navigate to a section with breadcrumbs
    await page.click('aside >> text=Projects');
    
    // Look for breadcrumb navigation
    const breadcrumbs = page.locator('nav[aria-label="breadcrumb"], .breadcrumb, text=🏠');
    if (await breadcrumbs.count() > 0) {
      // Click home breadcrumb if exists
      const homeLink = page.locator('text=🏠, text=Home').first();
      if (await homeLink.count() > 0) {
        await homeLink.click();
        await expect(page.locator('text=/Dashboard|Welcome/i')).toBeVisible();
      }
    }
  });

  test('should toggle AI Chat panel', async ({ page }) => {
    // Look for AI Chat button in sidebar
    const aiChatButton = page.locator('button[aria-label*="AI" i], button:has-text("AI Chat"), [data-testid="ai-chat-button"]');
    if (await aiChatButton.count() > 0) {
      // Open AI Chat
      await aiChatButton.first().click();
      await expect(page.locator('text=/AI Assistant|AI Chat|How can I help/i')).toBeVisible();
      
      // Close AI Chat
      const closeButton = page.locator('button[aria-label*="close" i], button:has-text("×")');
      await closeButton.first().click();
      await expect(page.locator('text=/AI Assistant|AI Chat/i')).not.toBeVisible();
    }
  });

  test('should display user profile menu', async ({ page }) => {
    // Look for user avatar or profile button in header
    const profileButton = page.locator('header >> button:has-text("Demo User"), header >> button:has-text("demo@innospot.com"), header >> [aria-label*="profile" i]');
    if (await profileButton.count() > 0) {
      await profileButton.first().click();
      
      // Check for profile menu items
      const menuItems = ['Settings', 'Account', 'Sign Out', 'Logout'];
      for (const item of menuItems) {
        const menuItem = page.locator(`text=${item}`);
        if (await menuItem.count() > 0) {
          await expect(menuItem.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should navigate using keyboard shortcuts', async ({ page }) => {
    // Test common keyboard shortcuts if implemented
    
    // Cmd/Ctrl + K for search
    await page.keyboard.press('Control+k');
    const searchModal = page.locator('[role="dialog"]:has-text("search"), .search-modal');
    if (await searchModal.count() > 0) {
      await expect(searchModal).toBeVisible();
      await page.keyboard.press('Escape');
    }
    
    // Cmd/Ctrl + / for help
    await page.keyboard.press('Control+/');
    const helpModal = page.locator('[role="dialog"]:has-text("help"), .help-modal');
    if (await helpModal.count() > 0) {
      await expect(helpModal).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });
});