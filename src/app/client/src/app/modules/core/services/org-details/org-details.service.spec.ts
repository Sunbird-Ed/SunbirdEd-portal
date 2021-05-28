
import {of as observableOf,  Observable, throwError } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule, ContentService } from '@sunbird/core';
import { OrgDetailsService } from './org-details.service';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { serverRes } from './org-details.service.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
import { PublicDataService } from './../public-data/public-data.service';
import { LearnerService } from './../learner/learner.service';

describe('OrgDetailsService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [LearnerService, PublicDataService, OrgDetailsService, { provide: Router, useClass: RouterStub }]
    });
  });

  beforeEach(() => {
    spyOn(document, 'getElementById').and.callFake(() => {
      return {
        value: 'test'
      };
    });
  });

  it('Get a channel id', () => {
    const service = TestBed.get(OrgDetailsService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => observableOf(serverRes.successData));
    service.getOrgDetails('ap').subscribe(
      apiResponse => {
        expect(apiResponse).toBe(serverRes.successData.result.response.content[0]);
      }
    );
  });
  it('Get a org details', () => {
    const service = TestBed.get(OrgDetailsService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => observableOf(serverRes.orgDetails));
    service.searchOrg().subscribe(
      apiResponse => {
        expect(apiResponse).toBe(serverRes.orgDetails.result.response);
      }
    );
  });

  it('should call setOrg method to set the org data  ', inject([OrgDetailsService],
    (service: OrgDetailsService) => {
      service.setOrg(serverRes.orgDetails.result.response.content[0]);
      expect(service.orgInfo).toBeDefined();
      expect(service).toBeTruthy();
    }));

  it('Get a org details with org count', () => {
    const service = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'postWithHeaders').and.callFake(() => observableOf(serverRes.orgDetails));
    service.getOrgDetails('ap').subscribe(
      apiResponse => {
        expect(service.orgDetails).toBe(serverRes.orgDetails.result.response.content[0]);
      }
    );
  });

  it('Get a org details with out org count', () => {
    const service = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'postWithHeaders').and.callFake(() => observableOf(serverRes.noResultData));
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(serverRes.orgDetails));
    service.getOrgDetails('ap').subscribe(
      apiResponse => {
        expect(service.orgDetails).toBe(serverRes.orgDetails.result.response.content[0]);
      }
    );
  });

  it('Get a org details with out org count and throw error', () => {
    const service = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'postWithHeaders').and.callFake(() => observableOf(serverRes.noResultData));
    spyOn(publicDataService, 'post').and.callFake(() => throwError({}));
    service.getOrgDetails('ap').subscribe(
      apiResponse => { }, err => {
        expect(err).toEqual({});
      }
    );
  });

  it('Call getCommingSoonMessage', () => {
    const service = TestBed.get(OrgDetailsService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf({ result: { response: { value: '{test: 1}' } } }));
    service.getCommingSoonMessage(['1', '2']).subscribe((data) => {
      expect(data).toEqual({});
    });
  });

  it('Call getCommingSoonMessageObj', () => {
    const service = TestBed.get(OrgDetailsService);
    const returnValue = service.getCommingSoonMessageObj([{ rootOrgId: '1' }], ['1', '2']);
    expect(returnValue).toEqual({ rootOrgId: '1' });
  });

  it('Call setOrgDetailsToRequestHeaders', () => {
    const service = TestBed.get(OrgDetailsService);
    service.orgDetails = { id: '12345' };
    const learnerService = TestBed.get(LearnerService);
    service.setOrgDetailsToRequestHeaders();
    expect(learnerService.rootOrgId).toEqual('12345');
  });

  it('Call getOrg', () => {
    const service = TestBed.get(OrgDetailsService);
    service.orgInfo = {};
    const returnValue = service.getOrg();
    expect(returnValue).toEqual({});
  });

  it('Call getCustodianOrgDetails', () => {
    const service = TestBed.get(OrgDetailsService);
    service._custodianOrg$ = {};
    const returnValue = service.getCustodianOrgDetails();
    expect(returnValue).toEqual({});
  });

  it('Call fetchOrgs', () => {
    const service = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(observableOf(serverRes.orgDetails));
    service.fetchOrgs({}).subscribe((data) => {
      expect(publicDataService.post).toHaveBeenCalled();
      expect(data).toEqual(serverRes.orgDetails);
    });
  });

});

