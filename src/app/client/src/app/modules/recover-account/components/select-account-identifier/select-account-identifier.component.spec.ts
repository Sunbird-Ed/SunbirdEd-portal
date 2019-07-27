import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAccountIdentifierComponent } from './select-account-identifier.component';

describe('SelectAccountIdentifierComponent', () => {
  let component: SelectAccountIdentifierComponent;
  let fixture: ComponentFixture<SelectAccountIdentifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAccountIdentifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAccountIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
