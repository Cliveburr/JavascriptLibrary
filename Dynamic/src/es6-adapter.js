"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const url_1 = require("url");
class Es6Adapter {
    process(ctx, next) {
        let isAjax = ctx.request.headers['x-requested-with'] == 'XMLHttpRequest';
        let pathname = url_1.parse(ctx.request.url).pathname;
        if (isAjax) {
            this.ES6Adapter(ctx, pathname);
        }
        else {
            if (!this.ES6Adapter(ctx, pathname)) {
                ctx.request.url = '/index.html';
            }
        }
        next();
    }
    ES6Adapter(ctx, pathname) {
        let file = path.resolve(ctx.server.wwwroot + pathname);
        if (this.fileExists(file)) {
            return true;
        }
        else {
            let fileJs = file + '.js';
            if (this.fileExists(fileJs)) {
                ctx.request.url += '.js';
                return true;
            }
        }
        return false;
    }
    fileExists(file) {
        try {
            let stat = fs.statSync(file);
            return stat.isFile();
        }
        catch (_a) {
            return false;
        }
    }
}
exports.Es6Adapter = Es6Adapter;
//# sourceMappingURL=es6-adapter.js.map