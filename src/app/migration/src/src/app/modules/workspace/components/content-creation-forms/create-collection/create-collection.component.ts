
import { UserService } from '@sunbird/core';
import { FormsModule } from '@angular/forms';

import { collectionDataInterface } from './../../../interfaces/collection.data.interface';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Router } from '@angular/router';
import { EditorService } from './../../../services/editor.service';


import { UserData } from './../../../../shared/interfaces/IUserProfile';


// const fields = {
//   mimeType: 'application/vnd.ekstep.content-collection',
//   contentType: 'Collection'
// };

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
  showModal = true;
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
  public state: string;
  public type: string;
  public framework: string;
  public showEditor: boolean;
  public contentId: any;
  public requestBody: any;
  public userProfile: any;


  public collection = new collectionDataInterface('', '');
  constructor(public modalService: SuiModalService,
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    private router: Router,
    userService: UserService
  ) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.userService = userService;
  }

  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: UserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          console.log(' user profile s', this.userProfile);
        }
  });
  }



  saveMetaData(collection) {
    this.showLoader = true;
    this.requestBody = collection;
    this.requestBody = {
     name : this.requestBody.name ? this.requestBody.name : 'Untitled Collection',
      creator: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      createdBy: this.userProfile.id,
      organisationIds: this.userProfile.organisationIds,
      createdFor: this.userProfile.organisationIds,
      userRoles: this.userProfile.userRoles,
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'Collection'
    };

    const requestData = {
      content: this.requestBody
    };
    this.createCollection(requestData);
  }


  createCollection(requestData) {
      this.editorService.create(requestData).subscribe(res => {
      if (res && res.responseCode === 'OK') {
        this.isCollectionCreated = true;
        this.showLoader = false;

        this.contentId = res.result.content_id;
        console.log('content id ', this.contentId);
        this.showEditor = true;
        this.showLoader = false;
        // this.showCreateCollectionModel = true;
        this.initEKStepCE(res.result.content_id);
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

  initEKStepCE(id) {
    this.type = 'CollectionEditor';
    this.state = '';
    this.framework = 'frmwork';
    this.router.navigate(['/workspace/content/edit/collection', this.contentId, this.type, this.state, this.framework]);
  }

   goToCreate() {
      this.router.navigate(['/workspace/content/create']);
  }
  }

