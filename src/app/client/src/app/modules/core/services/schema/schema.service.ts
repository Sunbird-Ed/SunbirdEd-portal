import { Injectable } from '@angular/core';
import { FormService } from '../form/form.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { reduce } from 'lodash-es';

interface ISchema {
  id: string;
  schema: {
    properties: string[];
    [name: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  private _schemas = {};

  constructor(private formService: FormService) { }

  public getSchema(type): ISchema {
    return this._schemas[type];
  }

  public fetchSchemas(config = { formType: 'schemas', formAction: 'get', contentType: 'search' }): Observable<ISchema[]> {
    return this.formService.getFormConfig(config)
      .pipe(
        tap((fields: ISchema[]) => {
          this._schemas = fields.reduce((acc, { id, schema }) => {
            acc[id] = schema;
            return acc;
          }, {});
        })
      );
  }

  private checkForScriptInjection(value: string | any[]) {
    const applyXssProtection = (input: string) => input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (typeof value === 'string') { return applyXssProtection(value); }
    return value.map(val => applyXssProtection(val));
  }

  public schemaValidator({ inputObj = {}, properties = [], omitKeys = [] }) {
    return reduce(inputObj, (accumulator, value, key) => {
      if ((properties.includes && properties.includes(key)) && !(omitKeys.length && omitKeys.includes(key))) {
        accumulator[key] = this.checkForScriptInjection(value);
      }
      return accumulator;
    }, {});
  }
}
