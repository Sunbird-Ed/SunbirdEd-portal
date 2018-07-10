
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { UserSearchService } from './../../services/user-search/user-search.service';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
    SharedModule, ServerResponse, PaginationService, ResourceService,
    ConfigService, ToasterService, INoResultMessage, RouterNavigationService
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService, BadgesService, BreadcrumbsService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { UserProfileComponent } from './user-profile.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './user-profile.component.spec.data';
import { OrderModule } from 'ngx-order-pipe';

describe('UserProfileComponent', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;
    const resourceBundle = {
        'messages': {
            'stmsg': {
                'm0008': 'no-results',
                'm0007': 'Please search for something else.'
            },
            'emsg': {
                'm0005': 'deleting user is failed'
            },
            'smsg': {
                'm0029': 'deleted sucessfully'
            }
        }
    };

    const fakeActivatedRoute = {
        'params': observableOf({ userId: '3' }),
        snapshot: {
            queryParams: {},
            data: {
                telemetry: {
                    env: 'user-profile'
                }
            }
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, SharedModule.forRoot(), Ng2IziToastModule, RouterTestingModule, OrderModule],
            declarations: [UserProfileComponent],
            providers: [ResourceService, SearchService, PaginationService, UserService,
                LearnerService, ContentService, ConfigService, ToasterService, UserSearchService, RouterNavigationService,
                BadgesService, BreadcrumbsService,
                { provide: ResourceService, useValue: resourceBundle },
                { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        component.userDetails = Response.successData;
    });

    it('should call search api and get success', () => {
        const searchService = TestBed.get(UserSearchService);
        const learnerService = TestBed.get(LearnerService);
        const resourceService = TestBed.get(ResourceService);
        spyOn(searchService, 'getUserById').and.callFake(() => observableOf(Response.successData));
        component.populateUserProfile();
        fixture.detectChanges();
        expect(component.userDetails).toBeDefined();
        expect(component.showLoader).toBeFalsy();
    });

    it('should call search api and get error', () => {
        const searchService = TestBed.get(UserSearchService);
        const toasterService = TestBed.get(ToasterService);
        const resourceService = TestBed.get(ResourceService);
        resourceService.messages = Response.resourceBundle.messages;
        spyOn(searchService, 'getUserById').and.callFake(() => observableThrowError(Response.errorData));
        spyOn(toasterService, 'error').and.callThrough();
        fixture.detectChanges();
        component.populateUserProfile();
        expect(component.showLoader).toEqual(false);
        expect(component.showError).toEqual(true);
        expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
    });

    it('should call populateUserProfile', () => {
        const userService = TestBed.get(UserService);
        spyOn(component, 'populateUserProfile').and.callThrough();
        userService._userData$.next({ err: null, userProfile: Response.userProfile });
        fixture.detectChanges();
        expect(component.populateUserProfile).toHaveBeenCalled();
    });

    it('should call toggle with true value', () => {
        component.toggle(true);
        expect(component.skillViewMore).toEqual(false);
    });

    it('should call toggle with false value', () => {
        component.toggle(false);
        expect(component.skillLimit).toEqual(4);
        expect(component.skillViewMore).toEqual(true);
    });

    it('should call badge toggle with true value', () => {
        component.userDetails = Response.successData.result.response;
        component.badgeToggle(true);
        expect(component.badgeViewMore).toEqual(false);
    });

    it('should call badge toggle with false value', () => {
        component.badgeToggle(false);
        expect(component.badgeLimit).toEqual(4);
        expect(component.badgeViewMore).toEqual(true);
    });

    it('should call populateBadgeDescription', () => {
        const badgesService = TestBed.get(BadgesService);
        spyOn(badgesService, 'getDetailedBadgeAssertions').and.callFake(() => observableOf(true));
        fixture.detectChanges();
        component.userDetails = Response.successData.result.response;
        component.populateBadgeDescription();
        expect(component.userDetails.badgeArray.length).toEqual(1);
    });

    it('should call formatEndorsementList', () => {
        component.userDetails = Response.userProfile.result.response;
        component.formatEndorsementList();
        expect(component.userDetails.skills.length).toBeGreaterThan(1);
    });

    it('should call submitEndorsement and get success response from learner service', () => {
        const learnerService = TestBed.get(LearnerService);
        const toasterService = TestBed.get(ToasterService);
        const resourceService = TestBed.get(ResourceService);
        resourceService.messages = Response.resourceBundle.messages;
        spyOn(toasterService, 'success').and.callThrough();
        spyOn(learnerService, 'post').and.callFake(() => observableOf(Response.skillSuccess));
        fixture.detectChanges();
        component.userDetails = Response.userProfile.result.response;
        component.submitEndorsement('test');
        expect(component.disableEndorsementButton).toEqual(false);
        expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0043);
    });

    it('should call submitEndorsement and get error response from learner service', () => {
        const learnerService = TestBed.get(LearnerService);
        const toasterService = TestBed.get(ToasterService);
        const resourceService = TestBed.get(ResourceService);
        resourceService.messages = Response.resourceBundle.messages;
        spyOn(toasterService, 'error').and.callThrough();
        spyOn(learnerService, 'post').and.callFake(() => observableThrowError(Response.skillError));
        fixture.detectChanges();
        component.userDetails = Response.userProfile.result.response;
        component.submitEndorsement('test');
        expect(component.disableEndorsementButton).toEqual(false);
        expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
    });






});
