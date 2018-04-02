// Import NG testing module(s)
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';

// Import services
import { UploadedComponent } from './uploaded.component';
import { SharedModule, PaginationService, ToasterService, ResourceService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';

// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Test data
import * as mockData from './uploaded.component.spec.data';
const testData = mockData.mockRes;
describe('UploadedComponent', () => {
  let component: UploadedComponent;
  let fixture: ComponentFixture<UploadedComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0014': 'Fetching uploaded content failed, please try again',
        'm0022': 'Deleting content failed, please try again later..'
      },
      'stmsg': {
        'm0023': 'We are fetching uploaded content...',
        'm0008': 'no-results',
        'm0012': 'You dont have any uploaded content......'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadedComponent],
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
    fixture = TestBed.createComponent(UploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(testData.searchSuccessWithCountTwo));
    component.fetchUploaded(9, 1);
    fixture.detectChanges();
    expect(component.uploaded).toBeDefined();
    expect(component.uploaded.length).toBeGreaterThan(1);
  }));

  it('should call delete api and get success response', inject([WorkSpaceService, ActivatedRoute],
    (workSpaceService, activatedRoute, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => Observable.of(testData.deleteSuccess));
      spyOn(component, 'deleteUploaded').and.callThrough();
      const params = { type: 'delete', contentId: 'do_2124645735080755201259' };
      component.deleteUploaded(params);
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
    component.fetchUploaded(9, 1);
    fixture.detectChanges();
    expect(component.uploaded.length).toBeLessThanOrEqual(0);
    expect(component.uploaded.length).toEqual(0);
  }));
});


