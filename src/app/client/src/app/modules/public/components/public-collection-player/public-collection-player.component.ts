import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicPlayerService } from './../../services';
import { PublicContentPlayerComponent } from './public-content-player.component';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { CoreModule, UserService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { serverRes } from './public-content-player.component.spec.data';
class RouterStub {
  navigate = jasmine.createSpy('navigate');
  events = Observable.from([{ id: 1, url: '/play', urlAfterRedirects: '/play' }]);
}
const fakeActivatedRoute = {
  'params': Observable.from([{ contentId: 'd0_33567325' }])
};

describe('PublicContentPlayerComponent', () => {
  let component: PublicContentPlayerComponent;
  let fixture: ComponentFixture<PublicContentPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule, RouterTestingModule, HttpClientTestingModule],
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

  xit('should get content player', () => {
    const playerService = TestBed.get(PublicPlayerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = serverRes.resourceServiceMockData.messages;
    resourceService.frmelmnts = serverRes.resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(Observable.of(serverRes.result));
    fixture.detectChanges();
    expect(component.playerConfig).toBeTruthy();
    expect(component.showPlayer).toBeTruthy();
  });
  xit('should throw error', () => {
    const playerService = TestBed.get(PublicPlayerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = serverRes.resourceServiceMockData.messages;
    resourceService.frmelmnts = serverRes.resourceServiceMockData.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(Observable.of(serverRes.failureResult));
    fixture.detectChanges();
    expect(component.playerConfig).toBeTruthy();
    expect(component.showError).toBeFalsy();
  });
});
