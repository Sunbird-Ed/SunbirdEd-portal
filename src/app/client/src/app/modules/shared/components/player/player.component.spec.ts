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

  xit('should create', () => {
    let contentProgressEvent;
    component.contentProgressEvent.subscribe((data) => {
      contentProgressEvent = data;
    });
    component.contentProgressEvent.emit({eid: 'start'});
    fixture.detectChanges();
    expect(contentProgressEvent).toBeTruthy();
    expect(component).toBeTruthy();
  });
  xit('should emit "END" event only if content progress is 100', () => {
    let contentProgressEvent;
    component.contentProgressEvent.subscribe((data) => {
      contentProgressEvent = data;
    });
    spyOn(component.contentIframe.nativeElement, '');
    fixture.detectChanges();
    expect(contentProgressEvent).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
