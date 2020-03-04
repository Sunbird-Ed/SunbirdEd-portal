import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PublicPlayerService } from './../../../../services';
import { PublicContentPlayerComponent } from './public-content-player.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService, ToasterService, WindowScrollService } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { serverRes } from './public-content-player.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { ContentManagerService } from '@sunbird/offline';
class RouterStub {
  navigate = jasmine.createSpy('navigate');
  events = observableOf({ id: 1, url: '/play', urlAfterRedirects: '/play' });
}
const fakeActivatedRoute = {
  'params': observableOf({ contentId: 'd0_33567325' }),
  'queryParams': observableOf({ language: ['en'] }, { dialCode: '61U24C' }, { l1Parent: 'd0_335673256' }),
  snapshot: {
    params: {
      contentId: 'd0_33567325'
    },
    queryParams: {
      l1Parent: 'd0_335673256'
    },
    data: {
      telemetry: {
        env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
      }
    }
  }
};
const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' },
    fmsg: { m0090: 'Could not download. Try again later'}
  },
  frmelmnts: {
    btn: {
      tryagain: 'tryagain',
      close: 'close'
    },
    lbl: {
      description: 'description'
    }
  }
};
describe('PublicContentPlayerComponent', () => {
  let component: PublicContentPlayerComponent;
  let fixture: ComponentFixture<PublicContentPlayerComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule,
      TelemetryModule.forRoot()],
      declarations: [PublicContentPlayerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [PublicPlayerService, ContentManagerService,
        ToasterService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicContentPlayerComponent);
    component = fixture.componentInstance;
    component.contentId = 'd0_33567325';
  });

  it('should config content player if content status is "Live"', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const playerService = TestBed.get(PublicPlayerService);
    const resourceService = TestBed.get(ResourceService);
    serverRes.result.result.content.status = 'Live';
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(observableOf(serverRes.result));
    component.ngOnInit();
    expect(component.playerConfig).toBeTruthy();
  });
  it('should throw error if content api throws error', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const playerService = TestBed.get(PublicPlayerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(observableThrowError(serverRes.failureResult));
    fixture.detectChanges();
    expect(component.playerConfig).toBeUndefined();
    expect(component.showError).toBeTruthy();
    expect(component.errorMessage).toBe(resourceService.messages.stmsg.m0009);
  });
  it('should call tryAgain method', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(component, 'tryAgain').and.callThrough();
    spyOn(component, 'getContent').and.callThrough();
    component.tryAgain();
    expect(component.showError).toBeFalsy();
    expect(component.getContent).toHaveBeenCalled();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.getContent();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
  it('sets the badges data  after making api call and pass input to content-badges component', () => {
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'getContent').and.returnValue(observableOf(serverRes.result));
    component.ngOnInit();
    expect(component.badgeData).toBeDefined();
    expect(component.showPlayer).toBeTruthy();
    expect(component.badgeData).toEqual(serverRes.result.result.content.badgeAssertions);
  });
  it('should open the pdfUrl in a new tab', () => {
    spyOn(window, 'open').and.callThrough();
    component.printPdf('www.samplepdf.com');
    expect(window.open).toHaveBeenCalledWith('www.samplepdf.com', '_blank');
  });
  it('should redirect to flattened dial code on click of close button', fakeAsync(() => {
    component.dialCode = '6466X';
    component.close();
    const router = TestBed.get(Router);
    tick(101);
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/get/dial/', '6466X'], {
      queryParams:
        { textbook: fakeActivatedRoute.snapshot.queryParams.l1Parent }
    });

  }));
});
