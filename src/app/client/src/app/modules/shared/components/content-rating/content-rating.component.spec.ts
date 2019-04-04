import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentRatingComponent } from './content-rating.component';

describe('ContentRatingComponent', () => {
  let component: ContentRatingComponent;
  let fixture: ComponentFixture<ContentRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
