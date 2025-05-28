import merge from 'lodash.merge';
import { generateDynamicValues } from './helpers';
import { StepData } from '../types';

// New helper to prepare the final body
function prepareFinalBody(stepData: StepData, baseBody: any): any {
    let finalBody = generateDynamicValues({ ...baseBody });
    if (stepData.secret) {
        finalBody.secret = stepData.secret;
    }
    return merge({}, finalBody, stepData);
}

export function removeTestKeys(payload: any): any {
    const keepKeys = [
        "id",
        "integratorTransactionId",
        "type",
        "requestedAt",
        "game",
        "software",
        "integrator",
        "player",
        "currency",
        "casinoSessionId",
        "round",
        "amount",
        "transaction", // for rollback only if exists
        "bet",        // Add bet structure
        "win",        // Add win structure
        "secret"      // Keep secret in payload for hash computation
    ];
    return Object.fromEntries(
        Object.entries(payload).filter(([key]) => keepKeys.includes(key))
    );
}

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

export function prepareStandardBody(stepData: StepData, storedVars: Record<string, any>, baseBody: any): any {
    let finalBody = prepareFinalBody(stepData, baseBody);

    if (stepData.useVariablesFrom && storedVars[stepData.useVariablesFrom]) {
        // Only merge round to retain the same round data while preserving new transaction IDs.
        if (storedVars[stepData.useVariablesFrom].round) {
            finalBody.round = storedVars[stepData.useVariablesFrom].round;
        }
    } else if (!stepData.useVariablesFrom && Object.keys(storedVars).length > 0) {
        finalBody = merge({}, finalBody, storedVars);
    }
    
    // Handle BET_WIN type specially
    if (finalBody.type === 'BET_WIN') {
        delete finalBody.amount;  // Remove flat amount
        // Ensure bet/win structures are properly formatted
        finalBody.bet = {
            amount: stepData.bet?.amount || 0
        };
        finalBody.win = {
            amount: stepData.win?.amount || 0
        };
    }

    delete finalBody.storeVariablesForNextStep;
    delete finalBody.expectedValues;

    return finalBody;
}
