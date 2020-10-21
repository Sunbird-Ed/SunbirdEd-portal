import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTemplateComponent } from './create-template.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { UserService, PlayerService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import * as _ from 'lodash-es';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { of } from 'rxjs';
describe('CreateTemplateComponent', () => {
  let component: CreateTemplateComponent;
  let fixture: ComponentFixture<CreateTemplateComponent>;
  configureTestSuite();

  const resourceBundle = {
    frmelmnts: {
  },
  messages: {

  }
};

const fakeActivatedRoute = {
  snapshot: {
    data: {
      telemetry: {
        env: 'certs',
        pageid: 'certificate-configuration',
        type: 'view',
        subtype: 'paginate',
        ver: '1.0'
      }
    }
  }
};

class RouterStub {
  public url = '/cert/configure/add';
  navigate = jasmine.createSpy('navigate');
}

const elementRefStub = {
  nativeElement: {
    'lang': 'en',
    'dir': 'ltr',
    style: {
      display: 'none'
    }
  }
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, CoreModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([]) ],
      declarations: [ CreateTemplateComponent ],
      providers: [
        ConfigService,
        NavigationHelperService,
        UtilService,
        BrowserCacheTtlService,
        ToasterService,
        TelemetryService,
        CacheService,
        UploadCertificateService,
        {provide: ResourceService, useValue: resourceBundle},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTemplateComponent);
    component = fixture.componentInstance;
    component.defaultCertificates = [
      { path: 'assets/images/mp.svg', id: 0 },
      { path: 'assets/images/odisha.svg', id: 1 },
      { path: 'assets/images/jh.svg', id: 2 }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should terminate all subscriptions', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('on init', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'setNavigationUrl').and.stub();
    component.ngOnInit();
    expect(navigationHelperService.setNavigationUrl).toHaveBeenCalled();
  });

  it('should enable create template button if all the form fields are filled.', () => {
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('Completion certificate'),
      stateName: new FormControl('Gujrat'),
      authoritySignature: new FormControl('vinu kumar'),
      authoritySignature2: new FormControl('Sudip Mukherjee'),
      allowPermission: new FormControl(true)
    });
    component.validateForm();
    expect(component.disableCreateTemplate).toEqual(false);
  });

  it('should not enable create template button if any of the form fields are not filled.', () => {
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl(''),
      stateName: new FormControl(''),
      authoritySignature: new FormControl(''),
      authoritySignature2: new FormControl(''),
      allowPermission: new FormControl('')
    });
    component.validateForm();
    expect(component.disableCreateTemplate).toEqual(true);
  });

  xit('should create the certificate template with all the ', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('Completion certificate'),
      stateName: new FormControl('Gujrat'),
      authoritySignature: new FormControl('vinu kumar'),
      authoritySignature2: new FormControl('Sudip Mukherjee'),
      allowPermission: new FormControl(true)
    });

    const request = new CertConfigModel().prepareCreateAssetRequest(_.get(component.createTemplateForm, 'value'));
    spyOn(uploadCertService, 'createCertTemplate').and.returnValue(of({}));
    component.createCertTemplate();

  });

});
