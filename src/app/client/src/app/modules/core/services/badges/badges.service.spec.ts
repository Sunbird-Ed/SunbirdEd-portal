import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { DataService } from "..";
import { ConfigService } from '../../../shared/services/config/config.service';
import { BadgesService } from "./badges.service";
import { LearnerService } from './../learner/learner.service';

describe('BadgesService', () => {
  let badgesService: BadgesService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        PUBLIC_PREFIX: {},
        BADGE: {
          BADGE_CLASS_SEARCH: true,
          APP_INFO: true
        }
      }
    }
  };
  const req = {
    request: {
      filters: {
        'issuerList': [],
        'rootOrgId': '01285019302823526477',
        'roles': 'PUBLIC',
        'type': 'content',
      }
    }
  };
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { })
  };
  beforeAll(() => {
    badgesService = new BadgesService(
      mockConfigService as ConfigService,
      mockLearnerService as LearnerService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of badgeService', () => {
    expect(badgesService).toBeTruthy();
  });

  describe('getAllBadgeList', () => {
    it('should return all badge list', (done) => {
      jest.spyOn(badgesService.learner, 'post').mockReturnValue(of({
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
      badgesService.getAllBadgeList(req).subscribe(() => {
        done();
      });
    });

    it('should not return all badge list', () => {
      // arrange
      jest.spyOn(badgesService.learner, 'post').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      badgesService.getAllBadgeList(req).subscribe(() => {
      });
    });
  });
  describe('getDetailedBadgeAssertions', () => {
    it('should not return detailed badge Assertions', () => {
      // arrange
      jest.spyOn(badgesService.learner, 'post').mockImplementation(() => {
        return throwError({ error: {} });
      });
      const assertions = {};
      // act
      badgesService.getDetailedBadgeAssertions(req, assertions).subscribe(() => {
      });
    });
  });
  xit('should return detailed badge Assertions', (done) => {
    jest.spyOn(badgesService.learner, 'post').mockReturnValue(of({
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
    const assertions = {};
    // act
    badgesService.getDetailedBadgeAssertions(req, assertions).subscribe(() => {
      done();
    });
  });

});