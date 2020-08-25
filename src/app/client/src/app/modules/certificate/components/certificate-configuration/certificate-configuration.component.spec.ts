import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateConfigurationComponent } from './certificate-configuration.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { CertificateService, UserService, PlayerService, CertRegService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableThrowError, of } from 'rxjs';
import { response as CertMockResponse } from './certificate-configuration.component.spec.data';

describe('CertificateConfigurationComponent', () => {
  let component: CertificateConfigurationComponent;
  let fixture: ComponentFixture<CertificateConfigurationComponent>;

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
        Select: 'Select',
      },
      cert: {
        lbl: {
          preview: 'preview',
        }
    }
  },
  messages: {
    emsg: {
      m0005: 'Something went wrong, try again later'
    }
  }
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, CoreModule,
        FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [ CertificateConfigurationComponent ],
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
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
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
    const navigationHelperService = TestBed.get(NavigationHelperService);
    component.showLoader = false;
    component.currentState = component.screenStates.default;
    fixture.detectChanges();
    const buttonEle = fixture.debugElement.nativeElement.querySelector('#goBack');
    spyOn(navigationHelperService, 'navigateToLastUrl').and.stub();

    /** Act */
    buttonEle.click();

    /** Assert */
    expect(navigationHelperService.navigateToLastUrl).toHaveBeenCalled();
  });

  it('should call all the necessary method to get the required page data ready', () => {
    /* Arrange */
    const navigationHelperService = TestBed.get(NavigationHelperService);
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

    /* Act */
    component.ngOnInit();

    /* Assert */
    expect(component.showLoader).toBeFalsy();
  });

  it('should close the page-loader if any of the apis fail and show an error toast message', () => {
    /* Arrange */
    const toasterService = TestBed.get(ToasterService);
    spyOn(component, 'getCourseDetails').and.callFake(() => observableThrowError({}));
    spyOn(component, 'getBatchDetails').and.returnValue(observableOf(CertMockResponse.batchData));
    spyOn(component, 'getTemplateList').and.returnValue(observableOf(CertMockResponse.certTemplateListData));
    spyOn(toasterService, 'error').and.stub();

    /* Act */
    component.ngOnInit();

    /* Assert */
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });

  it('should fetch the drop-down values for "Certificate type" and "Issue to" from preference api', () => {
    /** Arrange */
    const userService = TestBed.get(UserService);
    const certificateService  = TestBed.get(CertificateService);
    spyOnProperty(userService, 'slug', 'get').and.returnValue('tn');
    spyOn(certificateService, 'fetchCertificatePreferences').and.returnValue(observableOf(CertMockResponse.certRulesData));

    /** Act */
    component.getCertConfigFields();

    /** Assert */
    expect(component.certTypes).toEqual([
      {
        'name': 'Completion certificate',
        'value': {
          'enrollment': {
            'status': 2
          }
        }
      },
      {
        'name': 'Merit certificate',
        'value': {
          'score': '>= 60'
        }
      }
    ]);

    expect(component.issueTo).toEqual([
      {
        'name': 'All',
        'value': {
          'user': {
            'rootid': ''
          }
        }
      },
      {
        'name': 'My state teacher',
        'rootOrgId': ''
      }
    ]);
  });

  it('should show an error toast message if preference api fails', () => {
    /** Arrange */
    const userService = TestBed.get(UserService);
    const certificateService  = TestBed.get(CertificateService);
    const toasterService = TestBed.get(ToasterService);
    spyOnProperty(userService, 'slug', 'get').and.returnValue('tn');
    spyOn(certificateService, 'fetchCertificatePreferences').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.stub();

    /** Act */
    component.getCertConfigFields();

    /** Assert */
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });

  it('should fetch the list of certificate templates from preference api', () => {
    /** Arrange */
    const userService = TestBed.get(UserService);
    const certificateService  = TestBed.get(CertificateService);
    spyOnProperty(userService, 'slug', 'get').and.returnValue('tn');
    spyOn(certificateService, 'fetchCertificatePreferences').and.returnValue(observableOf(CertMockResponse.certTemplateListData));

    /** Act */
    component.getTemplateList();

    /** Assert */
    component.getTemplateList().subscribe( data => {
      expect(component.certTemplateList).toEqual([
        {
          'name': 'sunbirdtemplate',
          'displayName': '',
          'value': 'https://sunbirddev.blob.core.windows.net/e-credentials/svgcerts/cert.svg',
          'index': 1
        },
        {
          'name': 'template_21',
          'displayName': '',
          'value': 'https://sunbirddev.blob.core.windows.net/e-credentials/svgcerts/cert.svg',
          'index': 2
        }
      ]);
    });
  });

  it('should return empty observable if preference api fails to fetch cert template list', () => {
    /** Arrange */
    const userService = TestBed.get(UserService);
    const certificateService  = TestBed.get(CertificateService);
    spyOnProperty(userService, 'slug', 'get').and.returnValue('tn');
    spyOn(certificateService, 'fetchCertificatePreferences').and.callFake(() => observableThrowError({}));

    /** Act */
    component.getTemplateList();

    /** Assert */
    component.getTemplateList().subscribe( data => {
      expect(component.getTemplateList).toEqual(jasmine.objectContaining({}));
    });
  });

  it(`should fetch batch details and get the drop-down values if
        "certificate_template" object does not exist on the batch details `, () => {
    /** Arrange */
    const certificateService  = TestBed.get(CertificateService);
    spyOn(certificateService, 'getBatchDetails').and.returnValue(observableOf(CertMockResponse.batchData));
    spyOn(component, 'getCertConfigFields').and.stub();

    /** Act */
    component.getBatchDetails('123466789');

    /** Assert */
    component.getBatchDetails('123466789').subscribe( data => {
      expect(component.batchDetails).toEqual(CertMockResponse.batchData.result.response);
      expect(component.getCertConfigFields).toHaveBeenCalled();
    });
  });

  it(`should fetch batch details and process the certificate details if "certificate_template" exists on the batch details `, () => {
    /** Arrange */
    const certificateService  = TestBed.get(CertificateService);
    spyOn(certificateService, 'getBatchDetails').and.returnValue(observableOf(CertMockResponse.batchDataWithCertificate));
    spyOn(component, 'processCertificateDetails').and.stub();

    /** Act */
    component.getBatchDetails('123466789');

    /** Assert */
    component.getBatchDetails('123466789').subscribe( data => {
      expect(component.batchDetails).toEqual(CertMockResponse.batchDataWithCertificate.result.response);
      expect(component.processCertificateDetails).
      toHaveBeenCalledWith(CertMockResponse.batchDataWithCertificate.result.response.cert_templates);
    });
  });

  it('should fetch the course details', () => {
    /** Arrange */
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue(observableOf(CertMockResponse.courseData));

    /** Act */
    component.getCourseDetails('do_123456');

    /** Assert */
    component.getCourseDetails('do_123456').subscribe( data => {
      expect(component.courseDetails).toEqual(CertMockResponse.courseData.result.content);
    });
  });
});
