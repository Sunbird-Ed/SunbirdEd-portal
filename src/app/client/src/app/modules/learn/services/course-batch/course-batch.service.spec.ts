
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Observable, observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { SearchParam, LearnerService, UserService, ContentService, SearchService } from '@sunbird/core';
import { _ } from 'lodash-es';
import { CourseBatchService } from './course-batch.service';
import { mockData } from './course-batch.service.spec.data';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
describe('CourseBatchService', () => {
    let component: CourseBatchService;

    const searchService: Partial<SearchService> = {};
    const userService: Partial<UserService> = {
        loggedIn: true,
        slug: jest.fn().mockReturnValue('tn') as any,
        userData$: of({userProfile: {
          userId: 'sample-uid',
          rootOrgId: 'sample-root-id',
          rootOrg: {},
          roleOrgMap:{
            CONTENT_CREATOR:'CONTENT_CREATOR'
          },
          hashTagIds: ['id']
        } as any}) as any,
        setIsCustodianUser: jest.fn(),
        setGuestUser: jest.fn(),
        userid: 'sample-uid',
        appId: 'sample-id',
        getServerTimeDiff: '',
    };
    const content: Partial<ContentService> = {};
    const configService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                BATCH: {
                    GET_BATCHS: 'course/v1/batch/list',
                    GET_DETAILS:'course/v1/batch/read',
                    REMOVE_USERS:'course/v1/batch/user/remove',
                    ADD_USERS:'course/v1/batch/user/add',
                    UPDATE: 'course/v1/batch/update',
                    CREATE: 'course/v1/batch/create',
                    GET_PARTICIPANT_LIST: 'course/v1/batch/participants/list'
                },
                COURSE:{
                    UNENROLL_USER_COURSE:'course/v1/unenrol'
                },
                ADMIN:{
                    USER_SEARCH:'user/v3/search'
                }
            }
        }
    };
    const learnerService: Partial<LearnerService> = {
        post: jest.fn(),
        get:jest.fn(),
        patch:jest.fn()
    };

    beforeAll(() => {
        component = new CourseBatchService(
            searchService as SearchService,
            userService as UserService,
            content as ContentService,
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
    it('should create a instance of component and call the getBatchDetails method', () => {
        jest.spyOn(component.learnerService, 'get').mockReturnValue(of(mockData.batchData));
        const batchId = '123456';
        component.getBatchDetails(batchId);
        expect(component.learnerService.get).toBeCalled();
    });
    it('should create a instance of component and call the removeUsersFromBatch method', () => {
        const batchId = '123456';
        const request = {user:'remove'}
        component.removeUsersFromBatch(batchId,request);
        expect(component.learnerService.post).toBeCalled();
    });
    it('should create a instance of component and call the addUsersToBatch method', () => {
        const batchId = '123456';
        const request = {user:'add'}
        component.addUsersToBatch(batchId,request);
        expect(component.learnerService.post).toBeCalled();
    });
    it('should create a instance of component and call the updateBatch method', () => {
        const request = {update:'true'}
        component.updateBatch(request);
        expect(component.learnerService.patch).toBeCalled();
    });
    it('should create a instance of component and call the createBatch method', () => {
        const request = {update:'true'}
        component.createBatch(request);
        expect(component.learnerService.post).toBeCalled();
    });
    it('should create a instance of component and call the unenrollFromCourse method', () => {
        const data = {unenrollFromCourse:'true'}
        component.unenrollFromCourse(data);
        expect(component.learnerService.post).toBeCalled();
    });
    it('should create a instance of component and call the enrollToCourse method', () => {
        const data = {enrollToCourse:'true'}
        component.enrollToCourse(data);
        expect(component.learnerService.post).toBeCalled();
    });
    it('should create a instance of component and call the getParticipantList method', () => {
        jest.spyOn(component.learnerService, 'post').mockReturnValue(of(mockData.batchData));
        const data = {participentList:'get'}
        component.getParticipantList(data).subscribe(obj=>{});
        expect(component.learnerService.post).toBeCalled();
    });
    it('should create a instance of component and call the getUpdateBatchDetails method', () => {
        component['_updateBatchDetails'] = mockData.batchDataNew.result.response
        const value = component.getUpdateBatchDetails(mockData.batchDataNew.result.response.batchId).subscribe(obj=>{
            expect(JSON.stringify(obj)).toEqual(JSON.stringify(of(mockData.batchDataNew.result.response)));
        });
        
    });
    it('should create a instance of component and call the getUpdateBatchDetails method without _updateBatchDetails', () => {
        component['_updateBatchDetails'] = null;
        jest.spyOn(component,'getBatchDetails').mockReturnValue(of(mockData.batchData));
        const value = component.getUpdateBatchDetails(mockData.batchDataNew.result.response.batchId).subscribe(obj=>{});
        expect(component.getBatchDetails).toBeCalledWith(mockData.batchDataNew.result.response.batchId);
    });
    it('should create a instance of component and call the getEnrollToBatchDetails method', () => {
        component['_enrollToBatchDetails'] = mockData.batchDataNew.result.response
        const value = component.getEnrollToBatchDetails(mockData.batchDataNew.result.response.batchId).subscribe(obj=>{
            expect(JSON.stringify(obj)).toEqual(JSON.stringify(of(mockData.batchDataNew.result.response)));
        });
        
    });
    it('should create a instance of component and call the getEnrollToBatchDetails method without _updateBatchDetails', () => {
        component['_enrollToBatchDetails'] = null;
        jest.spyOn(component,'getBatchDetails').mockReturnValue(of(mockData.batchData));
        const value = component.getEnrollToBatchDetails(mockData.batchDataNew.result.response.batchId).subscribe(obj=>{});
        expect(component.getBatchDetails).toBeCalledWith(mockData.batchDataNew.result.response.batchId);
    });
    it('should create a instance of component and call the setUpdateBatchDetails method', () => {
        component['_updateBatchDetails'] = null;
        const value = component.setUpdateBatchDetails(mockData.batchDataNew);
        expect(component['_updateBatchDetails']).toEqual(mockData.batchDataNew);
    });
    it('should create a instance of component and call the setEnrollToBatchDetails method', () => {
        component['_enrollToBatchDetails'] = null;
        const value = component.setEnrollToBatchDetails(mockData.batchDataNew);
        expect(component['_enrollToBatchDetails']).toEqual(mockData.batchDataNew);
    });
    it('should create a instance of component and call the getUserList method', () => {
        component['defaultUserList'] = [{user1:'abcd'},{user2:'mnop'}]
        const value = component.getUserList({});
        expect(JSON.stringify(value)).toEqual(JSON.stringify(of([{user1:'abcd'},{user2:'mnop'}])));
    });
    it('should create a instance of component and call the getUserList method with requestBody having value', () => {
        component['defaultUserList'] = null;
        jest.spyOn(component.learnerService,'post').mockReturnValue(of(mockData.userProfile as any)as any) as any;
        component.userService = {
            userProfile: mockData.userProfile as any
        } as any;
        const requestBody = {
            filters: { 'status': '1' },
            query:'newUser',
            limit:100
          };
        const value = component.getUserList(requestBody).subscribe(data=>{
            expect(data).toEqual(mockData.userProfile);
        });
        
    });
    it('should create a instance of component and call the getUserList method with requestBody having no value', () => {
        component['defaultUserList'] = null;
        jest.spyOn(component.learnerService,'post').mockReturnValue(of(mockData.userProfileNew as any)as any) as any;
        component.userService = {
            rootOrgId:'01285019302823526477',
            userProfile: mockData.userProfileNew as any
        } as any;
        const value = component.getUserList().subscribe(data=>{
            expect(data).toEqual(mockData.userProfileNew);
        });
        
    });
    
    
    describe('getAllBatchDetails', () => {
        it('should create a instance and call the getAllBatchDetails method', () => {
            jest.spyOn(learnerService, 'post');
            const searchParams: any = {
                filters: {
                    courseId: 'do_213878753577951232165',
                    status: ['1']
                }
            }
            const value = component.getAllBatchDetails(searchParams);
            expect(learnerService.post).toBeCalled();
        });

    });
    describe('getcertificateDescription', () => {
        it('should create a instance and call the getcertificateDescription method', () => {
            const value = component.getcertificateDescription(mockData.batchData.result.response);
            const obj = { isCertificate: true, description: '' }
            expect(JSON.stringify(value)).toEqual(JSON.stringify(obj))
        });
        it('should create a instance and call the getcertificateDescription method with description', () => {
            const value = component.getcertificateDescription(mockData.batchDataNew.result.response);
            const obj = { isCertificate: true, description: 'certificate for completion' }
            expect(JSON.stringify(value)).toEqual(JSON.stringify(obj))
        });
    });
    describe('getEnrolledBatchDetails', () => {
        it('should create a instance and call the getEnrolledBatchDetails method', () => {
            jest.spyOn(learnerService,'get').mockReturnValue(of(mockData.batchData));
            jest.spyOn(component,'getBatchDetails').mockReturnValue(of(mockData.batchData));
            const value = component.getEnrolledBatchDetails(mockData.batchData.result.response.batchId).subscribe(data =>{
            });
            expect(component.getBatchDetails).toBeCalled();
        });
        it('should create a instance and call the getEnrolledBatchDetails method with _enrolledBatchDetails', () => {
            component['_enrolledBatchDetails'] = mockData.batchDataNew.result.response
            const value = component.getEnrolledBatchDetails(mockData.batchDataNew.result.response.batchId).subscribe(data =>{
                expect(JSON.stringify(data)).toEqual(JSON.stringify(of(mockData.batchDataNew.result.response)))
            });
            
        });
    });
});