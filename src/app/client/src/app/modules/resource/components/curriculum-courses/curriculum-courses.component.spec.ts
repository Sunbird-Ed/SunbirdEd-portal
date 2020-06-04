import { throwError, of } from 'rxjs';
import { ToasterService, SharedModule, ResourceService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule, UserService, SearchService, OrgDetailsService } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { CurriculumCoursesComponent } from './curriculum-courses.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CurriculumCoursesComponent', () => {
  let component: CurriculumCoursesComponent;
  let fixture: ComponentFixture<CurriculumCoursesComponent>;

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        fetchingContentFailed: 'Fetching Content Failed',
      }
    }
  };

  class FakeActivatedRoute {
    snapshot = {
      queryParams: {
        title: 'English',
      },
      data: {
        telemetry: {
          env: 'curriculum-courses', pageid: 'curriculum-courses', type: 'view', subtype: 'paginate'
        }
      }
    };
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurriculumCoursesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot(), HttpClientTestingModule],
      providers: [ { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumCoursesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setTelemetryImpression()', () => {
    spyOn(component, 'setTelemetryImpression');
    component.ngOnInit();
    expect(component.setTelemetryImpression).toHaveBeenCalled();
  });

  it('should call navigation helper service', () => {
    spyOn(component['navigationhelperService'], 'goBack');
    component.goBack();
    expect(component['navigationhelperService'].goBack).toHaveBeenCalled();
  });

  it('should call router with parameters', () => {
    spyOn(component, 'getInteractData');
    component.navigateToCourseDetails({courseId: 1, batchId: 121232});
    expect(component['router'].navigate).toHaveBeenCalledWith(['/learn/course', 1, 'batch', 121232]);
    expect(component.getInteractData).toHaveBeenCalled();
  });

  it('should call router with parameters, without batchId', () => {
    spyOn(component, 'getInteractData');
    component.navigateToCourseDetails({identifier: 1});
    expect(component['router'].navigate).toHaveBeenCalledWith(['/learn/course', 1]);
    expect(component.getInteractData).toHaveBeenCalled();
  });

  it('should call telemetry.interact()', () => {
    spyOn(component['telemetryService'], 'interact');
    const event = { identifier: 'test', contentType: 'Course', pkgVersion: 2};
    const cardClickInteractData = {
      context: {
        cdata: [],
        env: 'curriculum-courses',
      },
      edata: {
        id: 'test',
        type: 'click',
        pageid: 'curriculum-courses'
      },
      object: {
        id: 'test', type: 'Course', ver: '2'
      }
    };
    component.getInteractData(event);
    expect(component['telemetryService'].interact).toHaveBeenCalledWith(cardClickInteractData);
  });
});
