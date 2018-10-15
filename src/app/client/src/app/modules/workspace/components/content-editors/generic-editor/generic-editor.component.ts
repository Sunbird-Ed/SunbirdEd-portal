import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as  iziModal from 'izimodal/js/iziModal';
import { NavigationHelperService, ResourceService, ToasterService, ConfigService, IUserProfile, ServerResponse } from '@sunbird/shared';
import { TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest, of, throwError } from 'rxjs';
import { UserService, TenantService } from '@sunbird/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@sunbird/environment';
import { EditorService, WorkSpaceService } from '../../../services';
import { tap, delay, map } from 'rxjs/operators';
import * as _ from 'lodash';

jQuery.fn.iziModal = iziModal;

/**
 * Component Launches the Generic Editor in a IFrame Modal
 */@Component({
  selector: 'app-generic-editor',
  templateUrl: './generic-editor.component.html',
  styleUrls: ['./generic-editor.component.css']
})
export class GenericEditorComponent implements OnInit, OnDestroy {

  private userProfile: IUserProfile;
  private routeParams: any;
  private buildNumber: string;
  private portalVersion: string;
  public logo: string;
  public showLoader = true;
  private browserBackEventSub;
  public extContWhitelistedDomains: string;
  public ownershipType: Array<string>;

  constructor(private userService: UserService, public _zone: NgZone, private activatedRoute: ActivatedRoute,
    private tenantService: TenantService, private telemetryService: TelemetryService,
    private navigationHelperService: NavigationHelperService, public workspaceService: WorkSpaceService,
    private configService: ConfigService, private editorService: EditorService) {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    this.buildNumber = buildNumber ? buildNumber.value : '1.0';
    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    this.extContWhitelistedDomains = (<HTMLInputElement>document.getElementById('extContWhitelistedDomains')) ?
      (<HTMLInputElement>document.getElementById('extContWhitelistedDomains')).value : 'youtube.com,youtu.be';
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
        jQuery('#genericEditor').iziModal('open');
      });
  }
  private getDetails() {
    return combineLatest(this.tenantService.tenantData$,
    this.editorService.getOwnershipType()).
    pipe(map(data => ({ tenantDetails: data[0].tenantData,
      ownershipType: data[1] })));
  }
  /**
   *Launch Generic Editor in the modal
   */
  private initEditor() {
    jQuery('#genericEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/thirdparty/editors/generic-editor/index.html?' + this.buildNumber,
      navigateArrows: false,
      fullscreen: true,
      openFullscreen: true,
      closeOnEscape: true,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      closeButton: true,
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
      env: 'generic-editor',
      framework: this.routeParams.framework,
      ownershipType: this.ownershipType
    };
  }
  private setWindowConfig() {
    window.config = _.cloneDeep(this.configService.editorConfig.GENERIC_EDITOR.WINDOW_CONFIG); // cloneDeep to preserve default config
    window.config.build_number = this.buildNumber;
    window.config.headerLogo = this.logo;
    window.config.extContWhitelistedDomains = this.extContWhitelistedDomains;
    window.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
  }
  /**
  * Re directed to the workspace on close of modal
  */
  closeModal() {
    this.showLoader = true;
    if (document.getElementById('genericEditor')) {
      document.getElementById('genericEditor').remove();
    }
    this.navigationHelperService.navigateToWorkSpace('workspace/content/uploaded/1');
  }
  private disableBrowserBackButton() {
    sessionStorage.setItem('inEditor', 'true');
    window.location.hash = 'no';
    this.workspaceService.toggleWarning(this.routeParams.type);
    this.browserBackEventSub = this.workspaceService.browserBackEvent.subscribe(() => {
      const closeEditorIntractEdata: IInteractEventEdata = {
        id: 'browser-back-button',
        type: 'click',
        pageid: 'generic-editor'
      };
      this.generateInteractEvent(closeEditorIntractEdata);
    });
  }
  private generateInteractEvent(intractEdata) {
    if (intractEdata) {
      const appTelemetryInteractData: any = {
        context: {
          env: 'generic-editor'
        },
        edata: intractEdata
      };
      if (this.routeParams.contentId) {
        appTelemetryInteractData.object = {
          id: this.routeParams.contentId,
          type: 'content',
          ver: '1.0'
        };
      }
      this.telemetryService.interact(appTelemetryInteractData);
    }
  }
  ngOnDestroy() {
    if (document.getElementById('genericEditor')) {
      document.getElementById('genericEditor').remove();
    }
    if (this.browserBackEventSub) {
      this.browserBackEventSub.unsubscribe();
    }
    sessionStorage.setItem('inEditor', 'false');
    this.workspaceService.toggleWarning();
  }
}
