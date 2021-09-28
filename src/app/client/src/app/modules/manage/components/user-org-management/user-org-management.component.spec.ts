import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../core/services/user/user.service';
import { ManageService } from '../../services/manage/manage.service';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { ActivatedRoute } from '@angular/router';
import { ResourceService, SharedModule, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserOrgManagementComponent } from './user-org-management.component';
import { throwError as observableThrowError, of as observableOf, of } from 'rxjs';
import { mockManageData } from './user-org-management.mock.spec';
import { CoreModule, TncService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';
import { mockRes } from './user-org-management.mock.spec';


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
      viewless: 'View less',
      selectCsvFile: 'Select CSV'
    },
    lbl: {
      admindshheader: {
        index: 'Serial No.',
        districts: 'Districts',
        blocks: 'Blocks',
        schools: 'Schools',
        teachers: 'Regd. Teachers'
      },
      fileUploadSuccessMessage: 'file upload success',
      uploadFileError: 'uploda file error'
    },

  }
};
const event = {
  target: {
    files: [{
      name: 'test.csv',
      lastModified: 1593411651030,
      lastModifiedDate: new Date(),
      size: 4343,
      type: 'text/csv'
    }]
  }
};
const eventText = {
  target: {
    files: [{
      name: 'test.txt',
      lastModified: 1593411651030,
      lastModifiedDate: new Date(),
      size: 4343,
      type: 'text/csv'
    }]
  }
};

describe('UserOrgManagementComponent', () => {

  let component: UserOrgManagementComponent;
  let fixture: ComponentFixture<UserOrgManagementComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule.forRoot(),
        TelemetryModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        SuiModule, CoreModule
      ],
      declarations: [
        UserOrgManagementComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        UserService,
        TncService,
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
    expect(geoJSON).toEqual('geo-summary');
  });

  it('value of variable geoCSV should be geo-detail.csv', () => {
    const geoCSV = component.geoCSV;
    expect(geoCSV).toEqual('geo-detail');
  });

  it('value of variable geoDetail should be geo-summary-district.json', () => {
    const geoDetail = component.geoDetail;
    expect(geoDetail).toEqual('geo-summary-district');
  });


  it('value of variable GeoTableId should be GeoDetailsTable', () => {
    const GeoTableId = component.GeoTableId;
    expect(GeoTableId).toEqual('GeoDetailsTable');
  });

  it('value of variable userTableId should be ValidatedUserDetailsTable', () => {
    const userTableId = component.userTableId;
    expect(userTableId).toEqual('ValidatedUserDetailsTable');
  });


  it('should fetch geo json', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({ result: mockManageData.userSummary }));
    component.slug = 'sunbird';
    // component.userJSON = 'user.json';
    component.getGeoJSON();
    expect(component.geoData).toBeDefined();
  });


  it('should fetch geo summary', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({ result: mockManageData.userSummary }));
    component.slug = 'sunbird';
    // component.userJSON = 'user.json';
    component.getGeoDetail();
    expect(component.geoSummary).toBeDefined();
  });

  xit('should download csv file', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({
      result: {
        signedUrl: 'a'
      }
    }));
    spyOn(window, 'open');
    component.slug = 'sunbird';
    // component.userJSON = 'user';
    // component.downloadZipFile(component.userJSON, 'user.json');
    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('a', '_blank');
  });

  it('should fetch submit teacher details csv', () => {
    const manageService = TestBed.get(ManageService);
    const userService = TestBed.get(UserService);
    spyOn(manageService, 'getData').and.returnValue(of({
      result: { signedUrl: 'signedUrl' }
    }));
    spyOn(window, 'open');
    component.slug = 'sunbird';
    // component.userJSON = 'user';
    userService._userData$.next({ err: null, userProfile: { rootOrg: { channel: 'MOCKCHANNEL' } } });
    component.fetchDeclaredUserDetails();
    expect(component.userDeclaredDetailsUrl).toBe('signedUrl');
  });

  it('should download file', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({
      result: {
        signedUrl: 'a'
      }
    }));
    spyOn(window, 'open');
    component.downloadFile('user.zip');
    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('user.zip', '_blank');
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  it('should call fileChanged method', () => {
    component.fileChanged(event);
    expect(component.fileUpload).toBe(event.target.files[0]);
  });
  it('should call interact telemetry while closing upload user validation status modal', () => {
    spyOn(component.telemetryService, 'interact');
    const activatedRoute = TestBed.get(ActivatedRoute);
    const interactData = {
      context: {
        env: activatedRoute.snapshot.data.telemetry.env,
        cdata: []
      },
      edata: {
        id: 'close-upload-validation-status-modal',
        type: 'click',
        pageid: activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    component.closeUserValidationModal();
    expect(component.showUploadUserModal).toBeFalsy();
    expect(component.telemetryService.interact).toHaveBeenCalledWith(interactData);
  });
  it('should call geoTableView and update geoTabledata array', () => {
    component.geoButtonText = resourceMockData.frmelmnts.btn.viewdetails;
    component.geoSummary = [
      {
        index: '0',
        districtName: 'District 1',
        blocks: 'Block 1',
        schools: 'School 1'
      },
      {
        index: '1',
        districtName: 'District 2',
        blocks: 'Block 2',
        schools: 'School 2'
      }
    ];
    spyOn(component, 'renderGeoDetails').and.callThrough();
    component.geoTableView();
    expect(component.geoButtonText).toEqual('View less');
    expect(component.geoTabledata.length).toEqual(2);
    expect(component.renderGeoDetails).toHaveBeenCalled();
  });

  it('should call geoTableView and set appropriate button text', () => {
    component.geoButtonText = resourceMockData.frmelmnts.btn.viewless;
    component.geoTableView();
    expect(component.geoButtonText).toEqual('View Details');
  });

  it('should open modal', () => {
    component.openModal();
    expect(component.showModal).toBeFalsy();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.showModal).toBeTruthy();
    });
  });

  it('should download csv file', () => {
    const manageService = TestBed.get(ManageService);
    spyOn(manageService, 'getData').and.returnValue(of({
      result: {
        signedUrl: 'blob.com/signedURL'
      }
    }));
    spyOn(window, 'open').and.callThrough();
    component.downloadCSVFile('validated', 'valid', 'downloadedCSVFIle');
    expect(window.open).toHaveBeenCalled();
  });
  it('should call the getAdminPolicyTnC method', () => {
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getAdminTnc').and.returnValue(observableOf(mockRes.tncConfig));
    component.getAdminPolicyTnC();
    expect(component.showAdminTnC ).toBeTruthy();
  });
  it('should call the getAdminPolicyTnC method with out data', () => {
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getAdminTnc').and.returnValue(observableOf(mockRes.tncConfigObj));
    component.getAdminPolicyTnC();
    expect(component.showAdminTnC ).toBeFalsy();
  });
});
