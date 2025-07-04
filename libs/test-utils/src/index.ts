/// <reference lib="dom" />

/**
 * Barrel export file for navigation utilities
 * This file re-exports all functions from the split files to maintain backward compatibility
 */

// Core types
export * from './core-types';

// Basic assertions
export * from './assertions';

// Element interactions
export * from './interactions';

// Consolidated attribute and validation functions
export * from './attributes';

// Navigation helpers
export * from './navigation-helpers';

// Decorators
export * from './decorators';

// Utilities
export * from './utilities';

// Keep original playwright configs export
export * from './playwright-configs';