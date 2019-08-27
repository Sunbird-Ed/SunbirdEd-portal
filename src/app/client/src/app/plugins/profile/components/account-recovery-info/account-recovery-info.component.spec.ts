import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRecoveryInfoComponent } from './account-recovery-info.component';

describe('AccountRecoveryInfoComponent', () => {
  let component: AccountRecoveryInfoComponent;
  let fixture: ComponentFixture<AccountRecoveryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRecoveryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRecoveryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
