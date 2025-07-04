import { Page } from '@playwright/test';
import {
    step,
    assertVisible,
    clickElement,
    assertNotVisible,
    compositeLocator,
    CompositeLocator,
} from '@test-utils/navigation.po';

export class MenuItems {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    // Locators

    //Both
    private readonly register = compositeLocator(() => 
        this.page.locator('.shadow-header button.min-w-max.inline-flex.bg-primary'), 'Register button');
    private readonly login = compositeLocator(() => 
        this.page.locator('button.bg-secondary-secondary:nth-child(2)'), 'Login button');
    private readonly balance = compositeLocator(() => 
        this.page.locator('.shadow-header div[id*=radix]'), 'Balance');
    private readonly myProfileButton = compositeLocator(() => 
        this.page.locator('.bg-tertiary-secondary.shadow-sm.text-greyLight'), 'My Profile button');

    //Desktop specific
    private readonly depositDesktop = compositeLocator(() => 
        this.page.locator('.shadow-header [aria-haspopup=dialog].bg-primary'), 'Deposit button (Desktop)');
    private readonly myBetsButtonDesktop = compositeLocator(() => 
        this.page.locator('.shadow-header [aria-haspopup=dialog].bg-secondary-secondary'), 'My Bets button (Desktop)');
    private readonly burgerMenuButtonDesktop = compositeLocator(() => 
        this.page.locator('.shadow-header button.bg-tertiary-secondary.lg\\:flex'), 'Burger Menu button (Desktop)');
    private readonly logo = compositeLocator(() => 
        this.page.locator('[alt*="Website logo"].sm\\:block'), 'Website logo (Desktop)');

    //Mobile specific  
    private readonly depositMobile = compositeLocator(() => 
        this.page.locator('.shadow-header span.bg-primary'), 'Deposit button (Mobile)');
    private readonly myBetsButtonMobile = compositeLocator(() => 
        this.page.locator('.shadow-header .rounded-none'), 'My Bets button (Mobile)');
    private readonly burgerMenuButtonMobile = compositeLocator(() => 
        this.page.locator('.shadow-header button.bg-tertiary-secondary.lg\\:hidden'), 'Burger Menu button (Mobile)');
    private readonly logoMobile = compositeLocator(() => 
        this.page.locator('[alt*="Website logo"].sm\\:hidden'), 'Website logo (Mobile)');

    // Viewport-aware getters
    private readonly deposit = async (): Promise<CompositeLocator> => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.depositDesktop : this.depositMobile;
    };
    private readonly myBetsButton = async (): Promise<CompositeLocator> => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.myBetsButtonDesktop : this.myBetsButtonMobile;
    };
    private readonly burgerMenuButton = async (): Promise<CompositeLocator> => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.burgerMenuButtonDesktop : this.burgerMenuButtonMobile;
    };
       
    private readonly logoElement = async (): Promise<CompositeLocator> => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.logo : this.logoMobile;
    };

    //Desktop only
    private readonly searchImageDesktop = compositeLocator(() => 
        this.page.locator('.pointer-events-auto svg'), 'Search image (Desktop)');
    private readonly searchButtonDesktop = compositeLocator(() => 
        this.page.locator('.ml-auto .relative input'), 'Search button (Desktop)');

    
    // Actions
    public clickLogin = async () => await clickElement(this.login);
    public clickRegister = async () => await clickElement(this.register);
    public clickLogo = async () => await clickElement(await this.logoElement());
    public clickMyProfileButton = async () => await clickElement(this.myProfileButton);
    public clickDepositButton = async () => await clickElement(await this.deposit());
    public clickBalanceButton = async () => await clickElement(this.balance);

    public async navigateToPage(target: 'logo' | 'myProfile' | 'deposit'): Promise<void> {
        const navigationMap = {
            'logo': () => this.clickLogo(),
            'myProfile': () => this.clickMyProfileButton(),
            'deposit': () => this.clickDepositButton()
        } as const;
        
        await navigationMap[target]();
    }

    @step('I validate the menu items for a logged-in user')
    public async validateUserItems(softAssert = false): Promise<void> {
        await assertVisible(this.myProfileButton, softAssert);
        await assertVisible(this.balance, softAssert);
        await assertVisible(await this.deposit(), softAssert);
        await assertVisible(await this.myBetsButton(), softAssert);
        await assertVisible(await this.burgerMenuButton(), softAssert);
        await assertNotVisible(this.login, softAssert);
        await assertNotVisible(this.register, softAssert);
    }

    @step('I validate the menu items for a Guest')
    public async validateGuestItems(softAssert = false): Promise<void> {
        await assertVisible(this.login, softAssert);
        await assertVisible(this.register, softAssert);
        await assertNotVisible(this.myProfileButton, softAssert);
        await assertNotVisible(this.balance, softAssert);
        await assertNotVisible(await this.deposit(), softAssert);
        await assertNotVisible(await this.myBetsButton(), softAssert);
    }
}
