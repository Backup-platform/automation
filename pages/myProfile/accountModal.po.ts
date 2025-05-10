import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam,  assertAttribute, assertElementContainsText, clickElement, assertVisible, assertNotVisible, fillInputField, assertEditable, assertEnabled, assertNotEnabled } from '../utils/navigation.po';

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
    public validateAccountModalVisible = async (softAssert = false) => 
        await assertVisible(this.accountModal(), softAssert, 'Account modal');

    public validateAccountModalHeaderVisible = async (softAssert = false) => 
        await assertVisible(this.accountModalHeader(), softAssert, 'Account modal header');

    public validateAccountHeaderTitleVisible = async (softAssert = false) => 
        await assertVisible(this.accountHeaderTitle(), softAssert, 'Account header title');

    public validateAccountHeaderBalanceVisible = async (softAssert = false) => 
        await assertVisible(this.accountHeaderBalance(), softAssert, 'Account header balance');

    public validateRealMoneyBalanceVisible = async (softAssert = false) => 
        await assertVisible(this.accountHeaderRealMoney(), softAssert, 'Real money balance');

    public validateBonusMoneyBalanceVisible = async (softAssert = false) => 
        await assertVisible(this.accountHeaderBonusMoney(), softAssert, 'Bonus money balance');

    public validateLogoutButtonVisible = async (softAssert = false) => 
        await assertVisible(this.accountHeaderLogout(), softAssert, 'Logout button');

    public validateAccountHeaderNavBarVisible = async (softAssert = false) => 
        await assertVisible(this.accountHeaderNavBar(), softAssert, 'Account header navbar');

    public validateMyWalletTabVisible = async (softAssert = false) => 
        await assertVisible(this.accountTabMyWallet(), softAssert, 'My Wallet tab');

    public validateWalletBalancesVisible = async (softAssert = false) => 
        await assertVisible(this.accountWalletBalances(), softAssert, 'Wallet balances section');

    public validateRealMoneyWalletVisible = async (softAssert = false) => 
        await assertVisible(this.accountWalletRealMoney(), softAssert, 'Real money wallet');

    public validateBonusMoneyWalletVisible = async (softAssert = false) => 
        await assertVisible(this.accountWalletBonusMoney(), softAssert, 'Bonus money wallet');

    public validateTotalBalanceWalletVisible = async (softAssert = false) => 
        await assertVisible(this.accountWalletTotalBalance(), softAssert, 'Total balance wallet');

    public validateFooterVisible = async (softAssert = false) => 
        await assertVisible(this.footer(), softAssert, 'Footer');

    public validateWithdrawButtonVisible = async (softAssert = false) => 
        await assertVisible(this.withdrawButton(), softAssert, 'Withdraw button');

    public validateDepositButtonVisible = async (softAssert = false) => 
        await assertVisible(this.depositButton(), softAssert, 'Deposit button');

    public clickLogoutButton = async (softAssert = false) => 
        await clickElement(this.accountHeaderLogout(), 'Logout button');

    public clickMyWalletTab = async (softAssert = false) => 
        await clickElement(this.accountTabMyWallet(), 'My Wallet tab');

    public clickWithdrawButton = async (softAssert = false) => 
        await clickElement(this.withdrawButton(), 'Withdraw button');

    public clickDepositButton = async (softAssert = false) => 
        await clickElement(this.depositButton(), 'Deposit button');
}