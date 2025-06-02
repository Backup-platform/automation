import { Page, ViewportSize } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';


export class Promotions {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	private readonly promoContainer = () => this.page.locator('#promotion-page-container');
	private readonly cardContainers = () => this.page.locator('div[id*="promotion-card"][class*="promotions_promotionCardV3"]'); // returns ALL 
	private readonly cardContainer = (cardNumber: string) => this.page.locator('#promotion-card-' + cardNumber + '-container');
	private readonly cardBackground = (cardNumber: string) =>
		this.cardContainer(cardNumber).locator('>img[class*="promotionCardV3_promotionCardBackgroundImg"]');
	private readonly cardForeground = (cardNumber: string) =>
		this.cardContainer(cardNumber).locator('>img[class*="promotionCardV3_promotionCardForegroundImg"]');
	private readonly cardTitle = (cardNumber: string) =>
		this.page.locator('#promotion-card-' + cardNumber + '-content>div[class*=\'promotionCardTitle\']');
	private readonly cardSubtitle = (cardNumber: string) =>
		this.page.locator('#promotion-card-' + cardNumber + '-content>div[class*=\'promotionCardSubtitle\']');
	private readonly cardReadMore = (cardNumber: string) => this.page.locator('#promotion-card-' + cardNumber + '-read-more');
	private readonly cardSignUp = (cardNumber: string) => this.page.locator('#promotion-card-' + cardNumber + '-sign-up');
	private readonly cardDeposit = (cardNumber: string) => this.page.locator('#promotion-card-' + cardNumber + '-sign-up');
	private readonly walletModal = () => this.page.locator('#wallet-modal');
	private readonly registerModal = () => this.page.locator('#register-modal');

	//Action

	//TODO: add navigation methods
	public async clickReadMoreButton(cardNumber: string, readMoreURL: string) {
		await test.step(`I click the read more button`, async () => {
			await this.validateReadMoreVisible(cardNumber);
			await this.cardReadMore(cardNumber).click();
			await this.page.waitForURL('**/en/promotions/' + readMoreURL, { waitUntil: "domcontentloaded" });
		});
	}

	public async clickGreenButton(cardNumber: string) {
		await test.step(`I click the green button`, async () => {
			await this.validateCardButtonVisible(cardNumber);
			await this.cardSignUp(cardNumber).click();
		});
	}

	public async validateCardElementsContent(
		title: string, subtitle: string, buttonText: string, cardNumber: string, readMoreURL: string) {
		await test.step(`Validate elemetns of ${title} promotion card`, async () => {
			const expectedURL = '/en/promotions/' + readMoreURL;
			await this.validateCardTitleText(title, cardNumber);
			await this.validateCardSubtitleText(subtitle, cardNumber);
			await this.validateReadMoreVisible(cardNumber);
			await this.validateDeposit(cardNumber, buttonText);
			await expect.soft(this.cardSignUp(cardNumber),
				'Card green button has a href attribute').toHaveAttribute('href'); 	//TODO: validate concrete URL
			await expect.soft(this.cardReadMore(cardNumber),
				'Card green button has a href attribute').toHaveAttribute('href', expectedURL);
		});
	}

	public async validatePromotionCards(testData: JSON, offset: number, viewport: ViewportSize | null) {
		const numberOfCards = await this.cardContainers().count();
		for (let i = 0; i < numberOfCards; i++) {

			await test.step('Validate promotion card elemetns for card # ' + i, async () =>
			//await this.cardTitle(i.toString()).innerText(), async () => //TODO: figure out the text
			{
				await this.validateCardElementsVisible(i.toString());
				await this.validatePromoCardSize(testData, i, offset, viewport)
				await this.validateCardArguments(i.toString());
			});
		}
	}

	public async validateCardElementsVisible(cardNumber: string) {
		await test.step('Validate promotion card elemetns are visible', async () => {
			await this.validateCardTitleVisible(cardNumber);
			await this.validateCardSubtitleVisible(cardNumber);
			await this.validateReadMoreVisible(cardNumber);
			await this.validateCardButtonVisible(cardNumber);
			await expect.soft(this.cardBackground(cardNumber),
				'Background image is visible').toBeVisible();
			await expect.soft(this.cardForeground(cardNumber),
				'Foreground image is visible').toBeVisible();
		});
	}

	public async validateCardArguments(cardNumber: string) {
		await test.step('Validate promotion card arguments are present', async () => {
			await expect.soft(this.cardSignUp(cardNumber),
				'Card green button has a href attribute').toHaveAttribute('href');
			await expect.soft(this.cardReadMore(cardNumber),
				'Card read more button has a href attribute').toHaveAttribute('href');
			await expect.soft(this.cardBackground(cardNumber),
				'Background image has srcset attribute').toHaveAttribute('srcset');
			await expect.soft(this.cardBackground(cardNumber),
				'Background image has src attribute').toHaveAttribute('src');
			await expect.soft(this.cardForeground(cardNumber),
				'Foreground image has srcset attribute').toHaveAttribute('srcset');
			await expect.soft(this.cardForeground(cardNumber),
				'Foreground image has src attribute').toHaveAttribute('src');
		});
	}

	public async validateCardImageSRC(cardNumber: string) {
		await expect.soft(this.cardBackground(cardNumber),
			'Background image is visible').toBeVisible();
		await expect.soft(this.cardForeground(cardNumber),
			'Background image is visible').toBeVisible();
		await expect.soft(this.cardBackground(cardNumber),
			'Background image has srcset attribute').toHaveAttribute('srcset');
		await expect.soft(this.cardBackground(cardNumber),
			'Background image has src attribute').toHaveAttribute('src');
		await expect.soft(this.cardForeground(cardNumber),
			'Foreground image has srcset attribute').toHaveAttribute('srcset');
		await expect.soft(this.cardForeground(cardNumber),
			'Foreground image has src attribute').toHaveAttribute('src');
	}
	public async validateCardCount(numberOfCards: number) {
		//TODO: remove comments when you fix the test data file
		//await expect((await (this.cardCount().all())).length, 
		//	`Expect promotion card number to be ${numberOfCards}`).toEqual(numberOfCards);
		
		// Temporary placeholder to avoid unused parameter warning
		console.log(`Expected number of cards: ${numberOfCards}`);
	}

	public async validatePromoContainer(): Promise<void> {
		await expect.soft(this.promoContainer(),
			'Expect promotion cards container is visible').toBeVisible();
	}

	public async validateCardSize(cardSizes: { firstCard: number, generalCard: number }, offset: number) {
		await test.step('Validate promotion card sizes', async () => {
			const numberOfCards = await this.cardContainers().count();
			for (let i = 0; i < numberOfCards; i++) {
				const box = await this.cardContainer(i.toString()).boundingBox();
				if (i === 0) {
					expect.soft(box?.width, 'Expect width size').toBeGreaterThanOrEqual(cardSizes.firstCard - offset);
					expect.soft(box?.width, 'Expect width size').toBeLessThanOrEqual(cardSizes.firstCard + offset);
				} else {
					//await console.log('Box width: ' + await box?.width)
					expect.soft(box?.width, 'Expect width size').toBeGreaterThanOrEqual(cardSizes.generalCard - offset);
					expect.soft(box?.width, 'Expect width size').toBeLessThanOrEqual(cardSizes.generalCard + offset);
					//await expect.soft(await box?.height, 'Expect height to be').toBe(height);
				}
			}
		});
	}

	public async validatePromoCardSize(testData: JSON, cardNumber: number, offset: number, viewport: ViewportSize | null) {
		await test.step('Validate promotion card sizes', async () => {
			const box = await this.cardContainer(cardNumber.toString()).boundingBox();
			const viewportHeight = viewport?.width.toString();
			Object.entries(testData).map(async ([key, cardValue]) => {
				if (key === viewportHeight) {  //TODO: add height validations when the concrete sizes are defined by design team
					if (cardNumber === 0) {
						expect.soft(box?.width, 'Expect First Card is widthin size').toBeGreaterThanOrEqual(Number(await Object.values(cardValue)[0]) - offset);
						expect.soft(box?.width, 'Expect First Card is widthin size').toBeLessThanOrEqual(Number(await Object.values(cardValue)[0]) + offset);
					} else {
						expect.soft(box?.width, 'Expect Card is widthin size').toBeGreaterThanOrEqual(Number(await Object.values(cardValue)[1]) - offset);
						expect.soft(box?.width, 'Expect Card is widthin size').toBeLessThanOrEqual(Number(await Object.values(cardValue)[1]) + offset);
					}
				}
			});
		});
	}

	public async validateCardTitleText(textToContain: string, cardNumber: string) {
		await expect.soft(this.cardTitle(cardNumber),
			`Expect card title to be:${textToContain}`).toContainText(textToContain);
	}

	public async validateCardTitleVisible(cardNumber: string) {
		await expect.soft(this.cardTitle(cardNumber),
			'Expect card Title to be visible').toBeVisible();
	}

	public async validateCardSubtitleText(textToContain: string, cardNumber: string) {
		await expect.soft(this.cardSubtitle(cardNumber),
			`Expect subtitle text to be: ${textToContain}`).toContainText(textToContain);
	}

	public async validateCardSubtitleVisible(cardNumber: string) {
		await expect.soft(this.cardSubtitle(cardNumber),
			'Expect card Subtitle to be visible').toBeVisible();
	}

	public async validateReadMoreVisible(cardNumber: string) {
		await expect.soft(this.cardReadMore(cardNumber),
			'Expect Read more button to be visible').toBeVisible();
	}

	public async validateCardButtonVisible(cardNumber: string) {
		await expect.soft(this.cardDeposit(cardNumber),
			`Expect card Button to be visible`).toBeVisible();
	}

	public async validateWalletModalVisible() {
		await expect.soft(this.walletModal(),
			`Expect wallet modal to be visible`).toBeVisible();
	}

	public async validateRegisterModalVisible() {
		await expect.soft(this.registerModal(),
			`Expect register modal to be visible`).toBeVisible();
	}

	public async validateDeposit(cardNumber: string, textToContain: string) {
		await this.validateCardButtonVisible(cardNumber);
		await expect.soft(this.cardDeposit(cardNumber),
			`Expect button text to be: ${textToContain}`).toContainText(textToContain);
	}

	public async validateURL() {
		expect(this.page.url(), 'Validate the URL for the promotions page').
			toEqual(`${process.env.URL}` + '/promotions');
	}

}