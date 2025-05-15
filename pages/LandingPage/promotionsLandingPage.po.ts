import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, assertUrl, assertUrlContains, clickElement, assertVisible, validateAttributes } from '../utils/navigation.po';

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
    readonly card = (nthCard: number) => this.cards().nth(nthCard);
    readonly background = (nthCard: number) => this.cards().nth(nthCard).locator('img[class*="_promotionCardBackgroundImg_"]');
    readonly foreground = (nthCard: number) => this.cards().nth(nthCard).locator('img[class*="_promotionCardForegroundImg_"]');
    readonly title = (nthCard: number) => this.cards().nth(nthCard).locator('div[class*="_promotionCardTitle_"]');
    readonly subtitle = (nthCard: number) => this.cards().nth(nthCard).locator('div[class*="_promotionCardSubtitle_"]');
    readonly CTA = (nthCard: number) => this.cards().nth(nthCard).locator('div[class*="_CTAs_"]');
    readonly primaryButton = (nthCard: number) => this.cards().nth(nthCard).locator('a[class*="_primaryButton_"]');
    readonly secondaryButton = (nthCard: number) => this.cards().nth(nthCard).locator('a[class*="_secondaryButton_"]');


    //Actions

    @step('I click on the Show All button')
    public async clickShowAll(newURL: string): Promise<void> {
        await clickElement(this.showAllButton(), 'Show All button');
        const URL = `${process.env.URL}${newURL}`
        await this.page.waitForURL(URL, { waitUntil: "domcontentloaded" });
        await assertUrl(this.page, URL);
    }

    public validateShowAllButton = async (softAssert = false) => 
        await assertVisible(this.showAllButton(), 'Show All button', softAssert);

    public validateContainerVisible = async (softAssert = false) =>
        await assertVisible(this.promotionsContainer(), 'Promotions container', softAssert);

    public validateTitleVisible = async (softAssert = false) =>
        await assertVisible(this.sectionTitle(), 'Promotions title', softAssert);

    public validateCardVisible = async (nthElement: number, softAssert = false) =>
        await assertVisible(this.card(nthElement), `Promotion card ${nthElement}`, softAssert);

    public validateCardBackgroundVisible = async (nthElement: number, softAssert = false) => 
        await validateAttributes(this.background(nthElement), 
        `Background image of promotion card ${nthElement}`, { srcset: null, src: null });

    public validateCardForegroundVisible = async (nthElement: number, softAssert = false) => 
        await validateAttributes(this.foreground(nthElement), 
            `Foreground image of promotion card ${nthElement}`, { srcset: null, src: null });

    public validateCardTitleVisible = async (nthElement: number, softAssert = false) =>
        await assertVisible(this.title(nthElement), `Title of promotion card ${nthElement}`, softAssert);

    public validateCardSubtitleVisible = async (nthElement: number, softAssert = false) =>
        await assertVisible(this.subtitle(nthElement), `Subtitle of promotion card ${nthElement}`, softAssert);

    public validateCardCTAVisible = async (nthElement: number, softAssert = false) =>
        await assertVisible(this.CTA(nthElement), `CTA of promotion card ${nthElement}`, softAssert);

    public validateCardPrimaryButtonVisible = async (nthElement: number, softAssert = false) =>
        await assertVisible(this.primaryButton(nthElement), `Primary button of promotion card ${nthElement}`, softAssert);

    public validateCardSecondaryButtonVisible = async (nthElement: number, softAssert = false) =>
        await validateAttributes(this.secondaryButton(nthElement),
         `Secondary button of promotion card ${nthElement}`, { href: null });

    public clickCardPrimaryButton = async (nthElement: number) => 
        await clickElement(this.primaryButton(nthElement),
            `Primary button of promotion card number ${nthElement.toString()}`);

    @step('Click on the card secondary button')
    public async clickCardSecondaryButton(nthElement: number, URL: string): Promise<void> {
        await clickElement(this.secondaryButton(nthElement),
            `Secondary button of promotion card number ${nthElement}`);
        await this.page.waitForURL(`**${URL}**`, { waitUntil: 'domcontentloaded' });
        await assertUrlContains(this.page, [`${URL}`]);
    }

    //TODO: need to move locators 
    @step('I validate the CTA buttons for members')
    public async validateCTAbuttonsForMembers(nthCard: number, softAssert = false): Promise<void> {
        await this.clickCardPrimaryButton(nthCard);
        await assertVisible(this.page.locator('div[class*="walletModal_modalDialog_"]'), 'Wallet modal', softAssert);
        await clickElement(this.page.locator('div[class*="walletModal_closeBtn_"]'), 'Close button');
        await this.clickCardSecondaryButton(nthCard, '/promotions/');
    }

    //TODO: need to move locators
    @step('I validate the CTA buttons for guests')
    public async validateCTAbuttonsForGuests(nthCard: number, softAssert = false): Promise<void> {
        await this.clickCardPrimaryButton(nthCard);
        await assertVisible(this.page.locator('div[class*="registrationModal_modalDialog_"]'), 'Registration modal', softAssert);
        await clickElement(this.page.locator('#registration-modal-close-btn').or(
            this.page.locator('#register-modal-close-btn')), 'Close button');
        await this.clickCardSecondaryButton(nthCard, '/promotions');
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