import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTypeDatePickerComponent } from './input-type-date-picker.component';

xdescribe('InputTypeDatePickerComponent', () => {
  let component: InputTypeDatePickerComponent;
  let fixture: ComponentFixture<InputTypeDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTypeDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTypeDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
