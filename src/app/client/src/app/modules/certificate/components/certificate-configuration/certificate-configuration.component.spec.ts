import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CertificateConfigurationComponent } from './certificate-configuration.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
import { CoreModule } from '@sunbird/core';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService,
  InterpolatePipe, SharedModule, IUserProfile } from '@sunbird/shared';
import { CertificateService, UserService, PlayerService, CertRegService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableThrowError, of } from 'rxjs';
import { response as CertMockResponse } from './certificate-configuration.component.spec.data';
import { configureTestSuite } from '@sunbird/test-util';

describe('CertificateConfigurationComponent', () => {
  let component: CertificateConfigurationComponent;
  let fixture: ComponentFixture<CertificateConfigurationComponent>;
  configureTestSuite();

  class RouterStub {
    public url = '/cert/configure/add';
    navigate = jasmine.createSpy('navigate');
  }

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
    },
    queryParams: of({
      type: 'edit',
      courseId: 'do_456789',
      batchId: '124631256'
    })
  };

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        Select: 'Select'
      },
      cert: {
        lbl: {
          preview: 'preview',
          certAddSuccess: 'Certificate added successfully',
          certUpdateSuccess: 'Certificate updated successfully.',
          certAddError: 'Failed to add the certificate. Try again later.',
          certEditError: 'Failed to edit the certificate. Try again later.'
        }
      }
    },
    messages: {
      emsg: {
        m0005: 'Something went wrong, try again later'
      }
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, CoreModule,
        FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }), SharedModule.forRoot()],
      declarations: [ CertificateConfigurationComponent],
      providers: [
        ConfigService,
        NavigationHelperService,
        UtilService,
        CertificateService,
        UserService,
        PlayerService,
        CertRegService,
        BrowserCacheTtlService,
        ToasterService,
        TelemetryService,
        {provide: ResourceService, useValue: resourceBundle},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateConfigurationComponent);
    component = fixture.componentInstance;
    component.screenStates = {'default': 'default', 'certRules': 'certRules' };
    fixture.detectChanges();
  });

  it('should terminate all subscriptions', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();

  });

  it('Should handle the "window.popstate" event', () => {
    spyOn(component, 'onPopState');
    const popStateEvent = new Event('popstate');
    window.dispatchEvent(popStateEvent);
    expect(component.onPopState).toHaveBeenCalledWith(popStateEvent);
  });

  it('Should reset isTemplateChanged property on cert preview close/No button click', () => {
    // Template changed state value
    component.isTemplateChanged = true;

    component.onPopState(new Event('popstate'));
    expect(component.isTemplateChanged).toBeFalsy();
  });

  it('Should the screen state to certRule on click of "Add certificate" button', () => {
    component.showLoader = false;
    fixture.detectChanges();
    const buttonEle = fixture.debugElement.nativeElement.querySelector('#addNewCert');
    buttonEle.click();
    expect(component.currentState).toEqual(component.screenStates.certRules);
  });

  it('Should go to default screen from certRules screen on click of back/cancel', () => {
    component.showLoader = false;
    component.currentState = component.screenStates.certRules;
    fixture.detectChanges();
    const buttonEle = fixture.debugElement.nativeElement.querySelector('#goBack');
    buttonEle.click();
    expect(component.currentState).toEqual(component.screenStates.default);
  });

  it('Should close cert configuration screen from cert default screen on click of back button', () => {
    /** Arrange */
    const navigationHelperService = TestBed.inject(NavigationHelperService);
    component.showLoader = false;
    component.currentState = component.screenStates.default;
    fixture.detectChanges();
    const buttonEle = fixture.debugElement.nativeElement.querySelector('#goBack');
    spyOn(navigationHelperService, 'navigateToLastUrl').and.stub();

    /** Act */
    buttonEle.click();

    const router = TestBed.inject(Router);
    component.navigateToCreateTemplate();
    expect(router.navigate).toHaveBeenCalledWith(['/learn/course/do_456789']);

    /** Assert */
    // expect(navigationHelperService.navigateToLastUrl).toHaveBeenCalled();
  });

  it('should call all the necessary method to get the required page data ready', () => {
    /* Arrange */
    const navigationHelperService = TestBed.inject(NavigationHelperService);
    spyOn(component, 'initializeLabels').and.stub();
    spyOn(navigationHelperService, 'setNavigationUrl').and.stub();
    spyOn(component, 'initializeFormFields').and.stub();

    /* Act */
    component.ngOnInit();

    /* Assert */
    expect(component.initializeLabels).toHaveBeenCalled();
    expect(component.currentState).toEqual('default');
    expect(navigationHelperService.setNavigationUrl).toHaveBeenCalled();
    expect(component.initializeFormFields).toHaveBeenCalled();
    expect(component.queryParams).toEqual({
      type: 'edit',
      courseId: 'do_456789',
      batchId: '124631256'
    });
    expect(component.configurationMode).toEqual('edit');
  });

  it('should fetch data from all the necessary apis and close the page-loader once data is ready', () => {
    /* Arrange */
    spyOn(component, 'getCourseDetails').and.returnValue(observableOf(CertMockResponse.courseData));
    spyOn(component, 'getBatchDetails').and.returnValue(observableOf(CertMockResponse.batchData));
    spyOn(component, 'getTemplateList').and.returnValue(observableOf(CertMockResponse.certTemplateListData));
    spyOn(component, 'getCertificateFormData').and.returnValue(observableOf(CertMockResponse.certificateFormData));

    /* Act */
    component.ngOnInit();

    /* Assert */
    expect(component.showLoader).toBeFalsy();
  });

  it('should send interact telemetry on click of add certificate to the batch', () => {
    /** Arrange */
    component.configurationMode = 'add';
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(component.sendInteractData).toHaveBeenCalledWith({
      id: 'attach-certificate'
    });
  });

  it('should send interact telemetry on click of update certificate to the batch', () => {
    /** Arrange */
    component.configurationMode = 'edit';
    spyOn(component, 'sendInteractData').and.stub();
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(component.sendInteractData).toHaveBeenCalledWith({
      id: 'confirm-template-change'
    });
  });

  it('should close template change modal if user changes template and make an update call', () => {
    /** Arrange */
    component.configurationMode = 'edit';
    component.isTemplateChanged = true;
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    const certRegService = TestBed.inject(CertRegService);
    const certificateService  = TestBed.inject(CertificateService);
    spyOn(component, 'sendInteractData').and.stub();
    spyOn(certRegService, 'addCertificateTemplate').and.returnValue(observableOf(CertMockResponse.certAddSuccess));
    spyOn(certificateService, 'getBatchDetails').and.returnValue(observableOf({}));
    spyOn(component, 'processCertificateDetails').and.stub();
    spyOn(component, 'goBack').and.stub();
    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(component.isTemplateChanged).toBeFalsy();
  });

  it('should show success toast message if user adds certificate', () => {
    /** Arrange */
    component.configurationMode = 'add';
    component.isTemplateChanged = true;
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    const certRegService = TestBed.inject(CertRegService);
    const certificateService  = TestBed.inject(CertificateService);
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(component, 'sendInteractData').and.stub();
    spyOn(certRegService, 'addCertificateTemplate').and.returnValue(observableOf(CertMockResponse.certAddSuccess));
    spyOn(certificateService, 'getBatchDetails').and.returnValue(observableOf({}));
    spyOn(component, 'processCertificateDetails').and.stub();
    spyOn(component, 'goBack').and.stub();
    spyOn(toasterService, 'success').and.stub();
    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(toasterService.success).toHaveBeenCalledWith('Certificate added successfully');
  });

  it('should show success toast message if user updates certificate', () => {
    /** Arrange */
    component.configurationMode = 'edit';
    component.isTemplateChanged = true;
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    const certRegService = TestBed.inject(CertRegService);
    const certificateService  = TestBed.inject(CertificateService);
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(component, 'sendInteractData').and.stub();
    spyOn(certRegService, 'addCertificateTemplate').and.returnValue(observableOf(CertMockResponse.certAddSuccess));
    spyOn(certificateService, 'getBatchDetails').and.returnValue(observableOf({}));
    spyOn(component, 'processCertificateDetails').and.stub();
    spyOn(component, 'goBack').and.stub();
    spyOn(toasterService, 'success').and.stub();
    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(toasterService.success).toHaveBeenCalledWith('Certificate updated successfully.');
  });

  it('should fetch updated batch details post adding / updating certificate', () => {
    /** Arrange */
    component.configurationMode = 'edit';
    component.isTemplateChanged = true;
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    const certRegService = TestBed.inject(CertRegService);
    const certificateService  = TestBed.inject(CertificateService);
    spyOn(component, 'sendInteractData').and.stub();
    spyOn(certRegService, 'addCertificateTemplate').and.returnValue(observableOf(CertMockResponse.certAddSuccess));
    spyOn(certificateService, 'getBatchDetails').and.returnValue(observableOf(CertMockResponse.batchDataWithCertificate));
    spyOn(component, 'processCertificateDetails').and.stub();
    spyOn(component, 'goBack').and.stub();
    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(component.batchDetails).toEqual(CertMockResponse.batchDataWithCertificate.result.response);

  });

  it('should process the certificate details and navigate back to first screen post adding / updating certificate', () => {
    /** Arrange */
    component.configurationMode = 'edit';
    component.isTemplateChanged = true;
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    const certRegService = TestBed.inject(CertRegService);
    const certificateService  = TestBed.inject(CertificateService);
    spyOn(component, 'sendInteractData').and.stub();
    spyOn(certRegService, 'addCertificateTemplate').and.returnValue(observableOf(CertMockResponse.certAddSuccess));
    spyOn(certificateService, 'getBatchDetails').and.returnValue(observableOf(CertMockResponse.batchDataWithCertificate));
    spyOn(component, 'processCertificateDetails').and.stub();
    spyOn(component, 'goBack').and.stub();
    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(component.processCertificateDetails).toHaveBeenCalledWith(
      CertMockResponse.batchDataWithCertificate.result.response.cert_templates);
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should show an error toast message if preference api fails', () => {
    /** Arrange */
    const certificateService  = TestBed.inject(CertificateService);
    const toasterService:any = TestBed.inject(ToasterService);
    const errorMsg = resourceBundle.messages.emsg.m0005;

    /** Assert */
    spyOn(certificateService, 'fetchCertificatePreferences').and.callFake(() => observableThrowError({errorMsg}));
    spyOn(toasterService, 'error').and.stub();
    /** Act */
    component.getCertConfigFields();

    /** Assert */
    expect(toasterService.error).toHaveBeenCalled();
  });


  it('should show  error toast message if fetching batch details fail', () => {
    /** Arrange */
    component.configurationMode = 'edit';
    component.isTemplateChanged = true;
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    const certRegService = TestBed.inject(CertRegService);
    const certificateService  = TestBed.inject(CertificateService);
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(component, 'sendInteractData').and.stub();
    spyOn(certRegService, 'addCertificateTemplate').and.returnValue(observableOf(CertMockResponse.certAddSuccess));
    spyOn(certificateService, 'getBatchDetails').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.stub();
    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });

  it('should show error toast message if adding certificate fails', () => {
    /** Arrange */
    component.configurationMode = 'add';
    component.isTemplateChanged = true;
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    const certRegService = TestBed.inject(CertRegService);
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(component, 'sendInteractData').and.stub();
    spyOn(certRegService, 'addCertificateTemplate').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.stub();
    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(toasterService.error).toHaveBeenCalledWith('Failed to add the certificate. Try again later.');
  });

  it('should show an error toast message if preference api fails', () => {
    /** Arrange */
    const userService:any = TestBed.inject(UserService);
    const certificateService  = TestBed.inject(CertificateService);
    const toasterService:any = TestBed.inject(ToasterService);
    userService._userData$.next({ err: null, userProfile: CertMockResponse.userMockData as any});
    userService._userProfile = CertMockResponse.userMockData;
    spyOn(certificateService, 'fetchCertificatePreferences').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.stub();

    /** Act */
    component.getCertConfigFields();

    /** Assert */
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });

  it('should show error toast message if updating certificate fails', () => {
    /** Arrange */
    component.configurationMode = 'edt';
    component.isTemplateChanged = true;
    component.selectedTemplate = {name: 'SOME_IDENTIFIER', 'issuer': '{}', 'signatoryList': '{}'};

    const certRegService = TestBed.inject(CertRegService);
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(component, 'sendInteractData').and.stub();
    spyOn(certRegService, 'addCertificateTemplate').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.stub();
    /** Act */
    component.attachCertificateToBatch();

    /** Assert */
    expect(toasterService.error).toHaveBeenCalledWith('Failed to edit the certificate. Try again later.');
  });

  // it('should process certificate details', () => {
  //   /** Arrange */
  //   spyOn(component, 'setCertEditable').and.stub();
  //   spyOn(component, 'processCriteria').and.stub();

  //   /** Act */
  //   component.processCertificateDetails(CertMockResponse.batchDataWithCertificate.result.response.cert_templates);

  //   /** Assert */
  //   // expect(component.selectedTemplate).toEqual({ name: 'mock_cert_identifier' });
  //   expect(component.templateIdentifier).toEqual('mock_cert_identifier');
  //   expect(component.previewUrl).toEqual('https://cert.svg');
  //   expect(component.setCertEditable).toHaveBeenCalled();
  //   expect(component.processCriteria).toHaveBeenCalledWith({
  //     'user': {
  //       'rootOrgId': '0124784842112040965'
  //     },
  //     'enrollment': {
  //       'status': 2
  //     }
  //   });
  // });

  it('should set the flag for the certificate to be editable', () => {
    /** Arrange */
    component.previewUrl = 'SOME_PREVIEW_URL';

    /** Act */
    component.setCertEditable();

    /** Assert */
    expect(component.certEditable).toBeTruthy();
  });

  it('should set the flag for the certificate to be non-editable', () => {
    /** Arrange */
    component.previewUrl = undefined;

    /** Act */
    component.setCertEditable();

    /** Assert */
    expect(component.certEditable).toBeFalsy();
  });

  it('should navigate to rules screen for editing the certificate', () => {
    /** Arrange */
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.editCertificate();

    /** Assert */
    expect(component.configurationMode).toEqual('edit');
    expect(component.currentState).toEqual('certRules');
    expect(component.sendInteractData).toHaveBeenCalledWith({id: 'edit-certificate'});
  });

  xit('should process the criteria to get the drop-down values', () => {
    /** Arrange */
    const mockCriteria = {
      'user': {
        'rootOrgId': '0124784842112040965'
      },
      'enrollment': {
        'status': 2
      }
    };

    /** Act */
    component.processCriteria(mockCriteria);

    /** Assert */
    expect(component.issueTo).toEqual([{
      name : 'My state teacher'
    }]);

  });

  it('should handle "select" click on hover certificate templates', () => {
    /** Arrange */
    const mockEvent = { name: 'select'};
    const mockTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    spyOn(component, 'validateForm').and.stub();
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.handleCertificateEvent( mockEvent, mockTemplate);

    /** Assert */
    expect(component.selectedTemplate).toEqual(mockTemplate);
    expect(component.config.remove.show).toBeTruthy();
    expect(component.config.select.show).toBeFalsy();
    expect(component.validateForm).toHaveBeenCalled();
    expect(component.sendInteractData).toHaveBeenCalledWith({id: 'select-template'});
  });

  it('should handle "remove" click on hover certificate templates', () => {
    /** Arrange */
    const mockEvent = { name: 'remove'};
    const mockTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    spyOn(component, 'validateForm').and.stub();
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.handleCertificateEvent( mockEvent, mockTemplate);

    /** Assert */
    expect(component.selectedTemplate).toEqual({});
    expect(component.config.select.show).toBeTruthy();
    expect(component.config.remove.show).toBeFalsy();
    expect(component.validateForm).toHaveBeenCalled();
    expect(component.sendInteractData).toHaveBeenCalledWith({id: 'unselect-template'});
  });

  it('should handle "preview" click on hover certificate templates', () => {
    /** Arrange */
    const mockEvent = { name: 'preview'};
    const mockTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    spyOn(component, 'validateForm').and.stub();
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.handleCertificateEvent( mockEvent, mockTemplate);

    /** Assert */
    expect(component.previewTemplate).toEqual(mockTemplate);
    expect(component.showPreviewModal).toBeTruthy();
    expect(component.sendInteractData).toHaveBeenCalledWith({id: 'preview-template'});
  });

  it('should fetch the configs for "select" hover button', () => {
    /** Arrange */
    const mockTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    const mocConfig = {show: true, label: 'select', name: 'select'};

    /** Act */
    component.getConfig(mocConfig, mockTemplate);

    /** Assert */
    expect(component.getConfig(mocConfig, mockTemplate)).toEqual(jasmine.objectContaining({
      show: false,
      label: 'select',
      name: 'select'
    }));
  });

  it('should fetch the configs for hover buttons other than "select"', () => {
    /** Arrange */
    const mockTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    component.selectedTemplate = { name: 'SOME_MOCK_TEMPLATE'};
    const mocConfig = {show: true, label: 'preview', name: 'preview'};

    /** Act */
    component.getConfig(mocConfig, mockTemplate);

    /** Assert */
    expect(component.getConfig(mocConfig, mockTemplate)).toEqual(jasmine.objectContaining({
      show: true,
      label: 'preview',
      name: 'preview'
    }));
  });

  it('should close preview modal if user clicks "Select template" from preview popup', () => {
    /** Arrange */
    const mockEvent = {
      name: 'select',
      template: {name: 'SOME_TEMPLATE'}
    };
    spyOn(component, 'validateForm').and.stub();
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.closeModal(mockEvent);

    /** Assert */
   expect(component.showPreviewModal).toBeFalsy();
   expect(component.selectedTemplate).toEqual({name: 'SOME_TEMPLATE'});
   expect(component.validateForm).toHaveBeenCalled();
   expect(component.sendInteractData).toHaveBeenCalledWith({id: 'select-template'});
  });

  it('should close preview modal if user clicks "close" from preview popup', () => {
    /** Arrange */
    const mockEvent = {
    };
    component.selectedTemplate = { name: 'SOME_PRE_SELECTED_TEMPLATE' };
    spyOn(component, 'validateForm').and.stub();
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.closeModal(mockEvent);

    /** Assert */
   expect(component.showPreviewModal).toBeFalsy();
   expect(component.selectedTemplate).toEqual({ name: 'SOME_PRE_SELECTED_TEMPLATE' });
   expect(component.validateForm).toHaveBeenCalled();
   expect(component.sendInteractData).toHaveBeenCalledWith({id: 'close-preview'});
  });

  it('should close template detect modal', () => {
    /** Arrange */
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.closeTemplateDetectModal();

    /** Assert */
    expect(component.isTemplateChanged).toBeFalsy();
    expect(component.sendInteractData).toHaveBeenCalledWith({id: 'cancel-template-change' });
  });

  it('should navigate to cert rules screen', () => {
    /** Arrange */
    spyOn(component, 'sendInteractData').and.stub();

    /** Act */
    component.navigateToCertRules();

    /** Assert */
    expect(component.currentState).toEqual('certRules');
    expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'add-certificate' });
  });

  it('should reset the selected form fields and template for "add certificate" scenario', () => {
    /** Arrange */
    component.userPreference = new FormGroup({
        certificateType: new FormControl('Completion certificate'),
        issueTo: new FormControl('My state teacher'),
        allowPermission: new FormControl(true)
      });
      component.configurationMode = 'add';
      spyOn(component, 'sendInteractData').and.stub();
      spyOn(component.userPreference, 'reset');

    /** Act */
    component.cancelSelection();

    /** Assert */
    expect(component.currentState).toEqual('default');
    expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'cancel-add-certificate' });
    expect(component.userPreference.reset).toHaveBeenCalled();
    expect(component.selectedTemplate).toEqual({});
  });

  it('should reset the selected form fields and template for "update certificate" scenario', () => {
    /** Arrange */
    component.batchDetails = CertMockResponse.batchDataWithCertificate.result.response;
    component.userPreference = new FormGroup({
        certificateType: new FormControl('Completion certificate'),
        issueTo: new FormControl('My state teacher'),
        allowPermission: new FormControl(true)
      });
      component.configurationMode = 'edit';
      spyOn(component, 'sendInteractData').and.stub();
      spyOn(component, 'processCertificateDetails').and.stub();

    /** Act */
    component.cancelSelection();

    /** Assert */
    expect(component.currentState).toEqual('default');
    expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'cancel-update-certificate' });
    expect(component.processCertificateDetails).toHaveBeenCalledWith(
      CertMockResponse.batchDataWithCertificate.result.response.cert_templates);
  });

  it('should send telemetry impression event', () => {
    /** Arrange */
    const navigationHelperService = TestBed.inject(NavigationHelperService);
    const telemetryService = TestBed.inject(TelemetryService);
    spyOn(navigationHelperService, 'getPageLoadTime').and.returnValue(10);
    spyOn(telemetryService, 'impression').and.stub();
    const mockTelemetryImpressionData = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Batch',
          id: '124631256'
        },
        {
          type: 'Course',
          id: 'do_456789'
        }]
      },
      edata: {
        type: fakeActivatedRoute.snapshot.data.telemetry.type,
        subtype: fakeActivatedRoute.snapshot.data.telemetry.subtype,
        pageid: fakeActivatedRoute.snapshot.data.telemetry.pageid,
        uri: '/cert/configure/add',
        duration: 10
      }
    };

    /** Act */
    component.setTelemetryImpressionData();

    /**Assert */
    expect(telemetryService.impression).toHaveBeenCalledWith(mockTelemetryImpressionData);
  });

  it('should send telemetry interact event for all the clicks on "add certificate" mode', () => {
    /** Arrange */
    component.configurationMode = 'add';
    const mockInteractData = {id: 'add-certificate'};
    const telemetryService = TestBed.inject(TelemetryService);
    spyOn(telemetryService, 'interact').and.stub();
    const mockTelemetryInteractObject = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Batch',
          id: '124631256'
        },
        {
          type: 'Course',
          id: 'do_456789'
        }]
      },
      edata: {
        id: 'add-certificate',
        type: 'CLICK',
        pageid: fakeActivatedRoute.snapshot.data.telemetry.pageid
      }
    };

    /** Act */
    component.sendInteractData(mockInteractData);

    /** Assert */
    expect(telemetryService.interact).toHaveBeenCalledWith(mockTelemetryInteractObject);
  });

  it('should send telemetry interact event for all the clicks on "edit certificate" mode', () => {
    /** Arrange */
    component.configurationMode = 'edit';
    component.selectedTemplate = {name: 'SOME_MOCK_TEMPLATE'};
    const mockInteractData = {id: 'add-certificate'};
    const telemetryService = TestBed.inject(TelemetryService);
    spyOn(telemetryService, 'interact').and.stub();
    const mockTelemetryInteractObject = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Batch',
          id: '124631256'
        },
        {
          type: 'Course',
          id: 'do_456789'
        }]
      },
      edata: {
        id: 'add-certificate',
        type: 'CLICK',
        pageid: fakeActivatedRoute.snapshot.data.telemetry.pageid
      },
      object: {
        id: 'SOME_MOCK_TEMPLATE',
        type: 'Certificate',
        ver: '1.0',
        rollup: { l1: 'do_456789' }
      }
    };

    /** Act */
    component.sendInteractData(mockInteractData);

    /** Assert */
    expect(telemetryService.interact).toHaveBeenCalledWith(mockTelemetryInteractObject);
  });

  it('should navigate to create-template page', () => {
    const router = TestBed.inject(Router);
    component.navigateToCreateTemplate();
    expect(router.navigate).toHaveBeenCalledWith(['/certs/configure/create-template'], {queryParams: { type: 'edit', courseId: 'do_456789', batchId: '124631256' }});
  });
  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.redoLayout();
    component.layoutConfiguration = null;
    component.redoLayout();
  });
  it('should call handleParameterChange method with event as All', () => {
    const eventAll = 'All';
    component.handleParameterChange(eventAll);
    expect(component.isStateCertificate).toBeFalsy();
  });
  it('should call handleParameterChange method with event as teacher', () => {
    const event = 'My state teacher';
    component.handleParameterChange(event);
    expect(component.isStateCertificate).toBeTruthy();
  });

});
