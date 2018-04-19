import { Injectable } from '@angular/core';
import * as  urlConfig from './url.config.json';
import * as  dropDownConfig from './dropdown.config.json';
import * as  rolesConfig from './roles.config.json';
import * as  appConfig from './app.config.json';
import * as editorConfig from './editor.config.json';

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
  /**
   * property containing app config
   *
   */
  appConfig = (<any>appConfig);
  /**
  * property containing editor config
  *
  */
  editorConfig = (<any>editorConfig);
}

