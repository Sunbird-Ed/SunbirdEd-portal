import { Router } from '@angular/router';
import { SlUtilsService } from '@shikshalokam/sl-questionnaire';
import { SuiModalService } from '@project-sunbird/ng2-semantic-ui';
import { ConfigService, ResourceService } from '../../../shared';
import { UserService, KendraService, FormService } from '..';
import { ObservationUtilService } from './observation-util.service';
import { of, throwError } from 'rxjs';

describe('ObservationUtilService', () => {
    let observationUtilService: ObservationUtilService;
    const mockConfig: Partial<ConfigService> = {};
    const mockFormService: Partial<FormService> = {};
    const mockRouter: Partial<Router> = {};
    const mockUserService: Partial<UserService> = {
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id'],
                profileUserType: {
                    type: 'administrator'
                }
            } as any
        }) as any,
    };
    const mockKendraService: Partial<KendraService> = {};
    const mockSlUtil: Partial<SlUtilsService> = {};
    const mockModalService: Partial<SuiModalService> = {};
    const mockResourceService: Partial<ResourceService> = {};

    beforeAll(() => {
        observationUtilService = new ObservationUtilService(
            mockUserService as UserService,
            mockConfig as ConfigService,
            mockKendraService as KendraService,
            mockModalService as SuiModalService,
            mockResourceService as ResourceService,
            mockRouter as Router,
            mockSlUtil as SlUtilsService,
            mockFormService as FormService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should be create a instance of observationUtilService', () => {
        expect(observationUtilService).toBeTruthy();
    });

    describe('getProfileData', () => {
        it('should return true if subtype is not null', (done) => {
            observationUtilService.getProfileData().then((res) => {
                setTimeout(() => {
                    expect(res).toBeTruthy();
                    done();
                }, 0);
            });
        });

        it('should return false if subtype is null', (done) => {
            mockUserService.userData$.subscribe((data) => {
                data.userProfile['profileUserType']['subType'] = null;
            });
            observationUtilService.getProfileData().then((data) => {
                setTimeout(() => {
                    expect(data).toBeFalsy();
                    done();
                }, 0);
            });
        });

        it('should return true if profiletype is not administrator', (done) => {
            mockUserService.userData$.subscribe((data) => {
                data.userProfile = null;
            });
            observationUtilService.getProfileData().then((data) => {
                setTimeout(() => {
                    expect(data).toBeTruthy();
                    done();
                }, 0);
            });
        });
    });

    describe('getProfileDataList', () => {
        beforeEach(() => {
            window.sessionStorage.clear();
            jest.clearAllMocks();
            jest.resetAllMocks();
        });

        it('should return profile data for type', (done) => {
            const res = {
                    userLocations: [{ type: 'sample-state', id: 'sample-id' }],
                    organisations: [{
                        isSchool: true,
                        externalId: 'externalId'
                    }],
                    profileUserTypes: [{
                        type: 'sample-Type'
                    }]
            };
            jest.spyOn(Storage.prototype, 'getItem');
            Storage.prototype.getItem = jest.fn(() => JSON.stringify(res));
            observationUtilService.getProfileDataList().then((data) => {
                setTimeout(() => {
                    expect(data).toStrictEqual({
                        role: 'SAMPLE-TYPE',
                        'sample-state': 'sample-id',
                        school: 'externalId'
                    });
                    done();
                }, 0);
            });
        });

        it('should return profile data for subType', (done) => {
            const res = {
                    userLocations: [{ type: 'sample-state', id: 'sample-id' }],
                    organisations: [{
                        isSchool: true,
                        externalId: 'externalId'
                    }],
                    profileUserTypes: [{
                        subType: 'sample-subType'
                    }]
            };
            jest.spyOn(Storage.prototype, 'getItem');
            Storage.prototype.getItem = jest.fn(() => JSON.stringify(res));
            observationUtilService.getProfileDataList().then((data) => {
                setTimeout(() => {
                    expect(data).toStrictEqual({
                        role: 'SAMPLE-SUBTYPE',
                        'sample-state': 'sample-id',
                        school: 'externalId'
                    });
                    done();
                }, 0);
            });
        });
    });

    describe('getMandatoryEntities', () => {
        it('should be return entries', (done) => {
            jest.spyOn(observationUtilService, 'getProfileDataList').mockImplementation(() => {
                return Promise.resolve({});
            });
            mockConfig.urlConFig = {
                URLS: {
                    OBSERVATION: {
                        MANDATORY_ENTITY_TYPES_FOR_ROLES: 'teacher'
                    }
                }
            };
            observationUtilService.dataParam = {
                state: 'sample-state',
                role: 'teacher'
            };
            mockKendraService.get = jest.fn(() => of({
                result: [{
                    id: 'sample-id'
                }]
            })) as any;
            observationUtilService.getMandatoryEntities();
            setTimeout(() => {
                expect(mockKendraService.get).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should be return entries', (done) => {
            jest.spyOn(observationUtilService, 'getProfileDataList').mockImplementation(() => {
                return Promise.resolve({});
            });
            mockConfig.urlConFig = {
                URLS: {
                    OBSERVATION: {
                        MANDATORY_ENTITY_TYPES_FOR_ROLES: 'teacher'
                    }
                }
            };
            observationUtilService.dataParam = {
                state: 'sample-state',
                role: 'teacher',
                id: 'sample-id'
            };
            mockKendraService.get = jest.fn(() => of({
                result: ['id']
            })) as any;
            const data = observationUtilService.getMandatoryEntities();
            setTimeout(() => {
                expect(mockKendraService.get).toHaveBeenCalled();
                expect(data).toBeTruthy();
                done();
            }, 0);
        });

        it('should be return false for empty result', (done) => {
            jest.spyOn(observationUtilService, 'getProfileDataList').mockImplementation(() => {
                return Promise.resolve({});
            });
            mockConfig.urlConFig = {
                URLS: {
                    OBSERVATION: {
                        MANDATORY_ENTITY_TYPES_FOR_ROLES: 'teacher'
                    }
                }
            };
            observationUtilService.dataParam = {
                state: 'sample-state',
                role: 'teacher',
                id: 'sample-id'
            };
            mockKendraService.get = jest.fn(() => of({
                result: []
            })) as any;
            observationUtilService.getMandatoryEntities();
            setTimeout(() => {
                expect(mockKendraService.get).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should be return false for empty result', (done) => {
            jest.spyOn(observationUtilService, 'getProfileDataList').mockImplementation(() => {
                return Promise.resolve({});
            });
            mockConfig.urlConFig = {
                URLS: {
                    OBSERVATION: {
                        MANDATORY_ENTITY_TYPES_FOR_ROLES: 'teacher'
                    }
                }
            };
            observationUtilService.dataParam = {
                state: 'sample-state',
                role: 'teacher',
                id: 'sample-id'
            };
            mockKendraService.get = jest.fn(() => throwError({
                error: {}
            })) as any;
            observationUtilService.getMandatoryEntities();
            setTimeout(() => {
                expect(mockKendraService.get).toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    describe('getProfileInfo', () => {
        it('should return false for empty profile', (done) => {
            jest.spyOn(observationUtilService, 'getProfileData').mockImplementation(() => {
                return Promise.resolve(false);
            });

            observationUtilService.getProfileInfo().then((res) => {
                setTimeout(() => {
                    expect(res).toBeFalsy();
                    done();
                }, 0);
            });
        });

        it('should return true for mandatoryFields profile', (done) => {
            jest.spyOn(observationUtilService, 'getProfileData').mockImplementation(() => {
                return Promise.resolve(true);
            });
            jest.spyOn(observationUtilService, 'getMandatoryEntities').mockImplementation(() => {
                return Promise.resolve({});
            });

            observationUtilService.getProfileInfo().then((res) => {
                setTimeout(() => {
                    expect(res).toBeTruthy();
                    done();
                }, 0);
            });
        });

        it('should return false for empty mandatoryFields profile', (done) => {
            jest.spyOn(observationUtilService, 'getProfileData').mockImplementation(() => {
                return Promise.resolve(true);
            });
            jest.spyOn(observationUtilService, 'getMandatoryEntities').mockImplementation(() => {
                return Promise.resolve(false);
            });

            observationUtilService.getProfileInfo().then((res) => {
                setTimeout(() => {
                    expect(res).toBeFalsy();
                    done();
                }, 0);
            });
        });
    });

    describe('showPopupAlert', () => {
        it('should show a popup', (done) => {
            mockModalService.open = jest.fn(() => ({
                onApprove: jest.fn((a) => a({id: 'id'})),
                onDeny: jest.fn((a, b) => b({val: {}}))
            })) as any;
            const alertData = {};
            observationUtilService.showPopupAlert(alertData).then(() => {
                setTimeout(() => {
                    expect(mockModalService.open).toHaveBeenCalled();
                    done();
                }, 0);
            });
        });
    });

    it('should return AlertMetaData', () => {
        observationUtilService.getAlertMetaData();
    });

    describe('browseByCategoryForm', () => {
        it('should return browseByCategoryForm', (done) => {
            mockFormService.getFormConfig = jest.fn(() => of({
                id: 'sample-id'
            }));
            observationUtilService.browseByCategoryForm().then(() => {
                setTimeout(() => {
                    expect(mockFormService.getFormConfig).toHaveBeenCalled();
                    done();
                }, 0);
            });
        });

        it('should return not browseByCategoryForm for catch part', (done) => {
            mockFormService.getFormConfig = jest.fn(() => throwError({
                error: {}
            }));
            observationUtilService.browseByCategoryForm().catch(() => {
                setTimeout(() => {
                    expect(mockFormService.getFormConfig).toHaveBeenCalled();
                    done();
                }, 0);
            });
        });
    });
});
