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
    readonly card = (nthCard: number) => this.cards().nth(nthCard);
    readonly cardIcon = (nthCard: number) => this.card(nthCard).locator('div[class*= "_topCategoriesCard_"]>img');
    readonly cardTitle = (nthCard: number) => this.card(nthCard).locator('span[class*= "_cardTitle_"]');
    readonly cardSubtitle = (nthCard: number) => this.card(nthCard).locator('span[class*= "_cardSubTitle_"]');

    //Actions
    public async validateTitleVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.title(), softAssert, ' Top Categories Title');
    }

    public async validateShowAllButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertAttribute(this.showAll(), 'href'); //TODO: , "/games" );
    }

    public async validateCardContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardContainer(), softAssert, 'Card container');
    }

    public async validateCardVisible(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.card(nthCard), softAssert, `card ${nthCard}`);
    }

    public async validateCardIconVisible(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.validateAttributes(this.cardIcon(nthCard),
            `Icon of card ${nthCard}`, { srcset: null, src: null });
    }

    public async validateCardTitleVisible(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardTitle(nthCard), softAssert, `Title of card ${nthCard}`);
    }

    public async validateCardSubtitleVisible(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardSubtitle(nthCard), softAssert, `Subtitle of card ${nthCard}`);
    }

    @step('I click on the Show All button')
    public async clickShowAll(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.showAll(), 'Show All menu button');
        await this.page.waitForURL('**/games/all', { waitUntil: "domcontentloaded" });
        await this.navigation.assertUrl(`${process.env.URL}games/all`);
    }

    public async clickTopCard(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.card(nthCard), `Categories Card ${nthCard}`);
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