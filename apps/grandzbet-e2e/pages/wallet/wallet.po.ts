import { Page, test, expect } from '@playwright/test';
import { assertVisible } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';
import { clickElement } from '@test-utils/interactions';
import { getElementText } from '@test-utils/text-extraction';
import { assertElementContainsText } from '@test-utils/assertions';
import { validateAllElementsVisibility, validateGroupsContainText } from '@test-utils/assertions.groups';
import { step } from '@test-utils/decorators';

export class Wallet {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }   

    // New locators based on the provided HTML structure
    private readonly balanceDropdownButton = compositeLocator(() =>
        this.page.locator('div[aria-haspopup="menu"]').filter({ has: this.page.locator('span', { hasText: 'Balance' }) }), 'Balance Dropdown Button');

    private readonly balanceDropdownMenu = compositeLocator(() =>
        this.page.locator('[role="menu"][aria-labelledby]'), 'Balance Dropdown Menu');

    // Dropdown menu content locators
    private readonly dropdownMenu = compositeLocator(() =>
        this.page.locator('div[role="menu"]'), 'Balance Dropdown Menu Content');

    private readonly dropdownColumns = compositeLocator(() =>
        this.dropdownMenu.locator().locator('div.flex.flex-col'), 'Dropdown Columns');

    private readonly valuesColumn = compositeLocator(() =>
        this.dropdownColumns.locator().nth(1), 'Values Column');

    private readonly realMoneyFromDropdown = compositeLocator(() =>
        this.valuesColumn.locator().locator('span').nth(0), 'Real Money Value from Dropdown');

    private readonly bonusFromDropdown = compositeLocator(() =>
        this.valuesColumn.locator().locator('span').nth(1), 'Casino Bonus Value from Dropdown');

    private readonly totalFromDropdown = compositeLocator(() =>
        this.valuesColumn.locator().locator('span').nth(3), 'Total Balance Value from Dropdown');

    // Alternative locators for the collapsed balance display
    private readonly collapsedBalanceContainer = compositeLocator(() =>
        this.page.locator('div[data-state="closed"], div[data-state="open"]').filter({ has: this.page.locator('span', { hasText: 'Balance' }) }), 'Balance Container');

    private readonly collapsedBalanceValue = compositeLocator(() =>
        this.collapsedBalanceContainer.locator().locator('div.flex.flex-col.items-end').locator('span').nth(1), 'Collapsed Balance Value');

    // Legacy locators (keeping for backward compatibility)
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

    // New methods for dropdown-based balance reading
    @step('Click balance dropdown button')
    public async clickBalanceDropdown(): Promise<void> {
        await clickElement(this.balanceDropdownButton);
    }

    @step('Open balance dropdown and wait for menu')
    public async openBalanceDropdownAndWaitForMenu(): Promise<void> {
        const dataState = await this.balanceDropdownButton.locator().getAttribute('data-state');
        const isDropdownOpen = dataState === 'open';
        
        if (!isDropdownOpen) {
            await this.clickBalanceDropdown();
            await assertVisible(this.balanceDropdownMenu);
        }
    }

    // Get balance from collapsed state (when dropdown is not expanded)
    @step('Get balance from collapsed state')
    public async getBalanceFromCollapsed(): Promise<string> {
        return await this.collapsedBalanceValue.locator().textContent() || '0.00';
    }

    @step('Get real money balance from dropdown')
    public async getRealMoneyFromDropdown(): Promise<string> {
        try {
            // Use shared method to open dropdown only if needed
            await this.openBalanceDropdownAndWaitForMenu();
            
            // Wait for dropdown menu to be visible
            await this.dropdownMenu.locator().waitFor({ state: 'visible', timeout: 5000 });
            
            // Get the Real Money value using composite locator
            const realMoneyText = await this.realMoneyFromDropdown.locator().textContent();
            
            return realMoneyText || '0.00';
            
        } catch {
            return '0.00';
        }
    }

    @step('Get casino bonus balance from dropdown')
    public async getBonusFromDropdown(): Promise<string> {
        try {
            // Use shared method to open dropdown only if needed
            await this.openBalanceDropdownAndWaitForMenu();
            
            // Wait for dropdown menu to be visible
            await this.dropdownMenu.locator().waitFor({ state: 'visible', timeout: 5000 });
            
            // Get the Casino Bonus value using composite locator
            const bonusText = await this.bonusFromDropdown.locator().textContent();
            
            return bonusText || '0.00';
            
        } catch {
            return '0.00';
        }
    }

    @step('Get total balance from dropdown')
    public async getTotalFromDropdown(): Promise<string> {
        try {
            // Use shared method to open dropdown only if needed
            await this.openBalanceDropdownAndWaitForMenu();
            
            // Wait for dropdown menu to be visible
            await this.dropdownMenu.locator().waitFor({ state: 'visible', timeout: 5000 });
            
            // Get the Total Balance value using composite locator
            const totalText = await this.totalFromDropdown.locator().textContent();
            
            return totalText || '0.00';
            
        } catch {
            return '0.00';
        }
    }

    // ---------------- New Snapshot & Assertion Utilities ----------------

    /**
     * Normalize a currency string into numeric amount + currency code/symbol.
     * Supports formats like:
     *  - 10.00 CAD
     *  - CAD 10.00
     *  - €10.00
     *  - 10,00 €
     *  - 10.00 (no currency -> defaults to CAD if unspecified)
     */
    private parseCurrencyValue(raw: string): { amount: number; currency: string } {
        const trimmed = (raw || '').trim();
        if (!trimmed) return { amount: 0, currency: 'UNKNOWN' };

        // Replace comma decimal with dot for normalization (e.g., 10,00 €)
        const normalized = trimmed.replace(/,/g, '.');

        // Detect euro symbol
        const euro = /€/.test(normalized);
        // Extract number (first match of digits + optional decimal)
        const numberMatch = normalized.match(/(\d+\.?\d*)/);
        const amount = numberMatch ? parseFloat(numberMatch[1]) : 0;

        // Attempt to detect explicit 3-letter currency code
        const codeMatch = normalized.match(/\b([A-Z]{3})\b/);
    const currency = codeMatch ? codeMatch[1] : (euro ? 'EUR' : 'CAD');

        return { amount, currency };
    }

    /**
     * Take a unified snapshot of wallet balances (dropdown-based to ensure latest values).
     */
    public async snapshot(): Promise<{
        real: number;
        casinoBonus: number;
        sportBonus: number;
        total: number;
        currency: string;
    }> {
        const realRaw = await this.getRealMoneyFromDropdown();
        const bonusRaw = await this.getBonusFromDropdown();
        const totalRaw = await this.getTotalFromDropdown();
        // Sport bonus still from legacy section if needed
        const sportRaw = await this.getSportBonusBalanceValue().catch(() => '0.00');

        const realParsed = this.parseCurrencyValue(realRaw);
        const bonusParsed = this.parseCurrencyValue(bonusRaw);
        const totalParsed = this.parseCurrencyValue(totalRaw);
        const sportParsed = this.parseCurrencyValue(sportRaw);

        // Prefer real currency if non-zero else bonus currency else derived
        const currency = realParsed.amount !== 0 ? realParsed.currency : (bonusParsed.amount !== 0 ? bonusParsed.currency : totalParsed.currency);

        return {
            real: realParsed.amount,
            casinoBonus: bonusParsed.amount,
            sportBonus: sportParsed.amount,
            total: totalParsed.amount,
            currency
        };
    }

    /**
     * Assert balances with optional tolerance. Only provided keys are asserted.
     * Example: await wallet.assertBalances({ casinoBonus: 15, real: 0 }, { tolerance: 0.01 });
     */
    public async assertBalances(
        expected: Partial<{ real: number; casinoBonus: number; sportBonus: number; total: number }>,
        opts: { tolerance?: number } = {}
    ): Promise<void> {
        const { tolerance = 0 } = opts;
        const snap = await this.snapshot();

        await test.step('Assert wallet balances match expected', async () => {
            for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
                const expectedValue = expected[key];
                if (typeof expectedValue !== 'number') continue;
                const actualValue = snap[key];
                const pass = Math.abs(actualValue - expectedValue) <= tolerance;
                expect(pass, `Balance mismatch for ${key}: expected ${expectedValue} ±${tolerance} but got ${actualValue}`).toBe(true);
            }
        });
    }
}
