import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ResourceService, ConfigService, ToasterService, ServerResponse, Framework,
  ILoaderMessage, NavigationHelperService , BrowserCacheTtlService
} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { SearchService, UserService, FrameworkService, FormService, PublicDataService, ContentService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { WorkSpace } from '../../classes/workspace';
import { WorkSpaceService } from '../../services';
import { Subject, forkJoin, of } from 'rxjs';
import { mergeMap, takeUntil} from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-data-driven',
  templateUrl: './data-driven.component.html',
  styleUrls: ['./data-driven.component.scss']
})
export class DataDrivenComponent extends WorkSpace implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('formData', {static: false}) formData: DefaultTemplateComponent;
  @ViewChild('modal', {static: false}) modal;

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

  public showFrameworkSelection: boolean;

  public frameworkCardData = [];

  public selectedCard: any;

  public enableCreateButton = false;

  public isSubmit = false;
  public orgFWType;
  public targetFWType;

  public unsubscribe = new Subject<void>();
  public targetFramework: string;
  public primaryCategory: string;
  public userChannelData;
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
    public browserCacheTtlService: BrowserCacheTtlService,
    public telemetryService: TelemetryService,
    public publicDataService: PublicDataService,
    public contentService: ContentService
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
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.showFrameworkSelection = _.get(queryParams, 'showFrameworkSelection');
    });
    this.userService.userOrgDetails$.subscribe(() => { // wait for user organization details
      this.checkForPreviousRouteForRedirect();
      if (this.showFrameworkSelection) {
        this.frameworkService.getChannel(this.userService.hashTagId).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          this.userChannelData = data;
          this.selectFramework();
        }, err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        });
      } else {
        /**
       * fetchFrameworkMetaData is called to config the form data and framework data
       */
        this.fetchFrameworkMetaData();
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
        if (_.lowerCase(this.contentType) !== 'course') {
          this.framework = frameworkData.frameworkdata['defaultFramework'].code;
        }
        if (_.lowerCase(this.contentType) === 'questionset') {
          const reqData = this.generateQuestionSetData();
          this.workSpaceService.createQuestionSet(reqData).subscribe(res => {
            // tslint:disable-next-line:max-line-length
            this.router.navigate(['workspace/edit/', 'QuestionSet', res.result.identifier, 'allcontent', 'Draft']);
          }, err => {
            this.toasterService.error(this.resourceService.messages.fmsg.m0102);
          });
        } else {
          const categoryList = {
            'code' : 'primaryCategory',
            'identifier': 'sb_primaryCategory',
            'description': 'Primary Category',
            'terms' : this.getCategoryList(this.contentType)
          };
          this.categoryMasterList.push(categoryList);
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
    requestData.name = data.name ? data.name : this.name,
      requestData.description = data.description ? data.description : this.description,
      requestData.createdBy = this.userService.userProfile.id,
      requestData.organisation = _.uniq(this.userService.orgNames),
      requestData.createdFor = this.userService.userProfile.organisationIds,
      requestData.contentType = this.configService.appConfig.contentCreateTypeForEditors[this.contentType];
    if (this.framework) {
      requestData.framework = this.framework;
    }
    if (this.contentType === 'studymaterial' && data.contentType) {
      requestData.contentType = data.contentType;
    }
    if (requestData.year) {
      requestData.year = requestData.year.toString();
    }
    if (requestData.maxAttempts) {
      requestData.maxAttempts = _.parseInt(requestData.maxAttempts);
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
    if (!_.isEmpty(this.userService.userProfile.lastName)) {
      requestData.creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
    } else {
      requestData.creator = this.userService.userProfile.firstName;
    }

    if (this.targetFramework) {
      requestData.targetFWIds = _.castArray(this.targetFramework);
    }
    if (this.primaryCategory) {
      requestData.primaryCategory = this.primaryCategory;
    }

    return requestData;
  }

  createContent(modal) {
    let requiredFields = [];
    requiredFields = _.map(_.filter(this.formFieldProperties, { 'required': true }), field => field.code );
    const requestData = {
      content: this.generateData(_.pickBy(this.formData.formInputData))
    };
    for (let i = 0; i < requiredFields.length; i++) {
      if (_.isUndefined(requestData.content[requiredFields[i]])) {
        this.toasterService.error(this.resourceService.messages.fmsg.m0101);
        return;
      }
    }
    if (!_.isUndefined(modal)) {
      modal.deny();
    }
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
    }  else if (this.contentType === 'course') {
      this.router.navigate(['workspace/edit/', 'Course', content.identifier, state, 'Draft']);
    } else {
      const type = this.configService.appConfig.contentCreateTypeForEditors[this.contentType];
      this.router.navigate(['/workspace/content/edit/collection', content.identifier, type, state, framework, 'Draft']);
    }
    this.logTelemetry(content.identifier);
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

  fetchTargetFramework(targetframeworkReq) {
    if (!_.isEmpty(targetframeworkReq)) {
      this.checkChannelOrSystem(targetframeworkReq[0], targetframeworkReq[1]).subscribe((targetRes) => {
        // tslint:disable-next-line:max-line-length
        const targetFWData = targetRes;
        if (this.targetFWType && targetFWData.result.count > 0) {
          this.targetFramework = _.get(_.first(_.get(targetFWData, 'result.Framework')), 'identifier');
        }
        if (_.isEmpty(this.targetFramework)) {
          this.showCategoryConfigError();
        } else {
          this.createContent(undefined);
        }
      });
    } else {
      this.targetFramework = _.isArray(this.targetFWType) ? _.first(this.targetFWType) : this.targetFWType;
      this.createContent(undefined);
    }
  }

/**
   * @since - #SH-403
   * @param  {} cardData
   * @description - 1. It selects a card from the framework selection popup
   *                shown while creating any resource (only course as of now)
   *                2. It also logs interact telemetry on card click.
   */
  selectFramework() {
    this.primaryCategory = 'Course';
    this.workSpaceService.getCategoryDefinition('Collection', this.primaryCategory, this.userService.channel)
    .subscribe(categoryDefinitionData => {
      this.orgFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.framework.default');
      this.targetFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.targetFWIds.default');
      const orgframeworkReq = [];
      const targetframeworkReq = [];
      if (_.isEmpty(this.orgFWType)) {
        this.orgFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
        orgframeworkReq.push(this.getFrameworkDataByType(this.orgFWType, this.userService.channel));
        orgframeworkReq.push(this.getFrameworkDataByType(this.orgFWType));
      }

      if (_.isEmpty(this.targetFWType)) {
        this.targetFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.targetFWType');
        targetframeworkReq.push(this.getFrameworkDataByType(this.targetFWType, this.userService.channel));
        targetframeworkReq.push(this.getFrameworkDataByType(this.targetFWType));
      }

      if (_.isEmpty(this.orgFWType) || _.isEmpty(this.targetFWType)) {
        this.showCategoryConfigError();
      }

      if (!_.isEmpty(orgframeworkReq)) {
        this.checkChannelOrSystem(orgframeworkReq[0], orgframeworkReq[1]).subscribe((response) => {
          const orgFWData = response;
          if (_.get(orgFWData, 'result.count') <= 0) {
            this.showCategoryConfigError();
          } else {
            this.fetchTargetFramework(targetframeworkReq);
          }
        }, err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0025);
        });
      } else {
        this.fetchTargetFramework(targetframeworkReq);
      }
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0024);
    });
  }

  showCategoryConfigError() {
    this.toasterService.error(`Unknown framework category ${this.primaryCategory}. Please check the configuration.`);
    this.redirect();
    return ;
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

  getFrameworkDataByType(type?, channel?, identifer?) {
    const option = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        request: {
            filters: {
                objectType: 'Framework',
                status: ['Live'],
                ...(type && {type}),
                ...(identifer && {identifer}),
                ...(channel && {channel})
            },
            'limit': 1
        }
    }
      };
      return this.contentService.post(option);
  }

  checkChannelOrSystem(channelObservable, systemObservable) {
    return channelObservable.pipe(mergeMap(
      (data) => {
        if (_.get(data, 'result.count') > 0) { return of(data); }
        return systemObservable;
      }
    ));
  }

  /**
   * @since - #SH-403
   * @param  {string} contentId
   * @description - it triggers an interact event when Start creating button is clicked.
   */
  logTelemetry(contentId) {
    const telemetryData = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env'),
        cdata: [{
          type: 'framework',
          id: this.framework
        }]
      },
      edata: {
        id: 'start-creating-' + this.contentType,
        type: 'click',
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid')
      },
      object: {
        id: contentId,
        type: this.contentType,
        ver: '1.0',
        rollup: {},
      }
    };
    if (this.targetFramework) {
      telemetryData.context.cdata.push({
        type: 'targetFW',
        id: this.targetFramework
      });
    }
    this.telemetryService.interact(telemetryData);
  }

  getCategoryList(type: string): object {
    const primaryCategoryList = [];
      if (type === 'collection' || type === 'lessonplan') {
        if (!_.isEmpty(this.frameworkService['_channelData'].collectionPrimaryCategories)) {
          _.forEach(this.frameworkService['_channelData'].collectionPrimaryCategories, (field) => {
            if (_.lowerCase(field) === _.lowerCase('Course')) {
              return;
            }
            const categoryTemplateObject = {
               'identifier' : field,
               'name' : field,
               'description': field
            };
            primaryCategoryList.push(categoryTemplateObject);
        });
        }
      } else if (type === 'studymaterial' || type === 'assessment') {
        if (!_.isEmpty(this.frameworkService['_channelData'].contentPrimaryCategories)) {
          _.forEach(this.frameworkService['_channelData'].contentPrimaryCategories, (field) => {
            if (_.lowerCase(field) === _.lowerCase('Course Assessment')) {
              return;
            }
            const categoryTemplateObject = {
               'identifier' : field,
               'name' : field,
               'description': field
            };
            primaryCategoryList.push(categoryTemplateObject);
        });
      }
    }
    return primaryCategoryList;
  }

  generateQuestionSetData() {
    let name = this.userService.userProfile.firstName;
    if (!_.isEmpty(this.userService.userProfile.lastName)) {
      name = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
    }
    return {
        'questionset': {
          name: 'Untitled QuestionSet',
          mimeType: 'application/vnd.sunbird.questionset',
          primaryCategory: 'Practice Question Set',
          createdBy: this.userService.userProfile.id,
          // organisation: _.uniq(this.userService.orgNames),
          createdFor: this.userService.userProfile.organisationIds,
          framework: this.framework,
          // creator: name,
          code: UUID.UUID()
        }
    };
  }
}
