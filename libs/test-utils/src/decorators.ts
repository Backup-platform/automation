/// <reference lib="dom" />
import { test } from '@playwright/test';

/**
 * Test step decorators
 */

/**
 * Decorator to wrap methods in a test step.
 *
 * @param stepName - Optional custom step name for the test step.
 * @returns Method decorator function.
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
 * Decorator to wrap methods in a test step with parameterized names.
 *
 * @param stepName - Function or string for custom step name, or undefined for default.
 * @returns Method decorator function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stepParam(stepName?: string | ((...args: any[]) => string)) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function decorator(target: (...args: any[]) => any, context: ClassMethodDecoratorContext) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return async function replacementMethod(this: any, ...args: any[]) {
			const name = typeof stepName === 'function'
				? stepName(...args) // Use the args to compute the step name
				: stepName || `${this.constructor.name}.${context.name as string}`;

			return test.step(name, async () => {
				return await target.apply(this, args); // Ensure the original method runs in the correct context
			});
		};
	};
}
