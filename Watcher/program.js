"use strict";
const watcher_1 = require('./watcher');
// Colocar watcher em 1 objeto, com ele como target, ou algum de seu filho como target
// a partir do target atingido, observar todas suas props e dos filhos recursivamente
// itens de array, observar as funções e todos itens, recursivamente
console.log('init');
// let base: any = {};
// let inner = {
//     a: 1
// };
// Object.defineProperty(base, 'prop', {
//     get: () => {
//         setTimeout(() => console.log(inner));
//         return inner;
//     },
//     set: (v) => {
//         console.log(v);
//     }
// });
// base.prop.b = 2;
// delete base.prop.b;
// console.log(base.prop);
// Test 1
if (0) {
    let base1 = {};
    watcher_1.watcher(base1, 'prop1', (v, o) => {
        console.log('base1.prop1 changeon: ', v, o);
    });
    base1.prop1 = 1;
    base1.prop1 = 2;
    watcher_1.watcher(base1, 'prop2', (ns, n, o, c) => {
        console.log('base1.prop2 changeon: ', ns, n, o, c);
    });
    base1.prop2 = {};
    base1.prop2.a = 'aaa';
    base1.prop2.a = 'aaaAAA';
    base1.prop2.b = 'bbb';
    delete base1.prop2.a;
    base1.prop2.c = 'ccc';
    delete base1.prop2.c;
    setTimeout(() => base1.prop2.d = 'ddd');
    setTimeout(() => delete base1.prop2.d);
}
if (1) {
    let base2 = {};
    watcher_1.watcher(base2, 'array1', (ns, n, o, c) => {
        console.log('base2.array1:', ns, n, o, c);
    });
    base2.array1 = [];
    base2.array1.push(0);
    base2.array1.push(1);
    base2.array1.push(2);
    base2.array1.push(3);
    base2.array1.push(4);
    base2.array1.push(5);
    base2.array1.splice(3, 1);
}
//# sourceMappingURL=program.js.map