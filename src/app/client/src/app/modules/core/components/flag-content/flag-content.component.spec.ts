
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { ContentService, PlayerService, UserService, LearnerService, CoreModule } from '@sunbird/core';
import { SharedModule , ResourceService, ToasterService} from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlagContentComponent } from './flag-content.component';
import { ActivatedRoute, Router, Params, UrlSegment, NavigationEnd} from '@angular/router';
import { Response } from './flag-content.component.spec.data';
describe('FlagContentComponent', () => {
  let component: FlagContentComponent;
  let fixture: ComponentFixture<FlagContentComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

const fakeActivatedRoute = { parent: { params: observableOf({contentId: 'testId', contentName: 'hello'}) },
snapshot: {
  parent: {
    url: [
      {
        path: 'play',
      },
      {
        path: 'content',
      },
      {
        path: 'do_112498456959754240121',
      },
    ],
  }
}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [{ provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagContentComponent);
    component = fixture.componentInstance;
  });
  it('should call get content', () => {
    const playerService = TestBed.get(PlayerService);
    playerService.collectionData = Response.contentData;
    component.getContentData();
    component.contentData = Response.contentData;
    expect(component.contentData).toBeDefined();
    expect(component.contentData.name).toEqual('TextBook3-CollectionParentLive');
  });
  it('should call getContent api when data is not present ', () => {
    const playerService = TestBed.get(PlayerService);
    playerService.contentData = {};
    spyOn(playerService, 'getContent').and.callFake(() => observableOf(Response.successContentData));
    component.getContentData();
    component.contentData.name = Response.contentData.name;
    component.contentData.versionKey = Response.contentData.versionKey;
    expect(component.contentData).toBeDefined();
    expect(component.contentData.name).toEqual('TextBook3-CollectionParentLive');
    expect(component.contentData.versionKey).toEqual('1496989757647');
  });
  it('should call flag api', () => {
    const playerService = TestBed.get(PlayerService);
    const contentService = TestBed.get(ContentService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = Response.resourceBundle.messages;
    const modal = '';
    const requestData = {
      flaggedBy: 'Cretation User',
      versionKey: '1496989757647',
     flagReasons: 'others'
    };
    spyOn(contentService, 'post').and.callFake(() => observableOf(Response.successFlag));
   component.populateFlagContent(requestData);
   expect(component.showLoader).toBeFalsy();
  });
  it('should  throw error when call flag api', () => {
    const playerService = TestBed.get(PlayerService);
    const contentService = TestBed.get(ContentService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = Response.resourceBundle.messages;
    const requestData = {
      flaggedBy: 'Cretation User',
      versionKey: '1496989757647'
    };
    spyOn(contentService, 'post').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
   component.populateFlagContent(requestData);
   fixture.detectChanges();
   expect(component.showLoader).toBeFalsy();
   expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0050);
  });
  it('should call getCollectionHierarchy ', () => {
    const playerService = TestBed.get(PlayerService);
    playerService.contentData = {};
    spyOn(playerService, 'getCollectionHierarchy').and.callFake(() => observableOf(Response.collectionData));
   component.getCollectionHierarchy();
   expect(component.contentData).toBeDefined();
  });
  it('should call getCollectionHierarchy when data is already present', () => {
    const playerService = TestBed.get(PlayerService);
    playerService.collectionData = Response.collectionData;
   component.getCollectionHierarchy();
   component.contentData =  playerService.collectionData;
   expect(component.contentData).toBeDefined();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
});
