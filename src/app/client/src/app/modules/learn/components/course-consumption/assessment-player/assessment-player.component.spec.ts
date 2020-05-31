import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, UserService } from '@sunbird/core';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { AssessmentPlayerComponent } from './assessment-player.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileService } from '@sunbird/profile';

describe('AssessmentPlayerComponent', () => {
  let component: AssessmentPlayerComponent;
  let fixture: ComponentFixture<AssessmentPlayerComponent>;

  const resourceMockData = {
    messages: {
      emsg: { m0017: 'Fetching districts failed. Try again later', m0016: 'Fetching states failed. Try again later' }

    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentPlayerComponent],
      imports: [
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        SuiModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule],
      providers: [
        UserService,
        { provide: ResourceService, useValue: resourceMockData },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
  });

  it('should call goBack', () => {
    component.goBack();
  });

  it('should call subscribeToQueryParam', () => {
    component['subscribeToQueryParam']();
  });

  it('should call getCollectionInfo', () => {
    component['getCollectionInfo']('do_1212');
  });

  xit('should call setActiveContent', () => {
    component.setActiveContent('do_43223232121');
  });

  it('should call firstNonCollectionContent', () => {
    component['firstNonCollectionContent']([]);
  });

  it('should call initPlayer', () => {
    component['initPlayer']('do_3232431');
  });

  it('should call onTocCardClick', () => {
    component.onTocCardClick({});
  });

  xit('should call getContentState', () => {
    component['getContentState']();
  });

  xit('should call parseChildContent', () => {
    component['parseChildContent']();
  });

  it('should call contentProgressEvent', () => {
    component.contentProgressEvent({});
  });

  it('should call onAssessmentEvents', () => {
    component.onAssessmentEvents({});
  });

  it('should call onQuestionScoreSubmitEvents', () => {
    component.onQuestionScoreSubmitEvents({});
  });

  xit('should call validEndEvent', () => {
    component['validEndEvent']({});
  });

  xit('should call calculateProgress', () => {
    component.calculateProgress();
  });

  it('should call subscribeToContentProgressEvents', () => {
    component['subscribeToContentProgressEvents']();
  });

  it('should call ngOnDestroy', () => {
    spyOn(component['unsubscribe'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe'].complete).toHaveBeenCalled();
  });
});
