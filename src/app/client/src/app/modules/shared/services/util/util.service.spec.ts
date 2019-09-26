import { servicemockRes } from './util.service.spec.data';
import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService]
    });
  });

  it('should be created', inject([UtilService], (service: UtilService) => {
    expect(service).toBeTruthy();
  }));
  xit('should call manipulateSoftConstraint when filter present',
    inject([UtilService], (service: UtilService) => {
      const softConstraintData = {
        filters: {channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
        board: ['NCERT']},
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        mode: 'soft'
      };
      const userFrameworkData = {
        board: ['CBSE']
      };
      const filter =  true;
      const softconstraintsdata = service.manipulateSoftConstraint(filter, softConstraintData, userFrameworkData);
      expect(service.manipulateSoftConstraint).toBeDefined();
      expect(softconstraintsdata).toBeFalsy();
    }));

  xit('should call manipulateSoftConstraint when filters are not present and userFrameworkData is present',
    inject([UtilService], (service: UtilService) => {
      const softConstraintData = {
        filters: {channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
        board: ['NCERT']},
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        mode: 'soft'
      };
      const userFrameworkData = {
        board: ['CBSE']
      };
      const filter = undefined;
      const softconstraintsdata = service.manipulateSoftConstraint(filter, softConstraintData, userFrameworkData);
      expect(service.manipulateSoftConstraint).toBeDefined();
      expect(softconstraintsdata).toEqual({filters: userFrameworkData , mode: 'soft'});
    }));

    it('should call getPlayerDownloadStatus() return true', () => {
      const utilService = TestBed.get(UtilService);
      const value = utilService.getPlayerDownloadStatus('DOWNLOAD', servicemockRes.successResult.result.content, 'browse');
      expect(value).toBeTruthy();
    });
    it('should call getPlayerDownloadStatus() return false', () => {
      const utilService = TestBed.get(UtilService);
      const value = utilService.getPlayerDownloadStatus('DOWNLOAD', servicemockRes.successResult.result.content, 'library');
      expect(value).toBeFalsy();
    });
    it('should call getPlayerDownloadStatus() return true when status is failed', () => {
      const utilService = TestBed.get(UtilService);
      const value = utilService.getPlayerDownloadStatus('FAILED', servicemockRes.successResult.result.content, 'browse');
      expect(value).toBeTruthy();
    });
});
