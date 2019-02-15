import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSearchService } from './../../services';
import { UserService, PermissionService, RolesAndPermissions, OrgDetailsService } from '@sunbird/core';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, IUserData } from '@sunbird/shared';
import { ProfileService } from '@sunbird/profile';
// import { forkJoin } from 'rxjs/observable/forkJoin';
import { delay, catchError, map } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit-component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal;
  userId: string;
  allRoles: Array<RolesAndPermissions>;
  userDetailsForm: FormGroup;
  sbFormBuilder: FormBuilder;
  selectedOrgName: string;
  selectedOrgId: string;
  selectedOrgUserRoles: Array<string>;
  selectedOrgUserRolesNew: any = [];
  stateId: string;
  allDistricts: any;
  allBlocks: any;
  allSchools: any;
  userProfile: any;
  userDetails: any;
  telemetryImpression: IImpressionEventInput;
  submitInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  blockLoader = false;
  schoolLoader = false;
  showMainLoader = true;
  locationCodes: Array<string>;

  constructor(private userSearchService: UserSearchService, public activatedRoute: ActivatedRoute,
    private permissionService: PermissionService, public resourceService: ResourceService,
    public route: Router, private toasterService: ToasterService, formBuilder: FormBuilder,
    public routerNavigationService: RouterNavigationService, public profileService: ProfileService,
    public userService: UserService, public orgDetailsService: OrgDetailsService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.getLoggedInUserDetails();
  }

  getLoggedInUserDetails() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          const rootOrgDetails = _.filter(this.userProfile.organisations, (org) => {
            return org.organisationId === this.userProfile.rootOrgId;
          });
          this.stateId = _.get(rootOrgDetails[0], 'locationIds[0]');
          this.getAllRoles();
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
          this.redirect();
        }
      });
  }

  getAllRoles() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params.userId;
      this.settelemetryData();
    });
    this.populateUserDetails();
    this.permissionService.permissionAvailable$.subscribe(params => {
      if (params === 'success') {
        this.allRoles = this.permissionService.allRoles;
      }
      this.allRoles = _.filter(this.allRoles, (role) => {
        return role.role !== 'ORG_ADMIN' && role.role !== 'SYSTEM_ADMINISTRATION' && role.role !== 'ADMIN';
      });
    });
    _.remove(this.allRoles, { role: 'PUBLIC' });
  }

  populateUserDetails() {
    const option = { userId: this.userId };
    this.userSearchService.getUserById(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.userDetails = apiResponse.result.response;
        const rootOrgDetails = _.filter(this.userDetails.organisations, (org) => {
          return org.organisationId === this.userDetails.rootOrgId;
        });
        this.selectedOrgUserRoles = rootOrgDetails[0].roles;
        this.initializeFormFields();
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.redirect();
      }
    );
  }

  initializeFormFields() {
    this.userDetailsForm = this.sbFormBuilder.group({
      role: new FormControl(this.selectedOrgUserRoles),
      district: new FormControl(null),
      block: new FormControl(null),
      school: new FormControl(null)
    });
    this.getDistrict();
    this.onDistrictChange();
    this.onBlockChange();
  }

  getDistrict() {
    if (this.stateId) {
      const requestData = { 'filters': { 'type': 'district', parentId: this.stateId } };
      this.profileService.getUserLocation(requestData).subscribe(res => {
        this.allDistricts = res.result.response;
        const location = _.find(this.userDetails.userLocations, (locations) => {
          return locations.type === 'district';
        });
        let locationExist: any;
        if (location) {
          locationExist = _.find(this.allDistricts, (locations) => {
            return locations.code === location.code;
          });
        }

        locationExist ? this.userDetailsForm.controls['district'].setValue(locationExist.code) :
          this.userDetailsForm.controls['district'].setValue('');
        this.showMainLoader = false;
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.redirect();
      });
    } else {
      this.showMainLoader = false;
    }
  }

  onDistrictChange() {
    const districtControl = this.userDetailsForm.get('district');
    let districtValue = '';
    districtControl.valueChanges.subscribe(
      (data: string) => {
        if (districtControl.status === 'VALID' && districtValue !== districtControl.value) {
          const district = _.find(this.allDistricts, (dis) => {
            return dis.code === districtControl.value;
          });
          this.getBlock(district.id);
          districtValue = districtControl.value;
        }
      });
  }

  getBlock(districtId) {
    this.blockLoader = true;
    const requestData = { 'filters': { 'type': 'block', parentId: districtId } };
    this.profileService.getUserLocation(requestData).subscribe(res => {
      this.allBlocks = res.result.response;
      const location = _.find(this.userDetails.userLocations, (locations) => {
        return locations.type === 'block';
      });
      let locationExist: any;
      if (location) {
        locationExist = _.find(this.allBlocks, (locations) => {
          return locations.code === location.code;
        });
      }

      locationExist ? this.userDetailsForm.controls['block'].setValue(locationExist.code) :
        this.userDetailsForm.controls['block'].setValue('');
      this.blockLoader = false;
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
      this.redirect();
    });
  }

  onBlockChange() {
    const blockControl = this.userDetailsForm.get('block');
    let blockValue = '';
    blockControl.valueChanges.subscribe(
      (data: string) => {
        if (blockControl.status === 'VALID' && blockValue !== blockControl.value) {
          this.userDetailsForm.controls['school'].setValue('');
          this.allSchools = [];
          const block = _.find(this.allBlocks, (blocks) => {
            return blocks.code === blockControl.value;
          });
          if (block && block.id) { this.getSchool(block.id); }
          blockValue = blockControl.value;
        }
      });
  }

  getSchool(blockId) {
    this.schoolLoader = true;
    const option = { 'filters': { 'locationIds': [blockId] } };
    this.orgDetailsService.fetchOrgs(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.allSchools = apiResponse.result.response.content;
        this.schoolLoader = false;
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.redirect();
      }
    );
  }

  onSubmitForm() {
    const rolesUpdate = this.updateRoles();
    const profileUpdate = this.updateProfile();
    const apiCallsArray = [];

    this.userDetailsForm.value.role.push('PUBLIC');
    if (!_.isEqual(this.selectedOrgUserRoles.sort(), this.userDetailsForm.value.role.sort())) {
      apiCallsArray.push(rolesUpdate);
    }

    const lDetails = _.filter(this.userDetails.userLocations, (location) => {
      return location.type !== 'state';
    });
    const lCode = _.map(lDetails, 'code');

    if (!_.isEqual(this.locationCodes.sort(), lCode.sort())) {
      apiCallsArray.push(profileUpdate);
    }

    forkJoin(apiCallsArray)
      .subscribe(val => {
        console.log('-----------', val);
      });
  }

  updateRoles() {
    const option = { userId: this.userId, orgId: this.userDetails.rootOrgId, roles: this.userDetailsForm.value.role };
    return this.userSearchService.updateRoles(option).pipe(map((res) => res), catchError(e => of('Error')));
  }

  updateProfile() {
    this.locationCodes = [];
    if (this.userDetailsForm.value.district) { this.locationCodes.push(this.userDetailsForm.value.district); }
    if (this.userDetailsForm.value.block) { this.locationCodes.push(this.userDetailsForm.value.block); }
    const data = { userId: this.userId, locationCodes: this.locationCodes };
    return this.profileService.updatePrivateProfile(data).pipe(map((res) => res), catchError(e => of('Error')));
  }

  redirect(): void {
    this.route.navigate(['../../'], { relativeTo: this.activatedRoute });
  }

  settelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.userId,
        type: 'user',
        ver: '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.route.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };

    this.submitInteractEdata = {
      id: 'user-update',
      type: 'click',
      pageid: 'user-edit'
    };

    this.telemetryInteractObject = {
      id: this.userId,
      type: 'user',
      ver: '1.0'
    };
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}

