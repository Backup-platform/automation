/**
 * @fileoverview Minimal debug utilities for helper validation
 * 
 * Simple logging for tracking validation of test helper methods.
 * Only includes the debugLog function which is actually used in tests.
 * 
 * Environment Variable: DEBUG_ASSERTIONS (off | basic | detailed | verbose)
 */

/**
 * Debug levels for validation logging
 */
export type DebugLevel = 'off' | 'basic' | 'detailed' | 'verbose';

/**
 * Get current debug level from environment
 */
export function getDebugLevel(): DebugLevel {
    const level = process.env.DEBUG_ASSERTIONS?.toLowerCase() as DebugLevel;
    return ['off', 'basic', 'detailed', 'verbose'].includes(level) ? level : 'off';
}

/**
 * Check if any debug logging is enabled
 */
export function isDebugMode(): boolean {
    return getDebugLevel() !== 'off';
}

/**
 * Main logging function - logs validation progress at specified level
 * 
 * This is the ONLY function actually used from this module in debug.spec.ts
 * 
 * @param level - Required debug level to show this message
 * @param message - Validation message to log
 * @param data - Optional test data (shown in detailed/verbose modes)
 */
export function debugLog(level: DebugLevel, message: string, data?: unknown): void {
    const currentLevel = getDebugLevel();
    const levels = ['off', 'basic', 'detailed', 'verbose'];
    const shouldLog = levels.indexOf(currentLevel) >= levels.indexOf(level);
    
    if (!shouldLog) return;
    
    // Simple timestamp (local time, just time part)
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour12: false });
    
    // Level-specific icons
    const icon = level === 'verbose' ? '🔍' : level === 'detailed' ? '📋' : '🐛';
    
    console.log(`${icon} [${time}] ${message}`);
    
    // Include data for detailed analysis
    if (data && (currentLevel === 'detailed' || currentLevel === 'verbose')) {
        console.log('   📄 Data:', JSON.stringify(data, null, 2));
    }
}
