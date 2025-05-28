import { Page } from '@playwright/test';
import { clickElement, assertVisible } from '@test-utils/navigation.po';

export class AccountModal {
    readonly page: Page;

    constructor(page: Page) { 
        this.page = page;
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
    public validateAccountModalVisible = async (softAssert = false) =>
        await assertVisible(this.accountModal(), 'Account modal', softAssert);

    public validateAccountModalHeaderVisible = async (softAssert = false) =>
        await assertVisible(this.accountModalHeader(), 'Account modal header', softAssert);

    public validateAccountHeaderTitleVisible = async (softAssert = false) =>
        await assertVisible(this.accountHeaderTitle(), 'Account header title', softAssert);

    public validateAccountHeaderBalanceVisible = async (softAssert = false) =>
        await assertVisible(this.accountHeaderBalance(), 'Account header balance', softAssert);

    public validateRealMoneyBalanceVisible = async (softAssert = false) =>
        await assertVisible(this.accountHeaderRealMoney(), 'Real money balance', softAssert);

    public validateBonusMoneyBalanceVisible = async (softAssert = false) =>
        await assertVisible(this.accountHeaderBonusMoney(), 'Bonus money balance', softAssert);

    public validateLogoutButtonVisible = async (softAssert = false) =>
        await assertVisible(this.accountHeaderLogout(), 'Logout button', softAssert);

    public validateAccountHeaderNavBarVisible = async (softAssert = false) =>
        await assertVisible(this.accountHeaderNavBar(), 'Account header navbar', softAssert);

    public validateMyWalletTabVisible = async (softAssert = false) =>
        await assertVisible(this.accountTabMyWallet(), 'My Wallet tab', softAssert);

    public validateWalletBalancesVisible = async (softAssert = false) =>
        await assertVisible(this.accountWalletBalances(), 'Wallet balances section', softAssert);

    public validateRealMoneyWalletVisible = async (softAssert = false) =>
        await assertVisible(this.accountWalletRealMoney(), 'Real money wallet', softAssert);

    public validateBonusMoneyWalletVisible = async (softAssert = false) =>
        await assertVisible(this.accountWalletBonusMoney(), 'Bonus money wallet', softAssert);

    public validateTotalBalanceWalletVisible = async (softAssert = false) =>
        await assertVisible(this.accountWalletTotalBalance(), 'Total balance wallet', softAssert);

    public validateFooterVisible = async (softAssert = false) =>
        await assertVisible(this.footer(), 'Footer', softAssert);

    public validateWithdrawButtonVisible = async (softAssert = false) =>
        await assertVisible(this.withdrawButton(), 'Withdraw button', softAssert);

    public validateDepositButtonVisible = async (softAssert = false) =>
        await assertVisible(this.depositButton(), 'Deposit button', softAssert);

    public clickLogoutButton = async () => await clickElement(this.accountHeaderLogout(), 'Logout button');

    public clickMyWalletTab = async () => await clickElement(this.accountTabMyWallet(), 'My Wallet tab');

    public clickWithdrawButton = async () => await clickElement(this.withdrawButton(), 'Withdraw button');

    public clickDepositButton = async () => await clickElement(this.depositButton(), 'Deposit button');
}