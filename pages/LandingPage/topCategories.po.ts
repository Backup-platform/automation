import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

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
        await this.navigation.assertVisible(this.title(), softAssert,' Top Categories Title');
    }

    public async validateShowAllButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.showAll(), softAssert,'Show All button');
        await this.navigation.assertAttribute(this.showAll(), 'href'); //TODO: , "/games" );
    }

    public async validateCardContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardContainer(), softAssert, 'Card container');
    }

    public async validateCardVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cards().nth(nthElement), softAssert, `card ${nthElement}`);
    }

    public async validateCardIconVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardIcon().nth(nthElement), softAssert, `Icon of card ${nthElement}`);
        await this.navigation.assertAttribute(this.cardIcon().nth(nthElement), 'srcset');
        await this.navigation.assertAttribute(this.cardIcon().nth(nthElement), 'src');
    }

    public async validateCardTitleVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardTitle().nth(nthElement), softAssert, `Title of card ${nthElement}`);
    }

    public async validateCardSubtitleVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardSubtitle().nth(nthElement), softAssert, `Subtitle of card ${nthElement}`);
    }

    public async clickShowAll(softAssert = false): Promise<void> {
            await this.navigation.clickElement(this.showAll(), softAssert, 'Show All menu button');
            await this.page.waitForURL('**/games/all', { waitUntil: "domcontentloaded" });
            await this.navigation.assertUrl(`${process.env.URL}games/all`);
    }

    public async clickTopCard(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.cards().nth(nthElement), softAssert, `Categories Card ${nthElement}`);
    }

    @step('I validate the top categories elements are visible')
    public async validateCardElements(softAssert = true): Promise<void> {
        const cardCount = await this.cards().count();
        await this.validateTitleVisible(softAssert);
        await this.validateShowAllButtonVisible(softAssert);
        await this.validateCardContainerVisible(softAssert);

        for (let i = 0; i < cardCount; i++) {
            await test.step(`I check card number ${i} elements are visible`, async () => {
                await this.validateCardVisible(i, softAssert);
                await this.validateCardTitleVisible(i, softAssert);
                await this.validateCardSubtitleVisible(i, softAssert);
                await this.validateCardIconVisible(i, softAssert);
            });
        }
    }

    @stepParam((newURL, nthElement) => `I click on the top card ${nthElement} and validate navigation to ${newURL}`)
    public async validateTopCardNavigation(newURL: string, nthElement: number, softAssert = true): Promise<void> {
        await this.clickTopCard(nthElement, softAssert);
        await this.page.waitForURL(`**/${newURL}`);
        await this.navigation.assertUrl(`${process.env.URL}${newURL}`);
        await this.page.goBack();
        await this.navigation.assertUrl(`${process.env.URL}`);
    }

}