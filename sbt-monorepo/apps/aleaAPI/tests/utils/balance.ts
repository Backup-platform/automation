export function calculateExpectedBalance(balance: number, body: any, isProcessed: boolean): number {
    if (isProcessed) return balance;
    
    const amount = body.amount || 0;
    
    if (body.type === 'BET') {
        return balance - amount;
    }
    if (body.type === 'WIN') {
        return balance + amount;
    }
    if (body.type === 'BET_WIN') {
        const betAmount = body.bet?.amount || 0;
        const winAmount = body.win?.amount || 0;
        return balance - betAmount + winAmount;
    }
    if (body.type === 'ROLLBACK') {
        if (body.onlyRound) return balance;
        if (body.originalRequestType === 'BET') {
            return balance + (body.originalAmount || 0);
        } else if (body.originalRequestType === 'WIN') {
            return balance - (body.originalAmount || 0);
        } else {
            if (body.originalRequestType === 'BET_WIN') {
                const betAmount = body.bet?.amount || 0;
                const winAmount = body.win?.amount || 0;
                return balance + betAmount - winAmount;
            }
            return balance;
        }
    }
    return balance;
}
