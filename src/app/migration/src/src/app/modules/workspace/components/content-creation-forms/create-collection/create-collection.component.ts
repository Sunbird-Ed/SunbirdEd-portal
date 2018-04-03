
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
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
   * To make inbox API calls
   */
  private editorService: EditorService;

  /**
   * userProfile is of type userprofile interface
   */
  public userProfile: any;

  public userForm: FormGroup;
  public formBuilder: FormBuilder;

  constructor(public modalService: SuiModalService,
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    private router: Router,
    userService: UserService,
    formBuilder: FormBuilder
  ) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.userService = userService;
    this.formBuilder = formBuilder;
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
 * Call GenerateData() to get requestBody data
 */
  generateData() {
    this.showLoader = true;
      const requestBody = {
      name: this.userForm.value.name ? this.userForm.value.name : 'Untitled Collection',
      description: this.userForm.value.description,
      creator: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      createdBy: this.userProfile.id,
      organisationIds: this.userProfile.organisationIds,
      createdFor: this.userProfile.organisationIds,
      userRoles: this.userProfile.userRoles,
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'Collection'
    };
    return requestBody;
  }

// Create colletion crates the content Id
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
      this.toasterService.error(this.resourceService.messages.fmsg.m0010);
    });

  }


  goToCreate() {
    this.router.navigate(['/workspace/content/create']);
  }
}
