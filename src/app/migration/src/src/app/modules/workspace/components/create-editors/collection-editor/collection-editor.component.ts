import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as  iziModal from 'izimodal/js/iziModal';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomWindow } from './../../../interfaces';
import { EditorService } from './../../../services';
declare var jQuery: any;
declare let window: CustomWindow;


@Component({
  selector: 'app-collection-editor',
  templateUrl: './collection-editor.component.html',
  styleUrls: ['./collection-editor.component.css']
})


/**
 * Component Launches the collection Editor in a IFrame Modal
 */
export class CollectionEditorComponent implements OnInit, AfterViewInit {
  /**
 * To navigate to other pages
 */
  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to create component
  */
  private activatedRoute: ActivatedRoute;
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
  public userProfile: IUserProfile;
  /**
  * contentId for editor
  */
  public contentId: string;
  /**
  * state for editor
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
  /**
   * Show Modal for loader
   */
  public showModal: boolean;
  /**
  * Default method of classs CollectionEditorComponent
  *
  * @param {ResourceService} resourceService To get language constant
  * @param {EditorService} editorService To provide the api services
  * @param {ConfigService} config Reference of ConfigService
  * @param {UserService} userService Reference of userService
  * @param {Router} route for the navigation
  * @param {ActivatedRoute} activatedRoute for getting params
  */
  constructor(resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    activatedRoute: ActivatedRoute,
    route: Router,
    userService: UserService, public _zone: NgZone,
    config: ConfigService) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.route = route;
    this.editorService = editorService;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
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
    /**
   * Subscribe acrivated route to read params data
   */
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params['contentId'];
      this.type = params['type'];
      this.framework = params['framework'];
    });
  }

  ngAfterViewInit() {
    /**
     * Create the collection editor
     */
    this.openCollectionEditor();
  }

  /**
   * Modal is launched in iframe for Collection Editor
   */
  openCollectionEditor() {
    jQuery.fn.iziModal = iziModal;
    const self = this;
    jQuery('#collectionEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/thirdparty/editors/collection-editor/index.html',
      navigateArrows: false,
      fullscreen: false,
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

    /**
     * Assign the values to window context
     */
    window.context = {
      user: {
        id: this.userService.userid,
        name: this.userProfile.firstName + ' ' + this.userProfile.lastName
      },
      sid: this.userService.sessionId,
      contentId: this.contentId,
      pdata: {
        id: this.userService.appId,
        ver: '1.0'
      },
      etags: { app: [], partner: [], dims: this.userService.dims },
      channel: this.userService.channel,
      framework: this.framework,
      env: this.type.toLowerCase()

    };
    /**
     * Assign the values to window config
     */
    window.config = {
      corePluginsPackaged: true,
      modalId: 'collectionEditor',
      dispatcher: 'local',
      apislug: '/action',
      alertOnUnload: true,
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
          objectTypes: this.getTreeNodes(this.type)
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
      editorType: this.type
    };

    if (this.type.toLowerCase() === 'textbook') {
      window.config.plugins.push({
        id: 'org.ekstep.suggestcontent',
        ver: '1.0',
        type: 'plugin'
      });
    }
    window.config.editorConfig.publishMode = false;
    window.config.editorConfig.isFalgReviewer = false;
    if (this.state === 'UpForReviewContent' &&
      _.intersection(this.userProfile.userRoles,
        ['CONTENT_REVIEWER', 'CONTENT_REVIEW']).length > 0) {
      window.config.editorConfig.publishMode = true;
    } else if (this.state === 'FlaggedContent' &&
      _.intersection(this.userProfile.userRoles,
        ['FLAG_REVIEWER']).length > 0) {
      window.config.editorConfig.isFalgReviewer = true;
    }
    setTimeout(function () {
      jQuery('#collectionEditor').iziModal('open');
    }, 100);

    const validateModal = {
      state: this.config.appConfig.EDITOR_CONFIG.collectionState,
      status: this.config.appConfig.EDITOR_CONFIG.collectionStatus,
      mimeType: this.config.appConfig.EDITOR_CONFIG.mimeCollection
    };

    const req = { contentId: this.contentId };
    const qs = { fields: this.config.appConfig.EDITOR_CONFIG.editorQS, mode: this.config.appConfig.EDITOR_CONFIG.MODE };
    if (this.state === 'FlaggedContent') {
      delete qs.mode;
    }
    /**
     * Call API to launch the Collection Editor in the modal
     */
    this.editorService.getById(req, qs).subscribe(response => {
      if (response && response.responseCode === 'OK') {
        const rspData = response.result.content;
        rspData.state = 'CreateCollection';
        rspData.userId = this.userProfile.userId;
        if (this.validateRequest(rspData, validateModal)) {
          this.updateModeAndStatus(response.result.content.status);
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0004);
        }
      }
    });
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
    // if (document.getElementById('collectionEditor')) {
    //   document.getElementById('collectionEditor').remove();
    // }
    this.route.navigate(['workspace/content/draft/1']);
    this.showModal = false;
  }


  /**
   *Validate the request
   * @param reqData user, state, status validation
   * @param validateData default data in the Object ValidateData
   */
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

  /**
 * Update status and mode to the window
 * @param status to check status and assign to the window config
 */
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
  /**
   * to assign the value to Editor Config
   * @param type of the content created
   */
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
}
