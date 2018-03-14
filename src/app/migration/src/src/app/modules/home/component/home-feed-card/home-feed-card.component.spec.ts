import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFeedCardComponent } from './home-feed-card.component';

describe('HomeFeedCardComponent', () => {
  let component: HomeFeedCardComponent;
  let fixture: ComponentFixture<HomeFeedCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeFeedCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFeedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
