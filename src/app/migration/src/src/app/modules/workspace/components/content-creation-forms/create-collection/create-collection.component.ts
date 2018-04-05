import { UserService } from '@sunbird/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { Router } from '@angular/router';
import { EditorService } from './../../../services';


@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})

/**
 * Component to create collection editor id
 * * */
export class CreateCollectionComponent implements OnInit {

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
   * Contains config service reference
   */
  public config: ConfigService;
  /**
   * To make inbox API calls
   */
  private editorService: EditorService;

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
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
         this.userProfile = user.userProfile;
        }
      });
    this.showLoader = false;
    this.userForm = this.formBuilder.group({
      name: '',
      description: ''
    });
  }


/**
 * requestBody is returned of type object
 */
generateData() {
  this.showLoader = true;

  const requestBody = {
    name: this.userForm.value.name ? this.userForm.value.name : 'Untitled Collection',
    description: this.userForm.value.description,
    creator: this.userProfile.firstName + ' ' + this.userProfile.lastName,
    createdBy: this.userProfile.id,
    organisation: [],
    createdFor: this.userProfile.organisationIds,
    mimeType: this.config.urlConFig.URLS.CONTENT_COLLECTION,
    contentType: 'Collection'
  };

  return requestBody;
}


  /***
   *   Create colletion creates the content Id and navigate
   * */
  createCollection() {
   const requestData = {
      content: this.generateData()
    };
    this.editorService.create(requestData).subscribe(res => {
      this.showLoader = false;
      const type = 'CollectionEditor';
      const state = '';
      const framework = 'framework';
      this.router.navigate(['/workspace/content/edit/collection', res.result.content_id, type, state, framework]);
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });

  }

/****
 * Redirects to workspace create section
 */
  goToCreate() {
    this.router.navigate(['/workspace/content/create']);
  }
}
