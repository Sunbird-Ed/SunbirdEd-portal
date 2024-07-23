
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { ContentService, PublicDataService, UserService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { map, catchError } from 'rxjs/operators';
import { _ } from 'lodash-es';
import { WorkSpaceService } from './../work-space/workspace.service';
import { EditorService } from './editor.service';
import { mockRes } from './editor.service.spec.data'
describe('EditorService', () => {
    let component: EditorService;

    const configService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                CONTENT_PREFIX: '/content/',
                CONTENT: {
                    GET: 'content/v1/read',
                    CREATE:'content/v1/create'
                }
            }
        },
        editorConfig: {
            rules: {
                'levels': 7,
                'objectTypes': []
            },
            'publishMode': false,
            'isFlagReviewer': false,
            DEFAULT_PARAMS_FIELDS: 'createdBy,status,mimeType,contentType,resourceType,collaborators,contentDisposition,primaryCategory,framework,targetFWIds,qumlVersion',
        }
    };
    const contentService: Partial<ContentService> = {
        post:jest.fn()
    };
    const publicDataService: Partial<PublicDataService> = {
        get: jest.fn()
    };
    const workspaceService: Partial<WorkSpaceService> = {
        getFormData: jest.fn()
    };
    const userService: Partial<UserService> = {
        loggedIn: true,
        slug: jest.fn().mockReturnValue('tn') as any,
        userData$: of({
            userProfile: {
                userId: 'sample-uid',
                rootOrgId: 'test_001',
                rootOrg: {},
                hashTagIds: ['id']
            } as any
        }) as any,
        setIsCustodianUser: jest.fn(),
        setGuestUser: jest.fn(),
        userid: 'sample-uid',
        appId: 'sample-id',
        getServerTimeDiff: '',
    };

    beforeAll(() => {
        component = new EditorService(
            configService as ConfigService,
            contentService as ContentService,
            publicDataService as PublicDataService,
            workspaceService as WorkSpaceService,
            userService as UserService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call the getOwnershipType method', () => {
        //workspaceService.getFormData = jest.fn(()=> of(mockRes.formData) as any) as any;
        jest.spyOn(workspaceService, 'getFormData').mockReturnValueOnce(of(mockRes.formData as any) as any) as any;
        component.userService = {
            userProfile: mockRes.userProfile as any
        } as any;
        component.getOwnershipType().subscribe(data => {
           expect(data).toEqual(['createdBy'])
        });
        expect(component.workspaceService.getFormData).toBeCalled();
    });
    it('should create a instance of component and call the getOwnershipType method with field Data', () => {
        jest.spyOn(workspaceService, 'getFormData').mockReturnValueOnce(of(mockRes.formDataWithFields as any) as any) as any;
        component.userService = {
            userProfile: mockRes.userProfile as any
        } as any;
        component.getOwnershipType().subscribe(data => {
            expect(data).toEqual('admin')
        });
        expect(component.workspaceService.getFormData).toBeCalled();
    });
    it('should create a instance of component and call the getOwnershipType method with error Data', () => {
        jest.spyOn(workspaceService, 'getFormData').mockReturnValueOnce(throwError({ error: 'true' } as any) as any) as any;
        component.userService = {
            userProfile: mockRes.userProfile as any
        } as any;
        component.getOwnershipType().subscribe(data => {
           expect(data).toEqual(['createdBy'])
        });
        expect(component.workspaceService.getFormData).toBeCalled();
    });
    it('should create a instance of component and call the getContent method', () => {
        jest.spyOn(publicDataService, 'get').mockReturnValueOnce(of(mockRes.successData) as any) as any;
        const contentId = 'do_2124791869184655361855';
        // const option = {
        //     params: {
        //     }
        // }
        component.getContent(contentId).subscribe(data => {
            expect(data).toEqual(mockRes.successData)
        });
    });
    it('should create a instance of component and call the create method', () => {
        jest.spyOn(contentService, 'post')
        const req = {
            content:{
                subject:['subject1','subject2']
            }
        }
        const option ={
            'url':'content/v1/create','data':{'request':{'content':{'subject':['subject1','subject2']}}}
        }
        component.create(req);
        expect(component.contentService.post).toBeCalled();
        expect(component.contentService.post).toBeCalledWith(option);
    });
    it('should create a instance of component and call the create method with subject and medium', () => {
        jest.spyOn(contentService, 'post')
        const req = {
            content:{
                subject:'subject1',
                medium: 'medium1'
            }
        }
        const option ={
            'url':'content/v1/create','data':{'request':{'content':{'subject':['subject1'],'medium':['medium1']}}}
        }
        component.create(req);
        expect(component.contentService.post).toBeCalled();
        expect(component.contentService.post).toBeCalledWith(option);
    });
});