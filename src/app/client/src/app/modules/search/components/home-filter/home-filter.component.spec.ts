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
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeFilterComponent } from './home-filter.component';
describe('HomeFilterComponent', () => {
  let component: HomeFilterComponent;
  let fixture: ComponentFixture<HomeFilterComponent>;
 const fakeActivatedRoute = {
  'params': Observable.from([{ pageNumber: '1' }]),
  'queryParams':  Observable.from([{ Subjects: ['english'] }])
};
 class RouterStub {
   navigate = jasmine.createSpy('navigate');
 }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, Ng2IziToastModule],
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
      component.resetFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/All', 1]);
      fixture.detectChanges();
  }));
  it('should call applyFilters method ', inject([ConfigService, Router],
    (configService, route) => {
      const queryParams = {};
      component.applyFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/All', 1], {queryParams: queryParams});
      fixture.detectChanges();
  }));
  it('should call removeFilterSelection method ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = { Subjects: ['english'] };
     component.removeFilterSelection('Subjects', 'english');
     fixture.detectChanges();
  }));

});

