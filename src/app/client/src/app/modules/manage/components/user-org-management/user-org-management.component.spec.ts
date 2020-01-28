import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserUploadComponent } from '../user-upload/user-upload.component';
import { UserService } from '../../../core/services/user/user.service';
import { ManageService } from '../../services/manage/manage.service';
import { SuiModule } from 'ng2-semantic-ui';
import { ActivatedRoute } from '@angular/router';
import { ResourceService, SharedModule, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserOrgManagementComponent } from './user-org-management.component';
import { throwError as observableThrowError, of as observableOf, of } from 'rxjs';
import { mockManageData } from './user-org-management.mock.spec';

const fakeActivatedRoute = {
  snapshot: {
    data: {
      telemetry: {
        env: 'admin-dashboard', pageid: 'admin-manage-page', type: 'view'
      }
    },
    routeConfig: {
      path: 'manage'
    }
  }
};

const resourceMockData = {
  frmelmnts: {
    btn: {
      viewdetails: 'View Details',
      viewless: 'View less'
    },
    lbl: {
      admindshheader: {
        index: 'Serial No.',
        districts: 'Districts',
        blocks: 'Blocks',
        schools: 'Schools',
        teachers: 'Regd. Teachers'
      }
    }
  }
};

describe('UserOrgManagementComponent', () => {

  let component: UserOrgManagementComponent;
  let fixture: ComponentFixture<UserOrgManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule.forRoot(),
        TelemetryModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        SuiModule
      ],
      declarations: [
        UserOrgManagementComponent,
        UserUploadComponent
      ],
      providers: [
        UserService,
        ManageService,
        ToasterService,
        NavigationHelperService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceMockData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrgManagementComponent);
    component = fixture.componentInstance;
    component.slug = 'sunbird';
    fixture.detectChanges();
  });

  it('should create User-Org-Management component', () => {
    expect(component).toBeTruthy();
  });

  it('value of variable geoJSON should be geo-summary.json', () => {
    const geoJSON = component.geoJSON;
    expect(geoJSON).toEqual('geo-summary.json');
  });

  it('value of variable geoCSV should be geo-detail.csv', () => {
    const geoCSV = component.geoCSV;
    expect(geoCSV).toEqual('geo-detail.csv');
  });

  it('value of variable geoDetail should be geo-summary-district.json', () => {
    const geoDetail = component.geoDetail;
    expect(geoDetail).toEqual('geo-summary-district.json');
  });

  it('value of variable userJSON should be user-summary.json', () => {
    const userJSON = component.userJSON;
    expect(userJSON).toEqual('user-summary.json');
  });

  it('value of variable userCSV should be user-detail.csv', () => {
    const userCSV = component.userCSV;
    expect(userCSV).toEqual('user-detail.csv');
  });

  it('value of variable userSummary should be validated-user-summary.json', () => {
    const userSummary = component.userSummary;
    expect(userSummary).toEqual('validated-user-summary.json');
  });

  it('value of variable userDetail should be validated-user-summary-district.json', () => {
    const userDetail = component.userDetail;
    expect(userDetail).toEqual('validated-user-summary-district.json');
  });

  it('value of variable userZip should be validated-user-detail.zip', () => {
    const userZip = component.userZip;
    expect(userZip).toEqual('validated-user-detail.zip');
  });

  it('value of variable GeoTableId should be GeoDetailsTable', () => {
    const GeoTableId = component.GeoTableId;
    expect(GeoTableId).toEqual('GeoDetailsTable');
  });

  it('value of variable userTableId should be ValidatedUserDetailsTable', () => {
    const userTableId = component.userTableId;
    expect(userTableId).toEqual('ValidatedUserDetailsTable');
  });

  it('should fetch user json', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({ result: mockManageData.userSummary }));
    component.slug = 'sunbird';
    component.userJSON = 'user.json';
    component.getUserJSON();
    expect(component.uploadedDetails).toBeDefined();
  });

  it('should fetch geo json', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({ result: mockManageData.userSummary }));
    component.slug = 'sunbird';
    component.userJSON = 'user.json';
    component.getGeoJSON();
    expect(component.geoData).toBeDefined();
  });

  it('should fetch user summary', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({ result: mockManageData.userSummary }));
    component.slug = 'sunbird';
    component.userJSON = 'user.json';
    component.getUserSummary();
    expect(component.validatedUser).toBeDefined();
  });

  it('should fetch geo summary', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({ result: mockManageData.userSummary }));
    component.slug = 'sunbird';
    component.userJSON = 'user.json';
    component.getGeoDetail();
    expect(component.geoSummary).toBeDefined();
  });

  it('should download csv file', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({
      result: {
        signedUrl: 'a'
      }
    }));
    spyOn(window, 'open');
    component.slug = 'sunbird';
    component.userJSON = 'user.json';
    component.downloadZipFile('user.json');
    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('a', '_blank');
  });

});
