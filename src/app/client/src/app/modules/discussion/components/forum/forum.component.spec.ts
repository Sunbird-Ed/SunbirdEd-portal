import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConfigService } from '@sunbird/shared';
import { LearnerService, UserService } from '@sunbird/core';
import { ForumComponent } from './forum.component';
import { of } from 'rxjs';

describe('Forum component', ()=> {
  let forumComponent: ForumComponent;
  const mockDomSantizer:Partial<DomSanitizer>={
    bypassSecurityTrustResourceUrl:jest.fn().mockReturnValue(true)
  };
  const mockActivatedRoute:Partial<ActivatedRoute>={
    snapshot:{
      queryParams:{
        forumId:'forum1'
      }
    } as any
  };
  const mockLocation:Partial<Location>={
    back:jest.fn()
  };
  const mockConfigService:Partial<ConfigService>={
    urlConFig:{
        URLS:{
          USER:{
            GET_SESSION:'session1'
          }
        }
    }
  };
  const mockLearnerService:Partial<LearnerService>={
    get:jest.fn().mockReturnValue(of({id:'1'}))
  };
  const mockUserService:Partial<UserService>={
    userid:'user1'
  };

  beforeAll(() => {
    forumComponent = new ForumComponent(
      mockDomSantizer as DomSanitizer,
      mockActivatedRoute as ActivatedRoute,
      mockLocation as Location,
      mockConfigService as ConfigService,
      mockLearnerService as LearnerService,
      mockUserService as UserService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should  create an instance of forumComponent", () => {
    expect(forumComponent).toBeTruthy();
  });

  describe('ngOnInit', ()=> {
    it('should call getDiscussionUrl', ()=> {
      jest.spyOn(forumComponent,'getDiscussionUrl');
      forumComponent.ngOnInit();
      expect(forumComponent.getDiscussionUrl).toBeCalled();
    });
  });

  it('should set discussionUrl property on getDiscussionUrl call', ()=> {
    const option={
        url:'session1/user1'
    };
    const argData='discussions/auth/sunbird-oidc/callback1&returnTo=/category/forum1'
    jest.spyOn(mockLearnerService,'get');
    jest.spyOn(mockDomSantizer,'bypassSecurityTrustResourceUrl');
    forumComponent.getDiscussionUrl();
    expect(forumComponent['learnerService'].get).toBeCalledWith(option);
    expect(forumComponent.sanitizer.bypassSecurityTrustResourceUrl).toBeCalledWith(argData);
    expect(forumComponent.discussionUrl).toBeDefined();
    expect(forumComponent.discussionUrl).toEqual(true);
  });

  it('should navigate to previous page', ()=> {
    jest.spyOn(mockLocation,'back');
    forumComponent.navigateToPreviousPage();
    expect(forumComponent['location'].back).toBeCalled();
  });

  it('should call closeModal on destroying the component', ()=> {
    jest.spyOn(forumComponent,'closeModal');
    forumComponent.ngOnDestroy();
    expect(forumComponent.closeModal).toBeCalled();
  });

  it('should call closeModal on onPopState call', ()=> {
    jest.spyOn(forumComponent,'closeModal');
    const event=[];
    forumComponent.onPopState(event);
    expect(forumComponent.closeModal).toBeCalled();
  });

  it('should handle closeModal method', ()=> {
    forumComponent.modal={
      deny:jest.fn()
    };
    jest.spyOn(forumComponent.modal,'deny');
    forumComponent.closeModal();
    expect(forumComponent.modal.deny).toBeCalled();
  });
})