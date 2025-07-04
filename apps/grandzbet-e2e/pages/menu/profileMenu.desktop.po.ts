import { Page } from '@playwright/test';
import { 
    step, 
    clickElement, 
    assertVisible,
    compositeLocator,
    CompositeLocator,
    performNavigationClick,
    assertEnabled
} from '@test-utils/navigation.po';

export class ProfileMenuDesktop {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private readonly profileMenuDialog = compositeLocator(() => 
        this.page.locator('#menu'), 'Profile menu container (Desktop)');
    
    private readonly depositButton = compositeLocator(() => 
        this.page.locator('#menu button.bg-primary'), 'Deposit button (Desktop)');
    
    private readonly realMoney = compositeLocator(() => 
        this.page.locator('#menu .flex.flex-col.items-end.gap-\\[2px\\]:last-child span:nth-child(1)'), 'Real Money (Desktop)');
    
    private readonly casinoBonus = compositeLocator(() => 
        this.page.locator('#menu .flex.flex-col.items-end.gap-\\[2px\\]:last-child span:nth-child(2)'), 'Casino Bonus (Desktop)');
    
    private readonly sportBonus = compositeLocator(() => 
        this.page.locator('#menu .flex.flex-col.items-end.gap-\\[2px\\]:last-child span:nth-child(3)'), 'Sport Bonus (Desktop)');
    
    private readonly balance = compositeLocator(() => 
        this.page.locator('#menu .flex.flex-col.items-end.gap-\\[2px\\]:last-child span.text-primary:nth-child(4)'), 'Balance (Desktop)');
    
    private readonly myBonusesButton = compositeLocator(() => 
        this.page.locator('#menu #my-profile-menu-links > button').first(), 'My Bonuses button (Desktop)');
    
    private readonly personalInfoButton = compositeLocator(() => 
        this.page.locator('#menu #my-profile-menu-links > button').nth(1), 'Personal Info button (Desktop)');
    
    private readonly verificationButton = compositeLocator(() => 
        this.page.locator('#menu #my-profile-menu-links > button').nth(2), 'Verification button (Desktop)');
    
    private readonly historyButton = compositeLocator(() => 
        this.page.locator('#menu #my-profile-menu-links > button').nth(3), 'History button (Desktop)');
    
    private readonly limitsButton = compositeLocator(() => 
        this.page.locator('#menu #my-profile-menu-links > button').nth(4), 'Limits button (Desktop)');
    
    private readonly logoutButton = compositeLocator(() => 
        this.page.locator('#menu .flex-end > button'), 'Logout button (Desktop)');

    // Public getters for clickable elements
    public get profileMenuDialogElement() { return this.profileMenuDialog; }
    public get depositButtonElement() { return this.depositButton; }
    public get myBonusesButtonElement() { return this.myBonusesButton; }
    public get personalInfoButtonElement() { return this.personalInfoButton; }
    public get verificationButtonElement() { return this.verificationButton; }
    public get historyButtonElement() { return this.historyButton; }
    public get limitsButtonElement() { return this.limitsButton; }
    public get logoutButtonElement() { return this.logoutButton; }

    //Actions
    public clickDepositButton = async () => await clickElement(this.depositButton);
    public clickMyBonusesButton = async () => await clickElement(this.myBonusesButton);
    public clickPersonalInfoButton = async () => await clickElement(this.personalInfoButton);
    public clickVerificationButton = async () => await clickElement(this.verificationButton);
    public clickHistoryButton = async () => await clickElement(this.historyButton);
    public clickLimitsButton = async () => await clickElement(this.limitsButton);
    public clickLogoutButton = async () => await clickElement(this.logoutButton);

    public validateNavigation = async (element: CompositeLocator, expectedURL: string) => {
        await performNavigationClick(this.page, element.locator(), element.name, expectedURL);
    }

    @step('I validate the Profile Menu (Desktop) elements are visible')
    public async validateProfileMenuElementsVisible (softAssert = false): Promise<void> {
        await assertVisible(this.profileMenuDialog, softAssert);
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

    @step('I validate the Profile Menu (Desktop) elements are editable')
    public async validateProfileMenuEnabled (softAssert = false): Promise<void> {
        await assertEnabled(this.depositButton, softAssert);
        await assertEnabled(this.myBonusesButton, softAssert);
        await assertEnabled(this.personalInfoButton, softAssert);
        await assertEnabled(this.verificationButton, softAssert);
        await assertEnabled(this.historyButton, softAssert);
        await assertEnabled(this.limitsButton, softAssert);
        await assertEnabled(this.logoutButton, softAssert);
    }

    @step('I validate the Profile Menu (Desktop) elements are visible and enabled')
    public async validateProfileMenuElements (softAssert = false): Promise<void> {
        await this.validateProfileMenuElementsVisible(softAssert);
        await this.validateProfileMenuEnabled(softAssert);
    }
}