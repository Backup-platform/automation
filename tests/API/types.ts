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
}

export interface ExpectedValues {
    statusCode: number;
    id: string | null;
    realAmount: number | null;
    bet: any;
    win: any;
    isAlreadyProcessed: boolean;
}
