import { Inject, Injectable } from '@angular/core';
import { CsFrameworkService } from '@project-sunbird/client-services/services/framework';
import { ChannelService } from '@sunbird/core';
import _ from 'lodash';
import { ConfigService } from '../../../shared/services/config/config.service';
import { FormService } from '../../../core/services/form/form.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// Interface for framework category data
interface FrameworkCategory {
  code: string;
  label: string;
  placeHolder: string;
}

// Interface for framework categories object
interface FrameworkCategories {
  fwCategory1?: {
    code: string;
  };
  // Add more properties if needed
}

// Interface for transformed data object
interface TransformedData {
  category: string;
  type: string;
  labelText: string;
  defaultLabelText: string;
  placeholderText: string;
  defaultPlaceholderText: string;
  dataSource: string;
  multiple: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CslFrameworkService {
  defaultFramework;
  selectedFramework;
  rootOrgId;
  searchFilterConfig;
  constructor(@Inject('CS_FRAMEWORK_SERVICE') private csFrameworkService: CsFrameworkService, private channelService: ChannelService, private configService: ConfigService, public formService: FormService
  ) {
    this.selectedFramework = localStorage.getItem('selectedFramework');
    this.rootOrgId = localStorage.getItem('orgHashTagId');

  }

  /**
   * Sets the user-selected framework and fetches it from the channel service if not provided.
   * @param userSelFramework - User-selected framework (optional)
   * @param channelId - Channel ID 
   */
  public setDefaultFWforCsl(userSelFramework?: any, channelId?: any): void {
    if (!userSelFramework && channelId) {
      this.channelService.getFrameWork(channelId).subscribe((channelData: any) => {
        this.defaultFramework = _.get(channelData, 'result.channel.defaultFramework');
        let selectedFW = this.configService.appConfig.frameworkCatConfig.changeChannel ? this.configService.appConfig.frameworkCatConfig.defaultFW : this.defaultFramework;
        this.setFWCatConfigFromCsl(selectedFW);
      });
    } else {
      this.setFWCatConfigFromCsl(userSelFramework);
    }
  }

  /**
   * Fetches framework categories and its object based on the selected framework.
   * @param selectedFramework - Selected framework
   */

  fetchFWCatObjFromCsl(selectedFramework: any): void {
    // Set framework categories based on the selected framework
    this.setFwCatObjConfigFromCsl(selectedFramework);

    // Set framework categories object in local storage based on the selected framework
    this.setFwCatObjConfigFromCsl(selectedFramework);
  }

  /**
   * Transforms user-defined framework category data based on user preferences.
   * @param userDefinedFwCategory - Array of user-defined framework categories
   * @param userPreference - User preferences object containing framework data
   * @returns Array of transformed framework label-value pairs
   */
  frameworkLabelTransform(userDefinedFwCategory: any[], userPreference: any): any[] {
    let transformedArray: any[] = [];
    userDefinedFwCategory.forEach(field => {
      if (userPreference.framework[field.code] && userPreference.framework[field.code][0]) {
        let data = {
          labels: field.label,
          values: userPreference.framework[field.code]
        };
        transformedArray.push(data);
      }
    });

    return transformedArray;
  }

  /**
 * Sets framework categories based on the provided user-selected framework,
 * updates local storage, and resolves/rejects a Promise accordingly.
 * @param userSelFramework - User-selected framework for configuration
 * @returns Promise<void> - Resolves when the operation completes successfully,
 *                          rejects if an error occurs during the operation
 */
  public setFWCatConfigFromCsl(userSelFramework: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (userSelFramework) {
        this.csFrameworkService.getFrameworkConfigMap(userSelFramework, {
          apiPath: '/api/framework/v1/'
        }).subscribe(
          (fwData) => {
            console.log('getFrameworkConfigMap success', fwData);
            localStorage.removeItem('fwCategoryObject');
            localStorage.setItem('fwCategoryObject', JSON.stringify(fwData));
            localStorage.setItem('selectedFramework', userSelFramework);
            this.setFwCatObjConfigFromCsl(userSelFramework);

            resolve();
          },
          (error) => {
            console.error('getFrameworkConfigMap failed', error);
            localStorage.setItem('selectedFramework', userSelFramework);
            reject(error);
          }
        );
      } else {
        console.log('userSelFramework not found');
        resolve();
      }
    });
  }

  /**
   * Retrieves and parses the framework categories from local storage.
   * @returns {Object | null} - Returns the parsed framework categories object if present in local storage,
   *                             otherwise returns null.
   */
  public getFrameworkCategories(): Object | null {
    const fwCategoryObjectString = localStorage.getItem('fwCategoryObject');
    if (fwCategoryObjectString) {
      return JSON.parse(fwCategoryObjectString);
    } else {
      return null;
    }
  }

  /**
 * Sets the framework categories object in local storage based on the provided user-selected framework.
 * @param userSelFramework - User-selected framework
 */
  public setFwCatObjConfigFromCsl(userSelFramework: any): void {
    if (userSelFramework) {
      this.csFrameworkService.getFrameworkConfig(userSelFramework, {
        apiPath: '/api/framework/v1/'
      }).subscribe(
        (fwData) => {
          console.log('getFrameworkConfig success', fwData);
          localStorage.removeItem('fwCategoryObjectValues');
          localStorage.setItem('fwCategoryObjectValues', JSON.stringify(fwData));
        },
        (error) => {
          console.error('getFrameworkConfig failed', error);
        }
      );
    } else {
      console.log('userSelFramework not found');
    }
  }

  /**
   * Retrieves and parses the framework categories object from local storage.
   * @returns {Object | null} - Returns the parsed framework categories object if present in local storage,
   *                             otherwise returns null.
   */
  public getFrameworkCategoriesObject(): Object | null {
    const fwCategoryObjectValuesString = localStorage.getItem('fwCategoryObjectValues');
    if (fwCategoryObjectValuesString) {
      return JSON.parse(fwCategoryObjectValuesString);
    } else {
      return null;
    }
  }
  /**
 * Transforms framework categories object into page filter data.
 * @param frameworkCategoriesObject - Object containing framework categories data.
 * @param frameworkCategories - Additional framework categories data.
 * @returns Transformed page filter data array.
 */
  public transformPageLevelFilter(
    frameworkCategoriesObject: FrameworkCategory[],
    frameworkCategories: FrameworkCategories
  ): TransformedData[] {
    const pageFilterData: TransformedData[] = frameworkCategoriesObject.map(filterData => {
      const transformData: TransformedData = {
        category: filterData.code,
        type: "dropdown",
        labelText: filterData.label,
        defaultLabelText: filterData.label,
        placeholderText: filterData.placeHolder,
        defaultPlaceholderText: filterData.placeHolder,
        dataSource: "framework",
        multiple: frameworkCategories?.fwCategory1?.code === filterData.code ? false : true,
      };

      return transformData;
    });

    return pageFilterData;
  }

  /**
   * @description Fetches form details relevant to global search filters.
   *              It utilizes framework category object string to initiate the form service request.
   * @returns {Observable} - Returns an Observable containing form details for global search filters.
   *                         In case of an error, returns a  framework default data (fwCategoryObjectString).
   */
  private getFormDetails() {
    const fwCategoryObjectString = this.getFrameworkCategoriesObject();
    const formServiceInputParams = {
      formType: 'searchfilterconfig1',
      formAction: 'globalsearch',
      contentType: 'global',
      framework: this.selectedFramework,
      component: 'portal'
    };

    return this.formService.getFormConfig(formServiceInputParams, this.rootOrgId).pipe(
      catchError(error => {
        console.error('Error fetching form config:', error);
        return of(fwCategoryObjectString); // Return default data in case of error
      })
    );
  }

  /**
 * @description Constructs and sets the transformed global filter configuration based on form details retrieved.
 *               This method constructs an object structure from the response data obtained from getFormDetails().
 *               It maps over the array of objects and creates a transformed structure to store in localStorage.
 *               Additionally, it manages the storage of the transformed data and original response data.
 */
  setTransFormGlobalFilterConfig() {
    this.getFormDetails().subscribe(responeData => {
      let transformedObject: any = {};
      responeData.map((filter, index) => {
        transformedObject[`fwCategory${index + 1}`] = {
          index: filter?.index,
          code: filter?.code,
          alternativeCode: filter.alternativeCode ? filter.alternativeCode : null,
          label: filter?.label,
          translation: filter?.translation,
        };
      });
      localStorage.removeItem('globalFilterConfig');
      localStorage.removeItem('globalFilterObjectValues');
      localStorage.setItem('globalFilterObjectValues', JSON.stringify(responeData))
      localStorage.setItem('globalFilterObject', JSON.stringify(transformedObject))


    })
  }
  /**
 * @description Retrieves the global filter categories object (non-values) from local storage.
 * @returns {Object|null} - Returns the global filter categories object if found in local storage, otherwise returns null.
 */
  getGlobalFilterCategories() {
    const filterCategoryObject = localStorage.getItem('globalFilterObject');
    if (filterCategoryObject) {
      return JSON.parse(filterCategoryObject);
    } else {
      return null;
    }
  }
  /**
 * @description Retrieves the global filter categories object from local storage.
 * @returns {Object|null} - Returns the global filter categories object if found in local storage, otherwise returns null.
 */
  getGlobalFilterCategoriesObject() {
    const filterCategoryObjectVal = localStorage.getItem('globalFilterObjectValues');
    if (filterCategoryObjectVal) {
      return JSON.parse(filterCategoryObjectVal);
    } else {
      return null;
    }
  }
}
