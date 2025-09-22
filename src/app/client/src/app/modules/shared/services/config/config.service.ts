import { Injectable } from '@angular/core';
import * as urlConfig from './url.config.json';
import * as dropDownConfig from './dropdown.config.json';
import * as rolesConfig from './roles.config.json';
import * as appConfig from './app.config.json';
import * as editorConfig from './editor.config.json';
import * as constants from './constants.json';
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
  urlConFig = (<any>urlConfig['default']);
  /**
   * property containing roles config
   *
   */
  rolesConfig = (<any>rolesConfig['default']);
  /**
   * property containing app config
   *
   */
  appConfig = (<any>appConfig['default']);
  /**
  * property containing editor config
  *
  */
  editorConfig = (<any>editorConfig['default']);

  /**
   * Constants to configure the app
   */
  constants = (<any>constants['default']);
  /**
  * property containing offline application config
  *
  */
  offlineConfig = (<any>offlineConfig['default']);

  /**
   * property containing drop down config
   *
   */
  // Modified copy of dropdown config
  dropDownConfig: any;

  constructor() {
    // Clone the imported dropdown config
    const rawDropDownConfig = (<any>dropDownConfig['default']);
    this.dropDownConfig = JSON.parse(JSON.stringify(rawDropDownConfig));

    const fwObj = localStorage.getItem('fwCategoryObject');
    if (fwObj) {
      const frameworkCategories = JSON.parse(fwObj);

      const dynamicLabels = Object.values(frameworkCategories).map((category: any) => {
        return {
          id: category.code,
          name: category.label
        };
      });

      // Append to dropDownConfig.FILTER.WORKSPACE.label
      if (!Array.isArray(this.dropDownConfig.FILTER.WORKSPACE.label)) {
        this.dropDownConfig.FILTER.WORKSPACE.label = [];
      }

      this.dropDownConfig.FILTER.WORKSPACE.label.push(...dynamicLabels);
    }

  }
}

