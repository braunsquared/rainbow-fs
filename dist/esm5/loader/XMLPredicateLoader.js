"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fast_xml_parser_1 = tslib_1.__importDefault(require("fast-xml-parser"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const util_1 = tslib_1.__importDefault(require("util"));
const Bucket_1 = require("../Bucket");
const readFile = util_1.default.promisify(fs_1.default.readFile);
function __asArray(val) {
    return Array.isArray(val) ? val : [val];
}
class XMLPredicateLoader {
    constructor() {
        this._variables = new Map();
    }
    setVariable(key, value) {
        this._variables.set(key, value);
    }
    replaceVariables(input) {
        return input.replace(/\$\(([^)]*)\)/g, (_, key) => {
            return this._variables.get(key) || '';
        });
    }
    normalizePathSeparator(input) {
        return input.replace(/[\\\/]/g, path_1.default.sep);
    }
    load(xmlPath, store) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield readFile(xmlPath);
            const xmlData = data.toString('utf8');
            const json = fast_xml_parser_1.default.parse(xmlData, {
                attributeNamePrefix: '',
                ignoreAttributes: false,
                attrNodeName: 'attr',
                allowBooleanAttributes: true,
                parseAttributeValue: true,
            });
            // Find the unicorn config
            const unicorn = json.configuration.sitecore.unicorn;
            // Iterate over the configurations
            const configs = __asArray(unicorn.configurations.configuration);
            configs.forEach(config => {
                // Determine the fspath
                const physicalRoot = this.normalizePathSeparator(this.replaceVariables(config.targetDataStore.attr.physicalRootPath));
                // Add the includes
                const includes = __asArray(config.predicate.include);
                includes.forEach(include => {
                    const fsPath = path_1.default.join(physicalRoot, include.attr.name);
                    const db = include.attr.database;
                    const scPath = include.attr.path;
                    store.addBucket(new Bucket_1.Bucket(fsPath, scPath, db));
                });
            });
        });
    }
}
exports.XMLPredicateLoader = XMLPredicateLoader;
//# sourceMappingURL=XMLPredicateLoader.js.map