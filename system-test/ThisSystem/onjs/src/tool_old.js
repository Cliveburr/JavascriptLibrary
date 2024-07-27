// const fs = require('fs');
// const path = require('path');
// const mod = require('module');
// const vm = require('vm');

// const ctx = vm.createContext();

// var ttt = vm.runInContext('(function () { console.log("foi"); });', ctx);
// ttt();


// //const _wrap = mod.Module.wrap;
// mod.Module.wrap = function (code) {
//     const wrapedcontent = `(function (exports, require, module, __filename, __dirname) { ${code} \n});`;
//     //var test = _wrap(code)
//     return wrapedcontent;
// }

// //var a = module.require;

// // const _require = mod.prototype.require;
// // Object.defineProperty(mod.prototype, 'require', function(tis, id)
// // {
// //     console.log('ping');
// //     return _require.call(tis, id);
// // });
// //mod.prototype.require = function (this, id) {
// //     const modulePath =  (<any>mod)._resolveFilename(id, this);
// //     if (modulePath.startsWith(appRoot) && !onwatch[modulePath]) {
// //         onwatch[modulePath] = fs.watch(modulePath, onWatchFile.bind(onWatchFile, modulePath));
// //     }
//     //return _require.call(this, id);
// //}

// class ScriptResource {

//     constructor(pck, path) {
//         this.pck = pck;
//         this.path = path;
//     }
    
//     on(sub) {
//         this.sub = sub;
//         this.sub(this.load());
//     }

//     load() {
//         const mod = require(this.path);

//         if (!mod) {
//             throw 'Invalid res module file! ' + this.path;
//         }

//         return mod(this.pck, this);
//     }

//     reload() {
//         this.removeCache();
//         if (this.sub) {
//             this.sub(this.load());
//         }
//         else {
//             this.load();
//         }
//     }

//     emitFileChange(filename) {
//         // const firstBar = this.path.indexOf('/');
//         // const stripPath = firstBar > -1 ?
//         //     this.path.substr(firstBar + 1) + ".js" :
//         //     this.path + ".js";
//         const stripPath = require.resolve(this.path)
//             .substring(__dirname.length + 1);
//         if (stripPath == filename) {
//             this.reload();
//         }
//     }

//     removeCache() {
//         const fullPath = path.resolve(this.pck.rootPath, this.path + '.js');
//         for (const mod in require.cache) {
//             if (mod == fullPath) {
//                 delete require.cache[mod];
//                 return;
//             }
//         }
//     }
// }

// class StaticResource {

// }

// class Package {

//     scripts = [];

//     constructor(rootPath) {
//         this.rootPath = rootPath;
//     }

//     watch() {
//         this.watchListerner = fs.watch(this.rootPath, { recursive: true }, (event, filename) => {
//             if (this.preventWatchTwice && this.preventWatchTwice < Date.now()) {
//                 this.preventWatchTwice = null;
//                 return;
//             }
//             this.preventWatchTwice = Date.now();
//             if (filename) {
//                 this.emitFileChange(filename);
//             }
//         });
//         return this;
//     }

//     emitFileChange(filename) {
//         for (let script of this.scripts) {
//             if (script.emitFileChange) {
//                 script.emitFileChange(filename);
//             }
//         }
//     }

//     require(path) {
//         const script = new ScriptResource(this, path);
//         this.scripts.push(script);
//         return script;        
//     }
// }

// const pckage = new Package(__dirname)
//     .watch()
//     .require('./main')
//         .load();
