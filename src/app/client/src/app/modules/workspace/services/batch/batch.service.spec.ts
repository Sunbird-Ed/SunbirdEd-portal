
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { ConfigService, ServerResponse } from '@sunbird/shared';
import { SearchParam, LearnerService, UserService, PlayerService } from '@sunbird/core';
import { _ } from 'lodash-es';
import { BatchService } from './batch.service';
import { of } from 'rxjs';
import * as data from './batch.service.spec.data'
describe('BatchService', () => {
    let component: BatchService;

    const userService: Partial<UserService> = {
        rootOrgId: '123',
        userProfile: {
            userId: 'sample-uid',
            rootOrgId: 'sample-root-id',
            rootOrg: {},
            hashTagIds: ['id'],
            roleOrgMap: {
                COURSE_MENTOR: ['COURSE_MENTOR']
            },
        } as any
    };
    const playerService: Partial<PlayerService> = {};
    const configService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                BATCH: {
                    CREATE: "course/v1/batch/create",
                    UPDATE: "course/v1/batch/update",
                    ADD_USERS: "course/v1/batch/user/add",
                    GET_DETAILS: "course/v1/batch/read",
                    GET_PARTICIPANT_LIST: "course/v1/batch/participants/list",
                    GET_BATCHS: "course/v1/batch/list",
                    REMOVE_USERS: "course/v1/batch/user/remove"
                },
                ADMIN: {
                    USER_SEARCH: "user/v3/search",
                }
            }
        }
    };
    const learnerService: Partial<LearnerService> = {
        post: jest.fn().mockImplementation(() => { }),
        get: jest.fn(),
        patch: jest.fn()
    };

    beforeAll(() => {
        component = new BatchService(
            userService as UserService,
            playerService as PlayerService,
            configService as ConfigService,
            learnerService as LearnerService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should call getParticipantList', () => {
        learnerService.post = jest.fn().mockReturnValue(of({})) as any;
        component.getParticipantList({}).subscribe((data) => expect(learnerService.post).toHaveBeenCalled());
    });

    it('should call removeUsersFromBatch', () => {
        learnerService.post = jest.fn().mockReturnValue(of({})) as any;
        component.removeUsersFromBatch('123', {});
        expect(learnerService.post).toHaveBeenCalled()
    });

    it('should set and get contextDetails correctly', () => {
        const batchData = { identifier: '123' };
        component.setBatchData(batchData)
        expect(component.batchDetails).toEqual(batchData);
    });

    it('should call updateBatch', () => {
        const mockRequest = { someData: 'value' };
        component.updateBatch(mockRequest);
        expect(learnerService.patch).toHaveBeenCalledTimes(1)
    });

    it('should call getBatchDetails with existing batch details', () => {
        learnerService.get = jest.fn().mockReturnValue(of(data.Response.getbatchDetailSucess)) as any;
        component.getBatchDetails('123');
        expect(learnerService.get).not.toHaveBeenCalled()
    });

    it('should call getBatchDetails without existing batch details', () => {
        learnerService.get = jest.fn().mockReturnValue(of(data.Response.getbatchDetailSucess)) as any;
        component.batchDetails = null
        component.getBatchDetails('123').subscribe(data => expect(learnerService.get).toHaveBeenCalled());
    });

    it('should call updateBatchDetails ', () => {
        learnerService.patch = jest.fn().mockReturnValue(of(data.Response.updateSucess)) as any;
        component.updateBatchDetails({
            name: 'test',
            description: 'test',
            enrollmentType: 'test',
            startDate: '',
            endDate: '',
            createdFor: 'test',
            id: '123',
            mentors: 'test',
        })
        expect(learnerService.patch).toHaveBeenCalled()
    });


    it('should call addUsersToBatch ', () => {
        learnerService.post = jest.fn().mockReturnValue(of(data.Response.addUserSucess)) as any;
        component.addUsersToBatch({
            name: 'test',
            description: 'test',
            enrollmentType: 'test',
            startDate: '',
            endDate: '',
            createdFor: 'test',
            id: '123',
            mentors: 'test',
        }, '123')
        expect(learnerService.post).toHaveBeenCalled()
    });

    it('should call getUpdateBatchDetails without existing batch details', () => {
        learnerService.get = jest.fn().mockReturnValue(of(data.Response.getbatchDetailSucess)) as any;
        component.batchDetails = null
        component.getUpdateBatchDetails('123').subscribe(data => expect(learnerService.get).toHaveBeenCalled());
    });

    it('should call getCourseHierarchy without existing course', () => {
        playerService.getCollectionHierarchy = jest.fn().mockReturnValue(of(data.Response.getbatchDetailSucess)) as any;
        component.getCourseHierarchy('123').subscribe(data => expect(playerService.getCollectionHierarchy).toHaveBeenCalled());
    });

    it('should call getCourseHierarchy with existing course', () => {
        component.courseHierarchy = {
            identifier: '123'
        }
        playerService.getCollectionHierarchy = jest.fn().mockReturnValue(of(data.Response.getbatchDetailSucess)) as any;
        component.getCourseHierarchy('123').subscribe(data => expect(playerService.getCollectionHierarchy).not.toHaveBeenCalled());
    });

    it('should call for ro', () => {
        learnerService.post = jest.fn().mockReturnValue(of({})) as any;
        component.getUserList({}).subscribe((data) => expect(learnerService.post).toHaveBeenCalled());
    });


    it('should call getUserList without request params', () => {
        learnerService.post = jest.fn().mockReturnValue(of({})) as any;
        component.getUserList({}).subscribe((data) => expect(learnerService.post).toHaveBeenCalled());
    });

    it('should call getUserList with request params', () => {
        learnerService.post = jest.fn().mockReturnValue(of({})) as any;
        userService.userProfile.roleOrgMap = { COURSE_MENTOR: ['COURSE_MENTOR', '123'] }
        component.getUserList({ 'abc': 'test' } as any).subscribe((data) => expect(learnerService.post).toHaveBeenCalled());
    });
});