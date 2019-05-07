import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionListComponent } from './question-list.component';

xdescribe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
