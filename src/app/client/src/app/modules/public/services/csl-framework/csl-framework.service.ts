import { Inject, Injectable } from '@angular/core';
import { CsFrameworkService } from '@project-sunbird/client-services/services/framework';
import { ChannelService } from '@sunbird/core';
import _ from 'lodash';
import { ConfigService } from '../../../shared/services/config/config.service';
import { FormService } from '../../../core/services/form/form.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
interface FrameworkCategory {
  code: string;
  label: string;
  placeHolder: string;
}
interface FrameworkCategories {
  fwCategory1?: {
    code: string;
  };
}
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
  public globalFilterCategories;
  public frameworkCategoriesList;
  public defaultFwCategories;
  constructor(@Inject('CS_FRAMEWORK_SERVICE') private csFrameworkService: CsFrameworkService, private channelService: ChannelService, private configService: ConfigService, public formService: FormService
  ) {
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
        let selectedFW = this.defaultFramework;
        localStorage.setItem('selectedFramework', selectedFW);
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
 * @description Transforms content data based on framework (FW) category data.
 * Iterates through the FW category data and content data to create a new array.
 * Filters and constructs a transformed array based on the provided FW category data and content data.
 * @param {any[]} fwCatData Array containing framework (FW) category data.
 * @param {any} contentData Object containing content data.
 * @returns {any[]} Transformed array based on FW category and content data.
 */
  transformContentDataFwBased(fwCatData: any[], contentData: any): any[] {
    const result: any[] = [];
    fwCatData.forEach(fwData => {
      let fwCode = fwData?.alternativeCode ? fwData?.alternativeCode : fwData?.code
      let typeCheck = fwData?.type === 'filter' ? false : true
      if (fwCode && typeCheck && contentData[fwCode]) {
        const keyValueObj = {
          labels: fwData?.label,
          value: contentData[fwCode],
          index: fwData?.index
        };
        result.push(keyValueObj);
      }
    });
    return result;
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
          apiPath: '/api/framework/v1'
        }).subscribe(
          (fwData) => {
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
        apiPath: '/api/framework/v1'
      }).subscribe(
        (fwData) => {
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
    const pageFilterData: TransformedData[] = frameworkCategoriesObject?.map(filterData => {
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
  private getFormDetails(rooOrgID) {
    this.defaultFwCategories = this.getFrameworkCategoriesObject();
    let slectedFw = localStorage.getItem('selectedFramework');
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global',
    };
    return this.formService.getFormConfig(formServiceInputParams).pipe(
      catchError(error => {
        console.error('Error fetching form config:', error);
        return of(this.defaultFwCategories); // Return default data in case of error
      })
    );
  }

  /**
 * @description Constructs and sets the transformed global filter configuration based on form details retrieved.
 *               This method constructs an object structure from the response data obtained from getFormDetails().
 *               It maps over the array of objects and creates a transformed structure to store in localStorage.
 *               Additionally, it manages the storage of the transformed data and original response data.
 */
  setTransFormGlobalFilterConfig(rooOrgID?) {
    let filterResponseData;
    this.rootOrgId = rooOrgID;
    this.getFormDetails(rooOrgID).subscribe(responseData => {
      const allTabData = _.find(responseData, (o) => o.title === 'frmelmnts.tab.all');
      if (allTabData) {
        filterResponseData = _.get(allTabData, 'metaData.globalFilterConfig') ? _.get(allTabData, 'metaData.globalFilterConfig') : this.defaultFwCategories
      }
      else {
        filterResponseData = this.defaultFwCategories;
      }
      let transformedObject: any = {};
      if (filterResponseData) {
        filterResponseData.map((filter, index) => {
          transformedObject[`fwCategory${index + 1}`] = {
            index: filter?.index,
            code: filter?.code,
            alternativeCode: filter?.alternativeCode ? filter?.alternativeCode : filter?.code,
            label: filter?.label,
            type: filter?.type

          };
        });
      }
      localStorage.removeItem('globalFilterObject');
      localStorage.removeItem('globalFilterObjectValues');
      localStorage.setItem('globalFilterObjectValues', JSON.stringify(filterResponseData))
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

  /**
   * @description Retrieves alternative codes for specific filter categories.
   * Populates globalFilterCategories based on retrieved filter categories.
   * - alternativeCode is a property that holds the alternative code for each filter category.
   * @returns {string[]} An array containing alternative codes for specified filter categories.
   */
  getAlternativeCodeForFilter() {
    this.globalFilterCategories = this.getGlobalFilterCategories();
    const filterCatNames: string[] = [];
    for (const key in this.globalFilterCategories) {
      if (Object.prototype.hasOwnProperty.call(this.globalFilterCategories, key)) {
        this.globalFilterCategories = this.getGlobalFilterCategories();
        if (this.globalFilterCategories[key].type === 'framework')
          filterCatNames.push(this.globalFilterCategories[key].alternativeCode);
      }
    }

    return filterCatNames;
  }

  /**
   * @description Retrieves names of first 4 framework categories.
   * Populates frameworkCategoriesList based on retrieved framework categories.
   * - code is a property that holds the name for each framework category.
   * @returns {string[]} An array containing names of first 4 framework categories.
   */
  getAllFwCatName() {
    this.frameworkCategoriesList = this.getFrameworkCategories();
    const fwCatNames: string[] = [];
    for (const key in this.frameworkCategoriesList) {
      if (Object.prototype.hasOwnProperty.call(this.frameworkCategoriesList, key)) {
        fwCatNames.push(this.frameworkCategoriesList[key].code);
      }
    }

    return fwCatNames;
  }


  /**
 * @description Transforms data for Common Consumption (CC) by filtering and mapping global filter categories.
 * Retrieves global filter categories object using getGlobalFilterCategoriesObject().
 * Constructs a transformed array for Common Consumption object based on the retrieved data.
 * @returns {any[]} Transformed array for Common Consumption object (CC).
 */
  transformDataForCC() {
    let transformData = this.getGlobalFilterCategoriesObject();
    let resCCdata: any[] = [{
      "code": "organisation",
      "name": "Publisher"
    }];
    transformData?.forEach((filter) => {
      let typeCheck = filter?.type === 'filter' ? true : false;
      if (!typeCheck) {
        let resObj = {
          index: filter?.index,
          code: filter?.code,
          alternativeCode: filter?.alternativeCode || filter?.code,
          label: filter?.label,
        };
        resCCdata.push(resObj);
      }
    });
    return resCCdata;
  }
  /**
 * @description Transforms the keys of obj1 based on exclusion criteria from obj2.
 * @param {Object} obj1 - The source object to filter keys from.
 * @param {Array<Object>} obj2 - The array of objects containing keys to be excluded.
 * @returns {Object} - The filtered object with keys from obj1, excluding those present in obj2.
 */
  transformSelectedData(obj1, obj2) {
    const excludedKeys = obj2.map(item => item.code);
    const filteredObject = {};
    for (const key in obj1) {
      if (excludedKeys.includes(key)) {
        filteredObject[key] = obj1[key];
      }
    }
    return filteredObject;
  }
}