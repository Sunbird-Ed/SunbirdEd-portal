/**
 * @file
 * Generic transform pipe for transposing frameworkCategory values
 * @since release-4.10.2
 * @version 1.0
 */

import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash-es';
import { GenericResourceService } from '@sunbird/shared';

@Pipe({
  name: 'transposeTerms'
})

export class TransposeTermsPipe implements PipeTransform {
  constructor(private genericResourceService: GenericResourceService) { }
  /**
   * @since release-4.10.2
   * @param  {any} value               - Value to be transformed
   * @param  {String} defaultValue?    - Default value to be returned if term is not found
   * @param  {String} startsWith?      - Starts with character to be replaced
   * @param  {String} endsWith?        - Ends with character to be replaced
   * @returns 
   * - Transformed value
   * - If translation is not found, `defaultLanguage` from config is considered
   * - If key is not found in config, `defaultValue` is returned
   * - If `startsWith` and `endsWith` are not provided, `value` is returned as is
   * @description Function to replace term with its translation
   */
  transform(value: any, defaultValue, selectedLang?, startsWith = '{', endsWith = '}'): any {
    if (value) {
      if (value.indexOf(startsWith) > -1) {
        // let term = value.substring(value.indexOf(startsWith) + 1, value.lastIndexOf(endsWith));
        let term = value.match(/frameworkCategory([0-9])/g);
        if (term && term.length > 0) {
          // return this.getTermsMapping(value, term, localStorage.getItem('portalLanguage'), startsWith, endsWith, defaultValue);
          let resultStr = value;
          term.forEach(termString => {
            resultStr = this.getTermsMapping(resultStr, termString, localStorage.getItem('portalLanguage'), startsWith, endsWith, defaultValue);
          });
          return resultStr;
        } else {
          return value;
        }
      } else {
        return value;
      }
    }
    return defaultValue ?? '';
  }

  getTermsMapping(value, term, lang, startsWith, endsWith, defaultValue) {
    let _termsMapping = get(this.genericResourceService, 'terms');
    if (get(_termsMapping, lang + '.' + term)) {
      let _term = get(_termsMapping, lang + '.' + term);
      return value.replace(startsWith + term + endsWith, _term);
    } else if (get(_termsMapping, 'defaultLanguage') && get(_termsMapping, get(_termsMapping, 'defaultLanguage') + '.' + term)) {
      let defaultLanguage = get(_termsMapping, 'defaultLanguage');
      let _term = get(_termsMapping, defaultLanguage + '.' + term);
      return value.replace(startsWith + term + endsWith, _term);
    } else {
      return defaultValue ?? '';
    }
  }
}
