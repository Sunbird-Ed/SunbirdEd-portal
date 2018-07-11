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
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Observable, of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserFilterComponent } from './user-filter.component';


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
      imports: [HttpClientTestingModule, SharedModule.forRoot(), Ng2IziToastModule],
      declarations: [ UserFilterComponent ],
      providers: [ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService,
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

  it('should call resetFilters method ', inject([ConfigService, Router],
    (configService, route) => {
      component.resetFilters();
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith(['/search/Users', 1]);
  }));
  it('should call applyFilters method ', inject([ConfigService, Router],
    (configService, route) => {
      const queryParams = { Grades: ['Grade 2'] };
      fixture.detectChanges();
      component.applyFilters();
      expect(route.navigate).toHaveBeenCalledWith(['/search/Users', 1], {queryParams: queryParams});
  }));
  it('should call removeFilterSelection method ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = { Grades: ['03'] };
     component.removeFilterSelection('Grades', '03');
     fixture.detectChanges();
  }));

});


