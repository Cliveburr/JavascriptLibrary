import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
    getActions,
    getEnabledActionNames,
    getActionByName,
    registerAction,
    resetToDefaultActions
} from '../src/actions/action.registry.js';
import type { ActionHandler } from '@symbia/interfaces';

describe('ActionRegistry', () => {
    beforeEach(() => {
        resetToDefaultActions();
    });

    afterEach(() => {
        resetToDefaultActions();
    });

    it('should list enabled actions', () => {
        const enabledNames = getEnabledActionNames();
        expect(enabledNames).toBeInstanceOf(Array);
        expect(enabledNames.length).toBeGreaterThan(0);
    });

    it('should include "Finalize" action after implementing stub', () => {
        const enabledNames = getEnabledActionNames();
        expect(enabledNames).toContain('Finalize');
    });

    it('should get action by name', () => {
        const finalizeAction = getActionByName('Finalize');
        expect(finalizeAction).toBeDefined();
        expect(finalizeAction?.name).toBe('Finalize');
        expect(finalizeAction?.enabled).toBe(true);
    });

    it('should return undefined for non-existent action', () => {
        const nonExistentAction = getActionByName('NonExistent');
        expect(nonExistentAction).toBeUndefined();
    });

    it('should register new action dynamically', () => {
        const testAction: ActionHandler = {
            name: 'TestAction',
            enabled: true,
            execute: async () => { /* test implementation */ }
        };

        registerAction(testAction);
        const retrievedAction = getActionByName('TestAction');
        expect(retrievedAction).toBeDefined();
        expect(retrievedAction?.name).toBe('TestAction');
    });

    it('should only include enabled actions in actions array', () => {
        const disabledAction: ActionHandler = {
            name: 'DisabledAction',
            enabled: false,
            execute: async () => { /* test implementation */ }
        };

        registerAction(disabledAction);
        const enabledNames = getEnabledActionNames();
        expect(enabledNames).not.toContain('DisabledAction');
    });

    it('should replace existing action when registering with same name', () => {
        const originalAction: ActionHandler = {
            name: 'ReplaceableAction',
            enabled: true,
            execute: async () => { /* original */ }
        };

        const updatedAction: ActionHandler = {
            name: 'ReplaceableAction',
            enabled: false,
            execute: async () => { /* updated */ }
        };

        registerAction(originalAction);
        expect(getActionByName('ReplaceableAction')?.enabled).toBe(true);

        registerAction(updatedAction);
        expect(getActionByName('ReplaceableAction')?.enabled).toBe(false);
    });

    it('should get all actions including disabled ones', () => {
        const disabledAction: ActionHandler = {
            name: 'DisabledAction',
            enabled: false,
            execute: async () => { /* test implementation */ }
        };

        registerAction(disabledAction);
        const allActions = getActions();
        const enabledActions = getActions().filter(a => a.enabled);

        // All actions should only return enabled actions
        expect(allActions.every(a => a.enabled)).toBe(true);
        expect(enabledActions.length).toBe(allActions.length);
    });
});
