import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTextbookComponent } from './create-textbook.component';

describe('CreateTextbookComponent', () => {
  let component: CreateTextbookComponent;
  let fixture: ComponentFixture<CreateTextbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTextbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTextbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
