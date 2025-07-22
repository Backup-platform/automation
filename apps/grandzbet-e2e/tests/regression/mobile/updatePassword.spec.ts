import test from '../../../pages/base/base.po';

test.beforeEach(async ({ page, popupHandlers }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
  	await popupHandlers.handleAllPopups();
});

test.describe("Update Password error validations", () => {

	const newPassword = `${process.env.PASS}_new`;
	const oldPassword = `${process.env.PASS}`;
    const confirmPasswordNotMatching = `${process.env.PASS}_not_matching`; 
	const invalidPassword = ['Passw1@', 'PASSWORD1@', 'password1@', 'Password@', 'Парола1'];

	test("Update password with invalid new password", async ({ menuItems, personalInfo, profileMenu }) => {
		await menuItems.clickMyProfileButton();
		await profileMenu.clickPersonalInfoButton();
		await personalInfo.fillAndValidateNewPasswordError(invalidPassword, true);	
	});

	test("Update password with confirm password not matching new password", async ({ menuItems, personalInfo, profileMenu }) => {
		await menuItems.clickMyProfileButton();
		await profileMenu.clickPersonalInfoButton();

		await personalInfo.fillOldPassword(oldPassword);
		await personalInfo.fillNewPassword(newPassword);
		await personalInfo.fillConfirmPassword(confirmPasswordNotMatching);
		await personalInfo.isConfirmPasswordErrorVisible();
	});

		test.only ("Validate Password Visibility Toggle", async ({ personalInfo }) => {

		await personalInfo.fillOldPassword(oldPassword);
		await personalInfo.fillNewPassword(newPassword);
		await personalInfo.fillConfirmPassword(newPassword);

		// Verify all fields start as hidden
		await personalInfo.validateOldPasswordIsHidden();
		await personalInfo.validateNewPasswordIsHidden();
		await personalInfo.validateConfirmPasswordIsHidden();

		// Toggle visibility and verify they become visible
		await personalInfo.toggleOldPasswordVisibility();
		await personalInfo.validateOldPasswordIsVisible();

		await personalInfo.toggleNewPasswordVisibility();
		await personalInfo.validateNewPasswordIsVisible();

		await personalInfo.toggleConfirmPasswordVisibility();
		await personalInfo.validateConfirmPasswordIsVisible();

		// Toggle visibility again and verify they become hidden
		await personalInfo.toggleOldPasswordVisibility();
		await personalInfo.validateOldPasswordIsHidden();

		await personalInfo.toggleNewPasswordVisibility();
		await personalInfo.validateNewPasswordIsHidden();

		await personalInfo.toggleConfirmPasswordVisibility();
		await personalInfo.validateConfirmPasswordIsHidden();
	});
});