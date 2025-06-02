import { Page, Locator } from '@playwright/test';
import { step, assertUrl, assertVisible, clickIfVisibleOrFallback, validateAttributes, stepParam } from '@test-utils/navigation.po';
import { BottomMenu } from './bottomMenu.po';

export class BurgerMenu {
    readonly page: Page;
    readonly bottomMenu: BottomMenu;

    constructor(page: Page) {
        this.page = page;
        this.bottomMenu = new BottomMenu(page);
    }

    //Locators 
    readonly shortcutButton = () => this.page.locator('#shortcut-btn-shortcut');
    readonly search = () => this.page.locator('input[type="search"]');
    readonly escape = () => this.page.locator('.w-[2rem]');
    readonly home = () => this.page.locator('#Burger-menu-nav-link-4');
    readonly games = () => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/games"]');
    readonly liveCasino = () => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/live-casino/all"]');
    readonly promotions = () => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/promotions"]');
    readonly tournaments = () => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/tournament-promotions"]');
    readonly vip = () => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/vip"]');
    readonly loyalty = () => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/loyalty"]');
    readonly register = () => this.page.locator('div[class*="burgerMenu_signUp_"]');
    readonly login = () => this.page.locator('div[class*="burgerMenu_login_"]');
    readonly menuWindow = () => this.page.locator('div[class*="burgerMenu_menuClass_"]');
    readonly support = () => this.page.locator('#Burger-menu-nav-link-log-out');
    readonly logout = () => this.page.locator('#Burger-menu-nav-link-log-out\\}');
    readonly deposit = () => this.page.locator('[class*="burgerMenu_deposit_"]');
    readonly buttonImage = () => this.page.locator(' span img');
    readonly searchModal = () => this.page.locator('div[class*="searchModalV3_searchModalWrapper_"]');
    readonly searchModalClose = () => this.page.locator('div[class*="searchModalV3_closeButton_"]');

 
    //Actions
    @stepParam((...args) => `I click on the ${args[1]} button`)
    private async clickNavigation(locator: Locator, description: string, url?: string): Promise<void> {
        await clickIfVisibleOrFallback(locator, async () => await this.openBurgerMenu(), description);
        if (url) {
            await assertUrl(this.page, `${process.env.URL}${url}`, true, false);
        }
    }

    public validateBurgerMenuVisible = async (softAssert = false) => await assertVisible(this.menuWindow(), 'Menu window', softAssert);

    public validateSearchButtonVisible = async (softAssert = false) => await assertVisible(this.search(), 'Search Button', softAssert);

    public validateHomeButtonVisible = async (softAssert = false) => await assertVisible(this.home(), 'Home Button', softAssert);

    public validateHomeButtonImageVisible = async (softAssert = false) =>
        await validateAttributes(this.home().locator(this.buttonImage()), 'Home Button image', {srcset: null, src: null}, softAssert);

    public validateGamesButtonVisible = async (softAssert = false) => await assertVisible(this.games(), 'Games Button', softAssert);

    public validateGamesButtonImageVisible = async (softAssert = false) => 
        await validateAttributes(this.games().locator(this.buttonImage()), 'Games Button image', {srcset: null, src: null}, softAssert);

    public validateLoginButtonVisible = async (softAssert = false) => await assertVisible(this.login(), 'Login Button', softAssert);

    public validateRegisterButtonVisible = async (softAssert = false) => await assertVisible(this.register(), 'Register Button', softAssert);

    public validateDepositButtonVisible = async (softAssert = false) => await assertVisible(this.deposit(), 'Deposit Button', softAssert);

    public validateSearchField = async (softAssert = false) => await assertVisible(this.searchModal(), 'Search Modal', softAssert);

    public clickShortcutButton = async () => await this.clickNavigation(this.shortcutButton(), 'Shortcut Button', '');

    public clickHomeButton = async () => await this.clickNavigation(this.home(), 'Home Button', '');

    public clickGamesButton = async () => await this.clickNavigation(this.games(), 'Games Button', '/games/all');

    public clickLiveCasinoButton = async () => await this.clickNavigation(this.liveCasino(), 'Live Casino', '/live-casino/all');

    public clickPromotionsButton = async () => await this.clickNavigation(this.promotions(), 'Promotions', '/promotions');

    public clickTournamentsButton = async () => await this.clickNavigation(this.tournaments(), 'Tournaments', '/tournament-promotions');

    public clickVIPButton = async () => await this.clickNavigation(this.vip(), 'VIP', '/vip');

    public clickLoyaltyButton = async () => await this.clickNavigation(this.loyalty(), 'Loyalty', '/loyalty');

    public clickLoginButton = async () => await this.clickNavigation(this.login(), 'Login');

    public clickRegisterButton = async () => await this.clickNavigation(this.register(), 'Register');

    public clickSupportButton = async () => await this.clickNavigation(this.support(), 'Support');

    public clickLogoutButton = async () => await this.clickNavigation(this.logout(), 'Logout');

    public clickDepositButton = async () => await this.clickNavigation(this.deposit(), 'Deposit');

    @step('I open the burger menu')
    public async openBurgerMenu(): Promise<void> {
        await this.bottomMenu.validateBurgerButtonVisible(true);
        await this.bottomMenu.clickBurgerMenuButton();
        await this.validateBurgerMenuVisible(true);
    }

    @step('I validate the shortcut button is visible')
    public async validateShortcutButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.shortcutButton(), 'Shortcut Button', softAssert);
        await assertVisible(this.shortcutButton().locator(this.buttonImage()), 'Shortcut Button image', softAssert);
    }

    @step('I validate the home button, its image and atributes are visible')
    public async validateHomeButtonImageAndAttributesVisible(softAssert = false): Promise<void> {
        await this.validateHomeButtonVisible(softAssert);
        await this.validateHomeButtonImageVisible(softAssert);
    }

    @step('I validate the games button, its image and atributes are visible')
    public async validateGamesButtonImageAndAttributesVisible(softAssert = false): Promise<void> {
        await this.validateGamesButtonVisible(softAssert);
        await this.validateGamesButtonImageVisible(softAssert);
    }

    @step('I validate the live casino button is visible')
    public async validateLiveCasinoButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.liveCasino(), 'Live Casino Button', softAssert);
        await validateAttributes(this.liveCasino().locator(this.buttonImage()), 'Live Button image', {srcset: null, src: null}, softAssert);
    }

    @step('I validate the promotions button is visible')
    public async validatePromotionsButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.promotions(), 'Promotions Button', softAssert);
        await validateAttributes(this.promotions().locator(this.buttonImage()), 'Promotions Button image', {srcset: null, src: null}, softAssert);
    }

    @step('I validate the tournaments button is visible')
    public async validateTournamentsButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.tournaments(), 'Tournaments Button', softAssert);
        await validateAttributes(this.tournaments().locator(this.buttonImage()), 'Tournaments Button image', {srcset: null, src: null}, softAssert);
    }

    @step('I validate the VIP button is visible')
    public async validateVIPButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.vip(), 'VIP Button', softAssert);
        await validateAttributes(this.vip().locator(this.buttonImage()), 'VIP Button image', {srcset: null, src: null}, softAssert);
    }

    @step('I validate the loyalty button is visible')
    public async validateLoyaltyButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.loyalty(), 'Loyalty Button', softAssert);
        await validateAttributes(this.loyalty().locator(this.buttonImage()), 'Loyalty Button image', {srcset: null, src: null}, softAssert);
    }

    @step('I validate the support button is visible')
    public async validateSupportButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.support(), 'Support Button', softAssert);
        await validateAttributes(this.support().locator(this.buttonImage()), 'Support Button image', {srcset: null, src: null}, softAssert);
    }

    @step('I validate the logout button is visible')
    public async validateLogoutButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.logout(), 'Logout Button', softAssert);
        await validateAttributes(this.logout().locator(this.buttonImage()), 'Logout Button image', {srcset: null, src: null}, softAssert);
    }

    @step('I click on the search button')
    public async clickSearchField(softAssert = false): Promise<void> {
        await this.clickNavigation(this.search(), 'Search Button');
        await assertVisible(this.searchModal(), 'Search Modal', softAssert);
        await this.searchModalClose().click();
    }

    @step('I validate the menu elements for a guest')
    public async validateMenuElementsForGuest(softAssert :boolean): Promise<void> {
            //TODO: add not visible elements 
            await this.validateBurgerMenuVisible(true);
            await this.validateSearchButtonVisible(softAssert);
            await this.validateHomeButtonVisible(softAssert);
            await this.validateGamesButtonVisible(softAssert);
            await this.validatePromotionsButtonVisible(softAssert);
            await this.validateVIPButtonVisible(softAssert);
            await this.validateLoyaltyButtonVisible(softAssert);
            await this.validateLoginButtonVisible(softAssert);
            await this.validateRegisterButtonVisible(softAssert);
            await this.validateSupportButtonVisible(softAssert);
    }

    @step('I validate the menu elements for a member')
    public async validateMenuElementsForMember(softAssert = false): Promise<void> {
            //TODO: add not visible elements 
            await this.validateBurgerMenuVisible(true);
            await this.validateSearchButtonVisible(softAssert);
            await this.validateHomeButtonVisible(softAssert);
            await this.validateGamesButtonVisible(softAssert);
            await this.validatePromotionsButtonVisible(softAssert);
            await this.validateVIPButtonVisible(softAssert);
            await this.validateLoyaltyButtonVisible(softAssert);
            await this.validateSupportButtonVisible(softAssert);
            await this.validateLogoutButtonVisible(softAssert);
            await this.validateDepositButtonVisible(softAssert);
    }

}
