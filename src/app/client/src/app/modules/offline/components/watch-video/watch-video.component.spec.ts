import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchVideoComponent } from './watch-video.component';

describe('WatchVideoComponent', () => {
  let component: WatchVideoComponent;
  let fixture: ComponentFixture<WatchVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
