
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, ContentService, PlayerService, UserService } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';

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
      versionKey: '1497028761823'
    }
  }
};
describe('PlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot(), RouterTestingModule],
      providers: []
    });
  });

  it('should return content details', () => {
    const playerService = TestBed.get(PlayerService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'get').and.returnValue(observableOf(serverRes));
    playerService.getContent(serverRes.result.content.identifier).subscribe((data) => {
      expect(data).toBeTruthy();
      expect(playerService.contentData).toBeTruthy();
      expect(playerService.contentData.mimeType).toContain('application/vnd.ekstep.ecml-archive');
      expect(playerService.contentData.versionKey).toContain('1497028761823');
      expect(playerService.contentData.identifier).toContain('domain_66675');
    });
    expect(playerService).toBeTruthy();
  });
  it('should return player config without with courseId', () => {
    const playerService = TestBed.get(PlayerService);
    const userService = TestBed.get(UserService);
    userService._sessionId = 'd5773f35773feab';
    userService._userId = 'd5773f35773feab';
    userService._channel = 'd5773f35773feab';
    userService._dims = ['d5773f35773feab'];
    userService._appId = 'd5773f35773feab';
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    const PlayerMeta = {
      contentId: serverRes.result.content.identifier,
      contentData: serverRes.result.content
    };
    const playerConfig = playerService.getConfig(PlayerMeta);
    expect(playerConfig).toBeTruthy();
    expect(playerConfig.context.contentId).toContain('domain_66675');
    expect(playerConfig.context.dims).toContain('d5773f35773feab');
    expect(playerConfig.context.dims.length).toBe(1);
    expect(playerConfig.context.sid).toContain('d5773f35773feab');
    expect(playerConfig.context.tags).toContain('d5773f35773feab');
  });
  it('should return player config with courseId', () => {
    const playerService = TestBed.get(PlayerService);
    const userService = TestBed.get(UserService);
    userService._sessionId = 'd5773f35773feab';
    userService._userId = 'd5773f35773feab';
    userService._channel = 'd5773f35773feab';
    userService._dims = ['d5773f35773feab'];
    userService._appId = 'd5773f35773feab';
    const PlayerMeta = {
      contentId: serverRes.result.content.identifier,
      contentData: serverRes.result.content,
      courseId: 'do_66675'
    };
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    const playerConfig = playerService.getConfig(PlayerMeta);
    expect(playerConfig.context.contentId).toContain('domain_66675');
    expect(playerConfig.context.dims).toContain('do_66675');
    expect(playerConfig.context.dims.length).toBe(2);
    expect(playerConfig.context.cdata.length).toBe(1);
    expect(playerConfig.context.cdata).toContain({
      id: 'do_66675',
      type: 'course'
    });
  });
});
