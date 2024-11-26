import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation } from '../utils/navigation.po';

export class TopCategories {
	readonly page: Page;
	readonly navigation: Navigation;

	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page)
	}

    //Locators
    readonly title = () => this.page.locator('span[class*= "topCategoriesTitle"]');
    readonly showAll = () => this.page.locator('#top-categories-view-all-btn');
	readonly cardContainer = () => this.page.locator('div[class*= "_topCategoriesCardContainer_"]');
	readonly cards = () => this.page.locator('div[class*= "_topCategoriesCard_"]');
    readonly cardIcon = () => this.page.locator('div[class*= "_topCategoriesCard_"]>img');
    readonly cardTitle = () => this.page.locator('span[class*= "_cardTitle_"]');
    readonly cardSubtitle = () => this.page.locator('span[class*= "_cardSubTitle_"]');

    //Actions
    public async validateTitleVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.title(), softAssert, 
            'Expect the title to be visible');
    }
    
    public async validateShowAllButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.showAll(), softAssert, 
            'Expect the "Show All" button to be visible');
        await this.navigation.assertAttributes(this.showAll(),'href'); //TODO: , "/games" );
    }
    
    public async validateCardContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardContainer(), softAssert, 
            'Expect the card container to be visible');
    }
    
    public async validateCardVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cards().nth(nthElement), softAssert, 
            `Expect card number ${nthElement} to be visible`);
    }
    
    public async validateCardIconVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardIcon().nth(nthElement), softAssert, 
            `Expect icon of card number ${nthElement} to be visible`);
        await this.navigation.assertAttributes(this.cardIcon().nth(nthElement),'srcset');
        await this.navigation.assertAttributes(this.cardIcon().nth(nthElement),'src');
    }
  
    public async validateCardTitleVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardTitle().nth(nthElement), softAssert, 
            `Expect title of card number ${nthElement} to be visible`);
    }
    
    public async validateCardSubtitleVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardSubtitle().nth(nthElement), softAssert, 
            `Expect subtitle of card number ${nthElement} to be visible`);
    }

    public async clickShowAll(softAssert = false): Promise<void> {
		await test.step('I click on the Live menu button', async () => {
			await this.navigation.clickElement(this.showAll(), softAssert, 'Expect the showAll menu button to be visible');
			await this.page.waitForURL('**/games');
			await this.navigation.assertUrl(`${process.env.URL}games`);
		});
	}

    public async clickCard(nthElement: number, URL:string, softAssert = false): Promise<void> {
		await test.step('I click on the Live menu button', async () => {
			await this.navigation.clickElement(this.cards().nth(nthElement), softAssert, 'Categories Card');
			await this.page.waitForURL(`**/${URL}`);
			await this.navigation.assertUrl(`${process.env.URL}${URL}`);
		});
	}

    public async validateTopCategoriesElements(softAssert = true): Promise<void> {
        await test.step('I check if the top categories elements are visible', async () => {
            await this.validateTitleVisible(softAssert);
            await this.validateShowAllButtonVisible(softAssert);
            await this.validateCardContainerVisible(softAssert);
    
            for (let i = 0; i < await this.cards().count(); i++) {
                await this.validateCardVisible(i, softAssert);
                await this.validateCardTitleVisible(i, softAssert);
                await this.validateCardSubtitleVisible(i, softAssert);
                await this.validateCardIconVisible(i, softAssert);
            }
        });
    }

    public async clickTopCards(newURL:string,softAssert = true): Promise<void> {
        await test.step('I click on the top card and validate navigation', async () => {
            for (let i = 0; i < await this.cards().count(); i++) {
                await this.clickCard(i, newURL);
                await this.page.goBack();
                await this.navigation.assertUrl(`${process.env.URL}`);
            }
        });
    }

}