import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ResourceService } from '@sunbird/shared';
import { EditExperienceComponent } from './edit-experience.component';
import { response } from './edit-experience.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditExperienceComponent', () => {
  let component: EditExperienceComponent;
  let fixture: ComponentFixture<EditExperienceComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditExperienceComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, CoreModule],
      providers: [UserService, ProfileService, ResourceService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExperienceComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  // it('should create', () => {
  //   component.experience = response.successData;
  //   // fixture.detectChanges();
  //   expect(component).toBeTruthy();
  // });
  it('should call profile service', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'smoothScroll').and.callThrough();
    component.ngOnInit();
  });
  it('should create form', () => {
    const joiningDate = '2017-11-20';
    const endDate = '2017-11-20';
    component.ngOnInit();
  });
  it('should create form', () => {
    const joiningDate = '2017-11-20';
    const endDate = '2017-11-20';
    component.ngOnInit();
  });
});
