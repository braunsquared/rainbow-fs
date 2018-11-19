import { IField } from '../../model/Sitecore';

export class Field implements IField {
  ID: string = "";
  Hint: string;
  Type?: string;
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

    if(this.Type) {
      obj.Type = this.Type;
    }

    return obj;
  }

  static fromObject(obj: any): IField {
    const field = new Field(obj.ID, obj.Hint, obj.Value);
    field.Type = obj.Type;
    return field;
  }
}