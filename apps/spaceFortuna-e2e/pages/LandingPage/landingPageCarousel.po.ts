import { Page } from '@playwright/test';
import { expect } from '../utils/base.po';
import { step, stepParam, assertAttribute, assertUrl, clickElement, assertVisible } from '@test-utils/navigation.po';
import { getElementIndices } from '@test-utils/utilities';

export class LandingPageCarousel {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators

	readonly container = () => this.page.locator('div[class*="_promotionsCarouselContainer_"]');
	readonly visibleSection = () => this.page.locator('div[class*="_promoSectionContent_"]');
	readonly dots = () => this.page.locator('.dot');
	readonly dotsContainer = () => this.page.locator('.dots');
	readonly dotsActiveClass = '_dotActive_';
	readonly arrowLeftButton = () => this.page.locator('div[class*="_carouselPromotionsArrowContainer_"]').nth(0);
	readonly arrowRightButton = () => this.page.locator('div[class*="_carouselPromotionsArrowContainer_"]').nth(1);
	//readonly promotionContent = () => this.page.locator('div[class*="_promoSectionContent_"] .keen-slider__slide');
	readonly promotionEntries = () => this.page.locator('#promotion-container');
	readonly enterButton = () => this.page.locator('div[class*="_enterBtn_"]');
	readonly userReceiveBonusLink = () => this.page.locator('div[class*="_promotionsCarouselContainer_"] .relative a');
	readonly receiveBonusButton = () => this.page.locator('div[class*="_getBonusButton_"]');
	readonly promotionsTitles = () => this.page.locator('h3[class*="carouselPromotionsTitle_"]');
	readonly promotionsSubtitles = () => this.page.locator('h1[class*="carouselPromotionsSubtitle_"]');
	readonly promotionsText = () => this.page.locator('div[class*="carouselPromotionsText_"]');

	//Actions
	public validateContainerVisible = async (softAssert = false) =>
		await assertVisible(this.container(), 'Promotion container', softAssert);

	public validateVisibleSectionVisible = async (softAssert = false) =>
		await assertVisible(this.visibleSection(), 'Promotion section', softAssert);

	public validateDotsContainerVisible = async (softAssert = false) =>
		await assertVisible(this.dotsContainer(), 'Dots container', softAssert);

	public validateDotsVisible = async (softAssert = false) =>
		await assertVisible(this.dots(), 'Dots', softAssert);

	public validateArrowLeftButtonVisible = async (softAssert = false) =>
		await assertVisible(this.arrowLeftButton(), 'Left arrow button', softAssert);

	public validateArrowRightButtonVisible = async (softAssert = false) =>
		await assertVisible(this.arrowRightButton(), 'Right arrow button', softAssert);

	public validatePromotionsEntriesVisible = async (nthElement: number, softAssert = false) =>
		await assertVisible(this.promotionEntries().nth(nthElement), `Container number ${nthElement}`, softAssert);

	public validateEnterButtonVisible = async (softAssert = false) =>
		await assertVisible(this.enterButton(), 'Enter button', softAssert);

	public validateEnterButtonLinkVisible = async (softAssert = false) =>
		await assertVisible(this.userReceiveBonusLink(), 'Enter button link', softAssert);

	public validateReceiveBonusButtonVisible = async (softAssert = false) =>
		await assertVisible(this.receiveBonusButton(), 'Receive bonus button', softAssert);

	public validatePromotionsTitlesVisible = async (nthElement: number, softAssert = false) =>
		await assertVisible(this.promotionsTitles().nth(nthElement), `Title number ${nthElement}`, softAssert);

	public validatePromotionsSubtitlesVisible = async (nthElement: number, softAssert = false) =>
		await assertVisible(this.promotionsSubtitles().nth(nthElement), `Subtitle number ${nthElement}`, softAssert);

	public validatePromotionsTextVisible = async (nthElement: number, softAssert = false) =>
		await assertVisible(this.promotionsText().nth(nthElement), `Text number ${nthElement}`, softAssert);

	public clickArrowLeftButton = async () => await clickElement(this.arrowLeftButton(), 'Left arrow button');

	public clickArrowRightButton = async () => await clickElement(this.arrowRightButton(), 'Right arrow button');
	
	public clickEnterButton = async (): Promise<void> => await clickElement(this.enterButton(), 'Enter button');

	public clickReceiveBonusButton = async () => await clickElement(this.receiveBonusButton(), 'Receive bonus button');

	public clickDot = async (index: number) => await clickElement(this.dots().nth(index), `Carousel Dot Number ${index}`);

	@stepParam((index) => `I validate the dot at index ${index} has active class`)
	async validateDotIsActive(index: number, softAssert = false): Promise<void> {
		await assertAttribute(this.dots().nth(index), "class", 
		`Carousel dot ${index}`, softAssert, new RegExp(this.dotsActiveClass));
	}

	@step('I validate the carousel elements are visible for a guest')
	public async validateElementsVisibleGuest(): Promise<void> {
		await this.validateContainerVisible();
		await this.validateDotsContainerVisible(true);
		await this.validateVisibleSectionVisible(true);
		await this.validateArrowLeftButtonVisible(true);
		await this.validateArrowRightButtonVisible(true);
		await this.validateEnterButtonVisible(true);
	}

	@step('I validate the carousel elements are visible for a member')
	public async validateElementsVisibleMember(): Promise<void> {
		await this.validateContainerVisible();
		await this.validateDotsContainerVisible(true);
		await this.validateVisibleSectionVisible(true);
		await this.validateArrowLeftButtonVisible(true);
		await this.validateArrowRightButtonVisible(true);
		await this.validateReceiveBonusButtonVisible(true);
	}
	@step('I validate only one active dot is present')
	async getActiveDotIndex(): Promise<number> {
		const activeIndices = await getElementIndices(this.dots(), {
			attributeName: 'class',
			attributeValue: this.dotsActiveClass,
			matchType: 'contains'
		});
		expect(activeIndices.length,
			`Expect exactly one active element with class "${this.dotsActiveClass}", found - ${activeIndices.length}.`).toEqual(1)
		return activeIndices[0];
	}


	@step('I validate carousel navigation through points and arrows')
	async validateCarousel(): Promise<void> {
		const entriesCount = await this.promotionEntries().count();
		await this.dots().nth(1).click();
		for (let i = 0; i < entriesCount; i++) {
			await this.clickDot(i);
			await this.validateDotIsActive(i);
			await expect(await this.getActiveDotIndex()).toEqual(i);
			await this.validatePromotionsEntriesVisible(i);
			await this.validatePromotionsTitlesVisible(i);
			//await this.validatePromotionsSubtitlesVisible(i); //FIXME: it works fine staging is missing the subtitle
			await this.validatePromotionsTextVisible(i);

			// Navigate forward with the right arrow and validate synchronization
			if (i < entriesCount - 1) {
				await this.clickArrowRightButton();
				await this.validateDotIsActive(i + 1);
				await expect (await this.getActiveDotIndex()).toEqual(i+1);
				await this.validatePromotionsEntriesVisible(i + 1);
			}
		}

		// Navigate backward to validate left arrow functionality
		for (let i = entriesCount - 1; i > 0; i--) {
			await this.clickArrowLeftButton();
			await this.validateDotIsActive(i - 1);
			await this.validatePromotionsEntriesVisible(i - 1)
		}
	}

	@step('I validate carousel get bonus navigation for a member')
	public async validateGetBonusNavigation(): Promise<void> {
		await this.clickDot(0);
		await this.clickReceiveBonusButton();
		await assertUrl(this.page, `${process.env.URL}promotions`);
	}

	@step('I validate carousel enter navigation for a guest')
	public async validateEnterNavigation(): Promise<void> {
		await this.clickDot(0);
		await this.clickEnterButton();
	}
}