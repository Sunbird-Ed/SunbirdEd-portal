import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { CourseCompletionComponent } from './course-completion.component';
import { SuiModule } from 'ng2-semantic-ui';

describe('CourseCompletionComponent', () => {
  let component: CourseCompletionComponent;
  let fixture: ComponentFixture<CourseCompletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseCompletionComponent],
      imports: [SharedModule.forRoot(),
        CoreModule, HttpClientTestingModule, TelemetryModule.forRoot(), SuiModule]
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
    component.closeModal();
  });

  it('should call ngOnDestroy', () => {
    spyOn(component, 'closeModal');
    component.ngOnDestroy();
    expect(component.closeModal).toHaveBeenCalled();
  });
});

