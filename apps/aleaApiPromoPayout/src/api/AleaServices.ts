import axios from 'axios';
import { buildPromoBody } from '../helper/buildPromoBody.js';
import type { PromoPayload } from '../helper/buildPromoBody.js';
import { PromoType } from '../helper/promoTypes.js';
import { computeSHA512Hash } from './crypto.js';
import dotenv from 'dotenv';
import path from 'path';
import type { BalanceResponse, PromoPayoutResponse } from '../helper/responseTypes.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });


export class Transactions {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.SF_DEV_URL ?? ''
    }

    async getBalance(playerID: string): Promise<BalanceResponse> {
        const url = new URL(`players/${playerID}/balance`, this.baseUrl);

        const queryParams = {
            casinoSessionId: process.env.CASINO_SESSION_ID,
            currency: process.env.CURRENCY,
            gameId: Number(process.env.GAME_ID),
            integratorId: process.env.INTEGRATOR_ID,
            softwareId: process.env.SOFTWARE_ID

        };

        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.set(key, value.toString());
            }
        });

        const digest = computeSHA512Hash(Object.values(queryParams).join(''));

        const options = {
            method: 'GET',
            url: url.toString(),
            headers: {
                'Content-Type': 'application/json',
                'Digest': `SHA-512=${digest}`
            }
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error('get balanse error:', error);
            throw error;
        }
    }

    async sendPromoPayout(promoType: PromoType,
        playerId: string,
        amount: number,
        id: string,
        place?: string,
        bonusId?: string,
        cost?: number

    ): Promise<PromoPayoutResponse> {

        const url = new URL(`transactions`, this.baseUrl);

        if (!url) throw new Error('SF_DEV_URL is not defined in .env');

        let payload: PromoPayload;

        if (promoType === PromoType.TOURNAMENT) {
            if (place === undefined) {
                throw new Error('Place is required for TOURNAMENT promo type');
            }

            payload = {
                id,
                promoType,
                playerId,
                amount,
                place,
            };
        }
        else {
            payload = {
                id,
                promoType,
                playerId,
                amount
            };
        }

        const body = buildPromoBody(payload);

        // Hash - JSON-а
        const bodyString = JSON.stringify(body);
        const hash = computeSHA512Hash(bodyString); // work with UTF-8 + hex

        try {
            const response = await axios.post(url.toString(), body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Digest': `SHA-512=${hash}`,
                },
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ Promo payout failed:', error.response?.data || error.message);
            return error
        }
    }
}