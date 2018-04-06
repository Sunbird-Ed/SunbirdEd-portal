import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudyMaterialComponent } from './create-study-material.component';

describe('CreateStudyMaterialComponent', () => {
  let component: CreateStudyMaterialComponent;
  let fixture: ComponentFixture<CreateStudyMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStudyMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudyMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
