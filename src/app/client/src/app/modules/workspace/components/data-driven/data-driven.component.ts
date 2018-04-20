import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile, Framework,
  ILoaderMessage
} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { UserService, FrameworkService, FormService } from '@sunbird/core';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';

@Component({
  selector: 'app-data-driven',
  templateUrl: './data-driven.component.html',
  styleUrls: ['./data-driven.component.css']
})
export class DataDrivenComponent implements OnInit {
  @ViewChild('formData') formData: DefaultTemplateComponent;


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
  public contentType;
  /**
 * userForm name creation
 */
  public creationForm: FormGroup;
  /**
 * userProfile is of type userprofile interface
 */
  public userProfile: IUserProfile;
  /**
* Contains config service reference
*/
  public config: ConfigService;
  /**
 * To make inbox API calls
 */
  private editorService: EditorService;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
 * To call resource service which helps to use language constant
 */
  public userService: UserService;
  /**
 * To send activatedRoute.snapshot to routerNavigationService
 */
  public activatedRoute: ActivatedRoute;
  /**
  * loader message
  */
  loaderMessage: ILoaderMessage;

  public frameworkService: FrameworkService;

  public formService: FormService;

  public formType = 'content';

  public formAction = 'create';

  public getFormFields: any;

  public formFieldProperties: any;

  public categoryMasterList: any;

  // public formInputData: any;

  private creationFormLable: string;

  public exists: boolean;

  public framework: String;



  constructor(
    activatedRoute: ActivatedRoute,
    frameworkService: FrameworkService,
    private router: Router,
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    userService: UserService,
    config: ConfigService,
    formService: FormService,
    private _cacheService: CacheService
  ) {
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.userService = userService;
    this.config = config;
    this.frameworkService = frameworkService;
    this.formService = formService;
    this.activatedRoute.url.subscribe(url => {
      this.contentType = url[0].path;
    });
    this.creationFormLable = this.config.appConfig.contentCreateTypeLable[this.contentType];
    this.getMetaData();
  }

  ngOnInit() {
    // this.formInputData = {};
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
  }
  /**
* getMetaData is gives form config data
*/
  getMetaData() {
    this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
      if (frameworkData && !frameworkData.err) {
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata);
        this.framework = frameworkData.framework;
        this.exists = this._cacheService.exists(this.contentType + this.formAction);
        if (this.exists) {
          const data: any | null = this._cacheService.get(this.contentType + this.formAction);
          this.formFieldProperties = data;
          this.getFormConfig(this.formFieldProperties);
        } else {
          /**
          * Default method of OrganisationService class
          *@param {formType} type form type
          *@param {formAction} action form action type
          * @param {contentType} content selected content type
          */
          this.formService.getFormConfig(this.formType, this.formAction, this.contentType, frameworkData.framework).subscribe(
            (data: ServerResponse) => {
              setTimeout(() => {
                this.formFieldProperties = data;
                this.getFormConfig(this.formFieldProperties);
              }, 0);
            },
            (err: ServerResponse) => {
              this.toasterService.error(this.resourceService.messages.emsg.m0005 || 'Something went wrong, please try again later...');
            }
          );
        }
      } else if (frameworkData && frameworkData.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005 || 'Something went wrong, please try again later...');
      }
    });
  }

  /**
   * @description            - Which is used to config the form field vlaues
   * @param {formFieldProperties} formFieldProperties  - Field information
   */
  getFormConfig(formFieldProperties) {
    _.forEach(this.categoryMasterList, (category) => {
      _.forEach(this.formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    // this.formFieldProperties.sort((a, b) => a.index - b.index);
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
  }
  /****
* Redirects to workspace create section
*/
  goToCreate() {
    this.router.navigate(['/workspace/content/create']);
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
      requestData.contentType = this.config.appConfig.contentCreateTypeForEditors[this.contentType],
      requestData.framework = this.framework;
    // };
    if (this.contentType === 'studymaterial') {
      requestData.mimeType = this.config.appConfig.CONTENT_CONST.CREATE_LESSON;
    } else {
      requestData.mimeType = this.config.urlConFig.URLS.CONTENT_COLLECTION;
    }

    return requestData;
  }

  createCollection() {
    const state = 'Draft';
    const framework = this.framework;
    const requestData = {
      content: this.generateData(_.pickBy(this.formData.formInputData))
    };
    if (this.contentType === 'studymaterial') {
      this.editorService.create(requestData).subscribe(res => {
        this.router.navigate(['/workspace/content/edit/contentEditor/', res.result.content_id, state, framework]);
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0010);
      });
    } else {
      this.editorService.create(requestData).subscribe(res => {
        const type = this.config.appConfig.contentCreateTypeForEditors[this.contentType];
        this.router.navigate(['/workspace/content/edit/collection', res.result.content_id, type, state, framework]);
      }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0010);
      });
    }
  }
}
