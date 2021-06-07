import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTypeRadioComponent } from './input-type-radio.component';

xdescribe('InputTypeRadioComponent', () => {
  let component: InputTypeRadioComponent;
  let fixture: ComponentFixture<InputTypeRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTypeRadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTypeRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
