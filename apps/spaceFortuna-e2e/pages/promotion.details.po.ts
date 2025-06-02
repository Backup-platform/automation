import { Page } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';


export class PromotionDetails {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	private readonly promoBannerCard = () => this.page.locator('div[class*="promoPage_promoBannerCard"]');
	private readonly promoBannerCardHeaderMobile = () => this.page.locator('div[class*="promoPage_mobileBannerHeaderContent"]');
	private readonly cardTitle = () => this.page.locator('div[class*="promoPage_promoTitle"]');
	private readonly cardSubtitle = () => this.page.locator('div[class*="promoPage_promoSubtitle"]');
	private readonly cardTitleMobile = () => this.page.locator('div[class*="promoPage_mobileHeaderTitle"]');
	private readonly cardSubtitleMobile = () => this.page.locator('div[class*="promoPage_mobileHeaderSubtitle"]');
	private readonly cardButton = () => this.page.locator('div[class*="promoPage_promoCTAs"]');
	private readonly contentPageContainer = () => this.page.locator('div[class*="promoPage_promoPageContent"]');
	private readonly contentPageButton = () => this.page.locator('a[class*="promoPage_claimBonusBtn"]');
	private readonly termsAndConditions = () => this.page.locator('div[id*="undefined-open-header"][class*="infoPage_infoPageHeader"]');
	private readonly termsAndConditionsText = () => this.page.locator('div[class*="infoPage_infoPageTitle"]');
	private readonly termsAndConditionsExpanded = () => this.page.locator('#undefined-content-container > div[class*="infoPage_infoPageContent"]');
	private readonly promotionCardsContainer = () => this.page.locator('#promotions-container');
	private readonly faqContainer = () => this.page.locator('#faq-container');
	private readonly showAllPromotions = () => this.page.locator('#promotions-view-all-btn');

	private readonly walletModal = () => this.page.locator('#wallet-modal');
	private readonly registerModal = () => this.page.locator('#register-modal');

	//Action

	//TODO: add navigation methods 
	public async clickTermsAndConditionsText() {
		await test.step(`I click the terms and conditions header`, async () => {
			await this.validateTermsAndConditions();
			await this.termsAndConditionsText().click();
		});
	}

	public async clickCardGreenButton() {
		await test.step(`I click the green button in the card`, async () => {
			await this.validateCardButtonVisible();
			await this.cardButton().click();
		});
	}

	public async clickContentGreenButton() {
		await test.step(`I click the green button in the page content`, async () => {
			await this.validateContentPageButton();
			await this.contentPageButton().click();
		});
	}

	public async validateTermsAndConditionsDropdown(): Promise<void> {
		await test.step(`I expand the terms and conditions header`, async () => {
			await expect(this.termsAndConditionsExpanded(), 'Expect terms and conditions to be hidden').toBeHidden();
			await this.clickTermsAndConditionsText();
			await expect(this.termsAndConditionsExpanded(), 'Expect terms and conditions to be visible').toBeVisible();
		});
		await test.step(`I close terms and conditions`, async () => {
			await this.clickTermsAndConditionsText();
			await expect(this.termsAndConditionsExpanded(), 'Expect terms and conditions to be hidden').toBeHidden();
		});
	}

	public async validatePageElements() {
		await test.step('Validate promotion page elemetns', async () => {
			await this.validatePromoBannerCard();
			await this.validatePageContentContainer();
			await this.validateContentPageButton();
			await this.validateTermsAndConditions();
			await this.validatePromoCardsContainer();
			await this.validateFAQContainer();
		});
	}

	public async validatePageElementsMobile() {
		await test.step('Validate promotion page elemetns', async () => {
			await this.validatePromoBannerCardMobile();
			await this.validatePageContentContainer();
			await this.validateContentPageButton();
			await this.validateTermsAndConditions();
			await this.validatePromoCardsContainer();
			await this.validateFAQContainer();
		});
	}

	public async validateCardElementsContent(title: string, subtitle: string, buttonText: string) {
		await test.step('Validate promotion card elemetns', async () => {
			await this.validateCardTitleText(title);
			await this.validateCardSubtitleText(subtitle);
			await this.validateCardButton(buttonText);
		});
	}

	public async validateCardElementsMobileContent(title: string, subtitle: string) {
		await test.step('Validate promotion card elemetns', async () => {
			await this.validateCardTitleTextMobile(title);
			await this.validateCardSubtitleTextMobile(subtitle);
			await expect.soft(this.cardButton(),
				`Expect card Button to be hidden`).toBeHidden();
		});
	}

	public async validateCardElementsVisible() {
		await test.step('Validate promotion card elemetns', async () => {
			await this.validateCardTitleVisible();
			await this.validateCardSubtitleVisible();
			await this.validateCardButtonVisible();
		});
	}

	public async validateCardElementsMobileVisible() {
		await test.step('Validate promotion card elemetns', async () => {
			await this.validateCardTitleVisibleMobile();
			await this.validateCardSubtitleVisibleMobile();
			await expect.soft(this.cardButton(),
				'Expect card Button to be hidden').toBeHidden();
		});
	}

	public async validatePageContentContainer() {
		await expect.soft(this.contentPageContainer(),
			'Expect page content container is visible').toBeVisible();
	}

	public async validateContentPageButton() {
		await expect.soft(this.contentPageButton(),
			'Expect content page button is visible').toBeVisible();
	}

	public async validateTermsAndConditions() {
		await expect.soft(this.termsAndConditions(),
			'Expect terms and conditions is visible').toBeVisible();
	}

	public async validateTermsAndConditionsText() {
		await expect.soft(this.termsAndConditionsText(),
			'Expect Terms and Conditions Text to be visible').toBeVisible();
	}

	public async validatePromoCardsContainer() {
		await expect.soft(this.promotionCardsContainer(),
			'Expect promotion cards container is visible').toBeVisible();
	}

	public async validateFAQContainer() {
		await expect.soft(this.faqContainer(),
			'Expect FAQ section container is visible ').toBeVisible();
	}

	public async validatePromoBannerCard() {
		await expect.soft(this.promoBannerCard(),
			'Expect promotion banner card is visible').toBeVisible();
	}

	public async validatePromoBannerCardMobile() {
		await expect.soft(this.promoBannerCardHeaderMobile(),
			'Expect promotion banner card is visible').toBeVisible();
	}

	public async validateCardTitleText(textToContain: string) {
		await expect.soft(this.cardTitle(),
			`Expect card title to be:${textToContain}`).toContainText(textToContain);
	}

	public async validateCardSubtitleText(textToContain: string) {
		await expect.soft(this.cardSubtitle(),
			`Expect subtitle text to be: ${textToContain}`).toContainText(textToContain);
	}

	public async validateCardTitleVisible() {
		await expect.soft(this.cardTitle(),
			`Expect card title to be visible`).toBeVisible();
	}

	public async validateCardSubtitleVisible() {
		await expect.soft(this.cardSubtitle(),
			`Expect subtitle text to be visible`).toBeVisible();
	}

	public async validateCardTitleTextMobile(textToContain: string) {
		await expect.soft(this.cardTitleMobile(),
			`Expect card title to be:${textToContain}`).toContainText(textToContain);
	}

	public async validateCardSubtitleTextMobile(textToContain: string) {
		await expect.soft(this.cardSubtitleMobile(),
			`Expect subtitle text to be: ${textToContain}`).toContainText(textToContain);
	}

	public async validateCardTitleVisibleMobile() {
		await expect.soft(this.cardTitleMobile(),
			`Expect card title to be visible`).toBeVisible();
	}

	public async validateCardSubtitleVisibleMobile() {
		await expect.soft(this.cardSubtitleMobile(),
			`Expect subtitle text to be visible`).toBeVisible();
	}

	public async validateCardButtonVisible() {
		await expect.soft(this.cardButton(),
			`Expect card Button to be visible`).toBeVisible();
	}

	public async validateCardButton(textToContain: string) {
		await this.validateCardButtonVisible();
		await expect.soft(this.cardButton(),
			`Expect button text to be: ${textToContain}`).toContainText(textToContain);
	}

	public async validateShowAllVisible() {
		await expect.soft(this.showAllPromotions(),
			'Expect "Show All" button to be visible').toBeVisible();
	}

	public async clickShowAllButton() {
		await test.step('I click the "Show All" button', async () => {
			await this.validateShowAllVisible();
			await this.showAllPromotions().click();
			await this.page.waitForURL('**/en/promotions', { waitUntil: "domcontentloaded" });
		});
	}

	public async validateURL(cardTitle: string, expectedURL: string) {
		expect(this.page.url(), `Validate the URL for ${cardTitle} details page`).
			toEqual(`${process.env.URL}` + '/promotions/' + expectedURL);
	}

	public async validatePageTitle(cardTitle: string, expectedPageTitle: string) {
		expect(this.page.title(), `Validate the title for ${cardTitle} details page`).
			toEqual(expectedPageTitle);
	}

	public async validateWalletModalVisible() {
		await expect.soft(this.walletModal(),
			`Expect wallet modal to be visible`).toBeVisible();
	}

	public async validateRegisterModalVisible() {
		await expect.soft(this.registerModal(),
			`Expect register modal to be visible`).toBeVisible();
	}

	// public async validateSHowAllNavigation() {
	// 	await expect(this.showAllPromotions()).toHaveAttribute
	// } 
}