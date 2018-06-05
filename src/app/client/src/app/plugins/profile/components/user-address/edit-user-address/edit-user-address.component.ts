import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, WindowScrollService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { ProfileService } from '../../../services';

@Component({
  selector: 'app-edit-user-address',
  templateUrl: './edit-user-address.component.html',
  styleUrls: ['./edit-user-address.component.css']
})
export class EditUserAddressComponent implements OnInit {
  /**
  * Reference of Input annotation
  */
  @Input() address: any;
  /**
  * Reference of formgroup
  */
  addressForm: FormGroup;
  /**
  * Reference of output event emitter to communicate between parent component
  */
  @Output() addressChange = new EventEmitter();
  /**
  * Booloean value to enable/disable radio butoon field
  */
  public isPermanent: boolean;
  /**
  * Booloean value to enable/disable radio butoon field
  */
  public isCurrent: boolean;
  /**
  * Booloean value to hide/show div
  */
  public isEdit = false;
  /**
  * Reference of User Profile interface
  */
  userProfile: IUserProfile;
  constructor(private fb: FormBuilder, public resourceService: ResourceService, public userService: UserService,
    public profileService: ProfileService, public windowScrollService: WindowScrollService) { }
  /**
  * Invokes user service to fetch user profile data
  * It also creates instance of FOrmGroup
  */
  ngOnInit() {
    this.windowScrollService.smoothScroll('address');
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
        zipcode: new FormControl(this.address.zipcode, [Validators.pattern(/^\d{6}$/)])
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
        addType: new FormControl(addresstype, [Validators.required]),
        addressLine1: new FormControl(null, [Validators.required]),
        addressLine2: new FormControl(null),
        city: new FormControl(null, [Validators.required]),
        state: new FormControl(null),
        country: new FormControl(null),
        zipcode: new FormControl(null, [Validators.pattern(/^\d{6}$/)])
      });
    }
  }
  /**
  * This method is used to emit the form data values
  */
  onAddressChange(type) {
    this.addressChange.emit();
  }

}
