import { IField } from '../../model/Sitecore';
import { IYamlWriter } from '../../io/IYamlWriter';

export class Field implements IField {
  ID: string = "";
  Hint: string;
  Type?: string;
  BlobID?: string;
  Value: any;

  constructor(id: string, hint: string, value: any) {
    this.ID = id;
    this.Hint = hint;
    this.Value = value;
  }

  toObject(): any {
    const obj: any = {
      ID: this.ID,
      Hint: this.Hint,
      Value: this.Value,
    };

    if (this.Type) {
      obj.Type = this.Type;
    }

    if (this.BlobID) {
      obj.BlobID = this.BlobID;
    }

    return obj;
  }

  write(writer: IYamlWriter) {
    writer.writeBeginListItem('ID', this.ID);
    writer.writeMap('Hint', this.Hint);

    if (this.BlobID) {
      writer.writeMap('BlobID', this.BlobID);
    }

    if (this.Type) {
      writer.writeMap('Type', this.Type);
    }

    writer.writeMap('Value', this.Value);
  }

  static fromObject(obj: any): IField {
    const field = new Field(obj.ID, obj.Hint, obj.Value);
    field.Type = obj.Type;
    field.BlobID = obj.BlobID;
    return field;
  }
}