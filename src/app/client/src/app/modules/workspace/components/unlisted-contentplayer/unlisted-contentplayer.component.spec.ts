import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { UnlistedContentplayerComponent } from './unlisted-contentplayer.component';

// Import NG testing module(s)
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SharedModule,  ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { PlayerService, UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import * as mockData from './unlisted-content.component.spec.data';
const testData = mockData.mockRes;
describe('UnlistedContentplayerComponent', () => {
  let component: UnlistedContentplayerComponent;
  let fixture: ComponentFixture<UnlistedContentplayerComponent>;
  const resourceBundle = {
  messages : {
    imsg: { m0027: 'Something went wrong'},
    stmsg: { m0025: 'error' }
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlistedContentplayerComponent ],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
      CoreModule,
      RouterTestingModule, SharedModule],
      providers: [ ResourceService, ToasterService, NavigationHelperService,
      { provide: ResourceService, useValue: resourceBundle }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlistedContentplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should throw error if content api throws error', () => {
    const playerService = TestBed.get(PlayerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    resourceService.frmelmnts = resourceBundle.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(Observable.throw(testData.errorRes));
    component.getContent();
    expect(component.playerConfig).toBeUndefined();
    expect(component.showError).toBeTruthy();
    expect(component.errorMessage).toBe(resourceService.messages.stmsg.m0009);
  });

  it('should call  content api and return content data', () => {
    const playerService = TestBed.get(PlayerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    resourceService.frmelmnts = resourceBundle.frmelmnts;
    spyOn(playerService, 'getContent').and.returnValue(Observable.of(testData.sucessRes));
    component.getContent();
    fixture.detectChanges();
    expect(component.contentData).toBeDefined();
    expect(component.showError).toBeFalsy();
    expect(component.showLoader).toBeFalsy();
  });

});
