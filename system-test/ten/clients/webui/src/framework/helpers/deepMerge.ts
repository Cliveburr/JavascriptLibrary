
const SYSTEM_PROPERTIES = [
    'formGroup'
]

function deepMergeProp(target: any, source: any, prop: string): void {
    const targetPropTypeof = typeof target[prop];
    const sourcePropTypeof = typeof source[prop];

    if (targetPropTypeof == 'undefined') {
        if (Array.isArray(source[prop])) {
            target[prop] = source[prop].slice();
        }
        else {
            target[prop] = source[prop];
            // switch (sourcePropTypeof) {
            //     case 'function':
            //         target[prop] = function () {};
            //         deepMergeSingle(target[prop], source[prop]);
            //         break;
            //     case 'object':
            //         target[prop] = {};
            //         deepMergeSingle(target[prop], source[prop]);
            //         break;
            //     default:
            //         target[prop] = source[prop];
            // }
        }
    }
    else {
        if (Array.isArray(target[prop])) {
            if (!Array.isArray(source[prop])) {
                throw `Target is array and source inst for property ${prop} on object ${target}!`;
            }
            target[prop].push(...source[prop]);            
        }
        else {
            if (SYSTEM_PROPERTIES.indexOf(prop) > -1) {
                return;
            }
            if (targetPropTypeof != sourcePropTypeof) {
                throw `Source typeof and target typeof arent equal for property ${prop} on object ${target}!`;
            }
            switch (targetPropTypeof) {
                case 'function':
                case 'object':
                    deepMergeSingle(target[prop], source[prop]);
                    break;
                default:
                    target[prop] = source[prop];
            }
        }
    }
}

function deepMergeSingle(target: any, source: any): void {
    if (typeof source == 'undefined') {
        return;
    }

    for (let prop in source) {
        deepMergeProp(target, source, prop);
    }
}

export function deepMerge(target: any, ...sources: any[]): void {
    if (typeof target == 'undefined') {
        return;
    }

    for (let source of sources) {
        deepMergeSingle(target, source);
    }
}


function cloneProp(target: any, source: any, prop: string): void {
    const targetPropTypeof = typeof target[prop];
    const sourcePropTypeof = typeof source[prop];

    if (targetPropTypeof == 'undefined') {
        if (Array.isArray(source[prop])) {
            target[prop] = source[prop].slice();
        }
        else {
            switch (sourcePropTypeof) {
                case 'function':
                    target[prop] = function () {};
                    cloneObj(target[prop], source[prop]);
                    break;
                case 'object':
                    target[prop] = {};
                    cloneObj(target[prop], source[prop]);
                    break;
                default:
                    target[prop] = source[prop];
            }
        }
    }
    else {
        if (Array.isArray(target[prop])) {
            if (!Array.isArray(source[prop])) {
                throw `Target is array and source inst for property ${prop} on object ${target}!`;
            }
            target[prop].push(...source[prop]);            
        }
        else {
            if (targetPropTypeof != sourcePropTypeof) {
                throw `Source typeof and target typeof arent equal for property ${prop} on object ${target}!`;
            }
            switch (targetPropTypeof) {
                case 'function':
                case 'object':
                    cloneObj(target[prop], source[prop]);
                    break;
                default:
                    target[prop] = source[prop];
            }
        }
    }
}

function cloneObj(target: any, source: any): void {
    if (typeof source == 'undefined') {
        return;
    }

    for (let prop in source) {
        cloneProp(target, source, prop);
    }
}

export function clone<T>(source: T): T {
    const cloned = <T>{};
    cloneObj(cloned, source);
    return cloned;
}