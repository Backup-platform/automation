import { Page } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';

export class FooterMenuMobile {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	readonly bottomNavMenu = () => this.page.getByLabel('loggedin');
	readonly shortcutButtonOld = () => this.page.locator('#shortcut-btn-shortcut');
	readonly shortcutButton = () => this.page.getByRole('button', { name: 'shortcut' });
	readonly gamesButtonOld = () => this.page.locator('button[href="/games/all"]');
	readonly gamesButton = () => this.page.getByRole('button', { name: 'Games', exact: true });
	readonly headerLogo = () => this.page.locator('[title="spacefortuna-logo"]');


	public async validateLogoVisible(): Promise<void> {
		await expect(this.headerLogo()).toBeVisible();
	}

	public async validateBottomNavVisible(): Promise<void> {
		await expect(this.bottomNavMenu()).toBeVisible();
		await this.validateGamesVisible();
		await this.validateShortcutVisible();
	}

	public async validateShortcutVisible(): Promise<void> {
		await expect(this.shortcutButton()).toBeVisible();
	}

	public async validateGamesVisible(): Promise<void> {
		await expect(this.gamesButton()).toBeVisible();
	}

	public async clickGames(): Promise<void> {
		await this.gamesButton().click();
	}
}