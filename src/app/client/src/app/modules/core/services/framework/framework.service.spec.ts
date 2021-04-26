
import { throwError, of , Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FrameworkService, UserService, CoreModule, PublicDataService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { configureTestSuite } from '@sunbird/test-util';

describe('FrameworkService', () => {
  let userService, publicDataService, frameworkService, cacheService;
  let mockHashTagId: string, mockFrameworkInput: string;
  let mockFrameworkCategories: Array<any> = [];
  let makeChannelReadSuc, makeFrameworkReadSuc  = true;
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [CacheService]
    });
    cacheService = TestBed.get(CacheService);
    userService = TestBed.get(UserService);
    publicDataService = TestBed.get(PublicDataService);
    frameworkService = TestBed.get(FrameworkService);
    spyOn(cacheService, 'get').and.returnValue(undefined);
    spyOn(publicDataService, 'get').and.callFake((options) => {
      if (options.url === 'channel/v1/read/' + mockHashTagId && makeChannelReadSuc) {
        return of({result: {channel: {defaultFramework: mockFrameworkInput}}});
      } else if (options.url === 'framework/v1/read/' + mockFrameworkInput && makeFrameworkReadSuc) {
        return of({result: {framework: {code: mockFrameworkInput, categories: mockFrameworkCategories}}});
      }
      return throwError({});
    });
  });

  it('should fetch channel then framework data if initial was call with 0 param and emit data if both api return data', () => {
    mockHashTagId = undefined;
    mockFrameworkInput = undefined;
    mockFrameworkCategories = [];
    makeChannelReadSuc = true;
    makeFrameworkReadSuc = true;
    frameworkService.initialize();
    frameworkService.frameworkData$.subscribe((data) => {
      expect(data.frameworkdata).toBeDefined();
      expect(data.err).toBeNull();
    });
  });
  it('should fetch channel then framework data if initial was call with 0 param and emit error if channel api fails', () => {
    mockHashTagId = undefined;
    mockFrameworkInput = undefined;
    mockFrameworkCategories = [];
    makeChannelReadSuc = false;
    makeFrameworkReadSuc = true;
    frameworkService.initialize();
    frameworkService.frameworkData$.subscribe((data) => {
      expect(data.frameworkdata).toBeNull();
      expect(data.err).toBeDefined();
    });
  });
  it('should fetch channel then framework data if initial was call with 0 param and emit error if framework read api fails', () => {
    mockHashTagId = undefined;
    mockFrameworkInput = undefined;
    mockFrameworkCategories = [];
    makeChannelReadSuc = true;
    makeFrameworkReadSuc = false;
    frameworkService.initialize();
    frameworkService.frameworkData$.subscribe((data) => {
      expect(data.frameworkdata).toBeNull();
      expect(data.err).toBeDefined();
    });
  });
  it('should fetch only framework data if initial was call with framework param and emit data if framework read api return data', () => {
    mockHashTagId = undefined;
    mockFrameworkInput = 'NCF';
    mockFrameworkCategories = [];
    makeChannelReadSuc = true;
    makeFrameworkReadSuc = true;
    frameworkService.initialize('NCF');
    frameworkService.frameworkData$.subscribe((data) => {
      expect(data.frameworkdata).toBeDefined();
      expect(data.err).toBeNull();
    });
  });
  it('should fetch only framework data if initial was call with framework param and emit data if framework read api return data', () => {
    mockHashTagId = undefined;
    mockFrameworkInput = 'NCF';
    mockFrameworkCategories = [];
    makeChannelReadSuc = true;
    makeFrameworkReadSuc = true;
    frameworkService.initialize('NCF');
    frameworkService.frameworkData$.subscribe((data) => {
      expect(data.frameworkdata).toEqual({'NCF': {'code': 'NCF', 'categories': []}});
      expect(data.err).toBeDefined();
    });
  });

  it('should fetch the default course framework from channel read api', () => {
    cacheService.get('defaultCourseFramework', null);
    spyOn<any>(frameworkService, 'getChannel').and.callThrough();
    frameworkService.getDefaultCourseFramework('012451140510203904560');
    expect(frameworkService['getChannel']).toHaveBeenCalledWith('012451140510203904560');
  });
});


