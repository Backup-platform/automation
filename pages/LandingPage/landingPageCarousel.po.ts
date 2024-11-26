import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation } from '../utils/navigation.po';
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
		await this.navigation.assertVisible(this.container(), softAssert, 'Expect the promotion section to be visible');
	}

	public async validateVisibleSectionVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.visibleSection(), softAssert, 'Expect the promotion section to be visible');
	}

	public async validateDotsContainerVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.dotsContainer(), softAssert, 'Expect the dots container to be visible');
	}

	public async validateDotsVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.dots(), softAssert, 'Expect the dots to be visible');
	}

	public async validateArrowLeftButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.arrowLeftButton(), softAssert, 'Expect the left arrow button to be visible');
	}

	public async validateArrowRightButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.arrowRightButton(), softAssert, 'Expect the right arrow button to be visible');
	}

	public async validatePromotionsEntriesVisible(nthElement: number, softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionEntries().nth(nthElement), softAssert,
			`Expect promotions container number ${nthElement} to be visible`);
	}

	public async validateEnterButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.enterButton(), softAssert, 'Expect the enter button to be visible');
	}

	//TODO: this is not exactly a visibility method this tracks the href link

	public async validateEnterButtonLinkVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.userReceiveBonusLink(), softAssert, 'Expect the enter button link to be visible');
	}

	public async validateReceiveBonusButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.receiveBonusButton(), softAssert, 'the receive bonus button');
	}

	public async validatePromotionsTitlesVisible(nthElement: number, softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionsTitles().nth(nthElement), softAssert,
			`Expect promotions title number ${nthElement} to be visible`);
	}

	public async validatePromotionsSubtitlesVisible(nthElement: number, softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionsSubtitles().nth(nthElement), softAssert,
			`Expect promotions subtitle number ${nthElement} to be visible`);
	}

	public async validatePromotionsTextVisible(nthElement: number, softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionsText().nth(nthElement), softAssert,
			`Expect promotions text number ${nthElement} to be visible`);
	}

	public async clickArrowLeftButton(softAssert = false): Promise<void> {
		await test.step('I click on the left arrow button', async () => {
			await this.navigation.clickElement(this.arrowLeftButton(), softAssert, 'Expect the left arrow button to be visible');
			//await this.page.waitForTimeout(500);
		});
	}

	public async clickArrowRightButton(softAssert = false): Promise<void> {
		await test.step('I click on the right arrow button', async () => {
			await this.navigation.clickElement(this.arrowRightButton(), softAssert, 'Expect the right arrow button to be visible');
			//await this.page.waitForTimeout(500);
		});
	}

	public async clickEnterButton(softAssert = false): Promise<void> {
		await test.step('I click on the enter button', async () => {
			await this.navigation.clickElement(this.enterButton(), softAssert, 'Expect the enter button to be visible');
		});
	}

	public async clickReceiveBonusButton(softAssert = false): Promise<void> {
		await test.step('I click on the receive bonus button', async () => {
			await this.navigation.clickElement(this.receiveBonusButton(), softAssert, 'Expect the receive bonus button to be visible');
		});
	}

	public async clickDot(index: number, softAssert = false): Promise<void> {
		await test.step('I click on the dot', async () => {
			await this.navigation.clickElement(this.dots().nth(index), softAssert, 'Expect the dot to be visible');
			await this.validateDotIsActive(index);
		});
	}

	async validateDotIsActive(index: number): Promise<void> {
		await expect(this.dots().nth(index), 
		`Dot at index ${index} should have the active class.`).toHaveClass(new RegExp(`${this.dotsActiveClass}`));
	}

	public async validateCarouselElementsAreVisibleForGuest(): Promise<void> {
		await test.step('I check if the Carousel elements are visible for a guest', async () => {
			await this.validateContainerVisible();
			await this.validateDotsContainerVisible(true);
			await this.validateVisibleSectionVisible(true);
			await this.validateArrowLeftButtonVisible(true);
			await this.validateArrowRightButtonVisible(true);
			await this.validateEnterButtonVisible(true);
		});
	}

	public async validateCarouselElementsAreVisibleForMember(): Promise<void> {
		await test.step('I check if the Carousel elements are visible for a member', async () => {
			await this.validateContainerVisible();
			await this.validateDotsContainerVisible(true);
			await this.validateVisibleSectionVisible(true);
			await this.validateArrowLeftButtonVisible(true);
			await this.validateArrowRightButtonVisible(true);
			await this.validateReceiveBonusButtonVisible(true);
		});
	}

	async getActiveDotIndex(): Promise<number> {
		const activeIndices = await this.navigation.getIndicesByAttribute(this.dots(), 'class', this.dotsActiveClass);
		await expect(activeIndices.length, 
			`Expect exactly one active element with class "${this.dotsActiveClass}", found - ${activeIndices.length}.`).toEqual(1)
		return activeIndices[0];
	}


	async validateDotsInitialState(): Promise<void> {
		//TODO: write expect messages 
		expect(await this.dots().count(), 'Expect there are more than 0 dots').toBeGreaterThan(0);
		expect(await this.promotionEntries().count(), 'Expect there are more than 0 promotions').toBeGreaterThan(0);
		expect(await this.dots().count(),'Expect the number of dots equals the number of promotions').toEqual(await this.promotionEntries().count());
		await this.validatePromotionsEntriesVisible(await this.getActiveDotIndex());
	};


	async validateCarousel(): Promise<void> {
		//await this.validateDotsInitialState();
		const entriesCount = await this.promotionEntries().count();
		await this.dots().nth(0).click();
		for (let i = 0; i < entriesCount; i++) {
			await this.clickDot(i);
			expect (await this.getActiveDotIndex()).toEqual(i);
			await this.validatePromotionsEntriesVisible(i);
			await this.validatePromotionsTitlesVisible(i);
			await this.validatePromotionsSubtitlesVisible(i);
			await this.validatePromotionsTextVisible(i);
	
			// Navigate forward with the right arrow and validate synchronization
			if (i < entriesCount - 1) {
				await this.clickArrowRightButton();
				await this.validateDotIsActive(i+1);
				//expect (await this.getActiveDotIndex()).toEqual(i+1); //TODO: maybe animations cause it to fail
				await this.validatePromotionsEntriesVisible(i+1);
				await this.validatePromotionsSubtitlesVisible(i+1);
				await this.validatePromotionsTitlesVisible(i+1);
				await this.validatePromotionsTextVisible(i+1);
			}
		}
	
		// Navigate backward to validate left arrow functionality
		for (let i = entriesCount - 1; i > 0; i--) {
			await this.clickArrowLeftButton();
			await this.validateDotIsActive(i-1);
			await this.validatePromotionsEntriesVisible(i-1)
			await this.validatePromotionsTitlesVisible(i-1);
			await this.validatePromotionsSubtitlesVisible(i-1);
			await this.validatePromotionsTextVisible(i-1);
		}
	}
}