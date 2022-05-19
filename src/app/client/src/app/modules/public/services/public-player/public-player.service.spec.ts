
import {of as observableOf, of } from 'rxjs';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CoreModule, ContentService, UserService, PublicDataService } from '@sunbird/core';
import { PublicPlayerService } from './public-player.service';
import { SharedModule, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { serverRes, contentMockData } from './public-player.service.spec.data';
import { UUID } from 'angular2-uuid';
import { configureTestSuite } from '@sunbird/test-util';
import { Router, ActivatedRoute } from '@angular/router';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
const fakeActivatedRoute = {
  snapshot: {
    data: {
    }
  },
  queryParams: of({ })
};

// Old One
xdescribe('PublicPlayerService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot(), RouterTestingModule],
      providers: [PublicPlayerService, NavigationHelperService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub}, PublicDataService,
        { provide: ResourceService, useValue:  serverRes.resourceServiceMockData}]
    });
  });

  it('should return content details', () => {
    const playerService:any = TestBed.inject(PublicPlayerService);
    const contentService:any = TestBed.inject(ContentService);
    spyOn(contentService, 'get').and.returnValue(observableOf(serverRes.successResult));
    playerService.getContent('');
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
    const playerService:any = TestBed.inject(PublicPlayerService);
    const userService:any = TestBed.inject(UserService);
    userService._anonymousSid = UUID.UUID();
    userService._userid = 'anonymous';
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

  it('should call player updateDownloadStatus()', () => {
    const playerService:any = TestBed.inject(PublicPlayerService);
    const resourceService:any = TestBed.inject(ResourceService);
    resourceService.messages = serverRes.resourceServiceMockData.messages;
    playerService.updateDownloadStatus(serverRes.download_list, serverRes.successResult.result.content);
    expect(serverRes.successResult.result.content.downloadStatus).toBe(resourceService.messages.stmsg.m0143);
  });

  it('should navigate to course player if collection does not has trackable object and content type is course', fakeAsync(() => {
    const playerService:any = TestBed.inject(PublicPlayerService);
    const router = TestBed.inject(Router);
    spyOn(playerService, 'handleNavigation').and.callThrough();
    playerService.playContent(contentMockData);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['explore-course/course', contentMockData.data.identifier], { queryParams: undefined });
  }));
  //TODO
  xit('should navigate to collection player if collection is not trackable', fakeAsync(() => {
    const playerService:any = TestBed.inject(PublicPlayerService);
    const router = TestBed.inject(Router);
    const mockData = contentMockData;
    spyOn(playerService, 'handleNavigation').and.callThrough();
    mockData.data.contentType = 'TextBook';
    playerService.playContent(mockData);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(
      ['play/collection', contentMockData.data.identifier], {queryParams: {contentType: contentMockData.data.contentType}});
  }));
  //TODO
  xit('should navigate to collection player if collection is not trackable', fakeAsync(() => {
    const playerService:any = TestBed.inject(PublicPlayerService);
    const router = TestBed.inject(Router);
    contentMockData.data['trackable'] = { 'enabled': 'No' };
    playerService.playContent(contentMockData);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(
      ['play/collection', contentMockData.data.identifier], {queryParams: {contentType: contentMockData.data.contentType}});
  }));
  //TODO
  xit('should navigate to course player if collection is trackable', fakeAsync(() => {
    const playerService:any = TestBed.inject(PublicPlayerService);
    const router = TestBed.inject(Router);
    spyOn(playerService, 'handleNavigation').and.callThrough();
    contentMockData.data['trackable'] = { 'enabled': 'Yes' };
    playerService.playContent(contentMockData);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['explore-course/course', contentMockData.data.identifier], { queryParams: undefined });
  }));

  it('should navigate to resource player if content mime type is not collection', fakeAsync(() => {
    const playerService:any = TestBed.inject(PublicPlayerService);
    const router = TestBed.inject(Router);
    contentMockData.data['mimeType'] = 'pdf';
    spyOn(playerService, 'handleNavigation').and.callThrough();
    playerService.playContent(contentMockData);
    tick(50);
    expect(router.navigate).toHaveBeenCalledWith(['play/content', contentMockData.data.identifier],
    {queryParams: {contentType: contentMockData.data.contentType}});
  }));

  it('should get collection hierarchy', () => {
    const playerService:any = TestBed.inject(PublicPlayerService);
    const publicDataService:any = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValues(of(serverRes.collectionHierarchy));
    playerService.getCollectionHierarchy('123').subscribe((res) => {
      expect(playerService.collectionData).toBeDefined();
    });

  });

});
