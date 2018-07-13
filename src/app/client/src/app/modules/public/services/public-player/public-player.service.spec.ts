
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { CoreModule, ContentService, UserService } from '@sunbird/core';
import { PublicPlayerService } from './public-player.service';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { serverRes } from './public-player.service.spec.data';
import { UUID } from 'angular2-uuid';

describe('PublicPlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot(), RouterTestingModule],
      providers: [PublicPlayerService]
    });
  });

  it('should return content details', () => {
    const playerService = TestBed.get(PublicPlayerService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'get').and.returnValue(observableOf(serverRes.successResult));
    playerService.getContent();
    playerService.getContent(serverRes.successResult.result.content.identifier).subscribe((data) => {
      expect(data).toBeTruthy();
      expect(playerService.contentData).toBeTruthy();
      expect(playerService.contentData.mimeType).toContain('application/vnd.ekstep.ecml-archive');
      expect(playerService.contentData.versionKey).toContain('1497028761823');
      expect(playerService.contentData.identifier).toContain('domain_66675');
    });
    expect(playerService).toBeTruthy();
  });
  it('should return player config without courseId', () => {
    const playerService = TestBed.get(PublicPlayerService);
    const userService = TestBed.get(UserService);
    userService.anonymousSid = UUID.UUID();
    userService._userId = 'anonymous';
    userService._channel = 'in.ekstep';
    userService._appId = 'd5773f35773feab';
    const PlayerMeta = {
      contentId: serverRes.successResult.result.content.identifier,
      contentData: serverRes.successResult.result.content
    };
    const playerConfig = playerService.getConfig(PlayerMeta);
    expect(playerConfig).toBeTruthy();
    expect(playerConfig.context.contentId).toContain('domain_66675');
  });
});
