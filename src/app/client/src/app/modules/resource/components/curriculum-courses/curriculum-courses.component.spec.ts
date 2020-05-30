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
});
