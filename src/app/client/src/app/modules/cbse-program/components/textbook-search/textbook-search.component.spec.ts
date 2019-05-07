import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextbookSearchComponent } from './textbook-search.component';

describe('TextbookSearchComponent', () => {
  let component: TextbookSearchComponent;
  let fixture: ComponentFixture<TextbookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextbookSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextbookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
