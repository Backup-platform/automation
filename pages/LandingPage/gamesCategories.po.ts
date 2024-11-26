import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation } from '../utils/navigation.po';

export class GamesCategories {
	readonly page: Page;
	readonly navigation: Navigation;

	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page);
	}

    //Locators
    readonly categoryTitles = () => this.page.locator('span[class *="gameCategoriesV3_gameCategoryTitle_"]');
    readonly showAllButtons = () => this.page.locator('#game-category-view-all-btn');
	readonly cardsContainers = () => this.page.locator('div[class *="gameCategoriesV3_gameCategory_"]');
	readonly cards = () => this.page.locator('div[class*="_gameCardBackground_"]');
    readonly cardImage = () => this.page.locator('div[class*="_imgContainer_"]>img');
    readonly cardTitle = () => this.page.locator('div[class*="_gameTitle_"]');
    readonly cardSubtitles = () => this.page.locator('div[class*="_gameSubtitle_"]');
    readonly gamePlayNow = () => this.page.locator('button[class*="_playNowButton_"]');
    readonly gameTryforFun = () => this.page.locator('button[class*="_tryForFun_"]');
    //TODO: make nthElement locator to cut some of the repettitions 

    //Actions
    public async validateCategoryTitlesVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.categoryTitles().nth(nthElement), softAssert, 
            `Expect category title number ${nthElement} to be visible`);
    }
    
    public async validateShowAllButtonsVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.showAllButtons().nth(nthElement), softAssert, 
            `Expect the "Show All" button number ${nthElement} to be visible`);
    }
    
    public async validateGameCardsContainerVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardsContainers().nth(nthElement), softAssert, 
            `Expect game card container number ${nthElement} to be visible`);
    }
    
    public async validateGameCardVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        const gameCard = this.cardsContainers().nth(nthCategory).locator(this.cards()).nth(nthCard);
        
        await this.navigation.assertVisible(gameCard, softAssert, 
            `Expect card number ${nthCard} in category ${nthCategory} to be visible`);
    }    
    
    public async validateGameTitleVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        const gameTitle = this.cardsContainers().nth(nthCategory).locator(this.cardTitle()).nth(nthCard);
        
        await this.navigation.assertVisible(gameTitle, softAssert, 
            `Expect title of card number ${nthCard} in category ${nthCategory} to be visible`);
    }
    
    public async validateGameSubtitleVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        const gameSubtitle = this.cardsContainers().nth(nthCategory).locator(this.cardSubtitles()).nth(nthCard)
        
        await this.navigation.assertVisible(gameSubtitle, softAssert, 
            `Expect subtitle of card number ${nthCard} in category ${nthCategory} to be visible`);
    }
    
    public async validateGameImageVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        const gameImage = this.cardsContainers().nth(nthCategory).locator(this.cardImage()).nth(nthCard);

        await this.navigation.assertVisible(gameImage, softAssert,
            `Expect image of card number ${nthCard} in category ${nthCategory} to be visible`);
        await this.navigation.assertAttributes(await gameImage, 'srcset');
        await this.navigation.assertAttributes(await gameImage, 'src');
    }

    public async validateGamePlayNowButtonVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        const playNowButton = this.cardsContainers().nth(nthCategory).locator(this.gamePlayNow()).nth(nthCard);
        
        await this.navigation.assertVisible(playNowButton, softAssert, 
            `Expect "Play Now" button of card number ${nthCard} in category ${nthCategory} to be visible`);
    }
    
    public async validateGameTryForFunButtonVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        const tryForFunButton = this.cardsContainers().nth(nthCategory).locator(this.gameTryforFun()).nth(nthCard);
        
        await this.navigation.assertVisible(tryForFunButton, softAssert, 
            `Expect "Try for Fun" button of card number ${nthCard} in category ${nthCategory} to be visible`);
    }
    

    public async validateGameCategoriesElements(softAssert = false, cardsToCheck = 1): Promise<void> {
        await test.step('I check if the game categories elements are visible', async () => {
    
            for (let i = 0; i < await this.cardsContainers().count(); i++) {
                await this.validateGameCardsContainerVisible(i);
                await this.validateCategoryTitlesVisible(i, softAssert);
                await this.validateShowAllButtonsVisible(i, softAssert);
                for (let j = 0; j < cardsToCheck; j++) {
                    await this.validateGameCardVisible(i,j, softAssert);
                    await this.validateGameImageVisible(i,j, softAssert);
                    await this.validateGameTitleVisible(i,j, softAssert);
                    await this.validateGameSubtitleVisible(i,j, softAssert);
                }
            }
        });
    }   
    
}