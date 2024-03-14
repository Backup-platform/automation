import playwright from 'eslint-plugin-playwright';

export default [
	playwright.configs['flat/recommended'],
	{
		rules: {
			'playwright/no-wait-for-timeout': ['error']
			// Customize Playwright rules
			// ...
		},
	},
];