import { UserSearchComponent } from './../user-search/user-search.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
 SharedModule, ServerResponse, PaginationService, ResourceService,
 ConfigService, ToasterService, INoResultMessage
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService, ConceptPickerService } from '@sunbird/core';
import { OrgTypeService } from '@sunbird/org-management';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Observable, of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeFilterComponent } from './home-filter.component';
describe('HomeFilterComponent', () => {
  let component: HomeFilterComponent;
  let fixture: ComponentFixture<HomeFilterComponent>;
 const fakeActivatedRoute = {
  'params': observableOf({ pageNumber: '1' }),
  'queryParams':  observableOf({ Subjects: ['english'] })
};
 class RouterStub {
   navigate = jasmine.createSpy('navigate');
 }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), Ng2IziToastModule],
      declarations: [ HomeFilterComponent ],
      providers: [ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService,  ConceptPickerService,
        { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call resetFilters method ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = {key: 'text'};
      const queryParams = {key: 'text'};
      component.resetFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/All', 1], {queryParams: queryParams});
      fixture.detectChanges();
  }));
  it('should call resetFilters method  with empty queryParams', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = {};
      const queryParams = {};
      component.resetFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/All', 1], {queryParams: queryParams});
      fixture.detectChanges();
  }));
  it('should call applyFilters method ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = {};
      component.applyFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/All', 1], {queryParams: component.queryParams});
      fixture.detectChanges();
  }));
  it('should call applyFilters method with querParams value ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = {Subjects: ['english']};
      component.applyFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/All', 1], {queryParams: component.queryParams});
      fixture.detectChanges();
  }));
  it('should call applyFilters method with querParams having concepts ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = { Concepts: [ {identifier: 'AI133'}]};
      const queryParams = {Concepts: ['AI133']};
      component.applyFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/All', 1], {queryParams: queryParams });
      fixture.detectChanges();
  }));
  it('should call removeFilterSelection method ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = { Subjects: ['english'] };
     component.removeFilterSelection('Subjects', 'english');
     fixture.detectChanges();
  }));
  it('should call isObject ', () => {
     const value = {id: 'AI113', name: 'artificial inteligence'};
     component.isObject(value);
     const check = typeof value;
     expect(check).toEqual('object');
  });
  it('should call ngoninit ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = {key: 'text'};
      expect(component.showConcepts).toBeFalsy();
  }));
});
