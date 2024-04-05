import { Locator, Page } from '@playwright/test';
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

	private readonly cardBackground = (page: Locator, cardNumber: string) =>
		this.page.locator(page['_selector'] + cardNumber + '-container').locator('>img[class*="promotionCardV3_promotionCardBackgroundImg"]');
	private readonly cardForeground = (page: Locator, cardNumber: string) =>
		this.page.locator(page['_selector'] + cardNumber + '-container').locator('>img[class*="promotionCardV3_promotionCardForegroundImg"]');
	private readonly cardTitle = (page: Locator, cardNumber: string) =>
		this.page.locator(page['_selector'] + cardNumber + '-content').locator('>div[class*=\'promotionCardTitle\']');
	private readonly cardSubtitle = (page: Locator, cardNumber: string) =>
		this.page.locator(page['_selector'] + cardNumber + '-content').locator('>div[class*=\'promotionCardSubtitle\']');

	private readonly cardReadMore = (page: Locator, cardNumber: string) => this.page.locator(page['_selector'] + cardNumber + '-read-more');
	private readonly cardSignUp = (page: Locator, cardNumber: string) => this.page.locator(page['_selector'] + cardNumber + '-sign-up');

	//Actions

	/**
	 * 
	 * @param pageLocatorPartial you need to provide one of the public partial page locators
	 * each page has a different begining of the locators for the promotion cards
	 */
	public async validateCardElements(pageLocatorPartial: Locator) {
		var numberOfCards = await this.container().count();
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

	public async validateElementsVisible(page: Locator, cardNumber: string) {
		await test.step('Validate Promotion Tab card elemetns are visible', async () => {
			await expect.soft(this.cardTitle(page, cardNumber),
				'Expect card Title to be visible').toBeVisible();
			await expect.soft(this.cardSubtitle(page, cardNumber),
				'Expect card Subtitle to be visible').toBeVisible();
			await expect.soft(this.cardReadMore(page, cardNumber),
				'Expect Read more button to be visible').toBeVisible();
			await expect.soft(this.cardSignUp(page, cardNumber),
				`Expect card Button to be visible`).toBeVisible();
			await expect.soft(this.cardBackground(page, cardNumber),
				'Background image is visible').toBeVisible();
			await expect.soft(this.cardForeground(page, cardNumber),
				'Foreground image is visible').toBeVisible();
		});
	}

	public async validateArguments(page: Locator, cardNumber: string) {
		await test.step('Validate Promotion Tab card arguments are present', async () => {
			await expect.soft(this.cardSignUp(page, cardNumber),
				'Card green button has a href attribute').toHaveAttribute('href');
			await expect.soft(this.cardReadMore(page, cardNumber),
				'Card read more button has a href attribute').toHaveAttribute('href');
			await expect.soft(this.cardBackground(page, cardNumber),
				'Background image has srcset attribute').toHaveAttribute('srcset');
			await expect.soft(this.cardBackground(page, cardNumber),
				'Background image has src attribute').toHaveAttribute('src');
			await expect.soft(this.cardForeground(page, cardNumber),
				'Foreground image has srcset attribute').toHaveAttribute('srcset');
			await expect.soft(this.cardForeground(page, cardNumber),
				'Foreground image has src attribute').toHaveAttribute('src');
		});
	}


}