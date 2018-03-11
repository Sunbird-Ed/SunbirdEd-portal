/// <reference types="fine-uploader" />
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ResourceService, FileUploadService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeoExplorerComponent } from './../geo-explorer/geo-explorer.component';
import { CreateService } from './../../services/create/create.service';
import { UserService } from '@sunbird/core';
import { GeoLocationDetails } from './../../interfaces';
import { IAnnouncementDetails, IAttachementType } from '@sunbird/announcement';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

/**
 * The announcement create component
 */
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {

  /**
   * Reference of Geo explorer component
   *
   * Geo component is responsible to render location list
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
  stepNumber: number;

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
   * Flag to disabled select recipients button
   *
   * Enforce user to fill at least one optional field
   */
  formErrorFlag = true;

  /**
   * Contains announcement form data
   */
  announcementDetails: IAnnouncementDetails;

  /**
   * It contains uploaded file(s) details
   */
  attachments: Array<IAttachementType>;

  /**
   * Flag to check user has entered / modified meta data
   */
  isMetaModified = false;

  /**
   * To show / hide modal
   */
  modalName = 'create';

  /**
   * Loader
   */
  showLoader = false;

  /*
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
   * To get user profile of logged-in user
   */
  public user: UserService;

  /**
   * Default method of classs CreateComponent
   *
   * @param {ResourceService} resource To get language constant
   * @param {FileUploadService} fileUpload To upload file
   */
  constructor(resource: ResourceService, fileUpload: FileUploadService, activatedRoute: ActivatedRoute, route: Router,
    iziToast: ToasterService, formBuilder: FormBuilder, createService: CreateService, user: UserService, private location: Location) {
    this.stepNumber = 1;
    this.resource = resource;
    this.fileUpload = fileUpload;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.iziToast = iziToast;
    this.sbFormBuilder = formBuilder;
    this.createService = createService;
    this.user = user;
  }

  /**
   * Get logged-in user root org id
   *
   * Root org id is needed to get announcement type(s) by making definition api call
   */
  getRootOrgId(): void {
    this.user.userData$.subscribe(
      user => {
        if (user && user.userProfile && user.userProfile.rootOrgId) {
          this.createService._rootOrgId = user.userProfile.rootOrgId;
          this.getAnnouncementTypes();
        } else {
        }
      },
      err => {
      }
    );
  }

  /**
   * Get announcement type by making http call
   *
   * Announcement type(s) are needed to create new annoucement.
   * Without type(s) user won't be able to create new announcement
   */
  getAnnouncementTypes(): void {
    if (this.createService._announcementTypes) {
      this.announcementTypes = this.createService._announcementTypes;
    } else {
      this.createService.getAnnouncementTypes().subscribe(
        (data: ServerResponse) => {
          if (data.result.announcementTypes) {
            this.announcementTypes = data.result.announcementTypes;
          }
        },
        (err: ServerResponse) => {
          this.iziToast.error(this.resource.messages.imsg.m0020);
        }
      );
    }
  }

  /**
   * Executed when user click on add new link icon while creating announcement
   *
   * Helps user to add more than one web url
   */
  addNewLink(data: string | ''): void {
    const arrayControl = <FormArray>this.announcementForm.controls['links'];
    arrayControl.push(this.sbFormBuilder.group({
      url: [data, Validators.pattern('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')]
    }));
  }

  /**
   * Executed when user click on delete icon
   *
   * @param {number} index index of current url
   */
  removeLink(index: number): void {
    const links = <FormArray>this.announcementForm.controls['links'];
    links.removeAt(index);
  }

  getNextStep(step) {
    if (this.identifier) {
      this.route.navigate(['announcement/resend', this.identifier, +step]);
    } else {
      this.route.navigate(['announcement/create', +step]);
    }
  }

  /**
   * Executed when user click on confirm recipients button
   *
   * It enforce user to select at least one location
   */
  confirmRecipients(): void {
    console.log('this.geoExplorer.selectedItems', this.geoExplorer.selectedItems);
    this.recipientsList = this.geoExplorer.selectedItems;
    if (this.recipientsList && this.recipientsList.length) {
      this.getNextStep(3);
    } else {
      this.iziToast.warning(this.resource.messages.emsg.m0006);
    }
  }

  /**
   * Executed when user click remove icon on confirm recipients page
   *
   * @param {GeoLocationDetails} item selected location details
   */
  removeRecipient(item: GeoLocationDetails): void {
    _.remove(this.recipientsList, (recipient) => {
      if (recipient.id === item.id) {
        item.selected = false;
        this.iziToast.info(item.location + ' ' + this.resource.messages.imsg.m0020);
        return recipient.location;
      }
    });

    if (this.recipientsList.length === 0) {
      this.getNextStep(2);
    }
  }

  /**
   * Executed when user click on preview announcement button
   *
   * It helps user to show announcement preview - after creating the announcement how it will look
   */
  previewAnnouncement(): void {
    const data = this.announcementForm.value;
    data.type = data.type.name;
    data.links = data.links.length ? _.map(data.links, 'url') : [];
    this.announcementDetails = data;
    this.announcementDetails.attachments = this.attachments;
    this.getNextStep(4);
  }

  /**
   * To enable select recipients button.
   *
   * Button gets enabled when all required fields and
   * at least one of 'Description' or 'URL / weblink' or 'Attachment' must be provided
   */
  enableRecipientsBtn(): boolean {
    const data = this.announcementForm ? this.announcementForm.value : '';
    if (data.title && data.from && data.type) {
      if (data.links.length || data.description || this.attachments && this.attachments.length) {
        return this.formErrorFlag = false;
      } else {
        return this.formErrorFlag = true;
      }
    } else {
      return this.formErrorFlag = true;
    }
  }

  /**
   * It gets executed when user directly hit the url.
   *
   * It navigates user to the first step if required fields data are not filled
   */
  validateFormState(): void {
    const data = this.announcementForm.value;
    if (data.title && data.from) {
      if (data.links.length || data.description || this.attachments && this.attachments.length) {
        console.log('All good. Load next step');
      } else {
        this.getNextStep(1);
      }
    } else {
      this.getNextStep(1);
    }
  }

  /**
   * Callback function gets called from FileUploadService when api returns success
   *
   * Its used to get uploaded file details - file name, size, mime type and url
   */
  onFileUploadSuccess = (attachmentDetails: IAttachementType): void => {
    this.attachments.push(attachmentDetails);
    this.enableRecipientsBtn();
  }

  /**
   * Callback function gets called from FileUploadService when user click on remove icon
   *
   * Used to remove uploaded file details from local variable
   */
  onFileUploadCancel = (fileDetail: { id: number, name: string }): void => {
    const data = this.attachments.splice(fileDetail.id, 1);
    if (data.length === 0) {
      _.forEach(this.attachments, function (value, key) {
        if (value.name === fileDetail.name) {
          this.attachments.splice(key, 1);
        }
      });
    }
    this.enableRecipientsBtn();
  }

  /**
   * Post announcement form data
   */
  saveAnnouncement() {
    const data = this.announcementForm.value;
    data.target = this.recipientsList;
    data.attachments = this.attachments;
    this.createService.saveAnnouncement(data, this.identifier ? true : false).
      subscribe(
        (res: ServerResponse) => {
          this.modalName = 'success';
        },
        (err: ServerResponse) => {
          this.formErrorFlag = false;
        }
      );
  }

  /**
   * Used to redirect user to outbox page.
   *
   * Function gets executed when user click close icon of announcement form
   */
  redirectToOutbox(): void {
    this.route.navigate(['announcement/outbox/1']);
  }

  /**
   * Function used to detect form input value changes.
   * Set meta data modified flag to true when user enter new value
   */
  onFormValueChanges(): void {
    this.announcementForm.valueChanges.subscribe(val => {
      this.isMetaModified = true;
      this.enableRecipientsBtn();
    });
  }

  /**
   * Executed when user come from any other page or directly hit the url
   *
   * It helps to initialize form fields and apply field level validation
   */
  initializeFormFields(formData): void {
    const data = formData ? formData : this.createService.getAnnouncementModel({});
    this.announcementForm = this.sbFormBuilder.group({
      title: [data.title, Validators.maxLength(100)],
      from: [data.from, null],
      type: [data.type, null],
      description: [data.description, Validators.maxLength(1200)],
      links: this.sbFormBuilder.array([])
    });
  }

  /**
   * Resend already created announcement.
   * Make announcement/resend api call to get announcement data
   */
  resendAnnouncement() {
    this.showLoader = true;
    this.createService.resendAnnouncement(this.identifier).subscribe(
      (res: ServerResponse) => {
        const data = res.result.announcement;
        this.initializeFormFields(data);
        this.attachments = data.attachments;
        this.recipientsList = data.target.geo.ids;
        _.forEach(data.links, (value, key) => {
          this.addNewLink(value);
        });
        this.enableRecipientsBtn();
        this.showLoader = false;
        this.isMetaModified = true;
        this.onFormValueChanges();
      },
      (error: ServerResponse) => {
        this.showLoader = false;
      }
    );
  }

  /**
   * To initilize file uploader plugin
   */
  initilizeFileUploader() {
    const options = {
      containerName: 'attachments/announcement',
      fileSizeErrorText: 'this.resource.messages.emsg.m0007',
      onCancel: this.onFileUploadCancel,
      uploadSuccess: this.onFileUploadSuccess
    };

    setTimeout(() => this.fileUpload.initilizeFileUploader(options), 500);
    if (!this.identifier) {
      this.onFormValueChanges();
    }
  }

  /**
   * Angular life cycle hook
   */
  ngOnInit(): void {
    // Initialize form field with empty values
    this.initializeFormFields('');
    this.activatedRoute.params.subscribe(params => {
      if (params.stepNumber) {
        this.stepNumber = +params.stepNumber;
      }
      if (params.identifier) {
        this.identifier = params.identifier;
      }
      this.validateFormState();
    });

    if (this.identifier) {
      this.resendAnnouncement();
    }
    this.getRootOrgId();
    this.recipientsList = [];
    this.attachments = [];
    this.initilizeFileUploader();
  }

  ngOnDestroy() {
    this.modalName = 'close';
  }
}
