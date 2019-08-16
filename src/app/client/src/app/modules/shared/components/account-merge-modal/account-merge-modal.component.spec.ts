import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMergeModalComponent } from './account-merge-modal.component';

describe('AccountMergeModalComponent', () => {
  let component: AccountMergeModalComponent;
  let fixture: ComponentFixture<AccountMergeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMergeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMergeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
