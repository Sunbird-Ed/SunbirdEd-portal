import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixQuestionsComponent } from './matrix-questions.component';

xdescribe('MatrixQuestionsComponent', () => {
  let component: MatrixQuestionsComponent;
  let fixture: ComponentFixture<MatrixQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
