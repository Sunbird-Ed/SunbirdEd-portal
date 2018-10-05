import { Component, OnInit, AfterViewInit, NgZone, Renderer2, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import * as iziModal from 'izimodal/js/iziModal';
import { NavigationHelperService, ResourceService, ConfigService, ToasterService, IUserProfile, ServerResponse } from '@sunbird/shared';
import { UserService, TenantService } from '@sunbird/core';
import { ActivatedRoute } from '@angular/router';
import { EditorService } from './../../../services/editors/editor.service';
import { environment } from '@sunbird/environment';
import { WorkSpaceService } from '../../../services';
import { TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest, of, throwError } from 'rxjs';
import { map, mergeMap, tap, delay } from 'rxjs/operators';
jQuery.fn.iziModal = iziModal;

/**
 * Component Launches the Content Editor in a IFrame Modal
 */
@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.css']
})
export class ContentEditorComponent implements OnInit, OnDestroy {

  private userProfile: IUserProfile;
  private routeParams: any;
  private buildNumber: string;
  private portalVersion: string;
  public logo: string;
  public showLoader = true;
  private browserBackEventSub;
  public contentDetails: any;
  public ownershipType: Array<string>;
  /**
  * Default method of class ContentEditorComponent
  */
  constructor(private resourceService: ResourceService, private toasterService: ToasterService,
    private editorService: EditorService, private activatedRoute: ActivatedRoute, private configService: ConfigService,
    private userService: UserService, private _zone: NgZone, private renderer: Renderer2,
    private tenantService: TenantService, private telemetryService: TelemetryService,
    private navigationHelperService: NavigationHelperService, private workspaceService: WorkSpaceService
  ) {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    this.buildNumber = buildNumber ? buildNumber.value : '1.0';
    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
  }
  ngOnInit() {
    this.userProfile = this.userService.userProfile;
    this.routeParams = this.activatedRoute.snapshot.params;
    this.disableBrowserBackButton();
    this.getDetails().pipe(
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
          this.toasterService.error(this.resourceService.messages.emsg.m0004);
          this.closeModal();
        });
  }
  private getDetails() {
    return combineLatest(this.tenantService.tenantData$, this.getContentDetails(),
    this.editorService.getOwnershipType()).
      pipe(map(data => ({ tenantDetails: data[0].tenantData,
        contentDetails: data[1], ownershipType: data[2] })));
  }
  private getContentDetails() {
    const options: any = { params: { mode: 'edit' } };
    return this.editorService.getContent(this.routeParams.contentId, options).
      pipe(mergeMap((data) => {
        this.contentDetails = data.result.content;
        if (this.validateRequest()) {
          return of(data);
        } else {
          return throwError(data);
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
      iframeURL: '/thirdparty/editors/content-editor/index.html?' + this.buildNumber,
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
        id: this.userProfile.userId,
        name: this.userProfile.firstName + ' ' + this.userProfile.lastName,
        orgIds: this.userProfile.organisationIds,
        organisations: this.userService.orgIdNameMap
      },
      sid: this.userService.sessionId,
      contentId: this.routeParams.contentId,
      pdata: {
        id: this.userService.appId,
        ver: this.portalVersion,
        pid: 'sunbird-portal'
      },
      tags: this.userService.dims,
      channel: this.userService.channel,
      framework: this.routeParams.framework,
      ownershipType: this.ownershipType
    };
  }
  private setWindowConfig() {
    window.config = _.cloneDeep(this.configService.editorConfig.CONTENT_EDITOR.WINDOW_CONFIG); // cloneDeep to preserve default config
    window.config.build_number = this.buildNumber;
    window.config.headerLogo = this.logo;
    window.config.aws_s3_urls = this.userService.cloudStorageUrls || [];
    window.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
  }
  /**
   * checks the permission using state, status and userId
   */
  private validateRequest() {
    const validStatus = _.indexOf(this.configService.editorConfig.CONTENT_EDITOR.contentStatus, this.contentDetails.status) > -1;
    const validState = _.indexOf(this.configService.editorConfig.CONTENT_EDITOR.contentState, this.routeParams.state) > -1;
    if (this.contentDetails.mimeType === this.configService.appConfig.CONTENT_CONST.CREATE_LESSON && validStatus) {
      if (validState && this.userProfile.userId !== this.userProfile.userId) {
        return true;
      } else if (validState && this.userProfile.userId === this.userProfile.userId) {
        return true;
      } else if (this.userProfile.userId === this.userProfile.userId) {
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
    this.navigationHelperService.navigateToWorkSpace('/workspace/content/draft/1');
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
  }
}
