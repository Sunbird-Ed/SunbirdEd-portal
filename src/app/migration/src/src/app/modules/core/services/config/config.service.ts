import { Injectable } from '@angular/core';
import * as  urlConfig from './url.config.json';
import * as  dropDownConfig from './dropdown.config.json';
import * as  rolesConfig from './roles.config.json';

@Injectable()
export class ConfigService {
  urlConFig = (<any>urlConfig);
  dropDownConfig = (<any>dropDownConfig);
  rolesConfig = (<any>rolesConfig);
  constructor() { }

}
