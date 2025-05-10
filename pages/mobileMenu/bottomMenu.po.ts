import { Page, Locator } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, assertAttribute, assertElementContainsText, clickElement, assertVisible, assertNotVisible, fillInputField, assertEditable, assertEnabled, assertNotEnabled, clickIfVisibleOrFallback, validateAttributes } from '../utils/navigation.po';
import { LoginPage } from '../loginPage.po';


export class BottomMenu {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
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

    readonly depositButton = () => this.page.locator(`${this.containerSelector} a[href="/?openCashier=true"] button`);
    readonly depositButtonImage = () => this.depositButton().locator(' div img');
    readonly depositButtonLabel = () => this.depositButton().locator(' div[class*="styles_label_"]');

    readonly gamesButton = () => this.page.locator(`${this.containerSelector} a[href="/games/all"] button`);
    readonly gamesButtonImage = () => this.gamesButton().locator(' div img');
    readonly gamesButtonLabel = () => this.gamesButton().locator(' div[class*="styles_label_"]');

    readonly shortcutButton = () => this.page.locator('#shortcut-btn-shortcut');
    readonly shortcutButtonImage = () => this.shortcutButton().locator(' div img');
    readonly shortcutButtonLabel = () => this.shortcutButton().locator(' div[class*="styles_label_"]');
    readonly bottomMenuLocator = () => this.page.locator('div[class*="bottomNavigationV2_container_"]');
    readonly balance = () => this.page.locator(''); //TODO: needs a locator should be moved to another place

    //Actions
    public validateRegisterButtonVisible = async (softAssert = false) => 
        await assertVisible(this.registerButton(), softAssert, 'Register button');

    public validateLoginButtonVisible = async (softAssert = false) => 
        await assertVisible(this.loginButton(), softAssert, 'Login button');

    public validateMenuVisible = async (softAssert = false) => 
        await assertVisible(this.menu(), softAssert, 'Bottom navigation menu');

    public validateBottomMenuVisible = async (softAssert = false) =>
        await assertVisible(this.bottomMenuLocator(), softAssert, 'Bottom Menu');

    public clickRegisterButton = async (softAssert = false) =>
        await clickElement(this.registerButton(), 'Register button');

    public clickLoginButton = async (softAssert = false) => 
        await clickElement(this.loginButton(), 'Login button');

    public clickDepositButton = async (softAssert = false) =>
        await clickElement(this.depositButton(), 'Deposit button');
    
    //TODO: this needs a change 
    public async clickGamesButton(softAssert = false): Promise<void> {
        await clickElement(this.gamesButton(), 'Games section');
        await this.navigation.assertUrl(`${process.env.URL}games/all`, softAssert);
    }

    public clickMyBonuses = async (softAssert = false) => 
        await clickElement(this.myBonusesButton(), 'My Bonuses section');

    public clickBurgerMenuButton = async (softAssert = false) => 
        await clickElement(this.burgerMenuButton(), 'Burger Menu Button');

    public clickShortcut = async (softAssert = false) => 
        await clickElement(this.shortcutButton(), 'Shortcut');

    public async validateBalanceVisible(softAssert = false): Promise<void> {
        // TODO: needs a locator await this.navigation.assertVisible(this.balance(), softAssert, 'Balance section');
    }

    @step('I validate the shortcut button is visible')
    public async validateShortcutVisible(softAssert = false): Promise<void> {
        await assertVisible(this.shortcutButton(), softAssert, 'Shortcut button');
        await assertVisible(this.shortcutButtonImage(), softAssert, 'Shortcut button image');
        await assertVisible(this.shortcutButtonLabel(), softAssert, 'Shortcut button label');
    }

    @step('I validate the games button is visible')
    public async validateGamesButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.gamesButton(), softAssert, 'Games button');
        await assertVisible(this.gamesButtonImage(), softAssert, 'Games button image');
        await assertVisible(this.gamesButtonLabel(), softAssert, 'Games button label');
    }

    @step('I validate the "My Bonuses" button is visible')
    public async validateMyBonusesButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.myBonusesButton(), softAssert, 'My Bonuses button');
        await assertVisible(this.myBonusesButtonImage(), softAssert, 'My Bonuses button image');
        await assertVisible(this.myBonusesButtonLabel(), softAssert, 'My Bonuses button label');
    }

    @step('I validate the deposit button is visible')
    public async validateDepositButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.depositButton(), softAssert, 'Deposit button');
        await assertVisible(this.depositButtonImage(), softAssert, 'Deposit button image');
        await assertVisible(this.depositButtonLabel(), softAssert, 'Deposit button label');
    }

    @step('I validate the burger menu button is visible')
    public async validateBurgerButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.burgerMenuButton(), softAssert, 'Burger Menu Button');
        await assertVisible(this.burgerMenuImage(), softAssert, 'Burger Menu Button image');
        await assertVisible(this.burgerMenuLabel(), softAssert, 'Burger Menu Button label');
    }

    @step('I validate the bottom menu is visible for a member')
    public async validateMenuElementsForMember(softAssert = false): Promise<void> {
        await this.validateMenuVisible(softAssert);
        await this.validateBurgerButtonVisible(softAssert);
        await this.validateGamesButtonVisible(softAssert);
        await this.validateDepositButtonVisible(softAssert);
        await this.validateMyBonusesButtonVisible(softAssert);
        await this.validateShortcutVisible(softAssert);
        //TODO: await this.validateBalanceVisible(softAssert);
    }

    @step('I validate the bottom menu is visible for a guest')
    public async validateMenuElementsForGuest(softAssert = false): Promise<void> {
        await this.validateMenuVisible(softAssert);
        await this.validateLoginButtonVisible(softAssert);
        await this.validateRegisterButtonVisible(softAssert);
    }
}