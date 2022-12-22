import { mockRes } from './location.service.spec.data';
import { ConfigService } from '../../../../modules/shared/services/config/config.service';
import { LocationService } from './location.service';
import { FormService, LearnerService, UserService } from '../../../../modules/core';
import { of } from 'rxjs';

describe('LocationService', () => {
    let locationService: LocationService;

    const mockLearnerService: Partial<LearnerService> = {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn()
    };
    const mockUserService: Partial<UserService> = {
        getUserProfile: jest.fn()
    };
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                USER: {
                    "LOCATION_SEARCH": "data/v1/location/search",

                }
            }
        },
        appConfig: {
            timeOutConfig: {
                setTime: 1000
            }
        }
    };
    const mockFormService: Partial<FormService> = {
        getFormConfig: jest.fn()
    };

    beforeEach(() => {
        locationService = new LocationService(
            mockLearnerService as LearnerService,
            mockUserService as UserService,
            mockConfigService as ConfigService,
            mockFormService as FormService
        );
    });

    it('should be created', () => {
        expect(locationService).toBeTruthy();
    });

    it('should call getUserLocation method', () => {
        jest.spyOn(mockLearnerService, 'post').mockReturnValue(of(mockRes.successData));
        const request = {
            profileSummary: 'location'
        };
        locationService.getUserLocation(request).subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
        });
    });

    it('should call updateProfile method', (done) => {
        jest.spyOn(mockLearnerService, 'patch').mockImplementation(() => of(mockRes.successData));
        const request = {
            profileSummary: 'summary',
            userId: '159e93d1-da0c-4231-be94-e75b0c226d7c'

        };
        locationService.updateProfile(request).subscribe(apiResponse => {
            expect(apiResponse.responseCode).toBe('OK');
            expect(apiResponse.result.response).toBe('SUCCESS');
            setTimeout(() => {
                done();
            }, 1000)
        });
    });
});