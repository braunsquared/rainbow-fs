import { GUID } from '../model/Sitecore';

export function toGUID(val: string): GUID {
  const match = /^\{?([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\}?$/.exec(val);
  if (match) {
    return match[1].toLowerCase();
  }
}

export function compareGUIDs(a: GUID, b: GUID): boolean {
  if (!a || !b) {
    return false
  } else {
    return a.toLowerCase() === b.toLowerCase();
  }
}