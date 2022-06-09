import { SignupEmailPasswordComponent } from './signup-email-password.component';
import { Component, OnInit, EventEmitter, OnDestroy, AfterViewInit, ViewChild, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import {
  ResourceService,
  ConfigService,
  ServerResponse,
  ToasterService,
  NavigationHelperService,
  UtilService,
  RecaptchaService
} from '@sunbird/shared';
import { SignupService } from './../../services';
import { TenantService, TncService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';

describe('SignupEmailPasswordComponent', () => {
  let component: SignupEmailPasswordComponent;
  const mockFormBuilder : Partial<FormBuilder> = {};
  const mockResourceService : Partial<ResourceService> = {};
  const mockSignupService : Partial<SignupService> = {};
  const mockToasterService : Partial<ToasterService> = {};
  const mockTenantService : Partial<TenantService> = {};
  const mockDeviceDetectorService : Partial<DeviceDetectorService> = {};
  const mockActivatedRoute : Partial<ActivatedRoute> = {};
  const mockTelemetryService : Partial<TelemetryService> = {};
  const mockNavigationHelperService : Partial<NavigationHelperService> = {};
  const mockUtilService : Partial<UtilService> = {};
  const mockConfigService : Partial<ConfigService> = {};
  const mockRecaptchaService : Partial<RecaptchaService> = {};
  const mockTncService : Partial<TncService> = {};
  beforeAll(() => {
    component = new SignupEmailPasswordComponent(
      mockFormBuilder as FormBuilder, 
      mockResourceService as ResourceService,
      mockSignupService as SignupService,
      mockToasterService as ToasterService,
      mockTenantService as TenantService,
      mockDeviceDetectorService as DeviceDetectorService,
      mockActivatedRoute as ActivatedRoute,
      mockTelemetryService as TelemetryService,
      mockNavigationHelperService as NavigationHelperService,
      mockUtilService as UtilService,
      mockConfigService as ConfigService,
      mockRecaptchaService as RecaptchaService,
      mockTncService as TncService
    );
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
