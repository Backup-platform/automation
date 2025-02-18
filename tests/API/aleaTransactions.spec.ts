import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { TransactionService } from './services/transaction.service';
import { validateExpectedValues, validateResponse, validateBalance } from './utils/validation';
import { removeTestKeys, prepareRollbackBody, prepareStandardBody } from './utils/payloadPreparation';
import { BASE_BODY, BASE_PLAYER_ID } from './constants';
import { updateStoredVars } from './utils/storage';
import { calculateExpectedBalance } from './utils/balance';
import { ScenarioData, StepData } from './types';

test.describe.configure({ mode: 'serial' });

test.describe('Transaction API Tests', () => {
    let transactionService: TransactionService;
    let initialBalance: number;
    let runningBalance: number;
    let storedVars: Record<string, any> = {};

    test.beforeEach(async ({ request }) => {
        transactionService = new TransactionService(request);
        const balanceResponse = await transactionService.getInitialBalance(BASE_PLAYER_ID);
        console.log("Initial GET response:", balanceResponse);
        initialBalance = runningBalance = balanceResponse.realBalance;
    });

    // Helper: process individual step
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

    const scenarios: ScenarioData[] = JSON.parse(fs.readFileSync(
        path.join("test-data", "aleaTransactionsAPI.json"),
        "utf-8"
    ));

    for (const scenario of scenarios) {
        test(scenario.testName, async () => {
            // Use a local variable for current scenario name
            const currentScenario = scenario.testName;
            storedVars = {};
            // Process each step using the helper
            for (const [index, step] of scenario.steps.entries()) {
                await processStep(step, index, currentScenario);
            }
        });
    }
});
