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
import { Observable } from 'rxjs/Observable';
import * as mockData from './workspace.service.spec.data';
const testData = mockData.mockRes;

describe('WorkSpaceService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': Observable.from([{ pageNumber: '1' }]),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, CoreModule, SharedModule],
      providers: [WorkSpaceService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    });
  });
  it('should  launch  content  editor when mime type is content-collection',
    inject([WorkSpaceService, Router], (workSpaceService, route) => {
      workSpaceService.navigateToContent(testData.sucessData.result.content[0], 'draft');
      expect(route.navigate).toHaveBeenCalledWith(['/workspace/content/edit/contentEditor/', 'do_1124858179748904961134', 'draft', 'NCF']);
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
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => Observable.of(testData.deleteSuccess));
      const params = { type: 'delete', contentId: 'do_2124645735080755201259' };
      const DeleteParam = {
        contentIds: ['do_2124645735080755201259']
      };
      workSpaceService.deleteContent(DeleteParam);
      expect(workSpaceService).toBeTruthy();
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
