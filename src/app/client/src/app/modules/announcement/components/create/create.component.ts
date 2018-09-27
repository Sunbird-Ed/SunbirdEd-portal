
import {first, takeUntil, map, filter} from 'rxjs/operators';
import { Subscription ,  Observable ,  Subject } from 'rxjs';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ResourceService, FileUploadService, ToasterService, ServerResponse, ConfigService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeoExplorerComponent } from './../geo-explorer/geo-explorer.component';
import { FileUploaderComponent } from './../file-uploader/file-uploader.component';
import { CreateService } from './../../services';
import { UserService } from '@sunbird/core';
import { IGeoLocationDetails, IAnnouncementDetails, IAttachementType } from './../../interfaces';
import * as _ from 'lodash';
import {
  IEndEventInput, IStartEventInput, IInteractEventInput,
  IImpressionEventInput, IInteractEventObject, IInteractEventEdata
} from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
/**
 * This component helps to create and resend announcement
 */
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {

  public unsubscribe = new Subject<void>();

  @ViewChild('successModal') successModal;
  @ViewChild('cancelModal') cancelModal;
  /**
   * Reference of Geo explorer component
   *
   * Geo component is responsible to render location list
   */
  @ViewChild(GeoExplorerComponent) geoExplorer: GeoExplorerComponent;

  /**
   * Dom element reference of create modal
   */
  @ViewChild('createModal') createModal;

  /**
   * Announcement creation form name
   */
  announcementForm: FormGroup;
  userDataSubscription: Subscription;
  subscription: Subscription;
  testSubscription: Subscription;
  /**
   * Contains reference of FormBuilder
   */
  sbFormBuilder: FormBuilder;

  /**
   * Contains wizard number
   */
  stepNumber = 1;

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
  recipientsList: Array<IGeoLocationDetails> = [];

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
  attachments: Array<IAttachementType> = [];
  /**
   * telemetryInteract event data
   */
  telemetryInteract: IInteractEventInput;
  /**
	 * telemetryInteract
	*/
  telemetryImpression: IImpressionEventInput;

  // telemetryEnd: any;
  telemetryStart: IStartEventInput;
  // public telemetryEnd$: Observable<IEndEventInput>;
  public telemetryEnd: IEndEventInput;
  /**
   * To show / hide modal
   */
  modalName = 'create';

  /**
   * showResendLoader helps to show loader during resend announcement
   */
  showResendLoader = false;

  /**
   * This flag helps to show the announcement form after every thing is initailised
   */
  showAnnouncementForm = true;

  /*
   * Contains resource service ref
   */
  public resource: ResourceService;

  /**
   * Contains file upload service reference
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
   * To get url, app configs
   */
  public config: ConfigService;
  public confirmAnnouncementInteractEdata: IInteractEventEdata;
  public previewInteractEdata: IInteractEventEdata;
  public sendAnnouncementInteractEdata: IInteractEventEdata;
  public selectInteractEdata: IInteractEventEdata;
  public announcementSentInteractEdata: IInteractEventEdata;
  public stopCreatingYesInteractEdata: IInteractEventEdata;
  public stopCreatingNoInteractEdata: IInteractEventEdata;
  public backBtnInteractEdata: IInteractEventEdata;
  public removeRecipientInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  /**
   * Default method of class CreateComponent
   *
   * @param {ResourceService} resource To get language constant
   * @param {FileUploadService} fileUpload To upload file
   * @param {ConfigService} config Reference of ConfigService
   */
  constructor(resource: ResourceService, fileUpload: FileUploadService, activatedRoute: ActivatedRoute, route: Router,
    toasterService: ToasterService, formBuilder: FormBuilder, createService: CreateService, user: UserService,
    private elRef: ElementRef, config: ConfigService, private cdr: ChangeDetectorRef, private userService: UserService,
    private deviceDetectorService: DeviceDetectorService) {
    this.resource = resource;
    this.fileUpload = fileUpload;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.sbFormBuilder = formBuilder;
    this.createService = createService;
    this.user = user;
    this.config = config;
  }

  /**
   * Get announcement type by making http call
   *
   * Announcement type(s) are needed to create new announcement.
   * Without type(s) user won't be able to create new announcement
   */
  setAnnouncementTypes(): void {
    this.showResendLoader = true;
    if (this.createService._announcementTypes) {
      _.each(this.createService._announcementTypes, (key) => {
        this.announcementTypes.push(key.name);
      });
      this.showResendLoader = false;
    } else {
      this.createService.getAnnouncementTypes().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (data: ServerResponse) => {
          if (data.result.announcementTypes) {
            _.each(data.result.announcementTypes, (key) => {
              this.announcementTypes.push(key.name);
            });
          }
          this.showResendLoader = false;
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resource.messages.emsg.m0005);
          this.showResendLoader = false;
          this.createModal.deny();
          this.redirectToOutbox();
        }
      );
    }
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
  enableSelectRecipientsBtn(): boolean {
    const data = this.announcementForm ? this.announcementForm.value : '';
    const emptyLinkArray = _.filter(data.links, (links) => {
      return links.url === '';
    });
    if (data.title.length && data.from.length && data.type.length && ((data.links.length && emptyLinkArray.length === 0)
      || data.description.length || this.fileUpload.attachedFiles && this.fileUpload.attachedFiles.length > 0)) {
      return this.formErrorFlag = false;
    } else {
      return this.formErrorFlag = true;
    }
  }

  /**
   * Post announcement form data
   */
  saveAnnouncement() {
    this.announcementDetails.target = this.recipientsList;
    this.createService.saveAnnouncement(this.announcementDetails, this.identifier ? true : false).pipe(
    takeUntil(this.unsubscribe))
      .subscribe(
        (res: ServerResponse) => {
          this.modalName = 'success';
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resource.messages.emsg.m0005);
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
    const endEvent = {
      object: {
        id: this.identifier ? this.identifier : '',
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'create'
      }
    };
    this.telemetryEnd = endEvent;
    this.telemetryEnd = Object.assign({}, this.telemetryEnd);
    this.cdr.detectChanges();
    this.route.navigate(['announcement/outbox/1']);
  }
  /**
   * Function used to detect form input value changes.
   * Set meta data modified flag to true when user enter new value
   */
  onFormValueChanges(): void {
    this.announcementForm.valueChanges.pipe(
    takeUntil(this.unsubscribe),
      map((value) => {
        value.title = value.title.trim();
        value.from = value.from.trim();
        value.description = value.description.trim();
        return value;
      }),
      filter((value) => this.announcementForm.valid))
      .subscribe((value) => {
        this.enableSelectRecipientsBtn();
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
      from: ['', [Validators.required, Validators.maxLength(200)]],
      type: ['', Validators.required],
      description: ['', Validators.maxLength(1200)],
      links: this.sbFormBuilder.array([])
    });
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
    this.showResendLoader = true;
    this.createService.resendAnnouncement(this.identifier).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (res: ServerResponse) => {
        this.setResendFormValues(res.result.announcement ? res.result.announcement : []);
        this.enableSelectRecipientsBtn();
        this.onFormValueChanges();
        this.showResendLoader = false;
        this.fileUpload.uploader.addInitialFiles(this.attachments);
        this.fileUpload.attachedFiles = this.attachments;
      },
      (error: ServerResponse) => {
        this.toasterService.error(this.resource.messages.emsg.m0005);
        this.createModal.deny();
        this.redirectToOutbox();
      }
    );
  }

  /**
   * Initialize form fields and file upload plugin
   */
  ngOnInit(): void {
    // Initialize form fields
    this.userDataSubscription = this.user.userData$.pipe(first()).subscribe(user => {
      if (user && user.userProfile) {
        this.showAnnouncementForm = false;
        this.initializeFormFields();
        const routeParam = this.activatedRoute.snapshot.params;
        this.stepNumber = routeParam.stepNumber ? +routeParam.stepNumber : 1;
        this.setAnnouncementTypes();
        if (routeParam.identifier) {
          this.identifier = routeParam.identifier;
          this.getAnnouncementDetails();
        } else {
          this.onFormValueChanges();
        }
        this.navigateToWizardNumber(1);
      } else if (user && user.err) {
        this.showAnnouncementForm = false;
        this.toasterService.error(this.resource.messages.emsg.m0005);
      }
    });
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.telemetryStart = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.identifier ? this.identifier : '',
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: this.activatedRoute.snapshot.data.telemetry.mode,
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version ,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };

    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.identifier ? this.identifier : '',
        type: this.activatedRoute.snapshot.data.telemetry.env,
        section: 'outbox'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.identifier ? this.activatedRoute.snapshot.data.telemetry.uri + this.identifier + '/' + this.stepNumber :
          this.activatedRoute.snapshot.data.telemetry.uri + this.stepNumber
      }
    };
    this.fileUpload.uploadEvent.pipe(
    takeUntil(this.unsubscribe))
    .subscribe(uploadData => {
      this.enableSelectRecipientsBtn();
    });
    this.setInteractEventData();
  }
  ngOnDestroy() {
    if (this.createModal) {
      this.createModal.deny();
    }
    if (this.successModal) {
      this.successModal.deny();
    }
    if (this.cancelModal) {
      this.cancelModal.deny();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  setInteractEventData() {
    this.confirmAnnouncementInteractEdata = {
      id: 'confirm-recipient',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.previewInteractEdata = {
      id: 'preview-announcement',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.sendAnnouncementInteractEdata = {
      id: 'send-announcement',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.selectInteractEdata = {
      id: 'edit-recipient',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.announcementSentInteractEdata = {
      id: 'announcement-sent',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.stopCreatingYesInteractEdata = {
      id: 'cancel-announcement-yes',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.stopCreatingNoInteractEdata = {
      id: 'cancel-announcement-no',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.backBtnInteractEdata = {
      id: 'announcement-back',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.removeRecipientInteractEdata = {
      id: 'remove-recipient',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.telemetryInteractObject = {
      id: '',
      type: 'announcement',
      ver: '1.0'
    };
  }
}
