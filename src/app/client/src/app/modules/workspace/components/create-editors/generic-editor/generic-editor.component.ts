import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import * as  iziModal from 'izimodal/js/iziModal';
import {
  NavigationHelperService, ResourceService, ConfigService, ToasterService, ServerResponse,
  IUserData, IUserProfile
} from '@sunbird/shared';
import { UserService, TenantService } from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@sunbird/environment';
import { WorkSpaceService } from '../../../services';

@Component({
  selector: 'app-generic-editor',
  templateUrl: './generic-editor.component.html',
  styleUrls: ['./generic-editor.component.css']
})

/**
 * Component Launches the Generic Editor in a IFrame Modal
 */
export class GenericEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
* To show toaster(error, success etc) after any API calls
*/
  private toasterService: ToasterService;
  /**
    * To call resource service which helps to use language constant
    */
  public resourceService: ResourceService;
  /**
  * user profile details.
  */
  userService: UserService;
  /**
   * Id of the content created
   */
  public contentId: string;
  /**
   * state of the content
   */
  public state: string;
  /**
  * framework value of editor
  */
  public framework: string;
  /**
   * user profile details.
   */
  public userProfile: IUserProfile;
  /**
 * To navigate to other pages
 */
  private router: Router;
  /**
   * Boolean to show and hide modal
   */
  public showModal: boolean;

  /**
   * user tenant details.
   */
  public tenantService: TenantService;

  private buildNumber: string;

  public logo: string;

  public extContWhitelistedDomains: string;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;
  public listener;

  constructor(userService: UserService, router: Router, public _zone: NgZone,
    activatedRoute: ActivatedRoute, tenantService: TenantService,
    public navigationHelperService: NavigationHelperService, toasterService: ToasterService,
    resourceService: ResourceService, public workspaceService: WorkSpaceService) {
    this.userService = userService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.tenantService = tenantService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    try {
      this.buildNumber = (<HTMLInputElement>document.getElementById('buildNumber')).value;
    } catch (error) {
      this.buildNumber = '1.0';
    }
  }
  ngOnInit() {
    /**
     * Call User service to get user data
     */
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params['contentId'];
      this.state = params['state'];
      this.framework = params['framework'];
      sessionStorage.setItem('inEditor', 'true');
      window.location.hash = 'no';
      this.workspaceService.toggleWarning();
    });
    try {
      this.extContWhitelistedDomains = (<HTMLInputElement>document.getElementById('extContWhitelistedDomains')).value;
    } catch (error) {
      this.extContWhitelistedDomains = 'youtube.com,youtu.be';
    }
  }

  ngAfterViewInit() {
    /**
     * Fetch header logo and launch the generic editor after window load
     */
    this.tenantService.tenantData$.subscribe((data) => {
      if (data && !data.err) {
        this.logo = data.tenantData.logo;
        this.openGenericEditor();
      } else if (data && data.err) {
        this.openGenericEditor();
      }
    });
  }
  /**
   *Launch Genreic Editor in the modal
   */
  openGenericEditor() {
    jQuery.fn.iziModal = iziModal;
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

    setTimeout(() => {
      jQuery('#genericEditor').iziModal('open');
    }, 100);

    /**
     * Assign the values to window context
     */
    window.context = {
      user: {
        id: this.userService.userid,
        name: this.userProfile.firstName + ' ' + this.userProfile.lastName,
        orgIds: this.userProfile.organisationIds
      },
      sid: this.userService.sessionId,
      contentId: this.contentId,
      pdata: {
        id: this.userService.appId,
        ver: this.buildNumber.slice(0, 5),
        pid: 'sunbird-portal'
      },
      tags: this.userService.dims,
      channel: this.userService.channel,
      env: 'genericeditor',
      framework: this.framework
    };

    /**
     * Assign the values to window config
     */
    window.config = {
      corePluginsPackaged: true,
      modalId: 'genericEditor',
      dispatcher: 'local',
      apislug: '/action',
      alertOnUnload: true,
      build_number: this.buildNumber,
      headerLogo: this.logo,
      loadingImage: '',
      extContWhitelistedDomains: this.extContWhitelistedDomains,
      plugins: [{
        id: 'org.ekstep.sunbirdcommonheader',
        ver: '1.4',
        type: 'plugin'
      }, {
        id: 'org.ekstep.sunbirdmetadata',
        ver: '1.1',
        type: 'plugin'
      }, {
        id: 'org.ekstep.metadata',
        ver: '1.1',
        type: 'plugin'
      }],
      previewConfig: {
        'repos': ['/sunbird-plugins/renderer'],
        plugins: [{
          'id': 'org.sunbird.player.endpage',
          ver: 1.1,
          type: 'plugin'
        }],
        splash: {
          text: '',
          icon: '',
          bgImage: 'assets/icons/splacebackground_1.png',
          webLink: ''
        },
        'overlay': {
          'showUser': false
        },
        showEndPage: false
      }

    };
    window.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
  }
  /**
  * Re directed to the workspace on close of modal
  */
  closeModal() {
    this.showModal = true;
    setTimeout(() => {
      this.navigateToWorkSpace();
    }, 1000);
  }

  // navigateToUploads() {
  //   if (this.state) {
  //     this.router.navigate(['workspace/content/', this.state, '1']);
  //   } else {
  //     this.router.navigate(['workspace/content/uploaded/1']);
  //   }
  //   this.showModal = false;
  // }

  navigateToWorkSpace() {
    if (document.getElementById('collectionEditor')) {
      document.getElementById('collectionEditor').remove();
    }
    this.navigationHelperService.navigateToWorkSpace('workspace/content/uploaded/1');
    this.showModal = false;
  }
  /**
   * On componenet destroy remove the genericEditor id from DOM
   */
  ngOnDestroy() {
    if (document.getElementById('genericEditor')) {
      document.getElementById('genericEditor').remove();
    }
    window.location.hash = '';
    sessionStorage.setItem('inEditor', 'false');
    this.workspaceService.toggleWarning();
  }
}
