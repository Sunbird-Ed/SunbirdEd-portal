import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpForReviewComponent } from './up-for-review.component';

describe('UpForReviewComponent', () => {
  let component: UpForReviewComponent;
  let fixture: ComponentFixture<UpForReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpForReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpForReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
