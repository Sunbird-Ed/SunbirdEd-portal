import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOnboardingComponent } from './user-onboarding.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';

describe('UserOnboardingComponent', () => {
  let component: UserOnboardingComponent;
  let fixture: ComponentFixture<UserOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserOnboardingComponent],
      imports: [
        SuiModule,
        SharedModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
