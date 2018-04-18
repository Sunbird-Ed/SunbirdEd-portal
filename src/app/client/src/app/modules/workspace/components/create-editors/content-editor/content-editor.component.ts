import { CustomWindow } from './../../../interfaces';
import { Component, OnInit, AfterViewInit, NgZone, Renderer2, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as  iziModal from 'izimodal/js/iziModal';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { UserService, PermissionService } from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorService } from './../../../services/editors/editor.service';


declare var jQuery: any;
declare let window: CustomWindow;

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.css']
})

/**
 * Component Launches the Content Editor in a IFrame Modal
 */
export class ContentEditorComponent implements OnInit, AfterViewInit {

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
   * Content id for editor
   */
  public contentId: string;
  /**
   * state of the content
   */
  public state: string;
  /**
   * reference of UserService service.
   */
  userService: UserService;

  public showModal: boolean;

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
    private renderer: Renderer2
  ) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.config = config;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
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
    });

    this.renderer.listen('window', 'editor:metadata:edit', () => {
      this.closeModal();
    });

    this.renderer.listen('window', 'editor:window:close', () => {
      this.closeModal();
    });

    this.renderer.listen( 'window' , 'editor:content:review', () => {
      this.closeModal();
    });
  }


  ngAfterViewInit() {
     /**
     * Launch the generic editor after window load
     */
    const self = this;
    jQuery.fn.iziModal = iziModal;
    jQuery('#contentEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/thirdparty/editors/content-editor/index.html',

      navigateArrows: false,
      fullscreen: true,
      openFullscreen: true,
      closeOnEscape: false,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      onClosing: function () {
        self._zone.run(() => {
          self.closeModal();
        });
      }
    });
    this.getContentData();
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
        ver: '1.0'
      },
      etags: { app: [], partner: [], dims: this.userService.dims },
      framework: 'NCF',
      channel: this.userProfile.rootOrgId
    };


/**
 * Window config
 */
    window.config = {
      baseURL: '',
      modalId: 'contentEditor',
      apislug: '/action',
      alertOnUnload: true,
      headerLogo: '',
      aws_s3_urls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-' +
        this.userService.env + '/', 'https://ekstep-public-' +
        this.userService.env + '.s3-ap-south-1.amazonaws.com/'],
      plugins: [
        {
          id: 'org.ekstep.sunbirdcommonheader',
          ver: '1.2',
          type: 'plugin'
        },
        {
          id: 'org.ekstep.sunbirdmetadata',
          ver: '1.0',
          type: 'plugin'
        },
        {
          id: 'org.ekstep.metadata',
          ver: '1.0',
          type: 'plugin'
        }
      ],
      dispatcher: 'local',
      localDispatcherEndpoint: '/content-editor/telemetry',
      showHelp: false,
      previewConfig: {
        repos: ['/content-plugins/renderer'],
        plugins: [{
          id: 'org.sunbird.player.endpage',
          ver: 1.0,
          type: 'plugin'
        }],
        showEndPage: false
      }
    };
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
    const state = 'UpForReviewContent';
    const req = { contentId: this.contentId };
    const qs = { fields: 'createdBy,status,mimeType', mode: 'edit' };
    const validateModal = {
      'state': this.config.appConfig.EDITOR_CONFIG.contentState,
      'status': this.config.appConfig.EDITOR_CONFIG.contentStatus,
      'mimeType': this.config.appConfig.CONTENT_CONST.CREATE_LESSON
    };
    this.editorService.getById(req, qs).subscribe((response) => {
      if (response && response.responseCode === 'OK') {
        const rspData = response.result.content;
        rspData.state = state;
        rspData.userId = this.userProfile.userId;

        if (this.checkContentAccess(rspData, validateModal)) {
          this.openContentEditor();
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0004);
        }
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
     this.navigateToDraft();
    }, 1000);
  }

navigateToDraft() {
  if (document.getElementById('contentEditor')) {
    document.getElementById('contentEditor').remove();
   }
   this.router.navigate(['workspace/content/draft/1']);
   this.showModal = false;
  }
}
