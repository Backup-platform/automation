import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation } from '../utils/navigation.po';

export class PromotionsLandingPage {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page)
    }

    readonly promotionsContainer = () => this.page.locator('#promotions-container');
    readonly title = () => this.page.locator('span[class*="_homePagePromotionsTitle_"]');
    readonly showAllButton = () => this.page.locator('#promotions-view-all-btn');
    readonly promotionCards = () => this.page.locator('div[class*="_promotionCardDesktop_"]');
    readonly cardbackground = () => this.page.locator('img[class*="_promotionCardBackgroundImg_"]');
    readonly cardforeground = () => this.page.locator('img[class*="_promotionCardForegroundImg_"]');
    readonly cardTitle = () => this.page.locator('div[class*="_promotionCardTitle_"]');
    readonly cardSubtitle = () => this.page.locator('div[class*="_promotionCardSubtitle_"]');
    readonly cardCTA = () => this.page.locator('div[class*="_CTAs_"]');
    readonly cardPrimaryButton = () => this.page.locator('a[class*="_primaryButton_"]');
    readonly cardSecondaryButton = () => this.page.locator('a[class*="_secondaryButton_"]');



    public async clickShowAllButton(softAssert = false): Promise<void> {
        await test.step('I click on the "Show All" button', async () => {
            await this.navigation.clickElement(this.showAllButton(), softAssert, 'Expect the "Show All" button to be visible');
        });
    }

    public async validateShowAllButton(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.showAllButton(), softAssert,
            'Expect the "Show All" to be visible');
    }

    public async validatePromotionsContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.promotionsContainer(), softAssert,
            'Expect the promotions container to be visible');
    }

    public async validateTitleVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.title(), softAssert,
            'Expect the promotions title to be visible');
    }

    public async validatePromotionCardVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.promotionCards().nth(nthElement), softAssert,
            `Expect promotion card number ${nthElement} to be visible`);
    }

    public async validateCardBackgroundVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardbackground().nth(nthElement), softAssert,
            `Expect background image of promotion card number ${nthElement} to be visible`);
        await this.navigation.assertAttributes(this.cardbackground().nth(nthElement), 'srcset');
        await this.navigation.assertAttributes(this.cardbackground().nth(nthElement), 'src');
    }

    public async validateCardForegroundVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardforeground().nth(nthElement), softAssert,
            `Expect foreground image of promotion card number ${nthElement} to be visible`);
        await this.navigation.assertAttributes(this.cardforeground().nth(nthElement), 'srcset');
        await this.navigation.assertAttributes(this.cardforeground().nth(nthElement), 'src');
    }

    public async validateCardTitleVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardTitle().nth(nthElement), softAssert,
            `Expect title of promotion card number ${nthElement} to be visible`);
    }

    public async validateCardSubtitleVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardSubtitle().nth(nthElement), softAssert,
            `Expect subtitle of promotion card number ${nthElement} to be visible`);
    }

    public async validateCardCTAVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardCTA().nth(nthElement), softAssert,
            `Expect CTA of promotion card number ${nthElement} to be visible`);
    }

    public async validateCardPrimaryButtonVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardPrimaryButton().nth(nthElement), softAssert,
            `Expect primary button of promotion card number ${nthElement} to be visible`);
    }

    public async validateCardSecondaryButtonVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardSecondaryButton().nth(nthElement), softAssert,
            `Secondary button of promotion number ${nthElement}`);
        await this.navigation.assertAttributes(this.cardSecondaryButton().nth(nthElement), 'href');
    }

    public async clickCardPrimaryButton(nthElement: number, softAssert = false): Promise<void> {
        await test.step(`I click on the primary button of promotion card number ${nthElement}`, async () => {
            await this.navigation.clickElement(this.cardPrimaryButton().nth(nthElement), softAssert,
                `Expect primary button of promotion card number ${nthElement} to be visible`);
        });
    }

    public async clickCardSecondaryButton(nthElement: number, URL: string, softAssert = false): Promise<void> {
        await test.step(`I click on the primary button of promotion card number ${nthElement}`, async () => {
            await this.navigation.clickElement(this.cardSecondaryButton().nth(nthElement), softAssert,
                `Expect Secondary button of promotion card number ${nthElement} to be visible`);
            await this.page.waitForURL(`**/${URL}`);
            await this.navigation.assertUrl(`${process.env.URL}${URL}`);
        });
    }

    public async validatePromoCardElements(softAssert = false, cardsToCheck = 1): Promise<void> {
        await test.step(`I validate all elements of the first ${cardsToCheck} card(s)`, async () => {
            await this.validatePromotionsContainerVisible();
            await this.validateShowAllButton(softAssert);
            await this.validateTitleVisible(softAssert);       

            for (let i = 0; i < cardsToCheck; i++) {
                await this.validatePromotionCardVisible(i);
                await this.validateCardBackgroundVisible(i, softAssert);
                await this.validateCardForegroundVisible(i, softAssert);
                await this.validateCardTitleVisible(i, softAssert);
                await this.validateCardSubtitleVisible(i, softAssert);
                await this.validateCardCTAVisible(i, softAssert);
                await this.validateCardPrimaryButtonVisible(i, softAssert);
                await this.validateCardSecondaryButtonVisible(i, softAssert);
            }   
        });
    }

}