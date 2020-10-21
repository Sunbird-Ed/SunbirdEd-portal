import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTemplateComponent } from './create-template.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { CertConfigModel } from './../../models/cert-config-model/cert-config-model';
import * as _ from 'lodash-es';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { of, throwError, observable } from 'rxjs';
import { MockData } from './create-template.component.spec.data';
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

  it('should create the certificate template with all the form values', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('Completion certificate'),
      stateName: new FormControl('Gujrat'),
      authoritySignature: new FormControl('vinu kumar'),
      authoritySignature2: new FormControl('Sudip Mukherjee'),
      allowPermission: new FormControl(true)
    });
    spyOn(component, 'uploadTemplate');
    spyOn(component, 'previewCertificate').and.stub();
    spyOn(new CertConfigModel(), 'prepareCreateAssetRequest').and.stub();
    spyOn(uploadCertService, 'createCertTemplate').and.returnValue(of(MockData.create));

    component.createCertTemplate();

    expect(component.disableCreateTemplate).toEqual(true);
    expect(component.uploadTemplate).toHaveBeenCalledWith(component.finalSVGurl, MockData.create.result.identifier);
  });

  it('should not create the certificate template with all the form values', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    const toasterService = TestBed.get(ToasterService);
    component.createTemplateForm = new FormGroup({
      certificateTitle: new FormControl('Completion certificate'),
      stateName: new FormControl('Gujrat'),
      authoritySignature: new FormControl('vinu kumar'),
      authoritySignature2: new FormControl('Sudip Mukherjee'),
      allowPermission: new FormControl(true)
    });
    spyOn(component, 'uploadTemplate');
    spyOn(component, 'previewCertificate').and.stub();
    spyOn(toasterService, 'error').and.stub();
    spyOn(new CertConfigModel(), 'prepareCreateAssetRequest').and.stub();
    spyOn(uploadCertService, 'createCertTemplate').and.callFake(() => throwError({}));
    component.createCertTemplate();
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, please try again later');
  });

  it('should upload the final certificate svg image', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.stub();
    spyOn(navigationHelperService, 'navigateToLastUrl').and.stub();
    spyOn(uploadCertService, 'uploadTemplate').and.returnValue(of({}));
    component.uploadTemplate(MockData.imageUrlData.id, 'SOME_DO_ID');
    expect(toasterService.success).toHaveBeenCalledWith('Template created successfully');
    expect(navigationHelperService.navigateToLastUrl).toHaveBeenCalled();
  });

  it('should not upload the final certificate svg image', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    spyOn(uploadCertService, 'uploadTemplate').and.callFake(() => throwError({}));
    component.uploadTemplate(MockData.imageUrlData.id, 'SOME_DO_ID');
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, please try again later');
  });

  it('should close the browse', () => {
    component.close();
    expect(component.showSelectImageModal).toEqual(false);
    expect(component.showUploadUserModal).toEqual(false);
  });

  it('should remove the selected logo', () => {
    component.certLogos = [
      {
        id: '123'
      },
      {
        id: '456'
      },
      {
        id: '789'
      }
    ];
    component.removeLogo(1);
    expect(component.certLogos).toEqual([
      {
        id: '123'
      },
      {
        id: '789'
      }
    ]);
  });

  it('should remove the selected sign', () => {
    component.certSigns = [
      {
        id: '123'
      },
      {
        id: '456'
      },
      {
        id: '789'
      }
    ];
    component.removeSigns(1);
    expect(component.certSigns).toEqual([
      {
        id: '123'
      },
      {
        id: '789'
      }
    ]);
  });

});
