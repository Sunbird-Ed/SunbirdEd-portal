
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// Modules
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { SharedModule, ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
// Services
import {
  OrganisationService, DashboardUtilsService, RendererService,
  LineChartService, DownloadService
} from './../../services';
import { OrganisationComponent } from './organization.component';
import { UserService, SearchService, ContentService, LearnerService } from '@sunbird/core';
// Test data
import * as mockData from './organization.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';

const testData = mockData.mockRes;
describe('OrganisationComponent', () => {
  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;

  const fakeActivatedRoute = {
    'params': observableOf({ 'id': 1, 'timePeriod': '7d' }),
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'org-admin-dashboard', type: 'view',
          object: { type: 'profile', ver: '1.0' }
        }
      }
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const creationDataset = 'creation';
  const consumptionDataset = 'consumption';
  const dashboardBaseUrl = 'orgDashboard/organization';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganisationComponent],
      imports: [HttpClientModule, FormsModule, SuiModule, ChartsModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      providers: [LearnerService,
        LineChartService,
        OrganisationService,
        SearchService,
        DashboardUtilsService,
        RendererService,
        ContentService,
        UserService,
        DownloadService,
        ConfigService,
        ToasterService,
        ResourceService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // If user is a member of more than one organization
  it('should call search api to get details of more than 1 org', inject([OrganisationService, SearchService, UserService],
    (organisationService, searchService, userService) => {
      spyOn(searchService, 'getOrganisationDetails').and.callFake(() => observableOf(testData.orgsDetailsSuccess));
      component.getOrgDetails(['01229679766115942443', '0123150108807004166']);
      expect(component.showLoader).toBe(false);
      expect(component.myOrganizations.length).not.toBeUndefined();
      expect(component.myOrganizations.length).toBeGreaterThanOrEqual(2);
    }));

  // If user is member of only one organization
  it('should call search api to get details of only org details', inject([OrganisationService, SearchService, UserService],
    (organisationService, searchService, userService) => {
      spyOn(searchService, 'getOrganisationDetails').and.callFake(() => observableOf(testData.orgDetailsSuccess));
      component.getOrgDetails(['01229679766115942443']);
      expect(component.myOrganizations.length).not.toBeUndefined();
      expect(component.myOrganizations.length).toEqual(1);
    }));
    it('should call validateIdentifier method when  org details 1 ', inject([SearchService], (searchService) => {
    spyOn(searchService, 'getOrganisationDetails').and.callFake(() => observableOf(testData.orgDetailsSuccess));
    spyOn(component, 'validateIdentifier').and.callThrough();
    component.getOrgDetails(['01229679766115942443']);
    component.validateIdentifier(testData.orgDetailsSuccess.result.response.content[0].identifier);
    fixture.detectChanges();
    expect(component.SelectedOrg).toBe(testData.orgDetailsSuccess.result.response.content[0].orgName);
    expect(component.myOrganizations).toBeDefined();
    expect(component.myOrganizations.length).toBeGreaterThanOrEqual(1);
  }));
  // When search api throws error
  it('should throw error while getting org details', inject([OrganisationService, SearchService, UserService],
    (organisationService, searchService, userService) => {
      spyOn(searchService, 'getOrganisationDetails').and.callFake(() => observableThrowError({}));
      component.getOrgDetails(['01229679766115942443']);
      expect(component.showLoader).toBe(false);
      expect(component.myOrganizations.length).toEqual(0);
    }));

  // When Org creation APIs return success response
  it('should call creation api', inject([OrganisationService, SearchService],
    (organisationService, searchService) => {
      spyOn(organisationService, 'getDashboardData').and.callFake(() => observableOf(testData.dashboardSuccessData));
      component.getDashboardData('7d', 'do_2123250076616048641482');
      fixture.detectChanges();
      expect(component.showDashboard).toBe(true);
      expect(component.graphData.length).not.toBeUndefined();
      expect(component.blockData.length).toBeGreaterThanOrEqual(3);
      expect(component.graphData.length).toBeGreaterThanOrEqual(1);
    }));

  // When Org creation APIs throw's error
  it('should throw error - while getting org creation data', inject([OrganisationService], (organisationService) => {
    component.blockData = [];
    spyOn(organisationService, 'getDashboardData').and.callFake(() => observableThrowError({}));
    spyOn(component, 'setError').and.callThrough();
    component.getDashboardData('7d', 'do_2123250076616048641482');
    fixture.detectChanges();
    expect(component.setError).toHaveBeenCalledWith(true);
    expect(component.showLoader).toBe(false);
    expect(component.blockData.length).toBe(0);
  }));

  it('should validate url identifier and load dashboard data', inject([Router], (router) => {
    component.myOrganizations = [{ identifier: 'do_123', name: 'Test 1' }];
    component.validateIdentifier('do_123');
    fixture.detectChanges();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should throw invalidate identifier error and redirect to other page', inject([Router], (router) => {
    component.myOrganizations = [{ identifier: 'do_1231', name: 'Test 1' }];
    component.validateIdentifier('do_123');
    fixture.detectChanges();
    expect(component.SelectedOrg).not.toEqual('Test 1');
    expect(router.navigate).toHaveBeenCalledWith(['groups']);
  }));

  it('should display selected org dashboard', inject([Router], (router) => {
    const selectedOrgId = 'do_2124319530479697921602';
    component.datasetType = creationDataset;
    component.identifier = 'do_21243195304796979216021'; // Previously selected org
    const response = component.onAfterOrgChange(selectedOrgId, 'Org 1');
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier === selectedOrgId).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, 'creation', selectedOrgId, '7d']);
  }));

  it('should call onAfterCourseChange function - but should not load graph', inject([Router], (router) => {
    // Previously selected org
    component.identifier = 'do_2124319530479697921602';
    // Selected org.
    const selectedOrgId = 'do_2124319530479697921602';
    // If both org are same then it should not load data again
    const response = component.onAfterOrgChange('do_2124319530479697921602', 'Test 1');
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier === selectedOrgId).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should display selected timePeriod data', inject([Router], (router) => {
    component.datasetType = 'creation';
    component.identifier = 'do_1234';
    component.timePeriod = '7d'; // Previous timePeriod
    const selectedTimePeriod = '14'; // Selected timePeriod
    const response = component.onAfterFilterChange(selectedTimePeriod);
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.timePeriod === selectedTimePeriod).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, component.datasetType, component.identifier, selectedTimePeriod]);
  }));

  it('should display selected timePeriod data', inject([Router], (router) => {
    component.timePeriod = '7d'; // Previous timePeriod
    const selectedTimePeriod = '7d'; // Selected timePeriod
    const response = component.onAfterFilterChange(selectedTimePeriod);
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.timePeriod === selectedTimePeriod).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should not change dataset type', inject([Router], (router) => {
    component.datasetType = consumptionDataset;
    const response = component.onAfterDatasetChange(consumptionDataset);
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.datasetType === consumptionDataset).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should not change dataset type', inject([Router], (router) => {
    component.datasetType = consumptionDataset;
    component.identifier = 'do_123';
    const response = component.onAfterDatasetChange(creationDataset);
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.datasetType === creationDataset).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, creationDataset, component.identifier, '7d']);
  }));

  it('should display next graph', () => {
    component.showGraph = 0;
    component.graphNavigation('next');
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1);
  });

  it('should download dashboard report', inject([DownloadService], (downloadService) => {
    component.datasetType = 'creation';
    component.identifier = 'do_123';
    component.timePeriod = '7d';
    spyOn(downloadService, 'getReport').and.callFake(() => observableOf(testData.dashboardSuccessData));
    component.downloadReport();
    fixture.detectChanges();
    expect(component.showDownloadSuccessModal).toEqual(true);
    expect(component.disabledClass).toEqual(false);
  }));

  it('should not download dashboard report', inject([DownloadService], (downloadService) => {
    component.datasetType = 'creation';
    component.identifier = 'do_123';
    component.timePeriod = '7d';
    spyOn(downloadService, 'getReport').and.callFake(() => observableThrowError({}));
    component.downloadReport();
    fixture.detectChanges();
    expect(component.disabledClass).toEqual(false);
  }));

  xit('should open dashboard directly if only 1 organisation exist', inject([Router, SearchService, UserService],
    (router, searchService, userService) => {
      userService._userProfile = { 'organisationIds': ['01229679766115942443'] };
      searchService._searchedOrganisationList = testData.orgDetailsSuccess.result.response;
      component.datasetType = creationDataset;
      component.timePeriod = '7d';
      component.myOrganizations = testData.orgDetailsSuccess.result.response.content;
      component.identifier = component.myOrganizations[0];
      component.getMyOrganisations();
      expect(router.navigate).toHaveBeenCalledWith([dashboardBaseUrl, component.datasetType, component.identifier, '7d']);
      expect(component.showLoader).toBe(false);
    }));
  it('should unsubscribe to userData observable', () => {
    spyOn(component.userDataSubscription, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.userDataSubscription.unsubscribe).toHaveBeenCalled();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.getDashboardData('7d', 'do_2123250076616048641482');
    component.downloadReport();
    component.getOrgDetails(['01229679766115942443', '0123150108807004166']);
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
});
