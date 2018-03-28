
import { collectionData } from './../../interfaces/collectionData';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService, ToasterService, ServerResponse } from '@sunbird/shared';
import { EditorService } from './../../services/editor/editor.service';
import { Router } from '@angular/router'
// import { UserService } from '@sunbird/core';

const fields = {
  mimeType: 'application/vnd.ekstep.content-collection',
  contentType: 'Collection'
}

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})

export class CreateCollectionComponent implements OnInit {

  showCreateCollectionModel: boolean;
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
  public resourceService: ResourceService;
  /**
   * To make inbox API calls
   */
  private editorService: EditorService;
  public collection = new collectionData('test', 'desc');
 
  constructor(public modalService: SuiModalService, 
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    private router: Router
  ) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
  }

  ngOnInit() {
    this.showLoader = true;
  }
  public requestBody: any;
  // submitted = false;
  saveMetaData(collection) {
    // this.submitted = true;
   
    this.requestBody = collection;
    this.requestBody.name = this.requestBody.name ? this.requestBody.name : "Untitled Collection"
    this.requestBody = { ...this.collection, ...fields }
   
    var requestData = {
      content: this.requestBody
    }
    console.log("collection create", requestData);
    this.createCollection(requestData)
  }

  public showEditor: boolean;
  public contentId: any;
  createCollection(requestData) {
    this.showLoader = true;
    // this.loader = toasterService.loader('', $rootScope.messages.stmsg.m0016)
    this.editorService.create(requestData).subscribe(res => {
     
      
      if (res && res.responseCode === 'OK') {
        this.isCollectionCreated = true
        // this.showCreateCollectionModel = true
        
        this.showLoader = false
        // collection.hideCreateCollectionModel()
        this.contentId = res.result.content_id;
        console.log("content id in ",  this.contentId);
        this.showEditor = true;
        this.showLoader = false;
        this.showCreateCollectionModel = true;
        this.initEKStepCE(res.result.content_id)
      } else {
        console.log("error");
        this.showLoader = false
        this.toasterService.error(this.resourceService.messages.emsg.m0010);        
      }
    }, err => {
      console.log("error");
      this.showLoader = false
      this.toasterService.error(this.resourceService.messages.emsg.m0010);
    });

  }
  public state: string;
  initEKStepCE(id) {    
 this.state = "CollectionEditor";
    // let navigationExtras: NavigationExtras = {
    //  params: { 'contentId': this.contentId, 'state': 'CollectionEditor' }      
    // };

    this.router.navigate(['/collection/editor', this.contentId, this.state]);


  }

}

