import test from '../../../pages/base/base.po';

test.beforeEach(async ({ page, popupHandlers }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
  	await popupHandlers.handleAllPopups();
});

const oldPassword = `${process.env.PASS}`;
const wrongOldPassword = `${process.env.PASS}_wrong`; 

test("test fail then success password update", async ({ menuItems, personalInfo, profileMenu }) => {
	await menuItems.clickMyProfileButton();
    await profileMenu.clickPersonalInfoButton();
	test.step('Fill old password with the wrong password and fail the update', async () => {
		await personalInfo.fillOldPassword(wrongOldPassword);
		await personalInfo.fillNewPassword(oldPassword);
		await personalInfo.clickUpdatePasswordButton();
		await personalInfo.validatePasswordChangeFailureToast();
	});

	test.step('Fill old password with the correct password and succeed the update', async () => {
        await personalInfo.fillOldPassword(oldPassword);
        await personalInfo.fillNewPassword(oldPassword);
        await personalInfo.clickUpdatePasswordButton();
        await personalInfo.validatePasswordChangeSuccessToast();
	});
});