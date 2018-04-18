import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, INoResultMessage
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './org-search.component.spec.data';

import { OrgSearchComponent } from './org-search.component';

describe('OrgSearchComponent', () => {
  let component: OrgSearchComponent;
  let fixture: ComponentFixture<OrgSearchComponent>;

  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0008': 'no-results',
        'm0007': 'Please search for something else.'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, Ng2IziToastModule, RouterTestingModule],
      declarations: [OrgSearchComponent],
      providers: [ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call search api', () => {
    const searchService = TestBed.get(SearchService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(searchService, 'orgSearch').and.callFake(() => Observable.of(Response.successData));
    component.populateOrgSearch();
    fixture.detectChanges();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
  });

  it('should throw error when searchService api is not called', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'orgSearch').and.callFake(() => Observable.throw({}));
    component.populateOrgSearch();
    fixture.detectChanges();
    expect(component.searchList.length).toBeLessThanOrEqual(0);
    expect(component.searchList.length).toEqual(0);
    expect(component.noResult).toBeFalsy();
  });
  // it('should call downloadOrganisation method to download a csv file', () => {
  //   component.downloadOrganisation();
  //   fixture.detectChanges();
  // });

  it('should call navigateToPage method and page number should be default, i,e 1', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = Response.pager;
      component.pager.totalPages = 0;
      component.navigateToPage(3);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
      expect(component.pageLimit).toEqual(configService.appConfig.SEARCH.PAGE_LIMIT);
  }));
});
