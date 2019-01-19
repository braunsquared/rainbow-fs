import { IVersion, IField } from '../../model/Sitecore';
import { Field } from './Field';
import { IYamlWriter } from '../../io/IYamlWriter';

export class Version implements IVersion {
  Version: number = 1;
  Fields: IField[] = [];

  constructor(version: number) {
    this.Version = version;
  }

  addField(field: IField): this {
    this.Fields.push(field);
    return this;
  }

  removeField(field: IField): this {
    const idx = this.Fields.indexOf(field);
    if (idx >= 0) {
      this.Fields.splice(idx, 1);
    }
    return this;
  }

  field(idOrName: string): IField | undefined {
    return this.Fields.find(f => f.ID === idOrName || f.Hint === idOrName);
  }

  toObject(): any {
    const obj: any = {
      Version: this.Version,
    };

    if (this.Fields.length) {
      obj.Fields = this.Fields.map(f => f.toObject());
    }

    return obj;
  }

  write(writer: IYamlWriter) {
    writer.writeBeginListItem('Version', `${this.Version}`);

    if (this.Fields.length) {
      writer.writeMap('Fields');
      writer.increaseIndent();
      this.Fields.forEach(f => f.write(writer));
      writer.decreaseIndent();
    }
  }

  static fromObject(obj: any): Version {
    const version = new Version(obj.Version);

    if (obj.Fields) {
      version.Fields = obj.Fields.map((fieldObj: any) => Field.fromObject(fieldObj));
    }

    return version;
  }
}
