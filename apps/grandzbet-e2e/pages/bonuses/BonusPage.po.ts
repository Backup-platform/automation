import { Page, expect } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';
import { MenuItems } from '../menu/menuItems.po';
import { ProfileMenu } from '../menu/profileMenu.po';
import { BonusCard } from './BonusCard.po';

/**
 * Layer 2: BonusPage POM - Page Level
 * Handles bonus page navigation and page-level elements
 */
export class BonusPage {
    readonly page: Page;
    readonly menuItems: MenuItems;
    readonly profileMenu: ProfileMenu;

    constructor(page: Page) {
        this.page = page;
        this.menuItems = new MenuItems(page);
        this.profileMenu = new ProfileMenu(page);
    }

    // Navigation methods
    public async goto(): Promise<void> {
        // Use full navigation path to reliably open profile menu then click My Bonuses
        await this.navigateToMyBonuses();
    }

    // Base selectors
    private readonly containerSelector = '#profile-myBonuses';
    // Updated tab selector: original used gap-4 which no longer exists; relax to any flex container under profile-myBonuses having buttons
    private readonly tabSelector = '#profile-myBonuses div.flex button';
    
    // Tab attributes for validation
    private readonly activeTabAttribute = 'bg-secondary-primary';

    // Container and header elements
    public readonly bonusesContainer = compositeLocator(() => 
        this.page.locator(this.containerSelector), 'My Bonuses container');

    public readonly pageTitle = compositeLocator(() => 
        this.page.locator('#profile-myBonuses h3.font-roboto.text-2xl.font-bold'), 'My Bonuses title');

    // Tab elements (order: Available, Active, Pending)
    public readonly availableTab = compositeLocator(() => 
        this.page.locator(this.tabSelector).nth(0), 'Available tab');

    public readonly activeTab = compositeLocator(() => 
        this.page.locator(this.tabSelector).nth(1), 'Active tab');

    public readonly pendingTab = compositeLocator(() => 
        this.page.locator(this.tabSelector).nth(2), 'Pending tab');

    // Navigation actions with @step
    @step('Navigate to My Bonuses page')
    public async navigateToMyBonuses(): Promise<void> {
        await this.menuItems.clickMyProfileButton();
        await this.profileMenu.clickMyBonusesButton();
    }

    // Utility to ensure we are on bonuses page (id container exists); otherwise navigate
    public async ensureOnBonusesPage(): Promise<void> {
        const container = this.page.locator(this.containerSelector);
        if (!(await container.first().isVisible())) {
            await this.navigateToMyBonuses();
        }
    }

    // Lightweight synchronization to ensure we're on the page and tabs are visible
    @step('Synchronize Bonuses page state')
    public async sync(): Promise<void> {
        await this.ensureOnBonusesPage();
        await this.validateTabsVisible();
    }

    @step('Click available tab')
    public async clickAvailableTab(): Promise<void> {
        await clickElement(this.availableTab);
    }

    @step('Click active tab')
    public async clickActiveTab(): Promise<void> {
        await clickElement(this.activeTab);
    }

    @step('Click pending tab')
    public async clickPendingTab(): Promise<void> {
        await clickElement(this.pendingTab);
    }

    // Tab show helpers with assertion that the tab is active
    @step('Show Available tab')
    public async showAvailableTab(): Promise<void> {
        await this.clickAvailableTab();
        await expect(await this.isTabActive('available'), 'Available tab should be active').toBe(true);
    }

    @step('Show Active tab')
    public async showActiveTab(): Promise<void> {
        await this.clickActiveTab();
        await expect(await this.isTabActive('active'), 'Active tab should be active').toBe(true);
    }

    @step('Show Pending tab')
    public async showPendingTab(): Promise<void> {
        await this.clickPendingTab();
        await expect(await this.isTabActive('pending'), 'Pending tab should be active').toBe(true);
    }

    // Page element validation with @step
    @step('Validate page elements visible')
    public async validatePageElementsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.bonusesContainer, softAssert);
        await assertVisible(this.pageTitle, softAssert);
        await assertVisible(this.availableTab, softAssert);
        await assertVisible(this.activeTab, softAssert);
        await assertVisible(this.pendingTab, softAssert);
    }

    @step('Validate tabs visible')
    public async validateTabsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.availableTab, softAssert);
        await assertVisible(this.activeTab, softAssert);
        await assertVisible(this.pendingTab, softAssert);
    }

    // Utility methods (no decorators)
    public async getCurrentActiveTabIndex(): Promise<number | null> {
        const tabs = [this.availableTab, this.activeTab, this.pendingTab];
        
        for (let i = 0; i < tabs.length; i++) {
            const tabClasses = await tabs[i].locator().getAttribute('class') || '';
            if (tabClasses.includes(this.activeTabAttribute)) {
                return i;
            }
        }
        return null;
    }

    public async getCurrentActiveTab(): Promise<'available' | 'active' | 'pending' | null> {
        const activeIndex = await this.getCurrentActiveTabIndex();
        switch (activeIndex) {
            case 0: return 'available';
            case 1: return 'active';
            case 2: return 'pending';
            default: return null;
        }
    }

    public async isTabActive(tab: 'available' | 'active' | 'pending'): Promise<boolean> {
        const tabElement = tab === 'available' ? this.availableTab : 
                          tab === 'active' ? this.activeTab : 
                          this.pendingTab;
        
        const tabClasses = await tabElement.locator().getAttribute('class') || '';
        return tabClasses.includes(this.activeTabAttribute);
    }

    // Card utilities (operate on current tab)
    @step('Get card count in current tab')
    public async getCardCountInCurrentTab(): Promise<number> {
        const card = new BonusCard(this.page);
        return await card.getCardCount();
    }

    @step('Check if a bonus card exists in current tab by name')
    public async hasBonusCard(nameOrSubstring: string): Promise<boolean> {
        const card = new BonusCard(this.page);
        const count = await card.getCardCount();
        for (let i = 0; i < count; i++) {
            const title = (await card.getCardTitle(i)).toLowerCase();
            const subtitle = (await card.getCardSubtitle(i)).toLowerCase();
            if (title.includes(nameOrSubstring.toLowerCase()) || subtitle.includes(nameOrSubstring.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}
