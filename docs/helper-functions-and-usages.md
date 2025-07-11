# Test Helper Functions – Structure & Usage

The test-utils library provides helper functions that simplify Playwright test automation and create structured, readable test reports. This guide explains the available helper modules and their usage.

## Why Helper Functions?

Without helper functions, tests become verbose and inconsistent:

```typescript
// Without helpers - verbose and repetitive
await expect(page.locator('#submit-btn')).toBeVisible();
await expect(page.locator('#submit-btn')).toBeEnabled();
await page.locator('#submit-btn').click();

// Validation scattered throughout tests
const elements = await page.locator('.item').all();
for (let i = 0; i < elements.length; i++) {
    await expect(elements[i]).toBeVisible();
}
```

This approach leads to code duplication and inconsistent validation patterns across your test suite.

---

## The Problem

Without helper functions, tests become verbose and hard to maintain:

* **Code duplication** - Same validation patterns repeated everywhere
* **Inconsistent patterns** - Different approaches across tests
* **Generic error messages** - Hard to debug when things fail
* **Maintenance overhead** - Changes require updates in multiple places

---

## The Solution: Helper Functions

The test-utils library provides helper functions organized by purpose:

* **Consistent APIs** - Same function patterns across all helpers
* **Better error messages** - Clear context when tests fail
* **Composite locators** - Combine selectors with readable names
* **TypeScript support** - Full type safety and auto-completion

## Available Helper Modules

### 1. Assertions (`assertions.ts`)

Element state validation functions. Exports: `assertVisible`, `assertEnabled`, `assertEditable`, `assertElementStates`, and their negative counterparts.

```typescript
import { assertVisible, assertElementStates } from '@test-utils';

// Single element validation
await assertVisible(submitButton, false);

// Batch validations
await assertElementStates([
    { element: button1, validationType: 'visibility' },
    { element: input1, validationType: 'editable' }
]);
```

### 2. Interactions (`interactions.ts`)

Element interaction functions with built-in validation. Exports: `clickElement`, `fillInputField`, `selectOption`, `clickIfVisibleOrFallback`.

```typescript
import { clickElement, fillInputField } from '@test-utils';

// Validates visibility/enabled before clicking
await clickElement(submitButton, false);

// Safe input filling with validation
await fillInputField(usernameField, 'testuser', false);
```

### 3. Text Extraction (`text-extraction.ts`)

Text extraction and manipulation utilities. Exports: `getText`, `getGroupTexts`, `getAllGroupTexts`.

```typescript
import { getText, getGroupTexts } from '@test-utils';

// Extract single element text
const buttonText = await getText(submitButton);

// Extract multiple element texts
const menuTexts = await getGroupTexts({
    navigation: [homeLink, aboutLink, contactLink]
});
```

### 4. Attributes (`attributes.ts`)

Attribute validation and manipulation functions. Exports: `validateAttributes`, `validateToggleBetweenTwoElements`, `validateOnlyOneElementActiveGroup`.

```typescript
import { validateAttributes, validateOnlyOneElementActiveGroup } from '@test-utils';

// Validate specific attributes
await validateAttributes([
    { element: button, attribute: 'aria-label', expectedValue: 'Submit Form' }
]);
```

### 5. Utilities (`utilities.ts`)

General-purpose helper functions. Exports: `iterateElements`, `parseDateString`, `executeIfDefined`, URL validation functions, and debug helpers.

```typescript
import { iterateElements, parseDateString } from '@test-utils';

// Iterate over element collections
await iterateElements(page.locator('.item'), async (index, element) => {
    await assertVisible(element, false);
});
```

## Composite Locators Integration

Helper functions work with composite locators to create readable test steps. The element name automatically becomes part of the test step description:

```typescript
import { compositeLocator, assertVisible, fillInputField, clickElement } from '@test-utils';

// Create composite locators with readable names
const emailField = compositeLocator(
    () => page.locator('#email'), 
    'Email Address Input Field'
);

const submitButton = compositeLocator(
    () => page.locator('#submit-btn'), 
    'Submit Registration Form Button'
);

// Helper functions automatically create descriptive test steps:
await assertVisible(emailField, false);
// → Test step: "Validating Email Address Input Field is visible"

await fillInputField(emailField, 'user@example.com', false);
// → Test step: "Filling Email Address Input Field with 'user@example.com'"

await clickElement(submitButton, false);
// → Test step: "Clicking Submit Registration Form Button"
```

## Validation Tests

All helper functions have comprehensive validation tests located in `libs/test-utils/src/validation-tests/`. Run them using:

```bash
nx run test-utils:validate-helpers
nx run test-utils:validate-helpers:detailed
```

Helper functions provide consistent patterns, readable test reports, and clear error messages while integrating seamlessly with composite locators for human-readable test steps.

