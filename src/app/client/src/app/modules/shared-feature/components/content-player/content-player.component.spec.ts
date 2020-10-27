import { throwError as observableThrowError, of as observableOf, Observable, of } from 'rxjs';
import { mockUserData } from '../../../core/services/user/user.mock.spec.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService, ToasterService, NavigationHelperService, WindowScrollService } from '@sunbird/shared';
import { CoreModule, UserService, PlayerService } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContentPlayerComponent } from './content-player.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { configureTestSuite } from '@sunbird/test-util';
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ContentPlayerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute },
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
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(observableOf(serverRes));
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    userService._userData$.next({ err: null, userProfile: mockUserData });
    component.ngOnInit();
    expect(component.showLoader).toBeTruthy();
  });

  it('should make isFullScreenView to TRUE', () => {
    component.isFullScreenView = false;
    expect(component.isFullScreenView).toBeFalsy();
    spyOn(component['navigationHelperService'], 'contentFullScreenEvent').and.returnValue(of(true));
    component.ngOnInit();
    component.navigationHelperService.contentFullScreenEvent.subscribe(response => {
      expect(response).toBeTruthy();
      expect(component.isFullScreenView).toBeTruthy();
    });
  });

  it('should make isFullScreenView to FALSE', () => {
    component.isFullScreenView = true;
    expect(component.isFullScreenView).toBeTruthy();
    spyOn(component['navigationHelperService'], 'contentFullScreenEvent').and.returnValue(of(false));
    component.ngOnInit();
    component.navigationHelperService.contentFullScreenEvent.subscribe(response => {
      expect(response).toBeFalsy();
      expect(component.isFullScreenView).toBeFalsy();
    });
  });

});
