import { TestBed, inject } from '@angular/core/testing';
// Import NG testing module(s)
import { HttpClientModule } from '@angular/common/http';
// Import services
import { WorkSpaceService } from './workspace.service';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { ContentService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import * as mockData from './workspace.service.spec.data';
const testData = mockData.mockRes;

describe('WorkSpaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [WorkSpaceService, ConfigService, ContentService]
    });
  });

  it('should be created', inject([WorkSpaceService], (service: WorkSpaceService) => {
    expect(service).toBeTruthy();
  }));

  it('should  open content  editor', inject([WorkSpaceService], (workSpaceService) => {
    workSpaceService.openContentEditor();
  }));

  it('should call delete api and get success response', inject([WorkSpaceService],
    (workSpaceService) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => Observable.of(testData.deleteSuccess));
      const params = { type: 'delete', contentId: 'do_2124645735080755201259' };
      const DeleteParam = {
        contentIds: ['do_2124645735080755201259']
      };
      workSpaceService.deleteContent(DeleteParam).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
  }));
  it('should call delete api and  get error response', inject([WorkSpaceService],
    (workSpaceService) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => Observable.throw(testData.deleteError));
      const params = { type: 'delete', contentId: '' };
      const DeleteParam = {
        contentIds: ['do_2124645735080755201259']
      };
      workSpaceService.deleteContent(params).subscribe(
      apiResponse => { },
      err => {
        expect(err.params.errmsg).toBe('Required field token is missing');
        expect(err.responseCode).toBe('UNAUTHORIZED_ACCESS');
      }
    );
  }));

});
