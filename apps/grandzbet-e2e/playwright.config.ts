import { createUIConfig, extendConfig } from '@test-utils';

/**
 * GrandZBet E2E Test Suite Configuration
 * Uses the base UI configuration optimized for browser testing
 */
const baseConfig = createUIConfig(__dirname);

/**
 * TODO: solution to require password and secret dinamically when you run the script for the tests.
 * When enabled it should be ran with the following command:
 * MY_USER=your_username MY_SECRET=your_password npx playwright test 

	const username = process.env.MY_USER;
	const password = process.env.MY_SECRET;

	if (!username || !password) {
	throw new Error("Missing required environment variables.");
	}
*/	


export default extendConfig(baseConfig, {
	// GrandZBet-specific overrides can go here
	use: {
		// HTTP Basic Authentication for site access
		httpCredentials: {
			username: 'grandzbet', // Replace with your actual HTTP auth username
			password: 'xK322`~e'  // Replace with your actual HTTP auth password
		},
	},
	expect: {
		timeout: 15 * 1000,
	},
	timeout: 60 * 1000,
	workers: 2,
});
