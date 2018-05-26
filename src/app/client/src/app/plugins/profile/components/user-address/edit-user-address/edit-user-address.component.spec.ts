import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ResourceService, WindowScrollService, SharedModule } from '@sunbird/shared';
import { EditUserAddressComponent } from './edit-user-address.component';
import {response} from './edit-user-address.component.spec.data';

describe('EditUserAddressComponent', () => {
  let component: EditUserAddressComponent;
  let fixture: ComponentFixture<EditUserAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserAddressComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, CoreModule, SharedModule],
      providers: [UserService, ProfileService, ResourceService, WindowScrollService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = response.data.userProfile;
    userService._userData$.next({ err: null, userProfile: response.data.userProfile });
    component.address = response.successData;
    const windowScrollService = TestBed.get(WindowScrollService);
    const offsetTop = 'address';
    spyOn(windowScrollService, 'smoothScroll').and.returnValue(null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
