import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs';
import { ResourceService, SharedModule, WindowScrollService } from '@sunbird/shared';
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
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [ResourceService, UserService, ProfileService, WindowScrollService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserEducationComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    component.education = response.successData;
    const offsetTop = 'education';
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
