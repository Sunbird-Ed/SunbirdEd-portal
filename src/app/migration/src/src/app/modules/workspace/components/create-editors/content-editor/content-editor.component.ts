import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as  iziModal from 'izimodal/js/iziModal';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData } from '@sunbird/shared';
import { UserService, PermissionService} from '@sunbird/core';
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
  public framework: any;
  public userDetails: any;
  public urlParams: any;
  public showLoader: boolean;
  public contentId: string;
  public context: any;
  public userSubscription: any;
  public userProfile: any;
  public requestBody: any;
  public showModal: boolean;
  public state: string;

  public modelId: any;
  public mimetype: string;
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

    this.mimetype = this.config.dropDownConfig.CONTENT_CONST.CreateLessonMimeType;
    // console.log("console",this.userService);


  }


  ngOnInit() {
    this.userService.userData$.subscribe(
       ( user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          console.log(' user profile s', this.userProfile);
          this.requestBody = this.userProfile;
          console.log('requestBody\'s', this.requestBody);



          this.context = {
            name: this.requestBody.firstName + ' ' + this.requestBody.lastName,
            desc: 'descr',
            userId: this.requestBody.userId,
            organisationIds: this.requestBody.organisationIds,
            createdFor: this.requestBody.organisationIds,
            userRoles: this.requestBody.userRoles,
            mimeType: 'application/vnd.ekstep.content-collection',
            contentType: 'Collection',
            sessionId: '4535345345345345'
          };
          console.log('requestBody\'s userID', this.context.userId);
        }
      });


    this.showLoader = true;
    this.activatedRoute.params.subscribe((params) => {

      this.contentId = params['contentId'];
      this.state = params['state'];

    });
    console.log('requestBody', this.context);
    console.log('contentId', this.contentId);
    console.log('state', this.state);

  }
  ngAfterViewInit() {
   this.urlParams = {
      contentId: this.contentId,
      state: this.state,
      framework: 'framewor',
      type: 'Content',
      context: this.context
    };
    console.log('urlParams', this.urlParams);
    this.openContentEditor(this.urlParams);
  }

  openContentEditor(urlParams) {
    // $('#contentEditor').iziModal('open')
    // window.context = {
    //   user: {
    //     id: $rootScope.userId,
    //     name: $rootScope.firstName + ' ' + $rootScope.lastName
    //   },
    //   sid: $rootScope.sessionId,
    //   contentId: contentEditor.contentId,
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
    //   headerLogo: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
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






    $('#contentEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/assets/editors/content-editor/index.html',
      navigateArrows: false,
      fullscreen: false,
      openFullscreen: true,
      closeOnEscape: false,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      onClosed: function () {
        // contentEditor.openModel()
      }
    });
  }

  //    let validateModal = {
  //     state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent',
  //       'WorkSpace.PublishedContent', 'LimitedPublishedContent'],
  //     status: ['Review', 'Draft', 'Live', 'Unlisted'],
  //     mimeType: this.config.dropDownConfig.CONTENT_CONST.CreateLessonMimeType
  //   };

 

  //   getContentData (); {
  //     var req = { contentId: this.contentId };
  //     var qs = { fields: 'createdBy,status,mimeType', mode: 'edit' };

  //     this.editorService.getById(req, qs).subscribe(response => {
  //       console.log('resp', response);
  //       if (response && response.responseCode === 'OK') {
  //         var rspData = response.result.content;
  //         rspData.state = 'CreateContent';
  //         rspData.userId = this.context.userId;
  
  //         if (this.checkContentAccess(rspData, validateModal)) {
  //           console.log('status of', response.result.content.status);
  //           this.openContentEditor();
  //         }
  //         else{
  //           this.toasterService.error(this.resourceService.messages.emsg.m0004);
  //           this.router.navigate(['content']);
  //         } 
  //       } else {
  //           this.toasterService.error(this.resourceService.messages.emsg.m0004);
  //           this.router.navigate(['content']);
  //         }
        
  //     });




  //   }
 
  // checkContentAccess (reqData, validateData); {
  //   var status = reqData.status;
  //   var createdBy = reqData.createdBy;
  //   var state = reqData.state;
  //   var userId = reqData.userId;
  //   var validateDataStatus = validateData.status;
  //   if (reqData.mimeType === validateData.mimeType) {
  //     var isStatus = _.indexOf(validateDataStatus, status) > -1;
  //     var isState = _.indexOf(validateData.state, state) > -1;
  //     if (isStatus && isState && createdBy !== userId) {
  //       return true;
  //     } else if (isStatus && isState && createdBy === userId) {
  //       return true;
  //     } else if (isStatus && createdBy === userId) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   return false;
  // }
  //   init();{
  //     org.sunbird.portal.eventManager.addEventListener('sunbird:portal:editor:close',
  //       function () {
  //         if ($stateParams.state) {
  //           $state.go($stateParams.state);
  //         } else {
  //           $state.go('WorkSpace.DraftContent');
  //         }
  //       });

  //     org.sunbird.portal.eventManager.addEventListener('sunbird:portal:content:review',
  //       function (event, data) { //eslint-disable-line
  //         if ($stateParams.state) {
  //           $state.go($stateParams.state);
  //         } else {
  //           $state.go('WorkSpace.DraftContent');
  //         }
  //       });

  //     window.addEventListener('editor:metadata:edit', function (event, data) {
  //       org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:editmeta');
  //     });

  //     window.addEventListener('editor:window:close', function (event, data) {
  //       org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:close');
  //     });

  //     window.addEventListener('editor:content:review', function (event, data) {
  //       org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:content:review',
  //         event.detail.contentId);
  //     });
  //   }
  // }

}