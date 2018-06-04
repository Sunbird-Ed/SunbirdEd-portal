import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { UserService } from '@sunbird/core';
import {
  ResourceService, ConfigService, IUserProfile, IUserData, ToasterService
} from '@sunbird/shared';
import * as _ from 'lodash';
import * as moment from 'moment';
import { EditUserAddressComponent } from '../edit-user-address/edit-user-address.component';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.css']
})
export class UserAddressComponent implements OnInit {
  /**
  * Reference of ViewChildren
  */
  @ViewChildren('edit') editChild: QueryList<EditUserAddressComponent>;
  /**
  * Reference of ViewChild to get data of child component
  */
  @ViewChild('add') addChild: EditUserAddressComponent;
  /**
  * Reference of Resource service
  */
  resourceService: ResourceService;
  /**
  * Reference of User Profile interface
  */
  userProfile: IUserProfile;
  /**
  * Reference for profile visibility
  */
  privateProfileFields = true;
  /**
  * Contains edit/add action
  */
  action: string;
  /**
  * Contains an array of actions
  */
  allowedAction = ['edit', 'add'];
  /**
  * Boolean value to enable/disable radio button
  */
  isCurrent: boolean;
  /**
  * Boolean value to enable/disable radio button
  */
  isPermanent: boolean;
  /**
  * Boolean value to show/hide error message
  */
  showError: boolean;
  /**
  * Boolean value to show/hide error message
  */
  showAddressError: boolean;
  editAddressInteractEdata: IInteractEventEdata;
  addAddressInteractEdata: IInteractEventEdata;
  deleteAddressInteractEdata: IInteractEventEdata;
  closeAddressInteractEdata: IInteractEventEdata;
  saveEditAddressInteractEdata: IInteractEventEdata;
  saveAddAddressInteractEdata: IInteractEventEdata;
  lockAddressInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(resourceService: ResourceService,
    public userService: UserService, public profileService: ProfileService,
    public activatedRoute: ActivatedRoute, private router: Router, public toasterService: ToasterService) {
    this.resourceService = resourceService;
  }
  /**
  * invokes user service to fetch user profile data
  */
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.userProfile = this.userService.userProfile;
    this.activatedRoute.params.subscribe(params => {
      if (params.section && params.section === 'address' &&
        this.allowedAction.indexOf(params.action) > -1) {
        this.action = params.action;
      } else if (params.section && params.section === 'address' &&
        this.allowedAction.indexOf(params.action) === -1) {
        this.router.navigate(['/profile']);
      } else {
        this.action = 'view';
      }
    });
    this.setInteractEventData();
  }
  /**
  * This method invokes profile service to edit existing user address
  */
  editAddress() {
    const editedAddress = [];
    let formStatus = true;
    this.editChild.forEach((child) => {
      if (child.addressForm.valid === true) {
        const addAddress: any = {};
        _.forIn(child.addressForm.value, (value, key) => {
          if (value !== undefined) {
            addAddress[key] = value;
          }
        });
        addAddress['id'] = child.address.id;
        addAddress.userId = child.address.userId;
        editedAddress.push(addAddress);
      } else {
        formStatus = false;
      }
    });
    if (formStatus === true) {
      editedAddress['userId'] = this.userService.userid;
      const req = {
        address: editedAddress
      };
      this.profileService.updateProfile(req).subscribe(res => {
        this.router.navigate(['/profile']);
        this.toasterService.success(this.resourceService.messages.smsg.m0023);
      },
        err => {
          this.toasterService.error(err.error.params.errmsg);
        });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }
  /**
  * This method invokes profile service to add new user address
  */
  addAddress() {
    const addAddress: any = {};
    if (this.addChild.addressForm.touched === true && this.addChild.addressForm.valid === true) {
      _.forIn(this.addChild.addressForm.value, (value, key) => {
        if (value && value !== '' && value !== null) {
          addAddress[key] = value;
        }
      });
      addAddress.userId = this.userService.userid;
      const req = {
        address: [addAddress]
      };
      this.profileService.updateProfile(req).subscribe(res => {
        this.action = 'view';
        this.router.navigate(['/profile']);
        this.toasterService.success(this.resourceService.messages.smsg.m0026);
      },
        err => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0076);
        });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }
  /**
  * This method invokes profile service to delete user address
  */
  deleteAddress(deletedAddress) {
    const request = {
      address: [deletedAddress]
    };
    this.profileService.updateProfile(request).subscribe(res => {
      this.toasterService.success(this.resourceService.messages.smsg.m0016);
    },
      err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0043);
      });
  }
  /**
  * This method watches for the change triggered in child and updates the showError
  * variable accordingly
  */
  onAddressChange(event) {
    let curAddressId = 0;
    setTimeout(() => {
      this.editChild.forEach((child) => {
        if (child.addressForm.value.addType === 'current') {
          curAddressId++;
        }
      });
      if (curAddressId > 1) {
        this.showError = true;
      } else {
        this.showError = false;
      }
    }, 0);
    let AddressId = 0;
    setTimeout(() => {
      this.editChild.forEach((child) => {
        if (child.addressForm.value.addType === 'permanent') {
          AddressId++;
        }
      });
      if (AddressId > 1) {
        this.showAddressError = true;
      } else {
        this.showAddressError = false;
      }
    }, 0);
  }
  setInteractEventData() {
    this.editAddressInteractEdata = {
      id: 'profile-update-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.addAddressInteractEdata = {
      id: 'profile-add-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.deleteAddressInteractEdata = {
      id: 'profile-delete-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.closeAddressInteractEdata = {
      id: 'profile-close-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.saveEditAddressInteractEdata = {
      id: 'profile-save-edit-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.saveAddAddressInteractEdata = {
      id: 'profile-save-add-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.lockAddressInteractEdata = {
      id: 'lock-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  }
}
