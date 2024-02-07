import { ResourceService, IUserData, ToasterService } from '@sunbird/shared';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, OrgDetailsService, RolesAndPermissions, PermissionService, FrameworkService, FormService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { map, catchError } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { UserSearchService } from './../../services';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html'
})

export class UserFilterComponent implements OnInit {
  valueField = 'code';
  queryParams: any;
  refresh = true;
  userProfile: any;
  stateId: string;
  allDistricts: any;
  allBlocks: any;
  allSchools: any;
  allRoles: Array<RolesAndPermissions>;
  allUserType: object = {};
  medium: object = {};
  class: object = {};
  subject: object = {};
  inputData: any = {};
  showFilters = false;
  selectedDistrict: string;
  selectedBlock: string;
  selectedSchool: string;
  submitInteractEdata: IInteractEventEdata;
  resetInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  districtIds: any;
  blockIds: any;
  userTypeList: any;
  frameworkCategoriesList;
  constructor(private cdr: ChangeDetectorRef, public resourceService: ResourceService,
    private router: Router, private activatedRoute: ActivatedRoute,
    public userService: UserService, public toasterService: ToasterService,
    public profileService: ProfileService, public orgDetailsService: OrgDetailsService,
    public permissionService: PermissionService, public frameworkService: FrameworkService,
    public userSearchService: UserSearchService,
    private formService: FormService, public cslFrameworkService: CslFrameworkService) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    this.frameworkCategoriesList = this.cslFrameworkService.getAllFwCatName();
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          const rootOrgDetails = _.filter(this.userProfile.organisations, (org) => {
            return org.organisationId === this.userProfile.rootOrgId;
          });
          this.stateId = _.get(rootOrgDetails[0], 'locationIds[0]');
          this.subscribeToQueryParams();
          this.combineAllApis();
          this.settelemetryData();
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      });
  }

  private subscribeToQueryParams() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
      this.inputData = {};
      if (_.get(params, 'Usertype')) {
        const index = _.indexOf(params.Usertype, 'administrator');
        if (index >= 0) {
          params.Usertype[index] = 'School head or officials';
        } else if (params.Usertype === 'administrator') {
          params.Usertype = ['School head or officials'];
        }
      }
      _.forIn(params, (value, key) => this.inputData[key] = typeof value === 'string' && key !== 'key' ? [value] : value);
      this.hardRefreshFilter();
    });
  }

  combineAllApis() {
    const userType = this.getUserType();
    const frameworkDetails = this.getFormatedFilterDetails();
    const district = this.getDistrict();
    const roles = this.getRoles();
    combineLatest(userType, district, roles, frameworkDetails)
      .subscribe(val => {
        this.showFilters = true;
      });
  }

  getUserType() {
    const formServiceInputParams = { formType: 'config', formAction: 'get', contentType: 'userType', component: 'portal' };
    return this.formService.getFormConfig(formServiceInputParams).pipe(map((res: any) => {
      this.allUserType['code'] = 'Usertype';
      this.allUserType['label'] = this.resourceService.frmelmnts.lbl.userType;
      const userTypeArray = [];
      _.forEach(_.filter(res, 'visibility'), (type) => {
        userTypeArray.push({ code: type.code, name: type.name });
      });
      this.allUserType['range'] = this.sortAndCapitaliseFilters(userTypeArray);
      return 'User type API success';
    }), catchError(e => of('User type API error')));
  }

  private getFormatedFilterDetails() {
    this.frameworkService.initialize();
    return this.frameworkService.frameworkData$.pipe(map((res) => {
      const categoryMasterList = _.cloneDeep(res.frameworkdata['defaultFramework'].categories);
      // Preparing data for multi-select filter
      const medium: any = _.find(categoryMasterList, { code: this.frameworkCategoriesList[1] });
      medium['label'] = medium.name;
      medium['range'] = this.sortFilters(medium.terms);
      this.medium = medium;

      const gradeLevel: any = _.find(categoryMasterList, { code: this.frameworkCategoriesList[2] });
      gradeLevel['label'] = gradeLevel.name;
      gradeLevel['range'] = this.sortFilters(gradeLevel.terms);
      this.class = gradeLevel;

      const subject: any = _.find(categoryMasterList, { code: this.frameworkCategoriesList[3] });
      subject['label'] = subject.name;
      subject['range'] = this.sortFilters(subject.terms);
      this.subject = subject;
      return 'Framework API success';
    }), catchError(e => of('Framework API error')));
  }

  getDistrict() {
    if (this.stateId) {
      const requestData = { 'filters': { 'type': 'district', parentId: this.stateId } };
      return this.profileService.getUserLocation(requestData).pipe(map((res: any) => {
        this.allDistricts = this.sortAndCapitaliseFilters(res.result.response);
        // Get Blocks API call
        this.districtIds = _.map(this.allDistricts, 'id');
        this.selectedDistrict = this.queryParams.District;
        this.getBlock(this.districtIds);
        return 'District API success';
      }), catchError(e => of('District API error')));
    }
  }

  getBlock(districtIds) {
    if (!_.isEmpty(districtIds)) {
      const requestData = { 'filters': { 'type': 'block', parentId: districtIds } };
      this.profileService.getUserLocation(requestData).subscribe(res => {
        this.allBlocks = this.sortAndCapitaliseFilters(res.result.response);
        this.selectedBlock = this.queryParams.Block;
        // this.hardRefreshFilter();
        // Get school API call
        this.blockIds = _.map(this.allBlocks, 'id');
        this.getSchool(this.blockIds);
      });
    }
  }

  getSchool(blockIds) {
    if (!_.isEmpty(blockIds)) {
      const requestData = { 'filters': { locationIds: blockIds } };
      this.orgDetailsService.fetchOrgs(requestData).subscribe(res => {
        this.allSchools = _.sortBy(res.result.response.content, [(sort) => {
          return sort.orgName = _.capitalize(sort.orgName); }]);
        this.selectedSchool = this.queryParams.School;
        // this.hardRefreshFilter();
      });
    }
  }

  getRoles() {
    return this.permissionService.availableRoles$.pipe(map((res) => {
      this.allRoles = this.permissionService.allRoles;
      this.allRoles = _.filter(this.allRoles, (role) => {
        return role.role !== 'ORG_ADMIN' && role.role !== 'SYSTEM_ADMINISTRATION' && role.role !== 'ADMIN';
      });
      _.remove(this.allRoles, { role: 'PUBLIC' });
      // Preparing data for multi-select filter
      this.allRoles['code'] = 'Roles';
      this.allRoles['label'] = this.resourceService.frmelmnts.lbl.role;
      let roleArray = [];
      _.forEach(this.allRoles, (role) => {
        roleArray.push({ code: role.role, name: role.roleName });
      });
      roleArray = this.sortFilters(roleArray);
      this.allRoles['range'] = roleArray;
      return 'Roles API success';
    }), catchError(e => of('Roles API error')));
  }

  applyFilters() {
    const queryParams: any = {};
    _.forIn(this.inputData, (eachInputs: Array<any | object>, key) => {
      const formatedValue = typeof eachInputs === 'string' ? eachInputs :
        _.compact(_.map(eachInputs, value => typeof value === 'string' ? value : _.get(value, 'identifier')));
      if (formatedValue.length) {
        queryParams[key] = formatedValue;
      }
    });
    if (!_.isEmpty(queryParams)) {
      queryParams['appliedFilters'] = true;
      this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: queryParams });
    }
  }

  resetFilters() {
    this.inputData = {};
    this.queryParams = {};
    this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: this.queryParams });
    this.selectedDistrict = '';
    this.selectedBlock = '';
    this.selectedSchool = '';
    this.getBlock(this.districtIds);
    this.hardRefreshFilter();
  }

  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  selectedValue(event, code) {
    this.inputData[code] = event;
    this.settelemetryData();
  }

  onDistrictChange(districtId) {
    this.selectedValue([districtId], 'District');
    this.selectedValue('', 'Block');
    this.selectedValue('', 'School');
    this.getBlock([districtId]);
  }

  onBlockChange(blockId) {
    this.selectedValue([blockId], 'Block');
    this.selectedValue('', 'School');
    this.getSchool([blockId]);
  }

  onSchoolChange(schoolId) {
    this.selectedValue([schoolId], 'School');
  }

  sortFilters (object) {
    return _.sortBy(object, [(sort) => {
      return sort.name; }]);
  }

  sortAndCapitaliseFilters (object) {
    return _.sortBy(object, [(sort) => {
      return sort.name = _.capitalize(sort.name); }]);
  }

  settelemetryData() {
    setTimeout(() => { // wait for model to change
      const filters = _.pickBy(this.inputData, (val, key) =>
        (!_.isEmpty(val)));
      this.submitInteractEdata = {
        id: 'submit-user-filter',
        type: 'click',
        pageid: 'user-search',
        extra: { filters: filters }
      };
    }, 5);

    this.resetInteractEdata = {
      id: 'reset-user-filter',
      type: 'click',
      pageid: 'user-search'
    };

    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
    };
  }

  districtSelected(e) {
    this.onDistrictChange(_.get(e, 'value.id'));
  }

  blockSelected(e) {
    this.onBlockChange(_.get(e, 'value.id'));
  }

  schoolSelected(e) {
    this.onSchoolChange(_.get(e, 'value.identifier'));
  }

  selectedMultiValues(roleSelected, code) {
    this.selectedValue(_.get(roleSelected, 'value'), code);
  }

  getSortedList(arr, objKey) {
    try {
      return arr.sort((a, b) => a[objKey].localeCompare(b[objKey], 'en', { numeric: true }))
    } catch (error) {
      return arr;
    }
  }
}
