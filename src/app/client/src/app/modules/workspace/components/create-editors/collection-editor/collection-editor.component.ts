
import { Component, OnInit, AfterViewInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as  iziModal from 'izimodal/js/iziModal';
import {
  NavigationHelperService, ResourceService, ConfigService, ToasterService, ServerResponse,
  IUserData, IUserProfile
} from '@sunbird/shared';
import { UserService, TenantService } from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorService, WorkSpaceService } from './../../../services';
import { state } from './../../../classes/state';
import { environment } from '@sunbird/environment';

@Component({
  selector: 'app-collection-editor',
  templateUrl: './collection-editor.component.html',
  styleUrls: ['./collection-editor.component.css']
})


/**
 * Component Launches the collection Editor in a IFrame Modal
 */
export class CollectionEditorComponent implements OnInit, AfterViewInit, OnDestroy {
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
   * user tenant details.
   */
  public tenantService: TenantService;

  private buildNumber: string;
  public logo: string;
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
    userService: UserService,
    public _zone: NgZone,
    config: ConfigService,
    tenantService: TenantService,
    public navigationHelperService: NavigationHelperService, public workspaceService: WorkSpaceService) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.route = route;
    this.editorService = editorService;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.config = config;
    this.tenantService = tenantService;
    // buildNumber
    try {
      this.buildNumber = (<HTMLInputElement>document.getElementById('buildNumber')).value;
    } catch (error) {
      this.buildNumber = '1.0';
    }
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
      this.state = params['state'];
      this.type = params['type'];
      this.framework = params['framework'];
    });
    sessionStorage.setItem('inEditor', 'true');
    window.location.hash = 'no';
    this.workspaceService.toggleWarning(this.type);
  }

  ngAfterViewInit() {
    /**
     * Create the collection editor
     */
    this.tenantService.tenantData$.subscribe((data) => {
      if (data && !data.err) {
        this.logo = data.tenantData.logo;
        this.openCollectionEditor();
      } else if (data && data.err) {
        this.openCollectionEditor();
      }
    });
  }

  /**
   * Modal is launched in iframe for Collection Editor
   */
  openCollectionEditor() {
    jQuery.fn.iziModal = iziModal;
    jQuery('#collectionEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL: '/thirdparty/editors/collection-editor/index.html?' + this.buildNumber,
      navigateArrows: false,
      fullscreen: false,
      openFullscreen: true,
      closeOnEscape: false,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      onClosing: () => {
        this._zone.run(() => {
          this.closeModal();
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
        ver: '1.0',
        pid: 'sunbird-portal'
      },
      tags: this.userService.dims,
      channel: this.userService.channel,
      framework: this.framework,
      env: this.type.toLowerCase()

    };
    /**
     * Assign the values to window config
     */
    const editorWindowConfig = this.config.editorConfig.EDITOR_CONFIG.COLLECTION_WINDOW_CONFIG;
    const dynamicConfig = window.config = {
      editorConfig: {
        rules: {
          levels: 7,
          objectTypes: this.getTreeNodes(this.type)
        }
      }
    };

    window.config = { ...editorWindowConfig, ...dynamicConfig };
    window.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
    window.config.headerLogo = this.logo;
    window.config.build_number = this.buildNumber;

    if (this.type.toLowerCase() === 'textbook') {
      window.config.plugins.push({
        id: 'org.ekstep.suggestcontent',
        ver: '1.0',
        type: 'plugin'
      });
      window.config.nodeDisplayCriteria = {
        contentType: ['TextBookUnit']
      };
    } else if (this.type.toLowerCase() === 'course') {
      window.config.nodeDisplayCriteria = {
        contentType: ['CourseUnit']
      };
    } else if (this.type.toLowerCase() === 'lessonplan') {
      window.config.nodeDisplayCriteria = {
        contentType: ['LessonPlanUnit']
      };
    } else {
      window.config.nodeDisplayCriteria = {
        contentType: ['Collection']
      };
    }

    window.config.editorConfig.publishMode = false;
    window.config.editorConfig.isFlagReviewer = false;

    if (this.state === state.UP_FOR_REVIEW &&
      _.intersection(this.userProfile.userRoles,
        ['CONTENT_REVIEWER', 'CONTENT_REVIEW', 'BOOK_REVIEWER']).length > 0) {
      window.config.editorConfig.publishMode = true;
    } else if (this.state === state.FLAGGED &&
      _.intersection(this.userProfile.userRoles,
        ['FLAG_REVIEWER']).length > 0) {
      window.config.editorConfig.isFlagReviewer = true;
    } else if (this.state === state.FLAG_REVIEW &&
      _.intersection(this.userProfile.userRoles,
        ['FLAG_REVIEWER']).length > 0) {
      window.config.editorConfig.isFlagReviewer = true;
    }
    setTimeout(() => {
      jQuery('#collectionEditor').iziModal('open');
    }, 100);

    const validateModal = {
      state: this.config.editorConfig.EDITOR_CONFIG.collectionState,
      status: this.config.editorConfig.EDITOR_CONFIG.collectionStatus,
      mimeType: this.config.editorConfig.EDITOR_CONFIG.mimeCollection
    };

    const req = { contentId: this.contentId };
    const qs = { fields: this.config.editorConfig.EDITOR_CONFIG.editorQS, mode: this.config.editorConfig.EDITOR_CONFIG.MODE };
    if (this.state === state.FLAGGED) {
      delete qs.mode;
    }
    /**
     * Call API to launch the Collection Editor in the modal
     */
    this.editorService.getById(req, qs).subscribe(response => {
      const rspData = response.result.content;
      rspData.state = this.state;
      rspData.userId = this.userProfile.userId;
      if (this.validateRequest(rspData, validateModal)) {
        this.updateModeAndStatus(response.result.content.status);
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0004);
      }
    },
      error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0004);
      }
    );
  }


  /**
   * Re directed to the draft on close of modal
   */
  closeModal() {
    this.showModal = true;
    setTimeout(() => {
      this.navigateToWorkSpace();
    }, 1000);
  }
  navigateToWorkSpace() {
    if (document.getElementById('collectionEditor')) {
      document.getElementById('collectionEditor').remove();
    }
    this.navigationHelperService.navigateToWorkSpace('/workspace/content/draft/1');
    this.showModal = false;
  }

  ngOnDestroy() {
    window.location.hash = '';
    if (document.getElementById('collectionEditor')) {
      document.getElementById('collectionEditor').remove();
    }
    sessionStorage.setItem('inEditor', 'false');
    this.workspaceService.toggleWarning();
  }
  /**
   *Validate the request
   * @param reqData user, state, status validation
   * @param validateData default data in the Object ValidateData
   */
  validateRequest(reqData, validateData) {
    const status = reqData.status;
    const createdBy = reqData.createdBy;
    const reqState = reqData.state;
    const userId = reqData.userId;
    const validateDataStatus = validateData.status;
    if (reqData.mimeType === validateData.mimeType) {
      const isStatus = _.indexOf(validateDataStatus, status) > -1;
      const isState = _.indexOf(validateData.state, reqState) > -1;
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

    if (status.toLowerCase() === 'flagdraft') {
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
    if (status.toLowerCase() === 'unlisted') {
      window.config.editorConfig.mode = 'Edit';
    }
    if (status.toLowerCase() === 'flagreview') {
      window.config.editorConfig.mode = 'Read';
      window.config.editorConfig.contentStatus = 'flagged';
    }
  }


  /**
   * to assign the value to Editor Config
   * @param type of the content created
   */
  getTreeNodes(type) {
    switch (type) {
      case 'Course':
        return this.config.editorConfig.EDITOR_CONFIG.COURSE_ARRAY;
      case 'Collection':
        return this.config.editorConfig.EDITOR_CONFIG.COLLECTION_ARRAY;
      case 'LessonPlan':
        return this.config.editorConfig.EDITOR_CONFIG.LESSON_PLAN;
      default:
        return this.config.editorConfig.EDITOR_CONFIG.DEFAULT_CONFIG;
    }
  }
}
