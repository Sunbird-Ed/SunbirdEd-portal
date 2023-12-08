import { CourseProgressService } from './course-progress.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { ContentService, UserService, CoursesService } from '@sunbird/core';
import * as _ from 'lodash-es';

describe('CourseProgressService', () => {
  let courseProgressService: CourseProgressService;

  const mockContentService: Partial<ContentService> = {};

  const mockUserService: Partial<UserService> = {};

  const mockCoursesService: Partial<CoursesService> = {};

  const mockToasterService: Partial<ToasterService> = {};

  const mockResourceService: Partial<ResourceService> = {};

  const mockConfigService: Partial<ConfigService> = {};

  beforeAll(() => {
    courseProgressService = new CourseProgressService(
      mockContentService as ContentService,
      mockConfigService as ConfigService,
      mockUserService as UserService,
      mockCoursesService as CoursesService,
      mockToasterService as ToasterService,
      mockResourceService as ResourceService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(courseProgressService).toBeTruthy();
  });

});


