import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
      imports: [SharedModule.forRoot()],
      declarations: [PlayerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
  });

  it('should emit "START"', () => {
    let contentProgressEvent;
    component.contentProgressEvent.subscribe((data) => {
      contentProgressEvent = data;
    });
    component.contentIframe.nativeElement.contentWindow.EkstepRendererAPI = {
      getCurrentStageId: () => 'stageId'
    };
    spyOn(component, 'emitSceneChangeEvent').and.callFake(() => 'called');
    component.generateContentReadEvent(startEvent);
    component.playerConfig = playerConfig;
    expect(contentProgressEvent).toBeDefined();
  });

  it('should emit "END" event', () => {
    let contentProgressEvent;
    component.contentProgressEvent.subscribe((data) => {
      contentProgressEvent = data;
    });
    component.playerConfig = playerConfig;
    component.generateContentReadEvent(endEventSuc);
    expect(contentProgressEvent).toBeDefined();
  });
});

