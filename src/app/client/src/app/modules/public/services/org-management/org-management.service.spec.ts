import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule, ContentService } from '@sunbird/core';
import { OrgManagementService } from './org-management.service';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { serverRes } from './org-management.service.spec.data';
import { RouterTestingModule } from '@angular/router/testing';

describe('PublicPlayerService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [OrgManagementService, { provide: Router, useClass: RouterStub }]
    });
  });

  it('Get a channel id', () => {
    const service = TestBed.get(OrgManagementService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => Observable.of(serverRes.successData));
    service.getChannel('ap').subscribe(
      apiResponse => {
        expect(apiResponse).toBe('0123166367624478721');
      }
    );
  });
});
