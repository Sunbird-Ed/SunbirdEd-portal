import { TestBed, inject } from '@angular/core/testing';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse,
  CourseStates, CourseProgressData, CourseProgress, ContentList, IUserData, IUserProfile,
  SharedModule
} from '@sunbird/shared';
import { ContentService, CoreModule } from '@sunbird/core';
import { CourseProgressService } from './course-progress.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';

describe('CourseProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      providers: [CourseProgressService]
    });
  });

  it('should be created', inject([CourseProgressService], (service: CourseProgressService) => {
    expect(service).toBeTruthy();
  }));

  it('should get CourseState FromAPI', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(Observable.throw(''));
  });
  it('should not get CourseState FromAPI', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(Observable.throw(''));

  });

  it('should update CourseState InServer ', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(Observable.throw(''));

  });
  it('should not update CourseState InServer ', () => {
    const service = TestBed.get(CourseProgressService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(Observable.throw(''));

  });
});
