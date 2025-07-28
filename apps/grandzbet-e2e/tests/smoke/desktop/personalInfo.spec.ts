import test from '../../../pages/base/base.po';

test.beforeEach(async ({ page, personalInfo }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
    await personalInfo.navigateToPage();
});

test.describe("Login Page Smoke Tests", () => {

	test.only("Validate personal info page", async ({ personalInfo }) => {
		await personalInfo.validateAccountInfoFieldsVisible();
        await personalInfo.validateAccountInfoFieldsDisabled();
        await personalInfo.validateAccountInfoFieldsNotEditable();
        await personalInfo.validatePasswordFieldsVisible();
		await personalInfo.validatePasswordFieldsEnabled();
        await personalInfo.validatePasswordFieldsEditable();
        await personalInfo.isUpdatePasswordButtonDisabled();
	});

    test("Validate communications preferences", async ({ personalInfo }) => {
        await personalInfo.checkEmailOffers();
        await personalInfo.checkSmsOffers();
        
        await personalInfo.navigateToPage();
        await personalInfo.validateEmailOffersChecked();
        await personalInfo.validateSmsOffersChecked();
        await personalInfo.uncheckEmailOffers();
        await personalInfo.uncheckSmsOffers();

        await personalInfo.navigateToPage();
        await personalInfo.validateEmailOffersUnchecked();
        await personalInfo.validateSmsOffersUnchecked();
        await personalInfo.checkEmailOffers();
        await personalInfo.checkSmsOffers();

        await personalInfo.navigateToPage();
        await personalInfo.validateEmailOffersChecked();
        await personalInfo.validateSmsOffersChecked();
	});

});