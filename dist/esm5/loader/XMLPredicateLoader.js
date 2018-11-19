"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fast_xml_parser_1 = tslib_1.__importDefault(require("fast-xml-parser"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var util_1 = tslib_1.__importDefault(require("util"));
var Bucket_1 = require("../Bucket");
var readFile = util_1.default.promisify(fs_1.default.readFile);
function __asArray(val) {
    return Array.isArray(val) ? val : [val];
}
var XMLPredicateLoader = /** @class */ (function () {
    function XMLPredicateLoader() {
        this._variables = new Map();
    }
    XMLPredicateLoader.prototype.setVariable = function (key, value) {
        this._variables.set(key, value);
    };
    XMLPredicateLoader.prototype.replaceVariables = function (input) {
        var _this = this;
        return input.replace(/\$\(([^)]*)\)/g, function (_, key) {
            return _this._variables.get(key) || '';
        });
    };
    XMLPredicateLoader.prototype.load = function (xmlPath, store) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, xmlData, json, unicorn, configs;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile(xmlPath)];
                    case 1:
                        data = _a.sent();
                        xmlData = data.toString('utf8');
                        json = fast_xml_parser_1.default.parse(xmlData, {
                            attributeNamePrefix: '',
                            ignoreAttributes: false,
                            attrNodeName: 'attr',
                            allowBooleanAttributes: true,
                            parseAttributeValue: true,
                        });
                        unicorn = json.configuration.sitecore.unicorn;
                        configs = __asArray(unicorn.configurations.configuration);
                        configs.forEach(function (config) {
                            // Determine the fspath
                            var physicalRoot = _this.replaceVariables(config.targetDataStore.attr.physicalRootPath);
                            // Add the includes
                            var includes = __asArray(config.predicate.include);
                            includes.forEach(function (include) {
                                var fsPath = path_1.default.join(physicalRoot, include.attr.name);
                                var db = include.attr.database;
                                var scPath = include.attr.path;
                                store.addBucket(new Bucket_1.Bucket(fsPath, scPath, db));
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return XMLPredicateLoader;
}());
exports.XMLPredicateLoader = XMLPredicateLoader;
//# sourceMappingURL=XMLPredicateLoader.js.map