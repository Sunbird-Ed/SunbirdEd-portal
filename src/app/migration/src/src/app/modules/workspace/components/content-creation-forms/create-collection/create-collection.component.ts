import { UserService } from '@sunbird/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { Router } from '@angular/router';
import { EditorService } from './../../../services';


@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})
export class CreateCollectionComponent implements OnInit {

  isCollectionCreated: boolean;

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
  public userProfile: IUserProfile;

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
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
         this.userProfile = user.userProfile;
          console.log(' user profile s', this.userProfile);
        }
      });
    this.showLoader = false;
    this.userForm = this.formBuilder.group({
      name: '',
      description: ''
    });
  }



  saveMetaData(userForm) {
    this.showLoader = true;
      const requestBody = {
      name: userForm.name ? userForm.name : 'Untitled Collection',
      description: userForm.description,
      creator: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      createdBy: this.userProfile.id,
      organisationIds: this.userProfile.organisationIds,
      createdFor: this.userProfile.organisationIds,
      userRoles: this.userProfile.userRoles,
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'Collection'
    };

    const requestData = {
      content: requestBody
    };
    this.createCollection(requestData);
  }


  createCollection(requestData) {
    this.editorService.create(requestData).subscribe(res => {
      this.isCollectionCreated = true;
      this.showLoader = false;
      const type = 'CollectionEditor';
      const state = '';
      const framework = 'framework';
      this.router.navigate(['/workspace/content/edit/collection', res.result.content_id, type, state, framework]);
    }, err => {
      console.log('error');
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });

  }


  goToCreate() {
    this.router.navigate(['/workspace/content/create']);
  }
}

