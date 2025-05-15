import test, { expect } from "../../pages/utils/base.po";
/*
test.beforeEach(async ({ page, banner, context }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.randomBannerNewDesign();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    //await context.tracing.start({ screenshots: true, snapshots: true });
});


test.describe("Menu Smoke Tests", () => {
    test.describe("Desktop", () => {
        test.beforeAll(({ }, testInfo) => {
            if (!testInfo.project.name.includes('desktop')) { test.skip(); }
        });

        test("Validate header elements for a member", async ({ headerMenuDesktop, page }) => {
            await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
            await headerMenuDesktop.validateLoggedInState(true);
            //TODO: validate shortcut and search
        });

        test.describe("Guest", () => {
            test.use({ storageState: "playwright/.auth/noAuthentication.json" });
            test("Validate header elements for a guest", async ({ headerMenuDesktop, page }) => {
                await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
                await headerMenuDesktop.validateLoggedOutState(true);
                //TODO: validate search

            });
        });
    });

    test.describe("Mobile", () => {
        test.beforeAll(({ }, testInfo) => {
            if (!testInfo.project.name.includes('mobile')) { test.skip(); }
        });

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
});


test.describe("Menu Regression Tests", () => {
    test.describe("Desktop tests", () => {
        test.beforeAll(({ }, testInfo) => {
            if (!testInfo.project.name.includes('desktop')) { test.skip(); }
        });

        test.use({ storageState: "playwright/.auth/noAuthentication.json" });
        test("Validate header menu navigation for a guest", async ({ headerMenuDesktop, page }) => {
            await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
            await headerMenuDesktop.clickSFLogo();
            //await headerMenuDesktop.clickCrashButton(); //FIXME: does not work in france region
            await headerMenuDesktop.clickLiveButton();
            await headerMenuDesktop.clickTournamentButton();
            await headerMenuDesktop.clickGamesButton();
            await headerMenuDesktop.clickPromotionsButton();
            await headerMenuDesktop.clickVIPButton();
            await headerMenuDesktop.clickLoyaltyButton();
        });

        test("Validate header menu navigation for a member", async ({ headerMenuDesktop, page }) => {
            await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
            await headerMenuDesktop.clickSFLogo();
            //await headerMenuDesktop.clickCrashButton(); //FIXME: does not work in france
            await headerMenuDesktop.clickLiveButton();
            await headerMenuDesktop.clickTournamentButton();
            await headerMenuDesktop.clickGamesButton();
            await headerMenuDesktop.clickPromotionsButton();
            await headerMenuDesktop.clickVIPButton();
            await headerMenuDesktop.clickLoyaltyButton();
        });
    });

    test.describe("Mobile tests", () => {
        test.beforeAll(({ }, testInfo) => {
            if (!testInfo.project.name.includes('mobile')) { test.skip(); }
        });

        test("Validate header menu navigation for a member", async ({ burgerMenu, page }) => {
            await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
            await burgerMenu.openBurgerMenu();
            await burgerMenu.validateMenuElementsForMember(true);
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
                await burgerMenu.validateMenuElementsForGuest(true);
                await burgerMenu.clickSearchField();
                await page.reload();
                await burgerMenu.clickHomeButton();
                await burgerMenu.clickGamesButton(); 
                await burgerMenu.clickPromotionsButton(); 
                await burgerMenu.clickVIPButton();
                await burgerMenu.clickLoyaltyButton(); 
                await burgerMenu.clickSupportButton();
                //TODO: click register, login, deposit
            });
        });
    });
});
*/