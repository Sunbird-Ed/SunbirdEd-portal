import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextbookListComponent } from './textbook-list.component';

describe('TextbookListComponent', () => {
  let component: TextbookListComponent;
  let fixture: ComponentFixture<TextbookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextbookListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextbookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
