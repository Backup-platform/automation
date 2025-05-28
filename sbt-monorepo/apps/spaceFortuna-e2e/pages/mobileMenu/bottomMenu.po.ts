import { Page, Locator } from '@playwright/test';
import { step, clickElement, assertVisible, assertNotVisible, performNavigationClick, stepParam } from '@test-utils/navigation.po';


export class BottomMenu {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private readonly containerSelector = 'div[class*="bottomNavigationV2_container_"]';
    readonly menu = () => this.page.locator(this.containerSelector);
    readonly menuButton = (index: number) => this.menu().locator('>button').nth(index);
    readonly menuButtonImage = (index: number) => this.menuButton(index).locator(' div img');
    readonly menuButtonLabel = (index: number) => this.menuButton(index).locator(' div[class*="styles_label_"]');

    // Specific buttons using the general method
    readonly burgerMenuButton = () => this.menuButton(0);
    readonly burgerMenuImage = () => this.menuButtonImage(0);
    readonly burgerMenuLabel = () => this.menuButtonLabel(0);

    readonly myBonusesButton = () => this.menuButton(1);
    readonly myBonusesButtonImage = () => this.menuButtonImage(1);
    readonly myBonusesButtonLabel = () => this.menuButtonLabel(1);

    // Other elements that don't follow the button index pattern
    readonly loginButton = () => this.page.locator('button#header-log-in-btn');
    readonly registerButton = () => this.page.locator('div[class*="_loggedOutButtonsWrapper_"] a');

    readonly depositButton = () => this.page.locator(`${this.containerSelector} a[href*="openCashier=true"] button`);
    readonly depositButtonImage = () => this.depositButton().locator(' div img');
    readonly depositButtonLabel = () => this.depositButton().locator(' div[class*="styles_label_"]');

    readonly gamesButton = () => this.page.locator(`${this.containerSelector} a[href*="/games/all"] button`);
    readonly gamesButtonImage = () => this.gamesButton().locator(' div img');
    readonly gamesButtonLabel = () => this.gamesButton().locator(' div[class*="styles_label_"]');

    readonly shortcutButton = () => this.page.locator('#shortcut-btn-shortcut');
    readonly shortcutButtonImage = () => this.shortcutButton().locator(' div img');
    readonly shortcutButtonLabel = () => this.shortcutButton().locator(' div[class*="styles_label_"]');

    readonly balance = () => this.page.locator('[class*="homePageContent_mainWrapper_"] #wallet-current-balance');

    //Actions
    private navigateToMenuItem = (
        locator: Locator,
        label: string,
        path: string
    ) => performNavigationClick(this.page, locator, `${label} menu button`, `${process.env.URL}${path}`);

    @stepParam((button: Locator, image: Locator, label: Locator, description: string) => 
        `I validate visibility of ${description} with its image and label`)
    private async validateButtonWithImageAndLabel(
        button: Locator, image: Locator, label: Locator, description: string, softAssert = false): Promise<void> {
        await assertVisible(button, `${description} button`, softAssert);
        await assertVisible(image, `${description} button image`, softAssert);
        await assertVisible(label, `${description} button label`, softAssert);
    }

    public validateRegisterButtonVisible = async (softAssert = false) =>
        await assertVisible(this.registerButton(), 'Register button', softAssert);

    public validateLoginButtonVisible = async (softAssert = false) =>
        await assertVisible(this.loginButton(), 'Login button', softAssert);

    public validateMenuVisible = async (softAssert = false) =>
        await assertVisible(this.menu(), 'Bottom menu', softAssert);

    public clickRegisterButton = async () => await clickElement(this.registerButton(), 'Register button');

    public clickLoginButton = async () => await clickElement(this.loginButton(), 'Login button');

    public clickDepositButton = async () => await clickElement(this.depositButton(), 'Deposit button');

    public clickGamesButton = async () => await this.navigateToMenuItem(this.gamesButton(), 'Games section', '/games/all');

    public clickMyBonusesButton = async () => await clickElement(this.myBonusesButton(), 'My Bonuses section');

    public clickBurgerMenuButton = async () => await clickElement(this.burgerMenuButton(), 'Burger Menu Button');

    public clickShortcutButton = async () => await clickElement(this.shortcutButton(), 'Shortcut Button');

    public validateShortcutVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.shortcutButton(), this.shortcutButtonImage(), this.shortcutButtonLabel(), 'Shortcut', softAssert);

    public validateGamesButtonVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.gamesButton(), this.gamesButtonImage(), this.gamesButtonLabel(), 'Games', softAssert);

    public validateMyBonusesButtonVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.myBonusesButton(), this.myBonusesButtonImage(), this.myBonusesButtonLabel(), 'My Bonuses', softAssert);

    public validateDepositButtonVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.depositButton(), this.depositButtonImage(), this.depositButtonLabel(), 'Deposit', softAssert);

    public validateBurgerButtonVisible = async (softAssert = false) =>
        await this.validateButtonWithImageAndLabel(this.burgerMenuButton(), this.burgerMenuImage(), this.burgerMenuLabel(), 'Burger Menu Button', softAssert);

	@step(`I get the wallet balance amount`)
	public async getBalanceAmount(): Promise<number> {
        await assertVisible(this.balance(), 'Wallet balance', false);
		return parseFloat(await this.balance().innerText());
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
        await assertVisible(this.gamesButton(), 'Games button', softAssert);
        await assertVisible(this.depositButton(), 'Deposit button', softAssert);
        await assertVisible(this.myBonusesButton(), 'My Bonuses button', softAssert);
        await assertNotVisible(this.loginButton(), 'Login button', softAssert);
        await assertNotVisible(this.registerButton(), 'Register button', softAssert);
    }

    @step('I validate bottom menu for logged-out state')
    public async validateLoggedOutState(softAssert = false): Promise<void> {
        await assertVisible(this.loginButton(), 'Login button', softAssert);
        await assertVisible(this.registerButton(), 'Register button', softAssert);
        await assertNotVisible(this.gamesButton(), 'Games button', softAssert);
        await assertNotVisible(this.depositButton(), 'Deposit button', softAssert);
        await assertNotVisible(this.myBonusesButton(), 'My Bonuses button', softAssert);
    }
}