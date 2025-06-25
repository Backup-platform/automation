import { Page } from '@playwright/test';
import {
    assertVisible,
    compositeLocator,
    assertNotVisible,
    clickElement,
} from '@test-utils/navigation.po';

export class DepositStep2 {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    // Locators

    private readonly bonusList = compositeLocator(() => 
        this.page.locator('#bonus-list'), 'Bonus List');
    
    private readonly depositWithoutBonusButton = compositeLocator(() => 
        this.page.locator('.absolute.bottom-0 button'), 'Deposit Without Bonus Button');

    // Actions

    public validateBonusListVisible = async(softAssert = false) => 
        await assertVisible(this.bonusList, softAssert);

    public validateBonusListNotVisible = async(softAssert = false) => 
        await assertNotVisible(this.bonusList, softAssert);

    public clickDepositWithoutBonusButton = async() =>
        await clickElement(this.depositWithoutBonusButton);

}
