import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTypeNumberComponent } from './input-type-number.component';

xdescribe('InputTypeNumberComponent', () => {
  let component: InputTypeNumberComponent;
  let fixture: ComponentFixture<InputTypeNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTypeNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTypeNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
