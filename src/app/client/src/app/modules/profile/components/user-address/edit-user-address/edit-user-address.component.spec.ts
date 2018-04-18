import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileService } from './../../../services';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { ResourceService } from '@sunbird/shared';
import { EditUserAddressComponent } from './edit-user-address.component';
import {response} from './edit-user-address.component.spec.data';

describe('EditUserAddressComponent', () => {
  let component: EditUserAddressComponent;
  let fixture: ComponentFixture<EditUserAddressComponent>;
  const data = {
    userProfile: {
      'address': [{
        'addType': 'current',
        'addressLine1': 'aksdkas',
        'addressLine2': null,
        'city': 'asdasds',
        'country': null,
        'createdBy': '230cb747-6ce9-4e1c-91a8-1067ae291cb9',
        'createdDate': '2018-04-05 13:33:36:909+0000',
        'id': '01247588682584064030',
        'isDeleted': null,
        'state': null,
        'updatedBy': null,
        'updatedDate': null,
        'userId': '230cb747-6ce9-4e1c-91a8-1067ae291cb9',
        'zipcode': null
      }]
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserAddressComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule, HttpClientTestingModule, CoreModule],
      providers: [UserService, ProfileService, ResourceService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.address = response.successData;
    console.log(component.address);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
