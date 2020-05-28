import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseInfoComponent } from './course-info.component';
import { ResourceService, SharedModule } from '@sunbird/shared';

describe('CourseInfoComponent', () => {
  let component: CourseInfoComponent;
  let fixture: ComponentFixture<CourseInfoComponent>;

  const resourceServiceMockData = {
    messages: {
      imsg: { m0027: 'Something went wrong' },
      fmsg: { m0001: 'error', m0003: 'error' },
      emsg: { m0005: 'error' }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseInfoComponent],
      imports: [SharedModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ResourceService, useValue: resourceServiceMockData }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
