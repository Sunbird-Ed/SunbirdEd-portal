import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTypeCheckboxComponent } from './input-type-checkbox.component';

xdescribe('InputTypeCheckboxComponent', () => {
  let component: InputTypeCheckboxComponent;
  let fixture: ComponentFixture<InputTypeCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTypeCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTypeCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
