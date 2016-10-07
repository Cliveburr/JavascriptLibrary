import { Observer, ObserverArray } from './observer';

if (0)
{
    let one = Observer(111);
    one.on((value) => {
        console.log(`one value: ${value}`);
    });

    one(222);
    one(333);
    console.log(`and one value is: ${one()}`);
}

let arrayOne = ObserverArray(['111', '222', '333', '444', '555']);
arrayOne.on((value, index, type) => {
    console.log(`change! value: ${value} index: ${index} type: ${type}`);
});
console.log(`value 0 = ${arrayOne()[0]}`);
console.log(`value 1 = ${arrayOne()[1]}`);
console.log(`value 2 = ${arrayOne()[2]}`);
arrayOne()[0] = 'aaa';
console.log(`value 0 = ${arrayOne()[0]}`);
console.log('pushed count: ' + arrayOne.push('lll', 'www'));
console.log(`pop = ${arrayOne.pop()}`);
console.log(`pop = ${arrayOne.pop()}`);
console.log('unshifted count: ' + arrayOne.unshift('AAA', 'BBB'));
console.log(`shift = ${arrayOne.shift()}`);
console.log(`shift = ${arrayOne.shift()}`);

let a = 1;