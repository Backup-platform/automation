import { Page } from '@playwright/test';
import { step, stepParam } from '@test-utils/decorators';
import { clickElement } from '@test-utils/interactions';
import { assertVisible, assertNotVisible } from '@test-utils/assertions';
import { performNavigationClick } from '@test-utils/navigation-helpers';
import { compositeLocator, CompositeLocator } from '@test-utils/core-types';


export class BottomMenu {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private readonly containerSelector = 'div[class*="bottomNavigationV2_container_"]';
    readonly menu = compositeLocator(() => this.page.locator(this.containerSelector), 'Bottom menu');
    readonly menuButton = (index: number) => compositeLocator(() => this.menu.locator().locator('>button').nth(index), `Menu button ${index}`);
    readonly menuButtonImage = (index: number) => compositeLocator(() => this.menuButton(index).locator().locator(' div img'), `Menu button ${index} image`);
    readonly menuButtonLabel = (index: number) => compositeLocator(() => this.menuButton(index).locator().locator(' div[class*="styles_label_"]'), `Menu button ${index} label`);

    readonly burgerMenuButton = compositeLocator(() => this.menuButton(0).locator(), 'Burger menu button');
    readonly burgerMenuImage = compositeLocator(() => this.menuButtonImage(0).locator(), 'Burger menu image');
    readonly burgerMenuLabel = compositeLocator(() => this.menuButtonLabel(0).locator(), 'Burger menu label');

    readonly myBonusesButton = compositeLocator(() => this.menuButton(1).locator(), 'My Bonuses button');
    readonly myBonusesButtonImage = compositeLocator(() => this.menuButtonImage(1).locator(), 'My Bonuses button image');
    readonly myBonusesButtonLabel = compositeLocator(() => this.menuButtonLabel(1).locator(), 'My Bonuses button label');

    readonly loginButton = compositeLocator(() => this.page.locator('button#header-log-in-btn'), 'Login button');
    readonly registerButton = compositeLocator(() => this.page.locator('div[class*="_loggedOutButtonsWrapper_"] a'), 'Register button');

    readonly depositButton = compositeLocator(() => this.page.locator(`${this.containerSelector} a[href*="openCashier=true"] button`), 'Deposit button');
    readonly depositButtonImage = compositeLocator(() => this.depositButton.locator().locator(' div img'), 'Deposit button image');
    readonly depositButtonLabel = compositeLocator(() => this.depositButton.locator().locator(' div[class*="styles_label_"]'), 'Deposit button label');

    readonly gamesButton = compositeLocator(() => this.page.locator(`${this.containerSelector} a[href*="/games/all"] button`), 'Games button');
    readonly gamesButtonImage = compositeLocator(() => this.gamesButton.locator().locator(' div img'), 'Games button image');
    readonly gamesButtonLabel = compositeLocator(() => this.gamesButton.locator().locator(' div[class*="styles_label_"]'), 'Games button label');

    readonly shortcutButton = compositeLocator(() => this.page.locator('#shortcut-btn-shortcut'), 'Shortcut button');
    readonly shortcutButtonImage = compositeLocator(() => this.shortcutButton.locator().locator(' div img'), 'Shortcut button image');
    readonly shortcutButtonLabel = compositeLocator(() => this.shortcutButton.locator().locator(' div[class*="styles_label_"]'), 'Shortcut button label');

    readonly balance = compositeLocator(() => this.page.locator('[class*="homePageContent_mainWrapper_"] #wallet-current-balance'), 'Wallet balance');

    //Actions
    private navigateToMenuItem = (
        locator: CompositeLocator,
        path: string
    ) => performNavigationClick(this.page, locator, `${process.env.URL}${path}`);

    @stepParam((button: CompositeLocator, image: CompositeLocator, label: CompositeLocator, description: string) => 
        `I validate visibility of ${description} with its image and label`)
    private async validateButtonWithImageAndLabel(
        button: CompositeLocator, image: CompositeLocator, label: CompositeLocator, description: string, softAssert = false): Promise<void> {
        await assertVisible(button, softAssert);
        await assertVisible(image, softAssert);
        await assertVisible(label, softAssert);
    }

    public validateRegisterButtonVisible = async (softAssert = false) =>
        await assertVisible(this.registerButton, softAssert);

    public validateLoginButtonVisible = async (softAssert = false) =>
        await assertVisible(this.loginButton, softAssert);

    public validateMenuVisible = async (softAssert = false) =>
        await assertVisible(this.menu, softAssert);

    public clickRegisterButton = async () => await clickElement(this.registerButton);

    public clickLoginButton = async () => await clickElement(this.loginButton);

    public clickDepositButton = async () => await clickElement(this.depositButton);

    public clickGamesButton = async () => await this.navigateToMenuItem(this.gamesButton, '/games/all');

    public clickMyBonusesButton = async () => await clickElement(this.myBonusesButton);

    public clickBurgerMenuButton = async () => await clickElement(this.burgerMenuButton);

    public clickShortcutButton = async () => await clickElement(this.shortcutButton);

    public validateShortcutVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.shortcutButton, this.shortcutButtonImage, this.shortcutButtonLabel, 'Shortcut', softAssert);

    public validateGamesButtonVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.gamesButton, this.gamesButtonImage, this.gamesButtonLabel, 'Games', softAssert);

    public validateMyBonusesButtonVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.myBonusesButton, this.myBonusesButtonImage, this.myBonusesButtonLabel, 'My Bonuses', softAssert);

    public validateDepositButtonVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.depositButton, this.depositButtonImage, this.depositButtonLabel, 'Deposit', softAssert);

    public validateBurgerButtonVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.burgerMenuButton, this.burgerMenuImage, this.burgerMenuLabel, 'Burger Menu Button', softAssert);

	@step(`I get the wallet balance amount`)
	public async getBalanceAmount(): Promise<number> {
        await assertVisible(this.balance, false);
		return parseFloat(await this.balance.locator().innerText());
	}

    @step('I validate the bottom menu is visible for a member')
    public async validateMenuElementsForMember(softAssert = false): Promise<void> {
        await this.validateMenuVisible(softAssert);
        await this.validateBurgerButtonVisible(softAssert);
        await this.validateGamesButtonVisible(softAssert);
        await this.validateDepositButtonVisible(softAssert);
        await this.validateMyBonusesButtonVisible(softAssert);
        await this.validateShortcutVisible(softAssert);
    }

    @step('I validate the bottom menu is visible for a guest')
    public async validateMenuElementsForGuest(softAssert = false): Promise<void> {
        await this.validateMenuVisible(softAssert);
        await this.validateLoginButtonVisible(softAssert);
        await this.validateRegisterButtonVisible(softAssert);
    }

    @step('I validate bottom menu for logged-in state')
    public async validateLoggedInState(softAssert = false): Promise<void> {
        await assertVisible(this.gamesButton, softAssert);
        await assertVisible(this.depositButton, softAssert);
        await assertVisible(this.myBonusesButton, softAssert);
        await assertNotVisible(this.loginButton, softAssert);
        await assertNotVisible(this.registerButton, softAssert);
    }

    @step('I validate bottom menu for logged-out state')
    public async validateLoggedOutState(softAssert = false): Promise<void> {
        await assertVisible(this.loginButton, softAssert);
        await assertVisible(this.registerButton, softAssert);
        await assertNotVisible(this.gamesButton, softAssert);
        await assertNotVisible(this.depositButton, softAssert);
        await assertNotVisible(this.myBonusesButton, softAssert);
    }
}