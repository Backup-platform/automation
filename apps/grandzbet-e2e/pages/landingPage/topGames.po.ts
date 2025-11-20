import { expect, Locator, Page } from '@playwright/test';

export class LandingPageTopGames {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ---------- HELPERS ----------
  private async dismissOverlays() {
    const candidates = [
      '[data-testid="cookie-accept"]',
      'button:has-text("Accept Cookies")',
      'button:has-text("Accept")',
      'button:has-text("Разбрах")',
      '[data-testid="age-gate-accept"]',
      '[data-testid="close"], button[aria-label="Close"]',
    ];

    for (const sel of candidates) {
      const b = this.page.locator(sel).first();
      if (await b.isVisible().catch(() => false)) {
        await b.click().catch(() => {});
      }
    }
  }

  
  private section(): Locator {
    const heading = this.page
      .getByRole('heading', {
        name: /top\s*casino\s*games|top\s*games|topgames|топ\s*казино\s*игри|топ\s*игри|най[-\s]?добрите\s*игри/i,
      })
      .first();

    return heading.locator('xpath=ancestor::*[self::section or self::div][1]');
  }

  private sectionTitle(): Locator {
    return this.section()
      .locator('h2, h3, [role="heading"]')
      .filter({ hasText: /top\s*games|topgames|топ|най/i })
      .first();
  }

  private showAll(): Locator {
    return this.section()
      .getByRole('link', { name: /show\s*all|виж\s*всички|всички/i })
      .first();
  }

  
  private firstCard(): Locator {
    return this.section()
      .locator('a, button, [role="link"], [role="button"]')
      .first();
  }

  
  private cardImage(): Locator {
    return this.section().locator('img, picture').first();
  }

 
  private cardTitle(): Locator {
    return this.section()
      .locator('h3, h4, [class*="title"]')
      .first();
  }

  private leftArrow(): Locator {
    return this.section()
      .locator(
        'button.swiper-button-prev, button[aria-label*="Prev" i], button:has([data-icon*="left"])'
      )
      .first();
  }

  private rightArrow(): Locator {
    return this.section()
      .locator(
        'button.swiper-button-next, button[aria-label*="Next" i], button:has([data-icon*="right"])'
      )
      .first();
  }

  private async stabilize() {
    await this.dismissOverlays();

    await this.page.waitForLoadState('load').catch(() => {});

    await expect
      .soft(this.section(), 'Top Games section should become visible')
      .toBeVisible({ timeout: 30_000 });

    await this.section().scrollIntoViewIfNeeded().catch(() => {});
  }

  // ---------- ASSERTIONS / ACTIONS ----------
  public async validateTopGamesVisible(): Promise<void> {
    await this.stabilize();
    await expect
      .soft(this.sectionTitle(), 'Section title to be visible')
      .toBeVisible();

    await expect
      .soft(this.showAll(), 'Show All link to be visible')
      .toBeVisible();

    await expect
      .soft(this.firstCard(), 'First Top Game card to be visible')
      .toBeVisible();

    
    const img = this.cardImage();
    if (await img.count()) {
      await expect
        .soft(img, 'Card image to be visible (if present)')
        .toBeVisible();
    }

    
    const title = this.cardTitle();
    if (await title.count()) {
      await expect
        .soft(title, 'Card title (if present) to be visible')
        .toBeVisible();
    }
  }

  public async clickShowAll() {
    await this.stabilize();
    await this.showAll().click();
  }

  public async clickRightArrow() {
    await this.stabilize();
    if (await this.rightArrow().isVisible().catch(() => false)) {
      await this.rightArrow().click();
    }
  }

  public async clickLeftArrow() {
    await this.stabilize();
    if (await this.leftArrow().isVisible().catch(() => false)) {
      await this.leftArrow().click();
    }
  }
}
