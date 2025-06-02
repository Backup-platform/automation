import { TransactionPayload } from '../types';

export function generateDynamicValues(body: TransactionPayload): TransactionPayload {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const id = `${timestamp}-${random}`;
    const roundId = `${timestamp}-${Math.floor(Math.random() * 1000)}`;

    return {
        ...body,
        id,
        integratorTransactionId: id,
        requestedAt: new Date().toISOString(),
        round: {
            ...body.round,
            id: roundId,
            integratorRoundId: roundId,
            status: body.round?.status || 'IN_PROGRESS',
        },
    };
}