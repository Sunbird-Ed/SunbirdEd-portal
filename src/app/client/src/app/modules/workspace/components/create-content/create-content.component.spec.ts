
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { FrameworkService, PermissionService, UserService } from '@sunbird/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { WorkSpaceService } from './../../services';
import { _ } from 'lodash-es';
import { CreateContentComponent } from './create-content.component';
import { mockRes } from './create-content.component.spec.data'
describe('CreateContentComponent', () => {
    let component: CreateContentComponent;

    const configService: Partial<ConfigService> = {
        rolesConfig: mockRes
    };
    const resourceService: Partial<ResourceService> = {};
    const frameworkService: Partial<FrameworkService> = {
        initialize: jest.fn()
    };
    const permissionService: Partial<PermissionService> = {};
    const activatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({
            type: 'edit',
            courseId: 'do_456789',
            batchId: '124631256'
        }),
        params: of({ collectionId: "123" }),
        snapshot: {
            data: {
                telemetry: {
                    env: 'workspace',
                    pageid: 'content-create',
                    type: 'view',
                    subtype: 'paginate',
                    ver: '1.0',
                    uri: 'testUri'
                }
            }
        } as any
    };
    const userService: Partial<UserService> = {};
    const navigationhelperService: Partial<NavigationHelperService> = {
        getPageLoadTime: jest.fn().mockReturnValue('1ms')
    };
    const workSpaceService: Partial<WorkSpaceService> = {
        questionSetEnabled$: of({ questionSetEnablement: true }) as any,
        getFormData: jest.fn().mockReturnValue(of({})) as any,
    }

    beforeAll(() => {
        component = new CreateContentComponent(
            configService as ConfigService,
            resourceService as ResourceService,
            frameworkService as FrameworkService,
            permissionService as PermissionService,
            activatedRoute as ActivatedRoute,
            userService as UserService,
            navigationhelperService as NavigationHelperService,
            workSpaceService as WorkSpaceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call the ngOnInit', () => {
        jest.spyOn(workSpaceService, 'getFormData').mockReturnValue(of({ result: { form: { data: { fields: '1234' } } } }) as any) as any;
        component.ngOnInit();
        expect(frameworkService.initialize).toBeCalled();
    });

    it("should set telemetry data", (done) => {
        const obj = {
            context: { env: 'workspace' },
            edata: {
                type: 'view',
                pageid: 'content-create',
                uri: 'testUri',
                duration: 23123123
            }
        }
        navigationhelperService.getPageLoadTime = jest.fn().mockReturnValue(23123123);
        component.ngAfterViewInit();
        setTimeout(() => {
            expect(JSON.stringify(component.telemetryImpression)).toBe(JSON.stringify(obj));
            done()
        });
    });
    it('should create a instance of component and call the showCategory', () => {
        component.categoriesConfig=[{code:'abcd',visible:false}];
        const obj = component.showCategory('content');
        expect(obj).toBeFalsy();
    });
    it('should create a instance of component and call the showCategory with correct value', () => {
        component.categoriesConfig=[{code:'content',visible:true}];
        const obj = component.showCategory('content');
        expect(obj).toBeTruthy();
    });
});