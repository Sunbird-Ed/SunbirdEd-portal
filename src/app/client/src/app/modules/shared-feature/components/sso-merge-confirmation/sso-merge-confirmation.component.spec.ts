import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoMergeConfirmationComponent } from './sso-merge-confirmation.component';

describe('SsoMergeConfirmationComponent', () => {
  let component: SsoMergeConfirmationComponent;
  let fixture: ComponentFixture<SsoMergeConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoMergeConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoMergeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
