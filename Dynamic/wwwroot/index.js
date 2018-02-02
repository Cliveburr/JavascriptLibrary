// import { DynamicApp, ITag, BrowserLoader } from './dynamic/index';
// class AppTagProvider implements ITag {
//     public test(tagName: string): boolean {
//         return /^APP-/.test(tagName);
//     }
//     public define(tag: any): void {
//         let name = /^DY-(.*)/.exec(tag.name)[1];
//         name = name[0].toUpperCase() + name.substr(1).toLowerCase();
//         tag.htmlUrl = `/Elements/${name}/${name}.html`;
//         tag.scripts = [`/Elements/${name}/${name}.js`];
//         tag.controller = `app.Elements.${name}`;
//     }
// }
// let app = new DynamicApp();
// app.addTagProvider(AppTagProvider);
// app.addLoaderProvider(BrowserLoader);
// app.run('/view/main');
// console.log('hit');
// let a = document.createElement("script");
// a.
// document.onclick = () => {
//     let a = require('./view/main.js');
//     console.log(a);
// };
// let script = document.createElement("script");
// script.src = '/view/main.js';
// script.async = true;
// script.type = 'module';
// script.onload = (ev) => {
//     console.log(script);
//     debugger;
//     // if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
//     //     script = script.onload = script.onreadystatechange = null;
//     //     if (isAbort)
//     //         callBack(false, 'Error loading script: ' + url);
//     //     else {
//     //         callBack(true, null);
//     //     }
//     // }
// };
// script.onerror = () => {
//     script = script.onload = script.onreadystatechange = null;
//     callBack(false, 'Error loading script: ' + url);
// };
//document.head.appendChild(script).parentNode.removeChild(script);;
let script = document.createElement("script");
script.type = 'module';
script.innerHTML = `import * as main from './view/main.js';
console.log(main);
main.Blah.testS = 1;`;
document.head.appendChild(script).parentNode.removeChild(script);
let scrip2t = document.createElement("script");
script.type = 'module';
script.innerHTML = `import * as main from './view/main.js';
console.log(main);
main.Blah.testS += 1;
console.log(main);`;
document.head.appendChild(script).parentNode.removeChild(script);
//# sourceMappingURL=index.js.map