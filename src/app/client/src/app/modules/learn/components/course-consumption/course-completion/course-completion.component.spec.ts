import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { CourseCompletionComponent } from './course-completion.component';

describe('CourseCompletionComponent', () => {
  let component: CourseCompletionComponent;
  let fixture: ComponentFixture<CourseCompletionComponent>;
  const fakeActivatedRoute = {
    snapshot: { data: { telemetry: { env: 'Course', pageid: 'course-player' } } }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseCompletionComponent],
      imports: [SharedModule.forRoot(),
        CoreModule, HttpClientTestingModule, TelemetryModule.forRoot(), SuiModule],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeModal', () => {
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(component.close, 'emit');
    spyOn(component, 'logInteractTelemetry');
    component.closeModal();
    expect(component.logInteractTelemetry).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    spyOn(component, 'closeModal');
    component.ngOnDestroy();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call logInteractTelemetry', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.logInteractTelemetry();
    expect(telemetryService.interact).toHaveBeenCalled();
  });
});

