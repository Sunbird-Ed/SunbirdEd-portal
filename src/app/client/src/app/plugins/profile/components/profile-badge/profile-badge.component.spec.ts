import { ResourceService, ConfigService } from '../../../../modules/shared';
import { UserService, BadgesService } from '../../../../modules/core/services';
import * as _ from 'lodash-es';
import { ProfileBadgeComponent } from './profile-badge.component';
import { mockRes } from './profile-badge.component.spec.data';
import { of } from 'rxjs';

describe("ProfileBadgeComponent", () => {
    let profileBadgeComponent: ProfileBadgeComponent;
    const mockResourceService: Partial<ResourceService> = {};
    const mockUserService: Partial<UserService> = {
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'sample-root-id',
                rootOrg: {},
                hashTagIds: ['id'],
                badgeAssertions: {
                    type: 'administrator'
                }
            } as any
        }) as any,
    };
    const mockBadgesService: Partial<BadgesService> = {};
    const mockConfigService: Partial<ConfigService> = {
        appConfig: {
            PROFILE: {
                defaultShowMoreLimit: 3
            }
        }
    } as any;

    beforeAll(() => {
        profileBadgeComponent = new ProfileBadgeComponent(
            mockResourceService as ResourceService,
            mockUserService as UserService,
            mockBadgesService as BadgesService,
            mockConfigService as ConfigService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(profileBadgeComponent).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should call getBadgeData method', () => {
            //arrange
            const req = {
                request: {
                    filters: {
                        'badgeList': mockRes.request.filters.badgeList,
                        'type': 'user',
                        'rootOrgId': mockRes.request.filters.rootOrgId
                    }
                }
            };
            mockUserService._userData$ = jest.fn(() => of({ err: null, userProfile: mockRes.data.userProfile })) as any;
            mockBadgesService.getDetailedBadgeAssertions = jest.fn().mockReturnValue(of(mockRes.badgeList)) as any;
            //act
            profileBadgeComponent.ngOnInit();
            //assert
            mockUserService.userData$.subscribe(userData => {
                expect(userData.userProfile).toBeDefined();
            });
            mockBadgesService.getDetailedBadgeAssertions(req, mockRes.data.userProfile.badgeAssertions).subscribe(badgeData => {
                expect(badgeData).toEqual(mockRes.badgeList);
            });
        });
    });

    describe('toggle', () => {
        it('should call toggle method with limit greater than 4', () => {
            //arrange
            const limit = true;
            profileBadgeComponent.badgeArray = [];
            profileBadgeComponent.badgeArray.length = 5;
            profileBadgeComponent.limit = profileBadgeComponent.badgeArray.length;
            //act
            profileBadgeComponent.toggle(limit);
            //assert
            expect(profileBadgeComponent.viewMore).toBe(false);
            expect(profileBadgeComponent.limit).toBeGreaterThan(4);
        });
        it('should call toggle method with limit lesser than 4', () => {
            //arrange
            const limit = false;
            //act
            profileBadgeComponent.toggle(limit);
            //assert
            expect(profileBadgeComponent.viewMore).toBe(true);
            expect(profileBadgeComponent.limit).toBeLessThanOrEqual(4);
        });
    });
});