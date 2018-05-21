import { UnlistedCollectionplayerComponent } from './unlisted-collectionplayer.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
// Import NG testing module(s)
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SharedModule,  ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { PlayerService, UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
describe('UnlistedCollectionplayerComponent', () => {
  let component: UnlistedCollectionplayerComponent;
  let fixture: ComponentFixture<UnlistedCollectionplayerComponent>;
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
      declarations: [ UnlistedCollectionplayerComponent ],
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
    fixture = TestBed.createComponent(UnlistedCollectionplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
