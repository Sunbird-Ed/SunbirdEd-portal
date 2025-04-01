import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService, PublicDataService, ContentService, FrameworkService } from '@sunbird/core';
import { TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import { ConfigService, NavigationHelperService, ToasterService, ResourceService, LayoutService, ServerResponse} from '@sunbird/shared';
import { EditorService, WorkSpaceService } from './../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { combineLatest, of, throwError } from 'rxjs';
import { map, mergeMap, tap, first } from 'rxjs/operators';
import { LazzyLoadScriptService } from 'LazzyLoadScriptService';

@Component({
  selector: 'app-new-collection-editor',
  templateUrl: './new-collection-editor.component.html',
  styleUrls: ['./new-collection-editor.component.scss']
})
export class NewCollectionEditorComponent implements OnInit, OnDestroy {
  public editorConfig: any;
  public deviceId: string;
  public portalVersion: string;
  public userProfile: any;
  public showLoader = false;
  private routeParams: any;
  public queryParams: object;
  public collectionDetails: any;
  public showQuestionEditor = false;
  private browserBackEventSubscribe;
  public hierarchyConfig: any;
  public layoutType: string;
  public baseUrl: string;
  public publicStorageAccount: any;
  public sunbirdQuestionSetChildrenLimit: any;
  public sunbirdCollectionChildrenLimit: any;
  constructor(private userService: UserService, public layoutService: LayoutService,
    private telemetryService: TelemetryService, private publicDataService: PublicDataService,
    private config: ConfigService, private contentService: ContentService, private router: Router,
    public editorService: EditorService, public workSpaceService: WorkSpaceService,
    public frameworkService: FrameworkService, public toasterService: ToasterService,
    private activatedRoute: ActivatedRoute, private navigationHelperService: NavigationHelperService,
    private lazzyLoadScriptService: LazzyLoadScriptService,
    public resourceService: ResourceService) {
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    this.deviceId = deviceId ? deviceId.value : '';
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    this.layoutType = localStorage.getItem('layoutType') || 'joy';
    this.baseUrl = (<HTMLInputElement>document.getElementById('baseUrl'))
      ? (<HTMLInputElement>document.getElementById('baseUrl')).value : document.location.origin;
      this.publicStorageAccount = (<HTMLInputElement>document.getElementById('publicStorageAccount'))
      ? (<HTMLInputElement>document.getElementById('publicStorageAccount')).value : undefined;
      this.sunbirdQuestionSetChildrenLimit = (<HTMLInputElement>document.getElementById('sunbirdQuestionSetChildrenLimit')) ?
      (<HTMLInputElement>document.getElementById('sunbirdQuestionSetChildrenLimit')).value : 500;
      this.sunbirdCollectionChildrenLimit = (<HTMLInputElement>document.getElementById('sunbirdCollectionChildrenLimit')) ?
      (<HTMLInputElement>document.getElementById('sunbirdCollectionChildrenLimit')).value : 1200;
  }

  ngOnInit() {
    this.routeParams = this.activatedRoute.snapshot.params;
    this.userProfile = this.userService.userProfile;
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    this.disableBrowserBackButton();
    this.getDetails().pipe(
      first(),
      tap(data => {
        this.switchLayout();
      })).subscribe((data) => {
        this.showLoader = true;
        this.showQuestionEditor = this.collectionDetails.mimeType === 'application/vnd.sunbird.questionset' ? true : false;
        this.getFrameWorkDetails();
        this.loadScripts();
      },
      (error) => {
          if (error === 'NO_PERMISSION') {
            this.redirectToWorkSpace();
            this.toasterService.error(this.resourceService.messages.emsg.m0013);
          } else if (['RESOURCE_SELF_LOCKED', 'RESOURCE_LOCKED'].includes(_.get(error, 'error.params.err'))) {
            this.retireLock();
            this.toasterService.error(_.replace(error.error.params.errmsg, 'resource', 'content'));
          } else {
            this.redirectToWorkSpace();
            this.toasterService.error(this.resourceService.messages.emsg.m0004);
          }
      });
  }

  switchLayout() {
    if (this.layoutType === 'joy') {
      localStorage.setItem('collectionEditorLayoutType', this.layoutType);
      this.layoutService.initiateSwitchLayout();
    }
  }

  loadScripts() {
    combineLatest(this.lazzyLoadScriptService.loadScript('semanticTreePicker.js'));
  }

  public getCollectionDetails() {
    const options: any = { params: {} };
    options.params.mode = 'edit';
    if (this.routeParams.type && this.routeParams.type === 'QuestionSet') {
      return this.workSpaceService.getQuestion(this.routeParams.contentId, options).
      pipe(mergeMap((data) => {
        this.collectionDetails = data.result.questionset;
        if (this.validateRequest()) {
          return of(data);
        } else {
          return throwError('NO_PERMISSION');
        }
      }));
    } else {
      return this.editorService.getContent(this.routeParams.contentId, options).
      pipe(mergeMap((data) => {
        this.collectionDetails = data.result.content;
        if (this.validateRequest()) {
          return of(data);
        } else {
          return throwError('NO_PERMISSION');
        }
      }));
    }
  }

  public getDetails() {
    const lockInfo = _.pick(this.queryParams, 'lockKey', 'expiresAt', 'expiresIn');
    const allowedEditState = ['draft', 'allcontent', 'collaborating-on', 'uploaded', 'alltextbooks'].includes(this.routeParams.state);
    const allowedEditStatus = this.routeParams.contentStatus ? ['draft'].includes(this.routeParams.contentStatus.toLowerCase()) : false;
    if (_.isEmpty(lockInfo) && allowedEditState && ( allowedEditStatus || this.userService.userProfile.rootOrgAdmin )) {
      return combineLatest(
        this.getCollectionDetails(),
        this.editorService.getOwnershipType(),
        this.lockContent(),
      ).pipe(map(data => ({ collectionInfo: data[0], ownershipType: data[1]})));
    } else {
      return combineLatest(
        this.getCollectionDetails(),
        this.editorService.getOwnershipType(),
      ).pipe(map(data => ({ collectionInfo: data[0], ownershipType: data[1]})));
    }
  }

  lockContent () {
    const contentInfo = {
      contentType: this.routeParams.type,
      framework: this.routeParams.framework,
      identifier: this.routeParams.contentId,
      mimeType: this.routeParams.type && this.routeParams.type === 'QuestionSet' ? 'application/vnd.sunbird.questionset' : 'application/vnd.ekstep.content-collection'
    };
    const input = {
      resourceId : contentInfo.identifier,
      resourceType : 'Content',
      resourceInfo : JSON.stringify(contentInfo),
      creatorInfo : JSON.stringify({'name': this.userService.userProfile.firstName, 'id': this.userService.userProfile.id}),
      createdBy : this.userService.userProfile.id,
      isRootOrgAdmin: this.userService.userProfile.rootOrgAdmin
    };
    return this.workSpaceService.lockContent(input).pipe(tap((data) => {
      this.queryParams = data.result;
      this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: data.result});
    }));
  }

  retireLock () {
    const inputData = {'resourceId': this.routeParams.contentId, 'resourceType': 'Content'};
    this.workSpaceService.retireLock(inputData).subscribe(
      (data: ServerResponse) => {
        this.redirectToWorkSpace();
      },
      (err: ServerResponse) => {
        this.redirectToWorkSpace();
      }
    );
  }

  /**
   *Validate the request
   */
   public validateRequest() {
    const validStatus = _.indexOf(this.config.editorConfig.COLLECTION_EDITOR.collectionStatus, this.collectionDetails.status) > -1;
    const validState = _.indexOf(this.config.editorConfig.COLLECTION_EDITOR.collectionState, this.routeParams.state) > -1;
    if ((this.collectionDetails.mimeType === this.config.editorConfig.COLLECTION_EDITOR.mimeCollection
    || this.collectionDetails.mimeType === this.config.editorConfig.QUESTIONSET_EDITOR.mimeCollection) && validStatus) {
      if (validState && this.collectionDetails.createdBy !== this.userService.userid) {
        return true; // we need to remove this case or validState should be changed
      } else if (validState && _.includes(this.collectionDetails.collaborators, this.userService.userid)) {
        return true;
      } else if (validState && this.collectionDetails.createdBy === this.userService.userid) {
        return true;
      } else if (this.collectionDetails.createdBy === this.userService.userid) {
        return true;
      }
      return false;
    }
    return false;
  }

  getFrameWorkDetails() {
    const objectType = this.collectionDetails.mimeType === 'application/vnd.sunbird.questionset' ? 'QuestionSet' : 'Collection';
    this.workSpaceService.getCategoryDefinition(objectType, this.collectionDetails.primaryCategory, this.userService.channel)
    .subscribe(data => {
      // tslint:disable-next-line:max-line-length
      if (_.get(data, 'result.objectCategoryDefinition.objectMetadata.config')) {
        this.hierarchyConfig = _.get(data, 'result.objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection');
        if (!_.isEmpty(this.hierarchyConfig.children)) {
          this.hierarchyConfig.children = this.getPrimaryCategoryData(this.hierarchyConfig.children);
        }
        if (!_.isEmpty(this.hierarchyConfig.hierarchy)) {
          _.forEach(this.hierarchyConfig.hierarchy, (hierarchyValue) => {
            if (_.get(hierarchyValue, 'children')) {
              hierarchyValue['children'] = this.getPrimaryCategoryData(_.get(hierarchyValue, 'children'));
            }
          });
        }
      }
      if (!this.showQuestionEditor) {
        this.setEditorConfig();
        this.editorConfig.context['framework'] = _.get(this.collectionDetails, 'framework');
        if (_.get(this.collectionDetails, 'primaryCategory') && _.get(this.collectionDetails, 'primaryCategory') !== 'Curriculum Course') {
          this.editorConfig.context['targetFWIds'] = _.get(this.collectionDetails, 'targetFWIds');
        }
        this.showLoader = false;
      } else {
        this.setEditorConfig();
        this.showLoader = false;
      }
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0015);
    });
  }

  getPrimaryCategoryData(childrenData) {
    _.forEach(childrenData, (value, key) => {
      if (_.isEmpty(value)) {
        switch (key) {
          case 'Question':
            childrenData[key] = this.frameworkService['_channelData'].questionPrimaryCategories
            || this.config.appConfig.WORKSPACE.questionPrimaryCategories;
            break;
          case 'Content':
            childrenData[key] = this.frameworkService['_channelData'].contentPrimaryCategories || [];
            break;
          case 'Collection':
            childrenData[key] = this.frameworkService['_channelData'].collectionPrimaryCategories || [];
            break;
          case 'QuestionSet':
            childrenData[key] = this.frameworkService['_channelData'].questionsetPrimaryCategories || [];
            break;
        }
      }
    });
    return childrenData;
  }

  editorEventListener(event) {
    const layoutType = localStorage.getItem('layoutType');
    const collectionEditorLayoutType = localStorage.getItem('collectionEditorLayoutType');
    if (layoutType === 'default' && collectionEditorLayoutType) {
      this.layoutService.initiateSwitchLayout();
      localStorage.removeItem('collectionEditorLayoutType');
    }
    const contentStatus = this.routeParams.contentStatus.toLowerCase();
    if (contentStatus === 'draft' || contentStatus === 'live') {
      this.retireLock();
    } else {
      this.redirectToWorkSpace();
    }
  }

  redirectToWorkSpace () {
    if (this.routeParams.state === 'collaborating-on') {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/collaborating-on/1');
    } else if ( this.routeParams.state === 'upForReview') {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/upForReview/1');
    } else if ( this.routeParams.state === 'allcontent') {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/allcontent/1');
    } else {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/draft/1');
    }
  }

  ngOnDestroy() {
    if (this.browserBackEventSubscribe) {
      this.browserBackEventSubscribe.unsubscribe();
    }
    sessionStorage.setItem('inEditor', 'false');
    this.workSpaceService.newtoggleWarning();
  }

  setEditorConfig() {
    // tslint:disable-next-line:max-line-length
    const additionalCategories = _.merge(this.frameworkService['_channelData'].contentAdditionalCategories, this.frameworkService['_channelData'].collectionAdditionalCategories) || this.config.appConfig.WORKSPACE.primaryCategory;
    const cloudProvider = (<HTMLInputElement>document.getElementById('cloudProvider')).value ? (<HTMLInputElement>document.getElementById('cloudProvider')).value : '' ;
    this.editorConfig = {
      context: {
        identifier: this.routeParams.contentId,
        channel: this.userService.channel,
        authToken: '',
        sid: this.userService.sessionId,
        did: this.deviceId,
        uid: this.userService.userid,
        additionalCategories: additionalCategories,
        host: this.baseUrl,
        pdata: {
          id: this.userService.appId,
          ver: this.portalVersion,
          pid: 'sunbird-portal'
        },
        actor: {
          id: this.userService.userid || 'anonymous',
          type: 'User'
        },
        contextRollup: this.telemetryService.getRollUpData(this.userProfile.organisationIds),
        tags: this.userService.dims,
        timeDiff: this.userService.getServerTimeDiff,
        defaultLicense: this.frameworkService.getDefaultLicense(),
        endpoint: '/data/v3/telemetry',
        env: this.showQuestionEditor ? 'questionset_editor' : 'collection_editor',
        user: {
          id: this.userService.userid,
          orgIds: this.userProfile.organisationIds,
          organisations: this.userService.orgIdNameMap,
          fullName : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.firstName + ' ' + this.userProfile.lastName :
          this.userProfile.firstName,
          firstName: this.userProfile.firstName,
          lastName : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.lastName : '',
          isRootOrgAdmin: this.userService.userProfile.rootOrgAdmin
        },
        channelData: this.frameworkService['_channelData'],
        cloudStorageUrls : this.userService.cloudStorageUrls,
        cloudStorage:{ provider: cloudProvider}
      },
      config: {
        primaryCategory: this.collectionDetails.primaryCategory,
        objectType: _.get(this.collectionDetails, 'objectType') || 'QuestionSet',
        mode: this.getEditorMode(),
        questionSet: {
          maxQuestionsLimit: this.sunbirdQuestionSetChildrenLimit
        },
        collection: {
          maxContentsLimit: this.sunbirdCollectionChildrenLimit
        },
      }
    };
    this.editorConfig.config.showAddCollaborator = false;
    this.editorConfig.config.publicStorageAccount = this.publicStorageAccount;
    if (this.showQuestionEditor) {
      this.editorConfig.config.showAddCollaborator = false;
      this.editorConfig.context.framework = this.collectionDetails.framework || this.frameworkService['_channelData'].defaultFramework;
    }
    this.editorConfig.config = _.assign(this.editorConfig.config, this.hierarchyConfig);
  }

  private disableBrowserBackButton() {
    window.location.hash = 'no';
    sessionStorage.setItem('inEditor', 'true');
    this.workSpaceService.newtoggleWarning(this.routeParams.type);
    this.browserBackEventSubscribe = this.workSpaceService.browserBackEvent.subscribe(() => {
      const intractEventEdata: IInteractEventEdata = {
        id: 'browser-back-button',
        type: 'click',
        pageid: 'collection-editor'
      };
      this.generateInteractEvent(intractEventEdata);
    });
  }

  private getEditorMode() {
    const contentStatus = this.collectionDetails.status.toLowerCase();
    if (contentStatus === 'draft' || contentStatus === 'live' || contentStatus === 'flagdraft'
        || contentStatus === 'unlisted') {
      return 'edit';
    }

    if (contentStatus === 'flagged' || contentStatus === 'flagreview') {
      return 'read';
    }

    if (contentStatus === 'review') {
      if (this.collectionDetails.createdBy === this.userProfile.id) {
        return 'read';
      } else {
        return 'review';
      }
    }
  }

  generateInteractEvent(intractEventEdata) {
    if (intractEventEdata) {
      const telemetryInteractData: any = {
        context: {
          env: 'collection-editor'
        },
        edata: intractEventEdata
      };
      if (this.collectionDetails) {
        telemetryInteractData.object = {
          id: this.collectionDetails.identifier,
          type: this.collectionDetails.contentType || this.collectionDetails.resourceType || 'collection',
          ver: this.collectionDetails.pkgVersion ? this.collectionDetails.pkgVersion.toString() : '1.0',
        };
      }
      this.telemetryService.interact(telemetryInteractData);
    }
  }

}
