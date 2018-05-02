import { SortByComponent } from './sort-by.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

describe('SortByComponent', () => {
  let component: SortByComponent;
  let fixture: ComponentFixture<SortByComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'queryParams': Observable.from([{ sortType: 'asc', sort_by: 'createdOn' }])
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortByComponent ],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [ ResourceService, ConfigService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call applySorting method with learn url ', inject([ConfigService, Router],
    (configService, route) => {
      component.url = 'learn';
      const sortByOption = 'createdOn';
      const queryParams = { sortType: 'asc', sort_by: 'createdOn'};
     component.applySorting(sortByOption);
     fixture.detectChanges();
     expect(route.navigate).toHaveBeenCalledWith(['learn'], {queryParams: queryParams});
  }));
  it('should call applySorting method with search/Courses url ', inject([ConfigService, Router],
    (configService, route) => {
      component.url = 'search/Courses/1';
      const sortByOption = 'createdOn';
      const queryParams = { sortType: 'asc', sort_by: 'createdOn'};
     component.applySorting(sortByOption);
     fixture.detectChanges();
     expect(route.navigate).toHaveBeenCalledWith(['search/Courses/1'], {queryParams: queryParams});
  }));
});

