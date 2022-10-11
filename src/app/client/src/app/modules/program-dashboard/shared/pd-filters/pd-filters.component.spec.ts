import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdFiltersComponent } from './pd-filters.component';

describe('PdFiltersComponent', () => {
  let component: PdFiltersComponent;
  let fixture: ComponentFixture<PdFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
