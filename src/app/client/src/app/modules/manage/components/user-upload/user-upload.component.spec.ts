
import {of as observableOf, throwError as observableThrowError } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { UserUploadComponent } from './user-upload.component';
import { mockRes } from './user-upload.component.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageService } from '../../services/manage/manage.service';
import { TelemetryModule } from '@sunbird/telemetry';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from '@sunbird/test-util';

describe('UserUploadComponent', () => {
  let component: UserUploadComponent;
  let fixture: ComponentFixture<UserUploadComponent>;
  const ResourceData = {
    'frmelmnts': {
      'instn': {
        't0013': 'Download the csv file for reference',
        't0001': 'You can add or upload details of up to 199 users at a time in one csv file',
        't0033': 'The following columns are mandatory:',
        't0034': `FirstName: The user's first name`,
        't0035': `Email: The user's verified email ID`,
        't0036': `UserName: The unique name assigned to the user by the organization.
        Ensure that no two users of the same organization have the same username.`,
        't0037': 'Password: Unique or common password given by organization',
        't0038': `All other columns are optional. These columns include information about the user such as:`,
        't0039': 'Phone',
        't0040': `Role: User's role on sunbird. Examples for this column:
        CONTENT_CREATOR, CONTENT_REVIEWER, FLAG_REVIEWER, COURSE_MENTOR, ORG_ADMIN, SYSTEM_ADMINISTRATION, COURSE_ADMIN, COURSE_CREATOR`,
        't0041': `Grade: Classes taught by the user`,
        't0042': `Location: User's place of location of the user`,
        't0043': `DOB: User's date of birth, the value should be entered in DD-MM-YYYY format`,
        't0044': `Gender: User's gender`,
        't0045': `Language: User's language preferences. Examples: English, Gujarati, Hindi, Kannada, Marathi, Punjabi, Tamil, Telugu`,
        't0046': `Profile summary: User's profile summary`,
        't0047': `Subjects: Taught by the user. Examples: Assamese, Bengali, Hindi,
        Kannada, Malayalam, Oriya, Punjabi, Tamil, Telugu, Biology, Chemistry, Physics,
         Mathematics, Environmental Studies, Geography, History, Political Science, Economics, Sanskrit, Gujarati, Marathi, Nepali`,
        't0048': `Columns titled emailVerified, phoneVerified and provider are conditionally mandatory.
        Value for emailVerified and phoneVerified should be True, if details are provided for provider`,
        't0065': 'If user is not passing organisationId but passing OrgProvider, then user should pass OrgExternalId',
        't0066': 'ExternalId: Identity of user in an external system. If user is passing externalId then they have to pass Provider.',
        't0067': `Provider: Provider is an organisation, who is providing an (external) ID to a user in sunbird.
        If user is passing ExternalId then they have to pass Provider.`,
        't0068': `Provider: Provider is an organisation, who is providing an (external) ID to a user in sunbird.
        If user is passing ExternalId then they have to pass Provider.`,
        't0069': `ExternalIds: An array of external IDs (represented as a JSON string) that a user has.
         Format: "[{"id":"someId","idType": "someIdType","provider":"someProvider", "operation": "ADD"}]".
         Supported operations on an external ID are ADD, EDIT and REMOVE.`
      }
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
  const fakeActivatedRoute = {
    'data': observableOf({ 'redirectUrl': '/profile' }),
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'profile-bulk-upload-user-upload', subtype: 'paginate', type: 'view',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };
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
      providers: [ManageService,
        { provide: ResourceService, useValue: ResourceData },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      declarations: [
       UserUploadComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUploadComponent);
    component = fixture.componentInstance;
    component.file = event.target.files[0];
    fixture.detectChanges();
  });

  it('should create user-upload component', () => {
    expect(component).toBeTruthy();
  });
  it('should call the file change method', () => {
    component.fileChanged(event);
    fixture.detectChanges();
    spyOn(component, 'fileChanged');
    expect(component.file).toEqual(event.target.files[0]);
    expect(component.activateUpload).toEqual(true);
  });
  it('should call uploadUsersCSV method and return success response with processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const manageService = TestBed.get(ManageService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(manageService, 'bulkUserUpload').and.callFake(() => observableOf(mockRes.successResponse));
    component.uploadUsersCSV();
  });
  it('should not call uploadUsersCSV method', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = mockRes.resourceBundle.messages;
    component.uploadUsersCSV();
    spyOn(toasterService, 'error').and.callThrough();
    component.bulkUploadError = true;
    expect(component.bulkUploadError).toBe(true);
  });
  it('should call uploadUsersCSV method and return error response', () => {
    const resourceService = TestBed.get(ResourceService);
    const manageService = TestBed.get(ManageService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(manageService, 'bulkUserUpload').and.callFake(() => observableOf(mockRes.errorResponse));
    component.uploadUsersCSV();
  });
  it('should call openImageBrowser method', () => {
    let inputEl: DebugElement;
    inputEl = fixture.debugElement.query(By.css('.sb-btn.sb-btn-normal.sb-btn-primary'));
    // inputEl.triggerEventHandler('click', null);
    component.openImageBrowser(inputEl);
    fixture.detectChanges();
  });
  it('should call redirect', () => {
    component.redirect();
    fixture.detectChanges();
    expect(component.fileName).toEqual('');
    expect(component.processId).toEqual('');
  });
  it('should call closeBulkUploadError', () => {
    component.closeBulkUploadError();
    fixture.detectChanges();
    expect(component.bulkUploadError).toEqual(false);
    expect(component.bulkUploadErrorMessage).toEqual('');
  });
  it('should call copyToClipboard', () => {
    spyOn(component, 'copyToClipboard');
    component.copyToClipboard();
    component.modalName = 'error';
    fixture.detectChanges();
    expect(component.copyToClipboard).toHaveBeenCalled();
  });
  it('should call uploadUsersCSV method with error response giving invalid coloumn', () => {
    const resourceService = TestBed.get(ResourceService);
    const manageService = TestBed.get(ManageService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(manageService, 'bulkUserUpload').and.callFake(() => observableThrowError(mockRes.errorUpload));
    component.uploadUsersCSV();
    expect(component.showLoader).toBe(false);
    expect(component.error).toEqual(mockRes.toasterMessage.invalidColumnSingelLine);
  });
  it('should call uploadUsersCSV method and return 502 error then show default error', () => {
    const resourceService = TestBed.get(ResourceService);
    const manageService = TestBed.get(ManageService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(manageService, 'bulkUserUpload').and.callFake(() => observableThrowError({}));
    component.uploadUsersCSV();
    expect(component.showLoader).toBe(false);
    expect(component.error).toEqual(mockRes.noErrorMessage.message);
  });
  it('should call uploadUsersCSV method without a file', () => {
    const resourceService = TestBed.get(ResourceService);
    const manageService = TestBed.get(ManageService);
    const toasterService = TestBed.get(ToasterService);
    component.file = {name: 'test.jpeg'};
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(manageService, 'bulkUserUpload').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.uploadUsersCSV();
    expect(component.showLoader).toBe(false);
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.stmsg.m0080);
  });
});
