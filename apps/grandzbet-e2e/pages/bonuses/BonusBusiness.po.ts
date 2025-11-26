import { Page, expect, test } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { BonusCard } from './BonusCard.po';
import { BonusPage } from './BonusPage.po';
import type { BonusCardStatus, BonusTab } from './types';
import { refreshBonusPage } from './bonusTestUtilities';
import { BonusApiClient } from '@sbt-monorepo/page-objects/api/bonus/bonusApi';
import { AleaApiClient, PaymentIqApiClient } from '@sbt-monorepo/page-objects';

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
    private readonly bonusApi: BonusApiClient;
    private readonly aleaApi: AleaApiClient;
    private readonly paymentIqApi: PaymentIqApiClient;

    constructor(bonusCard: BonusCard, bonusPage: BonusPage, bonusApi: BonusApiClient, aleaApi: AleaApiClient, paymentIqApi: PaymentIqApiClient) {
        this.page = bonusCard.page;
        this.bonusCard = bonusCard;
        this.bonusPage = bonusPage;
        this.bonusApi = bonusApi;
        this.aleaApi= aleaApi;
        this.paymentIqApi = paymentIqApi;
    }

    public async assertBonuses(expected: Array<{ name: string; status: BonusCardStatus }>): Promise<void> {
        await test.step(`Assert ${expected.length} bonus(es) match expected matrix`, async () => {
            const byStatus: Record<BonusCardStatus, string[]> = { wagering: [], pending: [], available: [] };
            for (const item of expected) {
                byStatus[item.status].push(item.name);
            }

            await this.page.waitForLoadState('load');

            await this.validateBonusesAcrossTabs(
                {
                    available: byStatus.available,
                    active: byStatus.wagering,
                    pending: byStatus.pending
                },
                async (name: string, status: BonusCardStatus) => {
                    await this.validateBonusComplete(name, status);
                }
            );
        });
    }

    public async assertSingleActive(expectedName: string): Promise<void> {
        await test.step(`Assert single active bonus: "${expectedName}"`, async () => {
            await this.navigateToTab('active');
            
            const wageringCards = this.bonusPage.cardsInActiveTab;
            await expect(wageringCards.locator(), 'Expected exactly 1 active bonus').toHaveCount(1);
            await this.validateBonusComplete(expectedName, 'wagering');
        });
    }

    public async assertNoActiveBonus(): Promise<void> {
        await test.step('Assert there are zero active bonuses', async () => {
            await this.navigateToTab('active');
            
            const wageringCards = this.bonusPage.cardsInActiveTab;
            await expect(wageringCards.locator(), 'Expected no wagering (active) bonuses').toHaveCount(0);
        });
    }

    public async cancelBonusByName(bonusName: string, confirmCancel = true): Promise<void> {
        await test.step(`Cancel bonus: ${bonusName}`, async () => {
            await this.navigateToTab('active');

            const cardIndex = await this.findCardIndexByText(bonusName, 'wagering');
            expect(cardIndex, `Expected to find an active (wagering) bonus card containing "${bonusName}" on Active tab`).not.toBeNull();
            const validCardIndex = cardIndex as number;

            await this.bonusCard.validateCardBasicsVisible(validCardIndex);
            await this.bonusCard.validateCardWithStatus(validCardIndex, 'wagering');
            
            await this.bonusCard.clickCancelButton(validCardIndex);
            await this.bonusCard.validateCancelDialogVisible();
            
            if (confirmCancel) {
                await this.bonusCard.clickCancelDialogYes();
                await this.bonusCard.validateCancelDialogNotVisible();
                await this.bonusPage.refresh();
            } else {
                await this.bonusCard.clickCancelDialogNo();
                await this.bonusCard.validateCancelDialogNotVisible();
            }
        });
    }

    public async cancelBonusByIndex(cardIndex: number, confirmCancel = true): Promise<void> {
        await test.step(`Cancel bonus at index ${cardIndex}`, async () => {
            await this.bonusCard.clickCancelButton(cardIndex);
            await this.bonusCard.validateCancelDialogVisible();
            
            if (confirmCancel) {
                await this.bonusCard.clickCancelDialogYes();
                await this.bonusCard.validateCancelDialogNotVisible();
            } else {
                await this.bonusCard.clickCancelDialogNo();
                await this.bonusCard.validateCancelDialogNotVisible();
            }
        });
    }

    public async validateBonusSetupAcrossAllTabs(expectedBonuses: BonusSetupItem[]): Promise<void> {
        await test.step(`Validate ${expectedBonuses.length} bonus(es) across all tabs`, async () => {
            const availableBonuses = expectedBonuses.filter(b => b.expectedStatus === 'available');
            const activeBonuses = expectedBonuses.filter(b => b.expectedStatus === 'wagering');
            const pendingBonuses = expectedBonuses.filter(b => b.expectedStatus === 'pending');

            await this.validateBonusesAcrossTabs(
                {
                    available: availableBonuses.map(b => b.comment),
                    active: activeBonuses.map(b => b.comment),
                    pending: pendingBonuses.map(b => b.comment)
                },
                async (name: string, status: BonusCardStatus) => {
                    await this.validateBonusComplete(name, status);
                }
            );
        });
    }

    public async validateBonusExists(bonusIdentifier: string, softAssert = false): Promise<void> {
        await test.step(`Validate bonus exists: "${bonusIdentifier}"`, async () => {
            const cardIndex = await this.findCardIndexByText(bonusIdentifier);
            const assertion = softAssert ? expect.soft : expect;
            await assertion(cardIndex, `Bonus containing "${bonusIdentifier}" not found`).not.toBeNull();
        });
    }

    public async validateBonusComplete(bonusIdentifier: string, expectedStatus: BonusCardStatus, softAssert = false): Promise<void> {
        await test.step(`Validate bonus complete: "${bonusIdentifier}" (status: ${expectedStatus})`, async () => {
            const cardIndex = await this.findBonusIndex(bonusIdentifier);
            await this.bonusCard.validateCardBasicsVisible(cardIndex, softAssert);
            await this.bonusCard.validateCardWithStatus(cardIndex, expectedStatus, softAssert);
        });
    }

    public async validateBonusNotExists(bonusIdentifier: string, softAssert = false): Promise<void> {
        await test.step(`Validate bonus does NOT exist: "${bonusIdentifier}"`, async () => {
            const cardIndex = await this.findCardIndexByText(bonusIdentifier);
            const assertion = softAssert ? expect.soft : expect;
            await assertion(cardIndex, `Bonus containing "${bonusIdentifier}" found at index ${cardIndex}, but should not exist`).toBeNull();
        });
    }

    public async assertBonusNotVisibleAnywhere(bonusIdentifier: string): Promise<void> {
        await test.step(`Assert bonus "${bonusIdentifier}" not visible in any tab`, async () => {
            await this.navigateToTab('available');
            await this.validateBonusNotExists(bonusIdentifier);

            await this.navigateToTab('active');
            await this.validateBonusNotExists(bonusIdentifier);

            await this.navigateToTab('pending');
            await this.validateBonusNotExists(bonusIdentifier);
        });
    }

    public async validateCardCountInTab(tabToCheck: BonusTab, expectedCount: number): Promise<void> {
        await test.step(`Validate ${tabToCheck} tab has ${expectedCount} card(s)`, async () => {
            await this.navigateToTab(tabToCheck);
            
            const cardsInTab = this.bonusPage.getCardsInTab(tabToCheck);
            const actualCount = await cardsInTab.locator().count();
            
            await expect(actualCount, `Expected ${expectedCount} cards in ${tabToCheck} tab, but found ${actualCount}`).toBe(expectedCount);
        });
    }

    @step('Activate available bonuses')
    public async activateAvailableBonuses(): Promise<void> {
        await this.navigateToTab('available');
        const cardCount = await this.bonusCard.getCardCount();
        
        for (let i = 0; i < cardCount; i++) {
            const isAvailable = await this.isCardStatus(i, 'available');
            if (isAvailable) {
                await this.bonusCard.clickPrimaryButton(i);
                await this.page.waitForLoadState('load');
            }
        }
    }

    private async navigateToTab(tab: BonusTab): Promise<void> {
        await test.step(`Navigate to ${tab} tab`, async () => {
            await this.bonusPage.clickTab(tab);
        });
    }

    private async findCardIndexByText(searchText: string, expectedStatus?: BonusCardStatus): Promise<number | null> {
        return await test.step(`Find card by text: "${searchText}"${expectedStatus ? ` (status: ${expectedStatus})` : ''}`, async () => {
            const allCards = this.bonusCard.bonusCards;
            const cardCount = await allCards.locator().count();
            
            // If no cards exist, return null (bonus not found)
            if (cardCount === 0) {
                return null;
            }
            
            const matchingCard = allCards.locator().filter({ hasText: new RegExp(searchText, 'i') });
            const matchCount = await matchingCard.count();
            
            if (matchCount === 0) {
                return null;
            }
            
            if (expectedStatus) {
                for (let i = 0; i < cardCount; i++) {
                    const title = await this.bonusCard.getCardTitle(i);
                    const subtitle = await this.bonusCard.getCardSubtitle(i);
                    const cardText = `${title} ${subtitle}`.toLowerCase();
                    
                    if (cardText.includes(searchText.toLowerCase())) {
                        const isCorrectStatus = await this.isCardStatus(i, expectedStatus);
                        if (isCorrectStatus) {
                            return i;
                        }
                    }
                }
                return null;
            }
            
            const firstMatchText = await matchingCard.first().textContent();
            for (let i = 0; i < cardCount; i++) {
                const cardText = await allCards.locator().nth(i).textContent();
                if (cardText === firstMatchText) {
                    return i;
                }
            }
            
            return null;
        });
    }

    private async findBonusIndex(bonusIdentifier: string): Promise<number> {
        const cardIndex = await this.findCardIndexByText(bonusIdentifier);
        expect(cardIndex, `Expected to find bonus containing "${bonusIdentifier}"`).not.toBeNull();
        return cardIndex as number;
    }

    private async isCardStatus(cardIndex: number, expectedStatus: BonusCardStatus): Promise<boolean> {
        const meta = await this.bonusCard.getCardMeta(cardIndex);

        switch (expectedStatus) {
            case 'wagering':
                return meta.hasProgress || (meta.hasEnabledCancel && !meta.hasWarning);
            case 'pending':
                return meta.hasWarning || (meta.hasDisabledCancel && !meta.hasProgress);
            case 'available':
                return meta.primaryEnabled && !meta.hasProgress && !meta.hasWarning;
            default:
                throw new Error(`Unknown bonus card status: "${expectedStatus}"`);
        }
    }

    private async validateBonusesAcrossTabs(
        bonusesByTab: { available: string[]; active: string[]; pending: string[] },
        validateBonus: (bonusName: string, status: BonusCardStatus) => Promise<void>
    ): Promise<void> {
        const groupedByStatus: Record<BonusCardStatus, string[]> = {
            available: bonusesByTab.available,
            wagering: bonusesByTab.active,
            pending: bonusesByTab.pending
        };

        for (const [status, names] of Object.entries(groupedByStatus) as Array<[BonusCardStatus, string[]]>) {
            if (!names.length) {
                continue;
            }

            await this.bonusPage.syncTab(status);
            for (const name of names) {
                await validateBonus(name, status);
            }
        }
    }

    public async setupAndActivateBonus({ testData, scenario, waitTime = 3000
    }: { testData: any, scenario: any, waitTime?: number
    }) {
        await test.step('Setup: Grant and activate bonus', async () => {
            const bonusArray = Array.isArray(scenario) ? scenario : [scenario];
            await this.bonusApi.setupBonusQueue(testData, bonusArray, {
                aleaApi: this.aleaApi,
                paymentIqApi: this.paymentIqApi,
                waitTime
            });
            await refreshBonusPage(this.bonusPage);
        });
    }
}
