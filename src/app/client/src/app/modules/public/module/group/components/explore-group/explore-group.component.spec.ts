import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreGroupComponent } from './explore-group.component';

describe('ExploreGroupComponent', () => {
  let component: ExploreGroupComponent;
  let fixture: ComponentFixture<ExploreGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
