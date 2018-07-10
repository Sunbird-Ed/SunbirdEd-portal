import { BreadcrumbsService } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { Type } from '@angular/core';

import { IBreadcrumb } from '../../interfaces';

const data = { data: {breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '' }]} };
const mockData: IBreadcrumb[] = [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '' }];
const children: ActivatedRoute[] = [];

const child: any[] = [{
  snapshot: data,
  url: Observable,
  params: Observable,
  queryParams: Observable,
  fragment: Observable,
  data: Observable,
  outlet: '',
  component: Type,
  routeConfig: '',
  root: ActivatedRoute,
  parent: ActivatedRoute,
  firstChild: ActivatedRoute,
  children: [],
  pathFromRoot: children,
  paramMap: Observable,
  queryParamMap: Observable,
  toString(): string {
    return '';

  }

}];

const fakeActivatedRoute = {
  root: { children: child }
};

class MockRouter {
  public navigationEnd = new NavigationEnd(1, '/learn', '/learn');
  public events = new Observable(observer => {
    observer.next(this.navigationEnd);
    observer.complete();
  });
}

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      providers: [{ provide: Router, useClass: MockRouter },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        BreadcrumbsService
      ]
    });
  }));

  it('Should return data from activated route and assign it to breadcrumbs data', () => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.breadCrumbsData).toEqual(mockData);
  });

  it('Should return return empty breadcrumbs data when no route data is passed', () => {
    const mockActivatedRoute = {
      root: { children: [] }
    };
    TestBed.overrideProvider(ActivatedRoute, { useValue: mockActivatedRoute });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.breadCrumbsData).toEqual([]);
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
});
