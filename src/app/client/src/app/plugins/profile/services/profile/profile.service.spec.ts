import { of } from 'rxjs';
import { ProfileService } from '@sunbird/profile';
import { LearnerService, UserService, FormService } from '@sunbird/core';
import { mockRes } from './profile.service.spec.data';
import { ConfigService } from '../../../../modules/shared';
describe('ProfileService', () => {
    let profileService: ProfileService;

    const mockLearnerService: Partial<LearnerService> = {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn()
    };
    const mockUserService: Partial<UserService> = {
        getUserProfile: jest.fn(),
    };
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                USER: {
                    SKILLS: "data/v1/skills",
                },
            }
        },
        appConfig: {
            timeOutConfig: {
                setTime: 1000
            }
        },
    };
    const mockFormService: Partial<FormService> = {
        getFormConfig: jest.fn()
    };

    beforeEach(() => {
        profileService = new ProfileService(
            mockLearnerService as LearnerService,
            mockUserService as UserService,
            mockConfigService as ConfigService,
            mockFormService as FormService
        );
    });

    it('should create ProfileService', () => {
        expect(profileService).toBeTruthy();
    });

    it('should call getSkills method', () => {
        jest.spyOn(mockLearnerService, 'get').mockReturnValue(of(mockRes.successData));
        profileService.getSkills().subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call add method', () => {
        jest.spyOn(mockLearnerService, 'post').mockReturnValue(of(mockRes.successData));
        const request = {
            'skillName': ['skills'],
            'endorsedUserId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
        };
        profileService.add(request).subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call updateProfile method', (done) => {
        mockLearnerService.patch = jest.fn(() => of(mockRes.successData) as any);
        const request = {
            profileSummary: 'summary'
        };
        profileService.updateProfile(request).subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
        setTimeout(() => {
            done();
        }, 2000);
    });

    it('should call updatePrivateProfile method', () => {
        jest.spyOn(mockLearnerService, 'patch').mockReturnValue(of(mockRes.successData));
        const request = {
            profileSummary: 'summary'
        };
        profileService.updatePrivateProfile(request).subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call getUserLocation method', () => {
        jest.spyOn(mockLearnerService, 'post').mockReturnValue(of(mockRes.successData));
        const request = {
            profileSummary: 'location'
        };
        profileService.getUserLocation(request).subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call downloadCertificates method', () => {
        jest.spyOn(mockLearnerService, 'post').mockReturnValue(of(mockRes.successData));
        const request = {
            profileSummary: 'download'
        };
        profileService.downloadCertificates(request).subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call updateProfileFieldVisibility method', () => {
        jest.spyOn(mockLearnerService, 'post').mockReturnValue(of(mockRes.successData));
        const request = {
            private: ['address'],
            userId: '159e93d1-da0c-4231-be94-e75b0c226d7c'
        };
        profileService.updateProfileFieldVisibility(request).subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });
    it('should call declarations method', (done) => {
        mockLearnerService.patch = jest.fn(() => of(mockRes.successData) as any);
        jest.spyOn(mockUserService, 'getUserProfile');
        const request = {
            profileSummary: 'summary'
        };
        profileService.declarations(request).subscribe(apiResponse => {
            mockUserService.getUserProfile();
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
        setTimeout(() => {
            done();
        }, 1000)
    });

    it('should call getPersonas method', () => {
        jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(of(mockRes.successData));
        profileService.getPersonas().subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call getPersonaTenantForm method', () => {
        jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(of(mockRes.successData));
        profileService.getPersonaTenantForm().subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call getSelfDeclarationForm method', () => {
        jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(of(mockRes.successData));
        profileService.getSelfDeclarationForm('submit').subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call getFaqReportIssueForm method', () => {
        jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(of(mockRes.successData));
        profileService.getFaqReportIssueForm('submit').subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });
});