import { ComponentItemBase, ComponentStatus } from '../model';

function stripPayLoadArray(obj: any[]): any[] {
    return obj
        .map(o => stripPayLoadModel(o));
}

function isObjectForComponent(obj: any): obj is ComponentItemBase<any> {
    //return typeof obj.status != 'undefined';
    return typeof obj.__isModel__ != 'undefined';
}

// function stripPayLoadObject(obj: Object): Object {
//     const striped = <any>{};
//     console.log(obj)
//     if (isObjectForComponent(obj)) {
//         const status = obj.status || ComponentStatus.pristine;
//         if (status == ComponentStatus.remove) {
//             striped.status = obj.status;
//         }
//         else if (status == ComponentStatus.create || status == ComponentStatus.update) {
//             striped.status = obj.status;
//             striped.value = stripPayLoad(obj.value);
//         }
//     }
//     else {
//         for (let prop in obj) {
//             striped[prop] = stripPayLoad(obj[prop]);
//         }
//     }
//     return striped;
// }
function stripPayLoadObject(obj: Object): Object {
    const striped = <any>{};
    for (let prop in obj) {
        striped[prop] = stripPayLoadModel(obj[prop]);
    }
    return striped;
}

function stripPayLoadModel(obj: any): Object {
    const striped = <any>{};
    const status = obj.status || ComponentStatus.pristine;
    if (status == ComponentStatus.remove) {
        striped.status = obj.status;
    }
    else {
        striped.status = obj.status;
        striped.value = stripPayLoad(obj.value);
    }
    return striped;
}

export function stripPayLoad(obj?: any): any | undefined {
    if (typeof obj == 'undefined' || obj == null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return stripPayLoadArray(obj);
    }
    else if (obj instanceof Date) {
        return obj;
    }
    else if (typeof obj == 'object') {
        return stripPayLoadObject(obj);
    }
    else {
        return obj;
    }
}
