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
  selector: 'app-collection-editor',
  templateUrl: './collection-editor.component.html',
  styleUrls: ['./collection-editor.component.css']
})



export class CollectionEditorComponent implements OnInit, AfterViewInit {
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
public type: string;
public modelId: any;
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
     userService: UserService) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.activatedRoute = activatedRoute;
    this.userService = userService;


    // console.log("console",this.userService);


    }

  // @Input('contentId') contentId: string;
  // @Input('requestBody') context: any;



  ngOnInit() {
    console.log('collection editor');

        /***
     * Call User service to get user data
     */

    this.userService.userData$.subscribe(
      (user: IUserData) => {
          if (user && !user.err) {
            this.userProfile = user.userProfile;
            console.log(' user profile s', this.userProfile);
            this.requestBody = this.userProfile;
            console.log('requestBody\'s', this.requestBody);



            this.context = {
              name : this.requestBody.firstName + ' ' + this.requestBody.lastName,
              desc: 'descr',
              userId: this.requestBody.userId,
              organisationIds : this.requestBody.organisationIds,
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
      this.type = params['type'];
      this.framework = params['framework'];

    });
     console.log('requestBody', this.context);
     console.log('contentId', this.contentId);
     console.log('state', this.state);
    // this.context = this.userProfile;
    // console.log("this.profile", this.userProfile);


  }
  ngAfterViewInit() {
    const urlParams = {
      contentId: this.contentId,
      state: this.state,
      framework: this.framework,
      type: this.type,
      context: this.context
    };
     console.log('urlParams', urlParams);
    this.openCollectionEditor(urlParams);
  }


  openCollectionEditor(urlParams) {

    // Initialise imported function as jQuery function
    this.showLoader = false;
    $.fn.iziModal = iziModal;
    $('#collectionEditor').iziModal({
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


    window.context = {
      user: {
        id: this.context.userId,
        name: this.context.name
      },
      // sid: this.context.sessionId,
      sid: 'JwdwhKL6j_4-c3INzsMqA2g7NOoxXAAI',
      contentId: this.contentId,
      pdata: {
        id: org.sunbird.portal.appid,
        ver: '1.0'
      },
      etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
      channel: org.sunbird.portal.channel,
      framework: this.framework,
      env: this.context.contentType.toLowerCase()

    };

    window.config = {
      corePluginsPackaged: true,
      modalId: 'collectionEditor',
      dispatcher: 'local',
      apislug: '/action',
      alertOnUnload: true,
      // headerLogo: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
      headerLogo: '',
      loadingImage: '',
      plugins: [{
        id: 'org.ekstep.sunbirdcommonheader',
        ver: '1.1',
        type: 'plugin'
      },
      {
        id: 'org.ekstep.lessonbrowser',
        ver: '1.3',
        type: 'plugin'
      }],
      localDispatcherEndpoint: '/collection-editor/telemetry',
      editorConfig: {
        mode: 'Edit',
        contentStatus: 'draft',
        rules: {
          levels: 7,
          objectTypes: this.getTreeNodes(this.context.contentType)
        },
        defaultTemplate: {}
      },
      previewConfig: {
        repos: ['/content-plugins/renderer'],
        plugins: [{
          id: 'org.sunbird.player.endpage',
          ver: 1.0,
          type: 'plugin'
        }],
        showEndPage: false
      },
      editorType: this.context.contentType
    };
    if (this.context.contentType.toLowerCase() === 'textbook') {
      window.config.plugins.push({
        id: 'org.ekstep.suggestcontent',
        ver: '1.0',
        type: 'plugin'
      });
    }
    window.config.editorConfig.publishMode = false;
    window.config.editorConfig.isFalgReviewer = false;
    if (this.state === 'WorkSpace.UpForReviewContent' &&
      _.intersection(this.context.userRoles,
        ['CONTENT_REVIEWER', 'CONTENT_REVIEW']).length > 0) {
      window.config.editorConfig.publishMode = true;
      console.log('role assign', window.config.editorConfig.publishMode);
    } else if (this.state === 'WorkSpace.FlaggedContent' &&
      _.intersection(this.context.userRoles,
        ['FLAG_REVIEWER']).length > 0) {
      window.config.editorConfig.isFalgReviewer = true;
    }
    $.fn.iziModal = iziModal;
    setTimeout(function () {
      $('#collectionEditor').iziModal('open');
    }, 100);

    const validateModal = {
      state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent',
        'WorkSpace.PublishedContent', 'WorkSpace.FlaggedContent', 'LimitedPublishedContent'],
      status: ['Review', 'Draft', 'Live', 'Flagged', 'Unlisted'],
      mimeType: 'application/vnd.ekstep.content-collection'
    };

    const req = { contentId: this.contentId };
    const qs = { fields: 'userId,status,mimeType', mode: 'edit' };
    if (this.state === 'WorkSpace.FlaggedContent') {
      delete qs.mode;
    }

    this.editorService.getById(req, qs).subscribe(response => {
      console.log('resp', response);
      if (response && response.responseCode === 'OK') {
        const rspData = response.result.content;
        rspData.state = 'CreateCollection';
        rspData.userId = this.context.userId;

        if (this.validateRequest(rspData, validateModal)) {
          console.log('status of', response.result.content.status);
          this.updateModeAndStatus(response.result.content.status);

          setTimeout(function () {
            $('#collectionEditor').iziModal('open');
          }, 100);
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0004);
          this.router.navigate(['collection']);
        }
      }
    });
  }

  validateRequest(reqData, validateData) {
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


  getTreeNodes(type) {
    const editorConfig = [];
    switch (type) {
      case 'Course':
        editorConfig.push({
          type: 'Course',
          label: 'Course',
          isRoot: true,
          editable: true,
          childrenTypes: [
            'CourseUnit',
            'Collection',
            'Resource',
            'Story',
            'Worksheet'
          ],
          addType: 'Editor',
          iconClass: 'fa fa-book'
        },
          {
            type: 'CourseUnit',
            label: 'Course Unit',
            isRoot: false,
            editable: true,
            childrenTypes: [
              'CourseUnit',
              'Collection',
              'Resource'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-folder-o'
          },
          {
            type: 'Collection',
            label: 'Collection',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Resource',
            label: 'Resource',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Story',
            label: 'Story',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Worksheet',
            label: 'Worksheet',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          });
        return editorConfig;
      case 'Collection':
        editorConfig.push({
          type: 'Collection',
          label: 'Collection',
          isRoot: true,
          editable: true,
          childrenTypes: [
            'Collection',
            'Resource',
            'Story',
            'Worksheet'
          ],
          addType: 'Editor',
          iconClass: 'fa fa-folder-o'
        },
          {
            type: 'Collection',
            label: 'Collection',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Resource',
            label: 'Resource',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Story',
            label: 'Story',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Worksheet',
            label: 'Worksheet',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          });
        return editorConfig;
      case 'LessonPlan':
        editorConfig.push({
          type: 'LessonPlan',
          label: 'LessonPlan',
          isRoot: true,
          editable: true,
          childrenTypes: [
            'LessonPlanUnit',
            'Collection',
            'Resource',
            'Story',
            'Worksheet'
          ],
          addType: 'Editor',
          iconClass: 'fa fa-book'
        },
          {
            type: 'LessonPlanUnit',
            label: 'LessonPlan Unit',
            isRoot: false,
            editable: true,
            childrenTypes: [
              'LessonPlanUnit',
              'Collection',
              'Resource'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-folder-o'
          },
          {
            type: 'Collection',
            label: 'Collection',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Resource',
            label: 'Resource',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Story',
            label: 'Story',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Worksheet',
            label: 'Worksheet',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          });
        return editorConfig;
      default:

        editorConfig.push({
          type: 'TextBook',
          label: 'Textbook',
          isRoot: true,
          editable: true,
          childrenTypes: [
            'TextBookUnit',
            'Collection',
            'Resource',
            'Story',
            'Worksheet'
          ],
          addType: 'Editor',
          iconClass: 'fa fa-book'
        },
          {
            type: 'TextBookUnit',
            label: 'Textbook Unit',
            isRoot: false,
            editable: true,
            childrenTypes: [
              'TextBookUnit',
              'Collection',
              'Resource'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-folder-o'
          },
          {
            type: 'Collection',
            label: 'Collection',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Resource',
            label: 'Resource',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Story',
            label: 'Story',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Worksheet',
            label: 'Worksheet',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          });
        return editorConfig;
    }
  }

  updateModeAndStatus(status) {
    if (status.toLowerCase() === 'draft') {
      window.config.editorConfig.mode = 'Edit';
      window.config.editorConfig.contentStatus = 'draft';
    }
    if (status.toLowerCase() === 'review') {
      window.config.editorConfig.mode = 'Read';
      window.config.editorConfig.contentStatus = 'draft';
    }
    if (status.toLowerCase() === 'live') {
      window.config.editorConfig.mode = 'Edit';
      window.config.editorConfig.contentStatus = 'live';
    }
    if (status.toLowerCase() === 'flagged') {
      window.config.editorConfig.mode = 'Read';
      window.config.editorConfig.contentStatus = 'flagged';
    }
  }



  openModel() {
    this.showModal = true;
    $.fn.iziModal = iziModal;



    // if (this.urlParams.name === 'CollectionEditor') {
    //   var state = $('#collectionEditor').iziModal('getState')
    //   if (state === 'opened') {
    //     if (document.getElementById('collectionEditor')) {
    //       document.getElementById('collectionEditor').remove()
    //     }
    //   }
    // }
    // $('#modalCollectionEditor').modal('show')

    // setTimeout(function () {

    //   if (document.getElementById('collectionEditor')) {
    //     document.getElementById('collectionEditor').remove()
    //   }
    //   if (document.getElementById('modalCollectionEditor')) {
    //     document.getElementById('modalCollectionEditor').remove()
    //   }
    //   this.showModal = false
    //   console.log("this.urlParams.state", this.urlParams.state);
    //   if (this.urlParams.state) {

    //     this.route.navigate('collection');
    //   }
    //    else {
    //     this.route.navigate('collection');
    //     // this.route.navigate('draftContent');
    //   }
    // }, 2000)
  }

}
