import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreCurriculumCoursesComponent } from './explore-curriculum-courses.component';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule} from '@sunbird/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';


describe('ExploreCurriculumCoursesComponent', () => {
  let component: ExploreCurriculumCoursesComponent;
  let fixture: ComponentFixture<ExploreCurriculumCoursesComponent>;

  class FakeActivatedRoute {
    snapshot = {
      queryParams: {
        title: 'English',
      },
      data: {
        telemetry: { env: 'curriculum-courses', pageid: 'curriculum-courses', type: 'view', subtype: 'paginate'}
      }
    };
  }
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        fetchingContentFailed: 'Fetching Content Failed',
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreCurriculumCoursesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot(), HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [ { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        {provide: ResourceService, useValue: resourceBundle},
        { provide: Router, useClass: RouterStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreCurriculumCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setTelemetryImpression()', () => {
    spyOn(component, 'setTelemetryImpression');
    component.ngOnInit();
    expect(component.setTelemetryImpression).toHaveBeenCalled();
  });

  it('should go back to previous page', () => {
    spyOn(component['location'], 'back');
    component.goBack();
    expect(component['location'].back).toHaveBeenCalled();
  });

  it('should call router with parameters', () => {
    component.navigateToCourse({data: {identifier: 1}});
    expect(component['router'].navigate).toHaveBeenCalledWith(['explore-course/course', 1]);
  });

  it('should call telemetry.interact()', () => {
    spyOn(component['telemetryService'], 'interact');
    const event = {
      data: {identifier: '1234', contentType: 'Course', pkgVersion: 2},
    };
    const cardClickInteractData = {
      context: {
        cdata: [],
        env: 'curriculum-courses',
      },
      edata: {
        id: '1234',
        type: 'click',
        pageid: 'curriculum-courses'
      },
      object: {
        id: '1234', type: 'Course', ver: '2'
      }
    };
    component.getInteractData(event);
    expect(component['telemetryService'].interact).toHaveBeenCalledWith(cardClickInteractData);
  });

});
