import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { CoursesService } from "./course.service";
import { UserService } from '../../services/user/user.service';
import { ContentService } from './../content/content.service';
import { LearnerService } from './../learner/learner.service';


describe('CoursesService', () => {
  let coursesService: CoursesService;
  const mockUserService: Partial<UserService> = {
    userOrgDetails$: of({
      userProfile: {
        userid: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id']
      } as any
    }) as any,
    userProfile: {
      organisationIds: ['id1'],
      userid: 'sample-uid',
      lastName: 'last-name',
      firstName: 'first-name'
    } as any,
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
          GET_ENROLLED_COURSES: 'course/v1/user/enrollment/list'
        }
      },
      params: {
        enrolledCourses: {
          fields: 'contentType,topic,name,channel,mimeType,appIcon,gradeLevel,resourceType,identifier,medium,pkgVersion,board,subject,trackable,primaryCategory,organisation',
          batchDetails: 'name,endDate,startDate,status,enrollmentType,createdBy,certificates'
        }
      }
    }
  }
  const mockContentService: Partial<ContentService> = {};
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { }),
    get: jest.fn().mockImplementation(() => { })
  };
  beforeAll(() => {
    coursesService = new CoursesService(
      mockUserService as UserService,
      mockLearnerService as LearnerService,
      mockConfigService as ConfigService,
      mockContentService as ContentService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of coursesService', () => {
    expect(coursesService).toBeTruthy();
  });

  describe('should get the enrolled courses for a user', () => {
    it('should call the getEnrolledCourses method and get the enrolled courses', (done) => {
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
});