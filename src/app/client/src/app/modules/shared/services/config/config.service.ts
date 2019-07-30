import { Injectable } from '@angular/core';
import * as urlConfig from './url.config.json';
import * as dropDownConfig from './dropdown.config.json';
import * as rolesConfig from './roles.config.json';
import * as appConfig from './app.config.json';
import * as editorConfig from './editor.config.json';
import * as offlineConfig from './offline.config.json';
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
  urlConFig = (<any>urlConfig.default);
  /**
   * property containing drop down config
   *
   */
  dropDownConfig = (<any>dropDownConfig.default);
  /**
   * property containing roles config
   *
   */
  rolesConfig = (<any>rolesConfig.default);
  /**
   * property containing app config
   *
   */
  appConfig = (<any>appConfig.default);
  /**
  * property containing editor config
  *
  */
  editorConfig = (<any>editorConfig.default);
  /**
  * property containing offline application config
  *
  */
  offlineConfig = (<any>offlineConfig.default);
}

