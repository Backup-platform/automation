# Page Object Design Pattern

Page Objects organize test code by grouping related functionality and using composite locators with helper functions. This makes tests easier to read, maintain, and debug.

## The Problem Without Page Objects

Without page objects, tests have complex selectors scattered everywhere:

```typescript
test("Validate page header content is present", async ( /*...*/ ) => {
    await assertVisible(page.locator('#header #desktop-header'), false);
    await assertVisible(page.locator('a[class*="desktopHeader_desktopHeaderLogoContainer_"]'), false);
    await assertVisible(page.locator('#desktop-nav-link-Crash'), false);
    await assertVisible(page.locator('#desktop-nav-link-Live'), false);
    await assertVisible(page.locator('#desktop-nav-link-Tournaments'), false);
    // More complex locators...
});
```

### Issues:
* **Hard to read** - Complex selectors don't explain what they do
* **Code duplication** - Same selectors repeated in multiple tests
* **Hard to maintain** - Selector changes require updates everywhere
* **No context** - Raw selectors provide no business meaning
* **Hard to debug** - Error messages are unclear

## The Solution: Page Objects + Composite Locators

### Step 1: Group locators with descriptive names

```typescript
import { compositeLocator } from '@test-utils';

export class HeaderMenu {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    
    // Composite locators with descriptive names
    readonly desktopHeader = compositeLocator(
        () => this.page.locator('#header #desktop-header'),
        'Desktop Header Container'
    );
    
    readonly sfLogo = compositeLocator(
        () => this.page.locator('a[class*="desktopHeader_desktopHeaderLogoContainer_"]'),
        'SpaceFortuna Logo'
    );
    
    readonly crashButton = compositeLocator(
        () => this.page.locator('#desktop-nav-link-Crash'),
        'Crash Games Navigation Button'
    );
    
    readonly gamesButton = compositeLocator(
        () => this.page.locator('#desktop-nav-link-Games'),
        'Games Navigation Button'
    );
}
```

Now the test code is cleaner:

```typescript
test("Validate page header content is present", async ( /*...*/ ) => {
    await assertVisible(headerMenu.desktopHeader, false);
    await assertVisible(headerMenu.sfLogo, false);
    await assertVisible(headerMenu.crashButton, false);
    await assertVisible(headerMenu.gamesButton, false);
});
```

When selectors change, you only update them in one place. Plus, descriptive names make test reports clearer!

### Step 2: Add business logic methods

```typescript
import { assertVisible, clickElement } from '@test-utils';

export class HeaderMenu {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    
    // Composite locators
    readonly desktopHeader = compositeLocator(
        () => this.page.locator('#header #desktop-header'),
        'Desktop Header Container'
    );
    
    readonly gamesButton = compositeLocator(
        () => this.page.locator('#desktop-nav-link-Games'),
        'Games Navigation Button'
    );
    
    readonly promotionsButton = compositeLocator(
        () => this.page.locator('#desktop-nav-link-Promotions'),
        'Promotions Navigation Button'
    );
    
    // Business logic methods
    public async validateHeaderContentPresent(softAssert = false): Promise<void> {
        await assertVisible(this.desktopHeader, softAssert);
        await assertVisible(this.gamesButton, softAssert);
        await assertVisible(this.promotionsButton, softAssert);
    }
    
    public async navigateToGames(): Promise<void> {
        await clickElement(this.gamesButton, false);
    }
    
    public async navigateToPromotions(): Promise<void> {
        await clickElement(this.promotionsButton, false);
    }
}
```

Now your test becomes very clean:

```typescript
test("Validate page header content is present", async ( /*...*/ ) => {
    await headerMenu.validateHeaderContentPresent();
});
```

You have centralized methods to verify the header and interact with it, which you can reuse across multiple tests.

## Benefits of Page Objects

### 1. Composite Locators
- **Better debugging** - Descriptive names appear in test reports and error messages
- **Easier maintenance** - Locator logic centralized with meaningful descriptions
- **Improved readability** - `await assertVisible(submitButton, false)` vs `await assertVisible(page.locator('#btn-submit'), false)`

### 2. Helper Function Integration
- **Standardized interactions** - All page objects use the same helper functions
- **Consistent error handling** - Soft/hard assertions handled uniformly
- **Enhanced reporting** - Step decorators provide clear test execution traces

### 3. Business Logic Encapsulation
- **Semantic methods** - `validateHeaderContentPresent()` clearly describes what the test does
- **Reusable workflows** - Complex user interactions abstracted into simple method calls
- **Domain-specific language** - Test code reads like natural language

## Key Principles

- **Group related functionality** for specific pages or components
- **Use composite locators** with descriptive names for better debugging
- **Encapsulate business logic** into reusable, semantic methods
- **Keep page objects focused** - split large objects into smaller, focused ones
- **Start simple and iterate** - begin with basic page objects and evolve as needed

Page objects with composite locators and helper functions create maintainable, readable, and robust test automation that scales with your application's complexity.

* **Keep page objects focused** - split them into smaller objects when they get too big
* **Start simple and improve** - begin with basic page objects and add complexity as needed
* **Centralize changes** - when locators change, you only need to update the page object
* **Hide complexity** - page objects create simple interfaces for complex interactions

Use page objects with composite locators and helper functions to create maintainable, readable test automation.
