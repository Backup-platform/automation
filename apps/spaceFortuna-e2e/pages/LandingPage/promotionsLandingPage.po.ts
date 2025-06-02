import { Locator, Page } from '@playwright/test';
import test from '../utils/base.po';
import { step, assertUrl, assertUrlContains, clickElement, assertVisible, validateAttributes, stepParam } from '@test-utils/navigation.po';

export class PromotionsLandingPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
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
    //readonly primaryButton = (nthCard: number) => this.page.locator(`div[class*="_promotionCard_"]:nth-of-type(${nthCard}) a[class*="_primaryButton_"]`);
    readonly secondaryButton = (nthCard: number) => this.cards().nth(nthCard).locator('a[class*="_secondaryButton_"]');
    readonly walletModalDialog = () => this.page.locator('div[class*="walletModal_modalDialog_"]');
    readonly walletModalCloseButton = () => this.page.locator('div[class*="walletModal_closeBtn_"]');
    readonly registrationModalDialog = () => this.page.locator('div[class*="registrationModal_modalDialog_"]');
    readonly registrationModalCloseButton = () => this.page.locator('#registrationModal_closeBtn').or(
        this.page.locator('#registerModal_closeBtn_'));

    //Actions
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
            `Background image of promotion card ${nthElement}`, { srcset: null, src: null }, softAssert);

    public validateCardForegroundVisible = async (nthElement: number, softAssert = false) => 
        await validateAttributes(this.foreground(nthElement), 
            `Foreground image of promotion card ${nthElement}`, { srcset: null, src: null }, softAssert);

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
         `Secondary button of promotion card ${nthElement}`, { href: null }, softAssert);

    public clickCardPrimaryButton = async (nthElement: number) => 
        await clickElement(this.primaryButton(nthElement), `Primary button of promotion card number ${nthElement.toString()}`);

    @stepParam((element: Locator, description: string, expectedUrl: string) =>
		`I click on the ${description} and validate it navigates to ${expectedUrl}`)
    private async clickAndValidateUrl(element: Locator, description: string, expectedUrl: string): Promise<void> {
        await clickElement(element, description);
        await assertUrl(this.page, `${process.env.URL}${expectedUrl}`);
    }

    @step(`I validate the CTA buttons and their navigation`)
    private async validateCTAButtons(nthCard: number, modalLocator: Locator, modalDescription: string, 
        closeButtonLocator: Locator, closeButtonDescription: string, secondaryButtonUrl: string, softAssert: boolean): Promise<void> {
        await this.clickCardPrimaryButton(nthCard);
        await this.page.waitForTimeout(2000);
        await assertVisible(modalLocator, modalDescription, softAssert);
        await clickElement(closeButtonLocator, closeButtonDescription);
        await this.clickCardSecondaryButton(nthCard, `${process.env.URL}${secondaryButtonUrl}`);
    }

    public clickShowAll = async (newURL: string) => await this.clickAndValidateUrl(this.showAllButton(), 'Show All button', newURL);

    public clickCardSecondaryButton = async (nthElement: number, URL: string) => {
        await clickElement(this.secondaryButton(nthElement), `Secondary button of promotion card number ${nthElement}`);
        await assertUrlContains(this.page, [URL]);
    }

    @step('I validate the CTA buttons for members')
    public async validateCTAbuttonsForMembers(nthCard: number, softAssert = false): Promise<void> {
        await this.validateCTAButtons(nthCard, this.walletModalDialog(),'Wallet modal', 
            this.walletModalCloseButton(),'Close button','/promotions', softAssert
        );
    }

    @step('I validate the CTA buttons for guests')
    public async validateCTAbuttonsForGuests(nthCard: number, softAssert = false): Promise<void> {
        await this.validateCTAButtons(nthCard, this.registrationModalDialog(), 'Registration modal',
            this.registrationModalCloseButton(), 'Close button', '/promotions', softAssert
        );
    }

    @step('I validate the promotion card elements')
    private async validateSingleCardElements(cardIndex: number, softAssert: boolean): Promise<void> {
        await this.validateCardVisible(cardIndex);
        await this.validateCardBackgroundVisible(cardIndex, softAssert);
        await this.validateCardForegroundVisible(cardIndex, softAssert);
        await this.validateCardTitleVisible(cardIndex, softAssert);
        await this.validateCardSubtitleVisible(cardIndex, softAssert);
        await this.validateCardCTAVisible(cardIndex, softAssert);
        await this.validateCardPrimaryButtonVisible(cardIndex, softAssert);
        await this.validateCardSecondaryButtonVisible(cardIndex, softAssert);
    }

    @step('I validate the promotion cards')
    public async validateCardElements(softAssert = false, cardsToCheck = 1): Promise<void> {
        await this.validateContainerVisible();
        await this.validateShowAllButton(softAssert);
        await this.validateTitleVisible(softAssert);

        for (let i = 1; i < cardsToCheck; i++) {
            await test.step(`I validate all elements of card number ${i}`, async () => {
                await this.validateSingleCardElements(i, softAssert);
            });
        }
    }
}