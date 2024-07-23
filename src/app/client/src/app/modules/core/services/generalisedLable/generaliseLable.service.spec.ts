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
        },
        GET_GENERALISED_RESOURCE: 'getGeneralisedResourcesBundles'
      }
    }
  };
  const mockUsageService: Partial<UsageService> = {
    getData: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {
    messages:'this is the default message',
    frmelmnts:'this is the default frmelmnts'
  };
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
    mockGetLabels.mockImplementation(() => { });
    generaliseLabelService.initialize(contentData, lang);
    expect(mockGetLabels).toHaveBeenCalledWith(contentData, lang);
  });
  it('should initialize with the component and call the fetchGeneraliseLables method', () => {
    jest.spyOn(generaliseLabelService.usageService, 'getData').mockReturnValue(of(MockResponse.resourceBundleConfig as any) as any) as any;
    generaliseLabelService['fetchGeneraliseLables']('en', 'all_labels_en.json').subscribe(data => {
      expect(data).toEqual(MockResponse.resourceBundleConfig);
    });
  });
  it('should initialize with the component and call the getResourcedFileName method', () => {
    jest.spyOn(generaliseLabelService.usageService, 'getData').mockReturnValue(of(MockResponse.resourceBundleConfig as any) as any) as any;
    generaliseLabelService['gResourseBundleForm'] = MockResponse.generaliseLblResponse.result;
    const value = generaliseLabelService['getResourcedFileName'](MockResponse.courseHierarchy, 'en')
    expect(value).toEqual(MockResponse.generaliseLblResponse.result.course.trackable.en);
  });
  it('should initialize with the component and call the getResourcedFileName method for nontrackable', () => {
    jest.spyOn(generaliseLabelService.usageService, 'getData').mockReturnValue(of(MockResponse.courseHierarchyNew as any) as any) as any;
    generaliseLabelService['gResourseBundleForm'] = MockResponse.generaliseLblResponse.result;
    const value = generaliseLabelService['getResourcedFileName'](MockResponse.courseHierarchyNew, 'en')
    expect(value).toEqual(MockResponse.generaliseLblResponse.result.course.nontrackable.en);
  });
  it('should initialize with the component and call the getResourcedFileName method for the course', () => {
    jest.spyOn(generaliseLabelService.usageService, 'getData').mockReturnValue(of(MockResponse.courseHierarchyNew as any) as any) as any;
    generaliseLabelService['gResourseBundleForm'] = MockResponse.generaliseLblResponse.result;
    const value = generaliseLabelService['getResourcedFileName'](MockResponse.courseHierarchyone, 'ka')
    expect(value).toEqual(MockResponse.generaliseLblResponse.result.course.trackable.en);
  });
  it('should initialize with the component and call the getResourcedFileName method for other than the  course', () => {
    jest.spyOn(generaliseLabelService.usageService, 'getData').mockReturnValue(of(MockResponse.courseHierarchyNew as any) as any) as any;
    generaliseLabelService['gResourseBundleForm'] = MockResponse.generaliseLblResponse.result;
    const value = generaliseLabelService['getResourcedFileName'](MockResponse.courseHierarchytwo, 'ka')
    expect(value).toEqual(MockResponse.generaliseLblResponse.result.default.nontrackable.en);
  });
  it('should initialize with the component and call the setLabels method', () => {
    const labels = {
      'dflt': {
        'nontrk': {
          'frmelmnts': {
            'lbl': {
                'ActivityTextbooks': ' Tasks'
            }
        },
          'messages': {
            'stmsg': {
              'm0125': ' Start creating or uploading content.'
            }
          }
        }
      },
      'book': {
        'nontrk': {
          'frmelmnts': {
            'lbl': {
                'ActivityTextbooks': ' Tasks'
            }
        },
          'messages': {
            'stmsg': {
              'm0125': ' Start creating or uploading content.'
            }
          }
        }
      }
    }
    generaliseLabelService['contentTypeLblKey'] = 'book';
    generaliseLabelService['setLabels'](labels);
    expect(generaliseLabelService.messages).toEqual({
      stmsg: {
        m0125: ' Start creating or uploading content.'
      }
    }
    )
    expect(generaliseLabelService.frmelmnts).toEqual({ lbl: { ActivityTextbooks: ' Tasks'} });
  });
  it('should initialize with the component and call the setLabels method isTrackable as trackable', () => {
    generaliseLabelService['isTrackable']='trackable'
    const labels = {
      'dflt': {
        'trk': {
          'frmelmnts': {
            'lbl': {
                'ActivityTextbooks': ' Tasks'
            }
        },
          'messages': {
            'dashboard': {
              'emsg': {
                'm002': ' User has not joined any batch for this learning task'
              }
            }
          }
        }
      },
      'book': {
        'trk': {
          'frmelmnts': {
            'lbl': {
                'ActivityTextbooks': ' Tasks'
            }
        },
          'messages': {
            'dashboard': {
              'emsg': {
                'm002': ' User has not joined any batch for this learning task'
              }
            }
          }
        }
      }
    }
    generaliseLabelService['contentTypeLblKey'] = 'book';
    generaliseLabelService['setLabels'](labels);
    expect(generaliseLabelService.messages).toEqual({'dashboard': {
      'emsg': {
        'm002': ' User has not joined any batch for this learning task'
      }
    }})
    expect(generaliseLabelService.frmelmnts).toEqual({ lbl: { ActivityTextbooks: ' Tasks'} });
  });
  it('should initialize with the component and call the setLabels method with default value', () => {
    generaliseLabelService['isTrackable']='trackable'
    const labels = {
    }
    generaliseLabelService['contentTypeLblKey'] = 'book';
    generaliseLabelService['setLabels'](labels);
    expect(generaliseLabelService.messages).toEqual('this is the default message')
    expect(generaliseLabelService.frmelmnts).toEqual('this is the default frmelmnts');
  });
  xit('should initialize with the component and call the getLabels method ', () => {
    generaliseLabelService['getLabels'](MockResponse.courseHierarchy,'en');
    
  });

});