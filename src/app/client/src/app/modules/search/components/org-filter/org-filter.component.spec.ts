
import {of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, PaginationService, ResourceService,
  ConfigService, ToasterService
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { OrgTypeService } from '@sunbird/org-management';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { OrgFilterComponent } from './org-filter.component';
import { OrgSearchComponent } from './../org-search/org-search.component';
import { Response } from './org-filter.component.spec.data';
describe('OrgFilterComponent', () => {
  let component: OrgFilterComponent;
  let fixture: ComponentFixture<OrgFilterComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ OrgType: ['012352495007170560157'] })
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), Ng2IziToastModule],
      declarations: [OrgFilterComponent, OrgSearchComponent],
      providers: [ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService, OrgTypeService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgFilterComponent);
    component = fixture.componentInstance;
    parentfixture = TestBed.createComponent(OrgSearchComponent);
  });

  it('should call resetFilters method ', inject([Router], (route) => {
      component.resetFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/Organisations', 1]);
      fixture.detectChanges();
    }));

  it('should take input of query param ', inject([OrgTypeService], (orgTypeService) => {
      component.queryParams = { OrgType: '0123462652405350403' };
      spyOn(orgTypeService, 'getOrgTypes').and.callFake(() => observableOf(Response.successData));
      fixture.detectChanges();
  }));

  it('should call removeFilterSelection ', () => {
      component.queryParams = { OrgType: '0123462652405350403' };
      component.removeFilterSelection('OrgType', '01243890163646464054');
      fixture.detectChanges();
  });
});
