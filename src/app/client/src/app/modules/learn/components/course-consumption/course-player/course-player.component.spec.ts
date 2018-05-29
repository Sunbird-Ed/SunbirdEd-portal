import { CourseProgressService } from './../../../../dashboard/services/course-progress/course-progress.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CoursePlayerComponent } from './course-player.component';
import { PlayerService, CollectionHierarchyAPI, ContentService, UserService, LearnerService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  WindowScrollService, RouterNavigationService, ILoaderMessage, PlayerConfig,
  ICollectionTreeOptions, NavigationHelperService, ToasterService, ResourceService, ConfigService, DateFormatPipe
} from '@sunbird/shared';
import { Subscription } from 'rxjs/Subscription';
import { CourseConsumptionService } from './../../../services';

describe('CoursePlayerComponent', () => {
  let component: CoursePlayerComponent;
  let fixture: ComponentFixture<CoursePlayerComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CoursePlayerComponent, DateFormatPipe],
      providers: [ResourceService, ConfigService, ContentService, WindowScrollService, RouterNavigationService,
        CourseConsumptionService, NavigationHelperService, ToasterService, DateFormatPipe, PlayerService,
          ContentService, UserService, LearnerService, CourseProgressService, CourseProgressService,
        { provide: Router, useClass: RouterStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
