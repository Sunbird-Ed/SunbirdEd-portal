import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTextbookComponent } from './select-textbook.component';

xdescribe('TextbookSearchComponent', () => {
  let component: SelectTextbookComponent;
  let fixture: ComponentFixture<SelectTextbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTextbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTextbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
