import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAccountIdentifierComponent } from './verify-account-identifier.component';

describe('VerifyAccountIdentifierComponent', () => {
  let component: VerifyAccountIdentifierComponent;
  let fixture: ComponentFixture<VerifyAccountIdentifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyAccountIdentifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyAccountIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
