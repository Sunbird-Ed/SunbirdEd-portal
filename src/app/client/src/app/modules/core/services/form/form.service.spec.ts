import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { FormService } from './form.service';
import { UserService } from '../../services/user/user.service';
import { PublicDataService } from '../../services/public-data/public-data.service';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { BrowserCacheTtlService } from '../../../shared/services/browser-cache-ttl/browser-cache-ttl.service'
import { mockFormData } from './form.mock.spec.data';
import { OrgDetailsService } from '../org-details/org-details.service';
describe('FormService', () => {
  let formService: FormService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        dataDrivenForms: {
          READ: 'data/v1/form/read'
        }
      }
    },
    appConfig:{
      formApiTypes:{

      }
    }
  };
  const mockCacheService: Partial<CacheService> = {
    set: jest.fn(),
    get: jest.fn().mockReturnValue(of({
      id: 'id',
      params: {
        resmsgid: '',
        status: 'staus'
      },
      responseCode: 'OK',
      result: {},
      ts: '',
      ver: ''
    }))
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
  const mockOrgDetailsService: Partial<OrgDetailsService> = {};
  const mockPublicDataService: Partial<PublicDataService> = {
    get: jest.fn().mockImplementation(() => { }),
    post: jest.fn(() => of(mockFormData.success))
  };
  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue("tn") as any,
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id']
      } as any
    }) as any,
    setIsCustodianUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    formService = new FormService(
      mockUserService as UserService,
      mockConfigService as ConfigService,
      mockPublicDataService as PublicDataService,
      mockCacheService as CacheService, 
      mockBrowserCacheTtlService as BrowserCacheTtlService,
      mockOrgDetailsService as OrgDetailsService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of FormService', () => {
    expect(formService).toBeTruthy();
  });

  describe('should fetch formDetails details', () => {
    const hashTagId = 'NTP';
    const formInputParams = {
      formType: 'user',
      formAction: 'onboarding',
      contentType: 'exclusion',
      component: 'portal',
      framework: 'NTP'
    };
    const responseKey = 'data.fields';
    it('should call the getFormConfig method with imputs for the method', (done) => {
      jest.spyOn(formService.publicDataService,'post').mockReturnValue(of({
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
      formService.getFormConfig(formInputParams,hashTagId,responseKey).subscribe(() => {
        done();
      });
      expect(formService.publicDataService.post).toHaveBeenCalled();
    });

    it('should call the getFormConfig method with imputs for the method for cacheService', (done) => {
      jest.spyOn(formService['cacheService'],'get').mockReturnValue(of({
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
      formService.getFormConfig(formInputParams,hashTagId,responseKey).subscribe(() => {
        done();
      });
      expect(formService['cacheService'].get).toHaveBeenCalled();
    });
  });

});