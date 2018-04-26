import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpforReviewFilterComponent } from './up-for-review-filter.component';

describe('BatchFilterComponent', () => {
  let component: UpforReviewFilterComponent;
  let fixture: ComponentFixture<UpforReviewFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpforReviewFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpforReviewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
