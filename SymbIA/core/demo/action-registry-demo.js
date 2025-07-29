// Simple demonstration of ActionRegistry usage
import { getEnabledActionNames, getActionByName } from '../src/actions/action.registry.js';

console.log('=== ActionRegistry Demo ===');
console.log('Enabled actions:', getEnabledActionNames());

const finalizeAction = getActionByName('Finalize');
if (finalizeAction) {
    console.log('Found Finalize action:', {
        name: finalizeAction.name,
        enabled: finalizeAction.enabled
    });
}

console.log('ActionRegistry is working correctly!');
