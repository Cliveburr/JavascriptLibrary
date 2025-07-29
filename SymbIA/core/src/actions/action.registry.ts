import type { ActionHandler } from '@symbia/interfaces';

// Import all action handlers
import { finalizeAction } from './finalize.action.js';

// Registry of all available actions
let allActions: ActionHandler[] = [
    finalizeAction,
    // Add new actions here as they are created
];

/**
 * Get only enabled actions
 */
export function getActions(): ActionHandler[] {
    return allActions.filter(action => action.enabled);
}

/**
 * Get names of all enabled actions for decision-making
 */
export function getEnabledActionNames(): string[] {
    return getActions().map(action => action.name);
}

/**
 * Get action handler by name (searches in all actions, not just enabled)
 */
export function getActionByName(name: string): ActionHandler | undefined {
    return allActions.find(action => action.name === name);
}

/**
 * Register a new action dynamically (for testing or plugins)
 */
export function registerAction(action: ActionHandler): void {
    const existingIndex = allActions.findIndex(a => a.name === action.name);
    if (existingIndex >= 0) {
        allActions[existingIndex] = action;
    } else {
        allActions.push(action);
    }
}

/**
 * Clear all actions (for testing)
 */
export function clearActions(): void {
    allActions = [];
}

/**
 * Reset to default actions (for testing)
 */
export function resetToDefaultActions(): void {
    allActions = [finalizeAction];
}

// Backwards compatibility
export const actions = getActions();
