import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
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
export class GenericEditorComponent implements OnInit, AfterViewInit {

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
  * user profile details.
  */
  userService: UserService;

  public contentId: string;

  public userProfile: IUserProfile;

  /**
 * To navigate to other pages
 */
  private router: Router;

  public showModal: boolean;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;

  constructor(userService: UserService, router: Router, public _zone: NgZone,
    activatedRoute: ActivatedRoute) {
    this.userService = userService;
    this.router = router;
    this.activatedRoute = activatedRoute;
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
        ver: '1.0'
      },
      etags: { app: [], partner: [], dims: this.userService.dims },
      channel: this.userService.channel,
      env: 'genericeditor'
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
      headerLogo: '',
      loadingImage: '',
      plugins: [{
        id: 'org.ekstep.sunbirdcommonheader',
        ver: '1.1',
        type: 'plugin'
      }],
      previewConfig: {
        'repos': ['/content-plugins/renderer'],
        plugins: [{
          'id': 'org.sunbird.player.endpage',
          ver: 1.0,
          type: 'plugin'
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
    if (document.getElementById('genericEditor')) {
      document.getElementById('genericEditor').remove();
    }
    this.router.navigate(['workspace/content']);
    this.showModal = false;
  }
}
