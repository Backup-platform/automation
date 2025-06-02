import crypto from 'crypto';
import { SECRET } from '../constants';
import { TransactionPayload } from '../types';

// Simplified secret handling using optional chaining and template literals.
export function computeHash(body: TransactionPayload): string {
    const secret = body.secret ?? SECRET;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { secret: _secret, ...bodyWithoutSecret } = body;
    return crypto.createHash("sha512")
        .update(`${JSON.stringify(bodyWithoutSecret)}${secret}`, "utf-8")
        .digest("hex");
}

export function computeGetSignature(params: Record<string, string | number | boolean | undefined>, secret: string): string {
    const orderedKeys = ['casinoSessionId', 'currency', 'gameId', 'softwareId', 'integratorId'];
    const rawStr = orderedKeys.map(key => params[key] ?? '').join('') + secret;
    return crypto.createHash('sha512').update(rawStr, 'utf-8').digest('hex');
}
