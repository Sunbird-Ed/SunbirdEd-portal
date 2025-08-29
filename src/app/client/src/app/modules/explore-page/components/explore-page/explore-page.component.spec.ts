import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ExplorePageComponent } from './explore-page.component';
import { ContentManagerService } from '../../../public/module/offline/services';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExplorePageComponent', () => {
  let component: ExplorePageComponent;
  let fixture: ComponentFixture<ExplorePageComponent>;
  let mockContentManagerService: jasmine.SpyObj<ContentManagerService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const contentManagerSpy = jasmine.createSpyObj('ContentManagerService', [], {
      contentDownloadStatus$: new Subject()
    });
    
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: new Subject()
    });

    await TestBed.configureTestingModule({
      declarations: [ExplorePageComponent],
      providers: [
        { provide: ContentManagerService, useValue: contentManagerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorePageComponent);
    component = fixture.componentInstance;
    mockContentManagerService = TestBed.inject(ContentManagerService) as jasmine.SpyObj<ContentManagerService>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly handle subscription cleanup in ngOnDestroy', () => {
    // Spy on unsubscribe$ to verify it's called
    spyOn(component['unsubscribe$'], 'next');
    spyOn(component['unsubscribe$'], 'complete');

    // Create mock subscriptions
    component.resourceDataSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Verify unsubscribe$ is properly called
    expect(component['unsubscribe$'].next).toHaveBeenCalled();
    expect(component['unsubscribe$'].complete).toHaveBeenCalled();

    // Verify subscriptions are unsubscribed
    expect(component.resourceDataSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should handle ngOnDestroy when subscriptions are undefined', () => {
    // Ensure no subscriptions exist
    component.resourceDataSubscription = undefined;
    component.subscription = undefined;

    // Should not throw error
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});