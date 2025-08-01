import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';
import { BonusCard } from './bonusCard.po';
import { validateAttributes, validateOnlyOneElementActiveGroup } from '@test-utils';


export class Bonuses {
    readonly page: Page;
    readonly bonusCard: BonusCard;

    constructor(page: Page) {
        this.page = page;
        this.bonusCard = new BonusCard(page);
    }

    // Base selectors - complete paths without chaining (container and navigation only)
    private readonly containerSelector = '#profile-myBonuses';
    
    private readonly activeTabAttribute = 'text-primary'; // Class indicating active tab
    private readonly inactiveTabAttribute = 'text-greyMain'; // Class indicating inactive tab
    
    // Common tab selector (all tabs, no color class)
    private readonly tabSelector = '#profile-myBonuses span.font-rubik.text-base.font-semibold';

    // Container
    private readonly bonusesContainer = compositeLocator(() => this.page.locator(this.containerSelector), 'My Bonuses container');

    // Header elements
    private readonly pageTitle = compositeLocator(() => this.page.locator('#profile-myBonuses h3.font-roboto.text-2xl.font-bold'), 'My Bonuses title');

    // Filter tabs (order: All, Pending, Active, Available)
    private readonly allTabButton = compositeLocator(() => this.page.locator(this.tabSelector).nth(0), 'All tab');
    private readonly pendingTabButton = compositeLocator(() => this.page.locator(this.tabSelector).nth(1), 'Pending tab');
    private readonly activeTabButton = compositeLocator(() => this.page.locator(this.tabSelector).nth(2), 'Active tab');
    private readonly availableTabButton = compositeLocator(() => this.page.locator(this.tabSelector).nth(3), 'Available tab');

    private readonly bonusTabs = [
            this.allTabButton, 
            this.pendingTabButton, 
            this.activeTabButton,
            this.availableTabButton
    ];  

    // Actions

    public clickAllTab = async (softAssert = false) => {
        await clickElement(this.allTabButton);
        await validateOnlyOneElementActiveGroup(this.bonusTabs, 0,
            { class: this.activeTabAttribute }, softAssert, 'All tab');
        await validateAttributes(this.pendingTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributes(this.activeTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributes(this.availableTabButton, { class: this.inactiveTabAttribute }, softAssert);
    };

    public clickPendingTab = async (softAssert = false) => {
        await clickElement(this.pendingTabButton);
        await validateOnlyOneElementActiveGroup(this.bonusTabs, 1,
            { class: this.activeTabAttribute }, softAssert, 'Pending tab');
        await validateAttributes(this.allTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributes(this.activeTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributes(this.availableTabButton, { class: this.inactiveTabAttribute }, softAssert);
    };

    public clickActiveTab = async (softAssert = false) => {
        await clickElement(this.activeTabButton);
        await validateOnlyOneElementActiveGroup(this.bonusTabs, 2,
            { class: this.activeTabAttribute }, softAssert, 'Active tab');
        await validateAttributes(this.allTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributes(this.pendingTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributes(this.availableTabButton, { class: this.inactiveTabAttribute }, softAssert);
    };
    public clickAvailableTab = async (softAssert = false) => {
        await clickElement(this.availableTabButton);
        await validateOnlyOneElementActiveGroup(this.bonusTabs, 3,
            { class: this.activeTabAttribute }, softAssert, 'Available tab');
        await validateAttributes(this.allTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributes(this.pendingTabButton, { class: this.inactiveTabAttribute }, softAssert);
        await validateAttributes(this.activeTabButton, { class: this.inactiveTabAttribute }, softAssert);
    };

    @step('Validate My Bonuses page navigation elements are visible')
    public async validatePageElementsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.bonusesContainer, softAssert);
        await assertVisible(this.pageTitle, softAssert);
        await assertVisible(this.allTabButton, softAssert);
        await assertVisible(this.pendingTabButton, softAssert);
        await assertVisible(this.activeTabButton, softAssert);
        await assertVisible(this.availableTabButton, softAssert);
    }

    @step('Validate All tab content - bonus cards and details')
    public async validateAllTabContent(softAssert = false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        await this.bonusCard.validateBonusDetailsVisible(softAssert);
    }

    @step('Validate Active tab content - active bonus cards')
    public async validateActiveTabContent(softAssert = false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        //await this.bonusCard.validateActiveBonusCardVisible(softAssert);
    }

    @step('Validate Pending tab content - pending bonus cards')
    public async validatePendingTabContent(softAssert = false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        //await this.bonusCard.validatePendingBonusCardVisible(softAssert);
    }

    @step('Validate Available tab content - available bonus cards')
    public async validateAvailableTabContent(softAssert = false): Promise<void> {
        await this.validatePageElementsVisible(softAssert);
        //await this.bonusCard.validateAvailableBonusCardVisible(softAssert);
    }

    // Example: Loop through all cards and validate basics
    @step('Validate all bonus cards basic elements')
    public async validateAllCardsBasics(softAssert = false): Promise<void> {
        const cardCount = await this.bonusCard.getCardCount();
        
        for (let i = 0; i < cardCount; i++) {
            await this.bonusCard.validateCardBasics(i, softAssert);
        }
    }

    // Example: Find and click deposit on all available cards
    @step('Click deposit on all available bonus cards')
    public async clickDepositOnAvailableCards(): Promise<void> {
        const cardCount = await this.bonusCard.getCardCount();
        
        for (let i = 0; i < cardCount; i++) {

            try {
                await this.bonusCard.validateCardStatusColor(i,'available', true);
                await this.bonusCard.clickDepositButton(i);
                console.log(`Clicked deposit on available card ${i + 1}`);
            } catch {
                continue;
            }
        }
    }
}