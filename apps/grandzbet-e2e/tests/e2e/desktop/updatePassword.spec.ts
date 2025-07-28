import test from '../../../pages/base/base.po';

test.beforeEach(async ({ page }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
});

test.skip("Update password e2e", async ({ menuItems, loginPage, personalInfo, profileMenu }) => {
        const newPassword = `${process.env.PASS}_new`;
		const oldPassword = `${process.env.PASS}`;

		await menuItems.clickMyProfileButton();
        await profileMenu.clickPersonalInfoButton();

        await personalInfo.fillOldPassword(oldPassword);
        await personalInfo.fillNewPassword(newPassword);
        await personalInfo.fillConfirmPassword(newPassword);
        await personalInfo.clickUpdatePasswordButton();
        await personalInfo.validatePasswordChangeSuccessToast();

		await menuItems.clickMyProfileButton();
		await profileMenu.clickLogoutButton();
		await menuItems.clickLogin();
		await loginPage.actionLogin(`${process.env.USER}`, newPassword);

		await menuItems.clickMyProfileButton();
        await profileMenu.clickPersonalInfoButton();

        await personalInfo.fillOldPassword(newPassword);
        await personalInfo.fillNewPassword(oldPassword);
        await personalInfo.fillConfirmPassword(oldPassword);
        await personalInfo.clickUpdatePasswordButton();
        await personalInfo.validatePasswordChangeSuccessToast();
});


