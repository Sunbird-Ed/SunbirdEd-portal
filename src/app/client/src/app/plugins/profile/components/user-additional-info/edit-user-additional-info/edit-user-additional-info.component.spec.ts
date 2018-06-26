import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, IUserProfile, IUserData, SharedModule, WindowScrollService } from '@sunbird/shared';
import { UserService, CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserAdditionalInfoComponent } from './edit-user-additional-info.component';
import { mockRes } from './edit-user-additional-info.component.spec.data';
import { ProfileService } from '../../../services/index';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditUserAdditionalInfoComponent', () => {
  let component: EditUserAdditionalInfoComponent;
  let fixture: ComponentFixture<EditUserAdditionalInfoComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserAdditionalInfoComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, TelemetryModule.forRoot(),
        HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot(), RouterTestingModule],
      providers: [UserService, ProfileService, WindowScrollService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserAdditionalInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    const offsetTop = 'additionaInfo';
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    component.webPages = mockRes.data.userProfile.webPages;
    component.basicInfo = {
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: '',
      dob: '',
      location: '',
      subject: [],
      grade: [],
      language: [],
      webPages: []
    };
    component.ngOnInit();
    expect(component.isEdit).toBe(true);
  });
});
