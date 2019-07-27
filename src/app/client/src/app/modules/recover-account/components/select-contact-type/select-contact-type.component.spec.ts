import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectContactTypeComponent } from './select-contact-type.component';

describe('SelectContactTypeComponent', () => {
  let component: SelectContactTypeComponent;
  let fixture: ComponentFixture<SelectContactTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectContactTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectContactTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
