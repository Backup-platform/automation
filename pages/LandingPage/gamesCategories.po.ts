import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { step, assertUrl, assertUrlContains, clickElement, assertVisible, assertNotVisible, validateAttributes } from '../utils/navigation.po';

export class GamesCategories {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Locators
    readonly categoryTitles = () => this.page.locator('span[class *="gameCategoriesV3_gameCategoryTitle_"]');
    readonly title = (nthTitle: number) => this.categoryTitles().nth(nthTitle);

    readonly showAllButtons = () => this.page.locator('#game-category-view-all-btn');
    readonly showAll = (nthShowAll: number) => this.showAllButtons().nth(nthShowAll);

    readonly cardsContainers = () => this.page.locator('div[class *="gameCategoriesV3_gameCategory_"]');
    readonly cards = (nthCategory: number) => this.cardsContainers().nth(nthCategory).locator('div[class*="_gameCardBackground_"]');
    readonly cardImage = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('div[class*="_imgContainer_"] > img');
    readonly cardTitle = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('div[class*="_gameTitle_"]');
    readonly cardSubtitles = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('div[class*="_gameSubtitle_"]');
    readonly playNow = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('button[class*="_playNowButton_"]');
    readonly tryForFun = (nthCategory: number, nthCard: number) => this.cards(nthCategory).nth(nthCard).locator('button[class*="_tryForFun_"]');
    readonly loginModal = () => this.page.locator('#login-modal');
    readonly loginCloseButton = () => this.page.locator('#login-modal-close-btn');

    //Actions
    public validateCategoryTitlesVisible = async (nthElement: number, softAssert = false) =>
        await assertVisible(this.title(nthElement), `Category title ${nthElement}`, softAssert);

    public validateLoginModalVisible = async (softAssert = false) =>
        await assertVisible(this.loginModal(), 'Login modal', softAssert);

    public validateLoginCloseButtonVisible = async (softAssert = false) =>
        await assertVisible(this.loginCloseButton(), 'Login modal close button', softAssert);

    public validateShowAllButtonsVisible = async (nthElement: number, softAssert = false) =>
        await assertVisible(this.showAll(nthElement), `Show All button ${nthElement}`, softAssert);

    public validateGameCardsContainerVisible = async (nthElement: number, softAssert = false) =>
        await assertVisible(this.cardsContainers().nth(nthElement), `Game card container ${nthElement}`, softAssert);

    public validateGameCardVisible = async (nthCategory: number, nthCard: number, softAssert = false) =>
        await assertVisible(this.cards(nthCategory).nth(nthCard), `Card ${nthCard} in category ${nthCategory}`, softAssert);

    public validateGameTitleVisible = async (nthCategory: number, nthCard: number, softAssert = false) =>
        await assertVisible(this.cardTitle(nthCategory, nthCard), `Card ${nthCard} Title in category ${nthCategory}`, softAssert);

    public validateGameSubtitleVisible = async (nthCategory: number, nthCard: number, softAssert = false) =>
        await assertVisible(this.cardSubtitles(nthCategory, nthCard), `Card ${nthCard} Subtitle in category ${nthCategory}`, softAssert);

    public validateGameImageVisible = async (nthCategory: number, nthCard: number, softAssert = false) =>
        await validateAttributes(this.cardImage(nthCategory, nthCard), 
            `Card ${nthCard} Image in category ${nthCategory}`, {src: null, srcset: null}, softAssert);

    public validatePlayNowVisible = async (nthCategory: number, nthCard: number, softAssert = false) =>
        await assertVisible(this.playNow(nthCategory, nthCard), 
            `Card ${nthCard} Play Now button in category ${nthCategory}`, softAssert);

    public validateTryForFunVisible = async (nthCategory: number, nthCard: number, softAssert = false) =>
        await assertVisible(this.tryForFun(nthCategory, nthCard), 
            `Card ${nthCard} Try for Fun button in category ${nthCategory}`, softAssert);

    public validateTryForFunNotVisible = async (nthCategory: number, nthCard: number, softAssert = false) =>
        await assertNotVisible(this.tryForFun(nthCategory, nthCard),
            `Card ${nthCard} Try for Fun button in category ${nthCategory}`, softAssert);

    public clickTryForFunButton = async (nthCategory: number, nthCard: number) =>
        await clickElement(this.tryForFun(nthCategory, nthCard),
            `Card ${nthCard} Try for Fun button in category ${nthCategory}`);

    public clickPlayNowButton = async (nthCategory: number, nthCard: number) =>
        await clickElement(this.playNow(nthCategory, nthCard),
            `Card ${nthCard} Play Now button in category ${nthCategory}`);
    
    public clickLoginCloseButton = async () =>
        await clickElement(this.loginCloseButton(), 'Login modal close button');

    @step('I click on Show All button and validate navigation')
    public async clickShowAll(nthElement: number, newURL: string): Promise<void> {
        await clickElement(this.showAllButtons().nth(nthElement),
            `Show All menu button in category ${nthElement}`);
        await assertUrl(this.page, `${process.env.URL}${newURL}`);
    }

    @step('I validate the CTA buttons for members')
    public async validateCTAbuttonsForMembers(nthCategory: number, nthCard: number, isMobile: boolean, softAssert = false): Promise<void> {
        await this.validateTryForFunNotVisible(nthCategory, nthCard, softAssert);
        await this.clickPlayNowButton(nthCategory, nthCard);
        await assertUrlContains(this.page, ['spacefortuna1.com/en/play'], softAssert);
    }

    @step('I validate the CTA buttons for guests')
    public async validateCTAbuttonsForGuests(nthCategory: number, nthCard: number, isMobile: boolean, softAssert = false): Promise<void> {
        await this.clickPlayNowButton(nthCategory, nthCard);
        await this.validateLoginModalVisible(softAssert);
        await this.clickLoginCloseButton();
        await this.clickTryForFunButton(nthCategory, nthCard);
        await assertUrlContains(this.page, ['spacefortuna1.com/en/play'], softAssert);
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