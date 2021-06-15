import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTypeTextComponent } from './input-type-text.component';

xdescribe('InputTypeTextComponent', () => {
  let component: InputTypeTextComponent;
  let fixture: ComponentFixture<InputTypeTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTypeTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTypeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
