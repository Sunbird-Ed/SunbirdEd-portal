import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile, Framework,
  ILoaderMessage, NavigationHelperService , BrowserCacheTtlService
} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { SearchService, UserService, FrameworkService, FormService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import { WorkSpace } from '../../classes/workspace';
import { WorkSpaceService } from '../../services';
import { combineLatest, Subscription, Subject, of, throwError } from 'rxjs';
import { takeUntil, first, mergeMap, map, tap , filter, catchError} from 'rxjs/operators';
@Component({
  selector: 'app-data-driven',
  templateUrl: './data-driven.component.html'
})
export class DataDrivenComponent extends WorkSpace implements OnInit, OnDestroy, AfterViewInit {
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

  public name: string;

  public description: string;

  public isCachedDataExists: boolean;

  public framework: string;
  /**
	* telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;

  public unsubscribe = new Subject<void>();
  constructor(
    public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
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
    public navigationHelperService: NavigationHelperService,
    public browserCacheTtlService: BrowserCacheTtlService
  ) {
    super(searchService, workSpaceService, userService);
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
    this.name = this.configService.appConfig.contentName[this.contentType] ?
                this.configService.appConfig.contentName[this.contentType] : 'Untitled';
   this.description = this.configService.appConfig.contentDescription[this.contentType] ?
   this.configService.appConfig.contentDescription[this.contentType] : 'Untitled';
  }


  ngOnInit() {
    this.checkForPreviousRouteForRedirect();
    if (this.router.url.includes('create/training')) {
      this.frameworkService.getDefaultCourseFramework().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        this.framework = data;
        this.fetchFrameworkMetaData();
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
       });
    } else {
      /**
     * fetchFrameworkMetaData is called to config the form data and framework data
     */
      this.fetchFrameworkMetaData();
    }
    /***
 * Call User service to get user data
 */
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
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
      if (!frameworkData.err) {
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata['defaultFramework'].categories);
        if (!this.router.url.includes('create/training')) {
          this.framework = frameworkData.frameworkdata['defaultFramework'].code;
        }
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
            framework: this.framework
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
    const previousUrl = _.get(this.navigationHelperService.getPreviousUrl(), 'url');
    this.router.navigate([previousUrl]);
  }

  /**
* requestBody is returned of type object
*/
  generateData(data) {
    this.showLoader = true;
    const requestData = _.cloneDeep(data);
    requestData.name = data.name ? data.name : this.name,
      requestData.description = data.description ? data.description : this.description,
      requestData.createdBy = this.userProfile.id,
      requestData.organisation = _.uniq(this.userProfile.organisationNames),
      requestData.createdFor = this.userProfile.organisationIds,
      requestData.contentType = this.configService.appConfig.contentCreateTypeForEditors[this.contentType],
      requestData.framework = this.framework;
    if (this.contentType === 'studymaterial' && data.contentType) {
      requestData.contentType = data.contentType;
    }
    if (requestData.year) {
      requestData.year = requestData.year.toString();
    }
    if (this.contentType === 'studymaterial' || this.contentType === 'assessment') {
      requestData.mimeType = this.configService.appConfig.CONTENT_CONST.CREATE_LESSON;
    } else {
      requestData.mimeType = this.configService.urlConFig.URLS.CONTENT_COLLECTION;
    }
    if (data.resourceType) {
      requestData.resourceType = data.resourceType;
    } else if (this.resourceType) {
      requestData.resourceType = this.resourceType;
    }
    if (!_.isEmpty(this.userProfile.lastName)) {
      requestData.creator = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    } else {
      requestData.creator = this.userProfile.firstName;
    }
    return requestData;
  }

  createContent() {
    const requestData = {
      content: this.generateData(_.pickBy(this.formData.formInputData))
    };
    if (this.contentType === 'studymaterial' || this.contentType === 'assessment') {
      this.editorService.create(requestData).subscribe(res => {
        this.createLockAndNavigateToEditor({identifier: res.result.content_id});
      }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0078);
      });
    } else {
      this.editorService.create(requestData).subscribe(res => {
        this.createLockAndNavigateToEditor({identifier: res.result.content_id});
      }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0010);
      });
    }
  }

  createLockAndNavigateToEditor (content) {
    const state = 'draft';
    const framework = this.framework;
    if (this.contentType === 'studymaterial' || this.contentType === 'assessment') {
      this.router.navigate(['/workspace/content/edit/content/', content.identifier, state, framework, 'Draft']);
    } else {
      const type = this.configService.appConfig.contentCreateTypeForEditors[this.contentType];
      this.router.navigate(['/workspace/content/edit/collection', content.identifier, type, state, framework, 'Draft']);
    }
  }

  /**
    * Issue #SB-1448,  If previous url is not from create page, redirect current page to 'workspace/content/create'
  */
 checkForPreviousRouteForRedirect() {
  const previousUrlObj = this.navigationHelperService.getPreviousUrl();
   const url = _.get(previousUrlObj, 'url');
   const routes = ['/workspace/content/create', '/workspace/content/create/training'];
   if (url && _.indexOf(routes, url) === -1) {
     this.redirect();
   }
}

  redirect() {
    this.router.navigate(['/workspace/content/create']);
  }

  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          uri: this.activatedRoute.snapshot.data.telemetry.uri,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }
}
