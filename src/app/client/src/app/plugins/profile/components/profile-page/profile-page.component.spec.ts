import { ProfileService } from '../../services';
import { CertRegService, CoursesService, OrgDetailsService, PlayerService, SearchService, UserService, FormService } from '@sunbird/core';
import { ConfigService, LayoutService, NavigationHelperService, ResourceService, ToasterService, UtilService, ConnectionService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { of, throwError } from 'rxjs';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '../../../../modules/shared/services/cache-service/cache.service';
import { CertificateDownloadAsPdfService } from "@project-sunbird/sb-svg2pdf";
import { CsCourseService } from '@project-sunbird/client-services/services/course/interface';
import { CsCertificateService } from '@project-sunbird/client-services/services/certificate/interface';
import { ProfilePageComponent } from './profile-page.component';
import { Response } from './profile-page.spec.data';
import { CslFrameworkService } from '../../../../modules/public/services/csl-framework/csl-framework.service';

describe("ProfilePageComponent", () => {
    let profilePageComponent: ProfilePageComponent;
    const mockCsCourseService: Partial<CsCourseService> = {};
    const mockCacheService: Partial<CacheService> = {};
    const mockResourceService: Partial<ResourceService> = {
        frmelmnts: 10,
        messages: {
            profile: {
                smsg: {
                    'm0041': 'We are discarding the flag...',
                }
            },
            smsg: {
                certificateGettingDownloaded: 'Certificate is getting downloaded',
                m0046: 'Profile updated successfully'
            },
            emsg: {
                m007: 'Fetching data for you',
                m0012: 'Profile updated unsuccessfully'
            },
            desktop: {
                emsg: {
                    cannotAccessCertificate: 'Certificate Access denied'
                }
            }
        }
    };
    const mockCoursesService: Partial<CoursesService> = {
        getSignedCourseCertificate: jest.fn(),
        enrolledCourseData$: of({ enrolledCourses: [{ completeOn: '2022-08-03' }] })
    } as any;
    const mockToasterService: Partial<ToasterService> = {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn()
    };
    const mockProfileService: Partial<ProfileService> = {};
    const mockUserService: Partial<UserService> = {
        userData$: of({ userProfile: Response.userData }) as any,
    };
    const mockConfigService: Partial<ConfigService> = {
        appConfig: {
            PROFILE: {
                defaultShowMoreLimit: 4
            },
            Course: {
                otherCourse: [
                    {
                        'active': 'true', 'courseId': 'do_2123412199319552001265', 'courseName': '27-sept', 'status': 2,
                        'description': 'test', 'leafNodesCount': '0', 'progress': '0', 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
                    }],
                contentApiQueryParams: {
                    orgdetails: 'orgName,email',
                    licenseDetails: 'name,description,url'
                }
            },
            WORKSPACE: {
                contentType: 'Resource',
            }
        },
        constants:{
            SIZE: {
                MEDIUM: "medium",
                SMALL: "small"
              },
              VIEW: {
                HORIZONTAL: "horizontal",
                VERTICAL: "vertical"
              },
        }
    } as any;
    const mockRouter: Partial<Router> = {
        getCurrentNavigation: jest.fn(),
        navigate: jest.fn()

    };
    const mockUtilService: Partial<UtilService> = {
        getDataForCard: jest.fn(),
        isDesktopApp: true,
    };
    const mockSearchService: Partial<SearchService> = {};
    const mockPlayerService: Partial<PlayerService> = {};
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({ showEditUserDetailsPopup: 'UserData' }),
        snapshot: {
            data: {
                telemetry: {
                    object: {
                        type: 'view'
                    },
                    uuid: 'testData'
                }
            }
        } as any,
    };
    const mockOrgDetailsService: Partial<OrgDetailsService> = {};
    const mockNavigationHelperService: Partial<NavigationHelperService> = {
        goBack: jest.fn()
    };
    const mockCertRegService: Partial<CertRegService> = {};
    const mockTelemetryService: Partial<TelemetryService> = {};
    const mockLayoutService: Partial<LayoutService> = {
        initlayoutConfig: jest.fn(),
        switchableLayout: jest.fn()
    };
    const mockFormService: Partial<FormService> = {};
    const mockCertificateDownloadAsPdfService: Partial<CertificateDownloadAsPdfService> = {};
    const mockConnectionService: Partial<ConnectionService> = {
        monitor: jest.fn()
    };
    const mockCsCertificateService: Partial<CsCertificateService> = {};
    const mockCslFrameworkService: Partial<CslFrameworkService> = {
        getFrameworkCategoriesObject: jest.fn(),
        frameworkLabelTransform: jest.fn(),
        getAllFwCatName: jest.fn(),
    };


    beforeAll(() => {
        profilePageComponent = new ProfilePageComponent(
            mockCsCourseService as CsCourseService,
            mockCacheService as CacheService,
            mockResourceService as ResourceService,
            mockCoursesService as CoursesService,
            mockToasterService as ToasterService,
            mockProfileService as ProfileService,
            mockUserService as UserService,
            mockConfigService as ConfigService,
            mockRouter as Router,
            mockUtilService as UtilService,
            mockSearchService as SearchService,
            mockPlayerService as PlayerService,
            mockActivatedRoute as ActivatedRoute,
            mockOrgDetailsService as OrgDetailsService,
            mockNavigationHelperService as NavigationHelperService,
            mockCertRegService as CertRegService,
            mockTelemetryService as TelemetryService,
            mockLayoutService as LayoutService,
            mockFormService as FormService,
            mockCertificateDownloadAsPdfService as CertificateDownloadAsPdfService,
            mockConnectionService as ConnectionService,
            mockCslFrameworkService as CslFrameworkService,
            mockCsCertificateService as CsCertificateService
        );
    });


    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(profilePageComponent).toBeTruthy();
    });
    describe('initLayout', () => {
        it('should call init Layout', () => {
            //arrange
            mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
            //act
            profilePageComponent.initLayout();
            //assert
            mockLayoutService.switchableLayout().subscribe(layoutConfig => {
                expect(layoutConfig).toBeDefined();
            });
        });
    });

    describe('getOrgDetails', () => {
        it('should return the org details', () => {
            //arrange
            profilePageComponent.userProfile = Response.userData;
            //act
            profilePageComponent.getOrgDetails();
            expect(profilePageComponent.disableDelete).toBeFalsy();
        });
    });

    describe('calling the org details method',() =>{
        it('should return the org details with the role and disableDelete as true', () => {
            //arrange
            profilePageComponent.userProfile = Response.userProfileforDeleteUser
            profilePageComponent.userProfile['roles'] = [{
                "role": "ORG_ADMIN",
            }];
            profilePageComponent.userRoles = ['ORG_ADMIN', 'CONTENT_CREATOR', 'PUBLIC'];
            //act
            profilePageComponent.getOrgDetails();
            expect(profilePageComponent.disableDelete).toBeTruthy();
        });
        it('should return the org details with the role and disableDelete as false', () => {
            //arrange
            profilePageComponent.userRoles = ['PUBLIC'];
            profilePageComponent.userProfile['roles'] = [{
                "role": "PUBLIC",
            }];
            //act
            profilePageComponent.getOrgDetails();
            expect(profilePageComponent.disableDelete).toBeFalsy();
        });
    });

    describe('setNonCustodianUserLocation', () => {
        it('should assign location data to nonCustodianUserLocation through setNonCustodianUserLocation', () => {
            //arrange
            profilePageComponent.userProfile = Response.userData;
            //act
            profilePageComponent.setNonCustodianUserLocation();
            //assert
            expect(profilePageComponent.nonCustodianUserLocation['block']).toBe('MUNGER SADAR');
            expect(profilePageComponent.nonCustodianUserLocation['district']).toBe('MUNGER');
            expect(profilePageComponent.nonCustodianUserLocation['state']).toBe('Bihar');
        });
    });

    describe('getOtherCertificates', () => {
        it('should fetch all other certificates', () => {
            //arrange
            const mockData = Response.othersCertificateData;
            let requestBody = { userId: '123456', schemaName: 'certificate' };
            mockCsCertificateService.fetchCertificates = jest.fn().mockReturnValue(of(requestBody, {
                'apiPath': '/learner/certreg/v2',
                'apiPathLegacy': '/certreg/v1',
                'rcApiPath': '/learner/rc/${schemaName}/v1',
            }));
            //act
            profilePageComponent.getOtherCertificates('123456', 'all');
            //assert
            expect(profilePageComponent.otherCertificates).toBeDefined();
        });

        it('should fetch more certificates while clicking on show more', () => {
            //arrange
            const mockData = Response.othersCertificateData;
            mockCsCertificateService.fetchCertificates = jest.fn().mockReturnValue(of(mockData));
            jest.spyOn(profilePageComponent, 'getOtherCertificates').mockImplementation();
            //act
            profilePageComponent.getOtherCertificates('123456', 'all');
            profilePageComponent.toggleOtherCertific(true);
            //assert
            expect(profilePageComponent.otherCertificateLimit).toEqual(profilePageComponent.otherCertificatesCounts);
            expect(profilePageComponent.showMoreCertificates).toBeFalsy();
        });
    });

    describe('getContribution', () => {
        it('should call search service to get my contributions data', () => {
            //arrange
            mockSearchService.searchContentByUserId = jest.fn(() => of(Response.success));
            const searchParams = {
                status: 'Live',
                contentType: 'Resource',
                params: { lastUpdatedOn: 'desc' }
            };
            const params = { status: [], contetType: [], params: { userId: '', lastUpdatedOn: '' } };
            const inputParams = { params: mockConfigService.appConfig.PROFILE.contentApiQueryParams };
            //act
            profilePageComponent.getContribution();
            mockSearchService.searchContentByUserId(params, inputParams).subscribe(data => {
                //assert
                expect(profilePageComponent.contributions).toBeDefined();
            });
        });
    });

    describe('getTrainingAttended', () => {
        it('should call course service to get attended training data', () => {
            //act
            profilePageComponent.getTrainingAttended();
        });
    });

    describe('ngOnInit', () => {
        it('should call user service', (done) => {
            //arrange
            profilePageComponent.isDesktopApp = true;
            mockUserService._userData$ = jest.fn(() => of({ err: null, userProfile: Response.userData })) as any;
            mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of({ result: { response: { value: '0126684405' } } })) as any;
            mockFormService.getFormConfig = jest.fn(() => of([{ code: 'teacher' }, { code: 'persona', children: { teacher: [{ code: 'subPersona', templateOptions: { multiple: 'true', options: [{ value: 'sampleType', lablel: 'samplelabel' }] } }] } }])) as any;
            mockLayoutService.switchableLayout = jest.fn(() => of([{ isConnected: true }]));
            mockCoursesService._enrolledCourseData$ = jest.fn(() => of({ err: null, enrolledCourses: Response.courseSuccess.result.courses })) as any;
            mockConnectionService.monitor = jest.fn(() => of(true));
            profilePageComponent.userRoles = ['ORG_ADMIN', 'CONTENT_CREATOR', 'PUBLIC'];
            jest.spyOn(profilePageComponent, 'getOrgDetails').mockImplementation();
            jest.spyOn(profilePageComponent, 'getContribution').mockImplementation();
            jest.spyOn(profilePageComponent, 'getTrainingAttended').mockImplementation();
            jest.spyOn(profilePageComponent, 'getOtherCertificates').mockImplementation(() => {
                return {}
            });
            jest.spyOn(mockCslFrameworkService, 'getAllFwCatName').mockReturnValue(['category1', 'category2']);
            const expectedFormConfig = { code: 'persona1', name: 'Persona 1' };
            //act
            profilePageComponent.ngOnInit();
            //assert
            mockLayoutService.switchableLayout().subscribe(layoutConfig => {
                expect(layoutConfig).toBeDefined();
                expect(profilePageComponent).toBeTruthy();
                expect(profilePageComponent.userProfile).toEqual(Response.userData);
                expect(profilePageComponent.getOrgDetails).toHaveBeenCalled();
                expect(profilePageComponent.getContribution).toHaveBeenCalled();
                expect(profilePageComponent.getTrainingAttended).toHaveBeenCalled();
                expect(mockFormService.getFormConfig).toHaveBeenCalledTimes(2);
		        expect(mockCslFrameworkService.getAllFwCatName).toHaveBeenCalled();
                done();
            });
        });

        it('should display root org location if org location is empty', (done) => {
            //arrange
            mockUserService._userData$ = jest.fn(() => of({ err: null, userProfile: Response.userData })) as any;
            mockConnectionService.monitor = jest.fn(() => of(true));
            profilePageComponent.userRoles = ['ORG_ADMIN', 'CONTENT_CREATOR', 'PUBLIC'];
            jest.spyOn(profilePageComponent, 'getOrgDetails').mockImplementation();
            mockFormService.getFormConfig = jest.fn(() => of([{ code: 'teacher' }, { code: 'persona', children: { teacher: [{ code: 'subPersona', templateOptions: { multiple: 'true', options: [{ value: 'sampleType', lablel: 'samplelabel' }] } }] } }])) as any;
            mockCoursesService._enrolledCourseData$ = jest.fn(() => of({ err: null, enrolledCourses: Response.courseSuccess.result.courses })) as any;
            mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of({ result: { response: { value: '0126684405' } } })) as any;
            mockLayoutService.switchableLayout = jest.fn(() => of([{ isConnected: true }]));
            jest.spyOn(profilePageComponent, 'getOtherCertificates').mockImplementation(() => {
                return {}
            });
            //act
            profilePageComponent.ngOnInit();
            //assert
            mockLayoutService.switchableLayout().subscribe(layoutConfig => {
                expect(layoutConfig).toBeDefined();
                expect(profilePageComponent).toBeTruthy();
                expect(profilePageComponent.userProfile).toEqual(Response.userData);
                expect(profilePageComponent.getOrgDetails).toHaveBeenCalled();
                done();
            });
        });

        it('should check user is custodian user of not', (done) => {
            //arrange
            mockUserService._userData$ = jest.fn(() => of({ err: null, userProfile: Response.userData })) as any;
            mockConnectionService.monitor = jest.fn(() => of(true));
            mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of({ result: { response: { value: '0126684405' } } })) as any;
            mockLayoutService.switchableLayout = jest.fn(() => of([{ isConnected: true }]));
            mockFormService.getFormConfig = jest.fn(() => of([{ code: 'teacher' }, { code: 'persona', children: { teacher: [{ code: 'subPersona', templateOptions: { multiple: 'true', options: [{ value: 'sampleType', lablel: 'samplelabel' }] } }] } }])) as any;
            mockCoursesService._enrolledCourseData$ = jest.fn(() => of({ err: null, enrolledCourses: Response.courseSuccess.result.courses })) as any;
            jest.spyOn(profilePageComponent, 'getOtherCertificates').mockImplementation(() => {
                return {}
            });
            //act
            profilePageComponent.ngOnInit();
            //assert
            mockLayoutService.switchableLayout().subscribe(layoutConfig => {
                expect(layoutConfig).toBeDefined();
                expect(profilePageComponent.isCustodianOrgUser).toBeFalsy();
                done();
            });
            profilePageComponent['getCustodianOrgUser']();
        });

        it('should get self declared details', () => {
            //arrange
            mockUserService._userData$ = jest.fn(() => of({ err: null, userProfile: Response.userData })) as any;
            mockConnectionService.monitor = jest.fn(() => of(true));
            mockProfileService.getPersonaTenantForm = jest.fn().mockReturnValue(of(Response.personaTenantValues)) as any;
            mockProfileService.getSelfDeclarationForm = jest.fn().mockReturnValue(of(Response.declarationFormValues)) as any;
            mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of({ result: { response: { value: '0126684405' } } })) as any;
            mockLayoutService.switchableLayout = jest.fn(() => of([{ isConnected: true }]));
            mockFormService.getFormConfig = jest.fn(() => of([{ code: 'teacher' }, { code: 'persona', children: { teacher: [{ code: 'subPersona', templateOptions: { multiple: 'true', options: [{ value: 'sampleType', lablel: 'samplelabel' }] } }] } }])) as any;
            profilePageComponent.getSelfDeclaredDetails();
            mockCoursesService._enrolledCourseData$ = jest.fn(() => of({ err: null, enrolledCourses: Response.courseSuccess.result.courses })) as any;
            jest.spyOn(profilePageComponent, 'getOtherCertificates').mockImplementation(() => {
                return {}
            });
            //act
            profilePageComponent.ngOnInit();
            //assert
            expect(profilePageComponent.selfDeclaredInfo).toBeDefined();
            expect(profilePageComponent.selfDeclaredInfo).toBeDefined();

        });

        it('should not show self declared information if declaration is not available', () => {
            //arrange
            mockUserService._userData$ = jest.fn(() => of({ err: null, userProfile: Response.userData })) as any;
            mockLayoutService.switchableLayout = jest.fn(() => of([{ isConnected: true }]));
            mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of({ result: { response: { value: '0126684405' } } })) as any;
            mockConnectionService.monitor = jest.fn(() => of(true));
            jest.spyOn(profilePageComponent, 'getSelfDeclaredDetails').mockImplementation();
            mockCoursesService._enrolledCourseData$ = jest.fn(() => of({ err: null, enrolledCourses: Response.courseSuccess.result.courses })) as any;
            mockFormService.getFormConfig = jest.fn(() => of([{ code: 'teacher' }, { code: 'persona', children: { teacher: [{ code: 'subPersona', templateOptions: { multiple: 'true', options: [{ value: 'sampleType', lablel: 'samplelabel' }] } }] } }])) as any;
            jest.spyOn(profilePageComponent, 'getOtherCertificates').mockImplementation(() => {
                return {}
            });
            //act
            profilePageComponent.ngOnInit();
            //assert
            expect(profilePageComponent.declarationDetails).toBeDefined();
            // expect(profilePageComponent.getSelfDeclaredDetails).toHaveBeenCalled();
        });
    });

    describe('toggleOtherCertific', () => {
        it('should fetch more certificates while clicking on show more', () => {
            //arrange
            const mockData = Response.othersCertificateData;
            mockCertRegService.fetchCertificates = jest.fn().mockReturnValue(of(mockData));
            jest.spyOn(profilePageComponent, 'getOtherCertificates').mockImplementation();
            profilePageComponent.getOtherCertificates('123456', 'all');
            //act
            profilePageComponent.toggleOtherCertific(true);
            //assert
            expect(profilePageComponent.otherCertificateLimit).toEqual(profilePageComponent.otherCertificatesCounts);
            expect(profilePageComponent.showMoreCertificates).toBeFalsy();
        });
        it('should show less while clicking on show less', () => {
            //act
            profilePageComponent.toggleOtherCertific(false);
            //assert
            expect(profilePageComponent.otherCertificateLimit).toEqual(profilePageComponent.configService.appConfig.PROFILE.defaultViewMoreLimit);
            expect(profilePageComponent.showMoreCertificates).toBeTruthy();
        });
    });

    describe('copyToClipboard', () => {
        it('should show success toast message on copy of instanceId', () => {
            //arrange
            jest.spyOn(mockToasterService, 'success').mockImplementation();
            document.execCommand = jest.fn();
            //act
            profilePageComponent.copyToClipboard('user');
            //assert
            expect(profilePageComponent.toasterService.success).toHaveBeenCalledWith(mockResourceService.messages.profile.smsg.m0041);
        });
    });

    describe('getLocationDetails', () => {
        it('should call getLocationDetails', () => {
            //arrange
            const locationData = [{
                'code': '1024',
                'name': 'MUNGER',
                'id': '53c6e193-1805-4487-9b8d-453d2f08f03e',
                'type': 'district',
                'parentId': '81f85372-618e-46b9-b700-bcf3b8df6e6f'
            }];
            //act
            const locationName = profilePageComponent.getLocationDetails(locationData, 'district');
            //assert
            expect(locationName).toBe('MUNGER');
        });
        it('should call getLocationDetails error case', () => {
            //arrange
            const locationData = [{
                'code': '1024',
                'name': 'MUNGER',
                'id': '53c6e193-1805-4487-9b8d-453d2f08f03e',
                'type': 'district',
                'parentId': '81f85372-618e-46b9-b700-bcf3b8df6e6f'
            }];
            //act
            const locationName = profilePageComponent.getLocationDetails(locationData, 'state');
            //assert
            expect(locationName).toBeFalsy();
        });
    });

    describe('downloadPdfCertificate', () => {
        it('should call downloadPdfCertificate and return signedPdfUrl', () => {
            //arrange
            mockProfileService.downloadCertificates = jest.fn().mockReturnValue(of(Response.v1DownloadCertResponse));
            const request = {
                request: {
                    pdfUrl: 'https://staging.ntp.net.in/certs/0125450863553740809/6854486a-29f8-4c53-8c2d-00e2f2506124.pdf',
                }
            };
            jest.spyOn(window, 'open').mockImplementation() as any;
            //act
            profilePageComponent.downloadPdfCertificate(Response.pdfCertificate[0]);
            //assert
            expect(mockProfileService.downloadCertificates).toBeDefined();
            expect(window.open).toHaveBeenCalledWith(Response.v1DownloadCertResponse.result.signedUrl, '_blank');
        });
        it('should call downloadPdfCertificate and does not return signedPdfUrl', () => {
            //arrange
            const resp = Response.v1DownloadCertResponse;
            resp.result.signedUrl = '';
            mockProfileService.downloadCertificates = jest.fn().mockReturnValue(of(Response.v1DownloadCertResponse));
            jest.spyOn(mockToasterService, 'error').mockImplementation();
            //act
            profilePageComponent.downloadPdfCertificate(Response.pdfCertificate[0]);
            //assert
            expect(mockProfileService.downloadCertificates).toHaveBeenCalled();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0076);
        });
        it('should handle error while downloading certificate', () => {
            //arrange
            mockProfileService.downloadCertificates = jest.fn().mockReturnValue(throwError({}));
            jest.spyOn(mockToasterService, 'error').mockImplementation();
            //act
            profilePageComponent.downloadPdfCertificate(Response.pdfCertificate[0]);
            //assert
            expect(mockProfileService.downloadCertificates).toHaveBeenCalled();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0076);
        });
    });

    describe('downloadOldAndRCCert', () => {
        it('should downloading old certificate', () => {
            //arrange
            let requestBody = {
                certificateId: '123QWE',
                schemaName: 'certificate',
                type: 'Abc',
                templateUrl: ''
            };
            const course = { issuedCertificates: Response.svgCertificates, certificates: Response.pdfCertificate };
            mockCsCertificateService.getCerificateDownloadURI = jest.fn().mockReturnValue(of(requestBody));
            //act
            profilePageComponent.downloadOldAndRCCert(Response.pdfCertificate[0]);
            //assert
            expect(profilePageComponent.downloadOldAndRCCert).toBeDefined();
        });
    });

    describe('downloadCert', () => {
        it('should call downloadCert with SVG format on success', () => {
            //arrange
            const course = { issuedCertificates: Response.svgCertificates };
            jest.spyOn(mockToasterService, 'success').mockImplementation();
            mockCsCourseService.getSignedCourseCertificate = jest.fn().mockReturnValue(of({ printUri: '<svg></svg>' }));
            mockCertificateDownloadAsPdfService.download = jest.fn().mockImplementation();
            jest.spyOn(profilePageComponent, 'downloadOldAndRCCert').mockImplementation();
            //act
            profilePageComponent.downloadCert(course);
            //assert
            expect(profilePageComponent['certDownloadAsPdf'].download).toHaveBeenCalled();
            expect(profilePageComponent.toasterService.success).toHaveBeenCalledWith(mockResourceService.messages.smsg.certificateGettingDownloaded);
        });
        it('should call downloadCert with pdf format on success', () => {
            //arrange
            const course = { issuedCertificates: Response.svgCertificates, certificates: Response.pdfCertificate };
            jest.spyOn(mockToasterService, 'success').mockImplementation();
            mockCsCourseService.getSignedCourseCertificate = jest.fn().mockReturnValue(of({ printUri: null }));
            jest.spyOn(profilePageComponent, 'downloadPdfCertificate').mockImplementation();
            //act
            profilePageComponent.downloadCert(course);
            //assert
            expect(profilePageComponent.downloadPdfCertificate).toBeCalled();
        });
        it('should call downloadCert with SVG format on error', () => {
            //arrange
            const course = { issuedCertificates: Response.svgCertificates };
            jest.spyOn(mockToasterService, 'error').mockImplementation();
            mockCsCourseService.getSignedCourseCertificate = jest.fn().mockReturnValue(of({ printUri: null }));
            jest.spyOn(profilePageComponent, 'downloadPdfCertificate').mockImplementation();
            //act
            profilePageComponent.downloadCert(course);
            //assert
            expect(mockToasterService.error).toBeDefined();
        });
        it('should call downloadCert with pdf format on error', () => {
            //arrange
            const course = { issuedCertificates: Response.svgCertificates };
            mockCsCourseService.getSignedCourseCertificate = jest.fn().mockReturnValue(throwError({}));
            jest.spyOn(profilePageComponent, 'downloadPdfCertificate').mockImplementation();
            //act
            profilePageComponent.downloadCert(course);
            //assert
            expect(profilePageComponent.downloadPdfCertificate).toBeDefined();
        });
        it('should call downloadCert', () => {
            //arrange
            const certificates = Response.pdfCertificate;
            jest.spyOn(mockToasterService, 'success').mockImplementation();
            jest.spyOn(profilePageComponent, 'downloadPdfCertificate').mockImplementation();
            //act
            profilePageComponent.downloadCert({ certificates });
            //assert
            expect(profilePageComponent.downloadPdfCertificate).toBeDefined();
            expect(mockToasterService.success).toHaveBeenCalledWith(mockResourceService.messages.smsg.certificateGettingDownloaded);
        });
        it('should show error toast message', () => {
            //arrange
            jest.spyOn(mockToasterService, 'error').mockImplementation();
            //act
            profilePageComponent.downloadCert({});
            //assert
            expect(mockToasterService.error).toBeDefined();
        });
        it('should call V1 api for certificate URL', () => {
            //arrange
            const course = { issuedCertificates: Response.pdfCertificate, name: 'test' };
            jest.spyOn(profilePageComponent, 'downloadPdfCertificate').mockImplementation();
            //act
            profilePageComponent.downloadCert(course);
            //asert
            expect(profilePageComponent.downloadPdfCertificate).toBeDefined();
        });
    });

    describe('toggle', () => {
        it('should call toggle', () => {
            //arrange
            profilePageComponent.roles = ['Book Creator', 'Membership Management', 'Content Creation'];
            //act
            profilePageComponent.toggle(true);
            //assert
            expect(profilePageComponent.showMoreRoles).toBeFalsy();
            expect(profilePageComponent.showMoreRolesLimit).toBe(3);
        });
        it('should call toggle error case', () => {
            //act
            profilePageComponent.toggle(false);
            //assert
            expect(profilePageComponent.showMoreRoles).toBeTruthy();
            expect(profilePageComponent.showMoreRolesLimit).toBe(4);
        });
    });

    describe('toggleCourse', () => {
        it(`should show 'show more'`, () => {
            //act
            profilePageComponent.toggleCourse(true, 10);
            //assert
            expect(profilePageComponent.courseLimit).toBe(10);
            expect(profilePageComponent.showMoreTrainings).toBe(false);
        });
        it(`should show 'show less' after clicking 'show more'`, () => {
            //act
            profilePageComponent.toggleCourse(false, 3);
            //assert
            expect(profilePageComponent.courseLimit).toBe(3);
            expect(profilePageComponent.showMoreTrainings).toBe(true);
        });
    });

    describe('updateProfile', () => {
        it('should update framework successfully', () => {
            //arrange
            const mockFrameworkData = Response.frameworkUpdateData;
            profilePageComponent.userProfile = Response.userProfile;
            profilePageComponent.profileModal = { deny: () => { } };
            mockProfileService.updateProfile = jest.fn().mockReturnValue(of({}));
            jest.spyOn(mockToasterService, 'success').mockImplementation();
            //act
            profilePageComponent.updateProfile(mockFrameworkData);
            //assert
            expect(profilePageComponent.userProfile['framework']).toBe(mockFrameworkData);
            expect(mockToasterService.success).toHaveBeenCalledWith(mockResourceService.messages.smsg.m0046);
            expect(profilePageComponent.showEdit).toBe(false);
        });
        it('should show error if update framework id failed', () => {
            //arrange
            const mockFrameworkData = Response.frameworkUpdateData;
            profilePageComponent.userProfile = Response.userProfile;
            profilePageComponent.profileModal = { deny: () => { } };
            jest.spyOn(mockToasterService, 'warning').mockImplementation();
            mockProfileService.updateProfile = jest.fn().mockReturnValue(throwError({}));
            //act
            profilePageComponent.updateProfile(mockFrameworkData);
            //aseert
            expect(mockToasterService.warning).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0012);
        });
    });

   

    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            //arrange
            profilePageComponent.unsubscribe$ = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            //act
            profilePageComponent.ngOnDestroy();
            //assert
            expect(profilePageComponent.unsubscribe$.next).toHaveBeenCalled();
            expect(profilePageComponent.unsubscribe$.complete).toHaveBeenCalled();
        });
    });

    describe('navigateToCourse', () => {
        it('should navigate to courses page', () => {
            //arrange
            const courseData = {
                courseId: 'do_1234',
                batchId: '124579954',
                content: { contentType: 'course' }
            };
            const telemetryData = {
                context: {
                    env: undefined,
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
            mockTelemetryService.interact = jest.fn().mockImplementation();
            //act
            profilePageComponent.navigateToCourse(courseData);
            //assert
            expect(mockTelemetryService.interact).toHaveBeenCalledWith(telemetryData);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['learn/course/do_1234/batch/124579954']);
        });
    });

    it('should call play content when clicked on one of my contributions', () => {
        //arrange
        const event = { data: { metaData: { identifier: 'do_11262255104183500812' } } };
        mockPlayerService.playContent = jest.fn().mockReturnValue(of(Response.event.data.metaData));
        //act
        profilePageComponent.openContent(event);
        //assert
        expect(mockPlayerService.playContent).toHaveBeenCalled();
    });

    it('should goback to prev page', () => {
        //arrange
        mockNavigationHelperService.goBack = jest.fn().mockImplementation();
        //act
        profilePageComponent.goBack();
    });

    it('should set showFullScreenLoader to true', () => {
        //act
        profilePageComponent.onLocationModalClose({ isSubmitted: true });
        //assert
        expect(profilePageComponent.showFullScreenLoader).toBe(true);
    });

    it('should set showFullScreenLoader to false after 5 seconds', () => {
        //arrange
        jest.useFakeTimers();
        //act
        profilePageComponent.onLocationModalClose({ isSubmitted: true });
        //assert
        expect(profilePageComponent.showFullScreenLoader).toBe(true);
        jest.runAllTimers();
        expect(profilePageComponent.showFullScreenLoader).toBe(false);
    });

    describe('onLocationModalClose', () => {
        it('should set showEditUserDetailsPopup to false', () => {
            //act
            profilePageComponent.onLocationModalClose({ isSubmitted: true });
            ///assert
            expect(profilePageComponent.showEditUserDetailsPopup).toBe(false);
        });
    });

    describe('triggerAutoScroll', () => {
        it('should scroll to the element with the given id', () => {
            //arrange
            const scrollToId = 'test-id';
            const element = {
                getBoundingClientRect: jest.fn(() => ({ top: 100 }))
            };
            document.getElementById = jest.fn(() => element) as any;
            window.scrollTo = jest.fn();
            //act
            profilePageComponent.triggerAutoScroll();
            //assert
            expect(document.getElementById).toBeDefined();
            expect(element.getBoundingClientRect).toBeDefined();
            expect(window.scrollTo).toBeDefined();
        });
        it('should not scroll if element is not found', () => {
            //arrange
            document.getElementById = jest.fn(() => null);
            window.scrollTo = jest.fn();
            //act
            profilePageComponent.triggerAutoScroll();
            //assert
            expect(window.scrollTo).not.toHaveBeenCalled();
        });
    });

    describe('convertToString', () => {
        it('should return a string when given an array', () => {
            //arrange
            const array = [1, 2, 3];
            //act
            let result = profilePageComponent.convertToString(array);
            //assert
            expect(result).toEqual('1, 2, 3');
        });
        it('should return undefined when given a non-array value', () => {
            //arrange
            const value = 'test';
            //act
            const result = profilePageComponent.convertToString(value);
            //assert
            expect(result).toBeUndefined();
        });
    });

    describe('prepareVisits', () => {
        it('should prepare visits', () => {
            //arrange
            const event = [
                {
                    metaData: {
                        courseId: '123',
                    },
                    section: 'section1',
                },
                {
                    metaData: {
                        identifier: '456',
                    },
                    section: 'section2',
                },
            ];
            const expectedVisits = [
                {
                    objid: '123',
                    objtype: 'course',
                    index: 0,
                    section: 'section1',
                },
                {
                    objid: '456',
                    objtype: 'course',
                    index: 1,
                    section: 'section2',
                },
            ];
            profilePageComponent.telemetryImpression = {
                context: {
                    env: 'dashboard',
                },
                edata: {
                    type: 'profile',
                    subtype: 'view',
                    pageid: '12344',
                    uri: 'dashboard/certificates',
                    visits: []
                },
                object: {
                    id: '123',
                    type: 'course',
                    ver: '1.0',
                }
            };
            //act
            profilePageComponent.prepareVisits(event);
            //assert
            expect(profilePageComponent.telemetryImpression.edata.visits).toEqual(expectedVisits);
            expect(profilePageComponent.telemetryImpression.edata.subtype).toEqual('pageexit');
        });
    });

    describe('navigate', () => {
        it('should navigate to the given url with the given formAction', () => {
            //arrange
            const url = '/some/url';
            const formAction = 'someFormAction';
            const navigateSpy = jest.spyOn(mockRouter, 'navigate');
            //act
            profilePageComponent.navigate(url, formAction);
            //assert
            expect(navigateSpy).toHaveBeenCalledWith([url], { queryParams: { formaction: formAction } });
        });
        it('should call a method navigatetoRoute when the delete user button is clicked', () => {
            profilePageComponent.userProfile = Response.userProfileforDeleteUser
            const url = '/profile/delete-user';
            const navigateSpy = jest.spyOn(mockRouter, 'navigate');
            profilePageComponent.navigatetoRoute(url);
            expect(navigateSpy).toHaveBeenCalledWith([url]);
        });
        it('should call a method navigatetoRoute when the delete user button is clicked with more roles', () => {
            profilePageComponent.userProfile = Response.userProfileforDeleteUser
            profilePageComponent.userProfile.userRoles =['PUBLIC','BOOK_CREATOR','CONTENT_CREATOR'];
            const url = '/profile/delete-user';
            const msg = 'Your role doesnot allow you to delete your account. Please contact support!'
            profilePageComponent.navigatetoRoute(url);
            expect(mockToasterService.warning).toBeCalledWith(msg)
        });
    });
    
});