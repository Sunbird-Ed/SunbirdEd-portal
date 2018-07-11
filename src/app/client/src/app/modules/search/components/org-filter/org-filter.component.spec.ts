
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, INoResultMessage
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { OrgTypeService } from '@sunbird/org-management';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { OrgFilterComponent } from './org-filter.component';
import { OrgSearchComponent } from './../org-search/org-search.component';
import { Response } from './org-filter.component.spec.data';
describe('OrgFilterComponent', () => {
  let component: OrgFilterComponent;
  let fixture: ComponentFixture<OrgFilterComponent>;
  let parentcomponent: OrgSearchComponent;
  let parentfixture: ComponentFixture<OrgSearchComponent>;
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
    parentcomponent = parentfixture.componentInstance;
  });

  it('should call resetFilters method ', inject([ConfigService, Router],
    (configService, route) => {
      component.resetFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/Organisations', 1]);
      fixture.detectChanges();
    }));

  it('should take input of query param ', inject([ConfigService, OrgTypeService, Router],
    (configService, orgTypeService, route) => {
      component.queryParams = { OrgType: '0123462652405350403' };
      spyOn(orgTypeService, 'getOrgTypes').and.callFake(() => observableOf(Response.successData));
      fixture.detectChanges();
  }));

  it('should call removeFilterSelection ', inject([ConfigService, OrgTypeService, Router],
    (configService, orgTypeService, route) => {
      component.queryParams = { OrgType: '0123462652405350403' };
      component.removeFilterSelection('OrgType', '01243890163646464054');
      fixture.detectChanges();
  }));
});
