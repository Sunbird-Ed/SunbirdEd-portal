import { SharedModule } from './../../shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot()],
      declarations: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    let telemetryEvent;
    component.contentProgressEvent.subscribe((data) => {
      telemetryEvent = data;
    });
    component.contentProgressEvent.emit({eid: 'start'});
    fixture.detectChanges();
    expect(telemetryEvent).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
