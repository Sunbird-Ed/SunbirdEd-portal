import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySearchComponent } from './activity-search.component';

describe('ActivitySearchComponent', () => {
  let component: ActivitySearchComponent;
  let fixture: ComponentFixture<ActivitySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
