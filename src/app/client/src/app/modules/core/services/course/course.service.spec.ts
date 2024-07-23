import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { CoursesService } from "./course.service";
import { UserService } from '../../services/user/user.service';
import { ContentService } from './../content/content.service';
import { LearnerService } from './../learner/learner.service';
import { ContentDetailsModule } from "@project-sunbird/common-consumption";
import { Console } from "console";
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  const mockUserService: Partial<UserService> = {
    userOrgDetails$: of({
      userProfile: {
        userid: '123456',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id']
      } as any
    }) as any,
    userProfile: {
      organisationIds: ['id1'],
      userid: '123456',
      lastName: 'last-name',
      firstName: 'first-name'
    } as any,
    userid: '1234567',
    orgNames: ['org-1']
  };
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      Course: {
        contentApiQueryParams: {
          orgdetails: 'orgName,email',
          licenseDetails: 'name,description,url'
        }
      }
    },
    urlConFig: {
      URLS: {
        COURSE: {
          GET_ENROLLED_COURSES: 'course/v1/user/enrollment/list',
          GET_QR_CODE_FILE: 'course/v1/qrcode/download'
        },
        SYSTEM_SETTING: {
          SSO_COURSE_SECTION: 'data/v1/system/settings/get/ssoCourseSection'
        }
      },
      params: {
        enrolledCourses: {
          fields: 'contentType,topic,name,channel,mimeType,appIcon,gradeLevel,resourceType,identifier,medium,pkgVersion,board,subject,trackable,primaryCategory,organisation',
          batchDetails: 'name,endDate,startDate,status,enrollmentType,createdBy,certificates'
        }
      }
    }
  };
  const mockContentService: Partial<ContentService> = {};
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { }),
    get: jest.fn()
  };

  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getAllFwCatName: jest.fn(),
  };

  beforeAll(() => {
    coursesService = new CoursesService(
      mockUserService as UserService,
      mockLearnerService as LearnerService,
      mockConfigService as ConfigService,
      mockContentService as ContentService,
      mockCslFrameworkService as CslFrameworkService
    );
  });
  const  ServerResponse = {
    id: 'sample-id',
    params: {
      resmsgid: 'msg_id',
      status: 'success'
    },
    responseCode: 'success',
    result: {
      sectionId: 'do_1234567890'
    },
    ts: 'sample-ts',
    ver: 'sample-version'
};
const  error = {
  id: 'sample-id',
  params: {
    resmsgid: 'msg_id',
    status: 'error',
    msgid: '123',
    err: 'ServerError',
    errmsg: 'there was an error in the response'
  },
  responseCode: 'error',
  result: {
    sectionId: 'do_1234567890'
  },
  ts: 'sample-ts',
  ver: 'sample-version'
};
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of coursesService', () => {
    expect(coursesService).toBeTruthy();
  });

  describe('should get the enrolled courses for a user', () => {
    it('should call the getEnrolledCourses method and get the enrolled courses', (done) => {
			jest.spyOn(mockCslFrameworkService, 'getAllFwCatName').mockReturnValue(['category1', 'category2']);
      jest.spyOn(coursesService['learnerService'], 'get').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
      // act
      coursesService.initialize();
      coursesService.getEnrolledCourses().subscribe(() => {
        done();
      });
      expect(coursesService['learnerService'].get).toHaveBeenCalled();
    });

    it('should call the getEnrolledCourses method and get the enrolled courses and should throw error', () => {
      // arrange
			jest.spyOn(mockCslFrameworkService, 'getAllFwCatName').mockReturnValue(['category1', 'category2']);
      jest.spyOn(coursesService['learnerService'], 'get').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      coursesService.initialize();
      coursesService.getEnrolledCourses().subscribe(() => {
      });
      expect(coursesService['learnerService'].get).toHaveBeenCalled();
    });
  });
  describe('getCourseSectionDetails', () => {
    it('should call the get course section details method', () => {
      jest.spyOn(coursesService, 'getCourseSection').mockReturnValue(of(
        ServerResponse
      ));
      // act
      coursesService.getCourseSectionDetails().subscribe((data) => {
      });
      expect(coursesService.getCourseSection).toHaveBeenCalled();
    });
    it('should call the get course section details method with the sectionId added', (done) => {
      jest.spyOn(coursesService, 'getCourseSection').mockReturnValue(of(
        ServerResponse
      ));
      coursesService.sectionId = 'do_1234567890';
      // act
      coursesService.getCourseSectionDetails();
      coursesService.getCourseSection().subscribe(() => {
        done();
      });
      expect(coursesService.getCourseSection).toHaveBeenCalled();
    });
  });
  describe('getCourseSection', () => {
    it('should call the get course section method', () => {
      jest.spyOn(coursesService['learnerService'], 'get').mockReturnValue(of(ServerResponse));
      const obj = {
        url: 'data/v1/system/settings/get/ssoCourseSection'
      };
      // act
      coursesService.getCourseSection();
      expect(coursesService.getCourseSection).toBeCalled();
    });
  });
  describe('getQRCodeFile', () => {
    it('should call the get QRcode file for courses method', () => {
      jest.spyOn(coursesService['learnerService'], 'post').mockReturnValue(of(ServerResponse));
      const obj = {
        data: {
          'request': {
            'filter': {
              'userIds': ['1234567']
            }
          }
        },
        url: 'course/v1/qrcode/download'
      };
      // act
      const response = coursesService.getQRCodeFile();
      expect(coursesService['learnerService'].post).toBeCalled();
      expect(coursesService['learnerService'].post).toBeCalledWith(obj);
    });
    it('should call the get QRcode file for courses method with error', () => {
      jest.spyOn(coursesService['learnerService'], 'post').mockReturnValue(of(error));
      const obj = {
        data: {
          'request': {
            'filter': {
              'userIds': ['1234567']
            }
          }
        },
        url: 'course/v1/qrcode/download'
      };
      // act
      const response = coursesService.getQRCodeFile();
      expect(coursesService['learnerService'].post).toBeCalled();
      expect(coursesService['learnerService'].post).toBeCalledWith(obj);
    });
  });
});