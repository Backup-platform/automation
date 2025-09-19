import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible, assertNotVisible, assertElementContainsText } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';

export class BonusCard {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Base selectors
    private readonly containerSelector = '#profile-myBonuses';
    private readonly bonusCardSelector = '#profile-myBonuses div.rounded-2xl.bg-tertiary-secondary.p-4';
    private elementName = (cardNumber: number, element: string) => `Card ${cardNumber + 1}: ${element}`;

    // Collection locators
    public readonly bonusCards = compositeLocator(() => 
        this.page.locator(this.bonusCardSelector), 'Bonus cards');

    public readonly bonusCard = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index), 
        `${this.elementName(index, 'card')}`);

    // Status indicators - using position-based selection for language independence
    public readonly wageringStatus = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'wagering status')}`);

    public readonly pendingStatus = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'pending status')}`);

    public readonly availableStatus = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'available status')}`);

    // Button elements - context-specific styling
    public readonly enabledCancelButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-secondary-secondary:not([disabled])').first(), 
        `${this.elementName(index, 'enabled cancel button')}`);

    public readonly disabledCancelButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-secondary-secondary[disabled]').first(), 
        `${this.elementName(index, 'disabled cancel button')}`);

    public readonly claimButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-primary').first(), 
        `${this.elementName(index, 'claim button')}`);

    public readonly depositButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-primary').first(), 
        `${this.elementName(index, 'deposit button')}`);

    public readonly primaryButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-primary').first(), 
        `${this.elementName(index, 'primary button')}`);

    public readonly actionButton = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('button').first(), 
        `${this.elementName(index, 'action button')}`);

    public readonly disabledActionButton = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('button.bg-secondary-secondary[disabled]').first(), 
        `${this.elementName(index, 'disabled action button')}`);

    // Card content elements
    public readonly bonusType = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.border-2.border-primary-secondary'), 
        `${this.elementName(index, 'bonus type')}`);

    public readonly bonusStatus = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'bonus status')} `);

    public readonly moreInfoButton = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('p:has-text("More")'), 
        `${this.elementName(index, 'more info button')}`);

    public readonly cardImage = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('img[alt="Bonus image"]'), 
        `${this.elementName(index, 'image')}`);

    public readonly cardTitle = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('h5'),
        `${this.elementName(index, 'title')}`);

    public readonly cardSubtitle = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('p.font-rubik.text-xs'),
        `${this.elementName(index, 'subtitle')}`);

    // Wagering progress elements - only visible for wagering status
    public readonly progressBar = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('svg[width="247"]'), 
        `${this.elementName(index, 'progress bar')}`);

    public readonly progressText = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('div.flex.items-center.gap-1.font-rubik.text-xs.font-normal:has-text("Wagered:")'), 
        `${this.elementName(index, 'progress text')}`);

    // Warning elements - only visible for pending status
    public readonly warningMessage = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('p.flex.gap-2.font-rubik:has(svg path[fill="#DC373B"])').first(), 
        `${this.elementName(index, 'warning message')}`);

    public readonly warningIcon = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('svg path[fill="#DC373B"]').first(), 
        `${this.elementName(index, 'warning icon')}`);

    // Cancel confirmation dialog elements - visible after clicking cancel button
    // Note: There may be dual dialogs (UI bug), using .first() to target the first one
    public readonly cancelDialog = compositeLocator(() =>
        this.page.locator('div[role="dialog"][data-state="open"].bg-dark.text-white.border-error').first(), 
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
        this.page.locator('div[role="dialog"][data-state="open"] button:has(svg.lucide-x)').first(), 
        'Cancel dialog Close button');

    // Details grid elements - for expanded card details
    public readonly detailsGridContainer = compositeLocator(() => 
        this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4`), 
        'Bonus details grid container');

    public readonly minDepositCard = compositeLocator(() => 
        this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4 > div`).nth(0), 
        'Min Deposit details card');

    public readonly wageringCard = compositeLocator(() => 
        this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4 > div`).nth(1), 
        'Wagering details card');

    public readonly bonusTypeCard = compositeLocator(() => 
        this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4 > div`).nth(2), 
        'Bonus Type details card');

    public readonly validUntilCard = compositeLocator(() => 
        this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4 > div`).nth(3), 
        'Valid Until details card');

    public readonly bonusContentSection = compositeLocator(() => 
        this.page.locator(`${this.containerSelector} div.flex.flex-col.gap-2`), 
        'Bonus content section');

    // Generic details grid - for expanded card details
    public getDetailsGrid() {
        return {
            container: this.detailsGridContainer,
            cards: {
                minDeposit: this.minDepositCard,
                wagering: this.wageringCard,
                bonusType: this.bonusTypeCard,
                validUntil: this.validUntilCard
            },
            content: this.bonusContentSection
        };
    }

    public getCardCount = async () => await this.bonusCards.locator().count();

    @step('Get card text')
    public async getCardText(index: number, element: 'title' | 'subtitle' | 'status' | 'type'): Promise<string> {
        const elementMap = {
            title: this.cardTitle(index),
            subtitle: this.cardSubtitle(index),
            status: this.bonusStatus(index),
            type: this.bonusType(index)
        };

        const locator = elementMap[element];
        const text = await locator.locator().textContent() || '';
        return text;
    }

    // Action methods based on bonus status
    @step('Click more info button on card')
    public async clickMoreInfo(index: number) {
        await clickElement(this.moreInfoButton(index));
    }

    @step('Click primary button on card')
    public async clickPrimaryButton(index: number) {
        await clickElement(this.primaryButton(index));
    }

    @step('Click cancel bonus button on card')
    public async clickCancelBonusButton(index: number) {
        const enabledCount = await this.enabledCancelButton(index).locator().count();
        if (enabledCount > 0) {
            await clickElement(this.enabledCancelButton(index));
        } else {
            await clickElement(this.disabledCancelButton(index));
        }
    }

    // Cancel dialog action methods
    @step('Click Yes on cancel confirmation dialog')
    public async clickCancelDialogYes() {
        // Force click needed due to dual dialog UI bug (pointer events interception)
        await clickElement(this.cancelDialogYesButton, { force: true });
    }

    @step('Click No on cancel confirmation dialog')
    public async clickCancelDialogNo() {
        // Force click needed due to dual dialog UI bug (pointer events interception)
        await clickElement(this.cancelDialogNoButton, { force: true });
    }

    @step('Click close on cancel confirmation dialog')
    public async clickCancelDialogClose() {
        // Force click needed due to dual dialog UI bug (pointer events interception)
        await clickElement(this.cancelDialogCloseButton, { force: true });
    }

    // Validation methods based on bonus status
    @step('Validate card basic elements are visible')
    public async validateCardBasics(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.bonusCard(index), softAssert);
        await assertVisible(this.cardImage(index), softAssert);
        await assertVisible(this.cardTitle(index), softAssert);
        await assertVisible(this.cardSubtitle(index), softAssert);
    }

    @step('Validate card details grid is visible')
    public async validateDetailsGrid(softAssert = false): Promise<void> {
        const details = this.getDetailsGrid();
        await assertVisible(details.container, softAssert);
        await assertVisible(details.cards.minDeposit, softAssert);
        await assertVisible(details.cards.wagering, softAssert);
        await assertVisible(details.cards.bonusType, softAssert);
        await assertVisible(details.cards.validUntil, softAssert);
        await assertVisible(details.content, softAssert);
    }
    

    @step('Validate wagering bonus card elements')
    public async validateWageringCard(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.wageringStatus(index), softAssert);
        await assertVisible(this.progressBar(index), softAssert);
        await assertVisible(this.progressText(index), softAssert);
        await assertVisible(this.actionButton(index), softAssert);
        await assertVisible(this.enabledCancelButton(index), softAssert);
        
        await assertNotVisible(this.warningMessage(index), softAssert);
        await assertNotVisible(this.warningIcon(index), softAssert);
    }

    @step('Validate pending bonus card elements')
    public async validatePendingCard(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.pendingStatus(index), softAssert);
        await assertVisible(this.disabledActionButton(index), softAssert);
        await assertVisible(this.warningMessage(index), softAssert);
        await assertVisible(this.warningIcon(index), softAssert);
        await assertVisible(this.disabledCancelButton(index), softAssert);
        
        await assertNotVisible(this.progressBar(index), softAssert);
        await assertNotVisible(this.progressText(index), softAssert);
    }

    @step('Validate available bonus card elements')
    public async validateAvailableCard(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.availableStatus(index), softAssert);
        await assertVisible(this.actionButton(index), softAssert);
        await assertVisible(this.primaryButton(index), softAssert);
        
        await assertNotVisible(this.progressBar(index), softAssert);
        await assertNotVisible(this.progressText(index), softAssert);
        await assertNotVisible(this.warningMessage(index), softAssert);
        await assertNotVisible(this.warningIcon(index), softAssert);
    }

    @step('Validate cancel confirmation dialog elements')
    public async validateCancelDialog(softAssert = false): Promise<void> {
        await assertVisible(this.cancelDialog, softAssert);
        await assertVisible(this.cancelDialogTitle, softAssert);
        await assertVisible(this.cancelDialogMessage, softAssert);
        await assertVisible(this.cancelDialogYesButton, softAssert);
        await assertVisible(this.cancelDialogNoButton, softAssert);
        await assertVisible(this.cancelDialogCloseButton, softAssert);
    }

    @step('Validate cancel dialog is not visible')
    public async validateCancelDialogNotVisible(softAssert = false): Promise<void> {
        await assertNotVisible(this.cancelDialog, softAssert);
    }

    // Text validation methods using index parameter
    @step('Validate card status text')
    public async validateCardStatus(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.bonusStatus(index), expectedText, softAssert);
    }

    @step('Validate card title text')
    public async validateCardTitle(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.cardTitle(index), expectedText, softAssert);
    }

    @step('Validate card subtitle text')
    public async validateCardSubtitle(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.cardSubtitle(index), expectedText, softAssert);
    }

    @step('Validate card type text')
    public async validateCardType(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.bonusType(index), expectedText, softAssert);
    }
}
