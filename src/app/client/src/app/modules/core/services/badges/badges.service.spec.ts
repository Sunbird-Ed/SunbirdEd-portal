import { TestBed, inject } from '@angular/core/testing';
import { LearnerService } from '@sunbird/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { BadgesService } from './badges.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('BadgesService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [BadgesService, ConfigService, HttpClient, LearnerService]
    });
  });

  it('should be created', inject([BadgesService], (service: BadgesService) => {
    expect(service).toBeTruthy();
  }));

  it('should be  call initialize', () => {
    const badgesService: BadgesService = TestBed.get(BadgesService);
    spyOn(badgesService, 'initialize');
    badgesService.initialize();
    expect(badgesService.initialize).toHaveBeenCalled();
  });

  it('should be  call getAllBadgeList', () => {
    const badgesService: BadgesService = TestBed.get(BadgesService);
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
    spyOn(badgesService, 'getAllBadgeList');
    badgesService.getAllBadgeList(req);
    expect(badgesService.getAllBadgeList).toHaveBeenCalledWith(req);
  });

  it('should be  call getDetailedBadgeAssertions', () => {
    const badgesService: BadgesService = TestBed.get(BadgesService);
    const req = {
      request: {
        filters: {
          'badgeList': [],
          'type': 'user',
          'rootOrgId': '01285019302823526477'
        }
      }
    };
    spyOn(badgesService, 'getDetailedBadgeAssertions');
    badgesService.getDetailedBadgeAssertions(req, []);
    expect(badgesService.getDetailedBadgeAssertions).toHaveBeenCalledWith(req, []);
  });
});
