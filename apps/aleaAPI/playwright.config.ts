import { createAPIConfig, extendConfig } from '@test-utils';

/**
 * Alea API Test Suite Configuration
 * Uses the base API configuration optimized for API testing
 */
const baseConfig = createAPIConfig();

export default extendConfig(baseConfig, {
	// Alea-specific overrides
	use: {
		baseURL: 'https://games.dev.inovadatabv.com/alea/',
	},
	projects: [
		{
			name: 'alea-api-tests',
			testMatch: ['aleaTransactions.spec.ts', 'balance.spec.ts'],
			use: {
				baseURL: 'https://games.dev.inovadatabv.com/alea/',
			},
		},
	],
});
