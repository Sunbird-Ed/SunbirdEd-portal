import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CertificateService, UserService, PlayerService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServerResponse, ResourceService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, of, Subject, forkJoin, Observable, throwError, Subscription } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { response } from './certificate-configuration.component.spec.data';

export enum ProcessingModes {
  PROCESS_DROPDOWNS = 'processDropdowns'
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
  recipients: any;

  userPreference: FormGroup;
  disableAddCertificate = true;
  queryParams: any;
  courseDetails: any;
  showLoader = true;
  certTemplateList: any;
  batchDetails: any;

  constructor(
    private certificateService: CertificateService,
    private userService: UserService,
    private playerService: PlayerService,
    private resourceService: ResourceService,
    public activatedRoute: ActivatedRoute) { }

  secondscreen() {
    this.showscreen = !this.showscreen;
  }
  thirdscreen() {
    this.showanotherscreen = !this.showanotherscreen;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
    });
    this.initializeFormFields();

    combineLatest(
    this.getCertConfigFields(),
    this.getCourseDetails(_.get(this.queryParams, 'courseId')),
    this.getBatchDetails(_.get(this.queryParams, 'batchId')),
    this.getTemplateList(),
    ).subscribe((data) => {
      this.showLoader = false;
      const [cert, courseDetails, batchDetails, config] = data;
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
    return this.certificateService.fetchCertificatePreferences(request).pipe(
      tap((certRulesData) => {
        const dropDownValues = _.get(certRulesData, 'result.response.data.fields');
        const certTypes = dropDownValues.filter(data => {
          return data.code === 'certTypes';
        });
        this.certTypes = _.get(certTypes[0], 'range');

        const recipients = dropDownValues.filter(data => {
          return data.code === 'issueTo';
        });
        this.recipients = _.get(recipients[0], 'range');
      }),
      catchError(error => {
        return of({});
      })
    );
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
        this.batchDetails = batchDetails;
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

  addCertificate() {
    const request = {
      request: {
        courseId: _.get(this.queryParams, 'courseId'),
        batchId: _.get(this.queryParams, 'batchId'),
        key: 'abcd',
        orgId: _.get(this.userService, 'slug'),
        criteria: this.getCriteria(_.get(this.userPreference, 'value'))
      }
    };
    // make the api call to add certificate
    console.log('request layload', request);
  }

  getCriteria(rawDropdownValues) {
    const criteriaInstance = new CertConfigModel(
      { mode: ProcessingModes.PROCESS_DROPDOWNS, values: rawDropdownValues, rootOrgId: _.get(this.userService, 'userProfile.rootOrgId') }
    );
   return criteriaInstance._criteria;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
