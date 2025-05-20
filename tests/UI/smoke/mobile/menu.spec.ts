import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.randomBannerNewDesign();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
});

test.describe("Menu Smoke Tests - Mobile", () => {

    test("Validate menu elements for a member", async ({ burgerMenu, bottomMenu }) => {
        await bottomMenu.validateMenuElementsForMember(true);
        await burgerMenu.openBurgerMenu();
        await burgerMenu.validateMenuElementsForMember(true);
    });

    test.describe("Guest", () => {
        test.use({ storageState: "playwright/.auth/noAuthentication.json" });
        test("Validate header elements for a guest", async ({ burgerMenu, bottomMenu }) => {
            await bottomMenu.validateMenuElementsForGuest(true);
            await burgerMenu.openBurgerMenu();
            await burgerMenu.validateMenuElementsForGuest(true);
        });
    });
});
