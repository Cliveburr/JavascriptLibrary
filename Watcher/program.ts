import { watcher, removeWatcher } from './watcher';

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
    let base1: any = {};
    watcher(base1, 'prop1', (v, o) => {
        console.log('base1.prop1 changeon: ', v, o);
    });
    base1.prop1 = 1;
    base1.prop1 = 2;

    watcher(base1, 'prop2', (ns, n, o, c) => {
        console.log('base1.prop2 changeon: ', ns, n, o, c);
    });
    base1.prop2 = <any>{};
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
    let base2: any = {};
    watcher(base2, 'array1', (ns, n, o, c) => {
        console.log('base2.array1:', ns, n, o, c);
    });
    base2.array1 = [];
    base2.array1.push(0);
    base2.array1.push(111);
    base2.array1.push(222);
    base2.array1.push(333);
    base2.array1.push(444);
    base2.array1.push(555);
    base2.array1.splice(3, 1);
}

if (0) {
    let base3: any = {};
    watcher(base3, 'name1.prop1', (ns, n, o, c) => {
        console.log('base3.name1.prop1:', ns, n, o, c);
    });
    base3.name1 = {};
    base3.name1.prop1 = 1;
    base3.name1.prop1 = {};
    base3.name1.prop1.inside = 3;

    watcher(base3, 'name2.prop2.some3', (ns, n, o, c) => {
        console.log('base3.name2.prop2.some3:', ns, n, o, c);
    });
    base3.name2 = {};
    base3.name2.prop2 = {};
    base3.name2.prop2.some3 = 4;
    base3.name2.prop2.some3 = 5;
    base3.name2.prop2.some3 = {};
    base3.name2.prop2.some3.inside = 7;
}

if (0) {
    let base4: any = {};
    let tw = (ns, n, o, c) => {
        console.log('base4.torem:', ns, n, o, c);
    };
    watcher(base4, 'torem', tw);
    base4.torem = 1;
    base4.torem = 2;
    base4.torem = 3;
    removeWatcher(base4, 'torem', tw);
    base4.torem = 4;
    let tw2 = (ns, n, o, c) => {
        console.log('base4.prop.torem2:', ns, n, o, c);
    };
    watcher(base4, 'prop.torem2', tw2);
    base4.prop = {};
    base4.prop.torem2 = 1;
    base4.prop.torem2 = 2;
    base4.prop.torem2 = 3;
    removeWatcher(base4, 'prop.torem2', tw2);
    base4.prop.torem2 = 4;
}

if (0) {
    let base5: any = {};
    let tw = (ns, n, o, c) => {
        console.log('base5.prop5:', ns, n, o, c);
    };
    watcher(base5, 'prop5', tw);
    base5.prop5 = 1;
    let change = base5;
    change.prop5 = 2;
    base5.prop5 = 3;
}