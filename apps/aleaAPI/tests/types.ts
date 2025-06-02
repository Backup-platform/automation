export interface ScenarioData {
    testName: string;
    steps: StepData[];
}

export interface StepData {
    type: 'BET' | 'WIN' | 'BET_WIN' | 'ROLLBACK';
    round: RoundData;
    amount?: number;
    bet?: { amount: number };
    win?: { amount: number };
    secret?: string;  // Add secret to StepData interface
    storeVariablesForNextStep?: StorageConfig;
    expectedValues: ExpectedValues;
    useVariablesFrom?: string;
    onlyRound?: boolean;
    copyStored?: boolean;
}

export interface RoundData {
    status: 'IN_PROGRESS' | 'COMPLETED';
    id?: string;
    integratorRoundId?: string;
}

export interface StorageConfig {
    referenceName?: string;
    id?: string;
    integratorTransactionId?: string;
    round?: RoundData;
    realAmount?: number;
    [key: string]: unknown;
}

export interface ExpectedValues {
    statusCode: number;
    id: string | null;
    realAmount: number | null;
    bet: Record<string, unknown> | null;
    win: Record<string, unknown> | null;
    isAlreadyProcessed: boolean;
}

// Additional type definitions for fixing any types
export interface BalanceParams {
    playerId: string;
    currency?: string;
    casinoSessionId?: string;
    gameId?: string | number;
    softwareId?: string;
    integratorId?: string;
    [key: string]: string | number | boolean | undefined;
}

export interface TransactionPayload {
    id?: string;
    type: 'BET' | 'WIN' | 'BET_WIN' | 'ROLLBACK';
    amount?: number;
    bet?: { amount: number };
    win?: { amount: number };
    round?: RoundData;
    secret?: string;
    integratorTransactionId?: string;
    requestedAt?: string;
    originalRequestType?: string;
    originalAmount?: number;
    onlyRound?: boolean;
    [key: string]: unknown;
}
