/// <reference types="fine-uploader" />
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ResourceService, FileUploadService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, ViewChild, OnDestroy, ElementRef, ViewChildren} from '@angular/core';
import { NgForm, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeoExplorerComponent } from './../geo-explorer/geo-explorer.component';
import { CreateService } from './../../services';
import { UserService } from '@sunbird/core';
import { IGeoLocationDetails } from './../../interfaces';
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
   * Dom element reference to close modal
   */
  @ViewChild('closeAnnouncementModal') closeAnnouncementModal: ElementRef;

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
  announcementTypes: Array<string> = [];

  /**
   * Contains announcement recipients list
   */
  recipientsList: Array<IGeoLocationDetails>;

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

  /**
   * Config to get geo component
   */
  geoConfig = { geo: { adaptor: 'SERVICE', service: 'geoService' } };

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
  public toasterService: ToasterService;

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
    toasterService: ToasterService, formBuilder: FormBuilder, createService: CreateService, user: UserService,
    private elRef: ElementRef) {
    this.stepNumber = 1;
    this.resource = resource;
    this.fileUpload = fileUpload;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.sbFormBuilder = formBuilder;
    this.createService = createService;
    this.user = user;
  }

  /**
   * Get logged-in user root org id
   *
   * Root org id is needed to get announcement type(s) by making definition api call
   */
  setRootOrgId(): void {
    this.user.userData$.subscribe(
      user => {
        if (user && user.userProfile && user.userProfile.rootOrgId) {
          this.createService._rootOrgId = user.userProfile.rootOrgId;
          this.setAnnouncementTypes();
        }
      }
    );
  }

  /**
   * Get announcement type by making http call
   *
   * Announcement type(s) are needed to create new annoucement.
   * Without type(s) user won't be able to create new announcement
   */
  setAnnouncementTypes(): void {
    if (this.createService._announcementTypes) {
      _.each(this.createService._announcementTypes, (key) => {
        this.announcementTypes.push(key.name);
      });
    } else {
      this.createService.getAnnouncementTypes().subscribe(
        (data: ServerResponse) => {
          if (data.result.announcementTypes) {
            _.each(data.result.announcementTypes, (key) => {
              this.announcementTypes.push(key.name);
            });
          }
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resource.messages.emsg.m0005);
          // Close announcement form and redirect user to outbox page
          this.closeAnnouncementModal.nativeElement.click();
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

  /**
   * It takes form wizard number as a input and redirect user to that page
   *
   * @param {number} wizardNumber announcement form wizard number navigateToWizardNumber
   */
  navigateToWizardNumber(wizardNumber: number): void {
    this.stepNumber = Number(wizardNumber);
    if (this.identifier) {
      this.route.navigate(['announcement/resend', this.identifier, this.stepNumber]);
    } else {
      this.route.navigate(['announcement/create', this.stepNumber]);
    }
  }

  /**
   * Executed when user click on confirm recipients button
   *
   * It enforce user to select at least one location
   */
  confirmRecipients(): void {
    this.recipientsList = this.geoExplorer && this.geoExplorer.selectedItems ? this.geoExplorer.selectedItems : [];
    if (this.recipientsList && this.recipientsList.length > 0) {
      this.navigateToWizardNumber(3);
    } else {
      this.toasterService.warning(this.resource.messages.emsg.m0006);
    }
  }

  /**
   * Executed when user click remove icon on confirm recipients page
   *
   * @param {IGeoLocationDetails} item selected location details
   */
  removeRecipient(item: IGeoLocationDetails): void {
    _.remove(this.recipientsList, (recipient) => {
      if (recipient.id === item.id) {
        item.selected = false;
        this.toasterService.info(item.location + ' ' + this.resource.messages.imsg.m0020);
        return recipient.location;
      }
    });

    if (this.recipientsList.length === 0) {
      this.navigateToWizardNumber(2);
    }
  }

  /**
   * Executed when user click on preview announcement button
   *
   * It helps user to show announcement preview - after creating the announcement how it will look
   */
  navigateToPreviewPage(): void {
    const data = { ...this.announcementForm.value };
    data.links = data.links.length ? _.map(data.links, 'url') : [];
    this.announcementDetails = data;
    this.announcementDetails.attachments = this.fileUpload.attachedFiles;
    this.navigateToWizardNumber(4);
  }

  /**
   * To enable select recipients button.
   *
   * Button gets enabled when all required fields and
   * at least one of 'Description' or 'URL / weblink' or 'Attachment' must be provided
   */
  enableRecipientsBtn(): boolean {
    const data = this.announcementForm ? this.announcementForm.value : '';
    if (this.announcementForm.status === 'VALID' && (data.links.length || data.description
      || this.fileUpload.attachedFiles && this.fileUpload.attachedFiles.length > 0)) {
        return this.formErrorFlag = false;
    } else {
      return this.formErrorFlag = true;
    }
  }

  /**
   * Post announcement form data
   */
  saveAnnouncement() {
    const data = { ...this.announcementForm.value };
    data.links = data.links.length ? _.map(data.links, 'url') : [];
    data.target = this.recipientsList;
    data.attachments = this.announcementDetails.attachments;
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
  initializeFormFields(): void {
    this.announcementForm = this.sbFormBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      from: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.maxLength(1200)],
      links: this.sbFormBuilder.array([])
    });
  }

  /**
   * Function to set resend form values
   */
  setResendFormValues(data) {
    this.announcementForm = this.sbFormBuilder.group({
      title: [data.title, [Validators.required, Validators.maxLength(100)]],
      from: [data.from, [Validators.required, Validators.maxLength(200)]],
      type: [data.type, Validators.required],
      description: [data.description, Validators.maxLength(1200)],
      links: this.sbFormBuilder.array([])
    });
    // Set links value
    _.forEach(data.links, (value, key) => {
      this.addNewLink(value);
    });
    // Update attachments
    this.attachments = data.attachments;
    this.recipientsList = data.target.geo && data.target.geo.ids ? data.target.geo.ids : [];
  }

  /**
   * Function to get resend announcement data.
   * Make announcement/resend api call to get announcement data
   */
  getAnnouncementDetails() {
    this.showLoader = true;
    this.createService.resendAnnouncement(this.identifier).subscribe(
      (res: ServerResponse) => {
        this.setResendFormValues(res.result.announcement ? res.result.announcement : []);
        this.enableRecipientsBtn();
        this.onFormValueChanges();
        this.showLoader = false;
        this.isMetaModified = true;
        this.fileUpload.uploader.addInitialFiles(this.attachments);
        this.fileUpload.attachedFiles = this.attachments;
      },
      (error: ServerResponse) => {
        this.toasterService.error(this.resource.messages.emsg.m0005);
        // Close announcement form and redirect user to outbox page
        this.closeAnnouncementModal.nativeElement.click();
      }
    );
  }

  /**
   * To initilize file uploader plugin
   */
  initilizeFileUploader() {
    const options = {
      containerName: 'attachments/announcement',
      fileSizeErrorText: 'this.resource.messages.emsg.m0007'
    };
    this.fileUpload.initilizeFileUploader(options);
  }

  /**
   * Initialize form fields and file upload plugin
   */
  ngOnInit(): void {
    // Initialize form fields
    this.initializeFormFields();
    const routeParam = this.activatedRoute.snapshot.params;
    this.stepNumber = routeParam.stepNumber ? +routeParam.stepNumber : 1;
    if (routeParam.identifier) {
      this.identifier = routeParam.identifier;
      this.getAnnouncementDetails();
    } else {
      this.onFormValueChanges();
    }
    this.fileUpload.attachedFiles = [];
    this.setRootOrgId();
    this.recipientsList = [];
    this.attachments = [];
    this.navigateToWizardNumber(1);
    this.initilizeFileUploader();
  }

  ngOnDestroy() {
    this.closeAnnouncementModal.nativeElement.click();
  }
}
