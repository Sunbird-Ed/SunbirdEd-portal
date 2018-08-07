import { Component, OnInit, AfterViewInit, NgZone, Renderer2, OnDestroy, ChangeDetectorRef} from '@angular/core';
import * as _ from 'lodash';
import * as iziModal from 'izimodal/js/iziModal';
import {
  NavigationHelperService, ResourceService, ConfigService, ToasterService, ServerResponse,
  IUserData, IUserProfile
} from '@sunbird/shared';
import { UserService, PermissionService, TenantService } from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorService } from './../../../services/editors/editor.service';
import { environment } from '@sunbird/environment';
import { WorkSpaceService } from '../../../services';

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.css']
})

/**
 * Component Launches the Content Editor in a IFrame Modal
 */
export class ContentEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
    * To call resource service which helps to use language constant
    */
  public resourceService: ResourceService;
  /**
   * To make inbox API calls
   */
  private editorService: EditorService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * user profile details.
   */
  public userProfile: IUserProfile;

  /**
   * user tenant details.
   */
  public tenantService: TenantService;
  /**
   * Content id for editor
   */
  public contentId: string;
  /**
   * state of the content
   */
  public state: string;
  /**
  * type for editor
  */
  public type: string;
  /**
  * framework value of editor
  */
  public framework: string;
  /**
   * reference of UserService service.
   */
  userService: UserService;

  public showModal: boolean;

  private buildNumber: string;

  public logo: string;
  public listener;

  /**
  * Default method of classs ContentEditorComponent
  *
  * @param {ResourceService} resourceService To get language constant
  * @param {EditorService} editorService To provide the api services
  * @param {ConfigService} config Reference of ConfigService
  * @param {UserService} userService Reference of userService
  * @param {Router} route for the navigation
  * @param {ActivatedRoute} activatedRoute for getting params
  *  @param {NgZone} _zone for angular function inside jQuery
  */
  constructor(
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    config: ConfigService,
    userService: UserService, public _zone: NgZone,
    private renderer: Renderer2,
    tenantService: TenantService,
    public navigationHelperService: NavigationHelperService, public workspaceService: WorkSpaceService
  ) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.config = config;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.tenantService = tenantService;
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
      this.type = params['type'];
      this.framework = params['framework'];
    });
    sessionStorage.setItem('inEditor', 'true');
    window.location.hash = 'no';
    this.workspaceService.toggleWarning(this.type);
    this.setRenderer();
  }
  setRenderer() {
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


  ngAfterViewInit() {
    /**
    * Fetch header logo and launch the content editor after window load
    */
    jQuery.fn.iziModal = iziModal;
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
    this.tenantService.tenantData$.subscribe((data) => {
      if (data && !data.err) {
        this.logo = data.tenantData.logo;
        this.getContentData();
      } else if (data && data.err) {
        this.getContentData();
      }
    });
  }

  ngOnDestroy() {
    this.setRenderer();
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
    }
    sessionStorage.setItem('inEditor', 'false');
    this.workspaceService.toggleWarning();
  }
  /**
   * Launch the content editor in Iframe Modal window
   */
  openContentEditor() {
    jQuery('#contentEditor').iziModal('open');
    window.context = {
      user: {
        id: this.userProfile.userId,
        name: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      },
      sid: this.userService.sessionId,
      contentId: this.contentId,
      pdata: {
        id: this.userService.appId,
        ver: '1.0',
        pid: 'sunbird-portal'
      },
      tags: this.userService.dims,
      channel: this.userProfile.rootOrgId,
      framework: this.framework,
    };


    /**
     * Window config
     */
    window.config = {
      baseURL: '',
      modalId: 'contentEditor',
      apislug: '/action',
      alertOnUnload: true,
      build_number: this.buildNumber,
      headerLogo: this.logo,
      aws_s3_urls: this.userService.cloudStorageUrls || [],
      plugins: [
        {
          id: 'org.ekstep.sunbirdcommonheader',
          ver: '1.4',
          type: 'plugin'
        },
        {
          id: 'org.ekstep.sunbirdmetadata',
          ver: '1.1',
          type: 'plugin'
        },
        {
          id: 'org.ekstep.metadata',
          ver: '1.1',
          type: 'plugin'
        },
        {
          id: 'org.ekstep.questionset',
          ver: '1.0',
          type: 'plugin'
        }
      ],
      dispatcher: 'local',
      localDispatcherEndpoint: '/content-editor/telemetry',
      showHelp: false,
      previewConfig: {
        repos: ['/sunbird-plugins/renderer'],
        plugins: [{
          id: 'org.sunbird.player.endpage',
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
      },
      pluginsRepoUrl: '/plugins/v1/search'
    };
    window.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
  }

  /**
   * Checking the permission using state, status and userId
   * @param reqData user, state, status validation
   * @param validateData default data in the Object ValidateData
   */
  checkContentAccess(reqData, validateData) {
    const status = reqData.status;
    const createdBy = reqData.createdBy;
    const state = reqData.state;
    const userId = reqData.userId;
    const validateDataStatus = validateData.status;
    if (reqData.mimeType === validateData.mimeType) {
      const isStatus = _.indexOf(validateDataStatus, status) > -1;
      const isState = _.indexOf(validateData.state, state) > -1;
      if (isStatus && isState && createdBy !== this.userProfile.userId) {
        return true;
      } else if (isStatus && isState && createdBy === this.userProfile.userId) {
        return true;
      } else if (isStatus && createdBy === this.userProfile.userId) {
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * Check the Access and Launch the content Editor
   */
  getContentData() {
    const state = this.state;
    const req = { contentId: this.contentId };
    const qs = { fields: 'createdBy,status,mimeType', mode: 'edit' };
    const validateModal = {
      'state': this.config.editorConfig.EDITOR_CONFIG.contentState,
      'status': this.config.editorConfig.EDITOR_CONFIG.contentStatus,
      'mimeType': this.config.appConfig.CONTENT_CONST.CREATE_LESSON
    };
    this.editorService.getById(req, qs).subscribe((response) => {
      const rspData = response.result.content;
      rspData.state = state;
      rspData.userId = this.userProfile.userId;

      if (this.checkContentAccess(rspData, validateModal)) {
        this.openContentEditor();
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0004);
      }
    }
    );
  }
  /**
   * Re directed to the draft on close of modal
   */
  closeModal() {
    this.showModal = true;
    setTimeout(() => {
      this.navigateToWorkSpace();
    }, 1000);
  }

  navigateToWorkSpace() {
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
    }
    this.navigationHelperService.navigateToWorkSpace('/workspace/content/draft/1');
    this.showModal = false;
  }
}
