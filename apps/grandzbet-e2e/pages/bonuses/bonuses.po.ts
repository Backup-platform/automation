import test, { Page, expect } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';
import { BonusCard } from './bonusCard.po';
import { validateAttributesContaining, validateOnlyOneElementActiveGroup, findFirstElement } from '@test-utils';
import { MenuItems } from '../menu/menuItems.po';
import { ProfileMenu } from '../menu/profileMenu.po';

type BonusTab = 'active' | 'pending' | 'available';
type BonusCardStatus = 'wagering' | 'pending' | 'available';

export class Bonuses {
    readonly page: Page;
    readonly bonusCard: BonusCard;
    readonly menuItems: MenuItems;
    readonly profileMenu: ProfileMenu;

    constructor(page: Page) {
        this.page = page;
        this.bonusCard = new BonusCard(page);
        this.menuItems = new MenuItems(page);
        this.profileMenu = new ProfileMenu(page);
    }

    // Base selectors - complete paths without chaining (container and navigation only)
    private readonly containerSelector = '#profile-myBonuses';
    
    private readonly activeTabAttribute = 'bg-secondary-primary'; // Class indicating active tab
    private readonly inactiveTabAttribute = 'text-white'; // Base text color for inactive tabs
    
    // Tab selector for the new button-based tabs
    private readonly tabSelector = '#profile-myBonuses div.flex.gap-4 button';

    // Container
    private readonly bonusesContainer = compositeLocator(() => this.page.locator(this.containerSelector), 'My Bonuses container');

    // Header elements
    private readonly pageTitle = compositeLocator(() => this.page.locator('#profile-myBonuses h3.font-roboto.text-2xl.font-bold'), 'My Bonuses title');

    // Filter tabs (order: Available, Active, Pending - no "All" tab anymore)
    private readonly availableTabButton = compositeLocator(() => this.page.locator(this.tabSelector).nth(0), 'Available tab');
    private readonly activeTabButton = compositeLocator(() => this.page.locator(this.tabSelector).nth(1), 'Active tab');
    private readonly pendingTabButton = compositeLocator(() => this.page.locator(this.tabSelector).nth(2), 'Pending tab');

    private readonly bonusTabs = [
            this.availableTabButton,
            this.activeTabButton, 
            this.pendingTabButton
    ];  

    // Actions
    @step('Navigate to My Bonuses page')
    public async navigateToMyBonuses(): Promise<void> {
        await this.menuItems.clickMyProfileButton();
        await this.profileMenu.clickMyBonusesButton();
    }

    public clickAvailableTab = async (softAssert = false) => {
        await clickElement(this.availableTabButton);
        await validateOnlyOneElementActiveGroup(this.bonusTabs, 0,
            { class: this.activeTabAttribute }, softAssert, 'Available tab');
        await validateAttributesContaining(this.activeTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributesContaining(this.pendingTabButton, { class: this.inactiveTabAttribute }, softAssert);
    };

    public clickActiveTab = async (softAssert = false) => {
        await clickElement(this.activeTabButton);
        await validateOnlyOneElementActiveGroup(this.bonusTabs, 1,
            { class: this.activeTabAttribute }, softAssert, 'Active tab');
        await validateAttributesContaining(this.availableTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributesContaining(this.pendingTabButton, { class: this.inactiveTabAttribute }, softAssert);
    };

    public clickPendingTab = async (softAssert = false) => {
        await clickElement(this.pendingTabButton);
        await validateOnlyOneElementActiveGroup(this.bonusTabs, 2,
            { class: this.activeTabAttribute }, softAssert, 'Pending tab');
        await validateAttributesContaining(this.availableTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributesContaining(this.activeTabButton, { class: this.inactiveTabAttribute }, softAssert);
    };

    @step('Validate My Bonuses page navigation elements are visible')
    public async validatePageElementsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.bonusesContainer, softAssert);
        await assertVisible(this.pageTitle, softAssert);
        await assertVisible(this.availableTabButton, softAssert);
        await assertVisible(this.activeTabButton, softAssert);
        await assertVisible(this.pendingTabButton, softAssert);
    }

    @step('Validate All tab content - bonus cards and details')
    public async validateAllTabContent(softAssert = false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        await this.performActionOnCardsByStatus('wagering', async (i) => {
            await this.bonusCard.validateCardBasics(i);
            await this.bonusCard.validateWageringCard(i, softAssert);
        });

        await this.performActionOnCardsByStatus('pending', async (i) => {
            await this.bonusCard.validateCardBasics(i);
            await this.bonusCard.validatePendingCard(i, softAssert);
        });
                
        await this.performActionOnCardsByStatus('available', async (i) => {
            await this.bonusCard.validateCardBasics(i);
            await this.bonusCard.validateAvailableCard(i, softAssert);
        });
    }

    @step('Validate Active tab content - active bonus cards')
    public async validateActiveTabContent(softAssert = false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        await this.performActionOnCardsByStatus('wagering', async (i) => {
            await this.bonusCard.validateCardBasics(i);
            await this.bonusCard.validateWageringCard(i, softAssert);
        });
    }

    @step('Validate Pending tab content - pending bonus cards')
    public async validatePendingTabContent(softAssert = false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        await this.performActionOnCardsByStatus('pending', async (i) => {
            await this.bonusCard.validateCardBasics(i);
            await this.bonusCard.validatePendingCard(i, softAssert);
        });
    }

    @step('Validate Available tab content - available bonus cards')
    public async validateAvailableTabContent(softAssert = false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        await this.performActionOnCardsByStatus('available', async (i) => {
            await this.bonusCard.validateCardBasics(i);
            await this.bonusCard.validateAvailableCard(i, softAssert );
        });
    }

    // Generic method to find the first card that matches a condition
    @step('Find first card matching condition')
    public async findFirstCard(condition: (cardIndex: number) => Promise<boolean>): Promise<number | null> {
        let foundIndex: number | null = null;
        
        await this.forEachCardWhere(
            condition,
            async (i) => {
                foundIndex = i;
                throw new Error('FOUND'); // Early exit mechanism
            },
            false // Don't continue on error - we want to stop when found
        ).catch(error => {
            // If error message is 'FOUND', it means we found the card
            if (error.message !== 'FOUND') {
                throw error; // Re-throw if it's a real error
            }
        });
        
        return foundIndex;
    }

    // Generic method to loop through all cards with a callback function
    @step('Loop through all bonus cards')
    public async forEachCard(callback: (cardIndex: number) => Promise<void>): Promise<void> {
        await this.forEachCardWhere(
            async () => true, // Always execute for all cards
            callback
        );
    }

    // Generic method to loop through cards with conditional logic and error handling
    @step('Loop through cards with condition')
    public async forEachCardWhere(
        condition: (cardIndex: number) => Promise<boolean>,
        action: (cardIndex: number) => Promise<void>,
        continueOnError = true
    ): Promise<void> {
        const cardCount = await this.bonusCard.getCardCount();
        
        for (let i = 0; i < cardCount; i++) {
            try {
                if (await condition(i)) {
                    await action(i);
                }
            } catch (error) {
                if (!continueOnError) {
                    throw error;
                }
                console.warn(`Error processing card ${i + 1}: ${error}`);
            }
        }
    }

    // Helper method for performing actions on cards with specific status
    @step('Perform action on cards by status')
    public async performActionOnCardsByStatus(
        status: 'available' | 'wagering' | 'pending',
        action: (cardIndex: number) => Promise<void>,
        continueOnError = true
    ): Promise<void> {
        await this.forEachCardWhere(
            async (i) => {
                // Check if card matches the expected status by checking if the status element exists
                const statusElement = status === 'wagering' ? this.bonusCard.wageringStatus(i) :
                                    status === 'pending' ? this.bonusCard.pendingStatus(i) :
                                    this.bonusCard.availableStatus(i);
                
                const count = await statusElement.locator().count();
                return count > 0;
            },
            action,
            continueOnError
        );
    }

    @step('Click activate on bonus cards by name')
    public async clickActivateByName(bonusNames: string[]): Promise<void> {
        // Use the unified findFirstElement to find cards by any of the provided names
        let cardIndex: number | null = null;
        
        for (const bonusName of bonusNames) {
            cardIndex = await findFirstElement(this.bonusCard.bonusCards, {
                searchType: 'callback',
                getTextCallback: async (index: number) => {
                    return await this.bonusCard.getCardText(index, 'title');
                },
                searchText: bonusName,
                matchType: 'contains'
            });
            
            if (cardIndex !== null) {
                break; // Found a match, stop searching
            }
        }

        if (cardIndex !== null) {
            await this.bonusCard.clickPrimaryButton(cardIndex);
        } else {
            throw new Error(`Bonus with names "${bonusNames.join(', ')}" not found, 
                setup might be incorrect or 
                with the locators might not be working as expected.`);
        }
    }

    // Example: Find and click deposit on all available cards
    @step('Click deposit on all available bonus cards')
    public async clickDepositOnAvailableCards(): Promise<void> {
        await this.performActionOnCardsByStatus('available', async (i) => {
            await this.bonusCard.clickPrimaryButton(i);
        });
    }

    // Additional helper methods using performActionOnCardsByStatus

    @step('Click activate on all available bonus cards')
    public async clickActivateOnAvailableCards(): Promise<void> {
        await this.performActionOnCardsByStatus('available', async (i) => {
            await this.bonusCard.clickPrimaryButton(i);
        });
    }

    @step('Click cancel on all active bonus cards')
    public async clickCancelOnActiveCards(): Promise<void> {
        await this.performActionOnCardsByStatus('wagering', async (i) => {
            await this.bonusCard.clickCancelBonusButton(i);
        });
    }

    @step('Cancel bonus by name with confirmation')
    public async cancelBonusByName(bonusName: string, confirmCancel = true): Promise<void> {
        // 1. Find the bonus card by name
        const cardIndex = await this.findCardByText(bonusName, 'wagering');
        
        if (cardIndex === null) {
            throw new Error(`Could not find active bonus card with name: "${bonusName}"`);
        }
        
        // 2. Click the cancel button to open the dialog
        await this.bonusCard.clickCancelBonusButton(cardIndex);
        
        // 3. Validate the cancel confirmation dialog appears
        await this.bonusCard.validateCancelDialog();
        
        // 4. Either confirm or cancel the cancellation
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
    }

    @step('Cancel bonus by index with confirmation')
    public async cancelBonusByIndex(cardIndex: number, confirmCancel = true): Promise<void> {
        // 1. Click the cancel button to open the dialog
        await this.bonusCard.clickCancelBonusButton(cardIndex);
        
        // 2. Validate the cancel confirmation dialog appears
        await this.bonusCard.validateCancelDialog();
        
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
    }

    @step('Validate all active cards basic elements')
    public async validateActiveCardsBasics(softAssert = false): Promise<void> {
        await this.performActionOnCardsByStatus('wagering', async (i) => {
            await this.bonusCard.validateCardBasics(i, softAssert);
        });
    }

    @step('Validate all pending cards basic elements')
    public async validatePendingCardsBasics(softAssert = false): Promise<void> {
        await this.performActionOnCardsByStatus('pending', async (i) => {
            await this.bonusCard.validateCardBasics(i, softAssert);
        });
    }

    @step('Validate all available cards basic elements')
    public async validateAvailableCardsBasics(softAssert = false): Promise<void> {
        await this.performActionOnCardsByStatus('available', async (i) => {
            await this.bonusCard.validateCardBasics(i, softAssert);
        });
    }

    // NEW VALIDATION METHODS FOR BONUS TESTING

    private async navigateToTab(tabToNavigate: BonusTab): Promise<void> {
        await test.step(`Navigate to ${tabToNavigate} tab`, async () => {
            const tabActions = {
                active: this.clickActiveTab,
                pending: this.clickPendingTab,
                available: this.clickAvailableTab
            } as const;
        
            await tabActions[tabToNavigate]();
        });
    }

    @step('Validate exact card count (assumes correct tab is already active)')
    private async validateCardCount(expectedCount: number): Promise<void> {
        const actualCount = await this.bonusCard.getCardCount();
        await expect(actualCount, `Expected ${expectedCount} cards, but found ${actualCount}`).toBe(expectedCount);
    }

    @step('Validate exact card count in specified tab')
    public async validateCardCountInTab(cardTabToCheck: BonusTab, expectedCount: number): Promise<void> {
        await test.step(`Validate exact card count in ${cardTabToCheck} tab`, async () => {
            await this.navigateToTab(cardTabToCheck);
            await this.validateCardCount(expectedCount);
        });
    }

    @step('Find card index by partial title/subtitle match and status')
    public async findCardByText(searchText: string, expectedStatus?: 'wagering' | 'pending' | 'available'): Promise<number | null> {
        const cardCount = await this.bonusCard.getCardCount();
        
        if (cardCount === 0) {
            return null;
        }
        
        // Debug: Log all cards when searching
        if (expectedStatus) {
            console.log(`\n🔍 Searching for: "${searchText}" with status: "${expectedStatus}"`);
            console.log(`📊 Total cards found: ${cardCount}`);
            
            for (let j = 0; j < cardCount; j++) {
                try {
                    const cardTitle = await this.bonusCard.cardTitle(j).locator().textContent();
                    const statusText = await this.bonusCard.bonusStatus(j).locator().textContent();
                    console.log(`  Card ${j}: "${cardTitle}" - Status: "${statusText}"`);
                } catch {
                    console.log(`  Card ${j}: Error reading card`);
                }
            }
        }
        
        // Search the full text content of each card
        for (let i = 0; i < cardCount; i++) {
            try {
                const cardText = await this.bonusCard.bonusCards.locator().nth(i).textContent();
                if (cardText && cardText.includes(searchText)) {
                    // If no expected status specified, return first match (backward compatibility)
                    if (!expectedStatus) {
                        return i;
                    }
                    
                    // Check if the card's status matches the expected status
                    const statusElement = this.bonusCard.bonusStatus(i);
                    const statusText = await statusElement.locator().textContent();
                    
                    if (statusText) {
                        const normalizedStatus = statusText.toLowerCase().trim();
                        const normalizedExpected = expectedStatus.toLowerCase().trim();
                        
                        // Handle status text matching with different variations
                        const statusMatches = 
                            normalizedStatus.includes(normalizedExpected) ||
                            (normalizedExpected === 'wagering' && normalizedStatus.includes('wagering')) ||
                            (normalizedExpected === 'pending' && normalizedStatus.includes('pending')) ||
                            (normalizedExpected === 'available' && normalizedStatus.includes('available'));
                        
                        if (statusMatches) {
                            return i;
                        }
                    }
                }
            } catch {
                // Skip cards that can't be read
                continue;
            }
        }
        
        return null;
    }

    @step('Validate bonus exists by name/text')
    public async validateBonusExists(bonusIdentifier: string, softAssert = false): Promise<void> {
        const cardIndex = await this.findCardByText(bonusIdentifier);
        const assertion = softAssert ? expect.soft : expect;
        await assertion(cardIndex, `Bonus containing "${bonusIdentifier}" should exist but was not found`).not.toBeNull();
    }

    @step('Find bonus card index by name/text')
    public async findBonusIndex(bonusIdentifier: string): Promise<number> {
        const cardIndex = await this.findCardByText(bonusIdentifier);
        if (cardIndex === null) {
            throw new Error(`Bonus containing "${bonusIdentifier}" was not found`);
        }
        return cardIndex;
    }

    @step('Validate bonus does NOT exist by name/text')
    public async validateBonusNotExists(bonusIdentifier: string, softAssert = false): Promise<void> {
        const cardIndex = await this.findCardByText(bonusIdentifier);
        const assertion = softAssert ? expect.soft : expect;
        await assertion(cardIndex, `Bonus containing "${bonusIdentifier}" should NOT exist but was found at index ${cardIndex}`).toBeNull();
    }

    @step('Validate bonus status by card index')
    public async validateBonusStatusByIndex(cardIndex: number, expectedStatus: BonusCardStatus, softAssert = false): Promise<void> {
        // Delegate directly to the appropriate BonusCard validation method
        const statusValidations = {
            wagering: () => this.bonusCard.validateWageringCard(cardIndex, softAssert),
            pending: () => this.bonusCard.validatePendingCard(cardIndex, softAssert),
            available: () => this.bonusCard.validateAvailableCard(cardIndex, softAssert)
        } as const;

        await statusValidations[expectedStatus]();
    }

    @step('Validate bonus status by name')
    public async validateBonusStatusByName(bonusIdentifier: string, expectedStatus: BonusCardStatus, softAssert = false): Promise<void> {
        const cardIndex = await this.findBonusIndex(bonusIdentifier);
        await this.validateBonusStatusByIndex(cardIndex, expectedStatus, softAssert);
    }

    @step('Validate complete bonus setup with expected statuses')
    public async validateBonusSetup(
        tabToNavigate: BonusTab, 
        expectedBonuses: Array<{ comment: string; expectedStatus: BonusCardStatus }>
    ): Promise<void> {
        await test.step('Validate bonus setup', async () => {
            // Step 1: Navigate to specified tab
            await this.navigateToTab(tabToNavigate);

            // Step 2: Validate total card count matches expected bonuses
            await this.validateCardCount(expectedBonuses.length);
            
            // Step 3: Validate each individual bonus exists and has correct elements
            for (const expectedBonus of expectedBonuses) {
                // Search for the card using both text and expected status for disambiguation
                const cardIndex = await this.findCardByText(expectedBonus.comment, expectedBonus.expectedStatus);
                
                // Hard assertion - setup must be correct
                await expect(cardIndex, `Bonus containing "${expectedBonus.comment}" with status "${expectedBonus.expectedStatus}" should exist but was not found`).not.toBeNull();
                
                // At this point cardIndex is guaranteed to be non-null (hard assertion passed)
                const validCardIndex = cardIndex as number;
                
                // Step 3.1: Validate basic card elements are present
                await this.bonusCard.validateCardBasics(validCardIndex);
                
                // Step 3.2: Validate card elements based on expected status
                const statusValidations = {
                    wagering: () => this.bonusCard.validateWageringCard(validCardIndex),
                    pending: () => this.bonusCard.validatePendingCard(validCardIndex),
                    available: () => this.bonusCard.validateAvailableCard(validCardIndex)
                } as const;

                await statusValidations[expectedBonus.expectedStatus]();
            }
        });
    }

    @step('Validate multiple bonuses exist with specific statuses')
    public async validateBonusesWithStatuses(
        bonusValidations: Array<{ comment: string; expectedStatus: BonusCardStatus }>,
        softAssert = false
    ): Promise<void> {
        for (const validation of bonusValidations) {
            await this.validateBonusStatusByName(validation.comment, validation.expectedStatus, softAssert);
        }
    }

    @step('Validate bonuses exist by comments')
    public async validateBonusesExist(bonusComments: string[], softAssert = false): Promise<void> {
        for (const comment of bonusComments) {
            await this.validateBonusExists(comment, softAssert);
        }
    }

    @step('Validate bonuses do not exist by comments')
    public async validateBonusesNotExist(bonusComments: string[], softAssert = false): Promise<void> {
        for (const comment of bonusComments) {
            await this.validateBonusNotExists(comment, softAssert);
        }
    }

    @step('Validate active bonus became pending after zero out')
    public async validateBonusTransition(
        activeBonus: { comment: string },
        pendingBonus: { comment: string },
        softAssert = false
    ): Promise<void> {
        // Validate the originally active bonus is no longer visible
        await this.validateBonusNotExists(activeBonus.comment, softAssert);
        
        // Validate the originally pending bonus is now active (wagering status)
        await this.validateBonusStatusByName(pendingBonus.comment, 'wagering', softAssert);
    }

    @step('Validate complete bonus setup across all tabs (replacement for All tab)')
    public async validateBonusSetupAcrossAllTabs(
        expectedBonuses: Array<{ comment: string; expectedStatus: BonusCardStatus }>
    ): Promise<void> {
        await test.step('Validate bonus setup across all tabs', async () => {
            // Group expected bonuses by their status to know which tab to check
            const bonusesByTab = {
                available: expectedBonuses.filter(b => b.expectedStatus === 'available'),
                active: expectedBonuses.filter(b => b.expectedStatus === 'wagering'),
                pending: expectedBonuses.filter(b => b.expectedStatus === 'pending')
            };

            // Validate bonuses in each tab
            for (const [tabName, bonusesInTab] of Object.entries(bonusesByTab)) {
                if (bonusesInTab.length > 0) {
                    await this.validateBonusSetup(tabName as BonusTab, bonusesInTab);
                }
            }

            // Also validate total count across all tabs
            let totalFoundBonuses = 0;
            for (const tab of ['available', 'active', 'pending'] as const) {
                await this.navigateToTab(tab);
                const cardCount = await this.bonusCard.getCardCount();
                totalFoundBonuses += cardCount;
            }

            await expect(totalFoundBonuses, 
                `Expected ${expectedBonuses.length} bonuses total across all tabs, but found ${totalFoundBonuses}`
            ).toBe(expectedBonuses.length);
        });
    }
}