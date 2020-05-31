import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreCurriculumCoursesComponent } from './explore-curriculum-courses.component';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule} from '@sunbird/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('ExploreCurriculumCoursesComponent', () => {
  let component: ExploreCurriculumCoursesComponent;
  let fixture: ComponentFixture<ExploreCurriculumCoursesComponent>;

  class FakeActivatedRoute {
    snapshot = {
      queryParams: {
        title: 'English',
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreCurriculumCoursesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot(), HttpClientTestingModule],
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

  it('should call navigation helper service', () => {
    spyOn(component['navigationhelperService'], 'goBack');
    component.goBack();
    expect(component['navigationhelperService'].goBack).toHaveBeenCalled();
  });

  it('should call router with parameters', () => {
    component.navigateToCourse({data: {identifier: 1}});
    expect(component['router'].navigate).toHaveBeenCalledWith(['explore-course/course', 1]);
  });


});
