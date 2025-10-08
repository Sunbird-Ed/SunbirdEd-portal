import { Component, OnInit, NgZone, Renderer2, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import * as iziModal from 'izimodal/js/iziModal';
import { NavigationHelperService, ResourceService, ConfigService, ToasterService, IUserProfile, ServerResponse } from '@sunbird/shared';
import { UserService, TenantService, FrameworkService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../../services/editors/editor.service';
import { environment } from '@sunbird/environment';
import { WorkSpaceService } from '../../../services';
import { TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest, of, throwError } from 'rxjs';
import { map, mergeMap, tap, delay, first } from 'rxjs/operators';
import { CslFrameworkService } from '../../../../public/services/csl-framework/csl-framework.service';
jQuery.fn.iziModal = iziModal;

/**
 * Component Launches the Content Editor in a IFrame Modal
 */
@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html'
})
export class ContentEditorComponent implements OnInit, OnDestroy {

  private userProfile: IUserProfile;
  private routeParams: any;
  private buildNumber: string;
  private deviceId: string;
  private portalVersion: string;
  public logo: string;
  public showLoader = true;
  private browserBackEventSub;
  public contentDetails: any;
  public ownershipType: Array<string>;
  public queryParams: object;
  public videoMaxSize: any;
  public frameworkCategories: any;
  public fwCategoriesAsNames: any;
  contentEditorURL: string = (<HTMLInputElement>document.getElementById('contentEditorURL')) ?
  (<HTMLInputElement>document.getElementById('contentEditorURL')).value : '';
  cloudProvider: string = (<HTMLInputElement>document.getElementById('cloudProvider')) ?
  (<HTMLInputElement>document.getElementById('cloudProvider')).value : '';


  /**
  * Default method of class ContentEditorComponent
  */
  constructor(private resourceService: ResourceService, private toasterService: ToasterService,
    private editorService: EditorService, private activatedRoute: ActivatedRoute, private configService: ConfigService,
    private userService: UserService, private _zone: NgZone, private renderer: Renderer2,
    private tenantService: TenantService, private telemetryService: TelemetryService, private router: Router,
    private navigationHelperService: NavigationHelperService, private workspaceService: WorkSpaceService,
    private frameworkService: FrameworkService,
    private cslFrameworkService: CslFrameworkService
  ) {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    this.buildNumber = buildNumber ? buildNumber.value : '1.0';
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    this.deviceId = deviceId ? deviceId.value : '';
    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    this.videoMaxSize = (<HTMLInputElement>document.getElementById('videoMaxSize')) ?
      (<HTMLInputElement>document.getElementById('videoMaxSize')).value : '100';
    this.fwCategoriesAsNames = this.cslFrameworkService?.getAllFwCatName();
  }
  ngOnInit() {
    this.userProfile = this.userService.userProfile;
    this.routeParams = this.activatedRoute.snapshot.params;
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    this.disableBrowserBackButton();
    this.setFrameworkCategories();
    this.getDetails().pipe( first(),
      tap(data => {
        if (data.tenantDetails) {
          this.logo = data.tenantDetails.logo;
        }
        this.ownershipType = data.ownershipType;
        this.showLoader = false;
        this.initEditor();
        this.setWindowContext();
        this.setWindowConfig();
      }),
      delay(10)) // wait for iziModal lo load
      .subscribe((data) => {
        jQuery('#contentEditor').iziModal('open');
        this.setRenderer();
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
  
  private setFrameworkCategories() {
    const categories = this.cslFrameworkService.getFrameworkCategoriesObject();
    if (categories && _.size(categories)) {
      this.frameworkCategories = _.map(categories, category => ({
        code: category.code,
        label: category.label
      }));
    }
  }
  
  private getDetails() {
    const lockInfo = _.pick(this.queryParams, 'lockKey', 'expiresAt', 'expiresIn');
    const allowedEditState = ['draft', 'allcontent', 'collaborating-on', 'uploaded'].includes(this.routeParams.state);
    const allowedEditStatus = this.routeParams.contentStatus ? ['draft'].includes(this.routeParams.contentStatus.toLowerCase()) : false;


    if (_.isEmpty(lockInfo) && allowedEditState && allowedEditStatus) {
      return combineLatest(
        this.tenantService.tenantData$, 
        this.getContentDetails(),
        this.editorService.getOwnershipType(), 
        this.lockContent(), 
        this.userService.userOrgDetails$
      ).
      pipe(map(data => ({ 
        tenantDetails: data[0].tenantData,
        collectionDetails: data[1], 
        ownershipType: data[2],
      })));
    } else {
      return combineLatest(
        this.tenantService.tenantData$, 
        this.getContentDetails(),
        this.editorService.getOwnershipType(), 
        this.userService.userOrgDetails$,
      ).
      pipe(map(data => ({ 
        tenantDetails: data[0].tenantData,
        collectionDetails: data[1], 
        ownershipType: data[2]
      })));
    }
  }
  lockContent() {
    const contentInfo = {
      contentType: this.routeParams.type,
      framework: this.routeParams.framework,
      identifier: this.routeParams.contentId,
      mimeType: 'application/vnd.ekstep.ecml-archive'
    };
    const input = {
      resourceId: contentInfo.identifier,
      resourceType: 'Content',
      resourceInfo: JSON.stringify(contentInfo),
      creatorInfo: JSON.stringify({ 'name': this.userService.userProfile.firstName, 'id': this.userService.userProfile.id }),
      createdBy: this.userService.userProfile.id
    };
    return this.workspaceService.lockContent(input).pipe(tap((data) => {
      this.queryParams = data.result;
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: data.result });
    }));
  }
  private getContentDetails() {
    const options: any = { params: { mode: 'edit' } };
    return this.editorService.getContent(this.routeParams.contentId, options).
      pipe(mergeMap((data) => {
        this.contentDetails = data.result.content;
        if (this.validateRequest()) {
          return of(data);
        } else {
          return throwError('NO_PERMISSION');
        }
      }));
  }
  private disableBrowserBackButton() {
    sessionStorage.setItem('inEditor', 'true');
    window.location.hash = 'no';
    this.workspaceService.toggleWarning(this.routeParams.type);
    this.browserBackEventSub = this.workspaceService.browserBackEvent.subscribe(() => {
      const closeEditorIntractEdata: IInteractEventEdata = {
        id: 'browser-back-button',
        type: 'click',
        pageid: 'content-editor'
      };
      this.generateInteractEvent(closeEditorIntractEdata);
    });
  }
  private setRenderer() {
    this.renderer.listen('window', 'editor:metadata:edit', () => {
      this.closeModal();
    });
    this.renderer.listen('window', 'editor:window:close', () => {
      this.closeModal();
    });
    this.renderer.listen('window', 'editor:content:review', () => {
      this.closeModal();
    });
  }
  private initEditor() {
    jQuery('#contentEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: this.contentEditorURL + '?' + this.buildNumber,
      navigateArrows: false,
      fullscreen: true,
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
        name: !_.isEmpty(this.userProfile.lastName) ? this.userProfile.firstName + ' ' + this.userProfile.lastName :
          this.userProfile.firstName,
        orgIds: this.userProfile.organisationIds,
        organisations: this.userService.orgIdNameMap
      },
      did: this.deviceId,
      sid: this.userService.sessionId,
      contentId: this.routeParams.contentId,
      pdata: {
        id: this.userService.appId,
        ver: this.portalVersion,
        pid: 'sunbird-portal'
      },
      contextRollUp: this.telemetryService.getRollUpData(this.userProfile.organisationIds),
      tags: this.userService.dims,
      channel: this.userService.channel,
      defaultLicense: this.frameworkService.getDefaultLicense(),
      framework: this.routeParams.framework,
      ownershipType: this.ownershipType,
      timeDiff: this.userService.getServerTimeDiff
    };
  }
  private setWindowConfig() {
    window.config = _.cloneDeep(this.configService.editorConfig.CONTENT_EDITOR.WINDOW_CONFIG); // cloneDeep to preserve default config
    window.config.build_number = this.buildNumber;
    window.config.headerLogo = this.logo;
    window.config.aws_s3_urls = this.userService.cloudStorageUrls || [];
    window.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
    window.config.lock = _.pick(this.queryParams, 'lockKey', 'expiresAt', 'expiresIn');
    window.config.videoMaxSize = this.videoMaxSize;
    window.config.cloudStorage.provider = this.cloudProvider;
    window.config.contentFields = this.fwCategoriesAsNames.join();
    window.config.fwCategoryDetails = this.frameworkCategories;
  }
  /**
   * checks the permission using state, status and userId
   */
  private validateRequest() {
    const validStatus = _.indexOf(this.configService.editorConfig.CONTENT_EDITOR.contentStatus, this.contentDetails.status) > -1;
    const validState = _.indexOf(this.configService.editorConfig.CONTENT_EDITOR.contentState, this.routeParams.state) > -1;
    if (this.contentDetails.mimeType === this.configService.appConfig.CONTENT_CONST.CREATE_LESSON && validStatus) {
      if (validState && this.contentDetails.createdBy !== this.userService.userid) {
        return true; // we need to remove this case or validState should be changed
      } else if (validState && this.contentDetails.createdBy === this.userService.userid) {
        return true;
      } else if (validState && _.includes(this.contentDetails.collaborators, this.userService.userid)) {
        return true;
      } else if (this.contentDetails.createdBy === this.userService.userid) {
        return true;
      }
      return false;
    }
    return false;
  }
  private generateInteractEvent(intractEdata) {
    if (intractEdata) {
      const appTelemetryInteractData: any = {
        context: {
          env: 'content-editor'
        },
        edata: intractEdata
      };
      if (this.contentDetails) {
        appTelemetryInteractData.object = {
          id: this.contentDetails.identifier,
          type: this.contentDetails.contentType || this.contentDetails.resourceType || 'content',
          ver: this.contentDetails.pkgVersion ? this.contentDetails.pkgVersion.toString() : '1.0',
        };
      }
      this.telemetryService.interact(appTelemetryInteractData);
    }
  }
  /**
   * Re directed to the draft on close of modal
   */
  closeModal() {
    this.showLoader = true;
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
    }
    if (this.routeParams.contentStatus.toLowerCase() === 'draft') {
      this.retireLock();
    } else {
      this.redirectToWorkSpace();
    }
  }

  retireLock() {
    const inputData = { 'resourceId': this.routeParams.contentId, 'resourceType': 'Content' };
    this.workspaceService.retireLock(inputData).subscribe(
      (data: ServerResponse) => {
        this.redirectToWorkSpace();
      },
      (err: ServerResponse) => {
        this.redirectToWorkSpace();
      }
    );
  }

  redirectToWorkSpace() {
    if (this.routeParams.state === 'collaborating-on') {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/collaborating-on/1');
    } else {
      this.navigationHelperService.navigateToWorkSpace('/workspace/content/draft/1');
    }
  }

  ngOnDestroy() {
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
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
}
