import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageQuestionsComponent } from './page-questions.component';

xdescribe('PageQuestionsComponent', () => {
  let component: PageQuestionsComponent;
  let fixture: ComponentFixture<PageQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
