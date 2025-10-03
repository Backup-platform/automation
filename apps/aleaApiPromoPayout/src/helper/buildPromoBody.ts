import { PromoType } from './promoTypes';

interface FreeSpinPayout { //ok
    id: string,
    promoType: PromoType.FREE_SPIN
    playerId: string;
    amount: number;
}

interface TournamentPayout { //ok
    id: string,
    promoType: PromoType.TOURNAMENT
    playerId: string;
    amount: number;
    place: string;
}

interface SpinGiftPayout { //ok
    id: string,
    promoType: PromoType.SPIN_GIFT
    playerId: string;
    amount: number;
}

interface PrizePayout { //ok
    id: string,
    promoType: PromoType.PRIZE
    playerId: string;
    amount: number;
}

interface CashbackPayout { //ok
    id: string,
    promoType: PromoType.CASHBACK
    playerId: string;
    amount: number;
}

export type PromoPayload =
    | FreeSpinPayout
    | TournamentPayout
    | SpinGiftPayout
    | PrizePayout
    | CashbackPayout;

export function buildPromoBody(payload: PromoPayload): any {

    const base = {
        id: payload.id,
        type: 'PROMO_PAYOUT',
        promoType: payload.promoType,
        requestedAt: process.env.REQUESTED_AT,
        playerId: payload.playerId
    };

    switch (payload.promoType) {
        case PromoType.FREE_SPIN:
        case PromoType.SPIN_GIFT:
        case PromoType.CASHBACK:
        case PromoType.PRIZE:
            return {
                ...base,
                [getPromoKey(payload.promoType)]: {
                    campaignId: process.env.CAMPAIGN_ID || '',
                    gameId: Number(process.env.GAME_ID),
                    amount: payload.amount,
                    currency: process.env.CURRENCY || 'EUR',
                },
            };

        case PromoType.TOURNAMENT:
            return {
                ...base,
                tournament: {
                    campaignId: process.env.CAMPAIGN_ID || '',
                    gameId: Number(process.env.GAME_ID),
                    amount: payload.amount,
                    currency: process.env.CURRENCY || 'EUR',
                    place: payload.place,
                },
            };

        default:
            throw new Error(`Unsupported promoType: ${(payload as any).promoType}`);
    }
}

function getPromoKey(promoType: PromoType): string {
    switch (promoType) {
        case PromoType.FREE_SPIN:
            return 'freeSpin';
        case PromoType.SPIN_GIFT:
            return 'spinGift';
        case PromoType.CASHBACK:
            return 'cashback';
        case PromoType.PRIZE:
            return 'prize';
        default:
            throw new Error(`Unsupported promoType for body key: ${promoType}`);
    }
}

