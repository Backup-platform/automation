import { Locator, Page } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';

export class HeaderMenuDesktop {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//Locators
	private readonly sfLogoOld = () => this.page.locator('img[title=\'spacefortuna-logo\']');
	private readonly desktopHeader = () => this.page.locator('#header #desktop-header');
	private readonly shortcutButtonOld = () => this.page.locator('#shortcut-btn-shortcut');
	private readonly mobileMenuButton = () => this.page.getByRole('button', { name: 'Menu' });
	private readonly mobilePromotions = () => this.page.locator(
		'a[class*="burgerMenu_mobileMenuNavigationItem"]').getByText('Promotions');
	private readonly mobileLoyalty = () => this.page.locator(
		'a[class*="burgerMenu_mobileMenuNavigationItem"]').getByText('Loyalty');
	private readonly mobileHome = () => this.page.locator(
		'a[class*="burgerMenu_mobileMenuNavigationItem"]').getByText('Home');
	private readonly shortcutButton = () => this.page.getByRole('button', { name: 'shortcut' });
	private readonly gamesOld = () => this.page.locator('#desktop-nav-link-Games');
	private readonly providersDropdown = () => this.page.locator('#providers-filter-btn');
	private readonly myProfileIcon = () => this.page.locator('#desktop-profile-icon');
	private readonly myProfile = () => this.page.getByText('My ProfileMy');
	private readonly balance = () => this.page.getByText('Balance:');
	private readonly crash = () => this.page.getByRole('link', { name: 'Crash' });
	private readonly live = () => this.page.getByRole('link', { name: 'Live' });
	private readonly home = () => this.page.getByRole('link', { name: 'Home' });
	private readonly gamesOLD = () => this.page.getByRole('link', { name: 'Games' });
	private readonly games = () => this.page.getByRole('link', { name: 'Games', exact: true });
	private readonly promotions = () => this.page.locator('#desktop-nav-link-Promotions');
	private readonly loyalty = () => this.page.locator('#desktop-nav-link-Loyalty');
	private readonly VIP = () => this.page.getByRole('link', { name: 'VIP', exact: true });
	private readonly deposit = () => this.page.getByRole('button', { name: 'Deposit' });
	private readonly sfLogo = () => this.page.getByRole('link', { name: 'SpaceFortuna Logo' });
	private readonly signUpButton = () => this.page.locator("#header-sign-up-btn");


	//Actions
	async clickGames(): Promise<void> {
		await this.games().click();
	}

	public async clickSignUpButton() {
		await test.step('I click the sign up button in the menu', async () => {
			await expect(this.signUpButton(),'Expect sign up button to be visible').toBeVisible();
			await this.signUpButton().click();
		});
	}

	private async handleMobleAndDesktopMenuButtons(desktopButtonLocator: Locator, mobileButtonLocator: Locator) {
		if (await this.mobileMenuButton().isVisible()) {
			await this.mobileMenuButton().click();
			await mobileButtonLocator.click();
		} else if (await desktopButtonLocator.isVisible()) {
			await desktopButtonLocator.click();
		}
	}

	public async clickPromotions(): Promise<void> {
		await test.step('I click the promotions menu button', async () => {
			await this.validatePromotionsVisible();
			await this.handleMobleAndDesktopMenuButtons(this.promotions(), this.mobilePromotions());
			await this.page.waitForURL('**/promotions', { waitUntil: "domcontentloaded" });
		});
	}

	public async clickLoyalty(): Promise<void> {
		await test.step('I click the loyalty menu button', async () => {
			await this.validateLoyaltyVisible();
			await this.handleMobleAndDesktopMenuButtons(this.loyalty(), this.mobileLoyalty());
			await this.page.waitForURL('**/loyalty', { waitUntil: "domcontentloaded" });
		});
	}

	public async clickHome(): Promise<void> {
		await test.step('I click the loyalty menu button', async () => {
			await this.validateHomeVisible();
			await this.handleMobleAndDesktopMenuButtons(this.home(), this.mobileHome());
			await this.page.waitForURL('**/home', { waitUntil: "domcontentloaded" });
		});
	}

	public async validateLogoVisible(): Promise<void> {
		await expect(this.sfLogo(), "validate landing page logo is visible").toBeVisible();
	}

	public async validateDesktopHeaderVisible(): Promise<void> {
		await expect(this.desktopHeader()).toBeVisible();

		await this.validateMyProfileVisible();
		await this.validateShortcutVisible();
		await this.validateGamesButtonVisible();
		await this.validateBalanceVisible();
		await this.validateCrashVisible();
		await this.validateLiveVisible();
		await this.validateHomeVisible();
		await this.validatePromotionsVisible();
		await this.validateVIPVisible();
		await this.validateDepositVisible();
	}

	public async isLoginVisible () : Promise <boolean> {
		return await this.signUpButton().isVisible();
	}

	public async validateMyProfileVisible() {
		await expect(this.myProfile()).toBeVisible({ timeout: 15000 });
	}

	public async validateShortcutVisible(): Promise<void> {
		await expect(this.shortcutButton()).toBeVisible();
	}

	public async validateGamesButtonVisible(): Promise<void> {
		await expect(this.games()).toBeVisible();
	}

	public async validateBalanceVisible(): Promise<void> {
		await expect(this.balance()).toBeVisible();
	}

	public async validateCrashVisible(): Promise<void> {
		await expect(this.crash()).toBeVisible();
	}

	public async validateLiveVisible(): Promise<void> {
		await expect(this.live()).toBeVisible();
	}

	public async validateHomeVisible(): Promise<void> {
		await expect(this.home().or(this.mobileMenuButton()),
			'Expect either mobile menu or desktop menu to be visible').toBeVisible();
	}

	public async validatePromotionsVisible(): Promise<void> {
		await expect(this.promotions().or(this.mobileMenuButton()),
			'Expect either mobile menu or desktop menu to be visible').toBeVisible();
	}

	public async validateLoyaltyVisible(): Promise<void> {
		await expect(this.loyalty().or(this.mobileMenuButton()),
			'Expect either mobile menu or desktop menu to be visible').toBeVisible();
	}

	public async validateVIPVisible(): Promise<void> {
		await expect(this.VIP()).toBeVisible();
	}

	public async validateDepositVisible(): Promise<void> {
		await expect(this.deposit()).toBeVisible();
	}

	public async validateSfLogoVisible(): Promise<void> {
		await expect(this.sfLogo()).toBeVisible();
	}
}