import { ComponentFixture, TestBed , async} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { ContentRatingComponent } from './content-rating.component';
describe('ContentRatingComponent', () => {
  let component: ContentRatingComponent;
  let fixture: ComponentFixture<ContentRatingComponent>;
  beforeEach(() => {
    const resourceServiceStub = { messages: {
      smsg: { m0050: 'Thank you for rating this content!' } } };
    const activatedRouteStub = {
      snapshot: { data: { telemetry: {
        env: 'library', pageid: 'content-player', type: 'play'
      } }, params: {'contentId': 'do_20083743'} }
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ContentRatingComponent],
      providers: [TelemetryService, ToasterService,
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    });
    fixture = TestBed.createComponent(ContentRatingComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
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
  it('should call ratingChange and set the contentRating and enableSubmitBtn', () => {
    spyOn(component, 'ratingChange').and.callThrough();
    component.ratingChange(4);
    expect(component.enableSubmitBtn).toBeTruthy();
    expect(component.contentRating).toEqual(4);
  });

  it('should emit close event', () => {
    spyOn(component.closeModal, 'emit');
    component.dismissModal();
    expect(component.closeModal.emit).toHaveBeenCalledWith(true);
  });
});

