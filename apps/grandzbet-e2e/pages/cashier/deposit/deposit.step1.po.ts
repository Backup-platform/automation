import { Page } from '@playwright/test';
import {
    assertVisible,
    compositeLocator,
    assertNotVisible,
    clickElement,
} from '@test-utils/navigation.po';

export class DepositStep1 {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    // Locators


}
