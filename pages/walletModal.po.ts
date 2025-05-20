import { FrameLocator, Locator, Page } from '@playwright/test';
import test, { expect } from '../pages/utils/base.po';


export class WalletModal {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}
    //Locators:
    private readonly walletModal = () => this.page.locator('#wallet-modal');
    
	//Actions
	//TODO: add navigation methods
    public async validateWalletModalVisible() {
		await expect.soft(this.walletModal(),
			`Expect wallet modal to be visible`).toBeVisible();
	}
}
