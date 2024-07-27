const fs = require('fs');
const path = require('path');
const vm = require('vm');

class ScriptResource {

    constructor(sys, path) {
        this.sys = sys;
        this.path = path;
    }
    
    // on(sub) {
    //     this.sub = sub;
    //     this.sub(this.load());
    // }

    load() {
        const code = fs.readFileSync(this.path).toString();
        const contentWrapped = `(function ($res, exports) { ${code} \n});`;
        const compiled = vm.runInContext(contentWrapped, this.sys.ctx, {
            importModuleDynamically: (code, script, options) => {
                return new vm.Module();
            }
        });
        const exports = {};
        compiled(this, exports);
        return exports;
        // const mod = require(this.path);

        // if (!mod) {
        //     throw 'Invalid res module file! ' + this.path;
        // }

        // return mod(this.pck, this);
    }

    // reload() {
    //     this.removeCache();
    //     if (this.sub) {
    //         this.sub(this.load());
    //     }
    //     else {
    //         this.load();
    //     }
    // }

    emitFileChange(filename) {
        // const firstBar = this.path.indexOf('/');
        // const stripPath = firstBar > -1 ?
        //     this.path.substr(firstBar + 1) + ".js" :
        //     this.path + ".js";
        // const stripPath = require.resolve(this.path)
        //     .substring(__dirname.length + 1);
        // if (stripPath == filename) {
        //     this.reload();
        // }
    }

    // removeCache() {
    //     const fullPath = path.resolve(this.pck.rootPath, this.path + '.js');
    //     for (const mod in require.cache) {
    //         if (mod == fullPath) {
    //             delete require.cache[mod];
    //             return;
    //         }
    //     }
    // }
}

class ServerDevSystem {

    scripts = [];
    watches = {};

    constructor() {
        this.ctx = vm.createContext(null, {  });
    }

    start(mainPath) {
        const script = new ScriptResource(this, mainPath);
        this.scripts.push(script);
        this.checkWatchScript(mainPath);
        script.load();
        return this;
    }

    checkWatchScript(path) {
        // checar se algum parte do path já esta nos watches
        this.watches[path] = fs.watch(path, { recursive: true }, (event, filename) => {
            if (this.preventWatchTwice && this.preventWatchTwice < Date.now()) {
                this.preventWatchTwice = null;
                return;
            }
            this.preventWatchTwice = Date.now();
            if (filename) {
                this.emitFileChange(filename);
            }
        });
    }

    emitFileChange(filename) {
        for (let script of this.scripts) {
            if (script.emitFileChange) {
                script.emitFileChange(filename);
            }
        }
    }
}

const sys = new ServerDevSystem()
    .start(__dirname + '\\main.js');