/// <reference lib="dom" />

/**
 * @fileoverview Barrel export file for test-utils library
 * 
 * This module provides a unified entry point for all test-utils functionality,
 * re-exporting all public APIs from individual modules while maintaining
 * backward compatibility. Organized by functional domains for clear
 * understanding of available capabilities.
 * 
 * 
 * @example
 * ```typescript
 * // Import everything from the main entry point
 * import { 
 *   clickElement, 
 *   assertVisible, 
 *   compositeLocator,
 *   step 
 * } from '@test-utils';
 * 
 * // Or import from specific modules
 * import { clickElement } from '@test-utils/interactions';
 * import { assertVisible } from '@test-utils/assertions';
 * ```
 */

// Core types and factory functions
export * from './core-types';

// Unified assertion system
export * from './assertions';

// Unified interaction system
export * from './interactions';

// Advanced attribute validation
export * from './attributes';

// Text extraction utilities
export * from './text-extraction';

// Group assertion utilities
export * from './assertions.groups';

// Navigation and URL helpers
export * from './navigation-helpers';

// Test step decorators
export * from './decorators';

// General utilities (date parsing, conditional execution, etc.)
export * from './utilities';

// Playwright configuration helpers
export * from './playwright-configs';

// Legacy navigation functions (for debugging/comparison) - export only specific functions
export { 
    legacyAssertVisibleNotActionable,
    legacyAssertVisible,
    legacyAssertEnabled,
    compositeLocator as legacyCompositeLocator,
    step as legacyStep
} from './navigation.po';