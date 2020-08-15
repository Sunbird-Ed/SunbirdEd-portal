import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CertificateService, UserService, PlayerService, CertRegService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServerResponse, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, of, Subject, forkJoin, Observable, throwError, Subscription } from 'rxjs';
import { map, catchError, tap, subscribeOn } from 'rxjs/operators';
import { response } from './certificate-configuration.component.spec.data';

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

  public unsubscribe$ = new Subject<void>();
  showscreen: boolean;
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
  certTemplateList: any;
  batchDetails: any;
  selectedTemplate: any;
  configurationMode: string;
  certConfigModalInstance = new CertConfigModel();

  constructor(
    private certificateService: CertificateService,
    private userService: UserService,
    private playerService: PlayerService,
    private resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    private certRegService: CertRegService,
    private navigationHelperService: NavigationHelperService) { }

  secondscreen() {
    this.showscreen = !this.showscreen;
    this.initializeFormFields();
  }
  thirdscreen() {
    this.showanotherscreen = !this.showanotherscreen;
  }

  ngOnInit() {
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
      if (this.userPreference.status === 'VALID' && _.get(this.userPreference, 'value.allowPermission')) {
        this.disableAddCertificate = false;
      } else {
        this.disableAddCertificate = true;
      }
    });
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

  attachCertificateToBatch() {
    const request = {
      request: {
        courseId: _.get(this.queryParams, 'courseId'),
        batchId: _.get(this.queryParams, 'batchId'),
        key: 'iGOTCourseTemplate',
        orgId: _.get(this.userService, 'slug'),
        criteria: this.getCriteria(_.get(this.userPreference, 'value'))
      }
    };
    // make the api call to add certificate
    this.certRegService.addCertificateTemplate(request).subscribe(data => {
      // show a success toast message
      this.getBatchDetails(_.get(this.queryParams, 'batchId'));
    }, error => {
      // show an error toast message
      console.log('add cert error', error);
    });
  }

  editCertificate(certTemplateDetails) {
    console.log('certTemplateDetails', certTemplateDetails);
    const templateData = _.pick(_.get(certTemplateDetails, Object.keys(certTemplateDetails)), ['criteria', 'identifier']);
    this.selectedTemplate = _.get(templateData, 'identifier');
    this.processCriteria( _.get(templateData, 'criteria'));
    this.secondscreen();
  }

  getCriteria(rawDropdownValues) {
   const processedData = this.certConfigModalInstance.processDropDownValues(rawDropdownValues, _.get(this.userService, 'userProfile.rootOrgId'));
   return processedData;
  }

  processCriteria(criteria) {
    const abc = this.certConfigModalInstance.processCriteria(criteria);
    this.issueTo = _.get(abc, 'issueTo');
    this.certTypes = _.get(abc, 'certTypes');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
