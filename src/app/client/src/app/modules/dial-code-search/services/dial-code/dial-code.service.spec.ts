import { CoreModule, SearchService, PlayerService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TestBed } from '@angular/core/testing';

import { DialCodeService } from './dial-code.service';
import { RouterTestingModule } from '@angular/router/testing';
import { mockData } from './dial-code.service.spec.data';
import { of, throwError } from 'rxjs';
describe('DialCodeService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule.forRoot(), CoreModule, RouterTestingModule],
    providers: [SearchService, PlayerService]
  }));

  it('should be created', () => {
    const service: DialCodeService = TestBed.get(DialCodeService);
    expect(service).toBeTruthy();
  });

  describe('searchDialCode function', () => {

    it('should return dial search results', () => {
      const dialCodeService = TestBed.get(DialCodeService);
      const searchService = TestBed.get(SearchService);
      spyOn(searchService, 'contentSearch').and.returnValue(of(mockData.dialCodeSearchApiResponse));
      dialCodeService.searchDialCode('646X5X', false).subscribe(res => {
        expect(searchService.contentSearch).toHaveBeenCalled();
        expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
        expect(searchService.contentSearch).toHaveBeenCalledWith({
          'filters': {
            'dialcodes': '646X5X'
          },
          'mode': 'collection',
          'params': {
            'orgdetails': 'orgName,email',
            'online': false
          }
        }, false);
        expect(res).toBeDefined();
        expect(res).toEqual(mockData.dialCodeSearchApiResponse.result);
      });
    });

  });

  describe('filterDialSearchResults function', () => {

    it('should return collections and contents from dial search results ', () => {
      const dialCodeService = TestBed.get(DialCodeService);
      spyOn(dialCodeService, 'getAllPlayableContent').and.callThrough();
      const results = dialCodeService.filterDialSearchResults(mockData.dialCodeSearchApiResponse.result);
      results.subscribe(res => {
        expect(res).toBeDefined();
        expect(res.collection).toBeDefined();
        expect(res.contents).toBeDefined();
        expect(res).toEqual({
          'collection': mockData.dialCodeSearchApiResponse.result.collections,
          'contents': []
        });
        expect(dialCodeService.dialCodeResult).toEqual(mockData.dialCodeSearchApiResponse.result);
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
          expect(playerService.getCollectionHierarchy).toHaveBeenCalledWith('do_21289679356020326415198');
          expect(result).toEqual(mockData.courseHierarchApiResponse.result.content);
        });
    });

  });

  describe('groupCollections function', () => {

    it('should group contents based on their content type', () => {
      const dialCodeService = TestBed.get(DialCodeService);
      const result = dialCodeService.groupCollections(mockData.dialCodeSearchApiResponse.result.content);
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
