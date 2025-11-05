import { Page, test, expect } from '@playwright/test';
import { assertVisible } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';
import { clickElement } from '@test-utils/interactions';
import { getElementText } from '@test-utils/text-extraction';
import { assertElementContainsText } from '@test-utils/assertions';
import { validateAllElementsVisibility, validateGroupsContainText } from '@test-utils/assertions.groups';

export class Wallet {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }   

    // Locators
    private readonly walletBalanceSection = compositeLocator(() =>
        this.page.locator('.flex.flex-col.gap-4').filter({ has: this.page.locator('.flex.w-full.justify-end.gap-2') }), 'Wallet Balance Section');

    private readonly balanceLabelColumn = compositeLocator(() =>
        this.walletBalanceSection.locator().locator('.flex.flex-col.items-end.gap-\\[2px\\]').first(), 'Balance Label Column');

    private readonly balanceValueColumn = compositeLocator(() =>
        this.walletBalanceSection.locator().locator('.flex.flex-col.items-end.gap-\\[2px\\]').nth(1), 'Balance Value Column');

    private readonly realMoneyLabel = compositeLocator(() =>
        this.balanceLabelColumn.locator().locator('span').nth(0), 'Real Money Label');
    private readonly realMoneyValue = compositeLocator(() =>
        this.balanceValueColumn.locator().locator('span').nth(0), 'Real Money Value');

    private readonly casinoBonusLabel = compositeLocator(() =>
        this.balanceLabelColumn.locator().locator('span').nth(1), 'Casino Bonus Label');
    private readonly casinoBonusValue = compositeLocator(() =>
        this.balanceValueColumn.locator().locator('span').nth(1), 'Casino Bonus Value');

    private readonly sportBonusLabel = compositeLocator(() =>
        this.balanceLabelColumn.locator().locator('span').nth(2), 'Sport Bonus Label');
    private readonly sportBonusValue = compositeLocator(() =>
        this.balanceValueColumn.locator().locator('span').nth(2), 'Sport Bonus Value');

    private readonly totalBalanceLabel = compositeLocator(() =>
        this.balanceLabelColumn.locator().locator('span.text-primary'), 'Total Balance Label');
    private readonly totalBalanceValue = compositeLocator(() =>
        this.balanceValueColumn.locator().locator('span.text-primary'), 'Total Balance Value');    
    
    private readonly depositButton = compositeLocator(() =>
        this.walletBalanceSection.locator().locator('button[class*="bg-primary"], button.bg-primary'), 'Deposit Button');

    private readonly walletBalanceElementsMap = {
        realMoney: { label: this.realMoneyLabel, value: this.realMoneyValue },
        casinoBonus: { label: this.casinoBonusLabel, value: this.casinoBonusValue },
        sportBonus: { label: this.sportBonusLabel, value: this.sportBonusValue },
        totalBalance: { label: this.totalBalanceLabel, value: this.totalBalanceValue }
    } as const;    
    
    private async validateWalletBalanceElement(
        elementKey: keyof typeof this.walletBalanceElementsMap,
        softAssert = false
    ): Promise<void> {
        // const element = this.walletBalanceElementsMap[elementKey];
        // const elementMap = { [elementKey]: [element.label, element.value] };
        // await validateElementMapVisibility(elementMap, softAssert);

        await validateAllElementsVisibility(this.walletBalanceElementsMap[elementKey], softAssert);
    }
    
    // Actions

    public clickDepositButton = async () => await clickElement(this.depositButton);

    public validateWalletBalanceSectionVisible = async (softAssert = false) =>
        await assertVisible(this.walletBalanceSection, softAssert);

    public validateRealMoneyBalanceVisible = async (softAssert = false) =>
        await this.validateWalletBalanceElement('realMoney', softAssert);

    public validateCasinoBonusBalanceVisible = async (softAssert = false) =>
        await this.validateWalletBalanceElement('casinoBonus', softAssert);

    public validateSportBonusBalanceVisible = async (softAssert = false) =>
        await this.validateWalletBalanceElement('sportBonus', softAssert);    

    public validateTotalBalanceVisible = async (softAssert = false) =>
        await this.validateWalletBalanceElement('totalBalance', softAssert);

    public validateAllWalletBalanceElementsVisible = async (softAssert = false): Promise<void> => {
        await validateAllElementsVisibility(this.walletBalanceElementsMap, softAssert);
    }

    public validateDepositButtonVisible = async (softAssert = false) =>
        await assertVisible(this.depositButton, softAssert);

    public getRealMoneyBalanceValue = async (): Promise<string> =>
        await getElementText(this.walletBalanceElementsMap, 'realMoney', 'value');

    public getCasinoBonusBalanceValue = async (): Promise<string> =>
        await getElementText(this.walletBalanceElementsMap, 'casinoBonus', 'value');

    public getSportBonusBalanceValue = async (): Promise<string> =>
        await getElementText(this.walletBalanceElementsMap, 'sportBonus', 'value');

    public getTotalBalanceValue = async (): Promise<string> =>
        await getElementText(this.walletBalanceElementsMap, 'totalBalance', 'value');

    public getBalanceValueByKey = async (balanceKey: keyof typeof this.walletBalanceElementsMap): Promise<string> => {
        return await getElementText(this.walletBalanceElementsMap, balanceKey, 'value');
    }

    public validateBalanceElementsVisibility = async (softAssert = false): Promise<void> => {
        await this.validateRealMoneyBalanceVisible(softAssert);
        await this.validateCasinoBonusBalanceVisible(softAssert);
        await this.validateSportBonusBalanceVisible(softAssert);
        await this.validateTotalBalanceVisible(softAssert);
    }   
    
    // Balance validation methods - compare expected vs actual values
    
    private async validateBalanceEqualsInternal(
        balanceKey: keyof typeof this.walletBalanceElementsMap,
        expectedValue: string,
        softAssert = false
    ): Promise<void> {
        const actualValue = await this.getBalanceValueByKey(balanceKey);
        await test.step(`I validate ${balanceKey}: ${actualValue} balance equals ${expectedValue}`, async () => {
            const expectation = softAssert ? expect.soft(actualValue, `${balanceKey}: ${actualValue} 
                balance mismatch with expected ${expectedValue}`) : expect(actualValue, `${balanceKey} balance mismatch`);
            await expectation.toBe(expectedValue);
        });
    }

    public validateRealMoneyBalanceEquals = async (expectedValue: string, softAssert = false): Promise<void> => {
        await this.validateBalanceEqualsInternal('realMoney', expectedValue, softAssert);
    };

    public validateCasinoBonusBalanceEquals = async (expectedValue: string, softAssert = false): Promise<void> => {
        await this.validateBalanceEqualsInternal('casinoBonus', expectedValue, softAssert);
    };

    public validateSportBonusBalanceEquals = async (expectedValue: string, softAssert = false): Promise<void> => {
        await this.validateBalanceEqualsInternal('sportBonus', expectedValue, softAssert);
    };

    public validateTotalBalanceEquals = async (expectedValue: string, softAssert = false): Promise<void> => {
        await this.validateBalanceEqualsInternal('totalBalance', expectedValue, softAssert);
    };    
    
    public validateBalanceByKeyEquals = async (
        balanceKey: keyof typeof this.walletBalanceElementsMap, 
        expectedValue: string, 
        softAssert = false
    ): Promise<void> => {
        await this.validateBalanceEqualsInternal(balanceKey, expectedValue, softAssert);
    };

    public validateAllBalancesEqual = async (
        expectedBalances: Partial<Record<keyof typeof this.walletBalanceElementsMap, string>>,
        softAssert = false
    ): Promise<void> => {
        await test.step(`I validate all wallet balances match expected values`, async () => {
            for (const [balanceKey, expectedValue] of Object.entries(expectedBalances) as Array<[keyof typeof this.walletBalanceElementsMap, string]>) {
                await this.validateBalanceByKeyEquals(balanceKey, expectedValue, softAssert);
            }
        });
    }; 
    
    private async validateBalanceContainsInternal(
        balanceKey: keyof typeof this.walletBalanceElementsMap,
        expectedText: string,
        softAssert = false
    ): Promise<void> {
        const element = this.walletBalanceElementsMap[balanceKey].value;
        await assertElementContainsText(element, expectedText, softAssert);
    }
    
    public validateRealMoneyBalanceContains = async (value: string, softAssert = false): Promise<void> => {
        await this.validateBalanceContainsInternal('realMoney', value, softAssert);
    };

    public validateCasinoBonusBalanceContains = async (value: string, softAssert = false): Promise<void> => {
        await this.validateBalanceContainsInternal('casinoBonus', value, softAssert);
    };

    public validateSportBonusBalanceContains = async (value: string, softAssert = false): Promise<void> => {
        await this.validateBalanceContainsInternal('sportBonus', value, softAssert);
    };

    public validateTotalBalanceContains = async (value: string, softAssert = false): Promise<void> => {
        await this.validateBalanceContainsInternal('totalBalance', value, softAssert);
    };

    public validateBalanceByKeyContains = async (
        balanceKey: keyof typeof this.walletBalanceElementsMap, 
        expectedText: string, 
        softAssert = false
    ): Promise<void> => {
        await this.validateBalanceContainsInternal(balanceKey, expectedText, softAssert);
    };

    public validateAllBalancesContain = async (
        expectedTexts: Partial<Record<keyof typeof this.walletBalanceElementsMap, string>>,
        softAssert = false
    ): Promise<void> => {
        await test.step(`I validate all wallet balances contain expected text`, async () => {
            for (const [balanceKey, expectedText] of Object.entries(expectedTexts) as Array<[keyof typeof this.walletBalanceElementsMap, string]>) {
                await this.validateBalanceByKeyContains(balanceKey, expectedText, softAssert);
            }
        });
    };

    public validateBalanceElementMapText = async (
        balanceKey: keyof typeof this.walletBalanceElementsMap,
        expectedText: string,
        softAssert = false
    ): Promise<void> => {
        await validateGroupsContainText(this.walletBalanceElementsMap, expectedText, balanceKey, softAssert);
    };

    public validateAllBalanceElementsMapVisibility = async (softAssert = false): Promise<void> => {
        await validateAllElementsVisibility(this.walletBalanceElementsMap, softAssert);
    };
}
