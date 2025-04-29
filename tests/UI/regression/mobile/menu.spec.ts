import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.randomBannerNewDesign();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
});

test.describe("Menu Regression Tests - Mobile", () => {
    test.beforeAll(({ }, testInfo) => {
        if (!testInfo.project.name.includes('mobile')) { test.skip(); }
    });

    test("Validate header menu navigation for a member", async ({ burgerMenu, page }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
        await burgerMenu.openBurgerMenu();
        await burgerMenu.validateBottomNavMenuVisible(true);
        await burgerMenu.clickSearchField(true);
        await page.reload();

        await burgerMenu.clickHomeButton();
        await burgerMenu.clickGamesButton();
        await burgerMenu.clickPromotionsButton();
        await burgerMenu.clickVIPButton();
        await burgerMenu.clickLoyaltyButton();
        await burgerMenu.clickSupportButton();
        await burgerMenu.clickDepositButton();
        await burgerMenu.clickLogoutButton();
    });

    test.describe("Guest", () => {
        test.use({ storageState: "playwright/.auth/noAuthentication.json" });
        test("Validate header menu navigation for a guest", async ({ burgerMenu, page }) => {
            await burgerMenu.openBurgerMenu();
            await burgerMenu.validateBottomNavMenuVisible(true);
            await burgerMenu.clickSearchField(true);
            await page.reload();
            await burgerMenu.clickHomeButton(true);
            await burgerMenu.clickGamesButton(true);
            await burgerMenu.clickPromotionsButton(true);
            await burgerMenu.clickVIPButton(true);
            await burgerMenu.clickLoyaltyButton(true);
            await burgerMenu.clickSupportButton(true);
        });
    });
});
