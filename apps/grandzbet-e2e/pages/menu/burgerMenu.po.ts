import { Page } from '@playwright/test';
import { step, stepParam } from '@test-utils/decorators';
import { assertVisible } from '@test-utils/assertions';
import { assertUrl } from '@test-utils/navigation-helpers';
import { clickIfVisibleOrFallback } from '@test-utils/interactions';
import { validateAttributes } from '@test-utils/attributes';
import { compositeLocator, CompositeLocator } from '@test-utils/core-types';
import { BottomMenu } from './mobileMenu.po';

export class BurgerMenu {
    readonly page: Page;
    readonly bottomMenu: BottomMenu;

    constructor(page: Page) {
        this.page = page;
        this.bottomMenu = new BottomMenu(page);
    }

    //Locators
    private readonly radixImage = compositeLocator(() => this.page.locator('div[id*="radix"] img'), 'Burger menu icon'); //icon burger menu
    
    readonly shortcutButton = compositeLocator(() => this.page.locator('#shortcut-btn-shortcut'), 'Shortcut button');
    readonly search = compositeLocator(() => this.page.locator('input[type="search"]'), 'Search field');
    readonly escape = compositeLocator(() => this.page.locator('.w-[2rem]'), 'Escape button');
    readonly home = compositeLocator(() => this.page.locator('#Burger-menu-nav-link-4'), 'Home button');
    readonly games = compositeLocator(() => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/games"]'), 'Games button');
    readonly liveCasino = compositeLocator(() => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/live-casino/all"]'), 'Live Casino button');
    readonly promotions = compositeLocator(() => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/promotions"]'), 'Promotions button');
    readonly tournaments = compositeLocator(() => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/tournament-promotions"]'), 'Tournaments button');
    readonly vip = compositeLocator(() => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/vip"]'), 'VIP button');
    readonly loyalty = compositeLocator(() => this.page.locator('[class*="mobileMenuNavigationItem"][href*="/loyalty"]'), 'Loyalty button');
    readonly register = compositeLocator(() => this.page.locator('div[class*="burgerMenu_signUp_"]'), 'Register button');
    readonly login = compositeLocator(() => this.page.locator('div[class*="burgerMenu_login_"]'), 'Login button');
    readonly menuWindow = compositeLocator(() => this.page.locator('div[class*="burgerMenu_menuClass_"]'), 'Menu window');
    readonly support = compositeLocator(() => this.page.locator('#Burger-menu-nav-link-log-out'), 'Support button');
    readonly logout = compositeLocator(() => this.page.locator('#Burger-menu-nav-link-log-out\\}'), 'Logout button');
    readonly deposit = compositeLocator(() => this.page.locator('[class*="burgerMenu_deposit_"]'), 'Deposit button');
    readonly buttonImage = compositeLocator(() => this.page.locator(' span img'), 'Button image');
    readonly searchModal = compositeLocator(() => this.page.locator('div[class*="searchModalV3_searchModalWrapper_"]'), 'Search modal');
    readonly searchModalClose = compositeLocator(() => this.page.locator('div[class*="searchModalV3_closeButton_"]'), 'Search modal close button');

 
    //Actions
    @stepParam((...args) => `I click on the ${args[1]} button`)
    private async clickNavigation(locator: CompositeLocator, description: string, url?: string): Promise<void> {
        await clickIfVisibleOrFallback(locator, async () => await this.openBurgerMenu());
        if (url) {
            await assertUrl(this.page, `${process.env.URL}${url}`, true, false);
        }
    }

    public validateBurgerMenuVisible = async (softAssert = false) => await assertVisible(this.menuWindow, softAssert);

    public validateSearchButtonVisible = async (softAssert = false) => await assertVisible(this.search, softAssert);

    public validateHomeButtonVisible = async (softAssert = false) => await assertVisible(this.home, softAssert);

    //TODO: check this works with validate attribute properly 
    public validateHomeButtonImageVisible = async (softAssert = false) =>
        await validateAttributes(compositeLocator(() => this.home.locator().locator(this.buttonImage.locator()), 'Home Button image'), {srcset: null, src: null}, softAssert);

    public validateGamesButtonVisible = async (softAssert = false) => await assertVisible(this.games, softAssert);

    public validateGamesButtonImageVisible = async (softAssert = false) => 
        await validateAttributes(compositeLocator(() => this.games.locator().locator(this.buttonImage.locator()), 'Games Button image'), {srcset: null, src: null}, softAssert);

    public validateLoginButtonVisible = async (softAssert = false) => await assertVisible(this.login, softAssert);

    public validateRegisterButtonVisible = async (softAssert = false) => await assertVisible(this.register, softAssert);

    public validateDepositButtonVisible = async (softAssert = false) => await assertVisible(this.deposit, softAssert);

    public validateSearchField = async (softAssert = false) => await assertVisible(this.searchModal, softAssert);

    public clickShortcutButton = async () => await this.clickNavigation(this.shortcutButton, 'Shortcut Button', '');

    public clickHomeButton = async () => await this.clickNavigation(this.home, 'Home Button', '');

    public clickGamesButton = async () => await this.clickNavigation(this.games, 'Games Button', '/games/all');

    public clickLiveCasinoButton = async () => await this.clickNavigation(this.liveCasino, 'Live Casino', '/live-casino/all');

    public clickPromotionsButton = async () => await this.clickNavigation(this.promotions, 'Promotions', '/promotions');

    public clickTournamentsButton = async () => await this.clickNavigation(this.tournaments, 'Tournaments', '/tournament-promotions');

    public clickVIPButton = async () => await this.clickNavigation(this.vip, 'VIP', '/vip');

    public clickLoyaltyButton = async () => await this.clickNavigation(this.loyalty, 'Loyalty', '/loyalty');

    public clickLoginButton = async () => await this.clickNavigation(this.login, 'Login');

    public clickRegisterButton = async () => await this.clickNavigation(this.register, 'Register');

    public clickSupportButton = async () => await this.clickNavigation(this.support, 'Support');

    public clickLogoutButton = async () => await this.clickNavigation(this.logout, 'Logout');

    public clickDepositButton = async () => await this.clickNavigation(this.deposit, 'Deposit');

    @step('I open the burger menu')
    public async openBurgerMenu(): Promise<void> {
        await this.bottomMenu.validateBurgerButtonVisible(true);
        await this.bottomMenu.clickBurgerMenuButton();
        await this.validateBurgerMenuVisible(true);
    }

    @step('I validate the shortcut button is visible')
    public async validateShortcutButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.shortcutButton, softAssert);
        await assertVisible(compositeLocator(() => this.shortcutButton.locator().locator(this.buttonImage.locator()), 'Shortcut Button image'), softAssert);
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
        await assertVisible(this.liveCasino, softAssert);
        await validateAttributes(compositeLocator(() => this.liveCasino.locator().locator(this.buttonImage.locator()), 'Live Button image'), {srcset: null, src: null}, softAssert);
    }

    @step('I validate the promotions button is visible')
    public async validatePromotionsButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.promotions, softAssert);
        await validateAttributes(compositeLocator(() => this.promotions.locator().locator(this.buttonImage.locator()), 'Promotions Button image'), {srcset: null, src: null}, softAssert);
    }

    @step('I validate the tournaments button is visible')
    public async validateTournamentsButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.tournaments, softAssert);
        await validateAttributes(compositeLocator(() => this.tournaments.locator().locator(this.buttonImage.locator()), 'Tournaments Button image'), {srcset: null, src: null}, softAssert);
    }

    @step('I validate the VIP button is visible')
    public async validateVIPButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.vip, softAssert);
        await validateAttributes(compositeLocator(() => this.vip.locator().locator(this.buttonImage.locator()), 'VIP Button image'), {srcset: null, src: null}, softAssert);
    }

    @step('I validate the loyalty button is visible')
    public async validateLoyaltyButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.loyalty, softAssert);
        await validateAttributes(compositeLocator(() => this.loyalty.locator().locator(this.buttonImage.locator()), 'Loyalty Button image'), {srcset: null, src: null}, softAssert);
    }

    @step('I validate the support button is visible')
    public async validateSupportButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.support, softAssert);
        await validateAttributes(compositeLocator(() => this.support.locator().locator(this.buttonImage.locator()), 'Support Button image'), {srcset: null, src: null}, softAssert);
    }

    @step('I validate the logout button is visible')
    public async validateLogoutButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.logout, softAssert);
        await validateAttributes(compositeLocator(() => this.logout.locator().locator(this.buttonImage.locator()), 'Logout Button image'), {srcset: null, src: null}, softAssert);
    }

    @step('I click on the search button')
    public async clickSearchField(softAssert = false): Promise<void> {
        await this.clickNavigation(this.search, 'Search Button');
        await assertVisible(this.searchModal, softAssert);
        await this.searchModalClose.locator().click();
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
