import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCreationHeaderComponent } from './question-creation-header.component';

describe('QuestionCreationHeaderComponent', () => {
  let component: QuestionCreationHeaderComponent;
  let fixture: ComponentFixture<QuestionCreationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionCreationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCreationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
