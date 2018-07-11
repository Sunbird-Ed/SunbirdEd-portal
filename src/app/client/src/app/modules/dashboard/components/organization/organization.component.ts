
import {takeUntil, first} from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Subscription ,  Subject } from 'rxjs';
import { RendererService, OrganisationService, DownloadService } from './../../services';
import { UserService, SearchService } from '@sunbird/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { DashboardData } from './../../interfaces';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash';

/**
 * The organization component
 *
 * Display organization creation, consumption dashboard data
 */
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})

/**
 * @class OrganisationComponent
 */
export class OrganisationComponent implements OnDestroy {
  /**
   * Variable to gather and unsubscribe all observable subscriptions in this component.
   */
  public unsubscribe = new Subject<void>();

  interactObject: any;
  /**
   * Contains time period - last 7days, 14days, and 5weeks
   */
  timePeriod = '7d';

  /**
   * Contains selected course identifier
   *
   * Identifier is needed to construct dashboard api url
   */
  identifier = '';

  /**
   * Dataset type
   */
  datasetType = 'creation';
  userDataSubscription: Subscription;
  /**
   * Contains course consumption line chart data
   */
  graphData: any;

  /**
   * Contains dashboard block data
   */
  blockData: string[];

  /**
   * Contains Graph index to switch between two graphs
   */
  showGraph = 1;

  /**
   * Organization list
   */
  myOrganizations: Array<any> = [];

  /**
   * Selected organization
   */
  SelectedOrg: string;

  /**
   * To display graph legend
   */
  lineChartLegend = true;

  /**
   * Chart type
   */
  chartType = 'line';

  /**
   * To show / hide loader
   */
  showLoader = true;

  /**
   * To show dashboard canvas
   */
  showDashboard = false;

  /**
   * To show / hide organization dropdwon
   */
  isMultipleOrgs = false;

  /**
   * Disabled class
   */
  disabledClass = false;

  /**
   * To show download successful confirmation modal
   */
  showDownloadSuccessModal = false;

  /**
   * Download report service
   */
  public downloadService: DownloadService;

  /**
   * Router to change url
   */
  public route: Router;

  /**
   * To get params from url
   */
  public activatedRoute: ActivatedRoute;

  /**
   * To get logged-in user published course(s)
   */
  searchService: SearchService;

  /**
   * Chart renderer to call chart service like Line chart service
   *
   * Currently it supports only line and bar chart
   */
  rendererService: RendererService;

  /**
   * To get language constant
   */
  resourceService: ResourceService;

  /**
   * To get org dashboard data by making api call
   */
  orgService: OrganisationService;

  /**
   * To get logged-in user profile
   */
  userService: UserService;

  /**
	 * telemetryImpression object for org admin dashboard page
	*/
  telemetryImpression: IImpressionEventInput;
  subscription: Subscription;

  /**
   * Default method of OrganisationService class
   *
   * @param {DownloadService} downloadService To make download report api call
   * @param {Router} route Url navigation
   * @param {ActivatedRoute} activatedRoute To get params from url
   * @param {UserService} userService To get logged-in user profile
   * @param {SearchService} searchService To get organization details
   * @param {RendererService} rendererService To get chart service
   * @param {OrganisationService} orgService To get dashboard data
   * @param {ResourceService} resourceService To get language constant
   */
  constructor(downloadService: DownloadService, route: Router, activatedRoute: ActivatedRoute, userService: UserService,
    searchService: SearchService, rendererService: RendererService, orgService: OrganisationService, resourceService: ResourceService,
    public toasterService: ToasterService) {
    this.downloadService = downloadService;
    this.activatedRoute = activatedRoute;
    this.searchService = searchService;
    this.rendererService = rendererService;
    this.resourceService = resourceService;
    this.orgService = orgService;
    this.userService = userService;
    this.route = route;
    this.initTelemetryImpressionEvent();
    this.activatedRoute.params.subscribe(params => {
      if (params.id && params.timePeriod) {
        this.datasetType = params.datasetType;
        this.showDashboard = false;
        // update the impression event after an org is selected
        this.telemetryImpression.edata.uri = '/orgDashboard/organization/' + params.datasetType
          + '/' + params.id + '/' + params.timePeriod;
        this.telemetryImpression.object = {
          id: params.id,
          type: 'org',
          ver: '1.0'
        };
        this.interactObject = { id: params.id, type: 'organization', ver: '1.0' };
        this.getDashboardData(params.timePeriod, params.id);
      }
    });
    this.getMyOrganisations();
  }

  /**
   * Function to initialise the telemetry impression event for org admin dashboard page
   */
  initTelemetryImpressionEvent() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: '/orgDashboard'
      }
    };
  }

  /**
   * Function to get dashboard data for given time period and organization identifier
   *
   * @param {string} timePeriod timePeriod: last 7d/14d/5w
   * @param {string} identifier organization unique identifier
   *
   * @example getDashboardData(7d, do_xxxxx)
   */
  getDashboardData(timePeriod: string, identifier: string) {
    this.showLoader = true;
    this.isMultipleOrgs = false;
    this.timePeriod = timePeriod;
    this.identifier = identifier;

    const params = {
      data: {
        identifier: this.identifier,
        timePeriod: this.timePeriod
      },
      dataset: this.datasetType === 'creation' ? 'ORG_CREATION' : 'ORG_CONSUMPTION'
    };

    this.orgService.getDashboardData(params).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (data: DashboardData) => {
        this.blockData = data.numericData;
        this.graphData = this.rendererService.visualizer(data, this.chartType);
        this.showDashboard = true;
        this.setError(false);
      },
      err => {
        this.setError(true);
        this.toasterService.error(`Root org doesn't exist for this Organization Id and channel`);
      }
    );
  }

  /**
   * This function is used to validate given organization identifier.
   *
   * User gets redirect to home page if url contains invalid identifier or
   * valid identifier but logged-in user is not a member of given identifier
   *
   * @param {string} identifier organization unique identifier
   *
   * @example validateIdentifier(do_xxxxx)
   */
  validateIdentifier(identifier: string | '') {
    if (identifier) {
      const selectedOrg = _.find(this.myOrganizations, ['identifier', identifier]);
      if (selectedOrg && selectedOrg.identifier) {
        this.SelectedOrg = selectedOrg.orgName;
      } else {
        // TODO: Need to redirect to home page
        this.route.navigate(['groups']);
      }
    }
  }

  /**
   * Change time period filter.
   *
   * As of now dashboard supports only to show last 7 days, 14 days, and 5 weeks data.
   *
   * @param {string} timePeriod timePeriod: last 7d / 14d / 5w
   *
   * @example onAfterFilterChange(7d)
   */
  onAfterFilterChange(timePeriod: string) {
    if (this.timePeriod === timePeriod) {
      return false;
    }

    this.route.navigate(['orgDashboard/organization', this.datasetType, this.identifier, timePeriod]);
  }

  /**
   * To change dashboard type
   *
   * @param {string} datasetType creation and consumption
   *
   * @example onAfterDatasetChange(creation)
   */
  onAfterDatasetChange(datasetType: string) {
    if (this.datasetType === datasetType) {
      return false;
    }
    this.showGraph = datasetType === 'creation' ? 1 : 0;
    this.route.navigate(['orgDashboard/organization', datasetType, this.identifier, this.timePeriod]);
  }

  /**
   * To change graph - from Number of user per day to Time spent by day and vice versa
   *
   * @param {string} step next / previous
   *
   * @example graphNavigation(next)
   */
  graphNavigation(step: string) {
    step === 'next' ? this.showGraph++ : this.showGraph--;
  }

  /**
   * To change organization selection
   *
   * @param {string} identifier organization identifier
   * @param {string} orgName    organization name
   *
   * @example onAfterOrgChange(identifier: do_xxxxx, Test Organization)
   */
  onAfterOrgChange(identifier: string, orgName: string) {
    if (this.identifier === identifier) {
      return false;
    }

    this.route.navigate(['orgDashboard/organization', this.datasetType, identifier, this.timePeriod]);
  }

  /**
   * To set error
   *
   * @param {boolean} flag show error
   *
   * @example setError(true)
   */
  setError(flag: boolean) {
    this.showLoader = false;
  }

  /**
   * Get logged user organization ids list
   */
  getMyOrganisations(): void {
    const data = this.searchService.searchedOrganisationList;
    if (data && data.content && data.content.length) {
      this.myOrganizations = data.content;
      if (this.myOrganizations.length === 1) {
        this.identifier = this.myOrganizations[0].identifier;
        this.route.navigate(['orgDashboard/organization', this.datasetType, this.identifier, this.timePeriod]);
      }
      this.isMultipleOrgs = this.userService.userProfile.organisationIds.length > 1 ? true : false;
      this.showLoader = false;
      this.validateIdentifier(this.identifier);
    } else {
      this.userDataSubscription = this.userService.userData$.pipe(first()).subscribe(
        user => {
          if (user && user.userProfile.organisationIds && user.userProfile.organisationIds.length) {
            this.getOrgDetails(user.userProfile.organisationIds);
          } else {
            // this.route.navigate(['groups']);
          }
        },
        err => {
          this.setError(true);
        }
      );
    }
  }

  /**
   * Download dashboard report
   */
  downloadReport() {
    this.disabledClass = true;
    const option = {
      data: { identifier: this.identifier, timePeriod: this.timePeriod },
      dataset: this.datasetType === 'creation' ? 'ORG_CREATION' : 'ORG_CONSUMPTION'
    };

    this.downloadService.getReport(option).pipe(
    takeUntil(this.unsubscribe))
    .subscribe(
      (data: ServerResponse) => {
        this.showDownloadSuccessModal = true;
        this.disabledClass = false;
      },
      err => {
        this.disabledClass = false;
      }
    );
  }

  /**
   * To get organization details.
   *
   * @param {string[]} orgIds org id list
   *
   * @example getOrgDetails([do_xxxxx])
   */
  getOrgDetails(orgIds: string[]) {
    if (orgIds && orgIds.length) {
      this.searchService.getOrganisationDetails({ orgid: orgIds }).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (data: ServerResponse) => {
          if (data.result.response.content) {
            this.myOrganizations = data.result.response.content;
            this.isMultipleOrgs = orgIds.length > 1 ? true : false;
            if (this.myOrganizations.length === 1) {
              this.identifier = this.myOrganizations[0].identifier;
              this.route.navigate(['orgDashboard/organization', this.datasetType, this.identifier, this.timePeriod]);
            }
          }

          if (this.identifier) {
            this.isMultipleOrgs = false;
            this.validateIdentifier(this.identifier);
          }
          this.showLoader = false;
        },
        (err: ServerResponse) => {
          this.setError(true);
        }
      );
    }
  }
  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
