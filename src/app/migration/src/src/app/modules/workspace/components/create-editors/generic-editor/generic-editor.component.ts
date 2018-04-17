import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import * as  iziModal from 'izimodal/js/iziModal';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomWindow } from './../../../interfaces/custom.window';
import { EditorService } from './../../../services/editors/editor.service';

declare var jQuery: any;
declare let window: CustomWindow;

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
  * To get url, app configs
  */
  public config: ConfigService;
  /**
   * To make inbox API calls
   */
  private editorService: EditorService;
  /**
  * user profile details.
  */
  userService: UserService;
  /**
   * Id of the content created
   */
  public contentId: string;
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
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;

  constructor(userService: UserService, router: Router, public _zone: NgZone,
    activatedRoute: ActivatedRoute, config: ConfigService) {
    this.userService = userService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.config = config;
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
    });
  }

  ngAfterViewInit() {
    /**
     * Launch the generic editor after window load
     */
    this.openGenericEditor();
  }
  /**
   *Launch Genreic Editor in the modal
   */
  openGenericEditor() {
    jQuery.fn.iziModal = iziModal;
    const self = this;

    jQuery('#genericEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/thirdparty/editors/generic-editor/index.html',
      navigateArrows: false,
      fullscreen: true,
      openFullscreen: true,
      closeOnEscape: true,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      closeButton: true,
      onClosing: function () {
        self._zone.run(() => {
          self.closeModal();
        });
      }
    });

    setTimeout(function () {
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
        ver: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_VERSION,
      },
      tags: [this.userService.dims ],
      channel: this.userService.channel,
      env: this.config.appConfig.EDITOR_CONFIG.GENERICEDITOR
    };

    /**
     * Assign the values to window config
     */
    window.config = {
      corePluginsPackaged: true,
      modalId: 'genericEditor',
      dispatcher: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.dispatcher,
      apislug: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.apislug,
      alertOnUnload: true,
      headerLogo: '',
      loadingImage: '',
      plugins: [{
        id: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.SB_COMMON_HEADER,
        ver: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_VERSION,
        type: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_TYPE
      }],
      previewConfig: {
        'repos': this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.RENDERER_URL,
        plugins: [{
          'id': this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_ENDPAGE,
          ver: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_VERSION,
          type: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_TYPE
        }],
        showEndPage: false
      }

    };
  }
  /**
  * Re directed to the workspace on close of modal
  */
  closeModal() {
    this.showModal = true;
    setTimeout(() => {
      this.navigateToCreate();
    }, 1000);
  }

  navigateToCreate() {
    this.router.navigate(['workspace/content']);
    this.showModal = false;
  }

/**
 * On componenet destroy remove the genericEditor id from DOM
 */
  ngOnDestroy() {
    if (document.getElementById('genericEditor')) {
      document.getElementById('genericEditor').remove();
    }
  }
}
