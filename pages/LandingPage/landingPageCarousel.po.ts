import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';
import { pathToFileURL } from 'url';

export class LandingPageCarousel {
	readonly page: Page;
	readonly navigation: Navigation;

	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page)
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
	public async validateContainerVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.container(), softAssert, 'Promotion container');
	}

	public async validateVisibleSectionVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.visibleSection(), softAssert, 'Promotion section');
	}

	public async validateDotsContainerVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.dotsContainer(), softAssert, 'Dots container');
	}

	public async validateDotsVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.dots(), softAssert, 'Dots');
	}

	public async validateArrowLeftButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.arrowLeftButton(), softAssert, 'Left arrow button');
	}

	public async validateArrowRightButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.arrowRightButton(), softAssert, 'Right arrow button');
	}

	public async validatePromotionsEntriesVisible(nthElement: number, softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionEntries().nth(nthElement), softAssert,
			`Container number ${nthElement}`);
	}

	public async validateEnterButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.enterButton(), softAssert, 'Enter button');
	}

	//TODO: this is not exactly a visibility method this tracks the href link

	public async validateEnterButtonLinkVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.userReceiveBonusLink(), softAssert, 'Enter button link');
	}

	public async validateReceiveBonusButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.receiveBonusButton(), softAssert, 'Receive bonus button');
	}

	public async validatePromotionsTitlesVisible(nthElement: number, softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionsTitles().nth(nthElement), softAssert,
			`Title number ${nthElement}`);
	}

	public async validatePromotionsSubtitlesVisible(nthElement: number, softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionsSubtitles().nth(nthElement), softAssert,
			`Subtitle number ${nthElement}`);
	}

	public async validatePromotionsTextVisible(nthElement: number, softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionsText().nth(nthElement), softAssert,
			`Text number ${nthElement}`);
	}

	@step('I click on the left arrow button')
	public async clickArrowLeftButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.arrowLeftButton(), softAssert, 'Left arrow button');
		//await this.page.waitForTimeout(500);
	}

	@step('I click on the right arrow button')
	public async clickArrowRightButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.arrowRightButton(), softAssert, 'Right arrow button');
		//await this.page.waitForTimeout(500);
	}

	@step('I click on the enter button')
	public async clickEnterButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.enterButton(), softAssert, 'Enter button');
	}

	@step('I click on the receive bonus button')
	public async clickReceiveBonusButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.receiveBonusButton(), softAssert, 'Receive bonus button');
	}

	@step('I click on the dot')
	public async clickDot(index: number, softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.dots().nth(index), softAssert, `Carousel Dot Number ${index}`);
	}

	@stepParam((index) => `I validate the dot at index ${index} has active class`)
	async validateDotIsActive(index: number): Promise<void> {
		await expect(this.dots().nth(index),
			`Dot at index ${index} should have the active class.`).toHaveClass(new RegExp(`${this.dotsActiveClass}`));
	}

	@step('I validate the carousel elements are visible for a guest')
	public async validateElementsVisibleGuest(): Promise<void> {
		await this.validateContainerVisible();
		//TODO: await this.validateDotsContainerVisible(true);
		await this.validateVisibleSectionVisible(true);
		await this.validateArrowLeftButtonVisible(true);
		await this.validateArrowRightButtonVisible(true);
		await this.validateEnterButtonVisible(true);
	}

	@step('I validate the carousel elements are visible for a member')
	public async validateElementsVisibleMember(): Promise<void> {
		await this.validateContainerVisible();
		//TODO: await this.validateDotsContainerVisible(true);
		await this.validateVisibleSectionVisible(true);
		await this.validateArrowLeftButtonVisible(true);
		await this.validateArrowRightButtonVisible(true);
		await this.validateReceiveBonusButtonVisible(true);
	}

	async getActiveDotIndex(): Promise<number> {
		const activeIndices = await this.navigation.getIndicesByAttribute(this.dots(), 'class', this.dotsActiveClass);
		expect(activeIndices.length,
			`Expect exactly one active element with class "${this.dotsActiveClass}", found - ${activeIndices.length}.`).toEqual(1)
		return activeIndices[0];
	}


	@step('I validate carousel navigation trogh points and arrows')
	async validateCarousel(): Promise<void> {
		//await this.validateDotsInitialState();
		const entriesCount = await this.promotionEntries().count();
		await this.dots().nth(0).click();
		for (let i = 0; i < entriesCount; i++) {
			await this.clickDot(i);
			await this.validateDotIsActive(i);
			//TODO: expect(await this.getActiveDotIndex()).toEqual(i);
			await this.validatePromotionsEntriesVisible(i);
			await this.validatePromotionsTitlesVisible(i);
			//await this.validatePromotionsSubtitlesVisible(i);
			await this.validatePromotionsTextVisible(i);

			// Navigate forward with the right arrow and validate synchronization
			if (i < entriesCount - 1) {
				await this.clickArrowRightButton();
				await this.validateDotIsActive(i + 1);
				//expect (await this.getActiveDotIndex()).toEqual(i+1); //TODO: maybe animations cause it to fail
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
	public async validateGetBonusNavigation(softAssert = false): Promise<void> {
		await this.clickDot(0, softAssert);
		await this.clickReceiveBonusButton(softAssert);
		await this.navigation.assertUrl(`${process.env.URL}promotions`);
	}

	@step('I validate carousel enter navigation for a guest')
	public async validateEnterNavigation(softAssert = false): Promise<void> {
		await this.clickDot(0, softAssert);
		await this.clickEnterButton(softAssert);
	}
}