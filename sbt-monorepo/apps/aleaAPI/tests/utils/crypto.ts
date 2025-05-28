import crypto from 'crypto';
import { SECRET } from '../constants';

// Simplified secret handling using optional chaining and template literals.
export function computeHash(body: any): string {
    const secret = body.secret ?? SECRET;
    const { secret: _secret, ...bodyWithoutSecret } = body;
    return crypto.createHash("sha512")
        .update(`${JSON.stringify(bodyWithoutSecret)}${secret}`, "utf-8")
        .digest("hex");
}

export function computeGetSignature(params: Record<string, any>, secret: string): string {
    const orderedKeys = ['casinoSessionId', 'currency', 'gameId', 'softwareId', 'integratorId'];
    const rawStr = orderedKeys.map(key => params[key]).join('') + secret;
    return crypto.createHash('sha512').update(rawStr, 'utf-8').digest('hex');
}
