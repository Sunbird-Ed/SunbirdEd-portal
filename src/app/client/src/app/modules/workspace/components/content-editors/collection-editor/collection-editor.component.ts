
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import * as  iziModal from 'izimodal/js/iziModal';
import {
  NavigationHelperService, ResourceService, ConfigService, ToasterService, IUserProfile, ServerResponse
} from '@sunbird/shared';
import { UserService, TenantService, FrameworkService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService, WorkSpaceService } from './../../../services';
import { environment } from '@sunbird/environment';
import { TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest, of, throwError } from 'rxjs';
import { map, mergeMap, tap, delay, first } from 'rxjs/operators';
jQuery.fn.iziModal = iziModal;
enum state {
  UP_FOR_REVIEW = 'upForReview',
  FLAGGED = 'flagged',
  FLAG_REVIEW = 'flagreviewer'
}

/**
 * Component Launches the collection Editor in a IFrame Modal
 */
@Component({
  selector: 'app-collection-editor',
  templateUrl: './collection-editor.component.html'
})
export class CollectionEditorComponent implements OnInit, OnDestroy {
  public categoryCodes: string[] = [];

  private userProfile: IUserProfile;
  private routeParams: any;
  private buildNumber: string;
  private deviceId: string;
  private portalVersion: string;
  public logo: string;
  public showLoader = true;
  private browserBackEventSub;
  public collectionDetails: any;
  public ownershipType: Array<string>;
  public queryParams: object;
  resource_framework: string;
  collectionEditorURL: string = (<HTMLInputElement>document.getElementById('collectionEditorURL')) ?
  (<HTMLInputElement>document.getElementById('collectionEditorURL')).value : '';
  /**
  * Default method of classs CollectionEditorComponent
  * @param {ResourceService} resourceService To get language constant
  * @param {EditorService} editorService To provide the api services
  * @param {ConfigService} config Reference of ConfigService
  * @param {UserService} userService Reference of userService
  * @param {ActivatedRoute} activatedRoute for getting params
  */
  constructor(private resourceService: ResourceService, private toasterService: ToasterService, private editorService: EditorService,
    private activatedRoute: ActivatedRoute, private userService: UserService, private _zone: NgZone, private router: Router,
    private configService: ConfigService, private tenantService: TenantService, private telemetryService: TelemetryService,
    private navigationHelperService: NavigationHelperService, private workspaceService: WorkSpaceService,
    private frameworkService: FrameworkService) {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    this.deviceId = deviceId ? deviceId.value : '';
    this.buildNumber = buildNumber ? buildNumber.value : '1.0';
    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
  }
  ngOnInit() {
    this.userProfile = this.userService.userProfile;
    this.routeParams = this.activatedRoute.snapshot.params;
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    if (this.routeParams.type === 'Course') {
      // tslint:disable-next-line:max-line-length
      return this.router.navigate(['workspace/edit/', 'Course', this.routeParams.contentId, this.routeParams.state, this.routeParams.contentStatus]);
    }
    this.disableBrowserBackButton();
    this.frameworkService.initialize();
    this.getDetails().pipe(
      first(),
      tap(data => {
        if (data.tenantDetails) {
          this.logo = data.tenantDetails.logo;
        }
        this.resource_framework = data.resource_framework['defaultFramework'].code;
        this.ownershipType = data.ownershipType;
        this.showLoader = false;
        this.initEditor();
        this.setWindowContext();
        this.setWindowConfig();
      }),
      delay(10)) // wait for iziModal lo load
    .subscribe((data) => {
      jQuery('#collectionEditor').iziModal('open'); // open iframe
    },
      (error) => {
        if (error === 'NO_PERMISSION') {
          this.toasterService.error(this.resourceService.messages.emsg.m0013);
        } else if (['RESOURCE_SELF_LOCKED', 'RESOURCE_LOCKED'].includes(_.get(error, 'error.params.err'))) {
          this.toasterService.error(_.replace(error.error.params.errmsg, 'resource', 'content'));
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0004);
        }
        this.closeModal();
      });
  }
  private getDetails() {
    const lockInfo = _.pick(this.queryParams, 'lockKey', 'expiresAt', 'expiresIn');
    const allowedEditState = ['draft', 'allcontent', 'collaborating-on', 'uploaded', 'alltextbooks'].includes(this.routeParams.state);
    const allowedEditStatus = this.routeParams.contentStatus ? ['draft'].includes(this.routeParams.contentStatus.toLowerCase()) : false;
    
    
    if (_.isEmpty(lockInfo) && allowedEditState && ( allowedEditStatus || this.userService.userProfile.rootOrgAdmin )) {
      return combineLatest(
       this.tenantService.tenantData$,
      this.getCollectionDetails(),
      this.editorService.getOwnershipType(),
      this.lockContent(),
      this.frameworkService.frameworkData$,
      this.userService.userOrgDetails$).
      pipe(map(data => ({ tenantDetails: data[0].tenantData,
        collectionDetails: data[1], ownershipType: data[2], resource_framework: data[4].frameworkdata })));
    } else {
      return combineLatest(
        this.tenantService.tenantData$,
        this.getCollectionDetails(),
        this.editorService.getOwnershipType(),
        this.frameworkService.frameworkData$,
        this.userService.userOrgDetails$,
      ).
      pipe(map(data => ({ tenantDetails: data[0].tenantData,
        collectionDetails: data[1], ownershipType: data[2], resource_framework: data[3].frameworkdata })));
    }
  }
  lockContent () {
    const contentInfo = {
      contentType: this.routeParams.type,
      framework: this.routeParams.framework,
      identifier: this.routeParams.contentId,
      mimeType: 'application/vnd.ekstep.content-collection'
    };
    const input = {
      resourceId : contentInfo.identifier,
      resourceType : 'Content',
      resourceInfo : JSON.stringify(contentInfo),
      creatorInfo : JSON.stringify({'name': this.userService.userProfile.firstName, 'id': this.userService.userProfile.id}),
      createdBy : this.userService.userProfile.id,
      isRootOrgAdmin: this.userService.userProfile.rootOrgAdmin
    };
    return this.workspaceService.lockContent(input).pipe(tap((data) => {
      this.queryParams = data.result;
      this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: data.result});
    }));
  }
  private getCollectionDetails() {
    const options: any = { params: {} };
    if (this.routeParams.state !== state.FLAGGED) {
      options.params.mode = 'edit';
    }
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
  /**
   *Validate the request
   */
  private validateRequest(): Boolean {
    const validStatus = _.indexOf(this.configService.editorConfig.COLLECTION_EDITOR.collectionStatus, this.collectionDetails.status) > -1;
    const validState = _.indexOf(this.configService.editorConfig.COLLECTION_EDITOR.collectionState, this.routeParams.state) > -1;
    if (this.collectionDetails.mimeType === this.configService.editorConfig.COLLECTION_EDITOR.mimeCollection && validStatus) {
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
  private initEditor() {
    jQuery('#collectionEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: this.collectionEditorURL + '?' + this.buildNumber,
      navigateArrows: false,
      fullscreen: false,
      openFullscreen: true,
      closeOnEscape: false,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      onClosing: () => {
        this._zone.run(() => {
          this.closeModal();
        });
      }
    });
  }
  private setWindowContext() {
    window.context = {
      user: {
        id: this.userService.userid,
        orgIds: this.userProfile.organisationIds,
        organisations: this.userService.orgIdNameMap,
        name : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.firstName + ' ' + this.userProfile.lastName :
        this.userProfile.firstName,
        isRootOrgAdmin: this.userService.userProfile.rootOrgAdmin
      },
      did: this.deviceId,
      sid: this.userService.sessionId,
      contentId: this.routeParams.contentId,
      pdata: {
        id: this.userService.appId,
        ver: this.portalVersion,
        pid: 'sunbird-portal'
      },
      actor: {
        id: this.userService.userid || 'anonymous',
        type: 'User'
      },
      contextRollUp: this.telemetryService.getRollUpData(this.userProfile.organisationIds),
      tags: this.userService.dims,
      channel: this.userService.channel,
      defaultLicense: this.frameworkService.getDefaultLicense(),
      framework: this.routeParams.framework,
      resource_framework: this.resource_framework,
      env: this.routeParams.type.toLowerCase(),
      ownershipType: this.ownershipType,
      timeDiff: this.userService.getServerTimeDiff
    };
    if (this.routeParams.type.toLowerCase() === 'course' ) {
      window.context['board'] = _.get(this.userProfile, 'framework.board');
    }
  }
  private setWindowConfig() {
    window.config = _.cloneDeep(this.configService.editorConfig.COLLECTION_EDITOR.WINDOW_CONFIG); // cloneDeep to preserve default config
    window.config.editorConfig.rules.objectTypes = this.getObjectTypes();
    window.config.headerLogo = this.logo;
    window.config.build_number = this.buildNumber;
    window.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
    window.config.lock = _.pick(this.queryParams, 'lockKey', 'expiresAt', 'expiresIn');
    if (this.routeParams.type.toLowerCase() === 'textbook') {
      window.config.plugins.push({
        id: 'org.ekstep.suggestcontent',
        ver: '1.1',
        type: 'plugin'
      }, {
        id: 'org.ekstep.uploadfile',
        ver: '1.0',
        type: 'plugin'
      });
      window.config.nodeDisplayCriteria = {
        contentType: ['TextBookUnit']
      };
    } else if (this.routeParams.type.toLowerCase() === 'course') {
      window.config.nodeDisplayCriteria = {
        contentType: ['Course', 'CourseUnit', 'Collection', 'Resource', 'SelfAssess']
      };
    } else if (this.routeParams.type.toLowerCase() === 'lessonplan') {
      window.config.nodeDisplayCriteria = {
        contentType: ['LessonPlanUnit']
      };
    } else if (this.routeParams.type.toLowerCase() === 'curriculumcourse') {
      window.config.nodeDisplayCriteria = {
        contentType: ['CourseUnit']
      };
    }
    if (this.routeParams.state === state.UP_FOR_REVIEW &&
      _.intersection(this.userProfile.userRoles, ['CONTENT_REVIEWER', 'CONTENT_REVIEW', 'BOOK_REVIEWER']).length > 0) {
      window.config.editorConfig.publishMode = true;
    } else if (this.routeParams.state === state.FLAGGED &&
      _.intersection(this.userProfile.userRoles, ['FLAG_REVIEWER']).length > 0) {
      window.config.editorConfig.isFlagReviewer = true;
    } else if (this.routeParams.state === state.FLAG_REVIEW &&
      _.intersection(this.userProfile.userRoles, ['FLAG_REVIEWER']).length > 0) {
      window.config.editorConfig.isFlagReviewer = true;
    }
    this.updateModeAndStatus();
  }
  /**
  * Update status and mode to the window
  */
  private updateModeAndStatus() {
    const contentStatus = this.collectionDetails.status.toLowerCase();
    if (contentStatus === 'draft') {
      window.config.editorConfig.mode = 'Edit';
      window.config.editorConfig.contentStatus = 'draft';
    }
    if (contentStatus === 'flagdraft') {
      window.config.editorConfig.mode = 'Edit';
      window.config.editorConfig.contentStatus = 'draft';
    }
    if (contentStatus === 'review') {
      window.config.editorConfig.mode = 'Read';
      window.config.editorConfig.contentStatus = 'draft';
    }
    if (contentStatus === 'live') {
      window.config.editorConfig.mode = 'Edit';
      window.config.editorConfig.contentStatus = 'live';
    }
    if (contentStatus === 'flagged') {
      window.config.editorConfig.mode = 'Read';
      window.config.editorConfig.contentStatus = 'flagged';
    }
    if (contentStatus === 'unlisted') {
      window.config.editorConfig.mode = 'Edit';
    }
    if (contentStatus === 'flagreview') {
      window.config.editorConfig.mode = 'Read';
      window.config.editorConfig.contentStatus = 'flagged';
    }
  }
  /**
   * Re directed to the draft on close of modal
   */
  public closeModal() {
    this.showLoader = true;
    if (document.getElementById('collectionEditor')) {
      document.getElementById('collectionEditor').remove();
    }
    const contentStatus = this.routeParams.contentStatus.toLowerCase();
    if (contentStatus === 'draft' || contentStatus === 'live') {
      this.retireLock();
    } else {
      this.redirectToWorkSpace();
    }
  }

  retireLock () {
    const inputData = {'resourceId': this.routeParams.contentId, 'resourceType': 'Content'};
    this.workspaceService.retireLock(inputData).subscribe(
      (data: ServerResponse) => {
        this.redirectToWorkSpace();
      },
      (err: ServerResponse) => {
        this.redirectToWorkSpace();
      }
    );
  }

  redirectToWorkSpace () {
    if (this.routeParams.state === 'collaborating-on') {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/collaborating-on/1');
    } else if ( this.routeParams.state === 'upForReview') {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/upForReview/1');
    } else {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/draft/1');
    }
  }


  ngOnDestroy() {
    if (document.getElementById('collectionEditor')) {
      document.getElementById('collectionEditor').remove();
    }
    if (this.browserBackEventSub) {
      this.browserBackEventSub.unsubscribe();
    }
    sessionStorage.setItem('inEditor', 'false');
    this.workspaceService.toggleWarning();
    const removeIzi = document.querySelector('.iziModal-isAttached');
    if (removeIzi) {
      removeIzi.classList.remove('iziModal-isAttached');
    }
  }
  /**
   * to assign the value to Editor Config
   */
  private getObjectTypes() {
    switch (this.routeParams.type) {
      case 'Course':
        return this.configService.editorConfig.COLLECTION_EDITOR.COURSE_ARRAY;
      case 'Collection':
        return this.configService.editorConfig.COLLECTION_EDITOR.COLLECTION_ARRAY;
      case 'LessonPlan':
        return this.configService.editorConfig.COLLECTION_EDITOR.LESSON_PLAN;
      case 'CurriculumCourse':
        return this.configService.editorConfig.COLLECTION_EDITOR.CURRICULUM_COURSE_ARRAY;
      default:
        return this.configService.editorConfig.COLLECTION_EDITOR.DEFAULT_CONFIG;
    }
  }
  private disableBrowserBackButton() {
    sessionStorage.setItem('inEditor', 'true');
    window.location.hash = 'no';
    this.workspaceService.toggleWarning(this.routeParams.type);
    this.browserBackEventSub = this.workspaceService.browserBackEvent.subscribe(() => {
      const closeEditorIntractEdata: IInteractEventEdata = {
        id: 'browser-back-button',
        type: 'click',
        pageid: 'collection-editor'
      };
      this.generateInteractEvent(closeEditorIntractEdata);
    });
  }
  private generateInteractEvent(intractEdata) {
    if (intractEdata) {
      const appTelemetryInteractData: any = {
        context: {
          env: 'collection-editor'
        },
        edata: intractEdata
      };
      if (this.collectionDetails) {
        appTelemetryInteractData.object = {
          id: this.collectionDetails.identifier,
          type: this.collectionDetails.contentType || this.collectionDetails.resourceType || 'collection',
          ver: this.collectionDetails.pkgVersion ? this.collectionDetails.pkgVersion.toString() : '1.0',
        };
      }
      this.telemetryService.interact(appTelemetryInteractData);
    }
  }
}
