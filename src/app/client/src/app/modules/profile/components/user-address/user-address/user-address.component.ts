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
@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.css']
})
export class UserAddressComponent implements OnInit {
  @ViewChildren('edit') editChild: QueryList<EditUserAddressComponent>;
  @ViewChild('add') addChild: EditUserAddressComponent;
  resourceService: ResourceService;
  userProfile: IUserProfile;
  privateProfileFields = true;
  action: string;
  allowedAction = ['edit', 'add'];
  isCurrent: boolean;
  isPermanent: boolean;
  showError: boolean;
  showAddressError: boolean;
  constructor(resourceService: ResourceService,
    public userService: UserService, public profileService: ProfileService,
    public activatedRoute: ActivatedRoute, private router: Router, public toasterService: ToasterService) {
    this.resourceService = resourceService;
  }

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
  }
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
          // toaster err
          this.toasterService.error(err.error.params.errmsg);
        });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }
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
  deleteAddress(deletedAddress) {
    const request = {
      address: [deletedAddress]
    };
    this.profileService.updateProfile(request).subscribe(res => {
      // toaster suc
      this.toasterService.success(this.resourceService.messages.smsg.m0016);
    },
      err => {
        // toaster err
        this.toasterService.error(this.resourceService.messages.fmsg.m0043);
      });
  }
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
}
