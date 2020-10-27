import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { SuiModalModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumComponent } from './forum.component';
import { configureTestSuite } from '@sunbird/test-util';
import { APP_BASE_HREF, Location, LocationStrategy } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;

  let location: Location;
  const fakeActivatedRoute = {
    snapshot: {
      queryParams: {
        forumId: '12'
      }
    }
  }

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForumComponent],
      imports: [SuiModalModule, SharedModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        Location
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'getDiscussionUrl');
    component.ngOnInit();
    expect(component.getDiscussionUrl).toHaveBeenCalled();
  });

  it('should assign discussionUrl = "discussionUrl"', () => {
    const sanitizer = TestBed.get(DomSanitizer);
    spyOnProperty(component['userService'], 'userProfile').and.returnValue( {userName: '123'});
    spyOn(component['http'], 'get').and.returnValue(of ( {id: 'iv: 133 ? id: 12333'}));

    component.getDiscussionUrl();
    component['http'].get(`/get/user/sessionId?userName=` + '123').subscribe((data: {id: string}) => {
      const url = sanitizer.bypassSecurityTrustResourceUrl(
        `discussions/auth/sunbird-oidc/callback${data.id}&returnTo=/category/${fakeActivatedRoute.snapshot.queryParams.forumId}`
      );
      expect(component.discussionUrl).toEqual(url);
    });
  });

  it('should navigateBack', () => {
    spyOn(component['location'], 'back');
    component.navigateToPreviousPage()
    expect(component['location'].back).toHaveBeenCalled();
  });

});
