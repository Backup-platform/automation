/// <reference lib="dom" />
import { test } from '@playwright/test';

/**
 * @fileoverview Test step decorators for enhanced test reporting
 * 
 * This module provides TypeScript decorators that automatically wrap class methods
 * in Playwright test steps, providing better test reporting and debugging capabilities.
 * Supports both static and dynamic step naming for flexible test documentation.
 */

/**
 * Decorator that wraps methods in a Playwright test step with static naming.
 * Provides enhanced test reporting by creating descriptive step names in test results.
 *
 * @param stepName - Optional custom step name. If not provided, uses class.method format
 * @returns Method decorator function that wraps the original method in test.step()
 *
 * @example
 * ```typescript
 * @step('Click submit button')
 * async clickSubmit() {
 *   await this.submitButton.click();
 * }
 * ```
 */
export function step(stepName?: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function decorator(target: (...args: any[]) => any, context: ClassMethodDecoratorContext) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return async function replacementMethod(this: any, ...args: any[]) {
			const name = stepName || `${this.constructor.name}.${(context.name as string)}`;
			return test.step(name, async () => {
				return await target.apply(this, args);
			});
		};
	}
}

/**
 * Decorator that wraps methods in a Playwright test step with dynamic naming.
 * Allows step names to be computed from method parameters for more descriptive reporting.
 *
 * @param stepName - Function to compute step name from parameters, or static string
 * @returns Method decorator function that wraps the original method in test.step()
 *
 * @example
 * ```typescript
 * @stepParam((email: string) => `Fill email field with: ${email}`)
 * async fillEmail(email: string) {
 *   await this.emailField.fill(email);
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stepParam(stepName?: string | ((...args: any[]) => string)) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function decorator(target: (...args: any[]) => any, context: ClassMethodDecoratorContext) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return async function replacementMethod(this: any, ...args: any[]) {
			const name = typeof stepName === 'function'
				? stepName(...args)
				: stepName || `${this.constructor.name}.${context.name as string}`;

			return test.step(name, async () => {
				return await target.apply(this, args);
			});
		};
	};
}
