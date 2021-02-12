import { TestBed, inject } from '@angular/core/testing';
import { DiscussionService } from './discussion.service';
import { configureTestSuite } from '@sunbird/test-util';
import { ConfigService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { CsModule } from '@project-sunbird/client-services';


describe('DiscussionService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [
      ConfigService,
      CacheService,
      DiscussionService,
      { provide: APP_BASE_HREF, useValue: '/' }
    ],
  }));

  it('should be created', inject([DiscussionService], (service: DiscussionService) => {
    expect(service).toBeTruthy();
  }));

  it('It should register user to nodebb', () => {
    const discussionService = TestBed.get(DiscussionService);
    const data = {
      username: 'SOME_USER_NAME',
      identifier: 'SOME_USER_IDENTIFIER',
    };
    spyOn(discussionService.discussionCsService, 'createUser').and.callThrough();
    discussionService.registerUser(data);
    expect(discussionService['discussionCsService'].createUser).toHaveBeenCalledWith(data);
  });

  it('It should fetch userDetails fom nodebb', () => {
    const discussionService = TestBed.get(DiscussionService);
    const uid = 16;
    spyOn(discussionService.discussionCsService, 'getUserDetails').and.callThrough();
    discussionService.getUserDetails(uid);
    expect(discussionService['discussionCsService'].getUserDetails).toHaveBeenCalledWith(uid);
  });

  it('It should fetch the forum ids attached to a course', () => {
    const discussionService = TestBed.get(DiscussionService);
    const request = {
      identifier: ['SOME_IDENTIFIER'],
      type: 'Course'
    };
    spyOn(discussionService.discussionCsService, 'getForumIds').and.callThrough();
    discussionService.getForumIds(request);
    expect(discussionService['discussionCsService'].getForumIds).toHaveBeenCalledWith(request);
  });

  it('It should add the forum id to the given sb identifier', () => {
    const discussionService = TestBed.get(DiscussionService);
    const data = {
      'sbType': 'group',
      'sbIdentifier': 'SOME_GROUP_ID',
      'cid': 5
    };
    spyOn(discussionService.discussionCsService, 'attachForum').and.callThrough();
    discussionService.attachForum(data);
    expect(discussionService['discussionCsService'].attachForum).toHaveBeenCalledWith(data);
  });

  it('It should remove the forum id to the given sb identifier', () => {
    const discussionService = TestBed.get(DiscussionService);
    const data = {
      'sbType': 'group',
      'sbIdentifier': 'SOME_GROUP_ID',
      'cid': 5
    };
    spyOn(discussionService.discussionCsService, 'removeForum').and.callThrough();
    discussionService.removeForum(data);
    expect(discussionService['discussionCsService'].removeForum).toHaveBeenCalledWith(data);
  });
});
