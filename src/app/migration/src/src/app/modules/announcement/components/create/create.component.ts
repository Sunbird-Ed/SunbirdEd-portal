/// <reference types="fine-uploader" />
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ResourceService, FileUploadService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeoExplorerComponent } from './../geo-explorer/geo-explorer.component';
import { CreateService } from './../../services/create/create.service';
import { UserService} from '@sunbird/core';
import { GeoLocationDetails } from './../../interfaces';

// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, AfterViewInit {
  /**
   * Reference of Geo explorer component
   */
  @ViewChild(GeoExplorerComponent) geoExplorer: GeoExplorerComponent;

  /**
   * Announcement creation form name
   */
  announcementForm: FormGroup;

  /**
   * Contains reference of FormBuilder
   */
  sbFormBuilder: FormBuilder;

  /**
   * Contains wizard number
   */
  stepNumber: 1;

  /**
   * Contains announcement identifier
   */
  identifier: string;

  /**
   * Contains announcement types
   */
  announcementTypes: any;

  /**
   * Contains announcement recipients list
   */
  recipientsList: Array<GeoLocationDetails>;

  /**
   * It contains uploaded file(s) details
   */
  attachments: Array<object>;

  /**
   * Contains resource service ref
   */
  public resource: ResourceService;

  /**
   * Contains file uplaod service reference
   */
  public fileUpload: FileUploadService;

  /**
   * To get url params
   */
  public activatedRoute: ActivatedRoute;

  /**
   * Router to change url
   */
  public route: Router;

  /**
   * To show messages
   */
  public iziToast: ToasterService;

  /**
   * Contains reference of announcement create service
   */
  public createService: CreateService;

  /**
   * Default method of classs CreateComponent
   *
   * @param {ResourceService} resource To get language constant
   * @param {FileUploadService} fileUpload To upload file
   */
  constructor(resource: ResourceService, fileUpload: FileUploadService, activatedRoute: ActivatedRoute, route: Router,
    iziToast: ToasterService, formBuilder: FormBuilder, createService: CreateService, private user: UserService) {
      this.stepNumber = 1;
    this.resource = resource;
    this.fileUpload = fileUpload;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.iziToast = iziToast;
    this.sbFormBuilder = formBuilder;
    this.createService = createService;
    this.recipientsList = [];
    this.getAnnouncementTypes();
  }

  getRootOrgId(): void {
    this.user.userData$.subscribe(
      user => {
        if (user && user.userProfile && user.userProfile.getRootOrgId) {
          this.createService._rootOrgId = user.userProfile.getRootOrgId;
          this.getAnnouncementTypes();
        } else {
        }
      },
      err => {
      }
    );
  }

  getAnnouncementTypes(): void {
    if (this.createService._announcementTypes) {
      this.announcementTypes = this.createService._announcementTypes;
    } else {
      this.createService.getAnnouncementTypes().
        subscribe((data: ServerResponse) => {
          if (data.result.announcementTypes) {
            this.announcementTypes = data.result.announcementTypes;
          }
        },
        (err: ServerResponse) => {
          this.announcementTypes = err;
        }
      );
    }
  }

  addNewLink(): void {
    const arrayControl = <FormArray>this.announcementForm.controls['links'];
    arrayControl.push(this.sbFormBuilder.group({ url: '' }));
  }

  removeLink(index: number): void {
    const links = <FormArray>this.announcementForm.controls['links'];
    links.removeAt(index);
  }

  confirmRecipients(): void {
    this.recipientsList = this.geoExplorer.selectedItems;
    if (this.recipientsList && this.recipientsList.length) {
      this.route.navigate(['announcement/create', 3]);
    } else {
      this.iziToast.warning(this.resource.messages.emsg.m0006);
    }
  }

  removeRecipient(item: GeoLocationDetails): void {
    _.remove(this.recipientsList, (recipient) => {
      if (recipient.id === item.id) {
        item.selected = false;
        this.iziToast.info(item.location + ' ' + this.resource.messages.imsg.m0020);
        return recipient.location;
      }
    });

    if (this.recipientsList.length === 0) {
      this.route.navigate(['announcement/create', 2]);
    }
  }

  enableRecipientsBtn() {
    const data = this.announcementForm.value;
    if (data.title && data.from && data.type) {
      if (data.links.length || data.description || this.attachments.length) {
        console.log('All required fields are filled');
      } else {
        console.log('All required fields are filled');
      }
    } else {
      console.log('All required fields are filled');
    }
  }

  selectRecipients(): void {
    // TODO: add validation check here
    this.route.navigate(['announcement/create', 2]);
  }

  /**
   * Function to go previous step
   */
  previousStep(): void {
    const step = this.stepNumber - 1;
    this.route.navigate(['announcement/create', step]);
  }

  /**
   * Check user has filled all required form fields
   */
  validateFormState(step: number): void {
    const data = this.announcementForm.value;
    if (data.title && data.from && data.type) {
      if (data.links.length || data.description) {
        console.log('previous all steps are good');
      } else {
        this.route.navigate(['announcement/create', 1]);
      }
    } else {
      this.route.navigate(['announcement/create', 1]);
    }
  }

  ngAfterViewInit() {
    const options = {
      containerName: 'attachments/announcement',
      fileSizeErrorText: 'this.resource.messages.emsg.m0007',
      onCancel: this.onFileUploadCancel,
      uploadSuccess: this.onFileUploadSuccess
    };

    this.fileUpload.initilizeFileUploader(options);
  }

  onFileUploadCancel(id: number, name: string): void {
    const data = this.attachments.splice(id, 1);
    if (data.length === 0) {
      _.forEach(this.attachments, function(value, key) {
        if (value.name === name) {
          this.attachments.splice(key, 1);
        }
      });
    }

    this.enableRecipientsBtn();
  }

  /**
   * Function gets executed when file gets uploaded
   */
  onFileUploadSuccess(fileDetails: any): void {
    console.log('uploadDetails', fileDetails.size);
    this.attachments.push(fileDetails);
  }

  /**
   * Angular life cycle hook
   */
  ngOnInit(): void {
    this.announcementForm = this.sbFormBuilder.group({
      title: ['', Validators.maxLength(100) ],
      from: ['', null],
      type: ['', null],
      description: ['', Validators.maxLength(1200)],
      links: this.sbFormBuilder.array([])
    });
    this.activatedRoute.params.subscribe(params => {
      if (params.stepNumber) {
        this.stepNumber = params.stepNumber;
        this.validateFormState(params.stepNumber);
      }
    });
  }
}
