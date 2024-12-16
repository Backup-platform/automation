import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

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
    readonly cards = (nthCategory: number) => this.cardsContainers().nth(nthCategory).locator('div[class*="_gameCardBackground_"]');
    readonly cardImage = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('div[class*="_imgContainer_"] > img');
    readonly cardTitle = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('div[class*="_gameTitle_"]');
    readonly cardSubtitles = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('div[class*="_gameSubtitle_"]');
    readonly playNow = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('button[class*="_playNowButton_"]');
    readonly tryForFun = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('button[class*="_tryForFun_"]');

    //TODO: make nthElement locator to cut some of the repettitions 

    //Actions
    @stepParam(description => `I validate ${description} has the correct attributes`)
    private async validateAttributes(locator: Locator, description: string, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(locator, softAssert, description);
        await this.navigation.assertAttribute(locator, 'src');
        await this.navigation.assertAttribute(locator, 'srcset');
    }

    public async validateCategoryTitlesVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.categoryTitles().nth(nthElement), softAssert,
            `Category title ${nthElement}`);
    }

    public async validateShowAllButtonsVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.showAllButtons().nth(nthElement), softAssert,
            `Show All button ${nthElement}`);
    }

    public async validateGameCardsContainerVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardsContainers().nth(nthElement), softAssert,
            `Game card container ${nthElement}`);
    }

    public async validateGameCardVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cards(nthCategory).nth(nthCard), softAssert,
            `Card ${nthCard} in category ${nthCategory}`);
    }

    public async validateGameTitleVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardTitle(nthCategory, nthCard), softAssert,
            `Card ${nthCard} Title in category ${nthCategory}`);
    }

    public async validateGameSubtitleVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardSubtitles(nthCategory, nthCard), softAssert,
            `Card ${nthCard} Subtitle in category ${nthCategory}`);
    }

    public async validateGameImageVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.validateAttributes(this.cardImage(nthCategory, nthCard),
            `Card ${nthCard} Image in category ${nthCategory}`, softAssert);
    }

    public async validatePlayNowVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.playNow(nthCategory, nthCard), softAssert,
            `Card ${nthCard} Play Now button in category ${nthCategory}`);
    }

    public async validateTryForFunVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.tryForFun(nthCategory, nthCard), softAssert,
            `Card ${nthCard} Try for Fun button in category ${nthCategory}`);
    }

    public async validateTryForFunNotVisible(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertNotVisible(this.tryForFun(nthCategory, nthCard), softAssert,
            `Card ${nthCard} Try for Fun button in category ${nthCategory}`);
    }

    @step('I click on the Try For Fun button')
    public async clickTryForFunButton(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.tryForFun(nthCategory, nthCard), softAssert,
            `Card ${nthCard} Try for Fun button in category ${nthCategory}`);
    }

    @step('I click on the Play Now button')
    public async clickPlayNowButton(nthCategory: number, nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.playNow(nthCategory, nthCard), softAssert,
            `Card ${nthCard} Play Now button in category ${nthCategory}`);
    }

    @step('I click on Show All button and validate navigation')
    public async clickShowAll(nthElement: number, newURL: string, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.showAllButtons().nth(nthElement), softAssert,
            `Show All menu button in category ${nthElement}`);
        const URL = `${process.env.URL}${newURL}`
        await this.page.waitForURL(URL, { waitUntil: "domcontentloaded" });
        await this.navigation.assertUrl(URL);
    }

    @step('I validate the CTA buttons for members')
    public async validateCTAbuttonsForMembers(nthCategory: number, nthCard: number, isMobile: boolean, softAssert = false): Promise<void> {
        await this.validateTryForFunNotVisible(nthCategory, nthCard, softAssert);
        await this.clickPlayNowButton(nthCategory, nthCard, softAssert);
        //TODO: need a more specific validation
        await this.page.waitForURL('**/https://stage.spacefortuna7.com/play/**', { waitUntil: "domcontentloaded" });
        await this.navigation.assertUrlContains(['spacefortuna7.com/play'], softAssert);
    }

    @step('I validate the CTA buttons for guests')
    public async validateCTAbuttonsForGuests(nthCategory: number, nthCard: number, isMobile: boolean, softAssert = false): Promise<void> {
        await this.clickPlayNowButton(nthCategory, nthCard, softAssert);
        await this.navigation.assertVisible(this.page.locator('#login-modal'), softAssert, 'Login modal');
        await this.navigation.clickElement(this.page.locator('#login-modal-close-btn'), softAssert, 'Close button');
        await this.clickTryForFunButton(nthCategory, nthCard, softAssert);
        //TODO: need a more specific validation
        await this.page.waitForURL('**/https://stage.spacefortuna7.com/play/**', { waitUntil: "domcontentloaded" });
        await this.navigation.assertUrlContains(['spacefortuna7.com/play'], softAssert);
    }

    @step('I validate the Game card elements')
    public async validateGameCardElements(softAssert = false, cardsToCheck = 1): Promise<void> {

        for (let i = 0; i < await this.cardsContainers().count(); i++) {
            await test.step(`I validate Game section ${i} elements are visible`, async () => {
                await this.validateGameCardsContainerVisible(i);
                await this.validateCategoryTitlesVisible(i, softAssert);
                await this.validateShowAllButtonsVisible(i, softAssert);
            });

            for (let j = 0; j < cardsToCheck; j++) {
                await test.step(`I validate Card ${j} of Game section ${i} elements are visible`, async () => {
                    await this.validateGameCardVisible(i, j, softAssert);
                    await this.validateGameImageVisible(i, j, softAssert);
                    await this.validateGameTitleVisible(i, j, softAssert);
                    await this.validateGameSubtitleVisible(i, j, softAssert);
                    await this.validatePlayNowVisible(i, j, softAssert);
                });
            }
        }

    }

}