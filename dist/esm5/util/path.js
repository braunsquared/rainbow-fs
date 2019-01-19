"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sep = '/';
function normalize(path) {
    const norm = path.replace(/\/{2,}/g, '/').replace(/\/$/, '');
    return norm.startsWith('/') ? norm : `/${norm}`;
}
exports.normalize = normalize;
function join(...elements) {
    return normalize(elements.filter(i => !!i).join(exports.sep));
}
exports.join = join;
function split(path) {
    const tokens = path.split(exports.sep);
    return tokens.length > 0 && tokens[0] === '' ? tokens.slice(1) : tokens;
}
exports.split = split;
;
function parse(path) {
    const norm = normalize(path);
    const tokens = split(norm);
    return {
        name: tokens[tokens.length - 1],
        base: join(...tokens.slice(0, tokens.length - 1)),
        path: norm,
        tokens,
    };
}
exports.parse = parse;
//# sourceMappingURL=path.js.map