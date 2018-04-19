import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ResourceService, ConfigService, IUserProfile, IUserData } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { ProfileService } from '../../../services/profile/profile.service';
// import { FormBuilder, FormGroup, Validators } from ‘@angular/forms’;
// import { FormsModule, ReactiveFormsModule } from ‘@angular/forms’;

@Component({
  selector: 'app-edit-user-address',
  templateUrl: './edit-user-address.component.html',
  styleUrls: ['./edit-user-address.component.css']
})
export class EditUserAddressComponent implements OnInit {
  @Input() address: any;
  addressForm: FormGroup;
  @Output() addressChange = new EventEmitter();
  public isPermanent: boolean;
  public isCurrent: boolean;
  public isEdit = false;
  userProfile: IUserProfile;
  constructor(private fb: FormBuilder, public resourceService: ResourceService, public userService: UserService,
    public profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.smoothScroll('address');
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.userProfile = this.userService.userProfile;
    _.forEach(this.userProfile.address, (value, key) => {
      if (value.addType === 'permanent') {
        this.isPermanent = true;
      } else if (value.addType === 'current') {
        this.isCurrent = true;
      } else {
        this.isPermanent = false;
        this.isCurrent = false;
      }
    });
    if (this.address) {
      this.isEdit = true;
      this.addressForm = new FormGroup({
        addType: new FormControl(this.address.addType, [Validators.required]),
        addressLine1: new FormControl(this.address.addressLine1, [Validators.required]),
        addressLine2: new FormControl(this.address.addressLine2),
        city: new FormControl(this.address.city, [Validators.required]),
        state: new FormControl(this.address.state),
        country: new FormControl(this.address.country),
        zipcode: new FormControl(this.address.zipcode)
      });
    } else {
      let addresstype = null;
      if (this.isPermanent) {
        addresstype = 'current';
      } else if (this.isCurrent) {
        addresstype = 'permanent';
      } else {
        addresstype = null;
      }
      this.addressForm = new FormGroup({
        addType: new FormControl(addresstype),
        addressLine1: new FormControl(null, [Validators.required]),
        addressLine2: new FormControl(null),
        city: new FormControl(null, [Validators.required]),
        state: new FormControl(null),
        country: new FormControl(null),
        zipcode: new FormControl(null)
      });
    }
  }
  onAddressChange(type) {
    this.addressChange.emit();
  }

}
