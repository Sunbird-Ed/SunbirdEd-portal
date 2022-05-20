import {of as observableOf } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, PublicDataService } from '@sunbird/core';
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
// NEW xdescribe
xdescribe('WindowScrollService', () => {
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
    const windowService:any = TestBed.inject(WindowScrollService);
    windowService.pageYOffset = '100';
    spyOn(windowService, 'currentYPosition');
    windowService.currentYPosition();
    expect(windowService.currentYPosition).toHaveBeenCalled();
  });
  it('Should call elmYPosition', () => {
    const windowService:any = TestBed.inject(WindowScrollService);
    spyOn(windowService, 'elmYPosition');
    windowService.elmYPosition('app-player-collection-renderer', 10);
    expect(windowService.elmYPosition).toHaveBeenCalledWith('app-player-collection-renderer', 10);
  });
  it('Should call smoothScroll', () => {
    const windowService:any = TestBed.inject(WindowScrollService);
    spyOn(windowService, 'smoothScroll');
    windowService.smoothScroll('app-player-collection-renderer', 10);
    expect(windowService.smoothScroll).toHaveBeenCalledWith('app-player-collection-renderer', 10);
  });

});
