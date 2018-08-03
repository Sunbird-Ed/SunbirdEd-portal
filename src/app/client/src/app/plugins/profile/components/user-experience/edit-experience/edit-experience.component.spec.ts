import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs';
import { ResourceService, WindowScrollService, SharedModule } from '@sunbird/shared';
import { EditExperienceComponent } from './edit-experience.component';
import { response } from './edit-experience.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditExperienceComponent', () => {
  let component: EditExperienceComponent;
  let fixture: ComponentFixture<EditExperienceComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditExperienceComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [UserService, ProfileService, WindowScrollService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExperienceComponent);
    component = fixture.componentInstance;
  });
  it('should call window scroll service', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    const offsetTop = 'experience';
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    component.ngOnInit();
  });
  it('should create form', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    const offsetTop = 'experience';
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    const joiningDate = '2017-11-20';
    const endDate = '2017-11-20';
    component.ngOnInit();
  });
  it('should create form', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    const offsetTop = 'experience';
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    const joiningDate = '2017-11-20';
    const endDate = '2017-11-20';
    component.ngOnInit();
  });
});
