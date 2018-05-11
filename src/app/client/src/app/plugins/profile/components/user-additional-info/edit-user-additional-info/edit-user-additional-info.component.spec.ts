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

describe('EditUserAdditionalInfoComponent', () => {
  let component: EditUserAdditionalInfoComponent;
  let fixture: ComponentFixture<EditUserAdditionalInfoComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserAdditionalInfoComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule, CoreModule],
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
    userService._userProfile = mockRes.data.userProfile;
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    component.webPages = mockRes.data.userProfile.webPages;
    expect(component).toBeTruthy();
  });
});
