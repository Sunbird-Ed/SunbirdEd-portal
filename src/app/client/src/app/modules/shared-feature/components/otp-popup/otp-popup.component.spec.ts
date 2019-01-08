import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpPopupComponent } from './otp-popup.component';

xdescribe('OtpPopupComponent', () => {
  let component: OtpPopupComponent;
  let fixture: ComponentFixture<OtpPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
