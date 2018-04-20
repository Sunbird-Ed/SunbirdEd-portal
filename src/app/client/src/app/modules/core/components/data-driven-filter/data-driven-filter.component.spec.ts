import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDrivenFilterComponent } from './data-driven-filter.component';

describe('DataDrivenFilterComponent', () => {
  let component: DataDrivenFilterComponent;
  let fixture: ComponentFixture<DataDrivenFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDrivenFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDrivenFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
