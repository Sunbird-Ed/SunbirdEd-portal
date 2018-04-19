import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BreadcrumbsComponent } from '@sunbird/core';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import {} from 'jasmine';
import { BreadcrumbsService } from './breadcrumbs.service';

const fakeActivatedRoute = {
  root: { children: '' }
};

class MockRouter {
  public navigationEnd = new NavigationEnd(1, '/learn', '/learn');
  public events = new Observable(observer => {
    observer.next(this.navigationEnd);
    observer.complete();
  });
}

describe('BreadcrumbsService', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreadcrumbsService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: MockRouter }],
      declarations: [BreadcrumbsComponent]
    });
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
  });

  it('should emit the data passed from a component', inject([BreadcrumbsService], (service: BreadcrumbsService) => {
    component.breadCrumbsData = [];
    service.setBreadcrumbs({label: 'Home', url: '/home'});
    expect(service).toBeTruthy();
    expect(component.breadCrumbsData).toBeDefined();
  }));
});
