import { ConfigService, ResourceService, IUserData, ToasterService } from '@sunbird/shared';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, OrgDetailsService, RolesAndPermissions, PermissionService, FrameworkService } from '@sunbird/core';
import * as _ from 'lodash';
import { ProfileService } from '@sunbird/profile';
import { map, catchError } from 'rxjs/operators';
import { of, Subscription, combineLatest } from 'rxjs';
import { UserSearchService } from './../../services';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter-component.scss']
})

export class UserFilterComponent implements OnInit, OnDestroy {
  queryParams: any;
  refresh = true;
  userProfile: any;
  stateId: string;
  allDistricts: any;
  allBlocks: any;
  allSchools: any;
  allRoles: Array<RolesAndPermissions>;
  allUserType: object = {};
  private frameworkDataSubscription: Subscription;
  medium: object = {};
  class: object = {};
  subject: object = {};
  formInputData: any = {};
  showFilters = false;

  constructor(private cdr: ChangeDetectorRef, public resourceService: ResourceService,
    private router: Router, private activatedRoute: ActivatedRoute,
    public userService: UserService, public toasterService: ToasterService,
    public profileService: ProfileService, public orgDetailsService: OrgDetailsService,
    public permissionService: PermissionService, public frameworkService: FrameworkService,
    public userSearchService: UserSearchService) {
    this.router.onSameUrlNavigation = 'reload';
  }

  removeFilterSelection(filterType, value) {
    const itemIndex = this.queryParams[filterType].indexOf(value);
    if (itemIndex !== -1) {
      this.queryParams[filterType].splice(itemIndex, 1);
    }
    this.hardRefreshFilter();
  }

  applyFilters() {
    const queryParams: any = {};
    _.forIn(this.formInputData, (eachInputs: Array<any | object>, key) => {
      const formatedValue = typeof eachInputs === 'string' ? eachInputs :
        _.compact(_.map(eachInputs, value => typeof value === 'string' ? value : _.get(value, 'identifier')));
      if (formatedValue.length) {
        queryParams[key] = formatedValue;
      }
    });
    console.log('queryparan', queryParams);
    if (!_.isEmpty(queryParams)) {
      queryParams['appliedFilters'] = true;
      this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: queryParams });
    }
  }

  resetFilters() {
    this.queryParams = {};
    this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: this.queryParams });
    this.hardRefreshFilter();
  }

  private subscribeToQueryParams() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.formInputData = {};
      _.forIn(params, (value, key) => this.formInputData[key] = typeof value === 'string' && key !== 'key' ? [value] : value);
      console.log('this.formInputData', this.formInputData);
      this.showFilters = true;
      this.hardRefreshFilter();
    });
  }

  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          const rootOrgDetails = _.filter(this.userProfile.organisations, (org) => {
            return org.organisationId === this.userProfile.rootOrgId;
          });
          this.stateId = _.get(rootOrgDetails[0], 'locationIds[0]');
          this.subscribeToQueryParams();
          this.callAllApis();
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      });
  }

  callAllApis() {
    const userType = this.getUserType();
    const frameworkDetails = this.getFormatedFilterDetails();
    const district = this.getDistrict();
    const roles = this.getRoles();
    combineLatest(userType, district, roles, frameworkDetails)
      .subscribe(val => {
        console.log('Final response: ', val);
      });
  }

  getUserType() {
    return this.userSearchService.getUserType().pipe(map((res: any) => {
      this.allUserType['code'] = 'Usertype';
      this.allUserType['label'] = 'User Type';
      const userTypeArray = [];
      _.forEach(res.result.response, (type) => {
        userTypeArray.push({ code: type.name, name: type.name });
      });
      this.allUserType['range'] = userTypeArray;
      return 'User type API success';
    }), catchError(e => of('User type API error')));
  }

  private getFormatedFilterDetails() {
    this.frameworkService.initialize();
    return this.frameworkService.frameworkData$.pipe(map((res) => {
      const categoryMasterList = _.cloneDeep(res.frameworkdata['defaultFramework'].categories);
      // Preparing data for multi-select filter
      const medium: any = _.find(categoryMasterList, { code: 'medium' });
      medium['label'] = medium.name;
      medium['range'] = medium.terms;
      this.medium = medium;

      const gradeLevel: any = _.find(categoryMasterList, { code: 'gradeLevel' });
      gradeLevel['label'] = gradeLevel.name;
      gradeLevel['range'] = gradeLevel.terms;
      this.class = gradeLevel;

      const subject: any = _.find(categoryMasterList, { code: 'subject' });
      subject['label'] = subject.name;
      subject['range'] = subject.terms;
      this.subject = subject;
      return 'Framework API success';
    }), catchError(e => of('Framework API error')));
  }

  getDistrict() {
    if (this.stateId) {
      const requestData = { 'filters': { 'type': 'district', parentId: this.stateId } };
      return this.profileService.getUserLocation(requestData).pipe(map((res: any) => {
        this.allDistricts = res.result.response;
        // Get Blocks API call
        const districtIds = _.map(this.allDistricts, 'id');
        this.getBlock(districtIds);
        return 'District API success';
      }), catchError(e => of('District API error')));
    }
  }

  getBlock(districtIds) {
    if (!_.isEmpty(districtIds)) {
      const requestData = { 'filters': { 'type': 'block', parentId: districtIds } };
      this.profileService.getUserLocation(requestData).subscribe(res => {
        this.allBlocks = res.result.response;
        console.log('blocks', this.allBlocks);
        // Get school API call
        const blockIds = _.map(this.allBlocks, 'id');
        this.getSchool(blockIds);
      });
    }
  }

  getSchool(blockIds) {
    if (!_.isEmpty(blockIds)) {
      const requestData = { 'filters': { locationIds: blockIds } };
      this.orgDetailsService.fetchOrgs(requestData).subscribe(res => {
        this.allSchools = res.result.response.content;
        console.log('this.allSchools', this.allSchools);
      });
    }
  }

  getRoles() {
    return this.permissionService.permissionAvailable$.pipe(map((res) => {
      if (res === 'success') {
        this.allRoles = this.permissionService.allRoles;
      }
      this.allRoles = _.filter(this.allRoles, (role) => {
        return role.role !== 'ORG_ADMIN' && role.role !== 'SYSTEM_ADMINISTRATION' && role.role !== 'ADMIN';
      });
      _.remove(this.allRoles, { role: 'PUBLIC' });
      // Preparing data for multi-select filter
      this.allRoles['code'] = 'Roles';
      this.allRoles['label'] = 'Roles';
      const roleArray = [];
      _.forEach(this.allRoles, (role) => {
        roleArray.push({ code: role.role, name: role.roleName });
      });
      this.allRoles['range'] = roleArray;
      return 'Roles API success';
    }), catchError(e => of('Roles API error')));
  }

  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  selectedValue(event, code) {
    this.formInputData[code] = event;
  }

  onDistrictChange(districtId) {
    const districtObj = _.find(this.allDistricts, (district) => {
      return district.code === districtId;
    });
    this.getBlock([districtObj.id]);
  }

  onBlockChange(blockId) {
    const blockObj = _.find(this.allBlocks, (block) => {
      return block.code === blockId;
    });
    this.getSchool([blockObj.id]);
  }

  ngOnDestroy() {
    if (this.frameworkDataSubscription) {
      this.frameworkDataSubscription.unsubscribe();
    }
  }
}
