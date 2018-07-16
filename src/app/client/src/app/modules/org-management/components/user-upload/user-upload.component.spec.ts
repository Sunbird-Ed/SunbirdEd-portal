
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService, CoreModule } from '@sunbird/core';
import { OrgManagementService } from '@sunbird/org-management';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, ConfigService, SharedModule } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { FormBuilder } from '@angular/forms';
import { UserUploadComponent } from './user-upload.component';
import { mockRes } from './user-upload.component.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule } from '@sunbird/telemetry';
describe('UserUploadComponent', () => {
  let component: UserUploadComponent;
  let fixture: ComponentFixture<UserUploadComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserUploadComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule, CoreModule.forRoot(), SharedModule.forRoot(),
        TelemetryModule.forRoot()],
      providers: [OrgManagementService, FormBuilder,
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: ResourceData },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call redirect', () => {
    const router = TestBed.get(Router);
    component.redirect();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
  it('should call downloadSample method to download a csv file', () => {
    component.downloadSampleCSV();
    fixture.detectChanges();
  });
  xit('should call openImageBrowser method', () => {
    component.uploadUserForm.value.provider = 1234;
    component.uploadUserForm.value.externalId = 5678;
    component.uploadUserForm.value.organizationId = 98765;
    component.openImageBrowser('inputbtn');
    fixture.detectChanges();
  });
  it('should not call openImageBrowser method', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockRes.resourceBundle.messages;
    component.openImageBrowser('inputbtn');
    fixture.detectChanges();
    expect(component.bulkUploadError).toBe(true);
  });
  it('should call closeBulkUploadError method', () => {
    component.closeBulkUploadError();
    expect(component.showLoader).toBe(false);
    fixture.detectChanges();
  });
  it('should call uploadUsersCSV method and return success response with processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => observableOf(mockRes.successResponse));
    component.uploadUsersCSV(mockRes.validfile);
  });
  it('should not call uploadUsersCSV method', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = mockRes.resourceBundle.messages;
    component.uploadUsersCSV(mockRes.invalidfile);
    spyOn(toasterService, 'error').and.callThrough();
    component.bulkUploadError = true;
    expect(component.bulkUploadError).toBe(true);
  });
  it('should call uploadUsersCSV method and return error response', () => {
    const resourceService = TestBed.get(ResourceService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => observableOf(mockRes.errorResponse));
    component.uploadUsersCSV(mockRes.errorfile);
  });
  it('should recognize viewchild', () => {
    const modal = fixture.componentInstance.modal;
    component.ngOnDestroy();
    expect(component.modal).toBeDefined();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.uploadUsersCSV(mockRes.validfile);
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
