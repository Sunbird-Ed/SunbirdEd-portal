import { ConfigService } from '@sunbird/shared';
import { SearchService, PlayerService, UserService, PublicDataService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { of, Observable, iif, forkJoin } from 'rxjs';
import TreeModel from 'tree-model';
import { CslFrameworkService } from '../../../../modules/public/services/csl-framework/csl-framework.service';
import { DialCodeService } from './dial-code.service';

describe('CslFrameworkService', () => {
  let dialCodeService: DialCodeService;

 const mockData = {
    exampleProperty: 'exampleValue',
  };

   const searchServiceMock: Partial<SearchService> = {
    orgSearch: jest.fn(() => of(
      {
        result: {
          response: { content: [{ id: 'sunbird' }, { id: 'rj' }] }
        }
      }
    )) as any,
  };

  const configServiceMock: Partial<ConfigService> = {
    appConfig: {
      frameworkCatConfig: {
        changeChannel: true,
        defaultFW: 'someDefaultFramework'
      }
    }
  };

  const playerServiceMock: Partial<PlayerService> = {
    getCollectionHierarchy: jest.fn().mockReturnValue(of(mockData)),
  };

  const userServiceMock: Partial<UserService> = {
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id'],
        profileUserType: {
          type: 'student'
        }
      } as any
    }) as any
  };

  const publicDataServiceMock: Partial<PublicDataService> = {
    post: jest.fn().mockReturnValue(of(mockData)),
  };

  const cslFrameworkServiceMock: Partial<CslFrameworkService> = {
     getFrameworkCategories: jest.fn().mockReturnValue(of({
      result: {
        framework: {
          categories: [
            { code: 'board', terms: [{ name: 'CBSE' }] }]
        }
      }
    }) as any),
  };

  beforeEach(() => {
    dialCodeService = new DialCodeService(
      searchServiceMock as SearchService,
      configServiceMock as ConfigService,
      playerServiceMock as PlayerService,
      configServiceMock as ConfigService,
      userServiceMock as UserService,
      publicDataServiceMock as PublicDataService,
      cslFrameworkServiceMock as CslFrameworkService
    );
  });

  it('should be created', () => {
    expect(DialCodeService).toBeTruthy();
  });

  it('should create DialCodeService instance with correct frameworkCategories', () => {
    expect(dialCodeService).toBeTruthy();
    expect(cslFrameworkServiceMock.getFrameworkCategories).toHaveBeenCalled();
    dialCodeService['frameworkCategories'].subscribe((frameworkCategories) => {
      expect(frameworkCategories).toEqual({
        result: {
          framework: {
            categories: [
              { code: 'board', terms: [{ name: 'CBSE' }] }]
          }
        }
      });
    });
  });
});
