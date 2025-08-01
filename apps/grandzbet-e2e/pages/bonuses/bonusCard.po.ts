import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible, assertElementContainsText } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';

export class BonusCard {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Base selectors - simplified
    private readonly containerSelector = '#profile-myBonuses';
    private readonly bonusCardSelector = '#profile-myBonuses div.rounded-2xl.bg-tertiary-secondary.p-4';
    private cardSelector = (cardNumber: number) => `${this.bonusCardSelector}:nth-child(${cardNumber + 1})`;
    private elementName = (cardNumber: number, element: string) => `Card ${cardNumber + 1}: ${element}`;

    // Essential card elements - simplified selectors
    public readonly bonusType = (index: number) => compositeLocator(() => 
        this.page.locator(`${this.cardSelector(index)} span.border-2.border-primary-secondary`), 
        `${this.elementName(index, 'bonus type')}`);

    public readonly bonusStatus = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} span.bg-dark.text-2xs.font-bold`), 
        `${this.elementName(index, 'bonus status')} `);

    public readonly moreInfoButton = (index: number) => compositeLocator(() => 
        this.page.locator(`${this.cardSelector(index)} p:has-text("More")`), 
        `${this.elementName(index, 'more info button')}`);

    public readonly cardImage = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} img[alt="Bonus image"]`), 
        `${this.elementName(index, 'image')}`);

    public readonly cardTitle = (index: number) => compositeLocator(() => 
        this.page.locator(`${this.cardSelector(index)} h5.font-roboto.font-bold.text-white`),
        `${this.elementName(index, 'title')}`);

    public readonly cardSubtitle = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} p.font-rubik.text-xs.text-greyLight`),
        `${this.elementName(index, 'subtitle')}`);

    // Action buttons - context depends on bonus status
    public readonly actionButton = (index: number) => compositeLocator(() => 
        this.page.locator(`${this.cardSelector(index)} button`), 
        `${this.elementName(index, 'action button')}`);

    public readonly disabledActionButton = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} button[disabled]`), 
        `${this.elementName(index, 'disabled action button')}`);

    // Progress elements - only for wagering status
    public readonly progressBar = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} svg[width="247"]`), 
        `${this.elementName(index, 'progress bar')}`);

    public readonly progressText = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} div:has-text("Wagered:")`), 
        `${this.elementName(index, 'progress text')}`);

    // Warning elements - only for pending status
    public readonly warningMessage = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} p:has-text("You have an active casino bonus")`), 
        `${this.elementName(index, 'warning message')}`);

    public readonly warningIcon = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} svg path[fill="#DC373B"]`), 
        `${this.elementName(index, 'warning icon')}`);

    // Generic details grid - for expanded card details
    public getDetailsGrid() {
        return {
            container: compositeLocator(() => this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4`), 'Bonus details grid'),
            cards: {
                minDeposit: compositeLocator(() => this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4 > div`).nth(0), 'Min Deposit card'),
                wagering: compositeLocator(() => this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4 > div`).nth(1), 'Wagering card'),
                bonusType: compositeLocator(() => this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4 > div`).nth(2), 'Bonus Type card'),
                validUntil: compositeLocator(() => this.page.locator(`${this.containerSelector} div.grid.w-full.grid-cols-2.gap-4 > div`).nth(3), 'Valid Until card')
            },
            content: compositeLocator(() => this.page.locator(`${this.containerSelector} div.flex.flex-col.gap-2`), 'Bonus content section')
        };
    }

    public getCardCount = async () => await this.page.locator(`${this.bonusCardSelector}`).count();

    // Action methods based on bonus status
    public async clickMoreInfo(index: number) {
        await clickElement(this.moreInfoButton(index));
    }

    public async clickActionButton(index: number) {
        await clickElement(this.actionButton(index));
    }

    // Convenience methods for specific actions
    public async clickDepositButton(index: number) {
        const depositButton = compositeLocator(
            () => this.page.locator(`${this.cardSelector(index)} button:has-text("Deposit")`),
            `Card ${index + 1} deposit button`
        );
        await clickElement(depositButton);
    }

    public async clickClaimButton(index: number) {
        const claimButton = compositeLocator(
            () => this.page.locator(`${this.cardSelector(index)} button:has-text("Claim")`),
            `Card ${index + 1} claim button`
        );
        await clickElement(claimButton);
    }

    public async clickCancelBonusButton(index: number) {
        const cancelButton = compositeLocator(
            () => this.page.locator(`${this.cardSelector(index)} button:has-text("Cancel bonus")`),
            `Card ${index + 1} cancel button`
        );
        await clickElement(cancelButton);
    }

    // Validation methods based on bonus status
    @step('Validate card basic elements are visible')
    public async validateCardBasics(index: number, softAssert = false): Promise<void> {
        const cardLocator = compositeLocator(() => this.page.locator(this.cardSelector(index)), `Bonus card ${index + 1}`);
        await assertVisible(cardLocator, softAssert);
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

    @step('Validate active bonus card elements')
    public async validateActiveCard(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.bonusStatus(index), softAssert);
        await assertVisible(this.progressBar(index), softAssert);
        await assertVisible(this.progressText(index), softAssert);
        await assertVisible(this.actionButton(index), softAssert);
    }

    @step('Validate pending bonus card elements')
    public async validatePendingCard(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.bonusStatus(index), softAssert);
        await assertVisible(this.disabledActionButton(index), softAssert);
        await assertVisible(this.warningMessage(index), softAssert);
        await assertVisible(this.warningIcon(index), softAssert);
    }

    @step('Validate available bonus card elements')
    public async validateAvailableCard(index: number, softAssert = false): Promise<void> {
        await assertElementContainsText(this.bonusStatus(index), 'Available', softAssert);
        await assertVisible(this.actionButton(index), softAssert);
    }

    // Text validation methods using index parameter
    @step('Validate card status text')
    public async validateCardStatus(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.bonusStatus(index), expectedText, softAssert);
    }

    @step('Validate card status has correct color class')
    public async validateCardStatusColor(index: number, expectedStatus: 'active' | 'pending' | 'available', softAssert = false): Promise<void> {
        const statusLocator = this.bonusStatus(index);
        switch (expectedStatus) {
            case 'active':
                await assertVisible(statusLocator, softAssert);
                // Additional check for "Wagering" text
                await assertElementContainsText(statusLocator, 'Wagering', softAssert);
                break;
            case 'pending':
                await assertVisible(statusLocator, softAssert);
                await assertElementContainsText(statusLocator, 'Pending', softAssert);
                break;
            case 'available':
                await assertVisible(statusLocator, softAssert);
                await assertElementContainsText(statusLocator, 'Available', softAssert);
                break;
        }
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

    // Legacy method compatibility (now requiring index parameter)
    public async validateBonusDetailsVisible(softAssert = false): Promise<void> {
        await this.validateDetailsGrid(softAssert);
    }

    public async validateActiveBonusCardVisible(index: number, softAssert = false): Promise<void> {
        await this.validateActiveCard(index, softAssert);
    }

    public async validatePendingBonusCardVisible(index: number, softAssert = false): Promise<void> {
        await this.validatePendingCard(index, softAssert);
    }

    public async validateAvailableBonusCardVisible(index: number, softAssert = false): Promise<void> {
        await this.validateAvailableCard(index, softAssert);
    }
}
