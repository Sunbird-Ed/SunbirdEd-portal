import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCalendarCardComponent } from './home-calendar-card.component';

describe('HomeCalendarCardComponent', () => {
  let component: HomeCalendarCardComponent;
  let fixture: ComponentFixture<HomeCalendarCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCalendarCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCalendarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
