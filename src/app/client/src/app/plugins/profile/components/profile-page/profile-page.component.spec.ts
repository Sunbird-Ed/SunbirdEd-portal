import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { CoreModule, UserService, SearchService, PlayerService, LearnerService, CoursesService, CertRegService, OrgDetailsService } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgInviewModule } from 'angular-inport';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileService } from '@sunbird/profile';
import { ProfilePageComponent } from './profile-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SlickModule } from 'ngx-slick';
import { Response } from './profile-page.spec.data';
import { of as observableOf, throwError as observableThrowError, of, throwError } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';
describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'profile', subtype: 'paginate', type: 'view',
          object: { type: '', ver: '1.0' }
        }
      }
    };
  }
  const env = 'profile';
  class ActivatedRouteStub {
    snapshot = {
      root: { firstChild: { data: { telemetry: { env: env } } } },
      data: {
        telemetry: { env: env }
      }
    };
  }
  class MockDomToImage {
    toPng() { }
  }
  class MockJsPDF {
    addImage() {
    }

    save() {
    }
  }

  class MockCSModule {
    getSignedCourseCertificate() { return of({ printUri: '' }); }
  }

  const resourceBundle = {
    'frmelmnts': {
      'instn': {
        't0015': 'Upload Organization',
        't0016': 'Upload User'
      },
      'lbl': {
        'chkuploadsts': 'Check Status',
        'certificates': 'Certificates'
      },
    },
    'messages': {
      'smsg': {
        'm0046': 'Profile updated successfully...'
      },
      'fmsg': {
        'm0001': 'api failed, please try again',
        'm0004': 'api failed, please try again'
      },
      'emsg': {
        'm0012': 'Profile update failed. Try again later',
        'm0076': 'No data available to download'
      }
    },
    languageSelected$: observableOf({})
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule,
        TelemetryModule, NgInviewModule, SlickModule],
      declarations: [ProfilePageComponent],
      providers: [ProfileService, UserService, SearchService,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: 'DOMTOIMAGE', useValue: Promise.resolve(MockDomToImage) },
        { provide: 'JSPDF', useValue: Promise.resolve(MockJsPDF) },
        { provide: 'CS_COURSE_SERVICE', useClass: MockCSModule },
        { provide: ResourceService, useValue: resourceBundle },
        ToasterService, CertRegService, TelemetryService, OrgDetailsService,],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
  });

  it('should call user service', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.frelmnts = resourceBundle.frmelmnts;
    resourceService.messages = resourceBundle.messages;
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: Response.userData });
    spyOn(component, 'getOrgDetails').and.callThrough();
    spyOn(component, 'getContribution').and.callThrough();
    spyOn(component, 'getTrainingAttended').and.callThrough();
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.userProfile).toEqual(Response.userData);
    expect(component.getOrgDetails).toHaveBeenCalled();
    expect(component.getContribution).toHaveBeenCalled();
    expect(component.getTrainingAttended).toHaveBeenCalled();
  });

  it('should call search service to get my contributions data', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'searchContentByUserId').and.returnValue(observableOf(Response.success));
    component.getContribution();
    expect(component.contributions).toBeDefined();
  });

  it('should not call user search service when my contributions data count is zero', () => {
    const searchService = TestBed.get(SearchService);
    searchService._searchedContentList = Response.zeroData.result;
    const response = searchService.searchedContentList;
    component.getContribution();
    expect(response.count).toEqual(0);
    expect(component.contributions).toBeDefined();
    expect(component.contributions).toEqual([]);
  });

  it('should call play content when clicked on one of my contributions', () => {
    const playerService = TestBed.get(PlayerService);
    const event = { data: { metaData: { identifier: 'do_11262255104183500812' } } };
    spyOn(playerService, 'playContent').and.callFake(() => observableOf(Response.event.data.metaData));
    component.openContent(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });

  it('should call course service to get attended training data', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.courseSuccess.result.courses });
    courseService.initialize();
    component.getTrainingAttended();
    expect(component.attendedTraining).toBeDefined();
  });

  it('should display root org location if org location is empty', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.frelmnts = resourceBundle.frmelmnts;
    resourceService.messages = resourceBundle.messages;
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: Response.userData });
    spyOn(component, 'getOrgDetails').and.callThrough();
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.userProfile).toEqual(Response.userData);
    expect(component.getOrgDetails).toHaveBeenCalled();
  });

  it('should fetch other certificates', () => {
    const certRegService = TestBed.get(CertRegService);
    const mockData = Response.othersCertificateData;
    spyOn(certRegService, 'fetchCertificates').and.returnValue(observableOf(mockData));
    component.getOtherCertificates('123456', 'quiz');
    expect(component.otherCertificates).toEqual([{
      pdfUrls: [{ url: mockData.result.response.content[0]._source.pdfUrl }],
      issuingAuthority: mockData.result.response.content[0]._source.data.badge.issuer.name,
      issuedOn: mockData.result.response.content[0]._source.data.issuedOn,
      certName: mockData.result.response.content[0]._source.data.badge.name
    }]);
  });

  it(`should show 'show more'`, () => {
    component.toggleCourse(true, 10);
    expect(component.courseLimit).toBe(10);
    expect(component.showMoreTrainings).toBe(false);
  });

  it(`should show 'show less' after clicking 'show more'`, () => {
    component.toggleCourse(false, 3);
    expect(component.courseLimit).toBe(3);
    expect(component.showMoreTrainings).toBe(true);
  });

  it('should update framework successfully', () => {
    const mockFrameworkData = Response.frameworkUpdateData;
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    component.userProfile = Response.userProfile;
    component.profileModal = { modal: { deny: () => { } } };
    spyOn(profileService, 'updateProfile').and.returnValue(observableOf({}));
    spyOn(toasterService, 'success');
    component.updateProfile(mockFrameworkData);
    expect(component.userProfile['framework']).toBe(mockFrameworkData);
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0046);
    expect(component.showEdit).toBe(false);
  });

  it('should show error if update framework id failed', () => {
    const mockFrameworkData = Response.frameworkUpdateData;
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    component.userProfile = Response.userProfile;
    component.profileModal = { modal: { deny: () => { } } };
    spyOn(toasterService, 'warning');
    spyOn(profileService, 'updateProfile').and.callFake(() => observableThrowError({}));
    component.updateProfile(mockFrameworkData);
    expect(toasterService.warning).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0012);
  });

  it('should navigate to courses page', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const router = TestBed.get(Router);
    const courseData = {
      courseId: 'do_1234',
      batchId: '124579954',
      content: { contentType: 'course' }
    };
    const telemetryData = {
      context: {
        env: 'profile',
        cdata: [{
          type: 'batch',
          id: '124579954'
        }]
      },
      edata: {
        id: 'course-play',
        type: 'click',
        pageid: 'profile-read',
      },
      object: {
        id: 'do_1234',
        type: 'course',
        ver: '1.0',
        rollup: {},
      }
    };
    spyOn(telemetryService, 'interact').and.stub();
    component.navigateToCourse(courseData);
    expect(telemetryService.interact).toHaveBeenCalledWith(telemetryData);
    expect(router.navigate).toHaveBeenCalledWith(['learn/course/do_1234']);
  });
  it('should assign location data to nonCustodianUserLocation through setNonCustodianUserLocation', () => {
    component.userProfile = Response.userData;
    component.setNonCustodianUserLocation();
    expect(component.nonCustodianUserLocation['block']).toBe('MUNGER SADAR');
    expect(component.nonCustodianUserLocation['district']).toBe('MUNGER');
    expect(component.nonCustodianUserLocation['state']).toBe('Bihar');
  });
  it('should assign location data to nonCustodianUserLocation through setNonCustodianUserLocation error case', () => {
    component.userProfile = Response.userProfile;
    component.setNonCustodianUserLocation();
    expect(Object.values(component.nonCustodianUserLocation).length).toBe(0);
  });
  it('should call getLocationDetails', () => {
    const locationData = [{
      'code': '1024',
      'name': 'MUNGER',
      'id': '53c6e193-1805-4487-9b8d-453d2f08f03e',
      'type': 'district',
      'parentId': '81f85372-618e-46b9-b700-bcf3b8df6e6f'
    }];
    const locationName = component.getLocationDetails(locationData, 'district');
    expect(locationName).toBe('MUNGER');
  });
  it('should call getLocationDetails error case', () => {
    const locationData = [{
      'code': '1024',
      'name': 'MUNGER',
      'id': '53c6e193-1805-4487-9b8d-453d2f08f03e',
      'type': 'district',
      'parentId': '81f85372-618e-46b9-b700-bcf3b8df6e6f'
    }];
    const locationName = component.getLocationDetails(locationData, 'state');
    expect(locationName).toBeFalsy();
  });
  it('should call toggle', () => {
    component.roles = ['Book Creator', 'Membership Management', 'Content Creation'];
    component.toggle(true);
    expect(component.showMoreRoles).toBeFalsy();
    expect(component.showMoreRolesLimit).toBe(3);
  });
  it('should call toggle error case', () => {
    component.toggle(false);
    expect(component.showMoreRoles).toBeTruthy();
    expect(component.showMoreRolesLimit).toBe(4);
  });


  it('should check user is custodian user of not', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: Response.userData });
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.returnValue(observableOf({ result: { response: { value: '0126684405' } } }));
    component.ngOnInit();
    component['getCustodianOrgUser']();
    expect(component.isCustodianOrgUser).toBeFalsy();
  });

  it('should convert to string if value is array', () => {
    const stringArray = ['one', 'tow', 'three'];
    const result = component.convertToString(stringArray);
    expect(result).toString();
  });

  it('should return undefined if value is not an array', () => {
    const stringArray = 'One';
    const result = component.convertToString(stringArray);
    expect(result).toBeUndefined();
  });

  it('should navigate to submit self declare details form ', () => {
    const router = TestBed.get(Router);
    component.navigate('/profile/teacher-declaration', 'submit');
    expect(router.navigate).toHaveBeenCalledWith(['/profile/teacher-declaration'], { queryParams: { formaction: 'submit' } });
  });

  it('should not show self declared information if declaration is not available', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: Response.userData });
    spyOn(component, 'getSelfDeclaraedDetails').and.callThrough();
    component.ngOnInit();
    expect(component.declarationDetails).toBeDefined();
    expect(component.getSelfDeclaraedDetails).toHaveBeenCalled();
  });

  it('should get self declared details', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: Response.userData });
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getTenants').and.returnValue(observableOf(Response.tenantsList));
    spyOn(profileService, 'getTeacherDetailForm').and.returnValue(observableOf(Response.teacherDetailForm));
    component.ngOnInit();
    component.getSelfDeclaraedDetails();
    expect(component.tenantInfo).toBeDefined();
    expect(component.selfDeclaredInfo).toEqual(Response.finalDeclarationObjStructure);
  });

  it('should call downloadCert', () => {
    const certificates = Response.pdfCertificate;
    spyOn(component, 'downloadPdfCertificate');
    component.downloadCert(certificates);
    expect(component.downloadPdfCertificate).toHaveBeenCalled();
  });

  it('should call downloadPdfCertificate and return signedPdfUrl', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'downloadCertificates').and.returnValue(of(Response.v1DownloadCertResponse));
    spyOn(window, 'open');
    component.downloadPdfCertificate(Response.pdfCertificate[0]);
    expect(profileService.downloadCertificates).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(Response.v1DownloadCertResponse.result.signedUrl, '_blank');
  });

  it('should call downloadPdfCertificate and does not return signedPdfUrl', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    const resp = Response.v1DownloadCertResponse;
    resp.result.signedUrl = '';
    spyOn(profileService, 'downloadCertificates').and.returnValue(of(Response.v1DownloadCertResponse));
    spyOn(toasterService, 'error');
    component.downloadPdfCertificate(Response.pdfCertificate[0]);
    expect(profileService.downloadCertificates).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('No data available to download');
  });

  it('should handle error while downloading certificate', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'downloadCertificates').and.returnValue(throwError({}));
    spyOn(toasterService, 'error');
    component.downloadPdfCertificate(Response.pdfCertificate[0]);
    expect(profileService.downloadCertificates).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('No data available to download');
  });
});
