import { ILanguage, IVersion, IField } from '../../model/Sitecore';
import { Version } from "./Version";
import { Field } from './Field';

export class Language implements ILanguage {
  Language: string = "en";
  Fields: Array<IField> = [];
  Versions: Array<IVersion> = [];

  constructor(lang: string) {
    this.Language = lang;
  }

  addVersion(v: IVersion): this {
    this.Versions.push(v);
    return this;
  }

  removeVersion(v: IVersion): this {
    const idx = this.Versions.indexOf(v);
    if (idx >= 0) {
      this.Versions.splice(idx, 1);
    }
    return this;
  }

  latestVersion(): IVersion | undefined {
    let latest : IVersion = this.Versions[0];

    this.Versions.forEach(v => {
      if (!latest || (latest && latest.Version < v.Version)) {
        latest = v;
      }
    });

    return latest;
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
    const field = this.Fields.find(f => f.ID === idOrName || f.Hint === idOrName);
    
    if(field) {
      return field;
    }

    const version = this.latestVersion();
    if (version) {
      return version.field(idOrName);
    }
  }

  toObject(): any {
    const obj: any = {
      Language: this.Language,
    };

    if (this.Fields.length) {
      obj.Fields = this.Fields.map(f => f.toObject());
    }

    if (this.Versions.length) {
      obj.Versions = this.Versions.map(v => v.toObject());
    }

    return obj;
  }

  static fromObject(obj: any): Language {
    const lang = new Language(obj.Language);

    if (obj.Fields) {
      lang.Fields = obj.Fields.map((fObj: any) => Field.fromObject(fObj));
    }

    if (obj.Versions) {
      lang.Versions = obj.Versions.map((vObj: any) => Version.fromObject(vObj));
    }

    return lang;
  }
}