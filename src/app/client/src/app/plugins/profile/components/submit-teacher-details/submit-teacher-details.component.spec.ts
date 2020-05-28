import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitTeacherDetailsComponent } from './submit-teacher-details.component';

describe('SubmitTeacherDetailsComponent', () => {
  let component: SubmitTeacherDetailsComponent;
  let fixture: ComponentFixture<SubmitTeacherDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitTeacherDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitTeacherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
