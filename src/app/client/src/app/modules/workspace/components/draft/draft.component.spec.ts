import { DeleteComponent } from './../../../announcement/components/delete/delete.component';
// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';

// Import services
import { DraftComponent } from './draft.component';
import { SharedModule, PaginationService, ToasterService, ResourceService } from '@sunbird/shared';
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
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0006': 'Fetching draft content failed, please try again',
        'm0022': 'Deleting content failed, please try again later..'
      },
      'stmsg': {
        'm0011': 'We are fetching draft content...',
        'm0008': 'no-results',
        'm0012': 'You dont have any draft content...'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DraftComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule, SharedModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(testData.searchSuccessWithCountTwo));
    component.fetchDrafts(9, 1);
    fixture.detectChanges();
    expect(component.draftList).toBeDefined();
    expect(component.draftList.length).toBeGreaterThan(1);
  }));

  it('should call delete api and get success response', inject([WorkSpaceService, ActivatedRoute],
    (workSpaceService, activatedRoute, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => Observable.of(testData.deleteSuccess));
      spyOn(component, 'deleteDraft').and.callThrough();
      const params = { type: 'delete', contentId: 'do_2124645735080755201259' };
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
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.throw({}));
    component.fetchDrafts(9, 1);
    fixture.detectChanges();
    expect(component.draftList.length).toBeLessThanOrEqual(0);
    expect(component.draftList.length).toEqual(0);
  }));
});


