import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

export class PromotionsLandingPage {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page)
    }

    readonly promotionsContainer = () => this.page.locator('#promotions-container');
    readonly sectionTitle = () => this.page.locator('span[class*="_homePagePromotionsTitle_"]');
    readonly showAllButton = () => this.page.locator('#promotions-view-all-btn');
    readonly cards = () => this.page.locator('div[class*="_promotionCard_"]');
    readonly background = (nthCard: number) => this.cards().nth(nthCard).locator('img[class*="_promotionCardBackgroundImg_"]');
    readonly foreground = (nthCard: number) => this.cards().nth(nthCard).locator('img[class*="_promotionCardForegroundImg_"]');
    readonly title = (nthCard: number) => this.cards().nth(nthCard).locator('div[class*="_promotionCardTitle_"]');
    readonly subtitle = (nthCard: number) => this.cards().nth(nthCard).locator('div[class*="_promotionCardSubtitle_"]');
    readonly CTA = (nthCard: number) => this.cards().nth(nthCard).locator('div[class*="_CTAs_"]');
    readonly primaryButton = (nthCard: number) => this.cards().nth(nthCard).locator('a[class*="_primaryButton_"]');
    readonly secondaryButton = (nthCard: number) => this.cards().nth(nthCard).locator('a[class*="_secondaryButton_"]');


    //Actions
    @stepParam(description => `I validate ${description} has the correct attributes`)
    private async validateAttributes(
        locator: Locator,
        description: string,
        attributes: string[],
        softAssert = false
    ): Promise<void> {
        await this.navigation.assertVisible(locator, softAssert, description);
        for (const attribute of attributes) {
            await this.navigation.assertAttribute(locator, attribute, softAssert);
        }
    }

    public async clickShowAll(newURL: string, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.showAllButton(), softAssert, 'Show All button');
        const URL = `${process.env.URL}${newURL}`
        await this.page.waitForURL(URL, { waitUntil: "domcontentloaded" });
        await this.navigation.assertUrl(URL);
    }

    public async validateShowAllButton(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.showAllButton(), softAssert, 'Show All button');
    }

    public async validateContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.promotionsContainer(), softAssert, 
            'Promotions container');
    }

    public async validateTitleVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.sectionTitle(), softAssert, 
            'Promotions title');
    }

    public async validateCardVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cards().nth(nthElement), softAssert,
            `Promotion card ${nthElement}`);
    }

    public async validateCardBackgroundVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validateAttributes(this.background(nthElement), 
            `Background image of promotion card ${nthElement}`, ['srcset', 'src']);
    }

    public async validateCardForegroundVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validateAttributes(this.foreground(nthElement), 
            `Foreground image of promotion card ${nthElement}`, ['srcset', 'src']);
    }

    public async validateCardTitleVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.title(nthElement), softAssert,
            `Title of promotion card ${nthElement}`);
    }

    public async validateCardSubtitleVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.subtitle(nthElement), softAssert,
            `Subtitle of promotion card ${nthElement}`);
    }

    public async validateCardCTAVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.CTA(nthElement), softAssert,
            `CTA of promotion card ${nthElement}`);
    }

    public async validateCardPrimaryButtonVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.primaryButton(nthElement), softAssert,
            `Primary button of promotion card ${nthElement}`);
    }

    public async validateCardSecondaryButtonVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validateAttributes(this.secondaryButton(nthElement),
         `Secondary button of promotion card ${nthElement}`, ['href']);
    }

    public async clickCardPrimaryButton(nthElement: number, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.primaryButton(nthElement), softAssert,
            `Primary button of promotion card number ${nthElement.toString()}`);
    }

    public async clickCardSecondaryButton(nthElement: number, URL: string, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.secondaryButton(nthElement), softAssert,
            `Secondary button of promotion card number ${nthElement}`);
        await this.page.waitForURL(`**${URL}/**`, { waitUntil: 'domcontentloaded' });
        await this.navigation.assertUrlContains([`${URL}`]);
    }

    @step('I validate the CTA buttons for members')
    public async validateCTAbuttonsForMembers(nthCard: number, softAssert = false): Promise<void> {
        await this.clickCardPrimaryButton(nthCard, softAssert);
        await this.navigation.assertVisible(this.page.locator('div[class*="walletModal_modalDialog_"]'), softAssert, 'Wallet modal');
        await this.navigation.clickElement(this.page.locator('div[class*="walletModal_closeBtn_"]'), softAssert, 'Close button');
        await this.clickCardSecondaryButton(nthCard, '/promotions', softAssert);
    }

    @step('I validate the CTA buttons for guests')
    public async validateCTAbuttonsForGuests(nthCard: number, softAssert = false): Promise<void> {
        await this.clickCardPrimaryButton(nthCard, softAssert);
        await this.navigation.assertVisible(this.page.locator('div[class*="registrationModal_modalDialog_"]'), softAssert, 'Registration modal');
        await this.navigation.clickElement(this.page.locator('#registration-modal-close-btn').or(
            this.page.locator('#register-modal-close-btn')), softAssert, 'Close button');
        await this.clickCardSecondaryButton(nthCard, '/promotions', softAssert);
    }

    @step('I validate the promotion card elements')
    public async validateCardElements(softAssert = false, cardsToCheck = 1): Promise<void> {

        await this.validateContainerVisible();
        await this.validateShowAllButton(softAssert);
        await this.validateTitleVisible(softAssert);

        for (let i = 0; i < cardsToCheck; i++) {
            await test.step(`I validate all elements of card number ${i}`, async () => {
                await this.validateCardVisible(i);
                await this.validateCardBackgroundVisible(i, softAssert);
                await this.validateCardForegroundVisible(i, softAssert);
                await this.validateCardTitleVisible(i, softAssert);
                await this.validateCardSubtitleVisible(i, softAssert);
                await this.validateCardCTAVisible(i, softAssert);
                await this.validateCardPrimaryButtonVisible(i, softAssert);
                await this.validateCardSecondaryButtonVisible(i, softAssert);
            });
        }
    }
}