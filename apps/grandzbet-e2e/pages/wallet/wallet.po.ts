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

    // New locators based on the updated HTML structure
    private readonly balanceDropdownButton = compositeLocator(() =>
        this.page.locator('div[aria-haspopup="menu"]').filter({ has: this.page.locator('span', { hasText: 'Balance' }) }), 'Balance Dropdown Button');

    private readonly balanceDropdownMenu = compositeLocator(() =>
        this.page.locator('[role="menu"][data-state="open"]'), 'Balance Dropdown Menu');

    // Active Bonus Progress Section - identified by having a progress bar (svg) and border-primary
    private readonly activeBonusSection = compositeLocator(() =>
        this.balanceDropdownMenu.locator().locator('div.w-bonusCard').filter({ has: this.page.locator('div.border-primary') }), 'Active Bonus Section');

    private readonly activeBonusTitle = compositeLocator(() =>
        this.activeBonusSection.locator().locator('h4.font-roboto'), 'Active Bonus Title');

    private readonly activeBonusSubtitle = compositeLocator(() =>
        this.activeBonusSection.locator().locator('p.font-rubik.text-large-note').first(), 'Active Bonus Subtitle');

    private readonly activeBonusExpiryDate = compositeLocator(() =>
        this.activeBonusSection.locator().locator('p.font-rubik.text-large-note').nth(1), 'Active Bonus Expiry Date');

    private readonly activeBonusProgressBar = compositeLocator(() =>
        this.activeBonusSection.locator().locator('svg'), 'Active Bonus Progress Bar');

    private readonly activeBonusWageredText = compositeLocator(() =>
        this.activeBonusSection.locator().locator('span.text-primary'), 'Active Bonus Wagered Progress');

    // Current Balance Section - identified by having the deposit button (works with or without active bonus)
    private readonly currentBalanceSection = compositeLocator(() =>
        this.balanceDropdownMenu.locator().locator('div.w-bonusCard').filter({ has: this.page.locator('button.bg-primary') }), 'Current Balance Section');

    private readonly balanceLabelsColumn = compositeLocator(() =>
        this.currentBalanceSection.locator().locator('div.flex.flex-col.gap-0\\.5').first(), 'Balance Labels Column');

    private readonly balanceValuesColumn = compositeLocator(() =>
        this.currentBalanceSection.locator().locator('div.flex.flex-col.gap-0\\.5.items-end'), 'Balance Values Column');

    private readonly realMoneyFromDropdown = compositeLocator(() =>
        this.balanceValuesColumn.locator().locator('span').nth(0), 'Real Money Value from Dropdown');

    private readonly bonusFromDropdown = compositeLocator(() =>
        this.balanceValuesColumn.locator().locator('span').nth(1), 'Casino Bonus Value from Dropdown');

    private readonly sportBonusFromDropdown = compositeLocator(() =>
        this.balanceValuesColumn.locator().locator('span').nth(2), 'Sport Bonus Value from Dropdown');

    private readonly totalFromDropdown = compositeLocator(() =>
        this.balanceValuesColumn.locator().locator('span.text-primary'), 'Total Balance Value from Dropdown');

    private readonly dropdownDepositButton = compositeLocator(() =>
        this.currentBalanceSection.locator().locator('button.bg-primary'), 'Deposit Button from Dropdown');

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
    private async clickBalanceDropdown(): Promise<void> {
        await clickElement(this.balanceDropdownButton);
    }

    private async openBalanceDropdownAndWaitForMenu(): Promise<void> {
        const dataState = await this.balanceDropdownButton.locator().getAttribute('data-state');
        const isDropdownOpen = dataState === 'open';
        
        if (!isDropdownOpen) {
            await this.clickBalanceDropdown();
            await assertVisible(this.balanceDropdownMenu);
        }
    }

    // Get balance from collapsed state (when dropdown is not expanded)
    private async getBalanceFromCollapsed(): Promise<string> {
        return await this.collapsedBalanceValue.locator().textContent() || '0.00';
    }

    private async getRealMoneyFromDropdown(): Promise<string> {
        const realMoneyText = await this.realMoneyFromDropdown.locator().textContent();
        return realMoneyText || '0.00';
    }

    private async getBonusFromDropdown(): Promise<string> {
        const bonusText = await this.bonusFromDropdown.locator().textContent();
        return bonusText || '0.00';
    }

    private async getSportBonusFromDropdown(): Promise<string> {
        const sportBonusText = await this.sportBonusFromDropdown.locator().textContent();
        return sportBonusText || '0.00';
    }

    private async getTotalFromDropdown(): Promise<string> {
        const totalText = await this.totalFromDropdown.locator().textContent();
        return totalText || '0.00';
    }

    // Active Bonus Progress methods
    public async getActiveBonusTitle(): Promise<string> {
        try {
            await this.openBalanceDropdownAndWaitForMenu();
            await this.balanceDropdownMenu.locator().waitFor({ state: 'visible', timeout: 5000 });
            const titleText = await this.activeBonusTitle.locator().textContent();
            return titleText || '';
        } catch {
            return '';
        }
    }

    public async getActiveBonusWageredProgress(): Promise<string> {
        try {
            await this.openBalanceDropdownAndWaitForMenu();
            await this.balanceDropdownMenu.locator().waitFor({ state: 'visible', timeout: 5000 });
            const progressText = await this.activeBonusWageredText.locator().textContent();
            return progressText || '';
        } catch {
            return '';
        }
    }

    public async validateActiveBonusSectionVisible(softAssert = false): Promise<void> {
        await this.openBalanceDropdownAndWaitForMenu();
        await assertVisible(this.activeBonusSection, softAssert);
    }

    public async validateCurrentBalanceSectionVisible(softAssert = false): Promise<void> {
        await this.openBalanceDropdownAndWaitForMenu();
        await assertVisible(this.currentBalanceSection, softAssert);
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
     * Opens dropdown once and reads all balance values efficiently.
     */
    public async getSnapshot(): Promise<{
        real: number;
        casinoBonus: number;
        sportBonus: number;
        total: number;
        currency: string;
    }> {
        return await test.step('Read wallet balances', async () => {
            // Open dropdown once for all balance reads
            await this.openBalanceDropdownAndWaitForMenu();
            
            // Read all values in parallel now that dropdown is open
            const [realRaw, bonusRaw, sportRaw, totalRaw] = await Promise.all([
                this.getRealMoneyFromDropdown(),
                this.getBonusFromDropdown(),
                this.getSportBonusFromDropdown(),
                this.getTotalFromDropdown()
            ]);

            const realParsed = this.parseCurrencyValue(realRaw);
            const bonusParsed = this.parseCurrencyValue(bonusRaw);
            const sportParsed = this.parseCurrencyValue(sportRaw);
            const totalParsed = this.parseCurrencyValue(totalRaw);

            return {
                real: realParsed.amount,
                casinoBonus: bonusParsed.amount,
                sportBonus: sportParsed.amount,
                total: totalParsed.amount,
                currency: realParsed.currency || bonusParsed.currency || 'CAD'
            };
        });
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
        const snap = await this.getSnapshot();

        const expectedStr = Object.entries(expected)
            .map(([k, v]) => `${k}=${v}`)
            .join(', ');
        
        await test.step(`Assert wallet contains: ${expectedStr}`, async () => {
            for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
                const expectedValue = expected[key];
                if (typeof expectedValue !== 'number') continue;
                const actualValue = snap[key];
                const pass = Math.abs(actualValue - expectedValue) <= tolerance;
                expect(pass, `Balance mismatch for ${key}: expected ${expectedValue} ±${tolerance} but got ${actualValue}`).toBe(true);
            }
            
            // Close the dropdown after reading balances to avoid blocking subsequent interactions
            await this.page.keyboard.press('Escape');
        });
    }
}
