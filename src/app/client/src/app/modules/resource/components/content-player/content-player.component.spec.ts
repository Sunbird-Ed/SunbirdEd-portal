
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { mockUserData } from './../../../core/services/user/user.mock.spec.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService, ToasterService, NavigationHelperService, WindowScrollService } from '@sunbird/shared';
import { CoreModule, UserService, PlayerService } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContentPlayerComponent } from './content-player.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
const serverRes = {
  id : 'api.content.read',
  ver: '1.0',
  ts: '2018-05-03T10:51:12.648Z',
  params: 'params',
  responseCode: 'OK',
  result: {
    content: {
      mimeType: 'application/vnd.ekstep.ecml-archive',
      body: 'body',
      identifier: 'domain_66675',
      versionKey: '1497028761823',
      status: 'Live',
      me_averageRating: '4',
      description: 'ffgg',
      name: 'ffgh',
      concepts: ['AI', 'ML']
    }
  }
};
const resourceServiceMockData = {
  messages : {
    imsg: { m0027: 'Something went wrong'},
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
class RouterStub {
  navigate = jasmine.createSpy('navigate');

}
const fakeActivatedRoute = {
  'params': observableOf({ contentId: 'd0_33567325' }),
  snapshot: {
    data: {
      telemetry: {
        env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
      }
    }
  }
};
describe('ContentPlayerComponent', () => {
  let component: ContentPlayerComponent;
  let fixture: ComponentFixture<ContentPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ ContentPlayerComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute},
        { provide: Router, useClass: RouterStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerComponent);
    component = fixture.componentInstance;
  });

  it('should config content player if content status is "Live"', () => {
    const userService = TestBed.get(UserService);
    const playerService = TestBed.get(PlayerService);
    const resourceService = TestBed.get(ResourceService);
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    serverRes.result.content.status = 'Live';
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(observableOf(serverRes));
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    userService._userData$.next({ err: null, userProfile: mockUserData });
    component.ngOnInit();
    expect(component.playerConfig).toBeTruthy();
  });
  xit('should config player if content status is "Unlisted"', () => {
    const userService = TestBed.get(UserService);
    const playerService = TestBed.get(PlayerService);
    const resourceService = TestBed.get(ResourceService);
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    serverRes.result.content.status = 'Unlisted';
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(observableOf(serverRes));
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    userService._userData$.next({ err: null, userProfile: mockUserData });
    component.ngOnInit();
    expect(component.playerConfig).toBeTruthy();
  });
  xit('should not config player if content status is not "Live" or "Unlisted"', () => {
    const userService = TestBed.get(UserService);
    const playerService = TestBed.get(PlayerService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const router = TestBed.get(Router);
    serverRes.result.content.status = 'Draft';
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(toasterService, 'warning').and.callThrough();
    spyOn(playerService, 'getContent').and.returnValue(observableOf(serverRes));
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue('/home');
    userService._userData$.next({ err: null, userProfile: mockUserData });
    fixture.detectChanges();
    expect(component.playerConfig).toBeUndefined();
    expect(component.toasterService.warning).toHaveBeenCalledWith(resourceService.messages.imsg.m0027);
  });
  xit('should throw error if content api throws error', () => {
    const userService = TestBed.get(UserService);
    const playerService = TestBed.get(PlayerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(playerService, 'getContent').and.returnValue(observableThrowError(serverRes));
    userService._userData$.next({ err: null, userProfile: mockUserData });
    fixture.detectChanges();
    expect(component.playerConfig).toBeUndefined();
    expect(component.showError).toBeTruthy();
    expect(component.errorMessage).toBe(resourceService.messages.stmsg.m0009);
  });
});
