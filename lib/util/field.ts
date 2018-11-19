import { GUID, IField } from '../model/Sitecore';
import { toGUID } from './guid';

export function treelistValue(field: IField | undefined, defaultValue: GUID[] = []): GUID[] {
  if (!field || !field.Value) {
    return defaultValue;
  }

  return field.Value.split(/\n|\r\n/).map(id => toGUID(id)).filter(i => i);
}

export function booleanValue(field: IField | undefined, defaultValue: boolean = false): boolean {
  if (!field || !field.Value) {
    return defaultValue;
  }

  return field.Value === '1';
}