/// <reference types="fine-uploader" />
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ResourceService, FileUploadService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeoExplorerComponent } from './../geo-explorer/geo-explorer.component';
import { CreateService } from './../../services/create/create.service';
import { UserService } from '@sunbird/core';
import { GeoLocationDetails } from './../../interfaces';
import { IAnnouncementDetails } from '@sunbird/announcement';
import { SuiModalService, TemplateModalConfig, ModalTemplate, ModalSize } from 'ng2-semantic-ui';
interface IContext {
  data: string;
}

// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

interface IAnnouncementAttachment {
  /**
   * Contains file name
   */
  name: string;
  /**
   * File mime type
   */
  mimetype: string;
  /**
   * File size
   */
  size: string;
  /**
   * File uploaded url
   */
  link: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, AfterViewInit {

  /**
   * Reference of Geo explorer component
   *
   * Geo component is responsible to render location list
   */
  @ViewChild(GeoExplorerComponent) geoExplorer: GeoExplorerComponent;

  /**
   * Get semantic ui modal template
   */
  @ViewChild('announcementFormModalTemplate')

  /**
   * Contains template reference of semantic ui modal
   */
  public modalTemplate: ModalTemplate<IContext, string, string>;

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
  attachments: Array<IAnnouncementAttachment>;

  /**
   * Flag to check user has entered / modified meta data
   */
  isMetaModified = false;

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
   * Reference of semantic UI modal service
   * It helps to configure modal popup
   */
  public modalService: SuiModalService;

  /**
   * Default method of classs CreateComponent
   *
   * @param {ResourceService} resource To get language constant
   * @param {FileUploadService} fileUpload To upload file
   */
  constructor(resource: ResourceService, fileUpload: FileUploadService, activatedRoute: ActivatedRoute, route: Router,
    iziToast: ToasterService, formBuilder: FormBuilder, createService: CreateService, user: UserService,
    modalService: SuiModalService) {
    this.stepNumber = 1;
    this.resource = resource;
    this.fileUpload = fileUpload;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.iziToast = iziToast;
    this.sbFormBuilder = formBuilder;
    this.createService = createService;
    this.user = user;
    this.modalService = modalService;
    this.recipientsList = [];
    this.attachments = [];
  }

  /**
   * Funtion to configure modal settings like modal size, isClosable and callback function
   */
  public configureSuiModal() {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);
    config.closeResult = 'closed!';
    config.size = 'large';
    config.isClosable = true;
    this.modalService
      .open(config)
      .onApprove(result => { })
      .onDeny(result => {
        this.route.navigate(['announcement/outbox', 1]);
      });
  }

  /**
   * Function to get logged-in user root org id
   *
   * Root org id is needed to get and create announcement types
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

  /**
   * Executed when user click on add new link icon while creating announcement
   *
   * Helps user to add more than one web url
   */
  addNewLink(): void {
    const arrayControl = <FormArray>this.announcementForm.controls['links'];
    arrayControl.push(this.sbFormBuilder.group({
      url: ['', Validators.pattern('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')]
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
   * Executed when user click on confirm recipients button
   *
   * It enforce user to select at least one location
   */
  confirmRecipients(): void {
    this.recipientsList = this.geoExplorer.selectedItems;
    if (this.recipientsList && this.recipientsList.length) {
      this.route.navigate(['announcement/create', 3]);
    } else {
      this.iziToast.warning(this.resource.messages.emsg.m0006);
    }
  }

  /**
   * Executed when user click remove icon on confirm recipients page
   *
   * @param {GeoLocationDetails} item contains selected location details
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
      this.route.navigate(['announcement/create', 2]);
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
    this.route.navigate(['announcement/create', 4]);
  }

  /**
   * Executed when user enter value input field value
   */
  enableRecipientsBtn(): boolean {
    const data = this.announcementForm.value;
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

  selectRecipients(): void {
    // TODO: add validation check here
    this.route.navigate(['announcement/create', 2]);
  }

  /**
   * Navigate user to previous form step
   *
   * It helps user to change form input
   */
  previousStep(): void {
    const step = this.stepNumber - 1;
    this.route.navigate(['announcement/create', step]);
  }

  /**
   * It gets executed when user directly hit the url.
   *
   * It navigates user to the first step if required fields data are not filled
   */
  validateFormState(): void {
    const data = this.announcementForm.value;
    if (!data.title || !data.from || !data.type) {
      this.route.navigate(['announcement/create', 1]);
    } else if (!data.links.length || !data.description || this.attachments && !this.attachments.length) {
      this.route.navigate(['announcement/create', 1]);
    }
  }

  /**
   * Function gets executed when file gets uploaded
   */
  onFileUploadSuccess = (attachmentDetails: IAnnouncementAttachment): void => {
    this.attachments.push(attachmentDetails);
    this.enableRecipientsBtn();
  }

  onFileUploadCancel = (fileDetail): void => {
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

  saveAnnouncement() {
    const data = this.announcementForm.value;
    data.target = this.recipientsList;
    data.attachments = this.attachments;
    this.createService.saveAnnouncement(data).
      subscribe(
        (res: ServerResponse) => {
          this.iziToast.success('Announcement created successfully');
        },
        (err: ServerResponse) => {
        }
      );
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

  /**
   * To detech form input value changes.
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
      title: ['', Validators.maxLength(100)],
      from: ['', null],
      type: ['', null],
      description: ['', Validators.maxLength(1200)],
      links: this.sbFormBuilder.array([])
    });
  }

  /**
   * Angular life cycle hook
   */
  ngOnInit(): void {
    this.initializeFormFields();
    this.activatedRoute.params.subscribe(params => {
      if (params.stepNumber) {
        this.stepNumber = params.stepNumber;
        this.validateFormState();
      }
    });

    this.getRootOrgId();
    this.onFormValueChanges();
    setTimeout(() => this.configureSuiModal(), 0);
  }
}
