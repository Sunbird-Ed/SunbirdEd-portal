import { Component, OnInit } from '@angular/core';
import { UserService, PublicDataService, ContentService, FrameworkService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { ConfigService, NavigationHelperService, ToasterService, ResourceService, LayoutService} from '@sunbird/shared';
import { EditorService, WorkSpaceService } from './../../../services';
import { ActivatedRoute} from '@angular/router';
import * as _ from 'lodash-es';
import { combineLatest } from 'rxjs';
import { LazzyLoadScriptService } from 'LazzyLoadScriptService';

@Component({
  selector: 'app-new-collection-editor',
  templateUrl: './new-collection-editor.component.html',
  styleUrls: ['./new-collection-editor.component.scss']
})
export class NewCollectionEditorComponent implements OnInit {
  public editorConfig: any;
  public deviceId: string;
  public portalVersion: string;
  public userProfile: any;
  public showLoader = true;
  private routeParams: any;
  public collectionDetails: any;
  public showQuestionEditor = false;
  public hierarchyConfig: any;
  public layoutType: string;
  public baseUrl: string;
  constructor(private userService: UserService, public layoutService: LayoutService,
    private telemetryService: TelemetryService, private publicDataService: PublicDataService,
    private config: ConfigService, private contentService: ContentService,
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
  }

  ngOnInit() {
    this.routeParams = this.activatedRoute.snapshot.params;
    this.userProfile = this.userService.userProfile;
    this.getCollectionDetails().subscribe(data => {
        this.switchLayout();
        this.collectionDetails = data.result.content || data.result.questionset;
        this.showQuestionEditor = this.collectionDetails.mimeType === 'application/vnd.sunbird.questionset' ? true : false;
        this.getFrameWorkDetails();
      });
    this.loadScripts();
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

  private getCollectionDetails() {
    const options: any = { params: {} };
    options.params.mode = 'edit';
    if (this.routeParams.type && this.routeParams.type === 'QuestionSet') {
      return this.workSpaceService.getQuestion(this.routeParams.contentId, options);
    } else {
      return this.editorService.getContent(this.routeParams.contentId, options);
    }
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
    this.redirectToWorkSpace();
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

  setEditorConfig() {
    // tslint:disable-next-line:max-line-length
    const additionalCategories = _.merge(this.frameworkService['_channelData'].contentAdditionalCategories, this.frameworkService['_channelData'].collectionAdditionalCategories) || this.config.appConfig.WORKSPACE.primaryCategory;
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
        env: this.showQuestionEditor ? 'question_editor' : 'collection_editor',
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
        cloudStorageUrls : this.userService.cloudStorageUrls
      },
      config: {
        mode: this.getEditorMode()
      }
    };
    if (this.showQuestionEditor) {
      this.editorConfig.context.framework = this.collectionDetails.framework || this.frameworkService['_channelData'].defaultFramework;
    }
    this.editorConfig.config = _.assign(this.editorConfig.config, this.hierarchyConfig);
  }

  private getEditorMode() {
    const contentStatus = this.collectionDetails.status.toLowerCase();
    if (contentStatus === 'draft' || contentStatus === 'live') {
      return 'edit';
    }
    if (contentStatus === 'review') {
      if (this.collectionDetails.createdBy === this.userProfile.id) {
        return 'read';
      } else {
        return 'review';
      }
    }
  }
}
