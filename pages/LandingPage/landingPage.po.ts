import { Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { FooterLandingPage } from './footerLandingPage.po';
import { GamesCategories } from './gamesCategories.po';
import { LandingPageCarousel } from './landingPageCarousel.po';
import { LandingPageFAQ } from './landingPageFAQ.po';
import { PromotionsLandingPage } from './promotionsLandingPage.po';
import { TopCategories } from './topCategories.po';


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
	readonly cookiesBanner = () => this.page.getByRole('heading', { name: 'We use cookies to improve your experience.' });

	readonly topWinnersContainer = () => this.page.locator('#top-winners-container');
	//TODO: check top winners elements 

	//Actions
	public async clickAcceptCookiesButton(): Promise<void> {
		await this.acceptCookiesButton().click();
	}

	public async acceptCookiesBannerRandom(): Promise<void> {
		await test.step('Click Accept if cookies banner is visible', async () => {
			await this.page.addLocatorHandler(
				this.cookiesBanner(), async () => {
					await this.acceptCookiesButton().click();
				});
		});
	}

	public async validateFooterLinksSectionElements(softAssert = false, linksToCheck = 1): Promise<void> {
        await test.step(`I validate all elements in footer section`, async () => {
            await this.footer.validateFooterPaymentMethodsContainerVisible();
            await this.footer.validateFooterProvidersContainerVisible();
            await this.footer.validateFooterLanguageSwitcherVisible();
            await this.footer.validateLicensesVisible();
            for (let c = 0; c < await this.footer.certificates().count(); c++) {
                await this.footer.validateCertificatesVisible(c);
            }

            for (let i = 0; i < await this.footer.footerLinksSections().count()-1; i++) {
                await this.footer.validateFooterLinksSectionVisible(i, softAssert);
                for (let j = 0; j < linksToCheck; j++) {
                    await this.footer.validateFooterLinkVisible(i, j);
                }
            }
        });
    }

	public async validateGameCategoriesElements(softAssert = false, cardsToCheck = 1): Promise<void> {
        await test.step('I check if the game categories elements are visible', async () => {
            //TODO: Check gameCategories = to topCategoriesawait expect()
    
            for (let i = 0; i < await this.games.cardsContainers().count(); i++) {
                await this.games.validateGameCardsContainerVisible(i);
                await this.games.validateCategoryTitlesVisible(i, softAssert);
                await this.games.validateShowAllButtonsVisible(i, softAssert);
                for (let j = 0; j < cardsToCheck; j++) {
                    await this.games.validateGameCardVisible(i,j, softAssert);
                    await this.games.validateGameImageVisible(i,j, softAssert);
                    await this.games.validateGameTitleVisible(i,j, softAssert);
                    await this.games.validateGameSubtitleVisible(i,j, softAssert);
                }
            }
        });
    }

	public async validateCarouselElementsAreVisibleForGuest(): Promise<void> {
		await test.step('I check if the Carousel elements are visible for a guest', async () => {
			await this.carousel.validateContainerVisible();
			//TODO: temp uncomment later await this.carousel.validateDotsContainerVisible(true);
			await this.carousel.validateVisibleSectionVisible(true);
			await this.carousel.validateArrowLeftButtonVisible(true);
			await this.carousel.validateArrowRightButtonVisible(true);
			await this.carousel.validateEnterButtonVisible(true);
		});
	}

	public async validateCarouselElementsAreVisibleForMember(): Promise<void> {
		await test.step('I check if the Carousel elements are visible for a member', async () => {
			await this.carousel.validateContainerVisible();
			//TODO: temp uncomment later await this.carousel.validateDotsContainerVisible(true);
			await this.carousel.validateVisibleSectionVisible(true);
			await this.carousel.validateArrowLeftButtonVisible(true);
			await this.carousel.validateArrowRightButtonVisible(true);
			await this.carousel.validateReceiveBonusButtonVisible(true);
		});
	}

	async validateDotsInitialState(): Promise<void> {
		//TODO: write expect messages 
		expect(await this.carousel.dots().count(), 'Expect there are more than 0 dots').toBeGreaterThan(0);
		expect(await this.carousel.promotionEntries().count(), 'Expect there are more than 0 promotions').toBeGreaterThan(0);
		expect(await this.carousel.dots().count(),'Expect the number of dots equals the number of promotions').toEqual(await this.carousel.promotionEntries().count());
		await this.carousel.validatePromotionsEntriesVisible(await this.carousel.getActiveDotIndex());
	};


	async validateCarousel(): Promise<void> {
		//await this.validateDotsInitialState();
		const entriesCount = await this.carousel.promotionEntries().count();
		await this.carousel.dots().nth(0).click();
		for (let i = 0; i < entriesCount; i++) {
			await this.carousel.clickDot(i);
			expect (await this.carousel.getActiveDotIndex()).toEqual(i);
			await this.carousel.validatePromotionsEntriesVisible(i);
			await this.carousel.validatePromotionsTitlesVisible(i);
			// await this.validatePromotionsSubtitlesVisible(index);
			await this.carousel.validatePromotionsTextVisible(i);
	
			// Navigate forward with the right arrow and validate synchronization
			if (i < entriesCount - 1) {
				await console.log(await this.carousel.getActiveDotIndex());
				await this.carousel.clickArrowRightButton();
				await this.carousel.validateDotIsActive(i+1);
				//expect (await this.getActiveDotIndex()).toEqual(i+1);
				await this.carousel.validatePromotionsEntriesVisible(i+1);

				// await this.validatePromotionsTitlesVisible(i+1);
				// // Uncomment these lines if subtitles are required
				// // await this.validatePromotionsSubtitlesVisible(validIndex);
				// await this.validatePromotionsTextVisible(i+1);
			}
		}
	
		// Navigate backward to validate left arrow functionality
		for (let i = entriesCount - 1; i > 0; i--) {
			await console.log(await this.carousel.getActiveDotIndex());
			await this.carousel.clickArrowLeftButton();
			await this.carousel.validateDotIsActive(i-1);
			await this.carousel.validatePromotionsEntriesVisible(i-1)

			// await this.validatePromotionsTitlesVisible(i-1);
			// // Uncomment these lines if subtitles are required
			// // await this.validatePromotionsSubtitlesVisible(validIndex);
			// await this.validatePromotionsTextVisible(i-1);
		}
	}

	public async validateFaqElements(softAssert = false): Promise<void> {
        await test.step('I check if the FAQ elements are visible', async () => {
            await this.FAQ.validateFaqTitleVisible(softAssert);
            await this.FAQ.validateFaqContainerVisible(softAssert);

            const totalDropdowns = await this.FAQ.faqDropdowns().count();
            for (let i = 0; i < totalDropdowns; i++) {
                await this.FAQ.validateFaqDropdownVisible(i, softAssert);
                //TODO: it is shown await expect(await this.faqReadMoreSections().nth(i), 'Initial more info window is not visible').not.toBeVisible()
                await this.FAQ.clickFaqDropdown(i, softAssert);
                await this.FAQ.validateFaqReadMoreSectionVisible(i, softAssert);
            }
            await expect(await totalDropdowns, 'There is the same ammount of dropdowns as read more sections'
            ).toEqual(await this.FAQ.faqReadMoreSections().count());
        });
    }

	public async validatePromoCardElements(softAssert = false, cardsToCheck = 1): Promise<void> {
        await test.step(`I validate all elements of the first ${cardsToCheck} card(s)`, async () => {
            await this.promotions.validatePromotionsContainerVisible();
            await this.promotions.validateShowAllButton(softAssert);
            await this.promotions.validateTitleVisible(softAssert);       

            for (let i = 0; i < cardsToCheck; i++) {
                await this.promotions.validatePromotionCardVisible(i);
                await this.promotions.validateCardBackgroundVisible(i, softAssert);
                await this.promotions.validateCardForegroundVisible(i, softAssert);
                await this.promotions.validateCardTitleVisible(i, softAssert);
                await this.promotions.validateCardSubtitleVisible(i, softAssert);
                await this.promotions.validateCardCTAVisible(i, softAssert);
                await this.promotions.validateCardPrimaryButtonVisible(i, softAssert);
                await this.promotions.validateCardSecondaryButtonVisible(i, softAssert);
            }
            
        });
    }

	public async validateTopCategoriesElements(softAssert = true): Promise<void> {
        await test.step('I check if the top categories elements are visible', async () => {
            await this.topCategories.validateTitleVisible(softAssert);
            await this.topCategories.validateShowAllButtonVisible(softAssert);
            await this.topCategories.validateCardContainerVisible(softAssert);
    

            const numberOfCardsToValidate = await this.topCategories.cards().count(); 
            for (let i = 0; i < numberOfCardsToValidate; i++) {
                await this.topCategories.validateCardVisible(i, softAssert);
                await this.topCategories.validateCardTitleVisible(i, softAssert);
                await this.topCategories.validateCardSubtitleVisible(i, softAssert);
                await this.topCategories.validateCardIconVisible(i, softAssert);
            }
        });
    }

}
