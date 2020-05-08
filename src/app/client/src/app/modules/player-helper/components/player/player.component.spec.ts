import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [PlayerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    component.contentProgressEvents$ = new Subject();
    component.contentIframe = { nativeElement: { contentWindow: { EkstepRendererAPI: { getCurrentStageId: () => 'stageId' } } } };
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
    component.contentProgressEvents$.subscribe((data) => {
      contentProgressEvent = data;
    });
    component.playerConfig = playerConfig;
    component.generateContentReadEvent(endEventSuc);
    component.showRatingPopup(endEventSuc);
    expect(contentProgressEvent).toBeDefined();
    expect(component.contentRatingModal).toBeTruthy();
  });
  it('should call ngOnChange ',  () => {
    component.playerConfig = playerConfig;
    component.ngOnChanges();
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
      mockDomElement.mozRequestFullScreen = () => {};
      spyOn(document, 'querySelector').and.returnValue(mockDomElement);
      spyOn(screen.orientation, 'lock');
      component.rotatePlayer();
      tick(100);
      expect(screen.orientation.lock).toHaveBeenCalledWith('landscape');
    }));

    it('should rotate player for webkit browser', fakeAsync(() => {
      mockDomElement.requestFullscreen = undefined;
      mockDomElement.mozRequestFullScreen = undefined;
      mockDomElement.webkitRequestFullscreen = () => {};
      spyOn(document, 'querySelector').and.returnValue(mockDomElement);
      spyOn(screen.orientation, 'lock');
      component.rotatePlayer();
      tick(100);
      expect(screen.orientation.lock).toHaveBeenCalledWith('landscape');
    }));

    it('should rotate player ms browser', fakeAsync(() => {
      mockDomElement.requestFullscreen = undefined;
      mockDomElement.mozRequestFullScreen = undefined;
      mockDomElement.webkitRequestFullscreen = undefined;
      mockDomElement.msRequestFullscreen = () => {};
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
      document['mozCancelFullScreen'] = () => {};
      component.isSingleContent = true;
      component.closeFullscreen();
      expect(component.showPlayIcon).toBe(true);
    });

    it('should close player fullscreen for webkit browser ', () => {
      document['exitFullscreen'] = undefined;
      document['mozCancelFullScreen'] = undefined;
      document['webkitExitFullscreen'] = () => {};
      component.isSingleContent = true;
      component.closeFullscreen();
      expect(component.showPlayIcon).toBe(true);
    });

    it('should close player fullscreen for ms browser ', () => {
      document['exitFullscreen'] = undefined;
      document['mozCancelFullScreen'] = undefined;
      document['webkitExitFullscreen'] = undefined;
      document['msExitFullscreen'] = () => {};
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
    component.closeFullscreen();
    expect(component.showPlayIcon).toBe(true);
  });

});

