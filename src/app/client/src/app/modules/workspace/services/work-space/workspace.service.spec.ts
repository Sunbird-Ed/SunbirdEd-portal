
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpaceService } from './workspace.service';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import * as mockData from './workspace.service.spec.data';
const testData = mockData.mockRes;

describe('WorkSpaceService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [WorkSpaceService, CacheService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    });
  });
  it('should  launch  content  editor when mime type is content-collection',
    inject([WorkSpaceService, Router], (workSpaceService, route) => {
      workSpaceService.navigateToContent(testData.sucessData.result.content[0], 'draft');
      expect(route.navigate).toHaveBeenCalledWith(['/workspace/content/edit/content/', 'do_1124858179748904961134', 'draft', 'NCF']);
    }));

  it('should  launch  collection  editor when mime type is ecml-archive',
    inject([WorkSpaceService, Router], (workSpaceService, route) => {
      workSpaceService.navigateToContent(testData.sucessData.result.content[1], 'review');
      expect(route.navigate).toHaveBeenCalledWith(['/workspace/content/edit/collection',
        'do_1124858179748904961134', 'Resource', 'review', 'NCF']);
    }));

  it('should  launch  generic  editor when mime type is not matching ',
    inject([WorkSpaceService, Router], (workSpaceService, route) => {
      workSpaceService.navigateToContent(testData.sucessData.result.content[2], 'draft');
      expect(route.navigate).toHaveBeenCalledWith(['/workspace/content/edit/generic/', 'do_1124858179748904961134', 'draft', 'NCF']);
    }));
  it('should call delete api and get success response', inject([WorkSpaceService],
    (workSpaceService) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => observableOf(testData.deleteSuccess));
      const params = { type: 'delete', contentId: 'do_2124645735080755201259' };
      const DeleteParam = {
        contentIds: ['do_2124645735080755201259']
      };
      workSpaceService.deleteContent(DeleteParam);
      expect(workSpaceService).toBeTruthy();
    }));

  it('should call delete api and  get error response', inject([WorkSpaceService],
    (workSpaceService) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => observableThrowError(testData.deleteError));
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
  it('should  launch  content player  when mime type is video/x-youtube and state is upForReview ',
    inject([WorkSpaceService, Router], (workSpaceService, route) => {
      workSpaceService.navigateToContent(testData.upforReviewContentData, 'upForReview');
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview/content', 'do_1125083103747932161150']);
    }));
  it('should get checklist data and set the cachelist data in cache', inject([WorkSpaceService, CacheService],
    (workSpaceService: WorkSpaceService, cacheService: CacheService) => {
      spyOn(workSpaceService, 'setData').and.callThrough();
      spyOn(workSpaceService, 'getFormData').and.callThrough();
      const param = {
        'type': 'content',
        'action': 'requestChangesChecklist',
        'subType': 'Resource',
        'rootOrgId': 'b00bc992ef25f1a9a8d63291e20efc8d'
      };
      workSpaceService.getFormData(param);
      workSpaceService.getFormData(param).subscribe(apiResponse => {
        expect(apiResponse).toBeDefined();
        expect(workSpaceService.setData).toHaveBeenCalled();
        cacheService.set('requestChangesChecklistResource',
          testData.ChecklistData, { maxAge: 10 * 60 });
      });
      expect(workSpaceService.getFormData).toHaveBeenCalledWith(param);
      expect(workSpaceService).toBeTruthy();
    }));
});
