import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { Router } from '@angular/router';
import { EditorService } from './../../../services';

@Component({
  selector: 'app-create-study-material',
  templateUrl: './create-study-material.component.html',
  styleUrls: ['./create-study-material.component.css']
})
export class CreateStudyMaterialComponent implements OnInit {
  /**
	 * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
	 */
  showLoader = true;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
   * To call resource service which helps to use language constant
   */
  public userService: UserService;
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
  /**
   * userProfile is of type userprofile interface
   */
  public userProfile: any;

  public userForm: FormGroup;
  public formBuilder: FormBuilder;

  // public medium: Array<any> = [];

  constructor(public modalService: SuiModalService,
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    private router: Router,
    userService: UserService,
    formBuilder: FormBuilder,
    config: ConfigService
  ) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.userService = userService;
    this.formBuilder = formBuilder;
    this.config = config;
  }

  ngOnInit() {
    /***
     * Call User service to get user data
     */
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.showLoader = false;
    const medium = ['KAR', 'TN', 'AP'];
    const subjects = this.config.dropDownConfig.COMMON.subjects;
    // this.grades = this.config.dropDownConfig.COMMON.grades;
    // this.medium = this.config.dropDownConfig.COMMON.medium;
    // this.boards = this.config.dropDownConfig.COMMON.boards;
    // this.resourceType = this.config.dropDownConfig.COMMON.resourceType;
    // this.mimetype = this.config.dropDownConfig.CONTENT_CONST.CreateLessonMimeType;
    this.userForm = this.formBuilder.group({
      name: '',
      boards: '',
      medium: '',
      subject: '',
      gradeLevel: '',
      resourceType: ''
    });

  }


  /**
   * Call GenerateData() to get requestBody data
   */
  generateData() {
    // const mimetype = this.config.dropDownConfig.CONTENT_CONST.CreateLessonMimeType;
    const mimetype = 'application/vnd.ekstep.ecml-archive';
    const requestBody = {
      createdBy: this.userProfile.userId,
      createdFor: this.userProfile.organisationIds,
      mimeType: mimetype,
      creator: this.userProfile.firstName + ' ' + this.userProfile.lastName,

      // gradeLevel: ['Grade 5'],

      name: this.userProfile.name ? this.userProfile.name : 'Untitled lesson',
      contentType: this.userProfile.contentType ? this.userProfile.contentType : 'Resource',
      // if ( {this.userProfile.language} === true ) {
      // language: [this.userProfile.language],
      // }
      organization: []
    };
    return requestBody;


  }

  // Create colletion crates the content Id
  createContent() {

    const state = 'state';
    const requestData = {
      content: this.generateData()
    };

    this.showLoader = true;
    // this.loader = toasterService.loader('', $rootScope.messages.stmsg.m0016)
    this.editorService.create(requestData).subscribe(res => {
      console.log('res of createcontent', res);

      if (res && res.responseCode === 'OK') {
        console.log('Response res', res);

        console.log('content id in ', res.result.content_id);

        this.router.navigate(['/workspace/content/edit/contentEditor/', res.result.content_id, state]);
      } else {
        console.log('error');
        this.toasterService.error(this.resourceService.messages.emsg.m0010);
      }
    }, err => {
      console.log('error');
      this.toasterService.error(this.resourceService.messages.emsg.m0010);
    });


  }

  goToCreate() {
    this.router.navigate(['/workspace/content/create']);
  }
}
