import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingLocationComponent } from './onboarding-location.component';

xdescribe('OnboardingLocationComponent', () => {
  let component: OnboardingLocationComponent;
  let fixture: ComponentFixture<OnboardingLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
