# Composite Locators – Better Test Debugging & Reporting

Composite locators combine Playwright selectors with readable names. This makes tests easier to debug and creates better test reports.

---

## What are Composite Locators?

A composite locator combines two things:

1. **A Playwright selector** - finds the element
2. **A readable name** - describes what the element does

```typescript
type CompositeLocator = {
    locator: () => Locator;
    name: string;
};
```

Instead of using raw Playwright selectors, we wrap them with meaningful names.

---

## The Problem with Raw Selectors

### Without Composite Locators

```typescript
// Hard to understand what these elements do
await assertVisible(page.locator('#btn-submit'), false);
await assertVisible(page.locator('div[class*="modal-header"]'), false);
await clickElement(page.locator('a[data-testid="nav-promotions"]'), false);

// Error messages are unclear
// ❌ Error: Element #btn-submit not visible after 30s
// ❌ Error: Element div[class*="modal-header"] not found
```

### Issues with Raw Selectors:

- **Hard to read** - Complex selectors don't explain what they do
- **Unclear errors** - Need to look up selectors to understand failures
- **No context** - Test reports show technical selectors instead of business meaning
- **Hard to maintain** - Finding and updating selectors takes time

---

## The Solution: Composite Locators

### With Composite Locators

```typescript
// Clear, meaningful element descriptions
const submitButton = compositeLocator(
    () => page.locator('#btn-submit'), 
    'Submit Registration Form Button'
);

const modalHeader = compositeLocator(
    () => page.locator('div[class*="modal-header"]'), 
    'Payment Modal Header'
);

// Usage is clean and self-documenting
await assertVisible(submitButton, false);
await assertVisible(modalHeader, false);

// Error messages are meaningful
// ✅ Error: Submit Registration Form Button not visible after 30s
// ✅ Error: Payment Modal Header not found
```

---

## Creating Composite Locators

### Basic Usage

Use the `compositeLocator` function from test-utils:

```typescript
import { compositeLocator } from '@test-utils';

const loginButton = compositeLocator(
    () => page.locator('#login-btn'),
    'Login Button'
);

// Use with helper functions
await assertVisible(loginButton, false);
await clickElement(loginButton, false);
```

### In Page Objects

Composite locators work well in Page Object classes:

```typescript
export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    readonly usernameField = compositeLocator(
        () => this.page.locator('#username'),
        'Username Input Field'
    );

    readonly loginButton = compositeLocator(
        () => this.page.locator('#login-btn'),
        'Login Submit Button'
    );
}
```

### Dynamic Elements

For elements that need dynamic values:

```typescript
gameCard(gameId: string) {
    return compositeLocator(
        () => this.page.locator(`[data-game-id="${gameId}"]`),
        `Game Card for ${gameId}`
    );
}

// Usage
const slotGame = gameCard('slot-machine-deluxe');
await assertVisible(slotGame, false);
```

---

## Better Test Reports

### Test Step Structure

Composite locators create clean, readable test steps in Playwright reports. The descriptive names become part of `test.step()` calls, making reports easy to understand:

```typescript
const usernameField = compositeLocator(
    () => page.locator('#username'), 
    'Username Input Field'
);

const submitButton = compositeLocator(
    () => page.locator('#submit-btn'), 
    'Submit Registration Form Button'
);

// Helper functions use test.step() with composite locator names:
await assertVisible(usernameField, false);
// → Creates step: "Validating Username Input Field is visible"

await fillInputField(usernameField, 'test@example.com', false);
// → Creates step: "Filling Username Input Field with 'test@example.com'"

await clickElement(submitButton, false);
// → Creates step: "Clicking Submit Registration Form Button"
```

This creates well-structured test reports where each step clearly describes what element is being tested and what action is being performed.

## Clear Error Messages

When tests fail, composite locator names provide immediate context:

```typescript
// Without composite locators - unclear what failed
// ❌ Timeout 30000ms exceeded waiting for locator('#complex-selector .nested-element:nth-child(3)') to be visible

// With composite locators - clear understanding  
// ❌ Timeout 30000ms exceeded waiting for 'Shopping Cart Total Price Display' to be visible
```

---

## Naming Best Practices

### Be Descriptive and Specific

```typescript
// ❌ Poor naming
compositeLocator(() => page.locator('#btn1'), 'Button');
compositeLocator(() => page.locator('.input'), 'Field');

// ✅ Good naming
compositeLocator(() => page.locator('#submit-registration'), 'Submit Registration Form Button');
compositeLocator(() => page.locator('#email-input'), 'Email Address Input Field');
```

### Include Context

```typescript
// ✅ Include the component/page context
compositeLocator(() => page.locator('#cashier-deposit-btn'), 'Cashier Deposit Button');
compositeLocator(() => page.locator('#profile-save-btn'), 'Profile Save Changes Button');

// ✅ Use business language
compositeLocator(() => page.locator('#withdraw-amount'), 'Withdrawal Amount Input');
compositeLocator(() => page.locator('#bonus-balance'), 'Available Bonus Balance Display');
```

---

## Working with Helper Functions

All helper functions in test-utils work with composite locators:

```typescript
import { assertVisible, clickElement, fillInputField, getText } from '@test-utils';

// Assertions
await assertVisible(submitButton, false);
await assertEnabled(paymentForm.amountInput, false);

// Interactions
await fillInputField(registrationForm.emailField, 'user@example.com', false);
await clickElement(registrationForm.submitButton, false);

// Text extraction
const buttonText = await getText(promoCard.actionButton);
```

---

## Conclusion

Composite locators provide:

* **Better readability** - Tests become self-documenting with meaningful element names
* **Clearer debugging** - Error messages show what failed, not just technical selectors  
* **Structured test reports** - Helper methods use element names in test.step() calls
* **Easier maintenance** - Centralized element definitions with descriptive names

Composite locators bridge the gap between technical implementation and business understanding, making test automation more accessible to the entire team.
