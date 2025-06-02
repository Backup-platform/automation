import { Page } from '@playwright/test';
import test, { expect } from './utils/base.po';

export class PromotionTabs {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	private readonly slider = () => this.page.locator('[class*="promotionSectionV3_promotionsSlider"]');
	private readonly containerMobile = () => this.page.locator('#promotions-body-wrapper .keen-slider__slide');
	private readonly container = () => this.page.locator('[class*="promotionSectionV3_promotionCardDesktop"]')

	public readonly loyaltyPageLocator = () => this.page.locator('#promotion-section-loyalty-promo-section-');
	public readonly homePageLocator = () => this.page.locator('#promotion-section-promo-section-v3-');
	public readonly promoDetailsPageLocator = () => this.page.locator('#promotion-section-single-promo-section-');

	private readonly cardBackground = (pageSelector: string, cardNumber: string) =>
		this.page.locator(`${pageSelector}${cardNumber}-container`).locator('>img[class*="promotionCardV3_promotionCardBackgroundImg"]');
	private readonly cardForeground = (pageSelector: string, cardNumber: string) =>
		this.page.locator(`${pageSelector}${cardNumber}-container`).locator('>img[class*="promotionCardV3_promotionCardForegroundImg"]');
	private readonly cardTitle = (pageSelector: string, cardNumber: string) =>
		this.page.locator(`${pageSelector}${cardNumber}-content`).locator('>div[class*=\'promotionCardTitle\']');
	private readonly cardSubtitle = (pageSelector: string, cardNumber: string) =>
		this.page.locator(`${pageSelector}${cardNumber}-content`).locator('>div[class*=\'promotionCardSubtitle\']');

	private readonly cardReadMore = (pageSelector: string, cardNumber: string) => this.page.locator(`${pageSelector}${cardNumber}-read-more`);
	private readonly cardSignUp = (pageSelector: string, cardNumber: string) => this.page.locator(`${pageSelector}${cardNumber}-sign-up`);

	//Actions

	//TODO: add navigztion methods
	/**
	 * Validate card elements for a given page type ("home", "loyalty", "details").
	 * @param pageType - The type of the page: 'home', 'loyalty', or 'details'.
	 */
	public async validateCardElements(pageType: 'home' | 'loyalty' | 'details') {
		let pageLocatorPartial: string;
		switch (pageType) {
			case 'home':
				pageLocatorPartial = '#promotion-section-promo-section-v3-';
				break;
			case 'loyalty':
				pageLocatorPartial = '#promotion-section-loyalty-promo-section-';
				break;
			case 'details':
				pageLocatorPartial = '#promotion-section-single-promo-section-';
				break;
			default:
				throw new Error(`Unknown pageType: ${pageType}`);
		}

		let numberOfCards = await this.container().count();
		if (await this.slider().isVisible()) {
			numberOfCards = await this.containerMobile().count();
		} else if(numberOfCards === 0) {
			expect (true, "There are any visible cards").toBe(false)
		}
		for (let i = 0; i < numberOfCards; i++) {
			await test.step('Validate promotion card elemetns for card # ' + i, async () => {
				await this.validateElementsVisible(pageLocatorPartial, i.toString());
				await this.validateArguments(pageLocatorPartial, i.toString());
			});
		}
	}

	public async validateElementsVisible(pageSelector: string, cardNumber: string) {
		await test.step('Validate Promotion Tab card elemetns are visible', async () => {
			await expect.soft(this.cardTitle(pageSelector, cardNumber),
				'Expect card Title to be visible').toBeVisible();
			await expect.soft(this.cardSubtitle(pageSelector, cardNumber),
				'Expect card Subtitle to be visible').toBeVisible();
			await expect.soft(this.cardReadMore(pageSelector, cardNumber),
				'Expect Read more button to be visible').toBeVisible();
			await expect.soft(this.cardSignUp(pageSelector, cardNumber),
				`Expect card Button to be visible`).toBeVisible();
			await expect.soft(this.cardBackground(pageSelector, cardNumber),
				'Background image is visible').toBeVisible();
			await expect.soft(this.cardForeground(pageSelector, cardNumber),
				'Foreground image is visible').toBeVisible();
		});
	}

	public async validateArguments(pageSelector: string, cardNumber: string) {
		await test.step('Validate Promotion Tab card arguments are present', async () => {
			await expect.soft(this.cardSignUp(pageSelector, cardNumber),
				'Card green button has a href attribute').toHaveAttribute('href');
			await expect.soft(this.cardReadMore(pageSelector, cardNumber),
				'Card read more button has a href attribute').toHaveAttribute('href');
			await expect.soft(this.cardBackground(pageSelector, cardNumber),
				'Background image has srcset attribute').toHaveAttribute('srcset');
			await expect.soft(this.cardBackground(pageSelector, cardNumber),
				'Background image has src attribute').toHaveAttribute('src');
			await expect.soft(this.cardForeground(pageSelector, cardNumber),
				'Foreground image has srcset attribute').toHaveAttribute('srcset');
			await expect.soft(this.cardForeground(pageSelector, cardNumber),
				'Foreground image has src attribute').toHaveAttribute('src');
		});
	}


}