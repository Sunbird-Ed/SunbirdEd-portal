import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateTeacherIdentifierPopupComponent } from './validate-teacher-identifier-popup.component';

xdescribe('ValidateTeacherIdentifierPopupComponent', () => {
  let component: ValidateTeacherIdentifierPopupComponent;
  let fixture: ComponentFixture<ValidateTeacherIdentifierPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateTeacherIdentifierPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateTeacherIdentifierPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
