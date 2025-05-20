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

    test("Validate menu navigation for a member", async ({ burgerMenu, page, cashierMain }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
        await burgerMenu.openBurgerMenu();
        await burgerMenu.validateMenuElementsForMember(true);
        await burgerMenu.clickSearchField(true);
        await page.reload();
        await burgerMenu.clickHomeButton();
        await burgerMenu.clickGamesButton();
        //await burgerMenu.clickPromotionsButton(); //FIXME: something is wrong here.
        await burgerMenu.clickVIPButton();
        await burgerMenu.clickLoyaltyButton();
        await burgerMenu.clickDepositButton(); //TODO: there is no major validation.
        await cashierMain.validateModalBodyVisible();
        await cashierMain.clickCloseButton();
        await burgerMenu.clickSupportButton();
        await page.reload();
        await burgerMenu.clickLogoutButton();//TODO: there is no major validation.
    });

    test.describe("Guest", () => {
        test.use({ storageState: "playwright/.auth/noAuthentication.json" });
        test("Validate header menu navigation for a guest", async ({ burgerMenu, page }) => {
            await burgerMenu.openBurgerMenu();
            await burgerMenu.validateMenuElementsForGuest(true);
            await burgerMenu.clickSearchField(true);
            await page.reload();
            await burgerMenu.clickHomeButton();
            await burgerMenu.clickGamesButton();
            await burgerMenu.clickPromotionsButton();
            await burgerMenu.clickVIPButton();
            await burgerMenu.clickLoyaltyButton();
            await burgerMenu.clickSupportButton();
            //TODO: login, register
        });
    });
});
