import { TestBed, inject } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, ContentService, PlayerService, UserService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';

describe('PlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule],
      providers: []
    });
  });

  it('should return content details', () => {
    const playerService = TestBed.get(PlayerService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'get').and.returnValue(Observable.of('data'));
    playerService.getContent('do_112489916589834240157').subscribe((data) => {
      expect(data).toBeTruthy();
    });
    expect(playerService).toBeTruthy();
  });
  it('should return player config', () => {
    const playerService = TestBed.get(PlayerService);
    const userService = TestBed.get(UserService);
    userService._sessionId = 'd5773f35773feab';
    userService._userId = 'd5773f35773feab';
    userService._channel = 'd5773f35773feab';
    userService._dims = 'd5773f35773feab';
    userService._appId = 'd5773f35773feab';
    const PlayerMeta = {
      contentId: 'do_112489916589834240157',
      contentData: {
        mimeType : 'mp4',
        body: 'body'
      }
    };
    const playerConfig = playerService.getContentPlayerConfig(PlayerMeta);
    expect(playerConfig).toBeTruthy();
  });
});
