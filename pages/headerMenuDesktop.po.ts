import { Locator, Page, } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';
import { Navigation } from './utils/navigation.po';

export type USER = 'Guest' | 'Member';

export class HeaderMenuDesktop {
	readonly page: Page;
	readonly navigation: Navigation;

	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page);
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

	/**
	 * 
	 * @param softAssert - controls if the assert is soft, default = true
	 */
	public async validateSFLogoImageVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.sfLogoImage(), softAssert, 'SF Logo Image');
		await this.navigation.assertAttribute(this.sfLogoImage(), 'srcset');
		await this.navigation.assertAttribute(this.sfLogoImage(), 'src');
	}

	/**
	 * 
	 * @param softAssert - controls if the assert is soft, default = true
	 */
	public async validateCrashButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.crashButton(), softAssert, 'Expect Crash button to be visible');
		await this.navigation.assertAttribute(this.crashButton(), 'href'); //TODO: , "/crash-games/all" );
	}

	/**
	 * 
	 * @param softAssert - controls if the assert is soft, default = true
	 */
	public async validateLiveButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.liveButton(), softAssert, 'Expect Live button to be visible');
		await this.navigation.assertAttribute(this.liveButton(), 'href'); //TODO: , , "/live-casino/all" );
	}

	/**
	 * 
	 * @param softAssert - controls if the assert is soft, default = true
	 */
	public async validateTournamentButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.tournamentButton(), softAssert, 'Expect Tournament button to be visible');
		await this.navigation.assertAttribute(this.tournamentButton(), 'href'); //TODO: ,  "/tournament-promotions" );
	}

	/**
	 * 
	 * @param softAssert - controls if the assert is soft, default = true
	 */
	public async validateGamesButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.gamesButton(), softAssert, 'Expect Games button to be visible');
		await this.navigation.assertAttribute(this.gamesButton(), 'href'); //TODO: ,  "/games" );
	}

	/**
	 * 
	 * @param softAssert - controls if the assert is soft, default = true
	 */
	public async validatePromotionsButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.promotionsButton(), softAssert, 'Expect Promotions button to be visible');
		await this.navigation.assertAttribute(this.promotionsButton(), 'href'); //TODO: ,  "/promotions" );
	}

	/**
	 * 
	 * @param softAssert - controls if the assert is soft, default = true
	 */
	public async validateVIPButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.vipButton(), softAssert, 'Expect VIP button to be visible');
		await this.navigation.assertAttribute(this.vipButton(), 'href'); //TODO: ,  "/vip" );
	}

	/**
	 * 
	 * @param softAssert - controls if the assert is soft, default = true
	 */
	public async validateLoyaltyButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.loyaltyButton(), softAssert, 'Expect Loyalty button to be visible');
		await this.navigation.assertAttribute(this.loyaltyButton(), 'href'); //TODO: ,  "/loyalty" );
	}

	public async validateSearchButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.searchDorM(), softAssert, 'Search Button');
		await this.navigation.assertAttribute(this.searchIcon(), 'srcset');
		await this.navigation.assertAttribute(this.searchIcon(), 'src');
	}

	public async validateLoginButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.loginButton(), softAssert, 'Expect Login button to be visible');
	}

	public async validateRegisterButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.registerButton(), softAssert, 'Expect Sign Up button to be visible');
	}

	public async validateShortcut(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.shortcutButton(), softAssert, 'Expect Shortcut button to be visible');
	}

	public async validateMyProfile(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.myProfileButton(), softAssert, 'Expect MyProfile button to be visible');
	}

	public async validateBalance(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.balance(), softAssert, 'Expect Balance to be visible');
	}

	public async validateDepositButtonVisible(softAssert = false): Promise<void> {
		await this.navigation.assertVisible(this.depositButton(), softAssert, 'Deposit button');
	}



	public async clickSFLogo(softAssert = false): Promise<void> {
		await test.step('I click on the SFLogo', async () => {
			await this.navigation.clickElement(this.sfLogo(), softAssert, 'Expect the SFLogo to be visible');
			await this.navigation.assertUrl(`${process.env.URL}`);
		});
	}

	public async clickCrashButton(softAssert = false): Promise<void> {
		await test.step('I click on the Crash menu button', async () => {
			await this.navigation.clickElement(this.crashButton(), softAssert, 'Expect the Crash menu button to be visible');
			await this.page.waitForURL('**/crash-games/all'); //TODO:
			await this.navigation.assertUrl(`${process.env.URL}` + 'crash-games/all');
		});
	}

	public async clickLiveButton(softAssert = false): Promise<void> {
		await test.step('I click on the Live menu button', async () => {
			await this.navigation.clickElement(this.liveButton(), softAssert, 'Expect the Live menu button to be visible');
			await this.page.waitForURL('**/live-casino/all');
			await this.navigation.assertUrl(`${process.env.URL}live-casino/all`);
		});
	}

	public async clickTournamentButton(softAssert = false): Promise<void> {
		await test.step('I click on the Tournament menu button', async () => {
			await this.navigation.clickElement(this.tournamentButton(), softAssert, 'Expect the Tournament menu button to be visible');
			await this.page.waitForURL('**/tournament-promotions');
			await this.navigation.assertUrl(`${process.env.URL}tournament-promotions`);
		});
	}

	public async clickGamesButton(softAssert = false): Promise<void> {
		await test.step('I click on the Games menu button', async () => {
			await this.navigation.clickElement(this.gamesButton(), softAssert, 'Expect the Games menu button to be visible');
			await this.page.waitForURL('**/games/all');
			await this.navigation.assertUrl(`${process.env.URL}games/all`);
		});
	}

	public async clickPromotionsButton(softAssert = false): Promise<void> {
		await test.step('I click on the Promotions menu button', async () => {
			await this.navigation.clickElement(this.promotionsButton(), softAssert, 'Expect the Promotions menu button to be visible');
			await this.page.waitForURL('**/promotions');
			await this.navigation.assertUrl(`${process.env.URL}promotions`);
		});
	}

	public async clickVIPButton(softAssert = false): Promise<void> {
		await test.step('I click on the VIP menu button', async () => {
			await this.navigation.clickElement(this.vipButton(), softAssert, 'Expect the VIP menu button to be visible');
			await this.page.waitForURL('**/vip');
			await this.navigation.assertUrl(`${process.env.URL}vip`);
		});
	}

	public async clickLoyaltyButton(softAssert = false): Promise<void> {
		await test.step('I click on the Loyalty menu button', async () => {
			await this.navigation.clickElement(this.loyaltyButton(), softAssert, 'Expect the Loyalty menu button to be visible');
			await this.page.waitForURL('**/loyalty');
			await this.navigation.assertUrl(`${process.env.URL}loyalty`);
		});
	}

	public async clickRegisterButton(softAssert = false): Promise<void> {
		await test.step('I click on the sign-up button in the menu', async () => {
			await this.navigation.clickElement(this.registerButton(), softAssert, 'Expect the sign-up button to be visible');
			//TODO: validate sign up is opened
		});
	}

	public async clickLoginButton(softAssert = false): Promise<void> {
		await test.step('I click on the Login button in the menu', async () => {
			await this.navigation.clickElement(this.loginButton(), softAssert, 'Expect the Login button to be visible');
			//TODO: there is a need to validate the the login window
		});
	}


	/**
	 * 
	 * @param softAssert - controlls if the assert is soft, default = false
	 * @param isUserLoggedIn true - checks if user is logged in, false - checks if user is logged out;
	 */
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