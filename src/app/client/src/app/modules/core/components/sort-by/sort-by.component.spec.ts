
import {from as observableFrom,  Observable } from 'rxjs';
import { SortByComponent } from './sort-by.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';


describe('SortByComponent', () => {
  let component: SortByComponent;
  let fixture: ComponentFixture<SortByComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'parent': 'search/Courses/1',
    'queryParams': observableFrom([{ sortType: 'asc', sort_by: 'createdOn' }])
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortByComponent ],
      imports: [HttpClientTestingModule, SharedModule.forRoot()],
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
    component.sortingOptions =  [
      {
          'field': 'lastUpdatedOn',
          'name': 'Modified On'
      },
      {
          'field': 'createdOn',
          'name': 'Created On'
      }
  ];
  component.queryParams = {sortType: 'asc', sort_by: 'createdOn'};
  });
  it('should call applySorting method with learn url ', inject([ConfigService, Router, ActivatedRoute],
    (configService, route, activatedRoute) => {
      activatedRoute.parent = 'learn';
      component.url = 'learn';
      component.sortByOption = 'createdOn';
     component.applySorting();
     fixture.detectChanges();
     expect(route.navigate).toHaveBeenCalledWith([], { relativeTo: 'learn', queryParams: component.queryParams });
  }));
  it('should call applySorting method with search/Courses url ', inject([ConfigService, Router, ],
    (configService, route) => {
      component.url = 'search/Courses/1';
      component.sortByOption = 'createdOn';
     component.applySorting();
     fixture.detectChanges();
     expect(route.navigate).toHaveBeenCalledWith([], {relativeTo: 'search/Courses/1', queryParams: component.queryParams });
  }));
});

