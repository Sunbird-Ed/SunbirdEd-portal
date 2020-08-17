import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CertificateService, UserService, PlayerService, CertRegService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export enum ProcessingModes {
  PROCESS_DROPDOWNS = 'processDropdowns',
  PROCESS_CRITERIA = 'processCriteria'
}

@Component({
  selector: 'app-certificate-configuration',
  templateUrl: './certificate-configuration.component.html',
  styleUrls: ['./certificate-configuration.component.scss']
})
export class CertificateConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('selectCertType') selectCertType;
  @ViewChild('selectRecipient') selectRecipient;
  @ViewChild('templateChangeModal') templateChangeModal;

  public unsubscribe$ = new Subject<void>();
  showanotherscreen: boolean;
  showErrorModal;
  showPreviewModal;
  showTemplateDetectModal;

  certTypes: any;
  issueTo: any;

  userPreference: FormGroup;
  disableAddCertificate = true;
  queryParams: any;
  courseDetails: any;
  showLoader = true;
  certTemplateList: Array<{}>;
  batchDetails: any;
  currentState: any;
  screenStates: any = {'default': 'default', 'certRules': 'certRules' };
  selectedTemplate: any;
  previewTemplate: any;
  configurationMode: string;
  certConfigModalInstance = new CertConfigModel();
  previewUrl: string;
  templateIdentifier: string;
  isTemplateChanged = false;
  config = {
    select: {
        label: 'Select',
        name: 'Select',
        show: true
    },
    preview: {
        label: 'Preview',
        name: 'Preview',
        show: true
    },
    remove: {
        label: 'Remove',
        name: 'Remove',
        show: false
    }
  };

  constructor(
    private certificateService: CertificateService,
    private userService: UserService,
    private playerService: PlayerService,
    private resourceService: ResourceService,
    private certRegService: CertRegService,
    private navigationHelperService: NavigationHelperService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService ) { }

  showCertRulesScreen(stateName) {
    this.currentState = stateName;
  }
  thirdscreen() {
    this.showanotherscreen = !this.showanotherscreen;
  }

  ngOnInit() {
    this.currentState = this.screenStates.default;
    this.navigationHelperService.setNavigationUrl();
    this.initializeFormFields();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
      this.configurationMode = _.get(this.queryParams, 'type');
    });
    combineLatest(
    this.getCourseDetails(_.get(this.queryParams, 'courseId')),
    this.getBatchDetails(_.get(this.queryParams, 'batchId')),
    this.getTemplateList(),
    ).subscribe((data) => {
      this.showLoader = false;
      const [courseDetails, batchDetails, config] = data;
    }, (error) => {
      this.showLoader = false;
    });
  }

  getCertConfigFields() {
    const request = {
      request: {
        orgId: this.userService.slug,
        key: 'certRules'
      }
    };
    this.certificateService.fetchCertificatePreferences(request).subscribe(certRulesData => {
      const dropDownValues = this.certConfigModalInstance.getDropDownValues(_.get(certRulesData, 'result.response.data.fields'));
      this.certTypes = _.get(dropDownValues, 'certTypes');
      this.issueTo = _.get(dropDownValues, 'issueTo');
    }, error => {
      // error toast
    });
  }

  getTemplateList() {
    const request = {
      request: {
        orgId: this.userService.slug,
        key: 'certList'
      }
    };
    return this.certificateService.fetchCertificatePreferences(request).pipe(
      tap((certTemplateData) => {
        this.certTemplateList = _.get(certTemplateData, 'result.response.data.range');
        console.log('this.certTemplateList', this.certTemplateList);
      }),
      catchError(error => {
        return of({});
      })
    );
  }

  getBatchDetails(batchId) {
    return this.certificateService.getBatchDetails(batchId).pipe(
      tap(batchDetails => {
        this.batchDetails = _.get(batchDetails, 'result.response');
        if (!_.get(this.batchDetails, 'cert_templates')) {
          this.getCertConfigFields();
        } else {
          this.processCertificateDetails(_.get(this.batchDetails, 'cert_templates'));
        }
        console.log('this.batchDetails', this.batchDetails);
      })
    );
  }

  initializeFormFields() {
    this.userPreference = new FormGroup({
      certificateType: new FormControl('', [Validators.required]),
      issueTo: new FormControl('', [Validators.required]),
      allowPermission: new FormControl('', [Validators.required])
    });
    this.userPreference.valueChanges.subscribe(val => {
        this.validateForm();
    });
  }

  validateForm() {
    console.log('this.userPreference', this.userPreference.value);
    if (this.userPreference.status === 'VALID'
    && _.get(this.userPreference, 'value.allowPermission') && !_.isEmpty(this.selectedTemplate)) {
      this.disableAddCertificate = false;
    } else {
      this.disableAddCertificate = true;
    }
  }

  getCourseDetails(courseId: string) {
    return this.playerService.getCollectionHierarchy(courseId).pipe(
      tap(courseData => {
        this.courseDetails = _.get(courseData, 'result.content');
      }, catchError(error => {
        return of({});
      }))
    );
  }

  updateCertificate() {
    if (this.templateIdentifier !== _.get(this.selectedTemplate, 'name')) {
      this.isTemplateChanged = true;
    } else {
      this.attachCertificateToBatch();
    }
  }

  attachCertificateToBatch() {
    const request = {
      request: {
        courseId: _.get(this.queryParams, 'courseId'),
        batchId: _.get(this.queryParams, 'batchId'),
        key: _.get(this.selectedTemplate, 'name'),
        orgId: _.get(this.userService, 'slug'),
        criteria: this.getCriteria(_.get(this.userPreference, 'value'))
      }
    };
    console.log('request', request);
    // make the api call to add certificate
    this.certRegService.addCertificateTemplate(request).subscribe(data => {
      if (this.configurationMode === 'add') {
        this.toasterService.success('Certificate addedd successfully');
      } else {
        this.toasterService.success('Certificate updated successfully.');
      }
      this.closeTemplateDetectModal();
      this.certificateService.getBatchDetails(_.get(this.queryParams, 'batchId')).subscribe(batchDetails => {
        this.batchDetails = _.get(batchDetails, 'result.response');
        this.processCertificateDetails(_.get(this.batchDetails, 'cert_templates'));
        this.goBack();
      }, error => {
      });
    }, error => {
      // show an error toast message
      console.log('add cert error', error);
      if (this.configurationMode === 'add') {
        this.toasterService.error('Failed to add the certificate. Try again later.');
      } else {
        this.toasterService.success('Failed to edit the certificate. Try again later.');
      }
    });
  }

  processCertificateDetails(certTemplateDetails) {
    console.log('certTemplateDetails', certTemplateDetails);
    const templateData = _.pick(_.get(certTemplateDetails, Object.keys(certTemplateDetails)), ['criteria', 'identifier', 'previewUrl']);
    this.selectedTemplate = {name : _.get(templateData, 'identifier')};
    this.templateIdentifier =  _.get(templateData, 'identifier');
    this.previewUrl = _.get(templateData, 'previewUrl');
    this.processCriteria( _.get(templateData, 'criteria'));
  }
  editCertificate() {
    this.currentState = this.screenStates.certRules;
    this.configurationMode = 'edit';
  }

  getCriteria(rawDropdownValues) {
   const processedData = this.certConfigModalInstance.processDropDownValues(rawDropdownValues, _.get(this.userService, 'userProfile.rootOrgId'));
   return processedData;
  }

  processCriteria(criteria) {
    const abc = this.certConfigModalInstance.processCriteria(criteria);
    this.issueTo = _.get(abc, 'issueTo');
    this.certTypes = _.get(abc, 'certTypes');
    const certTypeFormEle = this.userPreference.controls['certificateType'];
    const  issueToFormEle = this.userPreference.controls['issueTo'];
    this.issueTo && this.issueTo.length > 0 ? issueToFormEle.setValue(this.issueTo[0].name) : issueToFormEle.setValue('');
    this.certTypes && this.certTypes.length > 0 ? certTypeFormEle.setValue(this.certTypes[0].name) : certTypeFormEle.setValue('');
  }

  handleCertificateEvent(event, template: {}) {
    const show = _.get(this.selectedTemplate, 'name') === _.get(template, 'name');
    switch (_.lowerCase(_.get(event, 'name'))) {
      case 'select' :
        this.selectedTemplate = template;
        this.config.remove.show = show;
        this.config.select.show = !show;
        this.validateForm();
        break;
      case 'remove' :
        this.selectedTemplate = {};
        this.config.select.show = show;
        this.config.remove.show = !show;
        this.validateForm();
        break;
      case 'preview':
        this.previewTemplate = template;
        this.showPreviewModal = true;
        break;
    }
  }

  getConfig(config: {show: boolean, label: string, name: string}, template) {
    const show = _.get(this.selectedTemplate, 'name') === _.get(template, 'name');
    if (_.lowerCase(_.get(config, 'label')) === 'select') {
        return ({show: !show, label: config.label, name: config.name});
    } else {
      return ({show: show, label: config.label, name: config.name});
    }
  }

  closeModal(event) {
    this.showPreviewModal = false;
    this.selectedTemplate = _.get(event, 'name') ? _.get(event, 'template') : this.selectedTemplate;
    this.validateForm();
  }

  closeTemplateDetectModal () {
    this.isTemplateChanged = false;
  }

  goBack() {
    if (this.currentState === this.screenStates.certRules) {
      // Goback to cert list screen
      this.currentState = this.screenStates.default;
    } else {
      this.navigationHelperService.navigateToLastUrl();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
