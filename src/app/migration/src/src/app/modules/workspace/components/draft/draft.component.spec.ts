import { DeleteComponent } from './../../../announcement/components/delete/delete.component';
// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Import services
import { DraftComponent } from './draft.component';
import { SharedModule, PaginationService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';

// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Test data
import * as mockData from './draft.component.spec.data';
const testData = mockData.mockRes;
describe('DraftComponent', () => {
  let component: DraftComponent;
  let fixture: ComponentFixture<DraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DraftComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // If search api returns more than one draft
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => Observable.of(testData.searchSuccessWithCountTwo));
    component.fetchDrafts();
    fixture.detectChanges();
    expect(component.drafList).toBeDefined();
    expect(component.drafList.length).toBeGreaterThan(1);
  }));

   it('should call delete api and get success response', inject([WorkSpaceService, ActivatedRoute],
    (workSpaceService, activatedRoute, resourceService, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => Observable.of(testData.deleteSuccess));
      spyOn(component, 'deleteDraft').and.callThrough();
      const params = {type: 'delete', contentId: 'do_2124645735080755201259'};
      component.deleteDraft(params);
       const DeleteParam = {
           contentIds: ['do_2124645735080755201259']
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
     spyOn(searchService, 'searchContentByUserId').and.callFake(() => Observable.throw({}));
     component.fetchDrafts();
     fixture.detectChanges();
     expect(component.drafList.length).toBeLessThanOrEqual(0);
     expect(component.drafList.length).toEqual(0);
   }));
});


