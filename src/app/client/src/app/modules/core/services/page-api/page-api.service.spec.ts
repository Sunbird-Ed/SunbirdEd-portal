import { PageApiService } from "./page-api.service";
import { UserService } from './../user/user.service';
import { ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { PublicDataService } from './../public-data/public-data.service';
import { of } from "rxjs";
import { testData } from './page-api.service.spec.data';

describe("PageApiService", () => {
    let pageApiService: PageApiService;
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {

            URLS: {
                'PAGE_PREFIX,': 'data/v1/page/assemble'
            }
        }
    };
    const mockUserService: Partial<UserService> = {};
    const mockCacheService: Partial<CacheService> = {
        get: jest.fn().mockImplementation(() => { of({}) }),
        set: jest.fn()
    };
    const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
    const mockPublicDataService: Partial<PublicDataService> = {
        post: jest.fn()
    };

    beforeAll(() => {
        pageApiService = new PageApiService(
            mockConfigService as ConfigService,
            mockUserService as UserService,
            mockCacheService as CacheService,
            mockBrowserCacheTtlService as BrowserCacheTtlService,
            mockPublicDataService as PublicDataService

        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(pageApiService).toBeTruthy();
    });

    describe('setData', () => {
        it('should set the data', () => {
            //arrange
            const param = { source: 'web', name: 'Resource', filters: {}, sort_by: {} };
            mockCacheService.set('pageApiResource', { sections: testData.successData.result.response.section }, { maxAge: 10 * 60 });
            const pageData = { name: 'Resource' };
            const sort_by = !param.sort_by;
            //act
            pageApiService.setData(testData.successData, param);
            //assert
            expect(mockCacheService.set).toBeDefined();
        });
    });

    describe('getPageSectionData', () => {
        it('should return the page section data', (done) => {
            //arrange
            const param = { source: 'web', name: 'Resource', sections: testData.successData.result.response.section, filters: {}, url: 'test', sort_by: { 'lastUpdatedOn': 'desc' }, exists: ['demo'] };
            const pageData = { name: 'Resource' };
            mockPublicDataService.post = jest.fn().mockReturnValue(of(testData.successData.result)) as any;
            jest.spyOn(pageApiService, 'setData').mockImplementation(() => {
                return of({ sections: testData.successData.result.response.section })
            }) as any;
            //act
            pageApiService.getPageSectionData(param);
            setTimeout(() => {
                //assert
                expect(mockPublicDataService.post).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('getPageData', () => {
        it('should return the page data', (done) => {
            //arrange
            const param = { source: 'web', name: 'Resource', filters: undefined, sort_by: {} };
            mockCacheService.get = jest.fn(() => 'pageApi' + param.name);
            jest.spyOn(pageApiService, 'getPageSectionData').mockImplementation(() => {
                return of({ sections: testData.successData.result.response.section })
            }) as any;
            //act
            pageApiService.getPageData(param);
            setTimeout(() => {
                //assert
                expect(mockCacheService.get).toBeDefined();
                done();
            });
        });

        it('should return no pagedata', (done) => {
            //arrange
            const param = { source: 'web', name: 'Resource', filters: {}, sort_by: { 'lastUpdatedOn': 'desc' } };
            mockCacheService.get = jest.fn(() => 'pageApi' + param.name);
            jest.spyOn(pageApiService, 'getPageSectionData').mockImplementation(() => {
                return of()
            }) as any;
            //act
            pageApiService.getPageData(param);
            setTimeout(() => {
                //assert
                expect(pageApiService.getPageSectionData).toHaveBeenCalledWith(param);
                done();
            });
        });
    });

    describe('getBatchPageData', () => {
        it('should return the batch page data', (done) => {
            //arrange
            const param = { source: 'web', name: 'Resource', filters: {}, sort_by: { 'lastUpdatedOn': 'desc' } };
            jest.spyOn(pageApiService, 'getPageSectionData').mockImplementation(() => {
                return of()
            }) as any;
            //act
            pageApiService.getBatchPageData(param);
            setTimeout(() => {
                //assert
                expect(pageApiService.getPageSectionData).toBeCalledWith(param);
                done();
            });
        });
    });
});