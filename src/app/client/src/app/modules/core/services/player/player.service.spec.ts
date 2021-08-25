
import {of as observableOf } from 'rxjs';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SharedModule, NavigationHelperService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, PlayerService, UserService, PublicDataService } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { Router, ActivatedRoute } from '@angular/router';
import { MockResponse } from './player.service.spec.data';

const serverRes = MockResponse.successResult;
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
const fakeActivatedRoute = {
  snapshot: {
    data: {
    }
  },
  queryParams: observableOf({ })
};
describe('PlayerService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [ NavigationHelperService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub}, PublicDataService ]
    });
  });

  it('should return content details', () => {
    const playerService = TestBed.get(PlayerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableOf(serverRes));
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

  it('should get config by content', () => {
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getContent').and.returnValue(observableOf(serverRes));
    const option = {
      courseId: '1234',
      batchId: '123'
    };
    const userService = TestBed.get(UserService);
    userService._sessionId = 'd5773f35773feab';
    userService._userId = 'd5773f35773feab';
    userService._channel = 'd5773f35773feab';
    userService._dims = ['d5773f35773feab'];
    userService._appId = 'd5773f35773feab';
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    playerService.getConfigByContent(serverRes.result.content.identifier, option).subscribe((data) => {
      expect(data).toBeTruthy();
    });
  });

  it('should get collection hierarchy', () => {
    const playerService = TestBed.get(PlayerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValues(observableOf(MockResponse.collectionHierarchy));
    playerService.getCollectionHierarchy('123').subscribe((res) => {
      expect(playerService.collectionData).toBeDefined();
    });
  });


  it('should navigate to course player if trackable object is not available', fakeAsync(() => {
    const playerService = TestBed.get(PlayerService);
    const router = TestBed.get(Router);
    playerService.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/learn/course', MockResponse.contentMetadata.identifier], { queryParams: undefined });
  }));

  it('should navigate to collection player if trackable object is not available and content type is other then course', fakeAsync(() => {
    const playerService = TestBed.get(PlayerService);
    const router = TestBed.get(Router);
    const mockData = MockResponse.contentMetadata;
    mockData.contentType = 'TextBook';
    mockData.primaryCategory = 'TextBook';
    playerService.playContent(mockData);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/collection', MockResponse.contentMetadata.identifier],
    {queryParams: {contentType: MockResponse.contentMetadata.contentType}});
  }));

  it('should navigate to collection player if course is not trackable', fakeAsync(() => {
    const playerService = TestBed.get(PlayerService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata['trackable'] = { 'enabled': 'No' };
    playerService.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/collection', MockResponse.contentMetadata.identifier],
    {queryParams: {contentType: MockResponse.contentMetadata.contentType}});
  }));

  it('should navigate to course player if collection is trackable', fakeAsync(() => {
    const playerService = TestBed.get(PlayerService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata['trackable'] = { 'enabled': 'Yes' };
    playerService.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/learn/course', MockResponse.contentMetadata.identifier], { queryParams: undefined });
  }));

  it('should navigate to course player with batch id if collection is trackable and enrolled course', fakeAsync(() => {
    const playerService = TestBed.get(PlayerService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata['trackable'] = { 'enabled': 'Yes' };
    MockResponse.contentMetadata['batchId'] = '123';
    playerService.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/learn/course', MockResponse.contentMetadata.identifier, 'batch', '123'],
      { queryParams: undefined });
  }));

  it('should navigate to resource player if content mime type is not collection', fakeAsync(() => {
    const playerService = TestBed.get(PlayerService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata['mimeType'] = 'pdf';
    playerService.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/content', MockResponse.contentMetadata.identifier]);
  }));

  it('should navigate to resource player if content mime type is ecml', fakeAsync(() => {
    const playerService = TestBed.get(PlayerService);
    const router = TestBed.get(Router);
    MockResponse.contentMetadata.mimeType = 'application/vnd.ekstep.ecml-archive';
    playerService.playContent(MockResponse.contentMetadata);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['/resources/play/content', MockResponse.contentMetadata.identifier]);
  }));

});
