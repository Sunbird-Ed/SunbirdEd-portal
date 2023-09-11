import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ResourceService, ConfigService, ToasterService, IUserData, IUserProfile } from '@sunbird/shared';
import { FormService, FrameworkService, UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { Router } from '@angular/router';
import { EditorService } from './../../services';

@Component({
  selector: 'app-content-creation-default-template',
  templateUrl: './content-creation-default-template.component.html',
  /**
    * It is recommended to use ng-deep for dynamically added classes update
    * ng-deep as angular upgrades the property
    */
   styles: [`
   ::ng-deep @media only screen and (min-width: 992px) {
       .modals.dimmer .ui.tree-picker.content-creation-concept-picker.scrolling.modal {
         top: 60px !important;
         position: relative !important;
         margin: 0 0 0 -373px !important;
       }
      }
    `]
})
export class DefaultTemplateComponent implements OnInit {
  @Input() formFieldProperties: any;
  @Input() categoryMasterList: any;

  /**
    * This variable hepls to show and hide page loader.
    * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;

  /**
* To show toaster(error, success etc) after any API calls
*/
  private toasterService: ToasterService;
  /**
* urlString for get url details
*/
  private urlString;
  /**
* contentType is creation type, fected from url
*/
  private contentType;
  /**
 * userForm name creation
 */
  public creationForm: UntypedFormGroup;
  /**
* To call resource service which helps to use language constant
*/
  public resourceService: ResourceService;
  /**
* To call resource service which helps to use language constant
*/
  public userService: UserService;
  /**
* userProfile is of type userprofile interface
*/
  public userProfile: IUserProfile;
  /**
* Contains config service reference
*/
  public configService: ConfigService;
  /**
   * frameworkService is get framework data
   */
  public frameworkService: FrameworkService;
  /**
   * formService is to get form meta data
   */
  public formService: FormService;
  /**
   * formInputData is to take input data's from form
   */
  public formInputData = {};
  /**
   * categoryList is category list of dropdown values
   */
  public categoryList: {};
  /**
   * masterList is master copy of framework data
   */
  public masterList: {};
  /**
   * years is used to get years from getYearsForCreateTextBook
   */
  public years: any;
  /**
 * To make content editor service API calls
 */
  private editorService: EditorService;




  constructor(
    formService: FormService,
    private _cacheService: CacheService,
    private router: Router,
    resourceService: ResourceService,
    frameworkService: FrameworkService,
    toasterService: ToasterService,
    userService: UserService,
    configService: ConfigService,
    editorService: EditorService
  ) {
    this.formService = formService;
    this.resourceService = resourceService;
    this.frameworkService = frameworkService;
    this.toasterService = toasterService;
    this.categoryList = {};
    this.userService = userService;
    this.configService = configService;
    this.editorService = editorService;
  }

  setFormConfig() {
    const DROPDOWN_INPUT_TYPES = ['select', 'multiSelect'];
    _.forEach(this.formFieldProperties, (field) => {
      if (_.includes(DROPDOWN_INPUT_TYPES, field.inputType)) {
        if (field.depends && field.depends.length) {
          this.getAssociations(this.categoryMasterList[field.code],
            field.range, (associations) => {
              this.applyDependencyRules(field, associations, false);
            });
        }
      }
    });
  }

  mapParents(data, callback) {
    // create parent to all the fields
    _.forEach(data, (val, index) => {
      data[index].parent = [];
    });

    // set parents
    _.forEach(data, (field, index) => {
      if (field.depends) {
        _.forEach(field.depends, (depend) => {
          _.forEach(data, (category, counter) => {
            if (depend === category.code) {
              data[counter].parent.push(field.code);
            }
          });

        });
      }
    });
    return callback(data);
  }

  ngOnInit() {
    /***
     * Call User service to get user data
     */
    this.mapParents(this.formFieldProperties, (data) => {
      this.formFieldProperties = data;
      this.setFormConfig();
      this.userService.userData$.subscribe(
        (user: IUserData) => {
          if (user && !user.err) {
            this.userProfile = user.userProfile;
          }
        });
      this.showLoader = false;
      this.years = this.getYearsForCreateTextBook();
      this.mapMasterCategoryList('');
    });
  }

  /**
* to get selected concepts from concept picker.
*/
  // concepts(events) {
  //   this.formInputData['concepts'] = events;
  // }

  /**
  * @description            - Which is used to update the form when vlaues is get changes
  * @param {Object} object  - Field information
  */
  updateForm(object) {
    if (object.field.range) {
      this.getAssociations(object.value, object.field.range, (associations) => {
        this.getParentAssociations(object.field, associations, object.formData, (commonAssociations) => {
          this.applyDependencyRules(object.field, commonAssociations, true);
        });
      });
    }
  }


  getCommonAssociations(parentAssociations, childAssociations) {
    let intersectionData = [];
    if (parentAssociations && parentAssociations.length) {
      intersectionData = _.filter(parentAssociations, (e) => {
        return _.find(childAssociations, e);
      });
    }
    return intersectionData;
  }

  getParentAssociations(fields, associations, formData, callback) {
    if (fields.parent && fields.parent.length) {
      _.forEach(fields.parent, (val) => {
        _.forEach(this.formFieldProperties, (field) => {
          if (field.code === val) {
            _.forEach(field.range, (range) => {
              if (_.isArray(formData[val]) && formData[val].length > 0) {
                _.forEach(formData[val], (metadata) => {
                  if (range.name === metadata) {
                    associations = this.getCommonAssociations(range.associations, associations);
                  }
                });
              } else {
                if (range.name === formData[val]) {
                  associations = this.getCommonAssociations(range.associations, associations);
                }
              }
            });
          }
        });
      });
    }
    callback(associations);
  }
  /**
* @description                    - Which is used to get the association object by mapping key and range object
* @param {String | Array} keys    - To the associactio object for particular key's
* @param {Object} range           - Which refers to framework terms/range object
*/
  getAssociations(keys, range, callback) {
    let names = [];
    const associations = [];
    const filteredAssociations = [];
    if (_.isString(keys)) {
      names.push(keys);
    } else {
      names = keys;
    }
    _.forEach(range, (res) => {
      _.forEach(names, (value, key) => {
        if (res.name === value) {
          filteredAssociations.push(res);
        }
      });
    });
    _.forEach(filteredAssociations, (val, index) => {
      if (val.associations) {
        _.forEach(val.associations, (key, value) => {
          associations.push(key);
        });
      }
    });
    if (callback) {
      callback(associations);
    }
  }

  /**
* @description                    - Which is used to resolve the dependency.
* @param {Object} field           - Which field need need to get change.
* @param {Object} associations    - Association values of the respective field.
* @param {Boolean} resetSelected  - @default true Which defines while resolving the dependency dropdown
*                                   Should reset the selected values of the field or not
*/
  applyDependencyRules(field, associations, resetSelected) {
    // reset the depended field first
    // Update the depended field with associated value
    // Currently, supported only for the dropdown values
    let dependedValues = [];
    let groupdFields = [];
    if (field.depends && field.depends.length) {
      _.forEach(field.depends, (id) => {
        if (resetSelected) {
          this.resetSelectedField(id, field.range);
        }
        dependedValues = _.map(associations, i => _.pick(i, ['name', 'category']));
        if (dependedValues.length) {
          groupdFields = _.groupBy(dependedValues, 'category');
          this.updateDropDownList(id, dependedValues);
        }
        if (groupdFields) {
          for (const key in groupdFields) {
            if (groupdFields.hasOwnProperty(key)) {
              this.updateDropDownList(key, groupdFields[key]);
            }
          }
        } else {
          this.updateDropDownList(id, []);
        }
      });
    }
  }

  /**
   * @description         - Which is used to restore the dropdown slected value.
   * @param {String} id   - To restore the specific dropdown field value
   */
  resetSelectedField(id, field) {
    this.formInputData[id] = '';
  }


  /**
* @description            - Which updates the drop down value list
*                         - If the specified values are empty then drop down will get update with master list
* @param {Object} field   - Field which is need to update.
* @param {Object} values  - Values for the field
*/
  updateDropDownList(fieldCode, values) {
    if (values.length) {
      this.categoryList[fieldCode] = _.unionBy(values, 'name');
    } else {
      this.mapMasterCategoryList(fieldCode);
    }
  }

  /**
*
* @description                     -
* @param {Object} configurations   - Field configurations
* @param {String} key              - Field uniq code
*/
  mapMasterCategoryList(key) {
    _.forEach(this.formFieldProperties, (field, value) => {
      if (key) {
        if (field.code === key) {
          this.categoryList[field.code] = field.range;
        }
      } else {
        if (field.range) {
          this.categoryList[field.code] = field.range;
        }
      }
    });
  }
  /**
   * @method getYearsForCreateTextBook
   */
  getYearsForCreateTextBook() {
    const years = [];
    const currentYear = (new Date()).getUTCFullYear();
    for (let i = currentYear - 15; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  }
}

