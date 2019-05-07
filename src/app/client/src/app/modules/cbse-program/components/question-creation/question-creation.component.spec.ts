import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCreationComponent } from './question-creation.component';

describe('QuestionCreationComponent', () => {
  let component: QuestionCreationComponent;
  let fixture: ComponentFixture<QuestionCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
