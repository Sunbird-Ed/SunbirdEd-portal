import { UserSearchComponent } from './../user-search/user-search.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
 SharedModule, ServerResponse, PaginationService, ResourceService,
 ConfigService, ToasterService, INoResultMessage
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { OrgTypeService } from '@sunbird/org-management';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash-es';
import { Observable, of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserFilterComponent } from './user-filter.component';
import { UserSearchService } from './../../services';

describe('UserFilterComponent', () => {
  let component: UserFilterComponent;
  let fixture: ComponentFixture<UserFilterComponent>;
 const fakeActivatedRoute = {
  'params': observableOf({ pageNumber: '1' }),
  'queryParams':  observableOf({ Grades: ['Grade 2'] })
};
 class RouterStub {
   navigate = jasmine.createSpy('navigate');
 }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot()],
      declarations: [ UserFilterComponent ],
      providers: [ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService, UserSearchService,
        { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('valueField must be code', async(() => {
      expect(component.valueField).toEqual('code');
  }));

  it('should call resetFilters method ', inject([ConfigService, Router], () => {
      component.resetFilters();
      fixture.detectChanges();
      expect(component.selectedDistrict).toBe('');
      expect(component.selectedBlock).toBe('');
      expect(component.selectedSchool).toBe('');
  }));

  it('should call applyFilters method ', inject([ConfigService, Router], () => {
      spyOn(component, 'applyFilters').and.callThrough();
      component.applyFilters();
      fixture.detectChanges();
      expect(component.applyFilters).toHaveBeenCalled();
  }));

  it('should call removeFilterSelection method ', inject([ConfigService, Router], () => {
      component.queryParams = { Grades: ['03'] };
      fixture.detectChanges();
  }));

  it('should call subscribeToQueryParams method ', inject([ConfigService, Router], () => {
      spyOn<any>(component, 'subscribeToQueryParams').and.callThrough();
      fixture.detectChanges();
  }));

  it('should call settelemetryData method ', inject([ConfigService, Router], () => {
      component.settelemetryData();
      fixture.detectChanges();
      expect(component.resetInteractEdata['id']).toBe('reset-user-filter');
      expect(component.resetInteractEdata['type']).toBe('click');
      expect(component.resetInteractEdata['pageid']).toBe('user-search');
      expect(component.telemetryInteractObject['type']).toBe('User');
      expect(component.telemetryInteractObject['ver']).toBe('1.0');
  }));

  it('should call getUserType method ', inject([ConfigService, Router], () => {
      component.getUserType();
      fixture.detectChanges();
  }));

  it('should call combineAllApis method ', inject([ConfigService, Router], async () => {
      spyOn(component, 'combineAllApis').and.callThrough();
      await fixture.detectChanges();
      component.combineAllApis();
      await fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.showFilters).toBeFalsy();
      });
  }));

  it('should call getFormatedFilterDetails method ', inject([ConfigService, Router], () => {
      spyOn<any>(component, 'getFormatedFilterDetails').and.callThrough();
      fixture.detectChanges();
  }));

  it('should call getDistrict method ', inject([ConfigService, Router], () => {
      component.getDistrict();
      fixture.detectChanges();
  }));

  it('should call getBlock method ', inject([ConfigService, Router], () => {
      component.getBlock('');
      fixture.detectChanges();
  }));

  it('should call getSchool method ', inject([ConfigService, Router], () => {
      component.getSchool('');
      fixture.detectChanges();
  }));

  it('should call getRoles method ', inject([ConfigService, Router], () => {
      component.getRoles();
      fixture.detectChanges();
  }));

  it('should call hardRefreshFilter method ', inject([ConfigService, Router], () => {
      spyOn<any>(component, 'hardRefreshFilter').and.callThrough();
      fixture.detectChanges();
      expect(component.refresh).toBeTruthy();
  }));

  it('should call selectedValue method ', inject([ConfigService, Router], () => {
      component.selectedValue('event', 'code');
      fixture.detectChanges();
      expect(component.inputData['code']).toBe('event');
  }));

  it('should call onDistrictChange method ', inject([ConfigService, Router], () => {
      component.onDistrictChange('event');
      fixture.detectChanges();
      expect(component.inputData['District']).toBeTruthy();
  }));

  it('should call onBlockChange method ', inject([ConfigService, Router], () => {
      component.onBlockChange('event');
      fixture.detectChanges();
      expect(component.inputData['Block']).toBeTruthy();
  }));

  it('should call onSchoolChange method ', inject([ConfigService, Router], () => {
      component.onSchoolChange('event');
      fixture.detectChanges();
      expect(component.inputData['School']).toBeTruthy();
  }));

  it('should call sortFilters method ', inject([ConfigService, Router], () => {
      component.sortFilters({});
      fixture.detectChanges();
  }));

  it('should call sortAndCapitaliseFilters method ', inject([ConfigService, Router], () => {
      component.sortAndCapitaliseFilters({});
      fixture.detectChanges();
  }));

});
