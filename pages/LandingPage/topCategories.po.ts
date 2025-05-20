import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { step, stepParam, assertAttribute, assertUrl, clickElement, assertVisible, validateAttributes } from '../utils/navigation.po';

export class TopCategories {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Locators
    readonly title = () => this.page.locator('span[class*= "topCategoriesTitle"]');
    readonly showAll = () => this.page.locator('#top-categories-view-all-btn');
    readonly cardContainer = () => this.page.locator('div[class*= "_topCategoriesCardContainer_"]');
    readonly cards = () => this.page.locator('div[class*= "_topCategoriesCard_"]');
    readonly card = (nthCard: number) => this.cards().nth(nthCard);
    readonly cardIcon = (nthCard: number) => this.card(nthCard).locator('>img');
    readonly cardTitle = (nthCard: number) => this.card(nthCard).locator('span[class*= "_cardTitle_"]');
    readonly cardSubtitle = (nthCard: number) => this.card(nthCard).locator('span[class*= "_cardSubTitle_"]');

    //Actions
    public validateTitleVisible = async (softAssert = false) =>
        await assertVisible(this.title(), 'Top Categories Title', softAssert);

    public validateShowAllButtonVisible = async (softAssert = false) =>
        await assertAttribute(this.showAll(), 'href', 'Show all Button', softAssert, "/en/games");

    public validateCardContainerVisible = async (softAssert = false) =>
        await assertVisible(this.cardContainer(), 'Card container', softAssert);

    public validateCardVisible = async (nthCard: number, softAssert = false) =>
        await assertVisible(this.card(nthCard), `card ${nthCard}`, softAssert);

    public validateCardIconVisible = async (nthCard: number, softAssert = false) =>
        await validateAttributes(this.cardIcon(nthCard),
            `Icon of card ${nthCard}`, { srcset: null, src: null });

    public validateCardTitleVisible = async (nthCard: number, softAssert = false) =>
        await assertVisible(this.cardTitle(nthCard), `Title of card ${nthCard}`, softAssert);

    public validateCardSubtitleVisible = async (nthCard: number, softAssert = false) =>
        await assertVisible(this.cardSubtitle(nthCard), `Subtitle of card ${nthCard}`, softAssert);

    public clickTopCard = async (nthCard: number, softAssert = false) =>
        await clickElement(this.card(nthCard), `Categories Card ${nthCard}`);

    @step('I click on the Show All button')
    public async clickShowAll(softAssert = false): Promise<void> {
        await clickElement(this.showAll(), 'Show All menu button');
        await assertUrl(this.page, `${process.env.URL}/games/all`);
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
        await assertUrl(this.page, `${process.env.URL}${newURL}`);
    }
}