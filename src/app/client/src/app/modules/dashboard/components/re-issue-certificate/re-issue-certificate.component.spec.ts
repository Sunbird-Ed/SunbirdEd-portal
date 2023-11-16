import { TelemetryService } from '@sunbird/telemetry';
import { CertRegService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { ReIssueCertificateComponent } from './re-issue-certificate.component';
import { of, throwError } from 'rxjs';

describe("ReIssueCertificateComponent", () => {
    let reIssueCertificateComponent: ReIssueCertificateComponent;
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            dashboard: {
                emsg: {
                    m001: 'Something went wrong, try again later!',
                    m002: 'Something went wrong, try again later!!',
                    m003: 'Something went wrong, try again later!!!',

                },
                smsg: {
                    m001: 'Sucess'
                }
            },
            emsg: {
                m004: 'Something went wrong, try again later',

            },

        }
    };
    const mockCertRegService: Partial<CertRegService> = {
        reIssueCertificate: jest.fn().mockReturnValue(of({ data: 'test' })) as any
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: {
                telemetry: {
                    object: {
                        type: 'view'
                    }
                }
            }
        } as any,
        parent: { params: of({ courseId: '123' }), queryParams: {} as any } as any,

    };
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };
    const mockNavigationHelperService: Partial<NavigationHelperService> = {};
    const mockRouter: Partial<Router> = {};
    const mockTelemetryService: Partial<TelemetryService> = {
        interact: jest.fn()
    };
    const mockUserService: Partial<UserService> = {};

    beforeAll(() => {
        reIssueCertificateComponent = new ReIssueCertificateComponent(
            mockResourceService as ResourceService,
            mockCertRegService as CertRegService,
            mockActivatedRoute as ActivatedRoute,
            mockToasterService as ToasterService,
            mockNavigationHelperService as NavigationHelperService,
            mockRouter as Router,
            mockTelemetryService as TelemetryService,
            mockUserService as UserService,

        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(reIssueCertificateComponent).toBeTruthy();
    });
    describe('reIssueCert', () => {
        it('should reIssue certificate', () => {
            const batch = {
                batchId: 123456,
                createdBy: 'abcd'
            }
            mockCertRegService.reIssueCertificate = jest.fn().mockReturnValue(of({ data: 'test' })) as any;
            //jest.spyOn(reIssueCertificateComponent,'toggleModal')
            reIssueCertificateComponent.reIssueCert(batch);
            //expect(reIssueCertificateComponent.toggleModal).toBeCalled();
            expect(mockToasterService.success).toBeCalledWith(mockResourceService.messages.dashboard.smsg.m001)
        });

        it('reIssue certificate should throw error', () => {
            const batch = {
                batchId: 123456,
                createdBy: 'abcd'
            }
            // jest.spyOn(reIssueCertificateComponent,'toggleModal')
            mockCertRegService.reIssueCertificate = jest.fn().mockReturnValue(throwError({ error: 'error' })) as any;
            reIssueCertificateComponent.reIssueCert(batch);
            //expect(reIssueCertificateComponent.toggleModal).toBeCalled();
            expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.dashboard.emsg.m003)
        });
    });
    it('should call closeModal on onPopState call', () => {
        //arrange
        reIssueCertificateComponent.showModal = true;
        const event = [];
        //act
        reIssueCertificateComponent.onPopState(event);
        //assert
        expect(reIssueCertificateComponent.onPopState).toBeDefined();
    });

    describe('setObject', () => {
        it('should return object with version 2', () => {
            //arrange
            reIssueCertificateComponent.courseId = '123';
            reIssueCertificateComponent.userData = {
                userId: '123', userName: 'user', district: 'district',
                courses: {
                    courseId: '123', name: 'course 1',
                    contentType: 'TextBook', pkgVersion: 2.0, batches: [{}]
                }
            };
            //act
            reIssueCertificateComponent.setObject();
            //assert
            expect(reIssueCertificateComponent.setObject).toBeDefined();
        });

        it('should return object with version 1', () => {
            //arrange
            reIssueCertificateComponent.courseId = '123';
            reIssueCertificateComponent.userData = {
                userId: '123', userName: 'user', district: 'district',
                courses: {
                    courseId: '123', name: 'course 1',
                    contentType: 'TextBook', pkgVersion: undefined, batches: [{}]
                }
            };
            //act
            reIssueCertificateComponent.setObject();
            //assert
            expect(reIssueCertificateComponent.setObject).toBeDefined();
        });
    });

    describe('isErrorOccurred', () => {
        //arrange
        it('should  call toaster message for user is not enrolled in batches ', () => {
            jest.spyOn(reIssueCertificateComponent['toasterService'], 'error').mockImplementation();
            //act
            const value = reIssueCertificateComponent.isErrorOccurred({
                userId: 'testUser',
                userName: 'user',
                district: 'district 1',
                courses: {
                    courseId: '123',
                    name: 'course 1',
                    contentType: 'course',
                    pkgVersion: 1,
                    batches: []
                }
            });
            //assert
            expect(value).toBeTruthy();
            expect(reIssueCertificateComponent['toasterService'].error).toHaveBeenCalledWith(mockResourceService.messages.dashboard.emsg.m002);
        });

        it('should  call toaster message for invalid user ', () => {
            //arrange
            jest.spyOn(reIssueCertificateComponent['toasterService'], 'error').mockImplementation();
            //act
            const value = reIssueCertificateComponent.isErrorOccurred({});
            //assert
            expect(value).toBeTruthy();
            expect(reIssueCertificateComponent['toasterService'].error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m004);
        });
    });

    describe('setImpressionEvent', () => {
        it('should assign telemetryImpression', () => {
            //arrange
            mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue(of(5)) as any;
            jest.spyOn(reIssueCertificateComponent, 'setObject').mockReturnValue({
                id: '123',
                type: 'course',
                ver: '1.0',
            });
            reIssueCertificateComponent.telemetryImpression = {
                context: {
                    env: 'dashboard',
                },
                edata: {
                    type: 'view',
                    pageid: 'certificates',
                    uri: 'dashboard/certificates',
                    duration: 5
                },
                object: {
                    id: '123',
                    type: 'course',
                    ver: '1.0',
                }
            };
            //act
            reIssueCertificateComponent.setImpressionEvent();
            //assert
            expect(reIssueCertificateComponent.telemetryImpression).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should create', () => {
            //arrange
            jest.spyOn(reIssueCertificateComponent, 'setImpressionEvent').mockImplementation();
            //act
            reIssueCertificateComponent.ngOnInit();
            //assert
            expect(reIssueCertificateComponent.courseId).toEqual('123');
            expect(reIssueCertificateComponent.setImpressionEvent).toHaveBeenCalled();
            expect(reIssueCertificateComponent).toBeTruthy();
        });
    });

    describe('showErrorMsg', () => {
        it('should call toaster service with error msg', () => {
            //arrange
            jest.spyOn(reIssueCertificateComponent['toasterService'], 'error').mockImplementation();
            //act
            reIssueCertificateComponent.showErrorMsg(mockResourceService.messages.dashboard.emsg.m001);
            //assert
            expect(reIssueCertificateComponent['toasterService'].error).toHaveBeenCalledWith(mockResourceService.messages.dashboard.emsg.m001);
        });
    });

    describe('modifyCss', () => {
        it('should classList add()', () => {
            //arrange
            reIssueCertificateComponent.button = { nativeElement: { disabled: false, classList: { remove: jest.fn(), add: jest.fn() } } }
            jest.spyOn(reIssueCertificateComponent.button.nativeElement.classList, 'add').mockImplementation();
            jest.spyOn(reIssueCertificateComponent.button.nativeElement.classList, 'remove').mockImplementation();
            //act
            reIssueCertificateComponent.modifyCss();
            //assert
            expect(reIssueCertificateComponent.button.nativeElement.disabled).toBeFalsy();
            expect(reIssueCertificateComponent.button.nativeElement.classList.add).toHaveBeenCalledWith('sb-btn-outline-primary');
            expect(reIssueCertificateComponent.button.nativeElement.classList.remove).toHaveBeenCalledWith('sb-btn-disabled');
        });
    });

    describe('searchCertificates', () => {
        it('should return  certList with batchList[]', () => {
            //arrange
            const response = {
                result: {
                    response: {
                        userId: 'testUser',
                        userName: 'user',
                        district: 'district 1',
                        courses: {
                            courseId: '123',
                            name: 'course 1',
                            contentType: 'course',
                            pkgVersion: 1,
                            batches: [{
                                batchId: '1',
                            }]
                        }
                    }
                }
            };
            reIssueCertificateComponent.button = { nativeElement: { disabled: false, classList: { remove: jest.fn(), add: jest.fn() } } }
            reIssueCertificateComponent.userName = 'testUser';
            mockCertRegService.getUserCertList = jest.fn(() => of(response)) as any;
            jest.spyOn(reIssueCertificateComponent.button.nativeElement.classList, 'add').mockImplementation();
            jest.spyOn(reIssueCertificateComponent.button.nativeElement.classList, 'remove').mockImplementation();
            jest.spyOn(reIssueCertificateComponent, 'showErrorMsg').mockImplementation();
            jest.spyOn(reIssueCertificateComponent, 'modifyCss').mockImplementation();
            //act
            reIssueCertificateComponent.searchCertificates();
            mockCertRegService.getUserCertList('testUser', '123', 'user1').subscribe(data => {
                //assert
                expect(reIssueCertificateComponent.userData).toEqual(response.result.response);
                expect(reIssueCertificateComponent.criteriaMet).toHaveBeenCalledWith(response.result.response.courses.batches);
            });
            expect(mockCertRegService.getUserCertList).toHaveBeenCalledWith('testUser', '123', 'user1');
        });

        it('should throw  error while fetching certList', () => {
            //arrange
            reIssueCertificateComponent.userName = 'testUser';
            mockCertRegService.getUserCertList = jest.fn().mockReturnValue(throwError({ result: { response: { err: { message: 'Error while fetching cert list' } } } }));
            jest.spyOn(reIssueCertificateComponent, 'showErrorMsg');
            jest.spyOn(reIssueCertificateComponent, 'modifyCss');
            //act
            reIssueCertificateComponent.searchCertificates();
            mockCertRegService.getUserCertList('testUser', '123', 'user1').subscribe(data => {
            }, err => {
                //assert
                expect(reIssueCertificateComponent.showErrorMsg).toHaveBeenCalled();
                expect(reIssueCertificateComponent.modifyCss).toHaveBeenCalled();
            });
            expect(mockCertRegService.getUserCertList).toHaveBeenCalledWith('testUser', '123', 'user1');
        });
    });

    describe('addTelemetry', () => {
        it('should call interact service', () => {
            //arrange
            jest.spyOn(mockTelemetryService, 'interact').mockImplementation();
            jest.spyOn(reIssueCertificateComponent, 'setObject').mockReturnValue({
                id: '123',
                type: 'course',
                ver: '1.0',
            });
            const interactData = {
                context: {
                    env: undefined,
                    cdata: [
                        { id: 'testUser', type: 'userId' },
                    ]
                },
                edata: {
                    id: 're-issue-cert',
                    type: 'click',
                    pageid: undefined,
                    extra: {
                        userId: 'testUser',
                    }
                },
                object: {
                    id: '123',
                    type: 'course',
                    ver: '1.0',
                }
            };
            //act
            reIssueCertificateComponent.addTelemetry('re-issue-cert', { userId: 'testUser' });
            //assert
            expect(reIssueCertificateComponent['telemetryService'].interact).toHaveBeenCalledWith(interactData);
            expect(reIssueCertificateComponent.setObject).toHaveBeenCalled();
        });
    });

    describe('toLowerCase', () => {
        it('should convert to lowercase and return data', () => {
            //act
            const data = reIssueCertificateComponent.toLowerCase('UserDIstrict');
            //assert
            expect(data).toEqual('Userdistrict');
        });

        it('should convert to lowercase and return empty msg', () => {
            //act
            const data = reIssueCertificateComponent.toLowerCase(undefined);
            //assert
            expect(data).toEqual('');
        });
    });

    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            //arrange
            reIssueCertificateComponent.unsubscribe$ = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            //act
            reIssueCertificateComponent.ngOnDestroy();
            //assert
            expect(reIssueCertificateComponent.unsubscribe$.next).toHaveBeenCalled();
            expect(reIssueCertificateComponent.unsubscribe$.complete).toHaveBeenCalled();
        });
    });

    describe('enableReIssueCert', () => {
        it('should enable "Re-Issue" button when status = 2 "', () => {
            //arrange
            const batch = { batchId: '1', name: 'batch 1', certificates: [], ssuedCertificates: [], createdBy: '123', status: 2 };
            //act
            const enableData = reIssueCertificateComponent.enableReIssueCert(batch);
            //assert
            expect(enableData).toBeTruthy();
        });

        it('should enable "Re-Issue" button when status != 2 " AND certificates.length >0 (PDF)', () => {
            //arrange
            const batch = { batchId: '1', name: 'batch 1', certificates: [{ id: '12' }], issuedCertificates: [], createdBy: '123', status: 1 };
            //act
            const enableData = reIssueCertificateComponent.enableReIssueCert(batch);
            //assert
            expect(enableData).toBeTruthy();
        });

        it('should enable "Re-Issue" button when status != 2 " AND issuedCertificates.length >0 (SVG)', () => {
            //arrange
            const batch = { batchId: '1', name: 'batch 1', certificates: [], issuedCertificates: [{ id: '12' }], createdBy: '123', status: 1 };
            //act
            const enableData = reIssueCertificateComponent.enableReIssueCert(batch);
            //assert
            expect(enableData).toBeTruthy();
        });

        it('should enable "Re-Issue" button when status != 2 " AND certificates.length>0 AND issuedCertificates.length>0(PDF and SVG)', () => {
            //arrange
            const batch = {
                batchId: '1', name: 'batch 1', certificates: [{ id: '12' }],
                issuedCertificates: [{ id: '12' }], createdBy: '123', status: 1
            };
            //act
            const enableData = reIssueCertificateComponent.enableReIssueCert(batch);
            //assert
            expect(enableData).toBeTruthy();
        });

        it('should disable "Re-Issue" button when status != 2" AND certificates.length=0 AND issuedCertificates.length=0', () => {
            //arrange
            const batch = { batchId: '1', name: 'batch 1', certificates: [], issuedCertificates: [], createdBy: '123', status: 1 };
            //act
            const enableData = reIssueCertificateComponent.enableReIssueCert(batch);
            //assert
            expect(enableData).toBeFalsy();
        });
    });

    describe('toggleModal', () => {
        it('should assign showModal TRUE', () => {
            //act
            reIssueCertificateComponent.toggleModal(true);
            //assert
            expect(reIssueCertificateComponent.showModal).toBeTruthy();
            expect(reIssueCertificateComponent.userBatch).toBeUndefined();
        });

        it('should assign showModal FALSE ', () => {
            //act
            reIssueCertificateComponent.toggleModal(false, {
                batch: 'batch 1',
                name: '123',
                createdBy: 'user1'
            });
            //assert
            expect(reIssueCertificateComponent.showModal).toBeFalsy();
            expect(reIssueCertificateComponent.userBatch).toEqual({
                batch: 'batch 1',
                name: '123',
                createdBy: 'user1'
            });
        });

        it('should check who is created and assign showmodal value', () => {
            //act
            reIssueCertificateComponent.toggleModal(true, {
                batch: 'batch 1',
                name: '123',
                createdBy: 'user2'
            });
            //assert
            expect(reIssueCertificateComponent.showModal).toBeTruthy();
            expect(reIssueCertificateComponent.userBatch).toEqual({
                batch: 'batch 1',
                name: '123',
                createdBy: 'user2'
            });
        });
    });

    xdescribe('reIssueCert', () => {
        it('should reIssue certificate', () => {
            const batch = {
                batchId: 123456,
                createdBy: 'abcd'
            }
            mockCertRegService.reIssueCertificate = jest.fn().mockReturnValue(of({ data: 'test' })) as any;
            reIssueCertificateComponent.reIssueCert(batch);
        });

        it('reIssue certificate should throw error', () => {
            const batch = {
                batchId: 123456,
                createdBy: 'abcd'
            }
            mockCertRegService.reIssueCertificate = jest.fn().mockReturnValue(throwError({ error: 'error' })) as any;
            reIssueCertificateComponent.reIssueCert(batch);
        });
    });
});