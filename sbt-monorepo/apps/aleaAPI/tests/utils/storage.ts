import merge from 'lodash.merge';
import { StepData } from '../types';

// Type definitions
type StorageSpec = Record<string, unknown>;
type SourceData = Record<string, unknown>;

function extractStoredValues(spec: StorageSpec, source: SourceData): Record<string, unknown> {
    return Object.keys(spec).reduce((acc, key) => {
        if (key === 'referenceName') return acc;
        acc[key] = typeof spec[key] === 'object' && spec[key] !== null
            ? extractStoredValues(spec[key] as StorageSpec, (source[key] as SourceData) || {})
            : source[key];
        return acc;
    }, {} as Record<string, unknown>);
}

export function updateStoredVars(
    storedVars: Record<string, Record<string, unknown>>,
    stepData: StepData,
    finalBody: Record<string, unknown>
): Record<string, Record<string, unknown>> {
    if (stepData.storeVariablesForNextStep) {
        const refName = stepData.storeVariablesForNextStep.referenceName;
        const newVars = extractStoredValues(stepData.storeVariablesForNextStep, finalBody);

        // Explicitly store round information if defined for storage
        if (stepData.storeVariablesForNextStep.round !== undefined) {
            newVars.round = finalBody.round;
        }        // Also store id and integratorTransactionId if configured
        ['id', 'integratorTransactionId'].forEach(field => {
            if (stepData.storeVariablesForNextStep && stepData.storeVariablesForNextStep[field] !== undefined) {
                newVars[field] = finalBody[field];
            }
        });        // Capture transaction id if present.
        // For non-ROLLBACK steps, always update transactionId.
        // For ROLLBACK steps, update only if no transactionId is already stored.
        if (finalBody.transaction && (finalBody.transaction as { id?: string }).id) {
            if (stepData.type !== 'ROLLBACK' || (refName && !storedVars[refName]?.transactionId)) {
                newVars.transactionId = (finalBody.transaction as { id: string }).id;
            }
        }

        // For transactional types, capture additional fields.
        if (
            stepData.type === 'BET' ||
            stepData.type === 'WIN' ||
            stepData.type === 'BET_WIN' ||
            stepData.type === 'ROLLBACK'
        ) {
            if (newVars.originalAmount === undefined) {
                newVars.originalAmount = stepData.storeVariablesForNextStep.realAmount ?? finalBody.amount;
            }
            newVars.originalRequestType = stepData.type;
            // For BET_WIN, store bet and win values also.
            if (stepData.type === 'BET_WIN') {
                newVars.bet = finalBody.bet;
                newVars.win = finalBody.win;
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
