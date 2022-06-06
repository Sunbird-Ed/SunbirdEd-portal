import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupEmailPasswordComponent } from './signup-email-password.component';

describe('SignupEmailPasswordComponent', () => {
  let component: SignupEmailPasswordComponent;
  let fixture: ComponentFixture<SignupEmailPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupEmailPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupEmailPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
