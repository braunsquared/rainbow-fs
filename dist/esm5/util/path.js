"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sep = '/';
function normalize(path) {
    var norm = path.replace(/\/{2,}/g, '/').replace(/\/$/, '');
    return norm.startsWith('/') ? norm : "/" + norm;
}
exports.normalize = normalize;
function join() {
    var elements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elements[_i] = arguments[_i];
    }
    return normalize(elements.filter(function (i) { return !!i; }).join(exports.sep));
}
exports.join = join;
function split(path) {
    var tokens = path.split(exports.sep);
    return tokens.length > 0 && tokens[0] === '' ? tokens.slice(1) : tokens;
}
exports.split = split;
;
function parse(path) {
    var norm = normalize(path);
    var tokens = split(norm);
    return {
        name: tokens[tokens.length - 1],
        base: join.apply(void 0, tokens.slice(0, tokens.length - 1)),
        path: norm,
        tokens: tokens,
    };
}
exports.parse = parse;
//# sourceMappingURL=path.js.map