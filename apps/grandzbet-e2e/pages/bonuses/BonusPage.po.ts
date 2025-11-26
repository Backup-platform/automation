import { Page, expect, test } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';
import { MenuItems } from '../menu/menuItems.po';
import { ProfileMenu } from '../menu/profileMenu.po';
import { BONUS_STATUS_TO_TAB } from './types';
import type { BonusCardStatus, BonusTab } from './types';

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

    public async goto(): Promise<void> {
        await this.navigateToMyBonuses();
    }

    private readonly containerSelector = '#profile-myBonuses';
    private readonly tabSelector = '#profile-myBonuses div.flex button';
    private readonly activeTabAttribute = 'bg-secondary-primary';
    private readonly cardContainerSelector = '#profile-myBonuses div.rounded-2xl.bg-tertiary-secondary.p-4';
    private readonly statusBadgeMap: Record<BonusCardStatus, string> = {
        available: 'span.bg-dark.text-2xs.font-bold.font-rubik.text-white',
        wagering: 'span.bg-dark.text-2xs.font-bold.font-rubik.text-primary',
        pending: 'span.bg-dark.text-2xs.font-bold.font-rubik.text-warning'
    };

    public readonly bonusesContainer = compositeLocator(() => 
        this.page.locator(this.containerSelector), 'My Bonuses container');

    public readonly pageTitle = compositeLocator(() => 
        this.page.locator('#profile-myBonuses h3.font-roboto.text-2xl.font-bold'), 'My Bonuses title');

    public readonly availableTab = compositeLocator(() => 
        this.page.locator(this.tabSelector).nth(0), 'Available tab');

    public readonly activeTab = compositeLocator(() => 
        this.page.locator(this.tabSelector).nth(1), 'Active tab');

    public readonly pendingTab = compositeLocator(() => 
        this.page.locator(this.tabSelector).nth(2), 'Pending tab');

    public readonly cardsInAvailableTab = compositeLocator(() => 
        this.page.locator(`${this.cardContainerSelector}:has(${this.statusBadgeMap.available})`),
        'Bonus cards in Available tab');

    public readonly cardsInActiveTab = compositeLocator(() => 
        this.page.locator(`${this.cardContainerSelector}:has(${this.statusBadgeMap.wagering})`),
        'Bonus cards in Active tab');

    public readonly cardsInPendingTab = compositeLocator(() => 
        this.page.locator(`${this.cardContainerSelector}:has(${this.statusBadgeMap.pending})`),
        'Bonus cards in Pending tab');

    @step('Navigate to My Bonuses page')
    public async navigateToMyBonuses(): Promise<void> {
        await this.menuItems.clickMyProfileButton();
        await this.profileMenu.clickMyBonusesButton();
    }

    public async ensureOnBonusesPage(): Promise<void> {
        const container = this.page.locator(this.containerSelector);
        if (!(await container.first().isVisible())) {
            await this.navigateToMyBonuses();
        }
    }

    @step('Synchronize Bonuses page state')
    public async sync(): Promise<void> {
        await this.ensureOnBonusesPage();
        await this.validateTabsVisible();
    }

    @step('Refresh bonus page')
    public async refresh(): Promise<void> {
        await this.ensureOnBonusesPage();
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await this.page.waitForLoadState('load');
    }

    @step('Validate page elements visible')
    public async validatePageElementsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.bonusesContainer, softAssert);
        await assertVisible(this.pageTitle, softAssert);
        await this.validateTabsVisible(softAssert);
    }

    @step('Validate tabs visible')
    public async validateTabsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.availableTab, softAssert);
        await assertVisible(this.activeTab, softAssert);
        await assertVisible(this.pendingTab, softAssert);
    }

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

    public async getCurrentActiveTab(): Promise<BonusTab | null> {
        const activeIndex = await this.getCurrentActiveTabIndex();
        switch (activeIndex) {
            case 0: return 'available';
            case 1: return 'active';
            case 2: return 'pending';
            default: return null;
        }
    }

    public async isTabActive(tab: BonusTab): Promise<boolean> {
        const tabElement = tab === 'available' ? this.availableTab : 
                          tab === 'active' ? this.activeTab : 
                          this.pendingTab;
        
        const tabClasses = await tabElement.locator().getAttribute('class') || '';
        return tabClasses.includes(this.activeTabAttribute);
    }

    public getCardsInTab(tab: BonusTab): typeof this.cardsInActiveTab {
        const cardLocators = {
            active: this.cardsInActiveTab,
            pending: this.cardsInPendingTab,
            available: this.cardsInAvailableTab
        };
        return cardLocators[tab];
    }

    public async syncTab(status: BonusCardStatus): Promise<void> {
        const tabKey = BONUS_STATUS_TO_TAB[status];
        await this.clickTab(tabKey);
        await expect(await this.isTabActive(tabKey), `${tabKey} tab should be active`).toBe(true);
    }

    public async clickTab(tab: BonusTab): Promise<void> {
        const tabs = {
            active: this.activeTab,
            pending: this.pendingTab,
            available: this.availableTab
        };
        await clickElement(tabs[tab]);
        // Tab switching is client-side, use domcontentloaded instead of full 'load'
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(500); // Small wait for UI to update
    }
}
