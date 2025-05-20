import { Locator, Page, } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';
import { step, performNavigationClick, assertVisible, assertNotVisible, validateAttributes, assertAttribute , clickElement, assertUrl, assertUrlContains } from './utils/navigation.po';

export type USER = 'Guest' | 'Member';

export class HeaderMenuDesktop {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators

	//TODO: shortcut, balance, login, sign up, deposit, search
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

	readonly walletBalanceAmount = () => this.page.locator('div[class*="wallet_balanceContainer_"] .items-center span').nth(1);
	private readonly myProfileIcon = () => this.page.locator('#desktop-profile-icon');

	//Actions


	private navigateToMenuItem = (
		locator: Locator,
		label: string,
		path: string
	) => performNavigationClick(this.page, locator, `${label} menu button`, `${process.env.URL}${path}`);

	public validateHeaderVisible = async (softAssert = false) => await assertVisible(this.header(), 'Header', softAssert);

	public validateSFLogoVisible = async (softAssert = false) =>
		await assertAttribute(this.sfLogo(), 'href', 'Space Fortuna Logo', softAssert, '/en');

	public validateSFLogoImageVisible = async (softAssert = false) =>
		await validateAttributes(this.sfLogoImage(), 'SF Logo Image', { srcset: null, src: null }, true);

	public validateCrashButtonVisible = async () => await assertAttribute(this.crashButton(), 'href', 'Crash Button', true, "/crash-games/all");

	public validateLiveButtonVisible = async () => await assertAttribute(this.liveButton(), 'href', 'Live Button', true, "/live-casino/all");

	public validateTournamentButtonVisible = async () => await assertAttribute(this.tournamentButton(), 'href', 'Tournament Button', true, "/tournament-promotions");

	public validateGamesButtonVisible = async () => await assertAttribute(this.gamesButton(), 'href', 'Games Button', true, "/games");

	public validatePromotionsButtonVisible = async () => await assertAttribute(this.promotionsButton(), 'href', 'Promotions Button', true, "/promotions");

	public validateVIPButtonVisible = async (softAssert = false) => await assertAttribute(this.vipButton(), 'href', 'VIP Button', true, "/vip");

	public validateLoyaltyButtonVisible = async (softAssert = false) => await assertAttribute(this.loyaltyButton(), 'href', 'Loyalty Button', true, "/loyalty");

	@step('I validate the search button is visible')
	public async validateSearchButtonVisible(softAssert = false): Promise<void> {
		await assertVisible(this.searchDorM(), 'Search Button', softAssert);
		await validateAttributes(this.searchIcon(), 'Search Icon', { srcset: null, src: null }, true);
	}

	public validateLoginButtonVisible = async (softAssert = false) => await assertVisible(this.loginButton(), 'Login button', softAssert);

	public validateRegisterButtonVisible = async (softAssert = false) => await assertVisible(this.registerButton(), 'Sign Up button', softAssert);

	public validateShortcut = async (softAssert = false) => await assertVisible(this.shortcutButton(), 'Shortcut button', softAssert);

	public validateMyProfile = async (softAssert = false) => await assertVisible(this.myProfileButton(), 'MyProfile button', softAssert);

	public validateBalance = async (softAssert = false) => await assertVisible(this.balance(), 'Balance button', softAssert);

	public validateDepositButtonVisible = async (softAssert = false) => await assertVisible(this.depositButton(), 'Deposit button', softAssert);

	public clickSFLogo = async () => await clickElement(this.sfLogo(), 'SFLogo');

	public assertHomePage = async () => await assertUrl(this.page, `${process.env.URL}`, true);

	@step('I navigate to the Home page via SF Logo')
	public async navigateToHomePageViaLogo () : Promise<void> {
		await this.clickSFLogo();
		await this.assertHomePage();
	}

	public clickCrashButton = async () => await clickElement(this.crashButton(), 'Crash menu button');

	public assertCrashPage = async () => await assertUrl(this.page, `${process.env.URL}crash-games/all`, true);

	public navigateToCrashPage = async () => await this.navigateToMenuItem(this.crashButton(), `Crash Games`, `crash-games/all` );

	public clickLiveButton = async () => await clickElement(this.liveButton(), 'Live menu button');

	public assertLivePage = async () => await assertUrl(this.page, `${process.env.URL}live-casino/all`, true);

	public navigateToLivePage = async () => await this.navigateToMenuItem(this.liveButton(), 'Live Casino', `live-casino/all`);

	public clickTournamentButton = async () => await clickElement(this.tournamentButton(), 'Tournament menu button');

	public assertTournamentPage = async () => await assertUrl(this.page, `${process.env.URL}tournament-promotions`, true);

	public navigateToTournamentPage = async () => await this.navigateToMenuItem(this.tournamentButton(),  'Tournament', `tournament-promotions`);

	public clickGamesButton = async () => await clickElement(this.gamesButton(), 'Games menu button');

	public assertGamesPage = async () => await assertUrl(this.page, `${process.env.URL}games/all`, true);

	public navigateToGamesPage = async () => await this.navigateToMenuItem(this.gamesButton(), 'Games', `games/all`);

	public clickPromotionsButton = async () => await clickElement(this.promotionsButton(), 'Promotions menu button');

	public assertPromotionsPage = async () => await assertUrl(this.page, `${process.env.URL}promotions`, true);

	public navigateToPromotionsPage = async () => await this.navigateToMenuItem(this.promotionsButton(), 'Promotions', 'promotions');

	public clickVIPButton = async () => await clickElement(this.vipButton(), 'VIP button');

	public assertVIPPage = async () => await assertUrl(this.page, `${process.env.URL}vip`, true);

	public navigateToVIPPage = async () => await this.navigateToMenuItem(this.vipButton(), 'VIP', 'vip');

	public clickLoyaltyButton = async () => await clickElement(this.loyaltyButton(), 'Loyalty button');

	public assertLoyaltyPage = async () => await assertUrl(this.page, `${process.env.URL}loyalty`, true);

	public navigateToLoyaltyPage = async () => await this.navigateToMenuItem(this.loyaltyButton(), 'Loyalty button', 'loyalty');

	public clickRegisterButton = async () => await clickElement(this.registerButton(), 'Register button');

	public clickLoginButton = async () => await clickElement(this.loginButton(), 'Login button');

	public navigateToLoginPage = async () => await this.navigateToMenuItem(this.loginButton(), 'Login', 'login');

	public async clickDepositButton(softAssert = false): Promise<void> {
		await clickElement(this.depositButton(), 'Deposit button');
		await assertUrlContains(this.page, ['?openCashier=true'], softAssert);
	}

	@step(`I get the wallet balance amount`)
	public async getBalanceAmmount(): Promise<number> {
		await assertVisible(this.walletBalanceAmount(), 'Balance button');
		return parseFloat(await this.walletBalanceAmount().innerText());
	}

	public validateLoggedInState = async (softAssert = true): Promise<void> => {
		await test.step('I validate the header elements are visible for a logged-in user', async () => {
			await this.validateMyProfile(softAssert);
			await this.validateBalance(softAssert);
			await this.validateDepositButtonVisible(softAssert);
			await assertNotVisible(this.loginButton(), 'Login button', softAssert);
			await assertNotVisible(this.registerButton(), 'Register button', softAssert);
			await this.validateSFLogoVisible(softAssert);
			await this.validateSFLogoImageVisible(softAssert);
		});
	};

	@step('I validate the header elements are visible for a Guest')
	public async validateLoggedOutState(softAssert = true): Promise<void> {
		await this.validateLoginButtonVisible(softAssert);
		await this.validateRegisterButtonVisible(softAssert);
		await assertNotVisible(this.myProfileButton(), 'My Profile button', softAssert);
		await assertNotVisible(this.balance(), 'Balance button', softAssert);
		await assertNotVisible(this.depositButton(), 'Deposit button', softAssert);
		await this.validateSFLogoVisible(softAssert);
		await this.validateSFLogoImageVisible(softAssert);
	};
}