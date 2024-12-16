import { Page, Locator } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';
import { BottomMenu } from './bottomMenu.po';
import { LoginPage } from '../loginPage.po';
import { SignUp } from '../signUp/signUpPage.po';

import { SignUpFirstStep } from '../signUp/signUpFirstStep.po';

export class BurgerMenu {
    readonly page: Page;
    readonly navigation: Navigation;
    readonly loginPage: LoginPage;
    readonly signupPage: SignUp;
    readonly bottomMenu: BottomMenu;
    readonly signUpFirstStep: SignUpFirstStep;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
        this.signupPage = new SignUp(page);
        this.loginPage = new LoginPage(page);
        this.bottomMenu = new BottomMenu(page);
        this.signUpFirstStep = new SignUpFirstStep(page);
    }

    readonly shortcutButton = () => this.page.locator('#shortcut-btn-shortcut');
    readonly search = () => this.page.locator('input[type="search"]');
    readonly escape = () => this.page.locator('.w-\[2rem\]');
    readonly home = () => this.page.locator('[class*="mobileMenuNavigationItem"][href="/"]');
    readonly games = () => this.page.locator('[class*="mobileMenuNavigationItem"][href="/games"]');
    readonly liveCasino = () => this.page.locator('[class*="mobileMenuNavigationItem"][href="/live-casino/all"]');
    readonly promotions = () => this.page.locator('[class*="mobileMenuNavigationItem"][href="/promotions"]');
    readonly tournaments = () => this.page.locator('[class*="mobileMenuNavigationItem"][href="/tournament-promotions"]');
    readonly vip = () => this.page.locator('[class*="mobileMenuNavigationItem"][href="/vip"]');
    readonly loyalty = () => this.page.locator('[class*="mobileMenuNavigationItem"][href="/loyalty"]');
    readonly register = () => this.page.locator('div[class*="burgerMenu_signUp_"]');
    readonly login = () => this.page.locator('div[class*="burgerMenu_login_"]');
    readonly menuWindow = () => this.page.locator('div[class*="burgerMenu_menuClass_"]');
    //TODO: myAccount  = 
    readonly support = () => this.page.locator('#Burger-menu-nav-link-log-out');
    readonly logout = () => this.page.locator('#Burger-menu-nav-link-log-out\\}');
    readonly deposit = () => this.page.locator('[class*="burgerMenu_deposit_"]');
    readonly buttonImage = () => this.page.locator(' span img');
    readonly searchModal = () => this.page.locator('div[class*="searchModalV3_searchModalWrapper_"]');
    readonly searchModalClose = () => this.page.locator('div[class*="searchModalV3_closeButton_"]');

 
    // General helper to click an element, falling back to open the burger menu if necessary
    @stepParam((locator: Locator, softAssert = false, name?: string) => `I click the ${name} button`)
    private async clickNavigation(locator: Locator, softAssert = false, name: string): Promise<void> {
        await this.navigation.clickIfVisibleOrFallback(locator, async () => await this.openBurgerMenu(), softAssert, name);
    }

    @step('I open the burger menu')
    public async openBurgerMenu(): Promise<void> {
        await this.bottomMenu.validateBurgerButtonVisible(true);
        await this.bottomMenu.clickBurgerMenuButton(true);
        await this.validateBottomNavMenuVisible(true);
    }

    public async validateBottomNavMenuVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.menuWindow(), softAssert, 'Menu window');
    }

    public async validateShortcutButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.shortcutButton(), softAssert, 'Shortcut Button');
        await this.navigation.assertVisible(this.shortcutButton().locator(this.buttonImage()), 
            softAssert, 'Shortcut Button image');
    }

    public async validateSearchButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.search(), softAssert, 'Search Button');
    }

    @step('I validate the home button is visible')
        public async validateHomeButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.home(), softAssert, 'Home Button');
        await this.navigation.assertVisible(this.home().locator(this.buttonImage()),
            softAssert, 'Home Button image');
        await this.navigation.assertAttribute(this.home().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.home().locator(this.buttonImage()), 'src');
    }

    @step('I validate the games button is visible')
    public async validateGamesButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.games(), softAssert, 'Games Button');
        await this.navigation.assertVisible(this.games().locator(this.buttonImage()), 
            softAssert, 'Games Button image');
        await this.navigation.assertAttribute(this.games().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.games().locator(this.buttonImage()), 'src');
    }

    @step('I validate the live casino button is visible')
    public async validateLiveCasinoButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.liveCasino(), softAssert, 'Live Casino Button');
        await this.navigation.assertVisible(this.liveCasino().locator(this.buttonImage()), 
            softAssert, 'Live Casino Button image');
        await this.navigation.assertAttribute(this.liveCasino().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.liveCasino().locator(this.buttonImage()), 'src');
    }

    @step('I validate the promotions button is visible')
    public async validatePromotionsButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.promotions(), softAssert, 'Promotions Button');
        await this.navigation.assertVisible(this.promotions().locator(this.buttonImage()), 
            softAssert, 'Promotions Button image');
        await this.navigation.assertAttribute(this.promotions().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.promotions().locator(this.buttonImage()), 'src');
    }

    @step('I validate the tournaments button is visible')
    public async validateTournamentsButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.tournaments(), softAssert, 'Tournaments Button');
        await this.navigation.assertVisible(this.tournaments().locator(this.buttonImage()), 
            softAssert, 'Tournaments Button image');
        await this.navigation.assertAttribute(this.tournaments().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.tournaments().locator(this.buttonImage()), 'src');
    }

    @step('I validate the VIP button is visible')
    public async validateVIPButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.vip(), softAssert, 'VIP Button');
        await this.navigation.assertVisible(this.vip().locator(this.buttonImage()), 
            softAssert, 'VIP Button image');
        await this.navigation.assertAttribute(this.vip().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.vip().locator(this.buttonImage()), 'src');
    }

    @step('I validate the loyalty button is visible')
    public async validateLoyaltyButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.loyalty(), softAssert, 'Loyalty Button');
        await this.navigation.assertVisible(this.loyalty().locator(this.buttonImage()), 
            softAssert, 'Loyalty Button image');
        await this.navigation.assertAttribute(this.loyalty().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.loyalty().locator(this.buttonImage()), 'src');
    }

    public async validateLoginButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.login(), softAssert, 'Login Button');
    }

    public async validateRegisterButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.register(), softAssert, 'Register Button');
    }

    @step('I validate the support button is visible')
    public async validateSupportButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.support(), softAssert, 'Support Button');
        await this.navigation.assertVisible(this.support().locator(this.buttonImage()), 
            softAssert, 'Support Button image');
        await this.navigation.assertAttribute(this.support().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.support().locator(this.buttonImage()), 'src');
    }

    @step('I validate the logout button is visible')
    public async validateLogoutButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.logout(), softAssert, 'Logout Button');
        await this.navigation.assertVisible(this.logout().locator(this.buttonImage()), 
            softAssert, 'Logout Button image');
        await this.navigation.assertAttribute(this.logout().locator(this.buttonImage()), 'srcset');
        await this.navigation.assertAttribute(this.logout().locator(this.buttonImage()), 'src');
    }

    public async validateDepositButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.deposit(), softAssert, 'Deposit Button');
    }

    public async fillSearchField(value: string, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.searchModal(), softAssert, 'Search Modal');
    }

    public async clickShortcutButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.shortcutButton(), softAssert, 'Shortcut Button');
    }


    public async clickSearchField(softAssert = false): Promise<void> {
        await this.clickNavigation(this.search(), softAssert, 'Search Button');
        await this.navigation.assertVisible(this.searchModal(), softAssert, 'Search Modal');
        await this.searchModalClose().click();
    }

    public async clickHomeButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.home(), softAssert, 'Home Button');
        await this.navigation.assertUrl(`${process.env.URL}`, softAssert);
    }

    public async clickGamesButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.games(), softAssert, 'Games Button');
        await this.navigation.assertUrl(`${process.env.URL}games/all`, softAssert);
    }

    public async clickLiveCasinoButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.liveCasino(), softAssert, 'Live Casino Button');
        await this.navigation.assertUrl(`${process.env.URL}live-casino/all`, softAssert);
    }

    public async clickPromotionsButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.promotions(), softAssert, 'Promotions Button');
        await this.navigation.assertUrl(`${process.env.URL}promotions`, softAssert);
    }

    public async clickTournamentsButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.tournaments(), softAssert, 'Tournaments Button');
        await this.navigation.assertUrl(`${process.env.URL}tournament-promotions`, softAssert);
    }

    public async clickVIPButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.vip(), softAssert, 'VIP Button');
        await this.navigation.assertUrl(`${process.env.URL}vip`, softAssert);
    }

    public async clickLoyaltyButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.loyalty(), softAssert, 'Loyalty Button');
        await this.navigation.assertUrl(`${process.env.URL}loyalty`, softAssert);
    }

    public async clickLoginButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.login(), softAssert, 'Login Button');
        await this.loginPage.validateLoginWindowElementsVisible(softAssert);
        await this.loginPage.clickBackButton();
    }

    public async clickRegisterButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.register(), softAssert, 'Register Button');
        await this.signUpFirstStep.validatePageElements();
        await this.signupPage.successEscapeButton().click();
    }

    public async clickSupportButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.support(), softAssert, 'Support Button');
        await this.navigation.assertVisible(this.page.locator('div[data-embed*="chat"]'), softAssert, 'Support Page');
        await this.navigation.clickElement(this.page.locator('button[aria-label*="Minimize widget"]'), softAssert, 'Support Page');
    }

    public async clickLogoutButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.logout(), softAssert, 'Logout Button');
        await this.loginPage.validateMobileLoginState(false);
    }

    public async clickDepositButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.deposit(), softAssert, 'Deposit Button');
        await expect(this.page.locator('div[class*="walletModal_modalContent_"]'), 'Expect walet modal to be visible').toBeVisible();
        await this.navigation.clickElement(this.page.locator('div[class*="walletModal_closeBtn_"]'), false, 'Close Button') //TODO: 
    }


    @step('I validate the menu elements for a guest')
    public async validateMenuElementsForGuest(softAssert :boolean): Promise<void> {
            await this.validateBottomNavMenuVisible(true);
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
            await this.validateBottomNavMenuVisible(true);
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
