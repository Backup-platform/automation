import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible, assertNotVisible, assertElementContainsText } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';

/**
 * Layer 1: BonusCard POM - Element Level
 * Handles individual bonus card elements and basic interactions
 */
export class BonusCard {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Base selectors
    private readonly bonusCardSelector = '#profile-myBonuses div.rounded-2xl.bg-tertiary-secondary.p-4';
    private elementName = (cardNumber: number, element: string) => `Card ${cardNumber + 1}: ${element}`;

    // Collection locators
    public readonly bonusCards = compositeLocator(() => 
        this.page.locator(this.bonusCardSelector), 'Bonus cards');

    public readonly bonusCard = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index), 
        `${this.elementName(index, 'card')}`);

    // Status indicators
    public readonly statusElement = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'status')}`);

    public readonly wageringStatus = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'wagering status')}`);

    public readonly pendingStatus = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'pending status')}`);

    public readonly availableStatus = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'available status')}`);

    // Button elements
    public readonly primaryButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-primary').first(), 
        `${this.elementName(index, 'primary button')}`);

    public readonly enabledCancelButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-secondary-secondary:not([disabled])').first(), 
        `${this.elementName(index, 'enabled cancel button')}`);

    public readonly disabledCancelButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-secondary-secondary[disabled]').first(), 
        `${this.elementName(index, 'disabled cancel button')}`);

    public readonly actionButton = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('button').first(), 
        `${this.elementName(index, 'action button')}`);

    // Card content elements
    public readonly cardTitle = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('h5'),
        `${this.elementName(index, 'title')}`);

    public readonly cardSubtitle = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('p.font-rubik.text-xs'),
        `${this.elementName(index, 'subtitle')}`);

    public readonly cardImage = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('img[alt="Bonus image"]'), 
        `${this.elementName(index, 'image')}`);

    public readonly bonusType = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.border-2.border-primary-secondary'), 
        `${this.elementName(index, 'bonus type')}`);

    // Progress elements (wagering cards only)
    public readonly progressBar = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('svg[width="247"]'), 
        `${this.elementName(index, 'progress bar')}`);

    public readonly progressText = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('div.flex.items-center.gap-1.font-rubik.text-xs.font-normal:has-text("Wagered:")'), 
        `${this.elementName(index, 'progress text')}`);

    // Warning elements (pending cards only)
    public readonly warningMessage = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('p.flex.gap-2.font-rubik:has(svg path[fill="#DC373B"])').first(), 
        `${this.elementName(index, 'warning message')}`);

    public readonly warningIcon = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('svg path[fill="#DC373B"]').first(), 
        `${this.elementName(index, 'warning icon')}`);

    public readonly moreInfoButton = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('p:has-text("More")'), 
        `${this.elementName(index, 'more info button')}`);

    // Cancel confirmation dialog elements
    public readonly cancelDialog = compositeLocator(() =>
        this.page.locator('div[role="dialog"][data-state="open"].bg-dark.text-white.border-white').first(), 
        'Cancel confirmation dialog');

    public readonly cancelDialogTitle = compositeLocator(() =>
        this.page.locator('div[role="dialog"][data-state="open"] h2:has-text("Sure you want to proceed?")').first(), 
        'Cancel dialog title');

    public readonly cancelDialogMessage = compositeLocator(() =>
        this.page.locator('div[role="dialog"][data-state="open"] p:has-text("If you cancel your bonus now")').first(), 
        'Cancel dialog message');

    public readonly cancelDialogYesButton = compositeLocator(() =>
        this.page.locator('div[role="dialog"][data-state="open"] button.bg-primary:has-text("Yes")').first(), 
        'Cancel dialog Yes button');

    public readonly cancelDialogNoButton = compositeLocator(() =>
        this.page.locator('div[role="dialog"][data-state="open"] button.bg-secondary-secondary:has-text("No")').first(), 
        'Cancel dialog No button');

    public readonly cancelDialogCloseButton = compositeLocator(() =>
        this.page.locator('div[role="dialog"][data-state="open"] button.absolute.right-4.top-4:has(svg.lucide-x)'), 
        'Cancel dialog Close button');

    // Utility methods (no decorators)
    public async getCardCount(): Promise<number> {
        return await this.bonusCards.locator().count();
    }

    public async getCardTitle(index: number): Promise<string> {
        return await this.cardTitle(index).locator().textContent() || '';
    }

    public async getCardSubtitle(index: number): Promise<string> {
        return await this.cardSubtitle(index).locator().textContent() || '';
    }

    public async getCardStatus(index: number): Promise<string> {
        return await this.statusElement(index).locator().textContent() || '';
    }

    public async getCardType(index: number): Promise<string> {
        return await this.bonusType(index).locator().textContent() || '';
    }

    // Simple wrapper actions with @step
    @step('Click primary button on card')
    public async clickPrimaryButton(index: number): Promise<void> {
        await clickElement(this.primaryButton(index));
    }

    @step('Click cancel button on card')
    public async clickCancelButton(index: number): Promise<void> {
        const enabledCount = await this.enabledCancelButton(index).locator().count();
        if (enabledCount > 0) {
            await clickElement(this.enabledCancelButton(index));
        } else {
            await clickElement(this.disabledCancelButton(index));
        }
    }

    @step('Click more info button on card')
    public async clickMoreInfo(index: number): Promise<void> {
        await clickElement(this.moreInfoButton(index));
    }

    // Cancel dialog actions
    @step('Click Yes on cancel confirmation dialog')
    public async clickCancelDialogYes(): Promise<void> {
        await clickElement(this.cancelDialogYesButton, { force: true });
    }

    @step('Click No on cancel confirmation dialog')
    public async clickCancelDialogNo(): Promise<void> {
        await clickElement(this.cancelDialogNoButton, { force: true });
    }

    @step('Click close on cancel confirmation dialog')
    public async clickCancelDialogClose(): Promise<void> {
        await clickElement(this.cancelDialogCloseButton, { force: true });
    }

    // Element validation methods with @step
    @step('Validate card basic elements visible')
    public async validateCardBasicsVisible(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.bonusCard(index), softAssert);
        await assertVisible(this.cardImage(index), softAssert);
        await assertVisible(this.cardTitle(index), softAssert);
        await assertVisible(this.cardSubtitle(index), softAssert);
        await assertVisible(this.statusElement(index), softAssert);
    }

    @step('Validate wagering card elements visible')
    public async validateWageringCardElements(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.wageringStatus(index), softAssert);
        await assertVisible(this.progressBar(index), softAssert);
        await assertVisible(this.progressText(index), softAssert);
        await assertVisible(this.enabledCancelButton(index), softAssert);
        
        // These should NOT be visible for wagering cards
        await assertNotVisible(this.warningMessage(index), softAssert);
        await assertNotVisible(this.warningIcon(index), softAssert);
    }

    @step('Validate pending card elements visible')
    public async validatePendingCardElements(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.pendingStatus(index), softAssert);
        await assertVisible(this.warningMessage(index), softAssert);
        await assertVisible(this.warningIcon(index), softAssert);
        await assertVisible(this.disabledCancelButton(index), softAssert);
        
        // These should NOT be visible for pending cards
        await assertNotVisible(this.progressBar(index), softAssert);
        await assertNotVisible(this.progressText(index), softAssert);
    }

    @step('Validate available card elements visible')
    public async validateAvailableCardElements(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.availableStatus(index), softAssert);
        await assertVisible(this.primaryButton(index), softAssert);
        
        // These should NOT be visible for available cards
        await assertNotVisible(this.progressBar(index), softAssert);
        await assertNotVisible(this.progressText(index), softAssert);
        await assertNotVisible(this.warningMessage(index), softAssert);
        await assertNotVisible(this.warningIcon(index), softAssert);
    }

    @step('Validate cancel dialog visible')
    public async validateCancelDialogVisible(softAssert = false): Promise<void> {
        // Wait for dialog animation to complete (data-state="open" with animation)
        await this.page.waitForTimeout(300);
        await assertVisible(this.cancelDialog, softAssert);
        await assertVisible(this.cancelDialogTitle, softAssert);
        await assertVisible(this.cancelDialogMessage, softAssert);
        await assertVisible(this.cancelDialogYesButton, softAssert);
        await assertVisible(this.cancelDialogNoButton, softAssert);
        // Close button check skipped - it's hidden on desktop viewports (flex lg:hidden)
        // await assertVisible(this.cancelDialogCloseButton, softAssert);
    }

    @step('Validate cancel dialog not visible')
    public async validateCancelDialogNotVisible(softAssert = false): Promise<void> {
        await assertNotVisible(this.cancelDialog, softAssert);
    }

    // Text validation methods
    @step('Validate card status text')
    public async validateCardStatusText(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.statusElement(index), expectedText, softAssert);
    }

    @step('Validate card title text')
    public async validateCardTitleText(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.cardTitle(index), expectedText, softAssert);
    }

    @step('Validate card subtitle text')
    public async validateCardSubtitleText(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.cardSubtitle(index), expectedText, softAssert);
    }

    @step('Validate card type text')
    public async validateCardTypeText(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.bonusType(index), expectedText, softAssert);
    }
}
