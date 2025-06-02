# Page Object Design Motivation

You might've noticed that we implement little modules called Page objects. In this document we will explore 
the motivation behind this particular design and why we are doing it.

## How the codebase looks without page objects

Usually our test cases would look like this in our code (Playwright):

```typescript
/* Some imports... */

test.beforeEach((/*...*/) => {
	/* Some steps before each test... */ 
});

test.describe("Landing Page Tests", () => {
    test("Validate page header content is present on the page for a guest user", async ( /*...*/ ) => {
        /* Testing case steps... */
    });

    test("Validate page main content is present on the page for a guest user", async ( /*...*/ ) => {
        /* Testing case steps... */
    });

    test("Validate page footer content is present on the page for a guest user", async ( /*...*/ ) => {
        /* Testing case steps... */
    });
});
```

Now let's explore the actual test steps, but let's explore how they would look without page objects. The first thing that would come to mind is the fact that we will usually have very complex
locators (the selectors via which we locate elements on the page in order to verify their presence or use them).

```typescript
test("Validate page header content is present on the page for a guest user", async ( /*...*/ ) => {
    await this.navigation.assertVisible(this.page.locator('#header #desktop-header'), softAssert, 'Expect Header to be visible');
    await this.navigation.assertVisible(this.page.locator('a[class*="desktopHeader_desktopHeaderLogoContainer_"]'), softAssert, 'Expect SF logo to be visible');
    await this.navigation.assertVisible(this.page.locator('#desktop-nav-link-Crash'), softAssert, 'Expect Crash button to be visible');
    await this.navigation.assertVisible(this.page.locator('#desktop-nav-link-Live'), softAssert, 'Expect Live button to be visible');
    await this.navigation.assertVisible(this.page.locator('#desktop-nav-link-Tournaments'), softAssert, 'Expect Tournament button to be visible');
    await this.navigation.assertVisible(this.page.locator('#desktop-nav-link-Games'), softAssert, 'Expect Games button to be visible');
    await this.navigation.assertVisible(this.page.locator('#desktop-nav-link-Promotions'), softAssert, 'Expect Promotions button to be visible');
    await this.navigation.assertVisible(this.page.locator('#desktop-nav-link-VIP'), softAssert, 'Expect VIP button to be visible');
    /* More test case steps... */
});
```

## The problem

What are the problems that you can immediately see in the aforementioned code? (give yourself several seconds, think about it, then read the following bullet-points):

* First and foremost this doesn't look too good. 
  * It's hardly discernible if there is any mistake in the locators. 
* Now imagine that some of these locators will be reused in other test cases. 
  * It's gonna be a disastrous code.
* Now imagine that they are reused in other test cases in other functionalities (e.g. totally different test scenarios). 
  * You'd have to introduce the disastrous code to other scenarios as well.
* Now imagine that with all the reusability, there is a change in the code and the locator is no longer valid.
  * You'd have to look for it and modify it everywhere.

There are many more negatives that can be mentioned here, but the ones given should be enough. So what's the solution?

## The solution

Maybe you are asking yourself - "But what if we extract it into a constant?". 

You're on the right path, but let's push it one level further:

### 1. Let's extract all such constants and group them together depending on their context!

What do we get when we do that? We get a page object. 

```typescript
export class HeaderMenu {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    
    readonly desktopHeader = () => this.page.locator('#header #desktop-header');
    readonly sfLogo = () => this.page.locator('a[class*="desktopHeader_desktopHeaderLogoContainer_"]');
    readonly crashButton = () => this.page.locator('#desktop-nav-link-Crash');
    readonly liveButton = () => this.page.locator('#desktop-nav-link-Live');
    readonly tournamentButton = () => this.page.locator('#desktop-nav-link-Tournaments');
    readonly gamesButton = () => this.page.locator('#desktop-nav-link-Games');
    readonly promotionsButton = () => this.page.locator('#desktop-nav-link-Promotions');
    readonly vipButton = () => this.page.locator('#desktop-nav-link-VIP');
    
    /* More properties and methods */
}
```

Now we can use these properties as from a central point of data. 
The code of the test case would look cleaner:

```typescript
test("Validate page header content is present on the page for a guest user", async ( /*...*/ ) => {
    await this.navigation.assertVisible(headerMenu.desktopHeader(), softAssert, 'Expect Header to be visible');
    await this.navigation.assertVisible(headerMenu.sfLogo(), softAssert, 'Expect SF logo to be visible');
    await this.navigation.assertVisible(headerMenu.crashButton(), softAssert, 'Expect Crash button to be visible');
    await this.navigation.assertVisible(headerMenu.liveButton(), softAssert, 'Expect Live button to be visible');
    await this.navigation.assertVisible(HeaderMenu.tournamentsButton(), softAssert, 'Expect Tournament button to be visible');
    await this.navigation.assertVisible(headerMenu.gamesButton(), softAssert, 'Expect Games button to be visible');
    await this.navigation.assertVisible(headerMenu.promotionsButton(), softAssert, 'Expect Promotions button to be visible');
    await this.navigation.assertVisible(headerMenu.vipButton(), softAssert, 'Expect VIP button to be visible');
    /* More test case steps... */
});
```

And if tomorrow one of the locators changes, we will need to change it in one place only.

### 2. Let's then extend the abstraction with logic that encapsulates the properties and exposes only a programming interface which you can use!
(e.g. a **blackbox**... You don't need to know what stands below, just how to use it)

```typescript
export class HeaderMenu {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
    }
    
    readonly desktopHeader = () => this.page.locator('#header #desktop-header');
    readonly sfLogo = () => this.page.locator('a[class*="desktopHeader_desktopHeaderLogoContainer_"]');
    readonly crashButton = () => this.page.locator('#desktop-nav-link-Crash');
    readonly liveButton = () => this.page.locator('#desktop-nav-link-Live');
    readonly tournamentButton = () => this.page.locator('#desktop-nav-link-Tournaments');
    readonly gamesButton = () => this.page.locator('#desktop-nav-link-Games');
    readonly promotionsButton = () => this.page.locator('#desktop-nav-link-Promotions');
    readonly vipButton = () => this.page.locator('#desktop-nav-link-VIP');
    
    public async validateHeaderContentPresent(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(headerMenu.desktopHeader(), softAssert, 'Expect Header to be visible');
        await this.navigation.assertVisible(headerMenu.sfLogo(), softAssert, 'Expect SF logo to be visible');
        await this.navigation.assertVisible(headerMenu.crashButton(), softAssert, 'Expect Crash button to be visible');
        await this.navigation.assertVisible(headerMenu.liveButton(), softAssert, 'Expect Live button to be visible');
        await this.navigation.assertVisible(HeaderMenu.tournamentsButton(), softAssert, 'Expect Tournament button to be visible');
        await this.navigation.assertVisible(headerMenu.gamesButton(), softAssert, 'Expect Games button to be visible');
        await this.navigation.assertVisible(headerMenu.promotionsButton(), softAssert, 'Expect Promotions button to be visible');
        await this.navigation.assertVisible(headerMenu.vipButton(), softAssert, 'Expect VIP button to be visible');
        /* More header elements validation steps... */
    }
    
    /* More properties and methods */
}
```

Then our test case code would look even cleaner:

```typescript
test("Validate page header content is present on the page for a guest user", async ( /*...*/ ) => {
    await headerMenu.validateHeaderContentPresent();
});
```
 
And you also have a central method to verify that the header is present, which you would most likely reuse in several pages - as content such as the header is visible on multiple pages.

## Conclusion

Page objects are a good way to group and aggregate functionality for locating specific elements. 

* Page objects need not be massive, they can be split into smaller objects.
  * It is a good idea to first start somewhere - so start big and then divide and conquer when you think you are ready to do it.
* Page objects create reusable code that is easily configurable.
  * If you have breaking changes (e.g. locator changes), you will not need to edit it in several places but in the page object only. (as all test cases use it as an interface)
* Page objects encapsulate logic.
  * You don't always need to know what stands below - it can work as a comfortable black box for you, which you can use in other test cases as well.
* Page objects make the code look better.
  * Locators are not exactly TypeScript code - and one of the most important thing in coding is to mix technologies as little as possible.
