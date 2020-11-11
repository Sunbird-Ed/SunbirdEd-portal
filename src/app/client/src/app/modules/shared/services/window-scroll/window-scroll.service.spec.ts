import {of as observableOf } from 'rxjs';
import { TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { SharedModule, NavigationHelperService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, PlayerService, UserService, PublicDataService } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowScrollService } from './window-scroll.service';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
const fakeActivatedRoute = {
  snapshot: {
    data: {
    }
  },
  queryParams: observableOf({ })
};
describe('WindowScrollService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [ WindowScrollService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub}, PublicDataService ]
    });
  });

  it('should be created', inject([WindowScrollService], (service: WindowScrollService) => {
    expect(service).toBeTruthy();
  }));
  it('Get Y axis element position', () => {
    const windowService = TestBed.get(WindowScrollService);
    windowService.pageYOffset = '100';
    spyOn(windowService, 'currentYPosition');
    windowService.currentYPosition();
    expect(windowService.currentYPosition).toHaveBeenCalled();
  });
  it('Should call elmYPosition', () => {
    const windowService = TestBed.get(WindowScrollService);
    spyOn(windowService, 'elmYPosition');
    windowService.elmYPosition('app-player-collection-renderer', 10);
    expect(windowService.elmYPosition).toHaveBeenCalledWith('app-player-collection-renderer', 10);
  });
  it('Should call smoothScroll', () => {
    const windowService = TestBed.get(WindowScrollService);
    spyOn(windowService, 'smoothScroll');
    windowService.smoothScroll('app-player-collection-renderer', 10);
    expect(windowService.smoothScroll).toHaveBeenCalledWith('app-player-collection-renderer', 10);
  });

});
