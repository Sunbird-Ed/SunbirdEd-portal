import { of, throwError } from "rxjs";
import { CourseProgressService } from './course-progress.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { ContentService, UserService, CoursesService } from '@sunbird/core';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';

describe('CourseProgressService', () => {
  let courseProgressService: CourseProgressService;

  const mockContentService: Partial<ContentService> = {
    post: jest.fn().mockImplementation(() => { }),
    patch: jest.fn(),
  };

  const mockUserService: Partial<UserService> = {
    userid: 'mockUserId',
  };

  const mockCoursesService: Partial<CoursesService> = {
    updateCourseProgress: jest.fn(),
  };

  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
  };

  const mockResourceService: Partial<ResourceService> = {};

  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        COURSE: {
          USER_CONTENT_STATE_READ: 'mockUserContentStateReadURL',
          USER_CONTENT_STATE_UPDATE: 'mockUserContentStateUpdateURL'
        },
      },
    },
  };

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

  it('should return course progress data on successful post', async() => {
    const mockResponse = {  };
    (mockContentService.post as any).mockReturnValue(of(mockResponse));
    const mockRequest = {
      userId: 'mockUserId',
      courseId: 'mockCourseId',
      contentIds: ['mockContentId'],
      batchId: 'mockBatchId',
      fields: 'mockFields',
    };
    await courseProgressService.getContentState(mockRequest).subscribe((result) => {
      expect(result).toEqual(courseProgressService.courseProgress['mockCourseId_mockBatchId']);
      expect(mockContentService.post).toHaveBeenCalledWith({
        url: 'mockUserContentStateReadURL',
        data: {
          request: {
            userId: 'mockUserId',
            courseId: 'mockCourseId',
            contentIds: ['mockContentId'],
            batchId: 'mockBatchId',
            fields: 'mockFields',
          },
        },
      });
    });
  });

  it('should emit course progress data and return the same data', () => {
    const mockRequest = {
      courseId: 'mockCourseId',
      batchId: 'mockBatchId',
    };
    const mockResponse = {};
    jest.spyOn(courseProgressService, 'processContent' as any).mockImplementation(() => {
    });
    const emitSpy = jest.spyOn(courseProgressService.courseProgressData, 'emit');
    const result = courseProgressService.getContentProgressState(mockRequest, mockResponse);
    expect(result).toEqual(courseProgressService.courseProgress['mockCourseId_mockBatchId']);
    expect(emitSpy).toHaveBeenCalledWith(courseProgressService.courseProgress['mockCourseId_mockBatchId']);
    expect(courseProgressService['processContent']).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      'mockCourseId_mockBatchId',
      true
    );
  });

  it('should calculate progress and update course progress', () => {
    const courseId_batchId = 'mockCourseId_mockBatchId';
    const mockContentList = [
      { contentId: 'contentId1', status: 2, lastAccessTime: 1234567890 },
      { contentId: 'contentId2', status: 1, lastAccessTime: 9876543210 },
    ];
    courseProgressService.courseProgress[courseId_batchId].content = mockContentList;
    courseProgressService.courseProgress[courseId_batchId].totalCount = mockContentList.length;
    courseProgressService['calculateProgress'](courseId_batchId);
    expect(courseProgressService.courseProgress[courseId_batchId].completedCount).toEqual(1);
    expect(courseProgressService.courseProgress[courseId_batchId].progress).toEqual(50);
    expect(courseProgressService.courseProgress[courseId_batchId].lastPlayedContentId).toEqual('contentId2');
  });

  it('should update content state and emit course progress data', async () => {
    const courseId_batchId = 'mockCourseId_mockBatchId';
    const mockContentId = 'mockContentId';
    courseProgressService.courseProgress[courseId_batchId].content = [
      { contentId: mockContentId, status: 0, lastAccessTime: undefined },
    ];
    const calculateProgressSpy = jest.spyOn(courseProgressService as any, 'calculateProgress');
    courseProgressService['updateContentStateToServer'] = jest.fn().mockReturnValue(of({}));
    const formatMock = jest.fn().mockReturnValue('2023-01-01 12:00:00:000Z');
    jest.spyOn(dayjs.prototype, 'format').mockImplementation(formatMock);
    const result = await courseProgressService.updateContentsState({
      courseId: 'mockCourseId',
      batchId: 'mockBatchId',
      contentId: mockContentId,
      status: 1,
    }).toPromise();
    expect(result).toEqual(courseProgressService.courseProgress[courseId_batchId]);
    expect(courseProgressService.courseProgress[courseId_batchId].content[0].status).toEqual(1);
     expect(formatMock).toHaveBeenCalledWith('YYYY-MM-DD HH:mm:ss:SSSZZ');
    expect(calculateProgressSpy).toHaveBeenCalledWith(courseId_batchId);
    expect(courseProgressService.courseProgressData.emit).toHaveBeenCalledWith(courseProgressService.courseProgress[courseId_batchId]);
    expect(mockCoursesService.updateCourseProgress).toHaveBeenCalledWith('mockCourseId', 'mockBatchId', 0);
  });

  it('should not update content state if status is not greater or equal', async () => {
    const courseId_batchId = 'mockCourseId_mockBatchId';
    const mockContentId = 'mockContentId';
    const mockStatus = 0;
    courseProgressService.courseProgress[courseId_batchId].content = [
      { contentId: mockContentId, status: 1, lastAccessTime: undefined },
    ];
    const result = await courseProgressService.updateContentsState({
      courseId: 'mockCourseId',
      batchId: 'mockBatchId',
      contentId: mockContentId,
      status: mockStatus,
    }).toPromise();
    expect(result).toEqual(courseProgressService.courseProgress[courseId_batchId]);
    expect(courseProgressService.courseProgress[courseId_batchId].content[0].status).toEqual(1);
    expect(courseProgressService['calculateProgress']).not.toHaveBeenCalled();
    expect(courseProgressService.courseProgressData.emit).not.toHaveBeenCalled();
    expect(mockCoursesService.updateCourseProgress).not.toHaveBeenCalled();
  });

  it('should send assessment data using PATCH method', () => {
    const mockData = {
      methodType: 'PATCH',
      requestBody: {}
    };

    const spy = jest.spyOn(courseProgressService['contentService'], 'patch');
    spy.mockReturnValue(of());

    const result$ = courseProgressService.sendAssessment(mockData);

    result$.subscribe(response => {
      expect(response).toEqual({});
      expect(courseProgressService['contentService'].patch).toHaveBeenCalledWith({
        url: courseProgressService['configService'].urlConFig.URLS.COURSE.USER_CONTENT_STATE_UPDATE,
        data: mockData.requestBody
      });
    });
  });

  it('should handle error during sending assessment data', () => {
    const mockData = {
      methodType: 'PATCH',
      requestBody: {}
    };

    const errorMessage = 'Mocked error message';
    const errorResponse = { message: errorMessage };

    const spy = jest.spyOn(courseProgressService['contentService'], 'patch');
    spy.mockReturnValue(throwError(errorResponse));

    const errorSpy = jest.spyOn(courseProgressService['toasterService'], 'error');

    const result$ = courseProgressService.sendAssessment(mockData);

    result$.subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
        expect(courseProgressService['contentService'].patch).toHaveBeenCalledWith({
          url: courseProgressService['configService'].urlConFig.URLS.COURSE.USER_CONTENT_STATE_UPDATE,
          data: mockData.requestBody
        });
        expect(errorSpy).toHaveBeenCalledWith(courseProgressService['resourceService'].messages.emsg.m0005);
      }
    });
  });
});



