import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { assertVisible } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';

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
      // понякога има мини чат/поп-ъп
      '[data-testid="age-gate-accept"]',
      '[data-testid="close"], button[aria-label="Close"]',
    ];
    for (const s of candidates) {
      const btn = this.page.locator(s).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click({ trial: false }).catch(() => {});
      }
    }
  }

  // ---------- LOCATORS (робустни) ----------
  /**
   * Заглавието в UI е „TopGames“ (без интервал). Хващаме heading по роля,
   * като допускаме и "Top Games", и преводи (бг вариант).
   */
  private readonly heading = compositeLocator(
    () =>
      this.page
        .getByRole('heading', {
          name: /top\s*games|topgames|най[-\s]?добрите\s*игри/i,
        })
        .first(),
    'Top Games heading'
  );

  /**
   * Секцията е най-близкият контейнер (section/div) над хединга.
   */
  private readonly section = compositeLocator(
    () =>
      this.heading
        .locator()
        .locator('xpath=ancestor::*[self::section or self::div][1]'),
    'Top Games section'
  );

  private readonly sectionTitle = compositeLocator(
    () => this.heading.locator(),
    'Top Games section title'
  );

  private readonly showAllButton = compositeLocator(
    () =>
      this.section
        .locator()
        .getByRole('button', { name: /show\s*all|виж всички|всички/i })
        .first(),
    'Show All button'
  );

  /**
   * Първа карта – гъвкави селектори, защото DOM класовете са утилити (Tailwind).
   * Търсим card anchor/елемент, който има <img> вътре.
   */
  private readonly firstCard = compositeLocator(
    () =>
      this.section
        .locator()
        .locator(
          '[data-testid="game-card"], .game-card, [class*="game-card"], a:has(img)'
        )
        .first(),
    'First Top Game card'
  );

  private readonly cardImage = compositeLocator(
    () => this.firstCard.locator().locator('img').first(),
    'Game card image'
  );

  private readonly cardTitle = compositeLocator(
    () =>
      this.firstCard
        .locator()
        .locator('h3, h4, [class*="title"], .game-title, [aria-label]')
        .first(),
    'Game card title'
  );

  private readonly cardSubtitle = compositeLocator(
    () =>
      this.firstCard
        .locator()
        .locator('.provider, [class*="provider"], [data-testid="provider"]')
        .first(),
    'Game card subtitle/provider'
  );

  /**
   * Стрелки – понякога са с класове на Swiper, понякога само aria-label.
   */
  private readonly arrowLeft = compositeLocator(
    () =>
      this.section
        .locator()
        .locator(
          'button.swiper-button-prev, button[aria-label*="Prev" i], button:has(svg[aria-label*="Prev" i]), button:has([data-icon*="left"])'
        )
        .first(),
    'Carousel left arrow'
  );

  private readonly arrowRight = compositeLocator(
    () =>
      this.section
        .locator()
        .locator(
          'button.swiper-button-next, button[aria-label*="Next" i], button:has(svg[aria-label*="Next" i]), button:has([data-icon*="right"])'
        )
        .first(),
    'Carousel right arrow'
  );

  // ---------- ASSERTIONS ----------
  @step('Top Games: Validate all elements visible')
  public async validateTopGamesVisible(softAssert = false): Promise<void> {
    await this.dismissOverlays();

    // изчакай да се хидратира секцията (ако е lazy)
    await this.section.locator().waitFor({ state: 'attached', timeout: 30000 });

    // не насилвай scrollIntoViewIfNeeded() преди да е attach-нат DOM-а – това ти е забивало теста
    await assertVisible(this.sectionTitle, softAssert);
    await assertVisible(this.showAllButton, softAssert);
    await assertVisible(this.firstCard, softAssert);
    await assertVisible(this.cardImage, softAssert);
    await assertVisible(this.cardTitle, softAssert);
    await assertVisible(this.cardSubtitle, softAssert);
    await assertVisible(this.arrowLeft, softAssert);
    await assertVisible(this.arrowRight, softAssert);
  }

  // ---------- ACTIONS ----------
  @step('Top Games: Click Show All button')
  public async clickShowAll() {
    await this.dismissOverlays();
    await this.showAllButton.locator().click();
  }

  @step('Top Games: Navigate right')
  public async clickRightArrow() {
    await this.dismissOverlays();
    await this.arrowRight.locator().click({ trial: false });
  }

  @step('Top Games: Navigate left')
  public async clickLeftArrow() {
    await this.dismissOverlays();
    await this.arrowLeft.locator().click({ trial: false });
  }
}
