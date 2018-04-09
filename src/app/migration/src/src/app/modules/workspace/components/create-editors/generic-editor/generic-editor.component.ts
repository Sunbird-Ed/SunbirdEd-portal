import { IUserProfile } from './../../../../shared/interfaces/userProfile';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as  iziModal from 'izimodal/js/iziModal';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData } from '@sunbird/shared';
import { UserService, PermissionService } from '@sunbird/core';
import { Router } from '@angular/router';
import { CustomWindow } from './../../../interfaces/custom.window';
import { EditorService } from './../../../services/editors/editor.service';

declare var jQuery: any;

declare let window: CustomWindow;
declare let org: any;
declare let sunbird: any;


@Component({
  selector: 'app-generic-editor',
  templateUrl: './generic-editor.component.html',
  styleUrls: ['./generic-editor.component.css']
})
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

  public userProfile: IUserProfile;

  constructor( userService: UserService) {
    this.userService = userService;
   }

  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
         console.log(' user profile s', this.userProfile);

         }
     });
  }

  ngAfterViewInit() {
    this.callModal();
  }
  callModal() {

    jQuery.fn.iziModal = iziModal;
    setTimeout(function () {
      jQuery('#genericEditor').iziModal('open');
    }, 100);

    jQuery('#genericEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/assets/editors/generic-editor/index.html',

      navigateArrows: false,
      fullscreen: true,
      openFullscreen: true,
      closeOnEscape: true,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      closeButton: true,
    appendTo: 'body', // or false
    appendToOverlay: 'body',

    onResize: function(modal) { console.log(modal.onResize); },
    onOpening: function(modal) {console.log(modal.onOpening); },
    onOpened: function(modal) {console.log(modal.onOpened); },
    onClosing: function(modal) {console.log('closing'); this.openModel(); },

    afterRender: function() {},
      onFullscreen: function (modal) {
        console.log(modal.isFullscreen);
    },
      onClosed: function () {
        console.log('closed called');
        this.openModel();
      }

    });



    window.context = {
      user: {
        id: this.userProfile.userId,
        name: this.userProfile.firstName + ' ' +  this.userProfile.lastName,
        orgIds: this.userProfile.organisationIds
      },
      // sid: $rootScope.sessionId,
      // contentId: this.contentId,
      pdata: {
        id: org.sunbird.portal.appid,
        ver: '1.0'
      },
      etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
      channel: org.sunbird.portal.channel,
      env: 'genericeditor'
    };


    window.config = {
      corePluginsPackaged: true,
      modalId: 'genericEditor',
      dispatcher: 'local',
      apislug: '/action',
      alertOnUnload: true,
      headerLogo:  '',
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
  openModel() {

 console.log('close called in generic');
    setTimeout(() => {
     if (document.getElementById('genericEditor')) {
       document.getElementById('genericEditor').remove();
     }
     if (document.getElementById('modalGenericEditor')) {
       document.getElementById('modalGenericEditor').remove();
     }

 }, 0);
  }
}
