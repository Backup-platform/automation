import { Page, expect, test } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { BonusCard } from './BonusCard.po';
import { BonusPage } from './BonusPage.po';

// Types for business logic
export type BonusTab = 'active' | 'pending' | 'available';
export type BonusCardStatus = 'wagering' | 'pending' | 'available';

export interface BonusSetupItem {
    comment: string;
    expectedStatus: BonusCardStatus;
}

/**
 * Layer 3: BonusBusiness POM - Business Logic
 * Handles complex bonus operations and business validations
 */
export class BonusBusiness {
    readonly page: Page;
    private readonly bonusCard: BonusCard;
    private readonly bonusPage: BonusPage;

    constructor(bonusCard: BonusCard, bonusPage: BonusPage) {
        this.page = bonusCard.page;
        this.bonusCard = bonusCard;
        this.bonusPage = bonusPage;
    }

    /**
     * Assert a collection of bonuses across tabs without requiring multiple explicit tab calls.
     */
    @step('Assert bonuses match expected matrix')
    public async assertBonuses(expected: Array<{ name: string; status: BonusCardStatus }>): Promise<void> {
        await test.step('Assert bonuses across tabs (matrix)', async () => {
            const byStatus: Record<BonusCardStatus, string[]> = { wagering: [], pending: [], available: [] };
            for (const item of expected) {
                byStatus[item.status].push(item.name);
            }

            // Brief stabilization wait for async UI updates without tab navigation
            await this.page.waitForTimeout(1000);

            if (byStatus.available.length) {
                await this.navigateToTab('available');
                for (const name of byStatus.available) {
                    await this.validateBonusExists(name);
                    await this.validateBonusStatusByName(name, 'available');
                }
            }
            if (byStatus.wagering.length) {
                await this.navigateToTab('active');
                for (const name of byStatus.wagering) {
                    await this.validateBonusExists(name);
                    await this.validateBonusStatusByName(name, 'wagering');
                }
            }
            if (byStatus.pending.length) {
                await this.navigateToTab('pending');
                for (const name of byStatus.pending) {
                    await this.validateBonusExists(name);
                    await this.validateBonusStatusByName(name, 'pending');
                }
            }
        });
    }

    @step('Assert single active bonus')
    public async assertSingleActive(expectedName: string): Promise<void> {
        await test.step(`Assert single active bonus is ${expectedName}`, async () => {
            await this.navigateToTab('active');
            const cardCount = await this.bonusCard.getCardCount();
            let matchIndex: number | null = null;
            for (let i = 0; i < cardCount; i++) {
                const title = await this.bonusCard.getCardTitle(i);
                if (title.includes(expectedName)) {
                    matchIndex = i;
                    break;
                }
            }
            expect(matchIndex, `Expected an active bonus containing "${expectedName}" but none found`).not.toBeNull();
            let wageringCount = 0;
            for (let i = 0; i < cardCount; i++) {
                if (await this.isCardStatus(i, 'wagering')) wageringCount++;
            }
            expect(wageringCount, 'Expected exactly 1 wagering (active) bonus card').toBe(1);
        });
    }

    @step('Assert no active bonus present')
    public async assertNoActiveBonus(): Promise<void> {
        await test.step('Assert there are zero active bonuses', async () => {
            await this.navigateToTab('active');
            const cardCount = await this.bonusCard.getCardCount();
            let wageringCount = 0;
            for (let i = 0; i < cardCount; i++) {
                if (await this.isCardStatus(i, 'wagering')) wageringCount++;
            }
            expect(wageringCount, 'Expected no wagering (active) bonuses').toBe(0);
        });
    }

    // Convenience alias with clearer intent name
    @step('Assert exactly one active bonus by name')
    public async assertExactlyOneActiveBonusIs(expectedName: string): Promise<void> {
        await this.assertSingleActive(expectedName);
    }

    // Complex business operations using test.step for parameter inclusion
    @step('Cancel bonus by name')
    public async cancelBonusByName(bonusName: string, confirmCancel = true): Promise<void> {
        await test.step(`Cancel bonus: ${bonusName}`, async () => {
            // Ensure we are on the Active tab because only wagering bonuses are cancellable
            await this.navigateToTab('active');

            // 1. Find the bonus card by name with expected wagering status
            const cardIndex = await this.findCardByText(bonusName, 'wagering');

            // Use assertion instead of throwing to integrate with Playwright reporting
            expect(cardIndex, `Expected to find an active (wagering) bonus card containing "${bonusName}" on Active tab`).not.toBeNull();
            if (cardIndex === null) return; // Type guard for TS

            await test.step(`Validate bonus '${bonusName}' is in the Active tab`, async () => {
                // Re-assert status explicitly (defensive) and make title intention visible in report
                await this.validateBonusStatusByIndex(cardIndex, 'wagering');
            });
            
            // 2. Click the cancel button to open the dialog
            await this.bonusCard.clickCancelButton(cardIndex);
            
            // 3. Validate the cancel confirmation dialog appears
            await this.bonusCard.validateCancelDialogVisible();
            
            // 4. Either confirm or cancel the cancellation
            if (confirmCancel) {
                await this.bonusCard.clickCancelDialogYes();
                
                // Wait for system to process the cancellation
                await this.page.waitForTimeout(2000);
                
                // Validate dialog closes
                await this.bonusCard.validateCancelDialogNotVisible();

                // Force a reload to ensure UI reflects the removed bonus and reordered queue
                await test.step('Reload page after cancellation to refresh bonus list', async () => {
                    await this.page.reload({ waitUntil: 'domcontentloaded' });
                    await this.page.waitForTimeout(1000);
                });
            } else {
                await this.bonusCard.clickCancelDialogNo();
                
                // Validate dialog closes
                await this.bonusCard.validateCancelDialogNotVisible();
            }
        });
    }

    @step('Cancel bonus by index')
    public async cancelBonusByIndex(cardIndex: number, confirmCancel = true): Promise<void> {
        await test.step(`Cancel bonus at index: ${cardIndex}`, async () => {
            // 1. Click the cancel button to open the dialog
            await this.bonusCard.clickCancelButton(cardIndex);
            
            // 2. Validate the cancel confirmation dialog appears
            await this.bonusCard.validateCancelDialogVisible();
            
            // 3. Either confirm or cancel the cancellation
            if (confirmCancel) {
                await this.bonusCard.clickCancelDialogYes();
                
                // Wait for system to process the cancellation
                await this.page.waitForTimeout(2000);
                
                // Validate dialog closes
                await this.bonusCard.validateCancelDialogNotVisible();
            } else {
                await this.bonusCard.clickCancelDialogNo();
                
                // Validate dialog closes
                await this.bonusCard.validateCancelDialogNotVisible();
            }
        });
    }

    @step('Validate bonus setup across all tabs')
    public async validateBonusSetupAcrossAllTabs(expectedBonuses: BonusSetupItem[]): Promise<void> {
        await test.step('Validate bonus setup across all tabs', async () => {
            // Group bonuses by expected status
            const availableBonuses = expectedBonuses.filter(b => b.expectedStatus === 'available');
            const activeBonuses = expectedBonuses.filter(b => b.expectedStatus === 'wagering');
            const pendingBonuses = expectedBonuses.filter(b => b.expectedStatus === 'pending');

            // Validate available bonuses
            if (availableBonuses.length > 0) {
                await this.navigateToTab('available');
                for (const bonus of availableBonuses) {
                    await this.validateBonusExists(bonus.comment);
                    await this.validateBonusStatusByName(bonus.comment, bonus.expectedStatus);
                }
            }

            // Validate active bonuses
            if (activeBonuses.length > 0) {
                await this.navigateToTab('active');
                for (const bonus of activeBonuses) {
                    await this.validateBonusExists(bonus.comment);
                    await this.validateBonusStatusByName(bonus.comment, bonus.expectedStatus);
                }
            }

            // Validate pending bonuses
            if (pendingBonuses.length > 0) {
                await this.navigateToTab('pending');
                for (const bonus of pendingBonuses) {
                    await this.validateBonusExists(bonus.comment);
                    await this.validateBonusStatusByName(bonus.comment, bonus.expectedStatus);
                }
            }
        });
    }

    @step('Validate bonus exists by name')
    public async validateBonusExists(bonusIdentifier: string, softAssert = false): Promise<void> {
        const cardIndex = await this.findCardByText(bonusIdentifier);
        const assertion = softAssert ? expect.soft : expect;
        await assertion(cardIndex, `Bonus containing "${bonusIdentifier}" should exist but was not found`).not.toBeNull();
    }

    @step('Validate bonus does not exist by name')
    public async validateBonusNotExists(bonusIdentifier: string, softAssert = false): Promise<void> {
        const cardIndex = await this.findCardByText(bonusIdentifier);
        const assertion = softAssert ? expect.soft : expect;
        await assertion(cardIndex, `Bonus containing "${bonusIdentifier}" should NOT exist but was found at index ${cardIndex}`).toBeNull();
    }

    @step('Assert bonus not visible in any tab')
    public async assertBonusNotVisibleAnywhere(bonusIdentifier: string): Promise<void> {
        // Available
        await this.navigateToTab('available');
        await this.validateBonusNotExists(bonusIdentifier);
        // Active
        await this.navigateToTab('active');
        await this.validateBonusNotExists(bonusIdentifier);
        // Pending
        await this.navigateToTab('pending');
        await this.validateBonusNotExists(bonusIdentifier);
    }

    @step('Validate bonus status by name')
    public async validateBonusStatusByName(bonusIdentifier: string, expectedStatus: BonusCardStatus, softAssert = false): Promise<void> {
        const cardIndex = await this.findBonusIndex(bonusIdentifier);
        await this.validateBonusStatusByIndex(cardIndex, expectedStatus, softAssert);
    }

    @step('Validate bonus status by index')
    public async validateBonusStatusByIndex(cardIndex: number, expectedStatus: BonusCardStatus, softAssert = false): Promise<void> {
        // First validate basic card elements
        await this.bonusCard.validateCardBasicsVisible(cardIndex, softAssert);
        
        // Then validate status-specific elements
        switch (expectedStatus) {
            case 'wagering':
                await this.bonusCard.validateWageringCardElements(cardIndex, softAssert);
                break;
            case 'pending':
                await this.bonusCard.validatePendingCardElements(cardIndex, softAssert);
                break;
            case 'available':
                await this.bonusCard.validateAvailableCardElements(cardIndex, softAssert);
                break;
        }
    }

    @step('Validate card count in tab')
    public async validateCardCountInTab(tabToCheck: BonusTab, expectedCount: number): Promise<void> {
        await test.step(`Validate card count in ${tabToCheck} tab: ${expectedCount}`, async () => {
            await this.navigateToTab(tabToCheck);
            const actualCount = await this.bonusCard.getCardCount();
            await expect(actualCount, `Expected ${expectedCount} cards in ${tabToCheck} tab, but found ${actualCount}`).toBe(expectedCount);
        });
    }

    @step('Activate available bonuses')
    public async activateAvailableBonuses(): Promise<void> {
        await this.navigateToTab('available');
        const cardCount = await this.bonusCard.getCardCount();
        
        for (let i = 0; i < cardCount; i++) {
            const isAvailable = await this.isCardAvailable(i);
            if (isAvailable) {
                await this.bonusCard.clickPrimaryButton(i);
                // Wait for activation to process
                await this.page.waitForTimeout(1000);
            }
        }
    }

    // Utility methods (no decorators - internal logic)
    private async navigateToTab(tab: BonusTab): Promise<void> {
        switch (tab) {
            case 'available':
                await this.bonusPage.clickAvailableTab();
                break;
            case 'active':
                await this.bonusPage.clickActiveTab();
                break;
            case 'pending':
                await this.bonusPage.clickPendingTab();
                break;
        }
        // Wait for tab content to load
        await this.page.waitForTimeout(1000);
    }

    private async findCardByText(searchText: string, expectedStatus?: BonusCardStatus): Promise<number | null> {
        const cardCount = await this.bonusCard.getCardCount();
        
        if (cardCount === 0) {
            return null;
        }
        
        // Search through all cards
        for (let i = 0; i < cardCount; i++) {
            try {
                const title = await this.bonusCard.getCardTitle(i);
                const subtitle = await this.bonusCard.getCardSubtitle(i);
                const cardText = `${title} ${subtitle}`.toLowerCase();
                
                if (cardText.includes(searchText.toLowerCase())) {
                    // If status is specified, validate it matches
                    if (expectedStatus) {
                        const isCorrectStatus = await this.isCardStatus(i, expectedStatus);
                        if (isCorrectStatus) {
                            return i;
                        }
                    } else {
                        return i;
                    }
                }
            } catch {
                // Continue searching if this card has issues
                continue;
            }
        }
        
        return null;
    }

    private async findBonusIndex(bonusIdentifier: string): Promise<number> {
        const cardIndex = await this.findCardByText(bonusIdentifier);
        if (cardIndex === null) {
            throw new Error(`Bonus containing "${bonusIdentifier}" not found`);
        }
        return cardIndex;
    }

    private async isCardStatus(cardIndex: number, expectedStatus: BonusCardStatus): Promise<boolean> {
        /**
         * The original implementation used three different accessors that all pointed to the
         * exact same DOM selector (span.bg-dark.text-2xs.font-bold). Because of that every
         * card appeared to satisfy all three status checks, meaning the first matching title
         * was treated as 'wagering'. This broke scenarios where multiple cards share the same
         * title across different statuses (e.g. one wagering + several pending with identical
         * names). The cancel flow then targeted the wrong (pending) card whose cancel button
         * is disabled, causing timeouts.
         *
         * New heuristic:
         *  - wagering: has a progress bar OR an enabled cancel button (and no warning icon requirement)
         *  - pending: has a warning message/icon OR a disabled cancel button and NO progress bar
         *  - available: has a primary action button and NO progress bar and NO warning message
         */
        try {
            const progressBarCount = await this.bonusCard.progressBar(cardIndex).locator().count();
            const enabledCancelCount = await this.bonusCard.enabledCancelButton(cardIndex).locator().count();
            const disabledCancelCount = await this.bonusCard.disabledCancelButton(cardIndex).locator().count();
            const warningMsgCount = await this.bonusCard.warningMessage(cardIndex).locator().count();
            const primaryButtonCount = await this.bonusCard.primaryButton(cardIndex).locator().count();

            switch (expectedStatus) {
                case 'wagering':
                    return (progressBarCount > 0) || (enabledCancelCount > 0 && warningMsgCount === 0);
                case 'pending':
                    return (warningMsgCount > 0) || (disabledCancelCount > 0 && progressBarCount === 0);
                case 'available':
                    return (primaryButtonCount > 0 && progressBarCount === 0 && warningMsgCount === 0);
                default:
                    return false;
            }
        } catch {
            // Swallow and treat as non-match; optional debug could be added if needed.
            return false;
        }
    }

    private async isCardAvailable(cardIndex: number): Promise<boolean> {
        return await this.isCardStatus(cardIndex, 'available');
    }
}
