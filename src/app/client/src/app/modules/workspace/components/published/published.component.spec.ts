// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { PublishedComponent } from './published.component';

// Import services
import { SharedModule, PaginationService, ToasterService, ResourceService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';

// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Test data
import * as mockData from './published.component.spec.data';
const testData = mockData.mockRes;

describe('PublishedComponent', () => {
  let component: PublishedComponent;
  let fixture: ComponentFixture<PublishedComponent>;
  const resourceBundle =  {
       'messages': {
           'fmsg': {
               'm0013': 'Fetching published content failed, please try again'
           },
           'stmsg': {
               'm0022': 'You dont  have any published content...',
               'm0008': 'no-results',
               'm0034': 'We are deleting the content...'
          },
          'smsg': {
            'm0006': 'Content deleted successfully...'
          }
       }
   };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublishedComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule, SharedModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        {provide: ResourceService, useValue: resourceBundle}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // If search api returns more than one published
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(testData.searchSuccessWithCountTwo));
    component.fetchPublishedContent(9, 1);
    fixture.detectChanges();
    expect(component.publishedContent).toBeDefined();
    expect(component.publishedContent.length).toBeGreaterThan(1);
  }));

  it('should call delete api and get success response', inject([WorkSpaceService, ActivatedRoute],
    (workSpaceService, activatedRoute, resourceService, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => Observable.of(testData.deleteSuccess));
      spyOn(component, 'deletePublishedContent').and.callThrough();
      const params = { type: 'delete', contentId: 'do_2124341006465925121871' };
      component.deletePublishedContent(params);
      const DeleteParam = {
        contentIds: ['do_2124341006465925121871']
      };
      workSpaceService.deleteContent(DeleteParam).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
      fixture.detectChanges();
    }));
        // if  search api's throw's error
   it('should throw error', inject([SearchService], (searchService) => {
     spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.throw({}));
     component.fetchPublishedContent(9, 1);
     fixture.detectChanges();
     expect(component.publishedContent.length).toBeLessThanOrEqual(0);
     expect(component.publishedContent.length).toEqual(0);
   }));
});
