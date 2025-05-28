# Frontend Test Specs – Structure & Usage

In your Playwright test suite, frontend test specs validate the functionality and UI of your application. 
This document explains how the Page Object Model (POM), helper utilities, and configuration combine to create robust,
maintainable, and scalable frontend tests.

---

## The Problem

Frontend tests often involve repetitive interactions with UI elements, such as clicking buttons, filling forms, 
and validating visibility. Without a structured approach, this can lead to:

* Redundant code for interacting with UI elements.
* Poor readability and maintainability of test cases.
* Difficulty in debugging due to scattered assertions and interactions.
* Inconsistent handling of dynamic elements and test data.

---

## The Solution: POM, Helpers, and Configuration

The combination of the Page Object Model (POM), helper utilities, and configuration addresses these challenges by:

* Centralizing UI interactions in reusable POM classes.
* Providing helper utilities for common actions and assertions.
* Using configuration to manage test environments, projects, and setups.

---

## Page Object Model (POM)

The POM abstracts the UI elements and their interactions into reusable classes. Each page or component is represented 
as a class with locators and methods for interacting with the elements.

### 1. Locators

Locators are defined as methods that return Playwright `Locator` objects. For example, in the `LandingPageCarousel` class:

```typescript
// filepath: c:\Users\User\Documents\automation\pages\LandingPage\landingPageCarousel.po.ts
readonly container = () => this.page.locator('div[class*="_promotionsCarouselContainer_"]');
readonly arrowLeftButton = () => this.page.locator('div[class*="_carouselPromotionsArrowContainer_"]').nth(0);
readonly arrowRightButton = () => this.page.locator('div[class*="_carouselPromotionsArrowContainer_"]').nth(1);
```

### 2. Actions

Actions are methods that interact with the locators. For example, clicking a button or validating visibility:

```typescript
public async clickArrowLeftButton(softAssert = false): Promise<void> {
    await this.navigation.clickElement(this.arrowLeftButton(), softAssert, 'Left arrow button');
}

public async validateContainerVisible(softAssert = false): Promise<void> {
    await this.navigation.assertVisible(this.container(), softAssert, 'Promotion container');
}
```

### 3. Grouped Validations

Grouped validations combine multiple assertions into a single method for better readability. For example:

```typescript
@step('I validate the carousel elements are visible for a guest')
public async validateElementsVisibleGuest(): Promise<void> {
    await this.validateContainerVisible();
    await this.validateArrowLeftButtonVisible(true);
    await this.validateArrowRightButtonVisible(true);
    await this.validateEnterButtonVisible(true);
}
```

---

## Helper Utilities

Helper utilities provide reusable methods for common actions and assertions, such as clicking elements, filling input fields, 
and validating attributes. The `Navigation` class centralizes common interactions and assertions, such as:

#### Visibility Assertions

```typescript
await navigation.assertVisible(element, false, 'Submit button');
await navigation.assertNotVisible(element, true, 'Hidden tooltip');
```

#### Click and Interaction Helpers

```typescript
await navigation.clickElement(buttonLocator, false, 'Submit button');
await navigation.fillInputField(inputLocator, 'username', false, 'Username input');
```

#### URL Assertions

```typescript
await navigation.assertUrl('https://example.com/dashboard');
await navigation.assertUrlContains(['dashboard', 'userId=123']);
```

#### Iteration Over Multiple Elements

```typescript
await navigation.iterateElements(page.locator('.list-item'), async (index) => {
    await navigation.assertVisible(page.locator('.list-item').nth(index), false, `List item ${index}`);
});
```

---

## Configuration and Projects

Playwright's configuration file (`playwright.config.ts`) defines test environments, projects, and setups. 
This ensures that tests are executed consistently across different devices and browsers.

### 1. Projects

Projects define the environments in which tests run, such as desktop and mobile:

```typescript
projects: [
    {
        name: 'desktop',
        use: { viewport: { width: 1920, height: 1080 } }
    },
    {
        name: 'mobile',
        use: { viewport: { width: 375, height: 812 }, isMobile: true }
    }
]
```

### 2. Test-Specific Configuration

Tests can use specific configurations, such as authentication states. In this case it uses an empty JSON 
that makes the test run for a guest:

```typescript
test.describe("Guest", () => {
    test.use({ storageState: "playwright/.auth/noAuthentication.json" });
    test("Validate page elements are visible for a guest", async ({ landingPage }) => {
        await landingPage.validateCarouselElementsAreVisibleForGuest();
    });
});
```

### 3. Setup and Teardown

Global setup and teardown ensure consistent test environments. For example, navigating to the homepage and interacting 
with banners:

```typescript
test.beforeEach(async ({ page, banner }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.acceptCookies();
});
```

---

## Test Specs

Test specs combine the POM, helper utilities, and configuration to create readable and maintainable test cases.

### 1. Test Initialization

Before each test, you can perform setup steps:

```typescript
test.beforeEach(async ({ page, banner }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await banner.clickEscapeInOptIn();
});
```

### 2. Test Cases

Each test case uses the POM and helper utilities to perform actions and assertions. For example:

```typescript
test("Validate page elements are visible for a member", async ({ landingPage }) => {
    await landingPage.validateCarouselElementsAreVisibleForMember();
    await landingPage.validateTopCategoriesElements();
    await landingPage.validateGameCategoriesElements();
    await landingPage.validateFaqElements();
    await landingPage.validatePromoCardElements();
    await landingPage.validateFooterLinksSectionElements();
});
```

### 3. Grouped Tests

Tests are grouped by functionality or user type (e.g., member vs. guest) for better organization:

```typescript
test.describe("Landing Page Smoke Tests", () => {
    test.describe("Desktop", () => {
        test("Validate page elements are visible for a member", async ({ landingPage }) => {
            await landingPage.validateCarouselElementsAreVisibleForMember();
        });

        test.describe("Guest", () => {
            test.use({ storageState: "playwright/.auth/noAuthentication.json" });
            test("Validate page elements are visible for a guest", async ({ landingPage }) => {
                await landingPage.validateCarouselElementsAreVisibleForGuest();
            });
        });
    });
});
```

---

## Example: Putting It All Together

Here’s how a test spec combines the POM, helper utilities, and configuration:

1. **Setup**:
   ```typescript
   test.beforeEach(async ({ page, banner }) => {
       await page.goto(`${process.env.URL}`, { waitUntil: "load" });
       await banner.clickEscapeInOptIn();
   });
   ```

2. **Test Case**:
   ```typescript
   test("Validate carousel navigation for a guest", async ({ landingPageCarousel }) => {
       await landingPageCarousel.validateCarousel();
   });
   ```

3. **POM Method**:
   ```typescript
   @step('I validate carousel navigation through points and arrows')
   async validateCarousel(): Promise<void> {
       const entriesCount = await this.promotionEntries().count();
       for (let i = 0; i < entriesCount; i++) {
           await this.performCarouselNavigationStep(i);
       }
   }

   @step('I perform carousel navigation step')
   async performCarouselNavigationStep(index: number): Promise<void> {
       await this.clickDot(index);
       await this.validateDotIsActive(index);
       await this.validatePromotionsEntriesVisible(index);
   }

   @step('I click on the dot')
   async clickDot(index: number): Promise<void> {
       await this.navigation.clickElement(this.dots().nth(index), false, `Carousel Dot Number ${index}`);
   }

   @step('I validate the dot at index is active')
   async validateDotIsActive(index: number): Promise<void> {
       await expect(this.dots().nth(index)).toHaveClass(new RegExp(`${this.dotsActiveClass}`));
   }

   @step('I validate the promotion entry is visible')
   async validatePromotionsEntriesVisible(index: number): Promise<void> {
       await this.navigation.assertVisible(this.promotionEntries().nth(index), false, `Promotion Entry ${index}`);
   }
   ```

4. **Helper Utility**:
   ```typescript
   public async clickElement(element: Locator, softAssert: boolean, description: string): Promise<void> {
       await this.assertVisible(element, softAssert, description);
       await this.assertEnabled(element, softAssert, description);
       await element.click();
   }
   ```

---

## Conclusion

By combining the Page Object Model, helper utilities, and configuration, frontend test specs achieve:

* **Readability**: Tests are easy to understand and maintain.
* **Reusability**: Common logic is centralized in POM and helpers.
* **Consistency**: Assertions and interactions follow a standardized approach.
* **Scalability**: New tests can be added with minimal duplication.

This approach ensures that your frontend tests are robust, maintainable, and easy to debug as your application evolves.
