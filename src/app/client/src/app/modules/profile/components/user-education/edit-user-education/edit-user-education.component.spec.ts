import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { EditUserEducationComponent } from './edit-user-education.component';
import { response } from './edit-user-education.component.spec.data';

describe('EditUserEducationComponent', () => {
  let component: EditUserEducationComponent;
  let fixture: ComponentFixture<EditUserEducationComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const data = {
    userProfile: {
      'education': [{
        'boardOrUniversity': 'CBSE',
        'courseName': null,
        'degree': 'Graduation',
        'duration': null,
        'grade': 'A',
        'name': 'SVM',
        'percentage': 70,
        'yearOfPassing': 2012
      }]
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserEducationComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule, CoreModule],
      providers: [ResourceService, UserService, ProfileService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.education = response.successData;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
