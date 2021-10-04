import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventViewTypeComponent } from './event-view-type.component';

describe('EventViewTypeComponent', () => {
  let component: EventViewTypeComponent;
  let fixture: ComponentFixture<EventViewTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventViewTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventViewTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
