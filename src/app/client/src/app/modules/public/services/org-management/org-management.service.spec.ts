import { TestBed, inject } from '@angular/core/testing';
import { CoreModule, ContentService } from '@sunbird/core';
import { OrgManagementService } from './org-management.service';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
 import { serverRes } from './org-management.service.spec.data';
import { UUID } from 'angular2-uuid';


describe('PublicPlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule],
      providers: [OrgManagementService]
    });
  });

it('Get a channel id', () => {
    const service = TestBed.get(OrgManagementService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => Observable.of(serverRes));
    service.getChannel('ap').subscribe(
      apiResponse => {
         expect(apiResponse).toBe('0123166367624478721');
      }
    );
  });
});
