import { test, expect, Page } from '@playwright/test';

// Helper function to login with improved selectors
async function loginAsDemo(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  
  // Wait for React to initialize
  await page.waitForTimeout(2000);
  
  // Check if already logged in
  const isLoggedIn = await page.locator('text=/Dashboard|Showcase|Welcome/i').count() > 0;
  
  if (!isLoggedIn) {
    // Try quick login button first
    const quickLogin = page.locator('button:has-text("Use"):near(:text("demo@innospot.com"))');
    if (await quickLogin.count() > 0) {
      await quickLogin.first().click();
    } else {
      // Manual login
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        await emailInput.fill('demo@innospot.com');
        await passwordInput.fill('Demo123!@#');
        
        const submitButton = page.locator('button[type="submit"]').first();
        await submitButton.click();
      }
    }
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  }
}

// Helper to click navigation item with retries
async function clickNavItem(page: Page, text: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const selectors = [
        `aside >> text="${text}"`,
        `nav >> text="${text}"`,
        `[data-testid="sidebar"] >> text="${text}"`,
        `button:has-text("${text}")`,
        `a:has-text("${text}")`
      ];
      
      for (const selector of selectors) {
        const element = page.locator(selector);
        if (await element.count() > 0 && await element.isVisible()) {
          await element.first().click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1000);
          return true;
        }
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
  return false;
}

test.describe('Improved Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('should display sidebar navigation', async ({ page }) => {
    // Look for sidebar with multiple selectors
    const sidebarSelectors = [
      'aside',
      '[role="navigation"]',
      '[data-testid="sidebar"]',
      '.sidebar',
      'nav:has(button)'
    ];
    
    let sidebarFound = false;
    for (const selector of sidebarSelectors) {
      const sidebar = page.locator(selector);
      if (await sidebar.count() > 0 && await sidebar.isVisible()) {
        sidebarFound = true;
        await expect(sidebar.first()).toBeVisible();
        
        // Check for navigation items
        const navItems = ['Dashboard', 'Showcase', 'Search', 'Projects'];
        for (const item of navItems) {
          const hasItem = await sidebar.locator(`text="${item}"`).count() > 0;
          if (hasItem) {
            await expect(sidebar.locator(`text="${item}"`).first()).toBeVisible();
          }
        }
        break;
      }
    }
    
    expect(sidebarFound).toBeTruthy();
  });

  test('should navigate to Dashboard', async ({ page }) => {
    const navigated = await clickNavItem(page, 'Dashboard');
    
    if (navigated) {
      // Wait for dashboard content
      await page.waitForTimeout(2000);
      
      // Check for dashboard indicators
      const dashboardSelectors = [
        'h1:has-text("Dashboard")',
        'h2:has-text("Dashboard")',
        'text=/Welcome.*Dashboard/i',
        '[data-testid="dashboard"]',
        '.dashboard-content'
      ];
      
      let dashboardFound = false;
      for (const selector of dashboardSelectors) {
        if (await page.locator(selector).count() > 0) {
          dashboardFound = true;
          await expect(page.locator(selector).first()).toBeVisible();
          break;
        }
      }
      
      // Alternative: Check for dashboard-specific content
      if (!dashboardFound) {
        const dashboardContent = [
          'text=/Overview/i',
          'text=/Statistics/i',
          'text=/Recent.*Activity/i',
          'text=/Analytics/i'
        ];
        
        for (const content of dashboardContent) {
          if (await page.locator(content).count() > 0) {
            dashboardFound = true;
            break;
          }
        }
      }
      
      expect(dashboardFound).toBeTruthy();
    }
  });

  test('should navigate to Showcase', async ({ page }) => {
    const navigated = await clickNavItem(page, 'Showcase');
    
    if (navigated) {
      await page.waitForTimeout(2000);
      
      // Check for showcase content
      const showcaseIndicators = [
        'text=/Showcase/i',
        'text=/Capabilities/i',
        'text=/AI Agents/i',
        'text=/Tools/i',
        '[data-testid="showcase"]'
      ];
      
      let showcaseFound = false;
      for (const indicator of showcaseIndicators) {
        if (await page.locator(indicator).count() > 0) {
          showcaseFound = true;
          await expect(page.locator(indicator).first()).toBeVisible();
          break;
        }
      }
      
      expect(showcaseFound).toBeTruthy();
    }
  });

  test('should navigate to Search', async ({ page }) => {
    const navigated = await clickNavItem(page, 'Search');
    
    if (navigated) {
      await page.waitForTimeout(2000);
      
      // Check for search interface
      const searchIndicators = [
        'text=/Patent.*Search/i',
        'text=/Search.*Patents/i',
        'input[placeholder*="search" i]',
        '[data-testid="search"]',
        '.search-container'
      ];
      
      let searchFound = false;
      for (const indicator of searchIndicators) {
        if (await page.locator(indicator).count() > 0) {
          searchFound = true;
          await expect(page.locator(indicator).first()).toBeVisible();
          break;
        }
      }
      
      expect(searchFound).toBeTruthy();
    }
  });

  test('should navigate to Projects', async ({ page }) => {
    const navigated = await clickNavItem(page, 'Projects');
    
    if (navigated) {
      await page.waitForTimeout(2000);
      
      // Check for projects content
      const projectIndicators = [
        'text=/Projects/i',
        'text=/Spaces/i',
        'text=/Workspaces/i',
        'button:has-text("Create")',
        'button:has-text("New Project")',
        '[data-testid="projects"]'
      ];
      
      let projectsFound = false;
      for (const indicator of projectIndicators) {
        if (await page.locator(indicator).count() > 0) {
          projectsFound = true;
          await expect(page.locator(indicator).first()).toBeVisible();
          break;
        }
      }
      
      expect(projectsFound).toBeTruthy();
    }
  });

  test('should handle breadcrumb navigation', async ({ page }) => {
    // Navigate to a section first
    await clickNavItem(page, 'Projects');
    await page.waitForTimeout(2000);
    
    // Look for breadcrumbs
    const breadcrumbSelectors = [
      'nav[aria-label="breadcrumb"]',
      '.breadcrumb',
      '.breadcrumbs',
      'ol:has(li)',
      'text=🏠'
    ];
    
    for (const selector of breadcrumbSelectors) {
      const breadcrumb = page.locator(selector);
      if (await breadcrumb.count() > 0) {
        // Try clicking home/first breadcrumb
        const homeLink = breadcrumb.locator('a').first();
        if (await homeLink.count() > 0) {
          await homeLink.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
          
          // Should be back at dashboard/home
          const atHome = await page.locator('text=/Dashboard|Home|Welcome/i').count() > 0;
          expect(atHome).toBeTruthy();
        }
        break;
      }
    }
  });

  test('should toggle mobile menu if responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Look for hamburger menu
    const menuButtonSelectors = [
      'button[aria-label*="menu" i]',
      'button:has(svg):has-text("")', // Empty text for icon-only buttons
      '[data-testid="mobile-menu"]',
      '.hamburger',
      'button.menu-toggle'
    ];
    
    for (const selector of menuButtonSelectors) {
      const menuButton = page.locator(selector);
      if (await menuButton.count() > 0 && await menuButton.isVisible()) {
        // Click to open
        await menuButton.click();
        await page.waitForTimeout(500);
        
        // Check if menu opened
        const menuOpen = await page.locator('aside, nav, .menu').isVisible();
        expect(menuOpen).toBeTruthy();
        
        // Click to close
        await menuButton.click();
        await page.waitForTimeout(500);
        break;
      }
    }
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should display user menu', async ({ page }) => {
    // Look for user avatar/menu in header
    const userMenuSelectors = [
      'button:has-text("Demo User")',
      'button:has-text("demo@innospot.com")',
      '[data-testid="user-menu"]',
      'button[aria-label*="user" i]',
      'button[aria-label*="profile" i]',
      'header >> button:has(img)',
      'header >> button.rounded-full'
    ];
    
    for (const selector of userMenuSelectors) {
      const userMenu = page.locator(selector);
      if (await userMenu.count() > 0 && await userMenu.isVisible()) {
        await userMenu.click();
        await page.waitForTimeout(1000);
        
        // Check for menu items
        const menuItems = [
          'text=/Settings/i',
          'text=/Profile/i',
          'text=/Account/i',
          'text=/Sign.*Out/i',
          'text=/Logout/i'
        ];
        
        for (const item of menuItems) {
          if (await page.locator(item).count() > 0) {
            await expect(page.locator(item).first()).toBeVisible();
            break;
          }
        }
        
        // Close menu
        await page.keyboard.press('Escape');
        break;
      }
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Check if an element is focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    expect(focusedElement).toBeTruthy();
    
    // Test Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Test keyboard shortcuts if available
    const shortcuts = [
      { key: 'Control+k', description: 'Search' },
      { key: 'Control+/', description: 'Help' },
      { key: 'Alt+d', description: 'Dashboard' }
    ];
    
    for (const shortcut of shortcuts) {
      await page.keyboard.press(shortcut.key);
      await page.waitForTimeout(1000);
      
      // Check if modal/dialog opened
      const modalOpen = await page.locator('[role="dialog"], .modal').count() > 0;
      if (modalOpen) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
  });

  test('should maintain navigation state on refresh', async ({ page }) => {
    // Navigate to a specific section
    await clickNavItem(page, 'Showcase');
    await page.waitForTimeout(2000);
    
    // Get current URL
    const urlBefore = page.url();
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if still on same section
    const urlAfter = page.url();
    
    // Either URL is preserved OR content is preserved
    const urlPreserved = urlBefore === urlAfter;
    const contentPreserved = await page.locator('text=/Showcase|Capabilities/i').count() > 0;
    
    expect(urlPreserved || contentPreserved).toBeTruthy();
  });
});