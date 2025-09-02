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

    // Base selectors - simplified
    private readonly containerSelector = '#profile-myBonuses';
    private readonly bonusCardSelector = '#profile-myBonuses div.rounded-2xl.bg-tertiary-secondary.p-4';
    private cardSelector = (cardNumber: number) => `${this.bonusCardSelector}:nth-child(${cardNumber + 1})`;
    private elementName = (cardNumber: number, element: string) => `Card ${cardNumber + 1}: ${element}`;

    public readonly bonusCards = compositeLocator(() => 
        this.page.locator(this.bonusCardSelector), 'Bonus cards');

    public readonly wageringStatus = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} span.text-primary.bg-dark.text-2xs.font-bold`), 
        `${this.elementName(index, 'wagering status')}`);

    public readonly pendingStatus = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} span.text-warning.bg-dark.text-2xs.font-bold`), 
        `${this.elementName(index, 'pending status')}`);

    public readonly availableStatus = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} span.text-white.bg-dark.text-2xs.font-bold`), 
        `${this.elementName(index, 'available status')}`);

    // Button-specific selectors using CSS classes only (language-independent)
    public readonly enabledCancelButton = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} button.bg-secondary-secondary:not([disabled])`), 
        `${this.elementName(index, 'enabled cancel button')}`);

    public readonly disabledCancelButton = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} button.bg-secondary-secondary[disabled]`), 
        `${this.elementName(index, 'disabled cancel button')}`);

    public readonly claimButton = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} button.bg-primary`), 
        `${this.elementName(index, 'claim button')}`);

    public readonly depositButton = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} button.bg-primary`), 
        `${this.elementName(index, 'deposit button')}`);

    // Generic primary button (since deposit and claim have same styling)
    public readonly primaryButton = (index: number) => compositeLocator(() =>
        this.page.locator(`${this.cardSelector(index)} button.bg-primary`), 
        `${this.elementName(index, 'primary button')}`);

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

    public async getCardText(index: number, element: 'title' | 'subtitle' | 'status' | 'type'): Promise<string> {
        const elementMap = {
            title: this.cardTitle(index),
            subtitle: this.cardSubtitle(index),
            status: this.bonusStatus(index),
            type: this.bonusType(index)
        };

        const locator = elementMap[element];
        await assertVisible(locator);
        return await locator.locator().textContent() || '';
    }

    // Action methods based on bonus status
    public async clickMoreInfo(index: number) {
        await clickElement(this.moreInfoButton(index));
    }

    public async clickPrimaryButton(index: number) {
        await clickElement(this.primaryButton(index));
    }

    public async clickCancelBonusButton(index: number) {
        const enabledCount = await this.enabledCancelButton(index).locator().count();
        if (enabledCount > 0) {
            await clickElement(this.enabledCancelButton(index));
        } else {
            await clickElement(this.disabledCancelButton(index));
        }
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
