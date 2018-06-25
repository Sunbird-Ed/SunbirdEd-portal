import { SharedModule } from './../../shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';

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
      edata: { summary: [{progress: 100}]}
    }
  }
};
const endEventErr = {
  detail: {
    telemetryData: {
      eid: 'END',
      edata: { summary: [{progress: 50}]}
    }
  }
};
describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot()],
      declarations: []
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
    component.generateContentReadEvent(startEvent);
    expect(contentProgressEvent).toBeDefined();
  });

  it('should emit "END" event if content progress is 100', () => {
    let contentProgressEvent;
    component.contentProgressEvent.subscribe((data) => {
      contentProgressEvent = data;
    });
    component.generateContentReadEvent(endEventSuc);
    expect(contentProgressEvent).toBeDefined();
  });
  it('should not emit "END" event if content progress is not 100', () => {
    let contentProgressEvent;
    component.contentProgressEvent.subscribe((data) => {
      contentProgressEvent = data;
    });
    component.generateContentReadEvent(endEventErr);
    expect(contentProgressEvent).toBeUndefined();
  });
});

