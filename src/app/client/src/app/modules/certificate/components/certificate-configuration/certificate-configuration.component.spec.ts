import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateConfigurationComponent } from './certificate-configuration.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { CertificateService, UserService, PlayerService, CertRegService } from '@sunbird/core';
// import { By } from '@angular/platform-browser';
// import { queryDebugElement } from 'src/app/testUtil/test-helper';
import { TelemetryService } from '@sunbird/telemetry';
import { of } from 'rxjs';

describe('CertificateConfigurationComponent', () => {
  let component: CertificateConfigurationComponent;
  let fixture: ComponentFixture<CertificateConfigurationComponent>;
  let navigationHelperService: NavigationHelperService;
  let de: DebugElement;

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
    queryParams: of({})
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
    navigationHelperService = TestBed.get(NavigationHelperService);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
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
    // let de = fixture.debugElement;
    // queryDebugElement(de, 'addNewCert');
    component.showLoader = false;
    // component.batchDetails = jasmine.createSpyObj({"cert_templates": {"name": "certName"}});
    fixture.detectChanges();
    const buttonEle = fixture.debugElement.nativeElement.querySelector('#addNewCert');
    buttonEle.click();
    expect(component.currentState).toEqual(component.screenStates.certRules);
  });

  it('Should go to default screen from certRules screen on click of back/cancel', () => {
    // let de = fixture.debugElement;
    // queryDebugElement(de, 'addNewCert');
    component.showLoader = false;
    // component.batchDetails = jasmine.createSpyObj({"cert_templates": {"name": "certName"}});
    component.currentState = component.screenStates.certRules;
    fixture.detectChanges();
    const buttonEle = fixture.debugElement.nativeElement.querySelector('#goBack');
    buttonEle.click();
    expect(component.currentState).toEqual(component.screenStates.default);
  });

  xit('Should close cert configuration screen from cert default screen on click of back button', () => {
    // let de = fixture.debugElement;
    // queryDebugElement(de, 'addNewCert');
    component.ngOnInit();
    component.showLoader = false;
    component.currentState = component.screenStates.default;
    fixture.detectChanges();
    const buttonEle = fixture.debugElement.nativeElement.querySelector('#goBack');
    buttonEle.click();
    expect(component.navigationHelperService.navigateToLastUrl).toHaveBeenCalled();
  });
});
