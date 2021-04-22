import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, PublicDataService } from '@sunbird/core';
import { ResourceService, SharedModule, UtilService } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { of, throwError } from 'rxjs';
import { FaqService } from '../../services/faq/faq.service';
import { FaqComponent } from './faq.component';
import { RESPONSE } from './faq.component.spec.data';
import { FaqData } from './faq-data';
import { HttpClient } from '@angular/common/http';


describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;
  let location: Location;
  let router: Router;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {},
      'stmsg': {},
      'emsg': {},
    },
    'frmelmnts': {
      'lbl': {},
    }
  };

  class FakeActivatedRoute {
    snapshot = {
      params: { slug: 'ap' },
      data: {
        telemetry: { env: 'help', pageid: 'faq', type: 'view' }
      }
    };
    root = {
      firstChild: {
        snapshot: {
          data: {
            telemetry: { env: 'help', pageid: 'faq', type: 'view' }
          }
        }
      }
    };
  }

  class FakeUtilService {
    public isDesktopApp = false;
    public languageChange = of({ value: 'en' });
    public changePlatform = () => { this.isDesktopApp = true; };
    public getAppBaseUrl = () => 'https://locahost:3000' ;
  }

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, TelemetryModule.forRoot(), RouterTestingModule],
      declarations: [FaqComponent],
      providers: [Location, { provide: ResourceService, useValue: resourceBundle },
        { provide: UtilService, useClass: FakeUtilService },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }, FaqService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    spyOn(component['http'], 'get').and.callFake(() => {
      if (!component.defaultToEnglish) {
        return throwError({ status: 404 });
      }
      return of({});
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const faqService = TestBed.get(FaqService);
    const httpService = TestBed.get(HttpClient);
    httpService.get.and.returnValue(of(FaqData));
    spyOn(component, 'setTelemetryImpression');
    spyOn(component, 'initLayout');
    spyOn(faqService, 'getFaqJSON').and.returnValues(of(RESPONSE.faqJson));
    component.ngOnInit();
    expect(component.setTelemetryImpression).toHaveBeenCalled();
    expect(component.initLayout).toHaveBeenCalled();
    expect(component.faqBaseUrl).toEqual('https://test/test');
  });

  it('should call ngOnInit and get success for getting faq json file', () => {
    component.faqData = FaqData;
    const faqService = TestBed.get(FaqService);
    const httpService = TestBed.get(HttpClient);
    httpService.get.and.returnValue(of(FaqData));
    spyOn(component, 'setTelemetryImpression');
    spyOn(component, 'initLayout');
    spyOn(faqService, 'getFaqJSON').and.returnValues(of(RESPONSE.faqJson));
    component.ngOnInit();
    expect(component.showLoader).toBeFalsy();
  });

  it('should call ngOnInit and get 404 for getting faq json file', () => {
    const faqService = TestBed.get(FaqService);
    const httpService = TestBed.get(HttpClient);
    httpService.get.and.returnValue(of(FaqData));
    spyOn(component, 'setTelemetryImpression');
    spyOn(component, 'initLayout');
    spyOn(faqService, 'getFaqJSON').and.returnValues(of(RESPONSE.faqJson));
    // spyOn(component['http'], 'get').and.callFake(() => throwError({ status: 404 }));
    component.ngOnInit();
    expect(component.selectedLanguage).toEqual('en');
  });

  it('should call setTelemetryInteractEdata', () => {
    const resp = component.setTelemetryInteractEdata('help-center');
    expect(resp).toEqual({ id: 'help-center', type: 'click', pageid: 'faq' });
  });

  it('should call logInteractEvent', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.logInteractEvent({ data: '' }, 'toggle-clicked');
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('should call setTelemetryImpression', () => {
    component.setTelemetryImpression();
    expect(component.telemetryImpression).toBeDefined();
  });

  it('should call getDesktopFAQ on success', () => {
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(of({ result: { faqs: {} } }));
    component['getDesktopFAQ']('hi');
    expect(component.showLoader).toBe(false);
    expect(component.faqData).toEqual({});
    expect(component.defaultToEnglish).toBe(false);
  });

  it('call ngOnInit for desktopApp', () => {
    const utilService = TestBed.get(UtilService);
    utilService.changePlatform();
    spyOn<any>(component, 'getDesktopFAQ');
    component.ngOnInit();
    expect(component['getDesktopFAQ']).toHaveBeenCalled();
  });

  it('should call goBack', () => {
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

});
