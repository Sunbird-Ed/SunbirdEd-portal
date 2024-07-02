import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { GeneraliseLabelService } from "./generaliseLable.service";
import { FormService } from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { UsageService } from '../../../dashboard/services/usage/usage.service';
import { MockResponse } from './generaliseLable.service.spec.data'

describe('GeneraliseLabelService', () => {
  let generaliseLabelService: GeneraliseLabelService;
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
  const mockUsageService: Partial<UsageService> = {
    getData: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn().mockReturnValue(of(MockResponse.resourceBundleConfig)) as any
  };
  beforeAll(() => {
    generaliseLabelService = new GeneraliseLabelService(
      mockFormService as FormService,
      mockUsageService as UsageService,
      mockResourceService as ResourceService,
      mockConfigService as ConfigService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of GeneraliseLabelService', () => {
    expect(generaliseLabelService).toBeTruthy();
  });

  describe('should fetch form data', () => {
    it('should return form data using the getGeneraliseResourceBundle method', () => {
      jest.spyOn(generaliseLabelService.formService, 'getFormConfig').mockReturnValue(of({
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
      generaliseLabelService.getGeneraliseResourceBundle()
      expect(generaliseLabelService.formService.getFormConfig).toHaveBeenCalled();
    });

    it('should not return form data using the getGeneraliseResourceBundle method', () => {
      // arrange
      jest.spyOn(generaliseLabelService.formService, 'getFormConfig').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      generaliseLabelService.getGeneraliseResourceBundle()
      expect(generaliseLabelService.formService.getFormConfig).toHaveBeenCalled();
    });
   });

   it('should initialize with the provided content data and language', () => {
    const contentData = {};
    const lang = 'en';
    const mockGetLabels = jest.spyOn(generaliseLabelService, 'getLabels' as any);
    mockGetLabels.mockImplementation(() => {});
    generaliseLabelService.initialize(contentData, lang);
    expect(mockGetLabels).toHaveBeenCalledWith(contentData, lang);
  });

});