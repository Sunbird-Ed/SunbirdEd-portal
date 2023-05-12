import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UciComponent } from './uci.component';
import { ConfigService } from '@sunbird/shared';
import { UserService } from '../../../core/services/user/user.service';
import { ResourceService } from '../../../shared';
import { of } from 'rxjs';

describe('UciComponent', () => {
    let component: UciComponent;
    const userService: Partial<UserService> = {
        userData$: of({
            userProfile: {
                'missingFields': [],
                'updatedDate': '2018-07-09 16:07:35:977+0000',
                'completeness': 100,
                'id': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'identifier': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'rootOrgId': 'ORG_001',
                'firstName': 'Sunil',
                'phone': '******7878',
                'dob': '1982-01-01',
                'status': 1,
                'lastName': 'Pandith',
                'gender': 'Male',
                'email': 'su************@gmail.com',
                'phoneverified': null,
                'profileSummary': '.aa .   ',
                'userName': 'sunil1as990',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'emailVerified': null,
                'lastLoginTime': 1534920693649,
                'createdDate': '2017-11-03 05:28:41:536+0000',
                'createdBy': '',
                'location': 'Bangaloree',
                'rootOrgAdmin': false
            } as any
        }) as any
    };
    const configService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                "UCI": "/uci"
            }
        }
    };
    const resourceService: Partial<ResourceService> = {};

    beforeEach((() => {
        component = new UciComponent(
            userService as UserService,
            configService as ConfigService,
            resourceService as ResourceService
        );
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get user profile details', () => {
        // @ts-ignore
        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (id === 'blobUrl') {
                return { value: 'test' };
            }
            if (id === 'uciBotPhoneNumber') {
                return { value: 5222345667 };
            }
        });
        expect(component.blobUrl).toBeDefined();
        console.log(component.blobUrl)
        component.ngOnInit();
        expect(component.url).toEqual(configService.urlConFig.URLS.UCI);
    });
});