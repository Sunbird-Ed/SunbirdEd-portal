import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseInfoComponent } from './course-info.component';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';

describe('CourseInfoComponent', () => {
  let component: CourseInfoComponent;
  let fixture: ComponentFixture<CourseInfoComponent>;

  const resourceServiceMockData = {
    messages: {
      imsg: { m0027: 'Something went wrong' },
      fmsg: { m0001: 'error', m0003: 'error' },
      emsg: { m0005: 'error' }
    },
    frmelmnts: {
      lbl: {
        creditsLicenceInfo: 'Credits and licence info'
      }
    }
  };

  configureTestSuite();
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
    expect(component.showCredits).toBe(false);
  });

  it('should check for the required data availability to show credits link', () => {
    spyOn(component, 'checkContentCreditAvailability');
    component.ngOnChanges();
    expect(component.checkContentCreditAvailability).toHaveBeenCalled();
  });

  it('should show credits only if the data is present, condition 1', () => {
    component.courseHierarchy = {
      'name': 'Course1',
      copyright: 2020,
    };
    component.checkContentCreditAvailability();
    expect(component.showCredits).toBe(true);
  });
  it('should show credits only if the data is , condition 2', () => {
    component.courseHierarchy = {
      'name': 'Course1',
      creators: 'user abcd'
    };
    component.checkContentCreditAvailability();
    expect(component.showCredits).toBe(true);
  });
  it('should show credits only if the data is , condition 3', () => {
    component.courseHierarchy = {
      'name': 'Course1',
      attributions: 'pop',
    };
    component.checkContentCreditAvailability();
    expect(component.showCredits).toBe(true);
  });
  it('should show credits only if the data is , condition 4', () => {
    component.courseHierarchy = {
      'name': 'Course1',
      originData: {
        author: 'abcd'
      },
    };
    component.checkContentCreditAvailability();
    expect(component.showCredits).toBe(false);
  });
  it('should show credits only if the data is present', () => {
    component.courseHierarchy = {
      'name': 'Course1',
      originData: {
        author: 'abcd'
      },
      contentType: 'Course'
    };
    component.checkContentCreditAvailability();
    expect(component.showCredits).toBe(true);
  });

});
