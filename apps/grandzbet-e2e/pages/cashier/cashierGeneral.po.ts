import { Page } from '@playwright/test';
import {
    assertVisible,
    compositeLocator,
    assertNotVisible,
    clickElement,
} from '@test-utils/navigation.po';

export class CashierGeneral {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    // Locators

    //Both
    private readonly mainMenu = compositeLocator(() => 
        this.page.locator('#cashier-menu'), 'Cashier Main Menu');

    private readonly closeButton = compositeLocator(() => 
        this.page.locator('#cashier-menu button.absolute.right-4.top-4'), 'Cashier Close button');

    // Actions
    public validateMainMenuVisible = async () => await assertVisible(this.mainMenu);
    public validateMainMenuNotVisible = async () => await assertNotVisible(this.mainMenu);
    public validateCloseButtonVisible = async () => await assertVisible(this.closeButton);
    public clickCloseButton = async () => await clickElement(this.closeButton);
}
