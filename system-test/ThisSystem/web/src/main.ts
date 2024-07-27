//load()

console.log('hit a');

import * as second from './second';
//const second = require('./second');
console.log('Value from second: ' + second.someValue);

import('./second.js')
    .then(a => console.log('Changed second: ' + a.someValue))

// const myimport = (path: string) => {
//     return import(path);
// }

// import('./second.js')
//     .then(b => b.someValue);

