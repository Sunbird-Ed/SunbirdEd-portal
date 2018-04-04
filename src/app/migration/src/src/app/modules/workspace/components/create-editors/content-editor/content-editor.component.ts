import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as  iziModal from 'izimodal/js/iziModal';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData } from '@sunbird/shared';
import { UserService, PermissionService } from '@sunbird/core';
import { Router } from '@angular/router';
import { CustomWindow } from './../../../interfaces/custom.window';
import { EditorService } from './../../../services/editors/editor.service';

import { IappId, IPortal, IOrganizatioName, IOrganization } from './../../../interfaces/org.object';
import { ActivatedRoute } from '@angular/router';



declare let window: CustomWindow;

declare let org: any;
declare let sunbird: any;

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.css']
})
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

  public showLoader: boolean;

  public userProfile: any;



  /**
    * reference of UserService service.
    */
  /**
  * user profile details.
  */
  userService: UserService;

  constructor(resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    config: ConfigService,
    userService: UserService) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.config = config;
    this.activatedRoute = activatedRoute;
    this.userService = userService;

    const mimetype = this.config.dropDownConfig.CONTENT_CONST.CreateLessonMimeType;
    // console.log("console",this.userService);


  }


  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          console.log(' user profile s', this.userProfile);

          // this.context = {
          //   name:  this.userProfile.firstName + ' ' +  this.userProfile.lastName,
          //   desc: 'descr',
          //   userId: this.requestBody.userId,
          //   organisationIds: this.requestBody.organisationIds,
          //   createdFor: this.requestBody.organisationIds,
          //   userRoles: this.requestBody.userRoles,
          //   mimeType: 'application/vnd.ekstep.content-collection',
          //   contentType: 'Collection',
          //   sessionId: '4535345345345345'
          // };

        }
      });


    this.showLoader = true;

  }


  ngAfterViewInit() {
    console.log('izi before');
    $.fn.iziModal = iziModal;

    $('#contentEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/assets/editors/collection-editor/index.html',
      navigateArrows: false,
      fullscreen: true,
      openFullscreen: true,
      closeOnEscape: false,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      onClosed: function () {
        // this.openModel()
        alert('close called');
        $('#collectionEditor').iziModal('close');
      }
    });
    console.log('izi aafeter');
  }

  openContentEditor() {
    this.activatedRoute.params.subscribe((params) => {

      const contentId = params['contentId'];
      const state = params['state'];

      // $('#contentEditor').iziModal('open');

      // window.context = {
      //   user: {
      //     id: this.userProfile.userId,
      //     name: this.userProfile.firstName + ' ' +  this.userProfile.lastName,
      //   },
      //   sid: '23423423423423424',
      //   contentId: contentId,
      //   pdata: {
      //     id: org.sunbird.portal.appid,
      //     ver: '1.0'
      //   },
      //   etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
      //   channel: org.sunbird.portal.channel
      // };
      // window.config = {
      //   baseURL: '',
      //   modalId: 'contentEditor',
      //   apislug: '/action',
      //   alertOnUnload: true,
      //   // headerLogo: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
      //   aws_s3_urls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-' +
      //                 org.sunbird.portal.ekstep_env + '/', 'https://ekstep-public-' +
      //                 org.sunbird.portal.ekstep_env + '.s3-ap-south-1.amazonaws.com/'],
      //   plugins: [
      //     {
      //       id: 'org.ekstep.sunbirdcommonheader',
      //       ver: '1.1',
      //       type: 'plugin'
      //     }
      //   ],
      //   dispatcher: 'local',
      //   localDispatcherEndpoint: '/content-editor/telemetry',
      //   showHelp: false,
      //   previewConfig: {
      //     repos: ['/content-plugins/renderer'],
      //     plugins: [{
      //       id: 'org.sunbird.player.endpage',
      //       ver: 1.0,
      //       type: 'plugin'
      //     }],
      //     showEndPage: false
      //   }
      // };









    });
  }
}
