import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam  } from '../utils/navigation.po';

export class CashierMain {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page); // Initialize navigation
    }

    // Locators
    readonly modalBody = () => this.page.locator('div[class*="walletModal_modalBody_"]');
    readonly modalHeading = () => this.page.locator('div[class*="walletModalHeading_userInfo_"]');
    readonly headingTitle = () => this.page.locator('div[class*="walletModalHeading_title_"]');
    readonly headingBalance = () => this.page.locator('div[class*="walletModalHeading_balance_"]');
    readonly headingRealMoney = () => this.page.locator('div[class*="walletModalHeading_balance_"] span:nth-child(1)'); //TODO: add composit locator
    readonly headingBonusMoney = () => this.page.locator('div[class*="walletModalHeading_balance_"] span:nth-child(2)'); //TODO: add composit locator
    readonly walletTabs = () => this.page.locator('div[class*="walletModalHeading_walletTabs_"]');
    readonly depositHeading = () => this.page.locator('#wallet-modal-deposit-heading');
    readonly withdrawHeading = () => this.page.locator('#wallet-modal-withdraw-heading');
    readonly stepsContainerHeading = () => this.page.locator('div[class*="walletModalHeading_stepsContainer_"]'); //TODO: not ready 

    // Actions
    public async validateModalBodyVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.modalBody(), softAssert, 'Modal body');
    }

    public async validateModalHeadingVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.modalHeading(), softAssert, 'Modal heading');
    }

    public async validateHeadingTitleVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.headingTitle(), softAssert, 'Heading title');
    }

    public async validateHeadingBalanceVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.headingBalance(), softAssert, 'Heading balance');
    }

    public async validateRealMoneyBalanceVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.headingRealMoney(), softAssert, 'Real money balance');
    }

    public async validateBonusMoneyBalanceVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.headingBonusMoney(), softAssert, 'Bonus money balance');
    }

    public async validateWalletTabsVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.walletTabs(), softAssert, 'Wallet tabs');
    }

    public async validateDepositHeadingVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.depositHeading(), softAssert, 'Deposit heading');
    }

    public async validateWithdrawHeadingVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.withdrawHeading(), softAssert, 'Withdraw heading');
    }

    public async validateStepsContainerHeadingVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.stepsContainerHeading(), softAssert, 'Steps container heading');
    }

    @step('I validate all modal elements are visible')
    public async validateAllModalElementsVisible(softAssert = false): Promise<void> {
        await this.validateModalBodyVisible(softAssert);
        await this.validateModalHeadingVisible(softAssert);
        await this.validateHeadingTitleVisible(softAssert);
        await this.validateHeadingBalanceVisible(softAssert);
        await this.validateRealMoneyBalanceVisible(softAssert);
        await this.validateBonusMoneyBalanceVisible(softAssert);
        await this.validateWalletTabsVisible(softAssert);
        await this.validateDepositHeadingVisible(softAssert);
        await this.validateWithdrawHeadingVisible(softAssert);
        await this.validateStepsContainerHeadingVisible(softAssert);
    }

    public async clickDepositHeading(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.depositHeading(), softAssert, 'Deposit heading');
    }

    public async clickWithdrawHeading(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.withdrawHeading(), softAssert, 'Withdraw heading');
    }

    @step('I click a wallet tab')
    public async clickWalletTab(tabIndex: number, softAssert = false): Promise<void> {
        const walletTab = this.walletTabs().locator(`div:nth-child(${tabIndex})`);
        await this.navigation.clickElement(walletTab, softAssert, `Wallet tab ${tabIndex}`);
    }
}