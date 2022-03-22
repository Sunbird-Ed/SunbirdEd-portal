// Stage 1 - RK
import { throwError as observableThrowError, of as observableOf, Observable, of } from 'rxjs';
import { mockUserData } from '../../../core/services/user/user.mock.spec.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService, ToasterService, NavigationHelperService, WindowScrollService, IUserProfile } from '@sunbird/shared';
import { CoreModule, UserService, PlayerService } from '@sunbird/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContentPlayerComponent } from './content-player.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { configureTestSuite } from '@sunbird/test-util';
import { TelemetryService } from '@sunbird/telemetry';

const serverRes = {
  id: 'api.content.read',
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
  configureTestSuite();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ContentPlayerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [TelemetryService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerComponent);
    component = fixture.componentInstance;
  });

  xit('should config content player if content status is "Live"', () => {
    const userService: any = TestBed.inject(UserService);
    const playerService = TestBed.inject(PlayerService);
    const resourceService = TestBed.inject(ResourceService);
    const windowScrollService = TestBed.inject(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(observableOf(serverRes));
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    userService._userData$.next({ err: null, userProfile: mockUserData as any });
    component.ngOnInit();
    expect(component.showLoader).toBeTruthy();
  });

  it('should make isFullScreenView to TRUE', fakeAsync(() => {
    component.isFullScreenView = false;
    expect(component.isFullScreenView).toBeFalsy();
    spyOn(component.navigationHelperService.contentFullScreenEvent, 'pipe').and.returnValue(of(true));
    component.ngOnInit();
    tick(100);
    expect(component.isFullScreenView).toBeTruthy();
  }));

  it('should make isFullScreenView to FALSE', fakeAsync(() => {
    component.isFullScreenView = true;
    expect(component.isFullScreenView).toBeTruthy();
    spyOn(component.navigationHelperService.contentFullScreenEvent, 'pipe').and.returnValue(of(false));
    component.ngOnInit();
    tick(100);
    expect(component.isFullScreenView).toBeFalsy();
  }));
  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.layoutConfiguration = null;
  });
});
