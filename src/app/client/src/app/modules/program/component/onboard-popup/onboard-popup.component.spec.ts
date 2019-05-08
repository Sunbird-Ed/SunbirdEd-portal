import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardPopupComponent } from './onboard-popup.component';

xdescribe('OnboardPopupComponent', () => {
  let component: OnboardPopupComponent;
  let fixture: ComponentFixture<OnboardPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
