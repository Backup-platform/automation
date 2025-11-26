import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible, assertNotVisible, assertElementContainsText } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';
import type { BonusCardStatus } from './types';
import { getText } from '@test-utils';

type CardMeta = {
    title: string;
    subtitle: string;
    hasProgress: boolean;
    hasWarning: boolean;
    hasEnabledCancel: boolean;
    hasDisabledCancel: boolean;
    primaryEnabled: boolean;
};

const STATUS_LOCATOR_MAP: Record<BonusCardStatus, string> = {
    wagering: 'span.bg-dark.text-2xs.font-bold.font-rubik.text-primary',
    pending: 'span.bg-dark.text-2xs.font-bold.font-rubik.text-warning',
    available: 'span.bg-dark.text-2xs.font-bold.font-rubik.text-white'
};

/**
 * Layer 1: BonusCard POM - Element Level
 * Handles individual bonus card elements and basic interactions
 */
export class BonusCard {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private readonly bonusCardSelector = '#profile-myBonuses div.rounded-2xl.bg-tertiary-secondary.p-4';
    private elementName = (cardNumber: number, element: string) => `Card ${cardNumber + 1}: ${element}`;

    public readonly bonusCards = compositeLocator(() => 
        this.page.locator(this.bonusCardSelector), 'Bonus cards');

    public readonly bonusCard = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index), 
        `${this.elementName(index, 'card')}`);

    public readonly statusElement = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('span.bg-dark.text-2xs.font-bold').nth(1), 
        `${this.elementName(index, 'status')}`);

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

    public readonly progressBar = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('svg[width="247"]'), 
        `${this.elementName(index, 'progress bar')}`);

    public readonly progressText = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector)
            .nth(index)
            .locator('div:has-text("Wagered:") span.text-primary').first(),
        `${this.elementName(index, 'progress text')}`);

    public readonly warningMessage = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('p.flex.gap-2.font-rubik:has(svg path[fill="#DC373B"])').first(), 
        `${this.elementName(index, 'warning message')}`);

    public readonly warningIcon = (index: number) => compositeLocator(() =>
        this.page.locator(this.bonusCardSelector).nth(index).locator('svg path[fill="#DC373B"]').first(), 
        `${this.elementName(index, 'warning icon')}`);

    public readonly moreInfoButton = (index: number) => compositeLocator(() => 
        this.page.locator(this.bonusCardSelector).nth(index).locator('p:has-text("More")'), 
        `${this.elementName(index, 'more info button')}`);

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

    public statusBadge(index: number, status: BonusCardStatus) {
        return compositeLocator(() =>
            this.page.locator(this.bonusCardSelector).nth(index).locator(STATUS_LOCATOR_MAP[status]),
            `${this.elementName(index, `${status} status`)}`
        );
    }

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

    public async clickPrimaryButton(index: number): Promise<void> {
        await clickElement(this.primaryButton(index));
    }

    public async clickCancelButton(index: number): Promise<void> {
        await clickElement(this.enabledCancelButton(index));
    }

    public async clickMoreInfo(index: number): Promise<void> {
        await clickElement(this.moreInfoButton(index));
    }

    public async clickCancelDialogYes(): Promise<void> {
        await clickElement(this.cancelDialogYesButton, { force: true });
    }

    public async clickCancelDialogNo(): Promise<void> {
        await clickElement(this.cancelDialogNoButton, { force: true });
    }

    public async clickCancelDialogClose(): Promise<void> {
        await clickElement(this.cancelDialogCloseButton, { force: true });
    }

    public async validateCancelDialogNotVisible(softAssert = false): Promise<void> {
        await assertNotVisible(this.cancelDialog, softAssert);
    }

    public async validateCardTitleText(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.cardTitle(index), expectedText, softAssert);
    }

    public async validateCardSubtitleText(index: number, expectedText: string, softAssert = false): Promise<void> {
        await assertElementContainsText(this.cardSubtitle(index), expectedText, softAssert);
    }


    public async getProgressBarForActiveBonus() {
        return this.progressBar(0).locator();
    }

    public async getProgressPercentForActiveBonus() {
        return await getText(this.progressText(0));
    }

    @step('Validate cancel dialog visible')
    public async validateCancelDialogVisible(softAssert = false): Promise<void> {
        await this.cancelDialog.locator().waitFor({ state: 'visible', timeout: 5000 });
        await assertVisible(this.cancelDialog, softAssert);
        await assertVisible(this.cancelDialogTitle, softAssert);
        await assertVisible(this.cancelDialogMessage, softAssert);
        await assertVisible(this.cancelDialogYesButton, softAssert);
        await assertVisible(this.cancelDialogNoButton, softAssert);
    }

    @step('Validate card basic elements visible')
    public async validateCardBasicsVisible(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.bonusCard(index), softAssert);
        await assertVisible(this.cardImage(index), softAssert);
        await assertVisible(this.cardTitle(index), softAssert);
        await assertVisible(this.cardSubtitle(index), softAssert);
        await assertVisible(this.statusElement(index), softAssert);
    }

    @step('Validate wagering card status-specific elements')
    private async validateWageringStatusElements(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.progressBar(index), softAssert);
        await assertVisible(this.progressText(index), softAssert);
        await assertVisible(this.enabledCancelButton(index), softAssert);
        await assertNotVisible(this.warningMessage(index), softAssert);
        await assertNotVisible(this.warningIcon(index), softAssert);
    }

    @step('Validate pending card status-specific elements')
    private async validatePendingStatusElements(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.warningMessage(index), softAssert);
        await assertVisible(this.warningIcon(index), softAssert);
        await assertVisible(this.disabledCancelButton(index), softAssert);
        await assertNotVisible(this.progressBar(index), softAssert);
        await assertNotVisible(this.progressText(index), softAssert);
    }

    @step('Validate available card status-specific elements')
    private async validateAvailableStatusElements(index: number, softAssert = false): Promise<void> {
        await assertVisible(this.primaryButton(index), softAssert);
        await assertNotVisible(this.progressBar(index), softAssert);
        await assertNotVisible(this.progressText(index), softAssert);
        await assertNotVisible(this.warningMessage(index), softAssert);
        await assertNotVisible(this.warningIcon(index), softAssert);
    }

    public async validateCardWithStatus(index: number, status: BonusCardStatus, softAssert = false): Promise<void> {
        await assertVisible(this.statusBadge(index, status), softAssert);

        switch (status) {
            case 'wagering':
                await this.validateWageringStatusElements(index, softAssert);
                break;
            case 'pending':
                await this.validatePendingStatusElements(index, softAssert);
                break;
            case 'available':
                await this.validateAvailableStatusElements(index, softAssert);
                break;
        }
    }

    public async getCardMeta(index: number): Promise<CardMeta> {
        const [title, subtitle] = await Promise.all([
            this.getCardTitle(index),
            this.getCardSubtitle(index)
        ]);

        const [progressCount, warningCount, primaryCount, enabledCancelCount, disabledCancelCount] = await Promise.all([
            this.progressBar(index).locator().count(),
            this.warningMessage(index).locator().count(),
            this.primaryButton(index).locator().count(),
            this.enabledCancelButton(index).locator().count(),
            this.disabledCancelButton(index).locator().count()
        ]);

        let primaryEnabled = false;
        if (primaryCount > 0) {
            primaryEnabled = await this.primaryButton(index).locator().first().isEnabled();
        }

        return {
            title,
            subtitle,
            hasProgress: progressCount > 0,
            hasWarning: warningCount > 0,
            hasEnabledCancel: enabledCancelCount > 0,
            hasDisabledCancel: disabledCancelCount > 0,
            primaryEnabled
        };
    }    
}
