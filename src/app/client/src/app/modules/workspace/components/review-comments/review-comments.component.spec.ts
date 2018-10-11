import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCommentsComponent } from './review-comments.component';

describe('ReviewCommentsComponent', () => {
  let component: ReviewCommentsComponent;
  let fixture: ComponentFixture<ReviewCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
