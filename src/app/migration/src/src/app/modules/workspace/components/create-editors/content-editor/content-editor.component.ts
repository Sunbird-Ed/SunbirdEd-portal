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

public contentId: string;

public state: string;
  /**
    * reference of UserService service.
    */
  /**
  * user profile details.
  */
  userService: UserService;

  constructor(
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    config: ConfigService,
    userService: UserService
  ) {
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

          }
      });
      this.activatedRoute.params.subscribe((params) => {

        this.contentId = params['contentId'];
        this.state = params['state'];
  
      });
      this.getContentData();
this.initfn();
    // this.showLoader = true;

  }


  ngAfterViewInit() {
    $.fn.iziModal = iziModal;
    setTimeout(function () {
      $('#contentEditor').iziModal('open');
    }, 100);
    $('#contentEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/assets/editors/content-editor/index.html',

      navigateArrows: false,
      fullscreen: true,
      openFullscreen: true,
      closeOnEscape: false,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      onClosed: function () {
        this.openModel();
      }
    });
  }

  openContentEditor() {
   

      window.context = {
        user: {
          id: this.userProfile.userId,
          name: this.userProfile.firstName + ' ' +  this.userProfile.lastName,
        },
        sid: '23423423423423424',
        contentId: this.contentId,
        pdata: {
          id: org.sunbird.portal.appid,
          ver: '1.0'
        },
        etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
        channel: org.sunbird.portal.channel
      };



      window.config = {
        baseURL: '',
        modalId: 'contentEditor',
        apislug: '/action',
        alertOnUnload: true,
        headerLogo: '',
        aws_s3_urls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-' +
                      org.sunbird.portal.ekstep_env + '/', 'https://ekstep-public-' +
                      org.sunbird.portal.ekstep_env + '.s3-ap-south-1.amazonaws.com/'],
        plugins: [
          {
            id: 'org.ekstep.sunbirdcommonheader',
            ver: '1.1',
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

  //
  // tslint:disable-next-line:member-ordering


  checkContentAccess (reqData, validateData) {
    const status = reqData.status;
    const createdBy = reqData.createdBy;
    const state = reqData.state;
    const userId = reqData.userId;
    const validateDataStatus = validateData.status;
    if (reqData.mimeType === validateData.mimeType) {
      const isStatus = _.indexOf(validateDataStatus, status) > -1;
      const isState = _.indexOf(validateData.state, state) > -1;
      if (isStatus && isState && createdBy !== userId) {
        return true;
      } else if (isStatus && isState && createdBy === userId) {
        return true;
      } else if (isStatus && createdBy === userId) {
        return true;
      }
      return false;
    }
    return false;
  }

  getContentData () {
    const state = null;
    const req = { contentId: this.contentId };
    const qs = { fields: 'createdBy,status,mimeType', mode: 'edit' };

    const validateModal  = {
      'state': ['UpForReviewContent', 'ReviewContent', 'PublishedContent', 'LimitedPublishedContent'],
       'status': ['Review', 'Draft', 'Live', 'Unlisted'],
      //  'mimeType': this.config.CreateLessonMimeType
      'minmeType': 'application/vnd.ekstep.ecml-archive'

     };

    this.editorService.getById(req, qs).subscribe((response) => {

      if (response && response.responseCode === 'OK') {
        const rspData = response.result.content;
        rspData.state = state;
        rspData.userId = this.userProfile.userId;

        // if (this.checkContentAccess(rspData, validateModal)) {
        //   this.openContentEditor();
        // } else {
        //   this.toasterService.error(this.resourceService.messages.emsg.m0004);
        //  this.router.navigate(['home']);
        // }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0004);
        this.router.navigate(['home']);
      }
    });
  }

  initfn () {
    org.sunbird.portal.eventManager.addEventListener('sunbird:portal:editor:close',
      function () {
        if (this.state) {
          this.router.navigate([this.state]);
        } else {
          this.router.navigate(['draft']);
        }
      });

    org.sunbird.portal.eventManager.addEventListener('sunbird:portal:content:review',
            function (event, data) {
              if (this.state) {
                this.router.navigate([this.state]);
              } else {
                this.router.navigate(['draft']);
              }
            });



    window.addEventListener('editor:metadata:edit', (event) => {
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:editmeta');
    });

    window.addEventListener('editor:window:close', (event) => {
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:close');
    });

    window.addEventListener('editor:content:review', (event) => {
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:content:review',
        this.contentId);
    });
  }




  openModel() {

  }

}
