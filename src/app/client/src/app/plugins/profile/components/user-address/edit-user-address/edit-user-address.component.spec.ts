import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs';
import { ResourceService, WindowScrollService, SharedModule } from '@sunbird/shared';
import { EditUserAddressComponent } from './edit-user-address.component';
import {response} from './edit-user-address.component.spec.data';

describe('EditUserAddressComponent', () => {
  let component: EditUserAddressComponent;
  let fixture: ComponentFixture<EditUserAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserAddressComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [UserService, ProfileService, ResourceService, WindowScrollService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserAddressComponent);
    component = fixture.componentInstance;
  });

  it('should call userservice', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = response.data.userProfile;
    userService._userData$.next({ err: null, userProfile: response.data.userProfile });
    component.address = response.successData;
    const windowScrollService = TestBed.get(WindowScrollService);
    const offsetTop = 'address';
    component.address = {};
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    component.ngOnInit();
    expect(component.isEdit).toBeTruthy();
    expect(component).toBeTruthy();
  });
  it('should pass if statement', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = response.data.userProfile;
    userService._userData$.next({ err: null, userProfile: response.address.userProfile });
    component.address = response.successData;
    const windowScrollService = TestBed.get(WindowScrollService);
    component.address = undefined;
    component.isPermanent = true;
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    component.ngOnInit();
    expect(component.isEdit).toBeFalsy();
    expect(component).toBeTruthy();
  });
  it('should pass else if statement', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = response.data.userProfile;
    userService._userData$.next({ err: null, userProfile: response.data.userProfile });
    component.address = response.successData;
    const windowScrollService = TestBed.get(WindowScrollService);
    component.address = undefined;
    component.isCurrent = true;
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    component.ngOnInit();
    expect(component.isEdit).toBeFalsy();
    expect(component).toBeTruthy();
  });
  it('should pass else statement', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = response.data.userProfile;
    userService._userData$.next({ err: null, userProfile: response.data.userProfile });
    component.address = response.successData;
    const windowScrollService = TestBed.get(WindowScrollService);
    component.address = undefined;
    component.isCurrent = false;
    component.isPermanent = false;
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    component.ngOnInit();
    expect(component.isEdit).toBeFalsy();
  });
  it('should accept addressType as permanent', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = response.address.userProfile;
    userService._userData$.next({ err: null, userProfile: response.address.userProfile });
    component.address = response.address.userProfile.address;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    component.ngOnInit();
    expect(component.isPermanent).toBeTruthy();
  });
  it('should pass forEach', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = response.invalidData.userProfile;
    userService._userData$.next({ err: null, userProfile: response.invalidData.userProfile });
    component.address = response.address.userProfile.address;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    component.ngOnInit();
    expect(component.isPermanent).toBeFalsy();
    expect(component.isCurrent).toBeFalsy();
  });
});
