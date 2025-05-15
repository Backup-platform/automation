import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam, assertAttribute, assertElementContainsText, clickElement, assertVisible, assertNotVisible, fillInputField, assertEditable, assertEnabled, assertNotEnabled  } from '../utils/navigation.po';

export class CashierMain {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page); // Initialize navigation
    }

    // Locators
    readonly modalContainer = () => this.page.locator('div[class*="walletModal_modalContent_"]'); //TODO: add action
    readonly modalBody = () => this.page.locator('div[class*="walletModal_modalBody_"]');
    readonly modalHeading = () => this.page.locator('div[class*="walletModalHeading_userInfo_"]');
    readonly headingTitle = () => this.page.locator('div[class*="walletModalHeading_title_"]');
    readonly headingBalance = () => this.page.locator('div[class*="walletModalHeading_balance_"]');
    readonly headingRealMoney = () => this.page.locator('div[class*="walletModalHeading_balance_"] span:nth-child(1)'); //TODO: add composit locator
    readonly headingBonusMoney = () => this.page.locator('div[class*="walletModalHeading_balance_"] span:nth-child(2)'); //TODO: add composit locator
    readonly walletTabs = () => this.page.locator('div[class*="walletModalHeading_walletTabs_"]');
    readonly walletTab = (tabIndex: number) => this.walletTabs().locator(`div:nth-child(${tabIndex})`);
    readonly depositHeading = () => this.page.locator('#wallet-modal-deposit-heading');
    readonly withdrawHeading = () => this.page.locator('#wallet-modal-withdraw-heading');
    readonly stepsContainerHeading = () => this.page.locator('div[class*="walletModalHeading_stepsContainer_"]'); //TODO: not ready 

    // Actions
    //TODO: this needs steps from the specs

    public validateModalBodyVisible = async (softAssert = false) =>
        await assertVisible(this.modalBody(), `Modal body`, softAssert);

    public validateModalHeadingVisible = async (softAssert = false) =>
        await assertVisible(this.modalHeading(), `Modal heading`, softAssert);

    public validateHeadingTitleVisible = async (softAssert = false) =>
        await assertVisible(this.headingTitle(), `Heading title`, softAssert);

    public validateHeadingBalanceVisible = async (softAssert = false) =>
        await assertVisible(this.headingBalance(), `Heading balance`, softAssert);

    public validateRealMoneyBalanceVisible = async (softAssert = false) =>
        await assertVisible(this.headingRealMoney(), `Real money balance`, softAssert);

    public validateBonusMoneyBalanceVisible = async (softAssert = false) =>
        await assertVisible(this.headingBonusMoney(), `Bonus money balance`, softAssert);

    public validateWalletTabsVisible = async (softAssert = false) =>
        await assertVisible(this.walletTabs(), `Wallet tabs`, softAssert);

    public validateDepositHeadingVisible = async (softAssert = false) =>
        await assertVisible(this.depositHeading(), `Deposit heading`, softAssert);

    public validateWithdrawHeadingVisible = async (softAssert = false) =>
        await assertVisible(this.withdrawHeading(), `Withdraw heading`, softAssert);

    public validateStepsContainerHeadingVisible = async (softAssert = false) =>
        await assertVisible(this.stepsContainerHeading(), `Steps container heading`, softAssert);

    public clickDepositHeading = async () =>
        await clickElement(this.depositHeading(), `Deposit heading`);

    public clickWithdrawHeading = async () =>
        await clickElement(this.withdrawHeading(), `Withdraw heading`);

    public clickWalletTab = async (tabIndex: number) =>
        await clickElement(this.walletTab(tabIndex), `Wallet tab ${tabIndex}`);

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

    @step('I open the deposit modal and validate all elements')
    public async openDepositModalAndValidate() {
        await this.clickDepositHeading();
        await this.validateAllModalElementsVisible();
    }

    @step('I open the withdraw modal and validate all elements')
    public async openWithdrawModalAndValidate() {
        await this.clickWithdrawHeading();
        await this.validateAllModalElementsVisible();
    }
}