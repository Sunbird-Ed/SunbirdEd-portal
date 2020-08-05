import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchSelectedFilterComponent } from './global-search-selected-filter.component';

describe('GlobalSearchSelectedFilterComponent', () => {
  let component: GlobalSearchSelectedFilterComponent;
  let fixture: ComponentFixture<GlobalSearchSelectedFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSearchSelectedFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchSelectedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
