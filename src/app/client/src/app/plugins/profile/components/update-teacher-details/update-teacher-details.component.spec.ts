import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeacherDetailsComponent } from './update-teacher-details.component';

describe('UpdateTeacherDetailsComponent', () => {
  let component: UpdateTeacherDetailsComponent;
  let fixture: ComponentFixture<UpdateTeacherDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTeacherDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTeacherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
