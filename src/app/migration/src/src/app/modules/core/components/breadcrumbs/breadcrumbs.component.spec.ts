import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Type } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import 'rxjs/add/operator/filter';

const data = { data: { 0: { label: 'Home', url: '/home' }, 1: { label: 'Courses', url: '' } } };

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
      { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should return data from activated route', () => {
    expect(component.breadCrumbsData).toBeDefined();
  });
});
