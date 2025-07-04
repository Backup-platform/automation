import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible, assertNotVisible, assertEnabled, assertVisibleNotActionable } from '@test-utils/assertions';
import { compositeLocator, CompositeLocator } from '@test-utils/core-types';
import { performNavigationClick } from '@test-utils/navigation-helpers';
import { validateAttributes } from '@test-utils/attributes';

export class ProfileMenu {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private readonly profileMenuDialog = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"]'), 'Profile menu dialog');

    private readonly escapeButton = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] button.absolute.right-4.top-4'), 'Escape button');
    
    private readonly depositButton = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] button.bg-primary'), 'Deposit button');
    
    private readonly realMoney = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] .flex.flex-col.items-end.gap-\\[2px\\]:last-child span:nth-child(1)'), 'Real Money');
    
    private readonly casinoBonus = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] .flex.flex-col.items-end.gap-\\[2px\\]:last-child span:nth-child(2)'), 'Casino Bonus');
    
    private readonly sportBonus = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] .flex.flex-col.items-end.gap-\\[2px\\]:last-child span:nth-child(3)'), 'Sport Bonus');
    
    private readonly balance = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] .flex.flex-col.items-end.gap-\\[2px\\]:last-child span.text-primary:nth-child(4)'), 'Balance');
    
    private readonly myBonusesButton = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] #my-profile-menu-links > button').first(), 'My Bonuses button');
    
    private readonly personalInfoButton = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] #my-profile-menu-links > button').nth(1), 'Personal Info button');
    
    private readonly verificationButton = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] #my-profile-menu-links > button').nth(2), 'Verification button');
    
    private readonly historyButton = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] #my-profile-menu-links > button').nth(3), 'History button');
    
    private readonly limitsButton = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] #my-profile-menu-links > button').nth(4), 'Limits button');
    
    private readonly logoutButton = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"][aria-describedby="The profile menu content"] .flex-end > button'), 'Logout button');

    // Public getters for clickable elements
    public get profileMenuDialogElement() { return this.profileMenuDialog; }
    public get escapeButtonElement() { return this.escapeButton; }
    public get depositButtonElement() { return this.depositButton; }
    public get myBonusesButtonElement() { return this.myBonusesButton; }
    public get personalInfoButtonElement() { return this.personalInfoButton; }
    public get verificationButtonElement() { return this.verificationButton; }
    public get historyButtonElement() { return this.historyButton; }
    public get limitsButtonElement() { return this.limitsButton; }
    public get logoutButtonElement() { return this.logoutButton; }

    //Actions
    public clickEscapeButton = async () => await clickElement(this.escapeButton);
    public clickDepositButton = async () => await clickElement(this.depositButton);
    public clickMyBonusesButton = async () => await clickElement(this.myBonusesButton);
    public clickPersonalInfoButton = async () => await clickElement(this.personalInfoButton);
    public clickVerificationButton = async () => await clickElement(this.verificationButton);
    public clickHistoryButton = async () => await clickElement(this.historyButton);
    public clickLimitsButton = async () => await clickElement(this.limitsButton);
    public clickLogoutButton = async () => await clickElement(this.logoutButton);

    public validateProfileMenuDialogNotVisible = async (softAssert = false) => 
        await assertNotVisible(this.profileMenuDialog, softAssert);

    public validateNavigation = async (element: CompositeLocator, expectedURL: string) => {
        await performNavigationClick(this.page, element, expectedURL);
    }

    @step('I validate the Profile menu dialog is hidden behind the deposit overlay')
    public async validateMenuHiddenByDeposit (): Promise<void> {
        await assertVisibleNotActionable(this.profileMenuDialog);
        await validateAttributes(this.profileMenuDialog, { 'aria-hidden': 'true' }, true);
        await validateAttributes(this.profileMenuDialog, { 'data-aria-hidden': 'true' }, true);
        await validateAttributes(this.profileMenuDialog, { "style": "pointer-events: none;" }, true);
    }

    @step('I validate the Profile Menu elements are visible')
    public async validateProfileMenuElementsVisible (softAssert = false): Promise<void> {
        await assertVisible(this.profileMenuDialog, softAssert);
        await assertVisible(this.escapeButton, softAssert);
        await assertVisible(this.depositButton, softAssert);
        await assertVisible(this.realMoney, softAssert);
        await assertVisible(this.casinoBonus, softAssert);
        await assertVisible(this.sportBonus, softAssert);
        await assertVisible(this.balance, softAssert);
        await assertVisible(this.myBonusesButton, softAssert);
        await assertVisible(this.personalInfoButton, softAssert);
        await assertVisible(this.verificationButton, softAssert);
        await assertVisible(this.historyButton, softAssert);
        await assertVisible(this.limitsButton, softAssert);
        await assertVisible(this.logoutButton, softAssert);
    }

    @step('I validate the Profile Menu elements are editable')
    public async validateProfileMenuEnabled (softAssert = false): Promise<void> {
        await assertEnabled(this.escapeButton, softAssert);
        await assertEnabled(this.depositButton, softAssert);
        await assertEnabled(this.myBonusesButton, softAssert);
        await assertEnabled(this.personalInfoButton, softAssert);
        await assertEnabled(this.verificationButton, softAssert);
        await assertEnabled(this.historyButton, softAssert);
        await assertEnabled(this.limitsButton, softAssert);
        await assertEnabled(this.logoutButton, softAssert);
    }

    @step('I validate the Profile Menu elements are visible and enabled')
    public async validateProfileMenuElements (softAssert = false): Promise<void> {
        await this.validateProfileMenuElementsVisible(softAssert);
        await this.validateProfileMenuEnabled(softAssert);
    }
}