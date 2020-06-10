import { CoreModule, SearchService, PlayerService, UserService, PublicDataService } from '@sunbird/core';
import { SharedModule, ConfigService } from '@sunbird/shared';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DialCodeService } from './dial-code.service';
import { RouterTestingModule } from '@angular/router/testing';
import { mockData } from './dial-code.service.spec.data';
import { of, throwError } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';

describe('DialCodeService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule.forRoot(), CoreModule, RouterTestingModule, HttpClientTestingModule],
    providers: [SearchService, PlayerService]
  }));

  it('should be created', () => {
    const service: DialCodeService = TestBed.get(DialCodeService);
    expect(service).toBeTruthy();
  });

  describe('searchDialCodeAssemble function', () => {

    it('should return the request object for dial code', () => {
      const funresponse = {
        url: 'data/v1/dial/assemble',
        data: {
          request: {
            source: 'web',
            name: 'DIAL Code Consumption',
            filters: {
              dialcodes: 'K2W1G4',
              contentType: ['Collection', 'TextBook', 'TextBookUnit', 'Resource', 'Course']
            },
            userProfile: { board: 'CBSE' }
          }
        }
      };
      const service: DialCodeService = TestBed.get(DialCodeService);
      spyOn(service, 'getRequest').and.returnValue(funresponse);
      const res = service.getRequest('K2W1G4');
      expect(res).toBeTruthy();
    });

    it('should return dial search results for logged In', () => {
      const service: DialCodeService = TestBed.get(DialCodeService);
      const userService = TestBed.get(UserService);
      const publicDataService = TestBed.get(PublicDataService);
      spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ framework: {
        board: 'CBSE'
        } });
      spyOn(publicDataService, 'post').and.returnValue(of({result: {
          response: {
              sections: [
                  {}
              ]
          }
      }}));
      service.searchDialCodeAssemble('K2W1G4', true).subscribe(res => {
        expect(res).toBeDefined();
      });
      const option = service.getRequest('K2W1G4');
      expect(publicDataService.post).toHaveBeenCalledWith(option);
    });

    it('should return dial search results for Not logged In', () => {
      const service: DialCodeService = TestBed.get(DialCodeService);
      const userService = TestBed.get(UserService);
      const publicDataService = TestBed.get(PublicDataService);
      spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ });
      spyOn(publicDataService, 'post').and.returnValue(of({result: {
          response: {
              sections: [
                  {}
              ]
          }
      }}));
      service.searchDialCodeAssemble('K2W1G4', true).subscribe(res => {
        expect(res).toBeDefined();
      });
      const option = service.getRequest('K2W1G4');
      expect(publicDataService.post).toHaveBeenCalledWith(option);
    });

    it('Get request should return request body', () => {
      const userService = TestBed.get(UserService);
      spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ framework: {
        board: 'CBSE'
        } });
      const optionMock = {
        url: 'data/v1/dial/assemble',
        data: {
          request: {
            source: 'web',
            name: 'DIAL Code Consumption',
            filters: {
              dialcodes: 'K2W1G4',
              contentType: ['Collection', 'TextBook', 'TextBookUnit', 'Resource', 'Course']
            },
            userProfile: { board: 'CBSE' }
          }
        }
      };
      const service: DialCodeService = TestBed.get(DialCodeService);
      const requestBody = service.getRequest('K2W1G4');
      expect(requestBody).toBeDefined();
      expect(requestBody).toEqual(optionMock);
    });

  });

  describe('filterDialSearchResults function', () => {

    it('should return collections and contents from dial search results ', () => {
      const dialCodeService = TestBed.get(DialCodeService);
      spyOn(dialCodeService, 'getAllPlayableContent').and.callThrough();
      const results = dialCodeService.filterDialSearchResults(mockData.dialCodeSearchApiResponse.result.response.sections[0]);
      results.subscribe(res => {
        expect(res).toBeDefined();
        expect(res.collection).toBeDefined();
        expect(res.contents).toBeDefined();
        expect(dialCodeService.dialCodeResult).toEqual(mockData.dialCodeSearchApiResponse.result.response.sections[0]);
      });
    });
  });

  describe('parseCollection function', () => {

    it('should return contents from a collection', () => {
      const dialCodeService = TestBed.get(DialCodeService);
      const result = dialCodeService.parseCollection(mockData.courseHierarchApiResponse.result.content);
        expect(result).toBeDefined();
        expect(result.length).toBeTruthy();
        expect(result.length).toBe(9);
        expect(result).toEqual(mockData.parsedCollection);
    });

  });

  describe('getCollectionHierarchy function', () => {

    it('should return collection heirarchy', () => {
      const dialCodeService = TestBed.get(DialCodeService);
      const playerService = TestBed.get(PlayerService);
      spyOn(playerService, 'getCollectionHierarchy').and.returnValue(of(mockData.courseHierarchApiResponse));
      dialCodeService.getCollectionHierarchy('do_21289679356020326415198')
        .subscribe(result => {
          expect(result).toBeDefined();
          expect(playerService.getCollectionHierarchy).toHaveBeenCalled();
          expect(playerService.getCollectionHierarchy).toHaveBeenCalledWith('do_21289679356020326415198', undefined);
          expect(result).toEqual(mockData.courseHierarchApiResponse.result.content);
        });
    });

  });

  describe('groupCollections function', () => {

    it('should group contents based on their content type', () => {
      const dialCodeService = TestBed.get(DialCodeService);
      const result = dialCodeService.groupCollections(mockData.dialCodeSearchApiResponse.result.response.sections[0].collections);
      expect(result).toEqual(mockData.groupedCollection);
      expect(result).toBeDefined();
    });

  });

  describe('getAllPlayableContent function', () => {

    let dialCodeService: DialCodeService, playerService: PlayerService;

    beforeEach(() => {
      dialCodeService = TestBed.get(DialCodeService);
      playerService = TestBed.get(PlayerService);
      spyOn(dialCodeService, 'getCollectionHierarchy').and.callThrough();
    });

    it('should return empty array when no collections are passed', () => {
      spyOn(playerService, 'getCollectionHierarchy').and.returnValue(of(mockData.courseHierarchApiResponse));
      dialCodeService.getAllPlayableContent([]).subscribe(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(0);
        expect(result).toEqual([]);
      });
    });

    it('should return empty array when error occurs', () => {
      spyOn(playerService, 'getCollectionHierarchy').and.returnValue(throwError(mockData.courseHierarchApiResponse));
      dialCodeService.getAllPlayableContent([]).subscribe(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(0);
        expect(result).toEqual([]);
      });
    });

    it('should return list of playable contents for all collection ids passed', () => {
      spyOn(playerService, 'getCollectionHierarchy').and.returnValue(of(mockData.courseHierarchApiResponse));
      dialCodeService.getAllPlayableContent(['do_21289679356020326415198', 'do_21289679356020326415199']).subscribe(result => {
        expect(result).toBeDefined();
        expect(dialCodeService.getCollectionHierarchy).toHaveBeenCalled();
        expect(dialCodeService.getCollectionHierarchy).toHaveBeenCalledTimes(2);
        expect(playerService.getCollectionHierarchy).toHaveBeenCalled();
        expect(playerService.getCollectionHierarchy).toHaveBeenCalledTimes(2);
        expect(result.length).toBe(18);
        expect(result).toEqual([...mockData.parsedCollection, ...mockData.parsedCollection]);
      });
    });
  });
});
