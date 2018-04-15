import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui/dist';

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
  /**
   * userProfile is of type userprofile interface
   */
  public userProfile: IUserProfile;
/**
 * userForm name creation
 */
  public userForm: FormGroup;
  /***
   * Contains reference of FormBuilder
   */
  public formBuilder: FormBuilder;
/**
 * Form field boards
 */
  public boards: Array<any> = [];
/**
 * Form field grades
 */
  public grades: Array<any> = [];
/**
 * Form field medium
 */
  public medium: Array<any> = [];
/**
 * Form field resourceType
 */
  public resourceType: Array<any> = [];
/**
 * Form field subjects
 */
  public subjects: Array<any> = [];
 /**
   * Default method of classs CreateCollectionComponent
   *
   * @param {ResourceService} resourceService To get language constant
   * @param {EditorService} editorService To provide the api services
   * @param {ConfigService} config Reference of ConfigService
   * @param {UserService} userService Reference of userService
   * @param {Router} router for the navigation
   */

  constructor(
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
    this.showLoader = true;
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });

    this.subjects = this.config.dropDownConfig.COMMON.subjects;
    this.grades = this.config.dropDownConfig.COMMON.grades;
    this.medium = this.config.dropDownConfig.COMMON.medium;
    this.boards = this.config.dropDownConfig.COMMON.boards;
    this.resourceType = this.config.dropDownConfig.COMMON.resourceType;
    const mimetype = this.config.appConfig.CONTENT_CONST.CREATE_LESSON;
    this.userForm = this.formBuilder.group({
      name: '',
      boards: '',
      medium: '',
      subjects: '',
      gradeLevel: '',
      resourceType: ''
    });
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
    }
  }


  /**
   * Call GenerateData() to get requestBody data
   */
  generateData() {
    const mimetype = this.config.appConfig.CONTENT_CONST.CREATE_LESSON;
    const contentType = 'Resource';
    const requestBody = {
      createdBy: this.userProfile.userId,
      createdFor: this.userProfile.organisationIds,
      mimeType: mimetype,
      creator: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      name: this.userForm.value.name ? this.userForm.value.name : 'Untitled lesson',
      contentType: contentType,
      organization: []
    };
    return requestBody;
  }

  /**
  *  Create colletion creates the content Id
  */
  createContent() {
    const state = 'Draft';
    const requestData = {
      content: this.generateData()
    };
    this.editorService.create(requestData).subscribe(res => {
      this.showLoader = true;
        this.router.navigate(['/workspace/content/edit/contentEditor/', res.result.content_id, state]);
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0010);
    });
  }

  /****
   * Redirects to workspace create section
   */
  goToCreate() {
    this.router.navigate(['/workspace/content/create']);
  }
}
