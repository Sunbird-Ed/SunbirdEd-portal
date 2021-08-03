import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMyEventsComponent } from './all-my-events.component';

describe('AllMyEventsComponent', () => {
  let component: AllMyEventsComponent;
  let fixture: ComponentFixture<AllMyEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMyEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMyEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
