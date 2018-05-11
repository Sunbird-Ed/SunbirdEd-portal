import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, SharedModule, ToasterService } from '@sunbird/shared';
import { UserAddressComponent } from './user-address.component';
import { mockRes } from './user-address.component.spec.data';
import { EditUserAddressComponent } from '../../user-address/edit-user-address/edit-user-address.component';
import { Ng2IzitoastService } from 'ng2-izitoast';

describe('UserAddressComponent', () => {
  let component: EditUserAddressComponent;
  let fixture: ComponentFixture<EditUserAddressComponent>;
  let parentComp: UserAddressComponent;
  let parentFixture: ComponentFixture<UserAddressComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ 'section': 'address', 'action': 'edit' }])
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserAddressComponent, EditUserAddressComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, SharedModule, CoreModule],
      providers: [ResourceService, UserService, ProfileService, ToasterService, Ng2IzitoastService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserAddressComponent);
    component = fixture.componentInstance;
    parentFixture = TestBed.createComponent(UserAddressComponent);
    parentComp = parentFixture.componentInstance;
  });

  it('should create', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userProfile = mockRes.data.userProfile;
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    activatedRoute.params = {
      'section': 'address',
      'action': 'add'
    };
    component.address = [];
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
  it('should pass activated route', () => {
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userProfile = mockRes.data.userProfile;
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    parentComp.allowedAction = [];
    parentComp.ngOnInit();
    activatedRoute.params = {
      'section': 'address',
      'action': 'add'
    };
    expect(component).toBeTruthy();
  });
  xit('should call editAddress method', () => {
    const profileService = TestBed.get(ProfileService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(profileService, 'updateProfile').and.callFake(() => Observable.of(mockRes.data));
    parentComp.editAddress();
    expect(component).toBeTruthy();
  });
  xit('should call addAddress method', () => {
    const router = TestBed.get(Router);
    const profileService = TestBed.get(ProfileService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(profileService, 'updateProfile').and.callFake(() => Observable.of(mockRes.data));
    parentComp.addChild.addressForm.value.value = mockRes.addressData;
    parentComp.addAddress();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
  it('should deleteAddress method', () => {
    const profileService = TestBed.get(ProfileService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    const request = {
      address: [mockRes.addressData]
    };
    parentComp.deleteAddress(request);
    expect(component).toBeTruthy();
  });
  it('should call onAddressChange method', () => {
    const profileService = TestBed.get(ProfileService);
    expect(component).toBeTruthy();
  });
});
