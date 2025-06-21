import { Page } from '@playwright/test';
import {
    step,
    assertVisible,
    clickElement,
} from '@test-utils/navigation.po';

export class NavigationItems {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private readonly desktop = () => this.page.locator('.lg\\:flex');
    private readonly mobile = () => this.page.locator('.bg-tertiary-secondary');
    
    private readonly vipDesktop = () => this.desktop().locator('a[href="/vip"]');
    private readonly promotionsDesktop = () => this.desktop().locator('a[href="/promotions"]');
    private readonly sportsBettingDesktop = () => this.desktop().locator('a[href="/sports-betting#/live"]');
    private readonly sportsBettingOverviewDesktop = () => this.desktop().locator('a[href="/sports-betting#/overview"]');
    private readonly liveCasinoDesktop = () => this.desktop().locator('a[href="/games/live-casino"]');
    private readonly casinoDesktop = () => this.desktop().locator('a[href="/games"]');

    private readonly vipMobile = () => this.mobile().locator('a[href="/vip"]');
    private readonly promotionsMobile = () => this.mobile().locator('a[href="/promotions"]');
    private readonly sportsBettingMobile = () => this.mobile().locator('a[href="/sports-betting#/live"]');
    private readonly sportsBettingOverviewMobile = () => this.mobile().locator('a[href="/sports-betting#/overview"]');
    private readonly liveCasinoMobile = () => this.mobile().locator('a[href="/games/live-casino"]');
    private readonly casinoMobile = () => this.mobile().locator('a[href="/games"]');

    private readonly vip = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.vipDesktop() : this.vipMobile();
    };
    private readonly promotions = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.promotionsDesktop() : this.promotionsMobile();
    };
    private readonly sportsBetting = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.sportsBettingDesktop() : this.sportsBettingMobile();
    };
    private readonly sportsBettingOverview = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.sportsBettingOverviewDesktop() : this.sportsBettingOverviewMobile();
    };
    private readonly liveCasino = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.liveCasinoDesktop() : this.liveCasinoMobile();
    };
    private readonly casino = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.casinoDesktop() : this.casinoMobile();
    };

    // Actions
    public clickCasinoButton = async () => await clickElement(await this.casino(), 'Casino button');
    public clickLiveCasinoButton = async () => await clickElement(await this.liveCasino(), 'Live Casino button');
    public clickSportsBettingButton = async () => await clickElement(await this.sportsBetting(), 'Sports Betting button');
    public clickSportsBettingOverviewButton = async () => await clickElement(await this.sportsBettingOverview(), 'Sports Betting Overview button');
    public clickPromotionsButton = async () => await clickElement(await this.promotions(), 'Promotions button');
    public clickVipButton = async () => await clickElement(await this.vip(), 'VIP button');

    // Add navigation method that accepts target
    public async navigateToPage(target: 'casino' | 'promotions' | 'liveCasino' | 'sportsBetting' | 'sportsBettingOverview' | 'vip'): Promise<void> {
        const navigationMap = {
            'casino': () => this.clickCasinoButton(),
            'promotions': () => this.clickPromotionsButton(),
            'liveCasino': () => this.clickLiveCasinoButton(),
            'sportsBetting': () => this.clickSportsBettingButton(),
            'sportsBettingOverview': () => this.clickSportsBettingOverviewButton(),
            'vip': () => this.clickVipButton()
        } as const;
        
        await navigationMap[target]();
    }

    @step('I validate the header navigation items are visible')
    public async validateItemsVisible(softAssert = true): Promise<void> {
        await assertVisible(await this.vip(), 'VIP link', softAssert);
        await assertVisible(await this.promotions(), 'Promotions link', softAssert);
        await assertVisible(await this.sportsBetting(), 'Sports Betting link', softAssert);
        await assertVisible(await this.sportsBettingOverview(), 'Sports Betting Overview link', softAssert);
        await assertVisible(await this.liveCasino(), 'Live Casino link', softAssert);
        await assertVisible(await this.casino(), 'Casino link', softAssert);
    }
}
