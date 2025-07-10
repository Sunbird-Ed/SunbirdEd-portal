import { ActivatedRoute, Router } from '@angular/router';
import { CsCertificateService } from '@project-fmps/client-services/services/certificate';
import { UserService, CertificateService, TenantService } from'@sunbird/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { PublicPlayerService } from '@sunbird/public';
import { CertificateDetailsComponent } from './certificate-details.component';
import { validateCertMockResponse } from './certificate-details.component.spec.data'
import { of, throwError } from 'rxjs';
  
describe("CertificateDetailsComponent", () => {
    let component: CertificateDetailsComponent;

    const mockCertificateService: Partial<CertificateService> = {};
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: {
              telemetry: { env: 'course', pageid: 'validate-certificate', type: 'view' }
            },
            params: { uuid: '9545879' },
            queryParams: { clientId: 'android', context: '{"env":"course","pageid":"validate-certificate","type":"view"}' }
        } as any
    };
    const mockConfigService: Partial<ConfigService> = {
        appConfig: {ContentPlayer:{contentApiQueryParams: {}}}
    };
    const mockPublicPlayerService: Partial<PublicPlayerService> = {
        getConfig: jest.fn()
    };
    const mockRouter: Partial<Router> = {
        navigate: jest.fn()
    };
    const mockTenantService: Partial<TenantService> = {
        tenantData$: of({tenantData: {titleName: 'sample-favicon', logo: "logo-path"}}) as any
    };
    const mockCsCertificateService: Partial<CsCertificateService> = {};
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };
    const mockResourceService: Partial<ResourceService> = {
        instance: "SUNBIRD",
        messages: {emsg: {m0005: ""}}
    };
    const mockUserService: Partial<UserService> = {};
    
    beforeAll(() => {
        component = new CertificateDetailsComponent(
            mockActivatedRoute as ActivatedRoute, 
            mockCertificateService as CertificateService, 
            mockResourceService as  ResourceService,
            mockConfigService as ConfigService, 
            mockUserService as UserService,
            mockPublicPlayerService as PublicPlayerService, 
            mockRouter as Router, 
            mockTenantService as TenantService, 
            mockCsCertificateService as CsCertificateService, 
            mockToasterService as ToasterService,
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of CertificateDetailsComponent', () => {
        expect(component).toBeTruthy();
    });

    it("should process video url and set content id", () => {
        component.processVideoUrl("http://www.xyz.com/do_1126972203209768961327");
        expect(component.contentId).toEqual("do_1126972203209768961327")
    })

    it("should set Telemetry Data", () => {
        component.setTelemetryData();
        expect(component.telemetryImpressionData).toBeDefined();
        expect(component.telemetryCdata).toBeDefined();
    })


    describe('validateCertificate', () => { 
        it('should validate certificate if URL has `data` params and verified', (done) => {
            mockActivatedRoute.snapshot.queryParams = { data: "https://sunbirddev.blob.core.windows.net/do_112831862871203840114/small.mp4"};
            mockCsCertificateService.getEncodedData = jest.fn().mockImplementation(() => Promise.resolve({}));
            const certMockData = {
                certificateData: {
                    issuedTo: "state",
                    trainingName: "Course Name",
                    issuanceDate: "2022-04-12T11:54:46.473Z"
                },
                verified: true
            }
            jest.spyOn(console, 'log');
            mockCsCertificateService.verifyCertificate = jest.fn().mockImplementation(() => of(certMockData));
            component.validateCertificate();
            setTimeout(() => {
                expect(mockCsCertificateService.verifyCertificate).toHaveBeenCalled();
                expect(component.viewCertificate).toBeTruthy();
                expect(component.recipient).toEqual(certMockData.certificateData.issuedTo);
                expect(component.courseName).toEqual(certMockData.certificateData.trainingName);
                done();
            });
        });

        it('should validate certificate if URL has `data` params and not verified', (done) => {
            mockActivatedRoute.snapshot.queryParams = { data: "https://sunbirddev.blob.core.windows.net/do_112831862871203840114/small.mp4"};
            mockCsCertificateService.getEncodedData = jest.fn().mockImplementation(() => Promise.resolve({}));
            const certMockData = {
                certificateData: {
                    issuedTo: "state",
                    trainingName: "Course Name",
                    issuanceDate: "2022-04-12T11:54:46.473Z"
                },
                verified: false
            }
            mockCsCertificateService.verifyCertificate = jest.fn().mockImplementation(() => of(certMockData));
            component.validateCertificate();
            setTimeout(() => {
                expect(mockCsCertificateService.verifyCertificate).toHaveBeenCalled();
                expect(component.viewCertificate).toBeFalsy();
                expect(component.isInvalidCertificate).toBeTruthy();
                done();
            });
        });

        it('should set invalid certificate and throw error if verifyCertificate fails', (done) => {
            mockActivatedRoute.snapshot.queryParams = { data: "https://sunbirddev.blob.core.windows.net/do_112831862871203840114/small.mp4"};
            mockCsCertificateService.getEncodedData = jest.fn().mockImplementation(() => Promise.resolve({}));
            mockCsCertificateService.verifyCertificate = jest.fn(() => throwError({}));
            component.validateCertificate();
            setTimeout(() => {
                expect(mockCsCertificateService.verifyCertificate).toHaveBeenCalled();
                expect(component.viewCertificate).toBeFalsy();
                expect(component.isInvalidCertificate).toBeTruthy();
                expect(mockToasterService.error).toHaveBeenCalled()
                done();
            });
        });

        it('should throw error on getEncodedData', (done) => {
            mockActivatedRoute.snapshot.queryParams = { data: "https://sunbirddev.blob.core.windows.net/do_112831862871203840114/small.mp4"};
            mockCsCertificateService.getEncodedData = jest.fn().mockImplementation(() => Promise.reject({}));
            component.validateCertificate();
            setTimeout(() => {
                expect(mockCsCertificateService.getEncodedData).toHaveBeenCalled();
                expect(component.viewCertificate).toBeFalsy();
                expect(component.isInvalidCertificate).toBeTruthy();
                done();
            });
        });
    })

    describe('validateTCertificate', () => { 
        it('should validate certificate if URL has `t` params and verified', () => {
            mockActivatedRoute.snapshot.queryParams = { uuid: "xyzxyz"};
            const certMockData = {
                certificateData: {
                    issuedTo: "state",
                    trainingName: "Course Name",
                    issuanceDate: "2022-04-12T11:54:46.473Z"
                },
                verified: true
            }
            jest.spyOn(console, 'log');
            mockCsCertificateService.verifyCertificate = jest.fn().mockImplementation(() => of(certMockData));
            component.validateTCertificate();
            expect(mockCsCertificateService.verifyCertificate).toHaveBeenCalled();
            expect(component.viewCertificate).toBeTruthy();
            expect(component.recipient).toEqual(certMockData.certificateData.issuedTo);
            expect(component.courseName).toEqual(certMockData.certificateData.trainingName);
        });

        it('should validate certificate if URL has `t` params and not verified', () => {
            mockActivatedRoute.snapshot.queryParams = { uuid: "xyzxyz"};
            const certMockData = {
                certificateData: {
                    issuedTo: "state",
                    trainingName: "Course Name",
                    issuanceDate: "2022-04-12T11:54:46.473Z"
                },
                verified: false
            }
            mockCsCertificateService.verifyCertificate = jest.fn().mockImplementation(() => of(certMockData));
            component.validateTCertificate();
            expect(mockCsCertificateService.verifyCertificate).toHaveBeenCalled();
            expect(component.viewCertificate).toBeFalsy();
            expect(component.isInvalidCertificate).toBeTruthy();
        });

        it('should set invalid certificate and throw error if verifyCertificate fails', () => {
            mockActivatedRoute.snapshot.queryParams = { uuid: "xyzxyz"};
            mockCsCertificateService.verifyCertificate = jest.fn(() => throwError({}));
            component.validateTCertificate();
            expect(mockCsCertificateService.verifyCertificate).toHaveBeenCalled();
            expect(component.viewCertificate).toBeFalsy();
            expect(component.isInvalidCertificate).toBeTruthy();
            expect(mockToasterService.error).toHaveBeenCalled()
        });
    })


    describe("ngOnInit", () => {
        it("should validate certificate for data queryparams", () => {
            mockActivatedRoute.snapshot.queryParams = { data: {}};
            jest.spyOn(component, 'validateCertificate').mockImplementation();
            jest.spyOn(component, 'setTelemetryData').mockImplementation();
            component.ngOnInit();
            expect(component.validateCertificate).toHaveBeenLastCalledWith();
            expect(component.setTelemetryData).toHaveBeenLastCalledWith();
            expect(component.tenantName).toBeDefined();
        });

        it("should validate certificate for 't' queryparams", () => {
            mockActivatedRoute.snapshot.queryParams = { t: {}};
            jest.spyOn(component, 'validateTCertificate').mockImplementation();
            jest.spyOn(component, 'setTelemetryData').mockImplementation();
            component.ngOnInit();
            expect(component.validateTCertificate).toHaveBeenLastCalledWith();
            expect(component.setTelemetryData).toHaveBeenLastCalledWith();
            expect(component.tenantName).toBeDefined();
        })
    })


    describe('getCourseVideoUrl', () => { 
        it('should get content id', () => {
            mockPublicPlayerService.getCollectionHierarchy = jest.fn().mockImplementation(() => of(validateCertMockResponse.getCourseIdResponse));
            jest.spyOn(component, 'processVideoUrl').mockImplementation();
            component.getCourseVideoUrl('do_1126972203209768961327');
            expect(component.watchVideoLink).toEqual(validateCertMockResponse.getCourseIdResponse.result.content.certVideoUrl);
            expect(component.processVideoUrl).toHaveBeenCalledWith(validateCertMockResponse.getCourseIdResponse.result.content.certVideoUrl)
        });
    })


    describe('certificateVerify', () => { 
        it('should verify the certificate', () => {
            component.loader = true;
            mockCertificateService.validateCertificate = jest.fn(() => of(validateCertMockResponse.successResponse));
            const certData = validateCertMockResponse.successResponse;
            component.certificateVerify();
            expect(component.loader).toBe(false);
            expect(component.viewCertificate).toBe(true);
            expect(component.recipient).toBe(certData.result.response.json.recipient.name);
            expect(component.courseName).toBe(certData.result.response.json.badge.name);
        });
        
        it('should process the video url if it is present inside response, no need to call hierarchy api', () => {
            component.loader = true;
            mockCertificateService.validateCertificate = jest.fn(() => of(validateCertMockResponse.successResponse));
            jest.spyOn(component, 'processVideoUrl').mockImplementation();
            const certData = validateCertMockResponse.successResponse;
            component.certificateVerify();
            expect(component.processVideoUrl).toHaveBeenCalledWith(certData.result.response.related.certVideoUrl);
        });


        it('should process the video url if it is not present inside response, call hierarchy api', () => {
            component.loader = true;
            let res = validateCertMockResponse.successResponse;
            delete res.result.response.related.certVideoUrl;
            mockCertificateService.validateCertificate = jest.fn(() => of(res));
            jest.spyOn(component, 'getCourseVideoUrl').mockImplementation();
            component.certificateVerify();
            expect(component.getCourseVideoUrl).toHaveBeenCalledWith(res.result.response.related.courseId);
        });
    
        it('should not verify the certificate', () => {
            component.loader = true;
            mockCertificateService.validateCertificate = jest.fn(() => throwError(validateCertMockResponse.errorRespone));
            component.certificateVerify();
            expect(component.loader).toBe(false);
            expect(component.wrongCertificateCode).toBe(true);
            expect(component.enableVerifyButton).toBe(false);
        });
    });

    describe('getCodeLength', () => { 
        it('should enable verification button if key up', () => {
            const event = {target: {value: 'key-up'}};
            component.getCodeLength(event);
            expect(component.enableVerifyButton).toBeTruthy();
        });    
        it('should disable verification button if key down', () => {
            const event = {target: {value: 'key-down'}};
            component.getCodeLength(event);
            expect(component.enableVerifyButton).toBeFalsy();
        });  
    })

    describe('navigateToCoursesPage', () => { 
        it('should back to course page', () => {
            component.navigateToCoursesPage();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore-course']);
        }); 

        it('should back to course page for android client', () => {
            Object.defineProperty(window, "location", {
                value: {
                    href: jest.fn()
                }
            });
            mockActivatedRoute.snapshot.queryParams = { clientId: "android"};
            component.navigateToCoursesPage();
            expect(window.location.href).toEqual('/explore-course');
        });
    })

    describe('playContent', () => { 
        it('should play the content', () => {
            mockPublicPlayerService.getContent = jest.fn().mockImplementation(() => of(validateCertMockResponse.getContentResponse));
            component.playContent('do_112831862871203840114');
            expect(mockPublicPlayerService.getConfig).toHaveBeenCalled();
        });
    })

    describe('ngOnDestroy', () => { 
        it('should unsubscribe tenantDataSubscription', () => {
            component.tenantDataSubscription = {
              unsubscribe: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.tenantDataSubscription.unsubscribe).toHaveBeenCalled();
        });
    })

    
    

})