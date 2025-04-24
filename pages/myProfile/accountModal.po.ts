import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

export class AccountModal {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) { 
        this.page = page;
        this.navigation = new Navigation(page);
    }

    // Locators
    readonly accountModal = () => this.page.locator('div[class*="accountModal_modalContent_"]');
    readonly accountModalHeader = () => this.page.locator('div[class*="accountHeader_accountHeaderUserInfo_"]');
    readonly accountHeaderTitle = () => this.page.locator('div[class*="accountHeader_title_"]');
    readonly accountHeaderBalance = () => this.page.locator('div[class*="accountHeader_balance_"]');
    readonly accountHeaderRealMoney = () => this.page.locator('div[class*="accountHeader_balance_"] span:nth-child(1)');
    readonly accountHeaderBonusMoney = () => this.page.locator('div[class*="accountHeader_balance_"] span:nth-child(2)');
    readonly accountHeaderLogout = () => this.page.locator('div[class*="accountHeader_logOutButton_"]');
    readonly accountHeaderNavBar = () => this.page.locator('div[class*="accountHeader_navbar_"]');
    readonly accountTabMyWallet = () => this.page.locator('#account-tab-my-wallet');
    readonly accountWalletBalances = () => this.page.locator('div[class*="accountWallet_walletBalances_"]');
    readonly accountWalletRealMoney = () => this.page.locator('div[class*="accountWallet_realMoney_"]');
    readonly accountWalletRealMoneyText = () => this.page.locator('div[class*="accountWallet_realMoneyTextContainer_"]');
    readonly accountWalletRealMoneyAmount = () => this.accountWalletRealMoney().locator('span[class*="accountWallet_balanceAmount_"]');
    readonly accountWalletBonusMoney = () => this.page.locator('div[class*="accountWallet_bonusMoney_"]');
    readonly accountWalletBonusMoneyText = () => this.page.locator('div[class*="accountWallet_bonusMoneyTextContainer_"]');
    readonly accountWalletBonusMoneyAmount = () => this.accountWalletBonusMoney().locator('span[class*="accountWallet_balanceAmount_"]');
    readonly accountWalletTotalBalance = () => this.page.locator('div[class*="accountWallet_totalBalance_"]');
    readonly accountWalletTotalBalanceText = () => this.page.locator('div[class*="accountWallet_totalBalanceTextContainer_"]');
    readonly accountWalletTotalBalanceAmount = () => this.accountWalletBonusMoney().locator('span[class*="accountWallet_balanceAmount_"]');
    readonly footer = () => this.page.locator('div[class*="accountFooter_container_"]');
    readonly withdrawButton = () => this.footer().locator('button[class*="secondary"]');
    readonly depositButton = () => this.footer().locator('button[class*="primary"]');

    // Actions for Account Modal
    public async validateAccountModalVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountModal(), softAssert, 'Account modal');
    }

    public async validateAccountModalHeaderVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountModalHeader(), softAssert, 'Account modal header');
    }

    public async validateAccountHeaderTitleVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountHeaderTitle(), softAssert, 'Account header title');
    }

    public async validateAccountHeaderBalanceVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountHeaderBalance(), softAssert, 'Account header balance');
    }

    public async validateRealMoneyBalanceVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountHeaderRealMoney(), softAssert, 'Real money balance');
    }

    public async validateBonusMoneyBalanceVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountHeaderBonusMoney(), softAssert, 'Bonus money balance');
    }

    public async validateLogoutButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountHeaderLogout(), softAssert, 'Logout button');
    }

    public async validateAccountHeaderNavBarVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountHeaderNavBar(), softAssert, 'Account header navbar');
    }

    public async validateMyWalletTabVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountTabMyWallet(), softAssert, 'My Wallet tab');
    }

    public async validateWalletBalancesVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountWalletBalances(), softAssert, 'Wallet balances section');
    }

    public async validateRealMoneyWalletVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountWalletRealMoney(), softAssert, 'Real money wallet');
    }

    public async validateBonusMoneyWalletVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountWalletBonusMoney(), softAssert, 'Bonus money wallet');
    }

    public async validateTotalBalanceWalletVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountWalletTotalBalance(), softAssert, 'Total balance wallet');
    }

    public async validateFooterVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footer(), softAssert, 'Footer');
    }

    public async validateWithdrawButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.withdrawButton(), softAssert, 'Withdraw button');
    }

    public async validateDepositButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.depositButton(), softAssert, 'Deposit button');
    }

    public async clickLogoutButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.accountHeaderLogout(), softAssert, 'Logout button');
    }

    public async clickMyWalletTab(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.accountTabMyWallet(), softAssert, 'My Wallet tab');
    }

    public async clickWithdrawButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.withdrawButton(), softAssert, 'Withdraw button');
    }

    public async clickDepositButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.depositButton(), softAssert, 'Deposit button');
    }
}