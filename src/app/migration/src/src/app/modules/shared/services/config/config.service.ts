import { Injectable } from '@angular/core';
import * as  urlConfig from './url.config.json';
import * as  dropDownConfig from './dropdown.config.json';
import * as  rolesConfig from './roles.config.json';

/**
 * Service to fetch config details.
 *
 */
@Injectable()
export class ConfigService {
/**
 * property containing url config
 *
 */
  urlConFig = (<any>urlConfig);
/**
 * property containing drop down config
 *
 */
  dropDownConfig = (<any>dropDownConfig);
/**
 * property containing roles config
 *
 */
  rolesConfig = (<any>rolesConfig);
}

