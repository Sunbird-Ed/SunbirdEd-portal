import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { UserSearchService } from './../../services';
import * as _ from 'lodash';
import { SearchService, UserService, PermissionService, RolesAndPermissions } from '@sunbird/core';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

/**
 * The delete component deletes the announcement
 * which is requested by the logged in user have announcement
 * creator access
 */
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  /**
	 * Contains unique announcement id
	 */
  userId: string;

  allRoles: Array<RolesAndPermissions>;

  selectedOrgName: string;
  selectedOrgId: string;
  selectedOrgUserRoles: Array<string>;
  selectedOrgUserRolesNew: any = [];

  /**
	 * Contains announcement details returned from API or object called from
   * announcement service
	 */
  userDetails: any;

  /**
   * To make get announcement by id
   */
  private searchService: SearchService;
  private userSearchService: UserSearchService;

  /**
   * To send activatedRoute.snapshot to routerNavigationService
   */
  public activatedRoute: ActivatedRoute;

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  private permissionService: PermissionService;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  organizationIntractEdata: IInteractEventEdata;
  roleIntractEdata: IInteractEventEdata;
  updateIntractEdata: IInteractEventEdata;
  /**
   * To navigate back to parent component
   */
  public routerNavigationService: RouterNavigationService;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DeleteComponent class
	 *
   * @param {UserSearchService} userSearchService Reference of UserSearchService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
	 */
  constructor(userSearchService: UserSearchService, searchService: SearchService,
    activatedRoute: ActivatedRoute, permissionService: PermissionService,
    resourceService: ResourceService, public route: Router,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService) {
    this.userSearchService = userSearchService;
    this.searchService = searchService;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.permissionService = permissionService;
    this.routerNavigationService = routerNavigationService;
  }

  /**
   * This method helps to redirect to the parent component
   * page, i.e, outbox listing page with proper page number
	 *
	 */
  redirect(): void {
    this.route.navigate(['../../'], { relativeTo: this.activatedRoute });
  }

  populateOrgName() {
    // Getting Org Ids
    const orgArray = [];
    _.each(this.userDetails.organisations, (orgKey) => {
      orgArray.push(orgKey.organisationId);
    });

    // Calling Org search API
    this.searchService.getOrganisationDetails({ orgid: orgArray }).subscribe(
      (orgApiResponse: any) => {
        // Setting Org Name
        _.each(this.userDetails.organisations, (org) => {
          const orgNameAndId = _.find(orgApiResponse.result.response.content, (organisation) => {
            return organisation.id === org.organisationId;
          });
          if (orgNameAndId) { org.orgName = orgNameAndId.orgName; }
        });
      }
    );
  }

  populateUserDetails() {
    if (this.userSearchService.userDetailsObject === undefined ||
      this.userSearchService.userDetailsObject.id !== this.userId) {
      const option = { userId: this.userId };
      this.userSearchService.getUserById(option).subscribe(
        (apiResponse: ServerResponse) => {
          this.userDetails = apiResponse.result.response;
          this.populateOrgName();
          this.selectedOrgId = this.userDetails.organisations[0].organisationId;
          this.selectedOrgUserRoles = this.userDetails.organisations[0].roles;
        },
        err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
          this.redirect();
        }
      );
    } else {
      this.userDetails = this.userSearchService.userDetailsObject;
      this.selectedOrgId = this.userDetails.organisations[0].organisationId;
      this.selectedOrgUserRoles = this.userDetails.organisations[0].roles;
    }
  }

  editRoles(role, userRoles, event) {
    if (userRoles.includes(role) === true) {
      this.selectedOrgUserRoles = this.selectedOrgUserRoles.filter((selectedRole) => {
        return selectedRole !== role;
      });
    } else {
      if (event.target.checked === true) {
        this.selectedOrgUserRolesNew.push(role);
      } else {
        this.selectedOrgUserRolesNew.splice(this.selectedOrgUserRolesNew.indexOf(role));
      }
    }
  }

  updateRoles(roles) {
    if (this.selectedOrgUserRolesNew) {
      this.selectedOrgUserRolesNew.forEach((Newroles) => {
        roles.push(Newroles);
      });
      const mainRole = [];
      const mainRolesCollections = _.clone(this.allRoles);
      _.forEach(mainRolesCollections, (value, key) => {
        mainRole.push(value.role);
      });
      const option = { userId: this.userId, orgId: this.selectedOrgId, roles: roles };
      this.userSearchService.updateRoles(option).subscribe(
        (apiResponse: ServerResponse) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0028);
          this.redirect();
        },
        err => {
          this.selectedOrgUserRoles = _.difference(this.selectedOrgUserRoles, this.selectedOrgUserRolesNew);
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
          this.redirect();
        }
      );
    }
  }

  /**
   * This method sets the annmouncementId and pagenumber from
   * activated route
	 */
  ngOnInit() {
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
    this.organizationIntractEdata = {
      id: 'organization-dropdown',
      type: 'click',
      pageid: 'user-edit'
    };
    this.roleIntractEdata = {
      id: 'role-checkbox',
      type: 'click',
      pageid: 'user-edit'
    };
    this.updateIntractEdata = {
      id: 'user-update',
      type: 'click',
      pageid: 'user-edit'
    };
  }
  ngOnDestroy() {
    this.modal.deny();
  }
}
