import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeAccountStatusComponent } from './merge-account-status.component';

describe('MergeAccountStatusComponent', () => {
  let component: MergeAccountStatusComponent;
  let fixture: ComponentFixture<MergeAccountStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeAccountStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeAccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
