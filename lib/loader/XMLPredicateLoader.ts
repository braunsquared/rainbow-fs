import parser from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import util from 'util';

import { IStore } from '../Store';
import { Bucket } from '../Bucket';

const readFile = util.promisify<string, Buffer>(fs.readFile);

function __asArray(val: any) {
  return Array.isArray(val) ? val : [val];
}

class XMLPredicateLoader {
  private _variables: Map<string, string>;

  constructor() {
    this._variables = new Map();
  }

  setVariable(key: string, value: string) {
    this._variables.set(key, value);
  }

  replaceVariables(input: string): string {
    return input.replace(/\$\(([^)]*)\)/g, (_, key) => {
      return this._variables.get(key) || ''
    });
  }

  async load(xmlPath: string, store: IStore) {
    const data = await readFile(xmlPath);
    const xmlData = data.toString('utf8');
    const json = parser.parse(xmlData, {
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
      const physicalRoot = this.replaceVariables(config.targetDataStore.attr.physicalRootPath);

      // Add the includes
      const includes = __asArray(config.predicate.include);
      includes.forEach(include => {
        const fsPath = path.join(physicalRoot, include.attr.name);
        const db = include.attr.database;
        const scPath = include.attr.path;
        store.addBucket(new Bucket(fsPath, scPath, db));
      });
    });
  }
}

export { XMLPredicateLoader };