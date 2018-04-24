import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile, Framework } from '@sunbird/shared';
import { FormService, FrameworkService, UserService } from '@sunbird/core';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
import { Router } from '@angular/router';
import { EditorService } from './../../services';

@Component({
  selector: 'app-content-creation-default-template',
  templateUrl: './content-creation-default-template.component.html',
  styleUrls: ['./content-creation-default-template.component.css']
})
export class DefaultTemplateComponent implements OnInit, AfterViewInit {
  @Input('formFieldProperties') formFieldProperties: any;
  @Input('categoryMasterList') categoryMasterList: any;
  @Output() childEvent = new EventEmitter();

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
  public creationForm: FormGroup;
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
  public config: ConfigService;
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
  public formInputData: any;
/**
 * categoryList is category list of dropdown values
 */
  public categoryList: Object;
/**
 * masterList is master copy of framework data
 */
  public masterList: any;
/**
 * years is used to get years from getYearsForCreateTextBook
 */
  public years: any;
    /**
   * To make content editor service API calls
   */
  private editorService: EditorService;

  // private categoryMasterList: any;



  constructor(
    formService: FormService,
    private _cacheService: CacheService,
    private router: Router,
    resourceService: ResourceService,
    frameworkService: FrameworkService,
    toasterService: ToasterService,
    userService: UserService,
    config: ConfigService,
    editorService: EditorService
  ) {
    this.formService = formService;
    this.resourceService = resourceService;
    this.frameworkService = frameworkService;
    this.toasterService = toasterService;
    this.categoryList = {};
    this.userService = userService;
    this.config = config;
    this.editorService = editorService;
  }

  ngAfterViewInit() {
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
  ngOnInit() {
    this.formInputData = {};
    this.masterList = {};
    /***
 * Call User service to get user data
 */
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.showLoader = false;
    this.years = this.getYearsForCreateTextBook();
    this.mapMasterCategoryList(this.formFieldProperties, '');
  }
  /**
 * requestBody is returned of type object
 */
  generateData(data) {
    this.showLoader = true;
    const requestData = _.cloneDeep(data);
    // const requestBody = {
    requestData.name = data.name ? data.name : 'Untitled Collection',
      requestData.description = data.description ? data.description : 'Untitled Collection',
      requestData.creator = this.userProfile.firstName + ' ' + this.userProfile.lastName,
      requestData.createdBy = this.userProfile.id,
      requestData.organisation = [],
      requestData.createdFor = this.userProfile.organisationIds,
      requestData.mimeType = this.config.appConfig.CONTENT_CONST.CREATE_LESSON,
      requestData.contentType = 'Resource';
    // };

    return requestData;
  }
  /**
     * onConfigChange is called whene dropdown value changed
     */
  onConfigChange(data) {
   // console.log('data' , data);
    this.updateForm(data);
  }

  /**
  * @description            - Which is used to update the form when vlaues is get changes
  * @param {Object} object  - Field information
  */
  updateForm(object) {
    if (object.field.range) {
      this.getAssociations(object.value, object.field.range, (associations) => {
        this.applyDependencyRules(object.field, associations, true);
      });
    }
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
    _.filter(range, function (res) {
      _.forEach(names, function (value, key) {
        if (res.name === value) {
          filteredAssociations.push(res);
        }
      });
    });
    _.forEach(filteredAssociations, function (val, index) {
      if (val.associations) {
        _.forEach(val.associations, function (key, value) {
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
    let dependedValues;
    let groupdFields;
    if (field.depends && field.depends.length) {
      _.forEach(field.depends, (id) => {
        if (resetSelected) {
          this.resetSelectedField(id, field.range);
        }
        dependedValues =  _.map(associations, i => _.pick(i, ['name', 'category']));
        groupdFields = _.chain(dependedValues)
          .groupBy('category')
          .map((name, category) => ({ name, category }))
          .value();
        this.updateDropDownList(id, dependedValues);
        if (groupdFields.length) {
          _.forEach(groupdFields, (value, key) => {
            this.updateDropDownList(value.category, _.map(value.name, i => _.pick(i, 'name')));
          });
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
      this.mapMasterCategoryList(this.formFieldProperties, fieldCode);
    }
  }

  /**
*
* @description                     -
* @param {Object} configurations   - Field configurations
* @param {String} key              - Field uniq code
*/
  mapMasterCategoryList(configurations, key) {
    _.forEach(configurations, (field, value) => {
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
    return years.reverse();
  }
}

