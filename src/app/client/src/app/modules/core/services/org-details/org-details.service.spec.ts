
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule, ContentService } from '@sunbird/core';
import { OrgDetailsService } from './org-details.service';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { serverRes } from './org-details.service.spec.data';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrgDetailsService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [OrgDetailsService, { provide: Router, useClass: RouterStub }]
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
});

