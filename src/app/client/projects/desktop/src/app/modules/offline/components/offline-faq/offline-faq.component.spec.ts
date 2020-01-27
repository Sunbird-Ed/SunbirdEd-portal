import { testDataSet1, testDataSet2, testDataSet3, testDataSet4 } from './offline-faq.component.spec.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OfflineFaqComponent } from './offline-faq.component';
import { CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';

describe('OfflineFaqComponent', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'help',
          pageid: 'help'
        }
      }
    };
  }
  const resourceBundle = {
    languageSelected$: new Subject(),
    frmelmnts: {
      lbl: {
        faqheader: 'Frequently asked questions'
      }
    }
  };
  let component: OfflineFaqComponent;
  let fixture: ComponentFixture<OfflineFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineFaqComponent ],
      providers: [
          { provide: Router, useClass: RouterStub },
          { provide: ActivatedRoute, useClass: ActivatedRouteStub },
          { provide: ResourceService, useValue: resourceBundle }
        ],
        imports: [CommonConsumptionModule, SharedModule.forRoot(), CoreModule, HttpClientTestingModule, TelemetryModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show faq header label obtained from resourceService', () => {
    const value = fixture.debugElement.query(By.css('h4')).nativeElement.innerText;
    expect(value).toEqual(resourceBundle.frmelmnts.lbl.faqheader);
  });
  it('should trigger interact event for toggle-clicked event from "sb-faq" component', () => {
    const spy = spyOn(component.telemetryService, 'interact').and.returnValue('');
    component.handleEvents(testDataSet1.childEvent);
    expect(spy).toHaveBeenCalledWith(testDataSet1.telemetryEvent);
  });
  it('should trigger interact event for yes-clicked event from "sb-faq" component', () => {
    const spy = spyOn(component.telemetryService, 'interact').and.returnValue('');
    component.handleEvents(testDataSet2.childEvent);
    expect(spy).toHaveBeenCalledWith(testDataSet2.telemetryEvent);
  });
  it('should trigger interact event for no-clicked event from "sb-faq" component', () => {
    const spy = spyOn(component.telemetryService, 'interact').and.returnValue('');
    component.handleEvents(testDataSet3.childEvent);
    expect(spy).toHaveBeenCalledWith(testDataSet3.telemetryEvent);
  });
  it('should trigger interact event for submit-clicked event from "sb-faq" component', () => {
    const spy = spyOn(component.telemetryService, 'interact').and.returnValue('');
    component.handleEvents(testDataSet4.childEvent);
    expect(spy).toHaveBeenCalledWith(testDataSet4.telemetryEvent);
  });
  it('should fetch language specific api when language changes', () => {
    const spy = spyOn(component, 'fetchFaqs').and.returnValue('');
    resourceBundle.languageSelected$.next({value: 'an'});
    expect(spy).toHaveBeenCalledWith('an');
  });
  it('should fetch en faqs when faqs not found for selected language', () => {
    const spy = spyOn(component, 'fetchFaqs').and.callThrough();
    spyOn(component.publicDataService, 'get').and.callFake((data) => throwError({}));
    resourceBundle.languageSelected$.next({value: 'an'});
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('an');
    expect(spy).toHaveBeenCalledWith('en');
  });
});
