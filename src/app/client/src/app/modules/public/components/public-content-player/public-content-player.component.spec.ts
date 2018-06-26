import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicPlayerService } from './../../services';
import { PublicContentPlayerComponent } from './public-content-player.component';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService, ToasterService, WindowScrollService } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { serverRes } from './public-content-player.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
  events = Observable.from([{ id: 1, url: '/play', urlAfterRedirects: '/play' }]);
}
const fakeActivatedRoute = {
  'params': Observable.from([{ contentId: 'd0_33567325' }]),
  snapshot: {
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
    stmsg: { m0009: 'error' }
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
      imports: [CoreModule.forRoot(), SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule,
      TelemetryModule.forRoot()],
      declarations: [PublicContentPlayerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [PublicPlayerService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicContentPlayerComponent);
    component = fixture.componentInstance;
  });

  it('should config content player if content status is "Live"', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const playerService = TestBed.get(PublicPlayerService);
    const resourceService = TestBed.get(ResourceService);
    serverRes.result.result.content.status = 'Live';
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(Observable.of(serverRes.result));
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
    spyOn(playerService, 'getContent').and.returnValue(Observable.throw(serverRes.failureResult));
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
});
