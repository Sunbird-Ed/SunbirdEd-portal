import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile, Framework,
  ILoaderMessage, NavigationHelperService
} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { UserService, FrameworkService, FormService } from '@sunbird/core';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-data-driven',
  templateUrl: './data-driven.component.html',
  styleUrls: ['./data-driven.component.css']
})
export class DataDrivenComponent implements OnInit, OnDestroy {
  @ViewChild('formData') formData: DefaultTemplateComponent;
  @ViewChild('modal') modal;

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
   * resourceType is resource type
   */
  public resourceType;
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
  public configService: ConfigService;
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

  public creationFormLable: string;

  public isCachedDataExists: boolean;

  public framework: string;
  /**
	* telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;


  constructor(
    activatedRoute: ActivatedRoute,
    frameworkService: FrameworkService,
    private router: Router,
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    userService: UserService,
    configService: ConfigService,
    formService: FormService,
    private _cacheService: CacheService,
    public navigationHelperService: NavigationHelperService
  ) {
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.userService = userService;
    this.configService = configService;
    this.frameworkService = frameworkService;
    this.formService = formService;
    this.activatedRoute.url.subscribe(url => {
      this.contentType = url[0].path;
    });
    this.resourceType = this.configService.appConfig.resourceType[this.contentType];
    this.creationFormLable = this.configService.appConfig.contentCreateTypeLable[this.contentType];
  }


  ngOnInit() {

     this.checkForPreviousRouteForRedirect();

    /**
     * fetchFrameworkMetaData is called to config the form data and framework data
     */
    this.fetchFrameworkMetaData();
    /***
 * Call User service to get user data
 */
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.activatedRoute.snapshot.data.telemetry.uri
      }
    };
  }
  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
  /**
  * fetchFrameworkMetaData is gives form config data
  */
  fetchFrameworkMetaData() {

    this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
      if (frameworkData && !frameworkData.err) {
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata);
        this.framework = frameworkData.framework;
        /**
  * isCachedDataExists will check data is exists in cache or not. If exists should not call
  * form api otherwise call form api and get form data
  */
        this.isCachedDataExists = this._cacheService.exists(this.contentType + this.formAction);
        if (this.isCachedDataExists) {
          const data: any | null = this._cacheService.get(this.contentType + this.formAction);
          this.formFieldProperties = data;
        } else {
          const formServiceInputParams = {
            formType: this.formType,
            formAction: this.formAction,
            contentType: this.contentType,
            framework: frameworkData.framework
          };
          this.formService.getFormConfig(formServiceInputParams).subscribe(
            (data: ServerResponse) => {
              this.formFieldProperties = data;
              this.getFormConfig();
            },
            (err: ServerResponse) => {
              this.toasterService.error(this.resourceService.messages.emsg.m0005);
            }
          );
        }
      } else if (frameworkData && frameworkData.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    });
  }

  /**
   * @description            - Which is used to config the form field vlaues
   * @param {formFieldProperties} formFieldProperties  - Field information
   */
  getFormConfig() {
    _.forEach(this.categoryMasterList, (category) => {
      _.forEach(this.formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
    this._cacheService.set(this.contentType + this.formAction, this.formFieldProperties,
      {
        maxAge: this.configService.appConfig.cacheServiceConfig.setTimeInMinutes *
          this.configService.appConfig.cacheServiceConfig.setTimeInSeconds
      });
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
    requestData.name = data.name ? data.name : 'Untitled Collection',
      requestData.description = data.description ? data.description : 'Untitled Collection',
      requestData.creator = this.userProfile.firstName + ' ' + this.userProfile.lastName,
      requestData.createdBy = this.userProfile.id,
      requestData.organisation = this.userProfile.organisationNames,
      requestData.createdFor = this.userProfile.organisationIds,
      requestData.contentType = this.configService.appConfig.contentCreateTypeForEditors[this.contentType],
      requestData.framework = this.framework;
    if (this.contentType === 'studymaterial') {
      requestData.mimeType = this.configService.appConfig.CONTENT_CONST.CREATE_LESSON;
    } else {
      requestData.mimeType = this.configService.urlConFig.URLS.CONTENT_COLLECTION;
    }
    if (this.resourceType) {
      requestData.resourceType = this.resourceType;
    }

    return requestData;
  }

  createContent() {
    const state = 'draft';
    const framework = this.framework;
    const requestData = {
      content: this.generateData(_.pickBy(this.formData.formInputData))
    };
    if (this.contentType === 'studymaterial') {
      this.editorService.create(requestData).subscribe(res => {
        this.router.navigate(['/workspace/content/edit/content/', res.result.content_id, state, framework]);
      }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0078);
      });
    } else {
      this.editorService.create(requestData).subscribe(res => {
        const type = this.configService.appConfig.contentCreateTypeForEditors[this.contentType];
        this.router.navigate(['/workspace/content/edit/collection', res.result.content_id, type, state, framework]);
      }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0010);
      });
    }
  }

  /**
    * Issue #SB-1448,  If previous url is not from create page, redirect current page to 'workspace/content/create'
  */
  checkForPreviousRouteForRedirect() {
    const previousUrlObj = this.navigationHelperService.getPreviousUrl();
    if (previousUrlObj && previousUrlObj.url && (previousUrlObj.url !== '/workspace/content/create')) {
      this.redirect();
    }
  }

  redirect() {
    this.router.navigate(['/workspace/content/create']);
  }
}
