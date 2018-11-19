import path from 'path';
import fs from 'fs';
import { BucketEntry } from '../lib/BucketTree';

export function treeToString(lines: Array<string>, branch: BucketEntry, spaces: number = 0): Array<string> {
  lines.push(Array(spaces + 1).join(' ') + branch.path);
  branch.children.forEach(child => treeToString(lines, child, spaces + 2));
  return lines;
}

let _sampleData: any;

export function loadMockFs() {
  if(_sampleData) return _sampleData;

  function loadDir(p: string) {
    const obj = {};

    const files = fs.readdirSync(p);
    files.forEach(d => {
      const fp = path.join(p, d);
      const stats = fs.statSync(fp);
      if(stats.isDirectory()) {
        obj[d] = loadDir(fp);
      } else {
        obj[d] = fs.readFileSync(fp);
      }
    });

    return obj;
  }

  const callsites = path.resolve(__dirname, '../node_modules/callsites'); // this has something to do with jest
  const sampleData = _sampleData = {
    '/xml': loadDir(path.resolve(__dirname, './xml')),
    '/data': loadDir(path.resolve(__dirname, './data')),
    [callsites]: loadDir(callsites),
  };

  return sampleData;
}