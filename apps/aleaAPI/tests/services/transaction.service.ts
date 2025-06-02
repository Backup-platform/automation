import { APIRequestContext } from "@playwright/test";
import { computeHash, computeGetSignature } from "../utils/crypto";
import { BASE_GET_PARAMS, SECRET } from "../constants";
import { TransactionPayload } from "../types";

export class TransactionService {
  constructor(private request: APIRequestContext) {}

  // New helper for creating JSON headers with Digest
  private buildHeaders(digest: string): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Digest: `SHA-512=${digest}`,
    };
  }

  async getInitialBalance(playerId: string) {
    const signature = computeGetSignature(BASE_GET_PARAMS, SECRET);
    const response = await this.request.get(
      `brandId/1/players/${playerId}/balance`,
      {
        params: BASE_GET_PARAMS,
        headers: this.buildHeaders(signature),
      }
    );
    return response.json();
  }
  async executeTransaction(payload: TransactionPayload) {
    const hash = computeHash(payload);
    // Remove secret before sending payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { secret, ...requestPayload } = payload;
    return this.request.post("transactions", {
      data: requestPayload,
      headers: this.buildHeaders(hash),
    });
  }
}
