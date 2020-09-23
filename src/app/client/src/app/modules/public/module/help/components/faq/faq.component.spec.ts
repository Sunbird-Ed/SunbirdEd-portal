import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FaqComponent } from './faq.component';
import { ResourceService, SharedModule, UtilService } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RESPONSE } from './faq.component.spec.data';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FaqService } from '../../services/faq/faq.service';
import { BehaviorSubject, throwError, of, of as observableOf } from 'rxjs';


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
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, TelemetryModule.forRoot(), RouterTestingModule],
      declarations: [FaqComponent],
      providers: [Location, { provide: ResourceService, useValue: resourceBundle },
        UtilService,
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
    spyOn(component, 'setTelemetryImpression');
    spyOn(component, 'initLayout');
    spyOn(faqService, 'getFaqJSON').and.returnValues(of(RESPONSE.faqJson));
    component.ngOnInit();
    expect(component.setTelemetryImpression).toHaveBeenCalled();
    expect(component.initLayout).toHaveBeenCalled();
    expect(component.faqBaseUrl).toEqual('https://test/test');
  });

  it('should call ngOnInit and get success for getting faq json file', () => {
    const faqService = TestBed.get(FaqService);
    spyOn(component, 'setTelemetryImpression');
    spyOn(component, 'initLayout');
    spyOn(faqService, 'getFaqJSON').and.returnValues(of(RESPONSE.faqJson));
    component.ngOnInit();
    expect(component.showLoader).toBeFalsy();
  });

  it('should call ngOnInit and get 404 for getting faq json file', () => {
    const faqService = TestBed.get(FaqService);
    spyOn(component, 'setTelemetryImpression');
    spyOn(component, 'initLayout');
    spyOn(faqService, 'getFaqJSON').and.returnValues(of(RESPONSE.faqJson));
    // spyOn(component['http'], 'get').and.callFake(() => throwError({ status: 404 }));
    component.ngOnInit();
    expect(component.selectedLanguage).toEqual('en');
  });
});
