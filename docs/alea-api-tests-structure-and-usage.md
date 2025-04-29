# Transaction API Tests – Structure & Usage

In your Playwright test suite, the `aleaTransactions.spec.ts` file is designed to validate transaction-related APIs. 
This document explains the purpose of these tests, the challenges they address, and how they are structured to ensure 
robust validation of transaction scenarios.

---

## The Problem

Transaction APIs often involve complex workflows, including multiple steps, dependencies between requests, and dynamic data. 
Without a structured approach, testing these APIs can lead to:

* Redundant code for preparing payloads and validating responses.
* Difficulty in maintaining and debugging tests.
* Inconsistent handling of dynamic data and dependencies between steps.
* Lack of clarity in test scenarios and expected outcomes.

---

## The Solution: Structured Transaction API Tests

The `aleaTransactions.spec.ts` file addresses these challenges by using a structured approach to test transaction APIs. 
It leverages helper functions, reusable utilities, and a clear test flow to ensure maintainability and readability.

### 1. Scenario-Based Testing

Each test scenario is defined in a JSON file (`aleaTransactionsAPI.json`) and includes multiple steps. This allows for:

* Clear separation of test data from test logic.
* Easy addition or modification of test scenarios without changing the code.
* Reusability of test logic across multiple scenarios.

### 2. Dynamic Payload Preparation

The `prepareRollbackBody` and `prepareStandardBody` utilities dynamically generate request payloads based on the test 
step and stored variables. This ensures:

* Consistent handling of dynamic data, such as transaction IDs and round IDs.
* Flexibility to handle different types of transactions (e.g., BET, WIN, ROLLBACK).

#### Example: Preparing Rollback Payloads

The `prepareRollbackBody` function ensures that rollback requests are correctly structured by merging stored variables 
with the base payload:

```typescript
export function prepareRollbackBody(stepData: StepData, storedVars: Record<string, any>, baseBody: any): any {
    let finalBody = prepareFinalBody(stepData, baseBody);
    
    if (!stepData.useVariablesFrom) {
        throw new Error(`ROLLBACK step requires "useVariablesFrom" to be specified.`);
    }
    
    const refName = stepData.useVariablesFrom;
    if (!storedVars[refName]) {
        throw new Error(`ROLLBACK step expects stored variables under reference "${refName}", but none were found.`);
    }

    if (stepData.onlyRound) {
        finalBody.transaction = { id: storedVars[refName].transactionId || storedVars[refName].id };
        finalBody.originalRequestType = storedVars[refName].originalRequestType;
        finalBody.originalAmount = storedVars[refName].originalAmount;
        finalBody.round = merge({}, finalBody.round, storedVars[refName].round);
    } else if (!stepData.onlyRound) {
        finalBody = merge({}, finalBody, {
            id: storedVars[refName].id,
            integratorTransactionId: storedVars[refName].integratorTransactionId,
            round: storedVars[refName].round,
            transaction: { id: storedVars[refName].transactionId || storedVars[refName].id }
        });
    }
    // Ensure originalRequestType is passed for BET_WIN rollback
    if (storedVars[refName].originalRequestType) {
        finalBody.originalRequestType = storedVars[refName].originalRequestType;
    }
    // For BET_WIN rollback, merge bet and win values if stored.
    if (storedVars[refName].originalRequestType === 'BET_WIN') {
        finalBody.bet = storedVars[refName].bet;
        finalBody.win = storedVars[refName].win;
    }

    if (storedVars[refName].originalRequestType === 'ROLLBACK') {
        finalBody.bet = storedVars[refName].bet;
        finalBody.win = storedVars[refName].win;
    }

    delete finalBody.amount;
    delete finalBody.useVariablesFrom;
    delete finalBody.copyStored;
    delete finalBody.onlyRound;

    return finalBody;
}
```

This function ensures that rollback requests are correctly linked to the original transaction and round.

---

### 3. Centralized Validation

The `validateResponse` and `validateBalance` functions centralize response validation, ensuring:

* Consistent validation of expected values across all test steps.
* Clear error messages for debugging when validations fail.

---

### 4. Stored Variables for Dependencies

The `updateStoredVars` utility manages dependencies between test steps by storing and reusing variables such as 
transaction IDs and round data. This enables:

* Seamless handling of multi-step workflows.
* Accurate validation of rollback scenarios.

#### Example: Updating Stored Variables

The `updateStoredVars` function ensures that variables from one step are available for subsequent steps:

```typescript
export function updateStoredVars(
    storedVars: Record<string, any>,
    stepData: StepData,
    finalBody: any
): Record<string, any> {
    if (stepData.storeVariablesForNextStep) {
        const refName = stepData.storeVariablesForNextStep.referenceName;
        let newVars = extractStoredValues(stepData.storeVariablesForNextStep, finalBody);

        // Store round information explicitly
        if (stepData.storeVariablesForNextStep.round !== undefined) {
            newVars.round = finalBody.round;
        }

        // Store transaction ID for non-ROLLBACK steps or if not already stored
        if (finalBody.transaction && finalBody.transaction.id) {
            if (stepData.type !== 'ROLLBACK' || !storedVars[refName]?.transactionId) {
                newVars.transactionId = finalBody.transaction.id;
            }
        }

        if (refName) {
            storedVars[refName] = merge({}, storedVars[refName], newVars);
        } else {
            storedVars = merge({}, storedVars, newVars);
        }
    }
    return storedVars;
}
```

This function ensures that variables such as transaction IDs and round data are correctly stored and reused.

---

## Test Structure

### 1. Test Initialization

Before each test, the initial balance is fetched using the `TransactionService`:

```typescript
test.beforeEach(async ({ request }) => {
    transactionService = new TransactionService(request);
    const balanceResponse = await transactionService.getInitialBalance(BASE_PLAYER_ID);
    initialBalance = runningBalance = balanceResponse.realBalance;
});
```

This ensures that each test starts with a known state.

### 2. Scenario Execution

Each scenario is processed step by step using the `processStep` helper function:

```typescript
async function processStep(step: StepData, index: number, currentScenario: string): Promise<void> {
        validateExpectedValues(step, currentScenario, index);

        const finalBody = step.type === 'ROLLBACK'
            ? prepareRollbackBody(step, storedVars, BASE_BODY)
            : prepareStandardBody(step, storedVars, BASE_BODY);



        // Log the request identifiers (id, round id, transaction id)
        console.log(`[Step ${index + 1}] Prepared Request: id=${finalBody.id}, round.id=${finalBody.round?.id}, transaction.id=${finalBody.transaction ? finalBody.transaction.id : 'N/A'}`);

        // Log any stored values applied from a previous request if available.
        if (step.useVariablesFrom && storedVars[step.useVariablesFrom]) {
            console.log(`[Step ${index + 1}] Applied storedVars [${step.useVariablesFrom}]:`, storedVars[step.useVariablesFrom]);
        }

        const requestPayload = removeTestKeys(finalBody);
        const response = await transactionService.executeTransaction(requestPayload);
        const responseJson = await response.json();

        expect(response.status(),
        `[${currentScenario} | Step #${index + 1}] Expected statusCode = ${step.expectedValues.statusCode}, but got ${response.status()}`
        ).toEqual(step.expectedValues.statusCode);

        validateResponse(responseJson, step.expectedValues, currentScenario, index);

        const alreadyProcessed = step.expectedValues?.isAlreadyProcessed || false;
        const expectedBalance = calculateExpectedBalance(runningBalance, finalBody, alreadyProcessed);

        if (response.ok()) {
            expect(responseJson.realBalance,
                `[${currentScenario} | Step #${index + 1}] Expected realBalance = ${expectedBalance}, but got ${responseJson.realBalance}`
            ).toEqual(expectedBalance);
            runningBalance = responseJson.realBalance;
            console.log(`Updated balance after ${step.type}: ${runningBalance}`);
        }
        storedVars = updateStoredVars(storedVars, step, finalBody);
    }
```

This function handles:

* Validation of expected values.
* Preparation of the request payload.
* Execution of the API request.
* Validation of the response.
* Updating stored variables for subsequent steps.

### 3. Test Scenarios

Each scenario is defined in the `aleaTransactionsAPI.json` file and includes:

* A `testName` for identifying the scenario.
* A sequence of `steps`, each specifying the type of transaction, expected values, and dependencies.

The test iterates over all scenarios and processes each step:

```typescript
for (const scenario of scenarios) {
    test(scenario.testName, async () => {
        const currentScenario = scenario.testName;
        storedVars = {};
        for (const [index, step] of scenario.steps.entries()) {
            await processStep(step, index, currentScenario);
        }
    });
}
```

---

## Example: Putting It All Together

Here’s how a test scenario is executed:

1. **Fetch Initial Balance**:
   ```typescript
   const balanceResponse = await transactionService.getInitialBalance(BASE_PLAYER_ID);
   initialBalance = runningBalance = balanceResponse.realBalance;
   ```

2. **Process Each Step**:
   ```typescript
   for (const [index, step] of scenario.steps.entries()) {
       await processStep(step, index, currentScenario);
   }
   ```

3. **Validate Response**:
   ```typescript
   validateResponse(responseJson, step.expectedValues, currentScenario, index);
   ```

4. **Update Stored Variables**:
   ```typescript
   storedVars = updateStoredVars(storedVars, step, finalBody);
   ```

---

## Conclusion

The `aleaTransactions.spec.ts` file provides a robust framework for testing transaction APIs by:

* Using scenario-based testing for clarity and maintainability.
* Dynamically preparing request payloads to handle complex workflows.
* Centralizing validation logic for consistent and reliable tests.
* Managing dependencies between test steps using stored variables.

This approach ensures that your transaction APIs are thoroughly tested, reducing the risk of errors in production and simplifying test maintenance as your application evolves.