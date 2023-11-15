import { Inject, Injectable } from '@angular/core';
import { CsFrameworkService } from '@project-sunbird/client-services/services/framework';
import { ChannelService } from '@sunbird/core';
import _ from 'lodash';
import { ConfigService } from '../../../shared/services/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class CslFrameworkService {
  defaultFramework;
  constructor(@Inject('CS_FRAMEWORK_SERVICE') private csFrameworkService: CsFrameworkService, private channelService: ChannelService, private configService: ConfigService
  ) { }

  /**
   * Sets the user-selected framework and fetches it from the channel service if not provided.
   * @param userSelFramework - User-selected framework (optional)
   * @param channelId - Channel ID 
   */
  public setDefaultFWforCsl(userSelFramework?: any, channelId?: any): void {
    if (!userSelFramework && channelId) {
      // If userSelFramework is not provided, fetch it from the channel service
      this.channelService.getFrameWork(channelId).subscribe((channelData: any) => {
        // Retrieve the default framework from channelData
        this.defaultFramework = _.get(channelData, 'result.channel.defaultFramework');
        // Determine the selected framework based on configuration or default value for test
        let selectedFW = this.configService.appConfig.frameworkCatConfig.changeChannel ? this.configService.appConfig.frameworkCatConfig.defaultFW : this.defaultFramework;
        // Set the framework categories based on the selected framework
        this.setFWCatConfigFromCsl(selectedFW);
      });
    } else {
      // If userSelFramework is provided, use it directly and set the framework categories
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
    // Iterate through each user-defined framework category
    userDefinedFwCategory.forEach(field => {
      // Check if user preference contains data for the current category
      if (userPreference.framework[field.code] && userPreference.framework[field.code][0]) {
        // Construct label-value pair based on the user preference data
        let data = {
          labels: field.label,
          values: userPreference.framework[field.code]
        };
        // Push the constructed data into the transformed array
        transformedArray.push(data);
      }
    });

    return transformedArray; // Return the transformed framework label-value pairs
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
      // Check if userSelFramework is provided
      if (userSelFramework) {
        // Fetch framework configuration for the provided user-selected framework
        this.csFrameworkService.getFrameworkConfigMap(userSelFramework, {
          apiPath: '/api/framework/v1/'
        }).subscribe(
          (fwData) => {
            // Log successful retrieval of framework data
            console.log('getFrameworkConfigMap success', fwData);

            // Remove previous framework categories object from local storage
            localStorage.removeItem('fwCategoryObject');

            // Save the new framework categories object to local storage
            localStorage.setItem('fwCategoryObject', JSON.stringify(fwData));

            // Set framework categories object based on the provided user-selected framework
            this.setFwCatObjConfigFromCsl(userSelFramework);

            resolve(); // Resolve the Promise when the operation completes
          },
          (error) => {
            // Log error if fetching framework configuration fails and reject the Promise
            console.error('getFrameworkConfigMap failed', error);
            reject(error);
          }
        );
      } else {
        // Log if userSelFramework is not provided and resolve the Promise
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
    // Retrieve the framework categories from local storage as a string
    const fwCategoryObjectString = localStorage.getItem('fwCategoryObject');

    // Check if the retrieved string is not null or undefined
    if (fwCategoryObjectString) {
      // Parse the string to convert it into an object and return it
      return JSON.parse(fwCategoryObjectString);
    } else {
      // Return null if no framework categories are found in local storage
      return null;
    }
  }

  /**
 * Sets the framework categories object in local storage based on the provided user-selected framework.
 * @param userSelFramework - User-selected framework
 */
  public setFwCatObjConfigFromCsl(userSelFramework: any): void {
    if (userSelFramework) {
      // Fetch framework configuration for the provided user-selected framework
      this.csFrameworkService.getFrameworkConfig(userSelFramework, {
        apiPath: '/api/framework/v1/'
      }).subscribe(
        (fwData) => {
          // Upon successful retrieval, update local storage with framework data
          console.log('getFrameworkConfig success', fwData);
          localStorage.removeItem('fwCategoryObjectValues');
          localStorage.setItem('fwCategoryObjectValues', JSON.stringify(fwData));
        },
        (error) => {
          // Handle error in fetching framework configuration
          console.error('getFrameworkConfig failed', error);
        }
      );
    } else {
      // If userSelFramework is not provided, log the situation
      console.log('userSelFramework not found');
    }
  }

  /**
   * Retrieves and parses the framework categories object from local storage.
   * @returns {Object | null} - Returns the parsed framework categories object if present in local storage,
   *                             otherwise returns null.
   */
  public getFrameworkCategoriesObject(): Object | null {
    // Retrieve the framework categories object from local storage as a string
    const fwCategoryObjectValuesString = localStorage.getItem('fwCategoryObjectValues');

    // Check if the retrieved string is not null or undefined
    if (fwCategoryObjectValuesString) {
      // Parse the string to convert it into an object and return it
      return JSON.parse(fwCategoryObjectValuesString);
    } else {
      // Return null if no framework categories object is found in local storage
      return null;
    }
  }
}
