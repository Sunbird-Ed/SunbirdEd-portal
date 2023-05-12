import { ActivatedRoute } from "@angular/router";
import { of, throwError } from "rxjs";
import { BadgesService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService } from  '@sunbird/shared';
import { ContentBadgeService } from "../../services";
import { AssignBadgesContentComponent } from "./assign-badges-content.component";
import { mockResponse } from "./assign-badges-content.component.spec.data"

describe("App Component", () => {
    let component: AssignBadgesContentComponent;

    const mockResourceService: Partial<ResourceService> = {
        messages: mockResponse.resourceBundle.messages
    };
    const mockBadgesService: Partial<BadgesService> = {};
    const mockContentBadgeService: Partial<ContentBadgeService> = {};
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };
    const mockUserService: Partial<UserService> = {
        loggedIn: true,
        slug: jest.fn().mockReturnValue("tn") as any,
        userData$: of({userProfile: mockResponse.userMockData}) as any,
        setIsCustodianUser: jest.fn(),
        userid: 'sample-uid',
        appId: 'sample-id',
        getServerTimeDiff: '',
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({}),
        params: of({collectionId: "123"})
    };

    beforeAll(() => {
        component = new AssignBadgesContentComponent(
            mockResourceService as ResourceService,
            mockUserService as UserService,
            mockBadgesService as BadgesService,
            mockToasterService as ToasterService,
            mockActivatedRoute as ActivatedRoute,
            mockContentBadgeService as ContentBadgeService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of Assign Badges Content Component', () => {
        expect(component).toBeTruthy();
    });

    describe('getBadgeDetails', () => {

        it('should get all badge list with success response', () => {
            // arrange
            mockBadgesService.getAllBadgeList = jest.fn().mockReturnValue(of(mockResponse.badgeSuccessResponse)) as any;
            component.userProfile = mockResponse.userMockData as any;
            // act
            component.getBadgeDetails();
            // assert
            expect(component.allBadgeList).toBeDefined();
        });

        it('should show alert message from params while get all badge list fail', () => {
            // arrange
            mockBadgesService.getAllBadgeList = jest.fn(() => throwError({error: {params: {errmsg: "ERROR"}}}))
            component.userProfile = mockResponse.userMockData as any;
            // act
            component.getBadgeDetails();
            // assert
            expect(mockToasterService.error).toBeCalledWith("ERROR");
        });

        it('should show default alert message while get all badge list fail', () => {
            // arrange
            mockBadgesService.getAllBadgeList = jest.fn(() => throwError({}))
            component.userProfile = mockResponse.userMockData as any;
            // act
            component.getBadgeDetails();
            // assert
            expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.fmsg.m0080);
        });
    });

    describe('assignBadge', () => {

        it('should assign badge successfully and show success message', () => {
            // arrange
            mockContentBadgeService.addBadge = jest.fn().mockReturnValue(of({}));
            mockContentBadgeService.setAssignBadge = jest.fn();
            component.allBadgeList = mockResponse.badgeData;
            // act
            component.assignBadge(mockResponse.setbadgesData)
            // assert
            expect(mockContentBadgeService.setAssignBadge).toHaveBeenCalledWith(mockResponse.setbadgesData);
            expect(mockToasterService.success).toHaveBeenCalledWith(mockResourceService.messages.smsg.m0044);
        });

        it('should show error alert if assign badge failed', () => {
            // arrange
            mockContentBadgeService.addBadge = jest.fn(() => throwError({}))
            // act
            component.assignBadge(mockResponse.setbadgesData)
            // assert
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0079);
        });
        
    });

    it('should set Interact Event Data', () => {
        // act
        component.setInteractEventData();
        // assert
        expect(component.badgeInteractEdata).toBeDefined();
        expect(component.cancelBadgeInteractEdata).toBeDefined();
        expect(component.assignBadgeInteractEdata).toBeDefined();
    });

    it('should set Badge', () => {
        // act
        component.setBadge(mockResponse.setbadgesData);
        // assert
        expect(component.badge).toEqual(mockResponse.setbadgesData);
    });

    it('should call ngOnDestroy', () => {
        //arrange
        component.userDataSubscription = of().subscribe();
        // act
        component.ngOnDestroy();
        // assert
        expect(component.userDataSubscription).toBeDefined()
    });

    it('should get badge details and set collection id from activated route params', () => {
        // arrange
        jest.spyOn(component, 'getBadgeDetails').mockImplementation();
        jest.spyOn(component, 'setInteractEventData').mockImplementation();
        // act
        component.ngOnInit();
        // assert
        expect(component.userProfile).toBeDefined();
        expect(component['userRoles']).toBeDefined();
        expect(component.getBadgeDetails).toBeCalled();
        expect(component.setInteractEventData).toBeCalled();
    });
    

})