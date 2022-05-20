import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { RedirectComponent } from './../shared/components/redirect/redirect.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';

describe('Redirect Router tests', () => {
  let location: Location;
  let router: Router;
  const routes = [
    {
      path: 'learn/redirect',
      component: RedirectComponent
    }
  ];
  configureTestSuite();
  // setup
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        TelemetryModule.forRoot()
      ],
      declarations: [RedirectComponent]
    });
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  it('fakeAsync works', fakeAsync(() => {
      const promise = new Promise(resolve => {
        setTimeout(resolve, 10);
      });
      let done = false;
      promise.then(() => (done = true));
      tick(50);
      expect(done).toBeTruthy();
    })
  );

  it('can navigate to [/learn/redirect] (async)', async(() => {
    TestBed.inject(Router)
      .navigate(['/learn/redirect'])
      .then(() => {
        expect(location.path()).toBe('/learn/redirect');
      })
      .catch(e => {
        // console.log(e);
      });
  }));
});
