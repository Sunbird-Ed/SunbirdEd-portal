import { Injectable } from '@angular/core';
import * as contentSchema from './schemas/contentSchema.json';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  /**
   * @description property containing content schema
   * @memberof SchemaService
   */
  readonly contentSchema = (<any>contentSchema.default);
}