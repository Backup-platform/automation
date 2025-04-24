import { Locator, Page, } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';
import { Navigation, step, stepParam } from './utils/navigation.po';
import { CashierMain } from './openCashier/cashierMain.po';

export type USER = 'Guest' | 'Member';

export class HeaderMenuDesktop {
	readonly page: Page;
	readonly navigation: Navigation;
	readonly cashierMain: CashierMain;

	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page);
		this.cashierMain = new CashierMain(page);
	}

	//Locators

	readonly desktopHeader = () => this.page.locator('#desktop-header');
	readonly mobileHeader = () => this.page.locator('#header-mobile')
	readonly header = () => this.desktopHeader().or(this.mobileHeader());
	readonly sfLogoDesktop = () => this.page.locator('a[class*="desktopHeader_desktopHeaderLogoContainer_"]');
	readonly sfLogoMobile = () => this.page.locator('a[class*="mobileHeader_mobileHeaderLogo_"]');
	readonly sfLogo = () => this.sfLogoDesktop().or(this.sfLogoMobile());
	readonly sfLogoImage = () => this.page.locator('img[title=spacefortuna-logo]');
	readonly headerIcons = () => this.page.locator('header-icons-container');

	readonly crashButton = () => this.page.locator('#desktop-nav-link-Crash');
	readonly liveButton = () => this.page.locator('#desktop-nav-link-Live');
	readonly tournamentButton = () => this.page.locator('#desktop-nav-link-Tournaments');
	readonly gamesButton = () => this.page.locator('#desktop-nav-link-Games');
	readonly promotionsButton = () => this.page.locator('#desktop-nav-link-Promotions');
	readonly vipButton = () => this.page.locator('#desktop-nav-link-VIP');
	readonly loyaltyButton = () => this.page.locator('#desktop-nav-link-Loyalty');
	readonly searchDesktop = () => this.page.locator('#header-search-icon');
	readonly searchMobile = () => this.page.locator('button[class*="mobileHeader_searchButton_"]');
	//readonly search = () => this.searchDesktop().or(this.searchMobile());
	readonly searchIcon = () => this.page.locator('[class*="searchButton_"] img');
	readonly searchDorM = () => this.searchDesktop().or(this.searchMobile());
	readonly loginButton = () => this.page.locator("#header-log-in-btn");
	readonly registerButton = () => this.page.locator("#header-sign-up-btn");
	readonly shortcutButton = () => this.page.locator('#shortcut-btn-shortcut');
	readonly myProfileButton = () => this.page.locator('div[class*="wallet_profileIconImageContainer_"]');
	readonly balance = () => this.page.locator('#wallet-modal-open-btn');
	readonly depositButton = () => this.page.locator('#wallet-modal-open-btn');

	readonly walletBalanceAmount = () => this.page.locator('div[class*="wallet_balanceContainer_"] .items-center span').nth(1).innerText();
	private readonly myProfileIcon = () => this.page.locator('#desktop-profile-icon');

	//Actions

	//TODO: shortcut, balande, login, sign up, deposit, search

	public async validateHeaderVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.header(), softAssert, 'Header');
	}

	public async validateSFLogoVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.sfLogo(), softAssert, 'SF Logo');
		await this.navigation.assertAttribute(this.sfLogo(), 'href'); //TODO: ,  "/" );
	}

	public async validateSFLogoImageVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.sfLogoImage(), softAssert, 'SF Logo Image');
		await this.navigation.assertAttribute(this.sfLogoImage(), 'srcset');
		await this.navigation.assertAttribute(this.sfLogoImage(), 'src');
	}

	public async validateCrashButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.crashButton(), softAssert, 'Crash button');
		await this.navigation.assertAttribute(this.crashButton(), 'href'); //TODO: , "/crash-games/all" );
	}

	public async validateLiveButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.liveButton(), softAssert, 'Live button');
		await this.navigation.assertAttribute(this.liveButton(), 'href'); //TODO: , , "/live-casino/all" );
	}

	public async validateTournamentButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.tournamentButton(), softAssert, 'Tournament button');
		await this.navigation.assertAttribute(this.tournamentButton(), 'href'); //TODO: ,  "/tournament-promotions" );
	}

	public async validateGamesButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.gamesButton(), softAssert, 'Games button');
		await this.navigation.assertAttribute(this.gamesButton(), 'href'); //TODO: ,  "/games" );
	}

	public async validatePromotionsButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionsButton(), softAssert, 'Promotions button');
		await this.navigation.assertAttribute(this.promotionsButton(), 'href'); //TODO: ,  "/promotions" );
	}

	public async validateVIPButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.vipButton(), softAssert, 'VIP button');
		await this.navigation.assertAttribute(this.vipButton(), 'href'); //TODO: ,  "/vip" );
	}

	public async validateLoyaltyButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.loyaltyButton(), softAssert, 'Loyalty button');
		await this.navigation.assertAttribute(this.loyaltyButton(), 'href'); //TODO: ,  "/loyalty" );
	}

	public async validateSearchButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.searchDorM(), softAssert, 'Search Button');
		await this.navigation.assertAttribute(this.searchIcon(), 'srcset');
		await this.navigation.assertAttribute(this.searchIcon(), 'src');
	}

	public async validateLoginButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.loginButton(), softAssert, 'Login button');
	}

	public async validateRegisterButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.registerButton(), softAssert, 'Sign Up button');
	}

	public async validateShortcut(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.shortcutButton(), softAssert, 'Shortcut button');
	}

	public async validateMyProfile(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.myProfileButton(), softAssert, 'MyProfile button');
	}

	public async validateBalance(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.balance(), softAssert, 'Balance button');
	}

	public async validateDepositButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.depositButton(), softAssert, 'Deposit button');
	}

	@step(`I get the wallet balance amount`)
	public async getBalanceAmmount(): Promise<number> {
		return parseFloat(await this.walletBalanceAmount());
	}

	@step('I click on the SFLogo')
	public async clickSFLogo(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.sfLogo(), softAssert, 'SFLogo');
		await this.navigation.assertUrl(`${process.env.URL}`);
	}

	@step('I click on the Crash menu button')
	public async clickCrashButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.crashButton(), softAssert, 'Crash menu button');
		await this.page.waitForURL('**/crash-games/all'); //TODO:
		await this.navigation.assertUrl(`${process.env.URL}` + 'crash-games/all');
	}

	@step('I click on the Live menu button')
	public async clickLiveButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.liveButton(), softAssert, 'Live menu button');
		await this.page.waitForURL('**/live-casino/all');
		await this.navigation.assertUrl(`${process.env.URL}live-casino/all`);
	}

	@step('I click on the Tournament menu button')
	public async clickTournamentButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.tournamentButton(), softAssert, 'Tournament menu button');
		await this.page.waitForURL('**/tournament-promotions');
		await this.navigation.assertUrl(`${process.env.URL}tournament-promotions`);
	}

	@step('I click on the Games menu button')
	public async clickGamesButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.gamesButton(), softAssert, 'Games menu button');
		await this.page.waitForURL('**/games/all');
		await this.navigation.assertUrl(`${process.env.URL}games/all`);
	}

	@step('I click on the Promotions button')
	public async clickPromotionsButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.promotionsButton(), softAssert, 'Promotions menu button');
		await this.page.waitForURL('**/promotions');
		await this.navigation.assertUrl(`${process.env.URL}promotions`);
	}

	@step('I click on the VIP button')
	public async clickVIPButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.vipButton(), softAssert, 'VIP button');
		await this.page.waitForURL('**/vip');
		await this.navigation.assertUrl(`${process.env.URL}vip`);
	}

	@step('I click on the Loyalty menu button')
	public async clickLoyaltyButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.loyaltyButton(), softAssert, 'Loyalty button');
		await this.page.waitForURL('**/loyalty');
		await this.navigation.assertUrl(`${process.env.URL}loyalty`);
	}

	public async clickRegisterButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.registerButton(), softAssert, 'Register button');
		//TODO: validate sign up is opened
	}

	public async clickLoginButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.loginButton(), softAssert, 'Expect the Login button to be visible');
		//TODO: there is a need to validate the the login window
	}

	public async clickDepositButton(softAssert = false): Promise<void> {
		await this.navigation.clickElement(this.depositButton(), softAssert, 'Deposit button');
		await this.navigation.assertUrlContains(['?openCashier=true'], softAssert);
		await this.cashierMain.validateModalBodyVisible();
	}

	public async validateHeaderElements(softAssert = false): Promise<void> {
		await test.step('I check if the header buttons and elements are visible', async () => {
			await this.validateHeaderVisible(softAssert);
			await this.validateSFLogoVisible(softAssert);
			await this.validateSFLogoImageVisible(softAssert);
			//TODO: crash has an issue await this.validateCrashButtonVisible();
			// await this.validateLiveButtonVisible(softAssert);
			// await this.validateTournamentButtonVisible(softAssert);
			// await this.validateGamesButtonVisible(softAssert);
			// await this.validatePromotionsButtonVisible(softAssert);
			// await this.validateVIPButtonVisible(softAssert);
			// await this.validateLoyaltyButtonVisible(softAssert);
		});
	}
}