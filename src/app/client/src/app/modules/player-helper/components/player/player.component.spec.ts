import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CsContentProgressCalculator } from '@project-sunbird/client-services/services/content/utilities/content-progress-calculator';
import { FormService, UserService } from '@sunbird/core';
import { NavigationHelperService, SharedModule, UtilService, ToasterService, ResourceService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { of, Subject, throwError } from 'rxjs';
import { PlayerComponent } from './player.component';
import { playerData } from './player.component.data.spec';
import  { printEvent } from './player.component.data.spec';
import { PublicPlayerService } from '@sunbird/public';

const resourceBundle = {
  'messages': {
    'emsg': {
      'm0005': 'Something went wrong, try later'
    }
  }
};

const startEvent = {
  detail: {
    telemetryData: {
      eid: 'START'
    }
  }
};
const endEventSuc = {
  detail: {
    telemetryData: {
      eid: 'END',
      edata: { summary: [{ progress: 100 }] }
    }
  }
};
const endEventErr = {
  detail: {
    telemetryData: {
      eid: 'END',
      edata: { summary: [{ progress: 50 }] }
    }
  }
};
const playerConfig = {
  config: {},
  context: {},
  data: {},
  metadata: {}
};
describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let userService;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [PlayerComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle }, { provide: UserService, useValue: {} }, CsContentProgressCalculator, FormService, PublicPlayerService, ToasterService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    component.contentProgressEvents$ = new Subject();
    userService = TestBed.get(UserService);
    userService._authenticated = false;
    userService.loggedIn = true;
    userService.userData$ = of({ userProfile: { firstName: 'harish', lastName: 'gangula' } });
    component.contentIframe = {
      nativeElement: {
        contentWindow: { EkstepRendererAPI: { getCurrentStageId: () => 'stageId' } },
        remove: jasmine.createSpy()
      }
    };
  });

  it('should emit "START"', fakeAsync(() => {
    let contentProgressEvent;
    component.contentProgressEvents$.subscribe((data) => {
      contentProgressEvent = data;
    });
    spyOn(component, 'emitSceneChangeEvent').and.callFake(() => 'called');
    component.generateContentReadEvent(startEvent);
    component.playerConfig = playerConfig;
    expect(contentProgressEvent).toBeDefined();
  }));

  it('should emit "END" event', () => {
    let contentProgressEvent;
    component.contentProgressEvents$.subscribe((data) => {
      contentProgressEvent = data;
    });
    component.playerConfig = playerConfig;
    component.generateContentReadEvent(endEventSuc);
    expect(contentProgressEvent).toBeDefined();
  });
  it('should emit "END" event and open contentRating', () => {
    let contentProgressEvent;
    spyOn<any>(CsContentProgressCalculator, 'calculate').and.returnValue(100);
    component.contentProgressEvents$.subscribe((data) => {
      contentProgressEvent = data;
    });
    component.modal = { showContentRatingModal: false };
    component.playerConfig = playerConfig;
    component.generateContentReadEvent(endEventSuc);
    component.showRatingPopup(endEventSuc);
    expect(contentProgressEvent).toBeDefined();
    expect(component.contentRatingModal).toBeTruthy();
  });

  it('should call generateContentReadEvent', () => {
    spyOn(component, 'emitSceneChangeEvent');
    component.generateContentReadEvent({ detail: { telemetryData: { eid: 'IMPRESSION' } } });
    expect(component.emitSceneChangeEvent).toHaveBeenCalled();
  });

  it('should call ngOnChange ', () => {
    component.playerConfig = playerConfig;
    component.ngOnChanges({});
    expect(component.contentRatingModal).toBeFalsy();
  });

  describe('should rotate player', () => {
    let mockDomElement;
    beforeEach(() => {
      mockDomElement = document.createElement('div');
      mockDomElement.setAttribute('id', 'playerFullscreen');
    });

    it('should rotate player for a default chrome browser', fakeAsync(() => {
      spyOn(document, 'querySelector').and.returnValue(mockDomElement);
      spyOn(screen.orientation, 'lock');
      component.rotatePlayer();
      tick(100);
      expect(screen.orientation.lock).toHaveBeenCalledWith('landscape');
    }));

    it('should rotate player for mozilla browser', fakeAsync(() => {
      mockDomElement.requestFullscreen = undefined;
      mockDomElement.mozRequestFullScreen = () => { };
      spyOn(document, 'querySelector').and.returnValue(mockDomElement);
      spyOn(screen.orientation, 'lock');
      component.rotatePlayer();
      tick(100);
      expect(screen.orientation.lock).toHaveBeenCalledWith('landscape');
    }));

    it('should rotate player for webkit browser', fakeAsync(() => {
      mockDomElement.requestFullscreen = undefined;
      mockDomElement.mozRequestFullScreen = undefined;
      mockDomElement.webkitRequestFullscreen = () => { };
      spyOn(document, 'querySelector').and.returnValue(mockDomElement);
      spyOn(screen.orientation, 'lock');
      component.rotatePlayer();
      tick(100);
      expect(screen.orientation.lock).toHaveBeenCalledWith('landscape');
    }));

    xit('should rotate player ms browser', fakeAsync(() => {
      mockDomElement.requestFullscreen = undefined;
      mockDomElement.mozRequestFullScreen = undefined;
      mockDomElement.webkitRequestFullscreen = undefined;
      mockDomElement.msRequestFullscreen = () => { };
      spyOn(document, 'querySelector').and.returnValue(mockDomElement);
      spyOn(screen.orientation, 'lock');
      component.rotatePlayer();
      tick(100);
      expect(screen.orientation.lock).toHaveBeenCalledWith('landscape');
    }));
  });

  describe('should close the browser fullscreen mode', () => {
    it('should close player fullscreen for default chrome browser', () => {
      component.isSingleContent = true;
      component.closeFullscreen();
      expect(component.showPlayIcon).toBe(true);
    });

    it('should close player fullscreen for mozilla browser', () => {
      document['exitFullscreen'] = undefined;
      document['mozCancelFullScreen'] = () => { };
      component.isSingleContent = true;
      component.closeFullscreen();
      expect(component.showPlayIcon).toBe(true);
    });

    it('should close player fullscreen for webkit browser ', () => {
      document['exitFullscreen'] = undefined;
      document['mozCancelFullScreen'] = undefined;
      document['webkitExitFullscreen'] = () => { };
      component.isSingleContent = true;
      component.closeFullscreen();
      expect(component.showPlayIcon).toBe(true);
    });

    it('should close player fullscreen for ms browser ', () => {
      document['exitFullscreen'] = undefined;
      document['mozCancelFullScreen'] = undefined;
      document['webkitExitFullscreen'] = undefined;
      document['msExitFullscreen'] = () => { };
      component.isSingleContent = true;
      component.closeFullscreen();
      expect(component.showPlayIcon).toBe(true);
    });
  });

  it('should load player on tap of play icon', () => {
    spyOn(component, 'loadPlayer');
    spyOn(component, 'rotatePlayer').and.stub();
    component.enablePlayer(true);
    expect(component.showPlayIcon).toBe(true);
    expect(component.loadPlayer).toHaveBeenCalled();
  });


  it('should close player fullscreen ', () => {
    component.isSingleContent = true;
    component.showRatingModalAfterClose = true;
    component.modal = { showContentRatingModal: false };
    component.closeFullscreen();
    expect(component.showPlayIcon).toBe(true);
    expect(component.contentRatingModal).toBe(true);
    expect(component.modal.showContentRatingModal).toBe(true);
  });

  it('should remove Iframe element on destroy', () => {
    component.contentIframe = {
      nativeElement: {
        remove: jasmine.createSpy()
      }
    };
    component.ngOnDestroy();
    expect(component.contentIframe.nativeElement.remove).toHaveBeenCalled();
  });

  it('should make isFullScreenView to TRUE', () => {
    component.isFullScreenView = false;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    expect(component.isFullScreenView).toBeFalsy();
    spyOn(component['navigationHelperService'], 'contentFullScreenEvent').and.returnValue(of(true));
    component.ngOnInit();
    navigationHelperService.contentFullScreenEvent.emit(true);
    expect(component.isFullScreenView).toBeTruthy();
  });

  it('should call addUserDataToContext', () => {
    component.playerConfig = playerConfig;
    component.ngOnInit();
    expect(component.playerConfig.context['userData']).toBeDefined();
    expect(component.playerConfig.context['userData']['firstName']).toBe('harish');
    expect(component.playerConfig.context['userData']['lastName']).toBe('gangula');
  });

  it('should make isFullScreenView to FALSE', () => {
    component.isFullScreenView = true;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    expect(component.isFullScreenView).toBeTruthy();
    spyOn(component['navigationHelperService'], 'contentFullScreenEvent').and.returnValue(of(false));
    component.ngOnInit();
    navigationHelperService.contentFullScreenEvent.emit(false);
    expect(component.isFullScreenView).toBeFalsy();
  });


  it('should call emitFullScreenEvent', () => {
    component.playerConfig = playerConfig;
    spyOn(component.navigationHelperService, 'emitFullScreenEvent');
    component.closeContentFullScreen();
    expect(component.navigationHelperService.emitFullScreenEvent).toHaveBeenCalledWith(false);
  });

  it('should call closeModal', () => {
    spyOn(component.ratingPopupClose, 'emit');
    component.closeModal();
    expect(component.ratingPopupClose.emit).toHaveBeenCalled();
  });

  it('should adjust player height on landscap mode of mobile or tab device', () => {
    const mockDomElement = document.createElement('div');
    mockDomElement.setAttribute('id', 'contentPlayer');
    spyOn(document, 'querySelector').and.returnValue(mockDomElement);
    spyOn(mockDomElement, 'style').and.returnValue(of({ height: window.innerHeight }));
    fixture.detectChanges();
    component.isMobileOrTab = true;
    component.adjustPlayerHeight();
    fixture.detectChanges();
    expect(screen.orientation.type).toEqual('landscape-primary');
  });

  it('should call emitSceneChangeEvent', (done) => {
    spyOn(component.sceneChangeEvent, 'emit');
    component.emitSceneChangeEvent();
    setTimeout(() => {
      expect(component.sceneChangeEvent.emit).toHaveBeenCalledWith({ stageId: 'stageId' });
      done();
    }, 10);
  });

  it('should call generateScoreSubmitEvent', () => {
    const event = { data: 'renderer:question:submitscore' };
    spyOn(component.questionScoreSubmitEvents, 'emit');
    component.generateScoreSubmitEvent(event);
    expect(component.questionScoreSubmitEvents.emit).toHaveBeenCalled();
  });

  it('should call generateScoreSubmitEvent for maxAttempts', () => {
    const event = { data: 'renderer:selfassess:lastattempt' };
    spyOn(component.selfAssessLastAttempt, 'emit');
    component.generateScoreSubmitEvent(event);
    expect(component.selfAssessLastAttempt.emit).toHaveBeenCalled();
  });

  it('should call generateScoreSubmitEvent for maxAttempts exceeded', () => {
    const event = { data: 'renderer:maxLimitExceeded' };
    spyOn(component.selfAssessLastAttempt, 'emit');
    component.generateScoreSubmitEvent(event);
    expect(component.selfAssessLastAttempt.emit).toHaveBeenCalled();
  });

  xit('should call loadPlayer', () => {
    const formService = TestBed.get(FormService);
    component.isMobileOrTab = true;
    component.playerConfig = playerConfig;
    spyOn(formService, 'getFormConfig').and.returnValue(throwError({}));
    spyOn(component, 'rotatePlayer');
    spyOn<any>(component, 'loadDefaultPlayer');
    component.loadPlayer();
    expect(component.rotatePlayer).toHaveBeenCalled();
    expect(component.loadDefaultPlayer).toHaveBeenCalled();
  });

  xit('should call loadPlayer with CDN url', () => {
    const formService = TestBed.get(FormService);
    component.playerConfig = playerConfig;
    component.isMobileOrTab = false;
    component.previewCdnUrl = 'some_url';
    component.isCdnWorking = 'YES';
    spyOn(formService, 'getFormConfig').and.returnValue(throwError({}));
    spyOn(component, 'loadCdnPlayer');
    component.loadPlayer();
    expect(component.loadCdnPlayer).toHaveBeenCalled();
  });

  it('should call ngAfterViewInit', () => {
    component.playerConfig = { config: {}, context: {}, data: {}, metadata: {} };
    spyOn(component, 'loadPlayer');
    component.ngAfterViewInit();
    expect(component.loadPlayer).toHaveBeenCalled();
  });

  it('should call onPopState', () => {
    spyOn(component, 'closeContentFullScreen');
    component.onPopState({});
    expect(component.closeContentFullScreen).toHaveBeenCalled();
  });

  it('should hide content manger while fullscreen mode for desktop', () => {
    component.isFullScreenView = false;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    const utilService = TestBed.get(UtilService);
    utilService._isDesktopApp = true;
    spyOn(navigationHelperService, 'handleContentManagerOnFullscreen');
    component.ngOnInit();
    navigationHelperService.contentFullScreenEvent.emit(true);
    expect(component.isFullScreenView).toBeTruthy();
    expect(navigationHelperService.handleContentManagerOnFullscreen).toHaveBeenCalledWith(true);
  });

  it('should show content manger when exit from fullscreen mode for desktop', () => {
    component.isFullScreenView = false;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'handleContentManagerOnFullscreen');
    const utilService = TestBed.get(UtilService);
    utilService._isDesktopApp = true;
    component.ngOnInit();
    navigationHelperService.contentFullScreenEvent.emit(false);
    expect(component.isFullScreenView).toBeFalsy();
    expect(navigationHelperService.handleContentManagerOnFullscreen).toHaveBeenCalledWith(false);
  });

  it('should call updateMetadataForDesktop', () => {
    component.isDesktopApp = true;
    component.playerConfig = playerData.playerConfig;
    component.updateMetadataForDesktop();
    expect(component.playerConfig.data).toEqual('');
  });

  it('should call updateMetadataForDesktop for pdf content', () => {
    component.isDesktopApp = true;
    component.playerConfig = playerData.playerConfig;
    component.playerConfig.metadata.mimeType = 'application/epub';
    component.updateMetadataForDesktop();
    expect(component.playerConfig.metadata.artifactUrl).toEqual('file_example_mp3_700kb.mp3');
  });

  it('should call loadNewPlayer', () => {
    spyOn(component, 'addUserDataToContext');
    spyOn(component, 'rotatePlayer');
    component.isMobileOrTab = true;
    component.isDesktopApp = true;
    component.playerConfig = playerData.playerConfig;
    component.loadNewPlayer();
    expect(component.addUserDataToContext).toHaveBeenCalled();
    expect(component.isFullScreenView).toBe(true);
    expect(component.rotatePlayer).toHaveBeenCalled();
    expect(component.showNewPlayer).toBe(true);
  });

  it('should call loadOldPlayer, for desktop', () => {
    spyOn(component, 'updateMetadataForDesktop');
    spyOn(component, 'loadDefaultPlayer');
    component.isDesktopApp = true;
    component.playerConfig = playerData.playerConfig;
    component.loadOldPlayer();
    expect(component.updateMetadataForDesktop).toHaveBeenCalled();
    expect(component.loadDefaultPlayer).toHaveBeenCalled();
    expect(component.showNewPlayer).toBe(false);
  });

  it('should call loadOldPlayer, for portal', () => {
    spyOn(component, 'loadDefaultPlayer');
    spyOn(component, 'rotatePlayer');
    component.isDesktopApp = false;
    component.playerConfig = playerData.playerConfig;
    component.isMobileOrTab = true;
    component.loadOldPlayer();
    expect(component.rotatePlayer).toHaveBeenCalled();
    expect(component.loadDefaultPlayer).toHaveBeenCalled();
    expect(component.showNewPlayer).toBe(false);
  });

  it('should call loadOldPlayer, with CDN player', () => {
    component.isDesktopApp = false;
    component.playerConfig = playerData.playerConfig;
    component.isMobileOrTab = true;
    component.previewCdnUrl = 'someCdnurl';
    component.isCdnWorking = 'yes';
    spyOn(component, 'loadCdnPlayer');
    component.loadOldPlayer();
    expect(component.showNewPlayer).toBe(false);
    expect(component.loadCdnPlayer).toHaveBeenCalled();
  });

  it('should load player, on success', () => {
    const formService = TestBed.get(FormService);
    component.playerConfig = playerData.playerConfig;
    spyOn(formService, 'getFormConfig').and.returnValue(of(playerData.formData));
    component.loadPlayer();
    expect(formService.getFormConfig).toHaveBeenCalled();
  });

  it('should load player, on error', () => {
    const formService = TestBed.get(FormService);
    component.playerConfig = playerData.playerConfig;
    spyOn(formService, 'getFormConfig').and.returnValue(throwError(playerData.formData));
    spyOn(component, 'loadOldPlayer');
    component.loadPlayer();
    expect(formService.getFormConfig).toHaveBeenCalled();
    expect(component.loadOldPlayer).toHaveBeenCalled();
  });

  it('should handle event for print' , () => {
     component.playerConfig = playerConfig;
     const url = component.playerConfig['metadata']['streamingUrl'];
     const mockFrameValue = {
       contentWindow: {
         print: () => {}
       }
     }
     spyOn(mockFrameValue.contentWindow, 'print').and.stub();
     spyOn(window.document , 'querySelector').and.returnValue(mockFrameValue);
     component.eventHandler(printEvent);
     expect(mockFrameValue.contentWindow.print).toHaveBeenCalled();
     expect(component.mobileViewDisplay).toBe('none');
  })
});

