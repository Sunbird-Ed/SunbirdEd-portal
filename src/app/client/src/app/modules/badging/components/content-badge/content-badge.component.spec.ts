import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ContentBadgeComponent } from './content-badge.component';
import { SuiModule } from 'ng2-semantic-ui';
import { UserService, BadgesService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { mockResponse } from './content-badge.component.spec.data';
import { ContentBadgeService } from './../../services';

describe('ContentBadgeComponent', () => {
  let component: ContentBadgeComponent;
  let fixture: ComponentFixture<ContentBadgeComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ collectionId: 'Test_Textbook2_8907797' }])
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentBadgeComponent],
      imports: [SuiModule, CoreModule, SharedModule, HttpClientTestingModule],
      providers: [ContentBadgeService, ResourceService, { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should get collectionId from activated route, should get user data', () => {
    const userService = TestBed.get(UserService);
    const badgeService = TestBed.get(BadgesService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    spyOn(badgeService, 'getAllBadgeList').and.callFake(() => Observable.of(mockResponse.badgeSuccessResponse));
    expect(component.contentId).toBe(fakeActivatedRoute.params['collectionId']);
    fixture.detectChanges();
  });
  it('should call assign method and make service call, should return success response', () => {
    const userService = TestBed.get(UserService);
    const badgeService = TestBed.get(ContentBadgeService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockResponse.resourceBundle.messages;
    const toasterService = TestBed.get(ToasterService);
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData });
    component.allBadgeList = mockResponse.badgeSuccessResponse.result.badges;
    spyOn(badgeService, 'addBadge').and.callFake(() => Observable.of(mockResponse.returnValue));
    spyOn(toasterService, 'success').and.callThrough();
    component.assignBadge(mockResponse.badgeSuccessResponse.result.badges);
    expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0044);
  });
});
