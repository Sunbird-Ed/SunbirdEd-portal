import { UploadCertificateService } from './../../services/upload-certificate/upload-certificate.service';
import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { CertificateService, UserService, PlayerService, CertRegService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TelemetryService, IImpressionEventInput } from '@sunbird/telemetry'
import { DomSanitizer } from '@angular/platform-browser';

export interface IConfigLabels {
  label: string;
  name: string;
  show: boolean;
}

@Component({
  selector: 'app-certificate-configuration',
  templateUrl: './certificate-configuration.component.html',
  styleUrls: ['./certificate-configuration.component.scss']
})
export class CertificateConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('selectCertType', {static: false}) selectCertType;
  @ViewChild('selectRecipient', {static: false}) selectRecipient;
  @ViewChild('templateChangeModal', {static: false}) templateChangeModal;
  @ViewChild('selectScoreRange', {static: false}) selectScoreRange;

  public unsubscribe$ = new Subject<void>();
  showPreviewModal;
  showTemplateDetectModal;
  certTypes: any;
  issueTo: any;
  telemetryImpression: IImpressionEventInput;
  userPreference: FormGroup;
  disableAddCertificate = true;
  queryParams: any;
  courseDetails: any;
  showLoader = true;
  certTemplateList: Array<{}> = [];
  batchDetails: any;
  currentState: any;
  screenStates: any = { 'default': 'default', 'certRules': 'certRules' };
  selectedTemplate: any;
  previewTemplate: any;
  configurationMode: string;
  certConfigModalInstance = new CertConfigModel();
  previewUrl: string;
  templateIdentifier: string;
  isTemplateChanged = false;
  certEditable = true;
  config: { select: IConfigLabels, preview: IConfigLabels, remove: IConfigLabels };
  certificate: any;
  newTemplateIdentifier: any;
  showAlertModal = false;
  addScoreRule = false;
  arrayValue={};
  scoreRange: any;
  isSingleAssessment=false;

  constructor(
    private certificateService: CertificateService,
    private userService: UserService,
    private playerService: PlayerService,
    private sanitizer: DomSanitizer,
    private resourceService: ResourceService,
    private certRegService: CertRegService,
    public uploadCertificateService: UploadCertificateService,
    public navigationHelperService: NavigationHelperService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private router: Router,
    private telemetryService: TelemetryService) { }
  /**
   * @description - It will handle back button click.
   */
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.isTemplateChanged) {
      this.isTemplateChanged = false;
    }
  }

  /**
   * @since - release-3.2.10
   * @description - It will prepare all the necessary data along with the apis.
   */
  ngOnInit() {
    this.initializeLabels();
    this.currentState = this.screenStates.default;
    this.uploadCertificateService.certificate.subscribe(res => {
      if (res && !_.isEmpty(res)) {
        this.showAlertModal = true;
        this.currentState = 'certRules';
        this.showPreviewModal = false;
        this.newTemplateIdentifier = _.get(res , 'identifier');
      }
    });
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
      this.checkMultipleAssessment();
    }, (error) => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }
  checkMultipleAssessment(){
    const contentTypes = JSON.parse(_.get(this.courseDetails, 'contentTypesCount'));
    const selfAssessCount = _.get(contentTypes, 'SelfAssess')
    if (selfAssessCount && selfAssessCount > 1) {
      this.isSingleAssessment = false;
    } else if(selfAssessCount && selfAssessCount == 1){
      this.isSingleAssessment = true;
    } else {
      this.isSingleAssessment = false;
    }
  }
  certificateCreation() {
    this.currentState = this.screenStates.certRules;
  }

  /**
   * @description - It will trigger impression telemetry event once the view is ready.
   */
  ngAfterViewInit() {
    this.setTelemetryImpressionData();
  }

  /**
   * @description - It will prepare the config data for the hover activity of the cert-list cards.
   */
  initializeLabels() {
    this.config = {
      select: {
        label: this.resourceService.frmelmnts.lbl.Select,
        name: 'Select',
        show: true
      },
      preview: {
        label: this.resourceService.frmelmnts.cert.lbl.preview,
        name: 'Preview',
        show: true
      },
      remove: {
        label: this.resourceService.frmelmnts.cert.lbl.unselect,
        name: 'Remove',
        show: false
      }
    };
  }

  /**
   * @description - It will fetch the drop-down values by calling the preference api with proper request payload.
   */
  getCertConfigFields() {
    const request = {
      request: {
        orgId: _.get(this.userService, 'userProfile.rootOrgId'),
        key: 'certRules'
      }
    };
    this.certificateService.fetchCertificatePreferences(request).subscribe(certRulesData => {
      const dropDownValues = this.certConfigModalInstance.getDropDownValues(_.get(certRulesData, 'result.response.data.fields'));
      this.certTypes = _.get(dropDownValues, 'certTypes');
      this.issueTo = _.get(dropDownValues, 'issueTo');
      this.scoreRange = _.get(dropDownValues, 'scoreRange');
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  /**
   * @description - It will fetch list of certificate templates from preference api.
   */
  getTemplateList() {
    const request = {
      'request': {
          'filters': {
              'certType': 'cert template',
              'channel': this.userService.channel,
              'mediaType': 'image'
          },
          'sort_by': {
            'lastUpdatedOn': 'desc'
          },
          'fields': ['indentifier', 'name', 'code', 'certType', 'data', 'issuer', 'signatoryList', 'artifactUrl', 'primaryCategory', 'channel'],
          'limit': 100
      }
  };
  return this.uploadCertificateService.getCertificates(request).pipe(
      tap((certTemplateData) => {
        const templatList = _.get(certTemplateData, 'result.content');
        this.certTemplateList = templatList;
        // To select the newly created certificate
        let tempIdToSelect;
        if (this.newTemplateIdentifier) {
          tempIdToSelect = this.newTemplateIdentifier;
        } else {
          tempIdToSelect = this.templateIdentifier;
        }
        const templateData = templatList.find(templat => tempIdToSelect && (templat.identifier === tempIdToSelect));
        if (templateData) {
          _.remove(this.certTemplateList, (cert) => _.get(cert, 'identifier') === _.get(templateData , 'identifier'));
          this.certTemplateList.unshift(templateData);
          this.selectedTemplate = templateData;
        }
      }), catchError(error => {
          return of({});
        })
    );
  }

  refreshData() {
    this.getTemplateList().subscribe(response => {
    }, (error) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }
  /**
   * @param  {string} batchId
   * @description - It will fetch the batch details.
   */
  getBatchDetails(batchId) {
    return this.certificateService.getBatchDetails(batchId).pipe(
      tap(batchDetails => {
        this.batchDetails = _.get(batchDetails, 'result.response');
        const cert_templates = _.get(this.batchDetails, 'cert_templates');
        if (_.isEmpty(cert_templates)) {
          this.getCertConfigFields();
        } else {
          // Certifciate has attached to a batch
          if (_.isArray(cert_templates)) {
            this.batchDetails.cert_templates = cert_templates[0];
          }
          this.processCertificateDetails(cert_templates);
        }
      })
    );
  }


  initializeFormFields() {
    this.userPreference = new FormGroup({
      scoreRange: new FormControl(''),
      issueTo: new FormControl('', [Validators.required]),
      allowPermission: new FormControl('', [Validators.required])
    });
    this.userPreference.valueChanges.subscribe(val => {
      this.validateForm();
    });
  }


  validateForm() {
    if (this.userPreference.status === 'VALID'
      && _.get(this.userPreference, 'value.allowPermission') && !_.isEmpty(this.selectedTemplate)) {
      this.disableAddCertificate = false;
    } else {
      this.disableAddCertificate = true;
    }
  }

  /**
   * @param  {string} courseId
   * @description - It will fetch the course details.
   */
  getCourseDetails(courseId: string) {
    return this.playerService.getCollectionHierarchy(courseId).pipe(
      tap(courseData => {
        this.courseDetails = _.get(courseData, 'result.content');
      }, catchError(error => {
        return of({});
      }))
    );
  }

  /**
   * @description - It will check for the template change or update the certificate.
   */
  updateCertificate() {
    if (this.templateIdentifier !== _.get(this.selectedTemplate, 'name')) {
      this.isTemplateChanged = true;
    } else {
      this.attachCertificateToBatch();
    }
  }

  attachCertificateToBatch() {
    this.sendInteractData({ id: this.configurationMode === 'add' ? 'attach-certificate' : 'confirm-template-change' });
    const request = {
      'request': {
        'batch': {
          'courseId': _.get(this.queryParams, 'courseId'),
          'batchId': _.get(this.queryParams, 'batchId'),
          'template': {
            'identifier': _.get(this.selectedTemplate, 'identifier'),
            'criteria': this.getCriteria(this.userPreference.value),
            'name': _.get(this.selectedTemplate, 'name'),
            'issuer': JSON.parse(_.get(this.selectedTemplate, 'issuer')),
            'data': JSON.stringify(_.get(this.selectedTemplate, 'data')),
            'previewUrl': _.get(this.selectedTemplate, 'artifactUrl'),
            'signatoryList': JSON.parse(_.get(this.selectedTemplate, 'signatoryList'))
          }
        }
      }
    };

    if (this.isTemplateChanged) {
      request['request']['oldTemplateId'] = this.templateIdentifier;
    }
    this.certRegService.addCertificateTemplate(request).subscribe(data => {
      this.isTemplateChanged = false;
      if (this.configurationMode === 'add') {
        this.toasterService.success(this.resourceService.frmelmnts.cert.lbl.certAddSuccess);
      } else {
        this.toasterService.success(this.resourceService.frmelmnts.cert.lbl.certUpdateSuccess);
      }
      this.certificateService.getBatchDetails(_.get(this.queryParams, 'batchId')).subscribe(batchDetails => {
        this.batchDetails = _.get(batchDetails, 'result.response');
        this.processCertificateDetails(_.get(this.batchDetails, 'cert_templates'));
        this.goBack();
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
    }, error => {
      if (this.configurationMode === 'add') {
        this.toasterService.error(this.resourceService.frmelmnts.cert.lbl.certAddError);
      } else {
        this.toasterService.error(this.resourceService.frmelmnts.cert.lbl.certEditError);
      }
    });
  }

  processCertificateDetails(certTemplateDetails) {
    const templateData = _.pick(_.get(certTemplateDetails, Object.keys(certTemplateDetails)), ['criteria', 'previewUrl', 'artifactUrl', 'identifier', 'data', 'issuer', 'signatoryList','name']);
    this.templateIdentifier = _.get(templateData, 'identifier');
    this.selectedTemplate = { 
      'name': _.get(templateData, 'name'), 
      'identifier': _.get(templateData, 'identifier'), 
      'previewUrl': _.get(templateData, 'previewUrl'),
      'issuer': JSON.stringify(_.get(templateData, 'issuer')),
      'data': JSON.stringify(_.get(templateData, 'data')),
      'signatoryList': JSON.stringify(_.get(templateData, 'signatoryList')),
      'artifactUrl':_.get(templateData, 'artifactUrl')
     };
    // if (!_.isEmpty(this.newTemplateIdentifier)) {
    //   this.templateIdentifier = this.newTemplateIdentifier;
    //   this.selectedTemplate = null;
    // }
    this.previewUrl = _.get(templateData, 'previewUrl');
    this.setCertEditable();
    this.processCriteria(_.get(templateData, 'criteria'));
  }

  setCertEditable() {
    this.certEditable = this.previewUrl ? true : false;
  }

  editCertificate() {
    this.configurationMode = 'edit';
    this.currentState = this.screenStates.certRules;
    this.sendInteractData({ id: 'edit-certificate' });
  }

  getCriteria(rawDropdownValues) {
    const processedData = this.certConfigModalInstance.processDropDownValues(rawDropdownValues, _.get(this.userService, 'userProfile.rootOrgId'));
    return processedData;
  }

  processCriteria(criteria) {
    const data = this.certConfigModalInstance.processCriteria(criteria);
    this.issueTo = _.get(data, 'issueTo');
    const scoreRange = _.get(data, 'scoreRange');
    if (scoreRange) {
      this.addRule();
    }
    const scoreRangeFormEle = this.userPreference.controls['scoreRange'];
    const issueToFormEle = this.userPreference.controls['issueTo'];
    this.issueTo && this.issueTo.length > 0 ? issueToFormEle.setValue(this.issueTo[0].name) : issueToFormEle.setValue('');
    scoreRange ? scoreRangeFormEle.setValue(scoreRange) : scoreRangeFormEle.setValue('');
  }

  handleCertificateEvent(event, template: {}) {
    const show = _.get(this.selectedTemplate, 'name') === _.get(template, 'name');
    switch (_.lowerCase(_.get(event, 'name'))) {
      case 'select':
        this.selectedTemplate = template;
        this.config.remove.show = show;
        this.config.select.show = !show;
        this.validateForm();
        this.sendInteractData({ id: 'select-template' });
        break;
      case 'remove':
        this.selectedTemplate = {};
        this.config.select.show = show;
        this.config.remove.show = !show;
        this.validateForm();
        this.sendInteractData({ id: 'unselect-template' });
        break;
      case 'preview':
        this.previewTemplate = template;
        this.showPreviewModal = true;
        this.sendInteractData({ id: 'preview-template' });
        break;
    }
  }

  getConfig(config: { show: boolean, label: string, name: string }, template) {
    const show = _.get(this.selectedTemplate, 'name') === _.get(template, 'name');
    if (_.lowerCase(_.get(config, 'label')) === 'select') {
      return ({ show: !show, label: config.label, name: config.name });
    } else {
      return ({ show: show, label: config.label, name: config.name });
    }
  }

  closeModal(event) {
    _.remove(this.certTemplateList, (template) => _.get(template, 'identifier') === _.get(event, 'template.identifier'));
    this.certTemplateList.unshift(_.get(event, 'template'));
    this.showPreviewModal = false;
    this.selectedTemplate = _.get(event, 'name') ? _.get(event, 'template') : this.selectedTemplate;
    this.validateForm();
    if (_.get(event, 'name')) {
      this.sendInteractData({ id: 'select-template' });
    } else {
      this.sendInteractData({ id: 'close-preview' });
    }
  }

  closeTemplateDetectModal() {
    this.isTemplateChanged = false;
    this.sendInteractData({ id: 'cancel-template-change' });
  }

  navigateToCertRules() {
    this.currentState = this.screenStates.certRules;
    this.sendInteractData({ id: 'add-certificate' });
  }

  goBack() {
    if (this.currentState === this.screenStates.certRules) {
      // Goback to cert list screen
      this.currentState = this.screenStates.default;
    } else {
      this.router.navigate([`/learn/course/${_.get(this.queryParams, 'courseId')}`]);
    }
  }

  cancelSelection() {
    this.currentState = this.screenStates.default;
    this.userPreference.controls['allowPermission'].reset();
    this.sendInteractData({ id: this.configurationMode === 'add' ? 'cancel-add-certificate' : 'cancel-update-certificate' });
    if (this.configurationMode === 'add') {
      this.userPreference.reset();
      this.selectedTemplate = {};
    } else {
      const cert_templates = _.get(this.batchDetails, 'cert_templates');
      this.processCertificateDetails(cert_templates);
    }
  }

  setTelemetryImpressionData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Batch',
          id: _.get(this.queryParams, 'batchId')
        },
        {
          type: 'Course',
          id: _.get(this.queryParams, 'courseId')
        }]
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
    this.telemetryService.impression(this.telemetryImpression);
  }

  sendInteractData(interactData) {
    const data = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Batch',
          id: _.get(this.queryParams, 'batchId')
        },
        {
          type: 'Course',
          id: _.get(this.queryParams, 'courseId')
        }]
      },
      edata: {
        id: _.get(interactData, 'id'),
        type: 'CLICK',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };

    if (this.configurationMode === 'edit') {
      data['object'] = {
        id: _.get(this.selectedTemplate, 'name'),
        type: 'Certificate',
        ver: '1.0',
        rollup: { l1: _.get(this.queryParams, 'courseId') }
      };
    }

    this.telemetryService.interact(data);
  }

  navigateToCreateTemplate() {
    this.router.navigate([`/certs/configure/create-template`], {
      queryParams: {
        type: this.configurationMode,
        courseId: _.get(this.queryParams, 'courseId'),
        batchId: _.get(this.queryParams, 'batchId')
      }
    });
  }
  removeSelectedCertificate() {
    this.selectedTemplate = null;
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.uploadCertificateService.certificate.next(null);
  }
  public addRule(){
    this.addScoreRule = true;
    let range = 100;
    const step = 10;
    let arr = []
    while(range > 0){
      arr.push(range);
      range=range-step;
    }
    this.arrayValue['range']=arr;
  }
  removeRule(){
    this.addScoreRule = false;
  }
}
