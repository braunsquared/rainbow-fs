import { GUID } from '../model/Sitecore';

export interface IDeviceDefinition {
  ID: GUID;
  Layout: string;
  Placeholders: IPlaceholderDefinition[];
  Renderings: IRenderingDefinition[];
}

export interface ILayoutDefinition {
  Devices: IDeviceDefinition[];
}

export interface IRenderingDefinition {
  UID: GUID;
  ItemID: GUID;
  Cachable: string;
  Conditions: string;
  Datasource: string;
  MultiVariateTest: string;
  PersonalizationTest: string;
  Parameters: string;
  Placeholder: string;
  VaryByData: string;
  VaryByDevice: string;
  VaryByLogin: string;
  VaryByParameters: string;
  VaryByQueryString: string;
  VaryByUser: string;
  ClearOnIndexUpdate: string;
}

export interface IPlaceholderDefinition {
  UID: GUID;
  Key: string;
  MetaDataItemID: GUID;
}

export class LayoutDesigner {

}
