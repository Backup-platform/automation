import { Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { FooterLandingPage } from './footerLandingPage.po';
import { GamesCategories } from './gamesCategories.po';
import { LandingPageCarousel } from './landingPageCarousel.po';
import { LandingPageFAQ } from './landingPageFAQ.po';
import { PromotionsLandingPage } from './promotionsLandingPage.po';
import { TopCategories } from './topCategories.po';
import { step, stepParam } from '../utils/navigation.po';


export class LandingPage {

	readonly page: Page;
	readonly footer: FooterLandingPage
	readonly games: GamesCategories;
	readonly carousel: LandingPageCarousel;
	readonly FAQ: LandingPageFAQ;
	readonly promotions: PromotionsLandingPage;
	readonly topCategories: TopCategories;

	constructor(page: Page) {
		this.page = page;
		this.footer = new FooterLandingPage(page);
		this.games = new GamesCategories(page);
		this.carousel = new LandingPageCarousel(page);
		this.FAQ = new LandingPageFAQ(page);
		this.promotions = new PromotionsLandingPage(page);
		this.topCategories = new TopCategories(page);
	}

	//Locators
	readonly acceptCookiesButton = () => this.page.getByRole('button', { name: 'Accept' });
	readonly topWinnersContainer = () => this.page.locator('#top-winners-container');
	//TODO: check top winners elements 

	//Actions
	public async validateFooterLinksSectionElements(softAssert = false, linksToCheck = 1): Promise<void> {
		await this.footer.validateSectionElements(softAssert, linksToCheck);
	}

	public async validateGameCategoriesElements(softAssert = false, cardsToCheck = 1): Promise<void> {
		await this.games.validateGameCardElements(softAssert, cardsToCheck);
	}

	public async validateCarouselElementsAreVisibleForGuest(): Promise<void> {
		await this.carousel.validateElementsVisibleGuest();
	}

	public async validateCarouselElementsAreVisibleForMember(): Promise<void> {
		await this.carousel.validateElementsVisibleMember();
	}

	public async validateFaqElements(softAssert = false): Promise<void> {
		await this.FAQ.validateFaqElements(softAssert);
	}

	public async validatePromoCardElements(softAssert = false, cardsToCheck = 1): Promise<void> {
		await this.promotions.validateCardElements(softAssert, cardsToCheck);
	}

	public async validateTopCategoriesElements(softAssert = true): Promise<void> {
		await this.topCategories.validateCardElements(softAssert);
	}

}
