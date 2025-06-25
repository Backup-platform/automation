import { Page } from '@playwright/test';
import {
    assertVisible,
    compositeLocator,
    assertNotVisible,
    clickElement,
} from '@test-utils/navigation.po';

export class CashierGeneral {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    // Locators

    //Both
    private readonly mainMenu = compositeLocator(() => 
        this.page.locator('#cashier-menu'), 'Cashier Main Menu');

    private readonly closeButton = compositeLocator(() => 
        this.page.locator('#cashier-menu button.absolute.right-4.top-4'), 'Cashier Close button');

    // Deposit menu container
    private readonly depositMenu = compositeLocator(() => 
        this.page.locator('#deposit-menu'), 'Deposit menu');

    // Withdraw menu container
    private readonly withdrawMenu = compositeLocator(() => 
        this.page.locator('#withdraw-menu'), 'Withdraw menu');

    // Deposit/Withdraw section buttons
    private readonly depositButton = compositeLocator(() => 
        this.page.locator('button.bg-primary-secondary'), 'Deposit button');

    private readonly withdrawButton = compositeLocator(() => 
        this.page.locator('button.bg-secondary-secondary'), 'Withdraw button');

    // Deposit steps - based on #deposit-menu container
    private readonly depositStep1 = compositeLocator(() => 
        this.page.locator('#deposit-menu .flex.min-w-max p').first(), 'Deposit Step 1');

    private readonly depositStep2 = compositeLocator(() => 
        this.page.locator('#deposit-menu .flex.min-w-max p').nth(1), 'Deposit Step 2');

    private readonly depositStep3 = compositeLocator(() => 
        this.page.locator('#deposit-menu .flex.min-w-max p').nth(2), 'Deposit Step 3');

    private readonly depositStep4 = compositeLocator(() => 
        this.page.locator('#deposit-menu .flex.min-w-max p').nth(3), 'Deposit Step 4');

    // Withdraw steps - based on #withdraw-menu container
    private readonly withdrawStep1 = compositeLocator(() => 
        this.page.locator('#withdraw-menu .flex.min-w-max p').first(), 'Withdraw Step 1');

    private readonly withdrawStep2 = compositeLocator(() => 
        this.page.locator('#withdraw-menu .flex.min-w-max p').nth(1), 'Withdraw Step 2');

    private readonly withdrawStep3 = compositeLocator(() => 
        this.page.locator('#withdraw-menu .flex.min-w-max p').nth(2), 'Withdraw Step 3');

    // Next button for withdraw flow
    //private readonly nextButton = compositeLocator(() => 
    //    this.page.locator('.sticky.bottom-0 button.bg-primary'), 'Next button');

    // Actions
    public validateMainMenuVisible = async () => await assertVisible(this.mainMenu);
    public validateMainMenuNotVisible = async () => await assertNotVisible(this.mainMenu);
    public validateCloseButtonVisible = async () => await assertVisible(this.closeButton);
    public validateDepositMenuVisible = async () => await assertVisible(this.depositMenu);
    public validateDepositMenuNotVisible = async () => await assertNotVisible(this.depositMenu);
    public validateWithdrawMenuVisible = async () => await assertVisible(this.withdrawMenu);
    public validateWithdrawMenuNotVisible = async () => await assertNotVisible(this.withdrawMenu);
    public clickCloseButton = async () => await clickElement(this.closeButton);
    public clickDepositButton = async () => await clickElement(this.depositButton);
    public clickWithdrawButton = async () => await clickElement(this.withdrawButton);
    //public clickNextButton = async () => await clickElement(this.nextButton);

    // Deposit step actions
    public clickDepositStep1 = async () => await clickElement(this.depositStep1);
    public clickDepositStep2 = async () => await clickElement(this.depositStep2);
    public clickDepositStep3 = async () => await clickElement(this.depositStep3);
    public clickDepositStep4 = async () => await clickElement(this.depositStep4);

    // Withdraw step actions
    public clickWithdrawStep1 = async () => await clickElement(this.withdrawStep1);
    public clickWithdrawStep2 = async () => await clickElement(this.withdrawStep2);
    public clickWithdrawStep3 = async () => await clickElement(this.withdrawStep3);

    // Deposit step validation actions
    public validateDepositStep1Visible = async () => await assertVisible(this.depositStep1);
    public validateDepositStep2Visible = async () => await assertVisible(this.depositStep2);
    public validateDepositStep3Visible = async () => await assertVisible(this.depositStep3);
    public validateDepositStep4Visible = async () => await assertVisible(this.depositStep4);

    // Withdraw step validation actions
    public validateWithdrawStep1Visible = async () => await assertVisible(this.withdrawStep1);
    public validateWithdrawStep2Visible = async () => await assertVisible(this.withdrawStep2);
    public validateWithdrawStep3Visible = async () => await assertVisible(this.withdrawStep3);
}
