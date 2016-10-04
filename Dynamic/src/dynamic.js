"use strict";
function bootstrap(cls) {
    let scope = new cls();
    bindScope(document.body, scope);
}
exports.bootstrap = bootstrap;
function bindScope(el, cls) {
}
//# sourceMappingURL=dynamic.js.map