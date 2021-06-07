import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionGenericInputsComponent } from './question-generic-inputs.component';

xdescribe('QuestionGenericInputsComponent', () => {
  let component: QuestionGenericInputsComponent;
  let fixture: ComponentFixture<QuestionGenericInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionGenericInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionGenericInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
