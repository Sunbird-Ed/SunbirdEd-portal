import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { FrameworkService } from "./framework.service";
import { PublicDataService } from './../public-data/public-data.service';
import { UserService, LearnerService, FormService } from '@sunbird/core';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse, Framework, FrameworkData,
  BrowserCacheTtlService
} from '@sunbird/shared';

describe('FrameworkService', () => {
  let frameworkService: FrameworkService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        CHANNEL: {
          READ: 'channel/v1/read'
        },
        FRAMEWORK: {
          READ: 'framework/v1/read'
        },
        COURSE_FRAMEWORK: {
          COURSE_FRAMEWORKID: 'data/v1/system/settings/get/courseFrameworkId'
        }
      }
    }
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
  const mockUserService: Partial<UserService> = {
    hashTagId: 'testHashTagId',
  };
  const mockToasterService: Partial<ToasterService> = {};
  const mockResourceService: Partial<ResourceService> = {};
  const mockLearnerService: Partial<LearnerService> = {
    get: jest.fn().mockImplementation(() => { })
  };
  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn().mockReturnValue(of({}))
  };
  const mockPublicDataService: Partial<PublicDataService> = {
    get: jest.fn().mockImplementation(() => { })
  };
  beforeAll(() => {
    frameworkService = new FrameworkService(
      mockBrowserCacheTtlService as BrowserCacheTtlService,
      mockUserService as UserService,
      mockConfigService as ConfigService,
      mockToasterService as ToasterService,
      mockResourceService as ResourceService,
      mockPublicDataService as PublicDataService,
      mockLearnerService as LearnerService,
      mockFormService as FormService
    );
    frameworkService['_channelData'].defaultLicense = 'ABCD'
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of FrameworkService', () => {
    expect(frameworkService).toBeTruthy();
  });

  describe('should fetch channel data using the getChannel method', () => {
    const hashTagId = 'NTP'
    it('should return channel data using the getChannel method', (done) => {
      jest.spyOn(frameworkService['publicDataService'], 'get').mockReturnValue(of({
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
      frameworkService.getChannel(hashTagId).subscribe(() => {
        done();
      });
      expect(frameworkService['publicDataService'].get).toHaveBeenCalled();
    });

    it('should not return channel data using the getChannel method', () => {
      // arrange
      jest.spyOn(frameworkService['publicDataService'], 'get').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      frameworkService.getChannel(hashTagId).subscribe(() => {
      });
      expect(frameworkService['publicDataService'].get).toHaveBeenCalled();
    });
  });

  describe('should fetch framework data using the getFrameworkCategories method', () => {
    const frameworkId = 'NTP'
    it('should return framework data using the getFrameworkCategories method', (done) => {
      jest.spyOn(frameworkService['publicDataService'], 'get').mockReturnValue(of({
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
      frameworkService.getFrameworkCategories(frameworkId).subscribe(() => {
        done();
      });
      expect(frameworkService['publicDataService'].get).toHaveBeenCalled();
    });

    it('should not return framework data using the getFrameworkCategories method', () => {
      // arrange
      jest.spyOn(frameworkService['publicDataService'], 'get').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      frameworkService.getFrameworkCategories(frameworkId).subscribe(() => {
      });
      expect(frameworkService['publicDataService'].get).toHaveBeenCalled();
    });
  });

  describe('should fetch selected framework category data using the getSelectedFrameworkCategories method', () => {
    const frameworkId = 'NTP'
    const queryParams = {}
    it('should return selected framework category using getSelectedFrameworkCategories method', (done) => {
      jest.spyOn(frameworkService['publicDataService'], 'get').mockReturnValue(of({
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
      frameworkService.getSelectedFrameworkCategories(frameworkId, queryParams).subscribe(() => {
        done();
      });
      expect(frameworkService['publicDataService'].get).toHaveBeenCalled();
    });

    it('should not return selected framework category using getSelectedFrameworkCategories method', () => {
      // arrange
      jest.spyOn(frameworkService['publicDataService'], 'get').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      frameworkService.getSelectedFrameworkCategories(frameworkId, queryParams).subscribe(() => {
      });
      expect(frameworkService['publicDataService'].get).toHaveBeenCalled();
    });
  });

  describe('should fetch course framework using getCourseFramework method', () => {
    it('should return course framework using getCourseFramework method', (done) => {
      jest.spyOn(frameworkService.learnerService, 'get').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {
          framework: 'NTP'
        },
        ts: '',
        ver: ''
      }));
      // act
      frameworkService.getCourseFramework().subscribe(() => {
        done();
      });
      expect(frameworkService.learnerService.get).toHaveBeenCalled();
    });

    it('should not return course framework using getCourseFramework method', () => {
      // arrange
      jest.spyOn(frameworkService.learnerService, 'get').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      frameworkService.getCourseFramework().subscribe(() => {
      });
      expect(frameworkService.learnerService.get).toHaveBeenCalled();
    });
  });

  describe('should fetch defaultLicense from getDefaultLicense', () => {
    it('should return defaultLicense from the method getDefaultLicense', () => {
      let defaultLicense = frameworkService.getDefaultLicense();
      expect(defaultLicense).toBe('ABCD');
    });
  });
  
  describe('should call the framework initialize', () => {
    it('should call the initialize method', () => {
      const res = {
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {
          framework:'ntp'
        },
        ts: '',
        ver: ''
      };
      jest.spyOn(frameworkService['publicDataService'], 'get').mockReturnValue(of(res));
      frameworkService.initialize('NTP', '1234567');
      frameworkService.getFrameworkCategories('NTP').subscribe((data) => {
        expect(JSON.stringify(data)).toBe(JSON.stringify(res));
      });
    });

    it('should call the initialize method with _frameworkData having some framework', () => {
      frameworkService['_frameworkData'].framework = {test: '123'};
      frameworkService.initialize('framework', '1234567');
      expect(JSON.stringify(frameworkService['_frameworkData'])).toBe(JSON.stringify({NTP: 'ntp', framework: {test: '123'}}));
    });
  });

  it('should get default course framework', () => {
    const spyGetChannel = jest.spyOn(frameworkService, 'getChannel' as any).mockReturnValue(of({ result: { channel: { defaultCourseFramework: 'defaultFramework' } } }));
    frameworkService.getDefaultCourseFramework().subscribe((frameworkName) => {
      expect(frameworkName).toEqual('defaultFramework');
      expect(spyGetChannel).toHaveBeenCalled();
    });
  });

  it('should get sorted filters', () => {
    const filters = [{ index: 2, name: 'Filter 2' }, { index: 1, name: 'Filter 1' }];
    const sortedFilters = frameworkService.getSortedFilters(filters, 'gradeLevel');
    expect(sortedFilters).toEqual([{ index: 1, name: 'Filter 1' }, { index: 2, name: 'Filter 2' }]);
  });

  it('should get segmentation commands', async () => {
    const formRequest = { formType: 'config', contentType: 'segmentation_v2', formAction: 'get' };
    const expectedResponse = {};
    mockFormService.getFormConfig = jest.fn().mockReturnValue(of(expectedResponse));
    const segmentationCommands = await frameworkService.getSegmentationCommands();
    expect(segmentationCommands).toEqual(expectedResponse);
    expect(mockFormService.getFormConfig).toHaveBeenCalledWith(formRequest);
  });

})
