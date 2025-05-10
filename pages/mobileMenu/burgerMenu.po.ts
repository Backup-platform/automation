import { Page, Locator } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam, assertAttribute, assertElementContainsText, clickElement, assertVisible, assertNotVisible, fillInputField, assertEditable, assertEnabled, assertNotEnabled, clickIfVisibleOrFallback, validateAttributes } from '../utils/navigation.po';
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

    //Locators 
    // TODO: make images etc separate locators so the method actions are reusable
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

 
    //TODO: 
    //Actions
    private clickNavigation = async (locator: Locator, description: string) =>
        await clickIfVisibleOrFallback(locator, async () => await this.openBurgerMenu(), description);

    public validateBottomNavMenuVisible = async (softAssert = false) => 
        await assertVisible(this.menuWindow(), softAssert, 'Menu window');

    public validateSearchButtonVisible = async (softAssert = false) => 
        await assertVisible(this.search(), softAssert, 'Search Button');

    public validateHomeButtonVisible = async (softAssert = false) => 
        await assertVisible(this.home(), softAssert, 'Home Button');

    public validateHomeButtonImageVisible = async (softAssert = false) => 
        await validateAttributes(this.home().locator(this.buttonImage()), 
        'Home Button image', {srcset: null, src: null});

    public validateGamesButtonVisible = async (softAssert = false) => 
        await assertVisible(this.games(), softAssert, 'Games Button');

    public validateGamesButtonImageVisible = async (softAssert = false) => 
        await validateAttributes(this.games().locator(this.buttonImage()), 
        'Games Button image', {srcset: null, src: null}, softAssert);

    public validateLoginButtonVisible = async (softAssert = false) => 
        await assertVisible(this.login(), softAssert, 'Login Button');

    public validateRegisterButtonVisible = async (softAssert = false) => 
        await assertVisible(this.register(), softAssert, 'Register Button');

    public validateDepositButtonVisible  = async (softAssert = false) => 
        await assertVisible(this.deposit(), softAssert, 'Deposit Button');

    public fillSearchField = async (value: string, softAssert = false) => 
        await assertVisible(this.searchModal(), softAssert, 'Search Modal');

    public clickShortcutButton = async (softAssert = false) => 
        await this.clickNavigation(this.shortcutButton(), 'Shortcut Button');

    public async clickHomeButton(softAssert = false) : Promise<void> {
        await this.clickNavigation(this.home(), 'Home Button');
        await this.navigation.assertUrl(`${process.env.URL}`, softAssert);
    }

    public async clickGamesButton(softAssert = false) : Promise<void> {
        await this.clickNavigation(this.games(), 'Games Button');
        await this.navigation.assertUrl(`${process.env.URL}games/all`, softAssert);
    }

    public async clickLiveCasinoButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.liveCasino(), 'Live Casino Button');
        await this.navigation.assertUrl(`${process.env.URL}live-casino/all`, softAssert);
    }

    public async clickPromotionsButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.promotions(), 'Promotions Button');
        await this.navigation.assertUrl(`${process.env.URL}promotions`, softAssert);
    }

    public async clickTournamentsButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.tournaments(), 'Tournaments Button');
        await this.navigation.assertUrl(`${process.env.URL}tournament-promotions`, softAssert);
    }

    public async clickVIPButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.vip(), 'VIP Button');
        await this.navigation.assertUrl(`${process.env.URL}vip`, softAssert);
    }

    public async clickLoyaltyButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.loyalty(), 'Loyalty Button');
        await this.navigation.assertUrl(`${process.env.URL}loyalty`, softAssert);
    }

    @step('I click on the my bonuses button')
    public async clickLoginButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.login(), 'Login Button');
        await this.loginPage.validateLoginWindowElementsVisible(softAssert);
        await this.loginPage.clickBackButton();
    }

    @step('I click on the register button')
    public async clickRegisterButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.register(), 'Register Button');
        await this.signUpFirstStep.validatePageElements();
        await this.signupPage.successEscapeButton().click();
    }

    //TODO: this needs to be a locator
    public async clickSupportButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.support(), 'Support Button');
        await assertVisible(this.page.locator('div[data-embed*="chat"]'), softAssert, 'Support Page');
        await clickElement(this.page.locator('button[aria-label*="Minimize widget"]'), 'Support Page');
    }

    public async clickLogoutButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.logout(), 'Logout Button');
        await this.loginPage.validateMobileLoginState(false);
    }

    //TODO: needs locator
    public async clickDepositButton(softAssert = false): Promise<void> {
        await this.clickNavigation(this.deposit(), 'Deposit Button');
        await expect(this.page.locator('div[class*="walletModal_modalContent_"]'), 'Expect walet modal to be visible').toBeVisible();
        await clickElement(this.page.locator('div[class*="walletModal_closeBtn_"]'), 'Close Button') //TODO: 
    }

    @step('I open the burger menu')
    public async openBurgerMenu(): Promise<void> {
        await this.bottomMenu.validateBurgerButtonVisible(true);
        await this.bottomMenu.clickBurgerMenuButton(true);
        await this.validateBottomNavMenuVisible(true);
    }

    @step('I validate the shortcut button is visible')
    public async validateShortcutButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.shortcutButton(), softAssert, 'Shortcut Button');
        await assertVisible(this.shortcutButton().locator(this.buttonImage()), 
            softAssert, 'Shortcut Button image');
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
        await assertVisible(this.liveCasino(), softAssert, 'Live Casino Button');
        await validateAttributes(this.liveCasino().locator(this.buttonImage()), 'Live Button image', {srcset: null, src: null});
    }

    @step('I validate the promotions button is visible')
    public async validatePromotionsButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.promotions(), softAssert, 'Promotions Button');
        await assertVisible(this.promotions().locator(this.buttonImage()), 
            softAssert, 'Promotions Button image');
        await assertAttribute(this.promotions().locator(this.buttonImage()), 'srcset');
        await assertAttribute(this.promotions().locator(this.buttonImage()), 'src');
    }

    @step('I validate the tournaments button is visible')
    public async validateTournamentsButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.tournaments(), softAssert, 'Tournaments Button');
        await assertVisible(this.tournaments().locator(this.buttonImage()), 
            softAssert, 'Tournaments Button image');
        await assertAttribute(this.tournaments().locator(this.buttonImage()), 'srcset');
        await assertAttribute(this.tournaments().locator(this.buttonImage()), 'src');
    }

    @step('I validate the VIP button is visible')
    public async validateVIPButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.vip(), softAssert, 'VIP Button');
        await assertVisible(this.vip().locator(this.buttonImage()), 
            softAssert, 'VIP Button image');
        await assertAttribute(this.vip().locator(this.buttonImage()), 'srcset');
        await assertAttribute(this.vip().locator(this.buttonImage()), 'src');
    }

    @step('I validate the loyalty button is visible')
    public async validateLoyaltyButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.loyalty(), softAssert, 'Loyalty Button');
        await assertVisible(this.loyalty().locator(this.buttonImage()), 
            softAssert, 'Loyalty Button image');
        await assertAttribute(this.loyalty().locator(this.buttonImage()), 'srcset');
        await assertAttribute(this.loyalty().locator(this.buttonImage()), 'src');
    }

    @step('I validate the support button is visible')
    public async validateSupportButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.support(), softAssert, 'Support Button');
        await assertVisible(this.support().locator(this.buttonImage()), 
            softAssert, 'Support Button image');
        await assertAttribute(this.support().locator(this.buttonImage()), 'srcset');
        await assertAttribute(this.support().locator(this.buttonImage()), 'src');
    }

    @step('I validate the logout button is visible')
    public async validateLogoutButtonVisible(softAssert = false): Promise<void> {
        await assertVisible(this.logout(), softAssert, 'Logout Button');
        await assertVisible(this.logout().locator(this.buttonImage()), 
            softAssert, 'Logout Button image');
        await assertAttribute(this.logout().locator(this.buttonImage()), 'srcset');
        await assertAttribute(this.logout().locator(this.buttonImage()), 'src');
    }

    @step('I click on the search button')
    public async clickSearchField(softAssert = false): Promise<void> {
        await this.clickNavigation(this.search(), 'Search Button');
        await assertVisible(this.searchModal(), softAssert, 'Search Modal');
        await this.searchModalClose().click();
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
