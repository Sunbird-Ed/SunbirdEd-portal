import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, IUserProfile, IUserData, SharedModule } from '@sunbird/shared';
import { UserService, CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserAdditionalInfoComponent } from './edit-user-additional-info.component';

describe('EditUserAdditionalInfoComponent', () => {
  let component: EditUserAdditionalInfoComponent;
  let fixture: ComponentFixture<EditUserAdditionalInfoComponent>;
  const data = {
    userProfile: {
      'dob': '2017-10-23',
      'firstName': 'R. Juthika Admin us',
      'lastName': 'Admin userచూపడము ఎలాf',
      'phone': '******7418',
      'email': 'us*********@testss.com',
      'language': ['Bengali', 'Hindi', 'Urdu'],
      'grade': ['Grade 2', 'Grade 3', 'Grade 4', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 10'],
      'subject': ['Biology', 'Chemistry', 'Environmental Studies'],
      'gender': 'Female',
      'location': '123fgh',
      'webPages': [
        { type: 'fb', url: 'https://www.facebook.com/pauljuthika' },
        { type: 'in', url: 'https://www.linkedin.com/in/feed/?trk=hb_signin' },
        { type: 'blog', url: 'https://staging.open-sunbird.org/private/index#!/profile' }
      ]
    },
    userData: {}
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserAdditionalInfoComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule, CoreModule],
      providers: [ResourceService, ConfigService, UserService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
