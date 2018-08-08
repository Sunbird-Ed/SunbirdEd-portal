
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
// Import NG testing module(s)
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Import services
import { WorkSpaceService } from './workspace.service';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
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
      providers: [WorkSpaceService,
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
      expect(route.navigate).toHaveBeenCalledWith(['/workspace/content/edit/generic/', 'do_1124858179748904961134', 'draft' , 'NCF']);
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
  it('should get session item and show respective alert message based on content type', () => {
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(window, 'addEventListener').and.callThrough();
    workSpaceService.toggleWarning('TextBook');
    expect(window.location.hash).toEqual('');
  });
  it('should get session item and show alert message if content type is not present', () => {
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(window, 'addEventListener').and.callThrough();
    workSpaceService.toggleWarning();
    expect(window.location.hash).toEqual('');
  });
});
