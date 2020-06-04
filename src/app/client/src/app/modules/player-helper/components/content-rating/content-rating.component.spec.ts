import { ComponentFixture, TestBed , async} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { ContentRatingComponent } from './content-rating.component';
import { FormService, CoreModule } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { mockData } from './content-rating.component.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
describe('ContentRatingComponent', () => {

  let component: ContentRatingComponent;
  let fixture: ComponentFixture<ContentRatingComponent>;
  configureTestSuite();
  beforeEach(() => {
    const resourceServiceStub = {
      languageSelected$: of({}),
      messages: {
      smsg: { m0050: 'Thank you for rating this content!' } },
      frmelmnts: {
        lbl: {
          defaultstar: 'Tap on stars to rate the content'
        }
      }
    };
    const activatedRouteStub = {
      snapshot: { data: { telemetry: {
        env: 'library', pageid: 'content-player', type: 'play'
      } }, params: {'contentId': 'do_20083743'} }
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ContentRatingComponent],
      providers: [TelemetryService, ToasterService, ConfigService, FormService, CacheService,
        BrowserCacheTtlService,
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    });
    fixture = TestBed.createComponent(ContentRatingComponent);
    component = fixture.componentInstance;
    const formService = TestBed.get(FormService);
    const formServiceInputParams = {
      formType: 'contentfeedback',
      formAction: 'get',
      contentType: 'en'
    };
    formService.getFormConfig(formServiceInputParams);
    component.feedbackObj = mockData.feedbackResult;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('set default star rating text on init of component', () => {
    component.ngOnInit();
    expect(component.startext).toBe('Tap on stars to rate the content');
  });

  it('should call ratingChange and set the contentRating to 1 Star', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    component.ratingChange(1);
    expect(component.enableSubmitBtn).toBeTruthy();
    expect(component.contentRating).toEqual(1);
  });

  it('should call ratingChange and set the contentRating to 2 Star', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    component.ratingChange(2);
    expect(component.enableSubmitBtn).toBeTruthy();
    expect(component.contentRating).toEqual(2);
  });

  it('should call ratingChange and set the contentRating to 3 Star', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    component.ratingChange(3);
    expect(component.enableSubmitBtn).toBeTruthy();
    expect(component.contentRating).toEqual(3);
  });

  it('should call ratingChange and set the contentRating to 4 Star', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    component.ratingChange(4);
    expect(component.enableSubmitBtn).toBeTruthy();
    expect(component.contentRating).toEqual(4);
  });

  it('should call ratingChange and set the contentRating and enableSubmitBtn', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    component.ratingChange(4);
    expect(component.enableSubmitBtn).toBeTruthy();
    expect(component.contentRating).toEqual(4);
  });

  it('should call submit and generate the feedback event ', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(component, 'submit').and.callThrough();
    spyOn(telemetryService, 'feedback').and.callThrough();
    component.contentRating = 4;
    component.showContentRatingModal = true;
    component.contentData = {'contentType': 'Resource', 'pkgVersion': 1};
    const feedbackTelemetry = {'context': {'env': 'library'},
     'object': {'id': 'do_20083743', 'type': 'Resource', 'ver': '1'}, 'edata': {'rating': 4}};
    fixture.whenStable().then(() => {
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      expect(component.submit).toHaveBeenCalled();
      expect(telemetryService.feedback).toHaveBeenCalled();
      expect(telemetryService.feedback).toHaveBeenCalledWith(feedbackTelemetry);
      expect(toasterService.success).toHaveBeenCalledWith('Thank you for rating this content!');
    });
  });

  it('should call submit on button click and reset the rating fields', () => {
    spyOn(component, 'submit').and.callThrough();
    spyOn(component, 'ratingChange').and.callThrough();
    component.ratingChange(4);
    component.showContentRatingModal = true;
    component.contentData = {'contentType': 'Resource', 'pkgVersion': 1};
    fixture.whenStable().then(() => {
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      component.submit();
      expect(component.submit).toHaveBeenCalled();
      expect(component.startext).toBe('Tap on stars to rate the content');
      expect(component.enableSubmitBtn).toBeFalsy();
      expect(component.showContentRatingModal).toBeFalsy();
    });
  });

  it('should call changeOptions on changing options checkbox', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    spyOn(component, 'changeOptions').and.callThrough();
    component.ratingChange(4);
    component.changeOptions(mockData.feedbackResult[0]['options'][0]);
    component.showTextarea = false;
    expect(component.enableSubmitBtn).toBeTruthy();
    expect(component.contentRating).toEqual(4);
  });

  it('should call changeOptions on changing options checkbox with other option selected', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    spyOn(component, 'changeOptions').and.callThrough();
    component.ratingChange(4);
    component.changeOptions(mockData.feedbackResult[0]['options'][6]);
    component.showTextarea = true;
    expect(component.enableSubmitBtn).toBeTruthy();
    expect(component.contentRating).toEqual(4);
    component.changeOptions(mockData.feedbackResult[0]['options'][6]);
    component.showTextarea = false;
    expect(component.enableSubmitBtn).toBeTruthy();
  });

  it('should call submit on clicking on Submit button', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    spyOn(component, 'changeOptions').and.callThrough();
    spyOn(component, 'submit').and.callThrough();
    component.contentRating = 4;
    component.changeOptions(mockData.feedbackResult[1]['options'][1]);
    component.ratingChange(4);
    component.submit();
    expect(component.enableSubmitBtn).toBeFalsy();
    expect(component.contentRating).toEqual(4);
  });

  it('should emit close event', () => {
    spyOn(component.closeModal, 'emit');
    component.dismissModal();
    expect(component.closeModal.emit).toHaveBeenCalledWith(true);
  });

});

