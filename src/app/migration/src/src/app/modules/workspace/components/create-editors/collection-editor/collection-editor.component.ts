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
        ver: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_VERSION
      },
      tags: [this.userService.dims],
      channel: this.userService.channel,
      framework: this.framework,
      env: this.type.toLowerCase()

    };
    /**
     * Assign the values to window config
     */
    window.config = {
      corePluginsPackaged: true,
      modalId: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.modalId,
      dispatcher: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.dispatcher,
      apislug: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.apislug,
      alertOnUnload: true,
      headerLogo: '',
      loadingImage: '',
      plugins: [{
        id: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.SB_COMMON_HEADER,
        ver: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_VERSION,
        type: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_TYPE
      },
      {
        id: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.LESSON_BROWSER,
        ver: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.LESSON_BROWSER_VERSION,
        type: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_TYPE
      }],
      localDispatcherEndpoint: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.localDispatcherEndpoint,
      editorConfig: {
        mode: this.config.appConfig.EDITOR_CONFIG.MODE,
        contentStatus: this.config.appConfig.EDITOR_CONFIG.DRAFT,
        rules: {
          levels: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.RULES_LEVEL,
          objectTypes: this.getTreeNodes(this.type)
        },
        defaultTemplate: {}
      },
      previewConfig: {
        repos: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.RENDERER_URL,
        plugins: [{
          id: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_ENDPAGE,
          ver: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_VERSION,
          type: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_TYPE
        }],
        showEndPage: false
      },
      editorType: this.type
    };

    if (this.type.toLowerCase() === 'textbook') {
      window.config.plugins.push({
        id: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.SUGGEST_CONTENT,
        ver: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_VERSION,
        type: this.config.appConfig.EDITOR_CONFIG.WINDOW_CONFIG.PLUGIN_TYPE
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
        const rspData = response.result.content;
        rspData.state = 'CreateCollection';
        rspData.userId = this.userProfile.userId;
        if (this.validateRequest(rspData, validateModal)) {
          this.updateModeAndStatus(response.result.content.status);
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0004);
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
    if (document.getElementById('collectionEditor')) {
      document.getElementById('collectionEditor').remove();
    }
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
      window.config.editorConfig.mode = this.config.appConfig.EDITOR_CONFIG.MODE;
      window.config.editorConfig.contentStatus = this.config.appConfig.EDITOR_CONFIG.DRAFT;
    }
    if (status.toLowerCase() === 'review') {
      window.config.editorConfig.mode = this.config.appConfig.EDITOR_CONFIG.READ;
      window.config.editorConfig.contentStatus = this.config.appConfig.EDITOR_CONFIG.DRAFT;
    }
    if (status.toLowerCase() === 'live') {
      window.config.editorConfig.mode = this.config.appConfig.EDITOR_CONFIG.MODE;
      window.config.editorConfig.contentStatus = this.config.appConfig.EDITOR_CONFIG.LIVE;
    }
    if (status.toLowerCase() === 'flagged') {
      window.config.editorConfig.mode = this.config.appConfig.EDITOR_CONFIG.READ;
      window.config.editorConfig.contentStatus = this.config.appConfig.EDITOR_CONFIG.FLAGGED;
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
          type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COURSE,
          label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COURSE,
          isRoot: true,
          editable: true,
          childrenTypes: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.CHILDREN_TYPE,
          addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.EDITOR,
          iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_BOOK
        },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COURSE_TYPE,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COURSE_LABEL,
            isRoot: false,
            editable: true,
            childrenTypes: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.CU_CHILDREN_TYPE,
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.EDITOR,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FOLDER
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.RESOURCE,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.RESOURCE,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.STORY,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.STORY,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.WORKSHEET,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.WORKSHEET,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          });
        return editorConfig;
      case 'Collection':
        editorConfig.push({
          type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
          label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
          isRoot: true,
          editable: true,
          childrenTypes: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLL_CHILDREN_TYPE,
          addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.EDITOR,
          iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
        },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.RESOURCE,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.RESOURCE,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.STORY,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.STORY,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.WORKSHEET,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.WORKSHEET,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          });
        return editorConfig;
      case 'LessonPlan':
        editorConfig.push({
          type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.LESSON_PLAN,
          label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.LESSON_PLAN,
          isRoot: true,
          editable: true,
          childrenTypes: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.LP_CHILDREN_TYPE,
          addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.EDITOR,
          iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_BOOK
        },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.LESSON_PLAN_UNIT_TYPE,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.LESSON_PLAN_UNIT_LABEL,
            isRoot: false,
            editable: true,
            childrenTypes: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.LPUNIT_CHILDREN_TYPE,
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.EDITOR,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FOLDER
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.RESOURCE,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.RESOURCE,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.STORY,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.STORY,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.WORKSHEET,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.WORKSHEET,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          });
        return editorConfig;
      default:

        editorConfig.push({
          type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.TEXTBOOK,
          label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.TEXTBOOK,
          isRoot: true,
          editable: true,
          childrenTypes: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.TB_CHILDREN_TYPE,
          addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.EDITOR,
          iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_BOOK
        },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.TB_UNIT_TYPE,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.TB_UNIT_LABEL,
            isRoot: false,
            editable: true,
            childrenTypes: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.TBUNIT_CHILDREN_TYPE,
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.EDITOR,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FOLDER
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.COLLECTION,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.RESOURCE,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.RESOURCE,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.STORY,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.STORY,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType:  this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          },
          {
            type: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.WORKSHEET,
            label: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.WORKSHEET,
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType:  this.config.appConfig.EDITOR_CONFIG.TREE_NODE.BROWSER,
            iconClass: this.config.appConfig.EDITOR_CONFIG.TREE_NODE.ICON_CLASS_FILE_O
          });
        return editorConfig;
    }
  }
}
