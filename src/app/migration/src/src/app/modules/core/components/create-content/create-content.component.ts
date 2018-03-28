import { contentData } from './../../interfaces/contentData';
import { UserData } from './../../../shared/interfaces/IUserProfile';
import { SuiModule } from 'ng2-semantic-ui';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService, ToasterService, ServerResponse } from '@sunbird/shared';
import { EditorService } from './../../services/editor/editor.service';
import { Router } from '@angular/router';
import { UserService } from './../../services';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.css']
})
export class CreateContentComponent implements OnInit {
  showCreateContentModel: boolean;
  showCreateContentModal: boolean;
  public dropdown: string;

  /**
	 * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
	 */
  public showLoader = true;
  /**
    * reference of config service.
    */
  public config: ConfigService;
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

  public content = new contentData('', '', '', '', '', '');
  public subjects: any;
  public grades: String[];
  public medium: any;
  public boards: any;
  public resourceType: any;
  public selectedGrades: String[] = [];
  public mimetype: string;
  public context: any;
  public userProfile: any;
  public requestBody: any;
  public data: any;
public contentId: string;
public state: string;
public showEditor: Boolean;

  constructor(
    public modalService: SuiModalService,
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    private router: Router,
    config: ConfigService,
    userService: UserService
  ) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.config = config;
    this.userService = userService;
    this.dropdown = this.config.dropDownConfig.COMMON;
    this.subjects = this.config.dropDownConfig.COMMON.subjects;
    this.grades = this.config.dropDownConfig.COMMON.grades;
    this.medium = this.config.dropDownConfig.COMMON.medium;
    this.boards = this.config.dropDownConfig.COMMON.boards;
    this.resourceType = this.config.dropDownConfig.COMMON.resourceType;
    this.mimetype = this.config.dropDownConfig.CONTENT_CONST.CreateLessonMimeType;
  }

  ngOnInit() {
    this.showLoader = false;
    // this.subjects = this.dropdown.subjects;
    // this.showCreateContentModal = false;
this.state = 'ContentEditor';
    this.userService.userData$.subscribe(
      (user: UserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.context = this.userProfile;

          this.data = {
            creator: this.context.firstName + ' ' + this.context.lastName,
            createdBy: this.context.userId,
            organisationIds: this.context.organisationIds,
            createdFor: this.context.organisationIds,
          };
        }
      });
  }


  saveMetaData(content) {

    this.requestBody = content;
    this.requestBody.createdBy = this.data.userId;
    this.requestBody.createdFor = this.data.organisationIds;
    this.requestBody.mimeType = this.mimetype;
    this.requestBody.creator = this.data.creator;

    this.requestBody.gradeLevel = ['Grade 5'];

    this.requestBody.name = this.requestBody.name ? this.requestBody.name : 'Untitled lesson';
    this.requestBody.contentType = this.requestBody.contentType ? this.requestBody.contentType : 'Resource';
    if (this.requestBody.language) {
      this.requestBody.language = [this.requestBody.language];
    }
this.requestBody.organization = [];
    const requestData = {
      content: this.requestBody
    };
    console.log('requestBody in save', this.requestBody);
    this.createContent(requestData);
  }


  createContent(requestData) {

    this.showLoader = true;
    // this.loader = toasterService.loader('', $rootScope.messages.stmsg.m0016)
    this.editorService.create(requestData).subscribe(res => {
     console.log('res of createcontent', res);

      if (res && res.responseCode === 'OK') {
        console.log('Response res', res);

        // // this.showCreateCollectionModel = true
        this.contentId = res.result.content_id;
        console.log('content id in ',  this.contentId);
        this.showLoader = false;
        // // collection.hideCreateCollectionModel()

        // this.showEditor = true;

        this.initEKStepCE(res.result.content_id);
        this.showCreateContentModal = true;

      } else {
        console.log('error');
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0010);
      }
    }, err => {
      console.log('error');
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0010);
    });
  }

  public initEKStepCE(contentId) {

    this.router.navigate(['/content/editor', this.contentId, this.state]);
this.showLoader = true;
  }
}
