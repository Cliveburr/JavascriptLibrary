import { ComponentItemBase } from '../model/component.model';

export function baseComponentForRoot(model: any, apply: (item: ComponentItemBase<any>) => void) {
    for (let name in model) {
        apply(model[name]);
    }
}

export function baseComponentForValue(model: any, apply: (item: ComponentItemBase<any>) => void) {
    if ('value' in model) {
        for (let name in model.value) {
            const value = model.value[name];
            const valueType = typeof value;
            if (valueType == 'object' || valueType == 'function') {
                apply(model.value[name]);
            }
        }
    }
}

export function generateRandomName(): string {
    let name = '';
    for (let i = 0; i < 20; i++) {
        name += String.fromCharCode(Math.random() * 255);
    }
    return btoa(name);;
}