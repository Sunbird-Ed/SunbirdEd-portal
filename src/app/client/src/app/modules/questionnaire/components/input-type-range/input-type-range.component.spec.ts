import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTypeRangeComponent } from './input-type-range.component';

xdescribe('InputTypeRangeComponent', () => {
  let component: InputTypeRangeComponent;
  let fixture: ComponentFixture<InputTypeRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTypeRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTypeRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
