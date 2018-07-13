
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as testData from './inbox.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { IAnnouncementListData, IPagination, IAnnouncementDetails, InboxComponent } from '@sunbird/announcement';
import { TelemetryModule } from '@sunbird/telemetry';

// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NgInviewModule } from 'angular-inport';
import { AnnouncementService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import {
    SharedModule, ResourceService, PaginationService, ToasterService,
    ConfigService, DateFormatPipe, ServerResponse
} from '@sunbird/shared';

describe('InboxComponent', () => {
    let component: InboxComponent;
    let fixture: ComponentFixture<InboxComponent>;
    const fakeActivatedRoute = {
        'params': observableOf({ 'pageNumber': 1 }),
        snapshot: {
            data: {
                telemetry: {
                    env: 'announcement', pageid: 'announcement-list', type: 'view', object: { type: 'announcement', ver: '1.0' }
                }
            }
        }
    };
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InboxComponent],
            imports: [HttpClientTestingModule, Ng2IziToastModule,
                SuiModule, RouterTestingModule, NgInviewModule,
                SharedModule.forRoot(), TelemetryModule.forRoot()],
            providers: [HttpClientModule, AnnouncementService, ConfigService, HttpClient,
                PaginationService, ToasterService, ResourceService, CacheService, DateFormatPipe,
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useValue: fakeActivatedRoute },
                { provide: RouterOutlet, useValue: fakeActivatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call inbox api and get success response', inject([AnnouncementService], (announcementService) => {
        spyOn(announcementService, 'getInboxData').and.callFake(() => observableOf(testData.mockRes.inBoxSuccess));
        spyOn(announcementService, 'receivedAnnouncement').and.callFake(() =>
            observableOf({ announcementId: '6f6932b0-db3e-11e7-b902-bf7fe7f2023a' }));
        component.populateInboxData(5, 1);
        const params = { pageNumber: 2, limit: 1 };
        announcementService.getInboxData(params).subscribe(
            inboxResponse => {
                component.inboxData = inboxResponse.result;
                component.inboxData.count = inboxResponse.result.count;
                announcementService.receivedAnnouncement().subscribe(
                    receivedResponse => { }
                );
                expect(inboxResponse.params.status).toBe('successful');
            }
        );
        fixture.detectChanges();
        expect(component.showLoader).toBe(false);
        expect(component.pageNumber).toBe(1);
        expect(component.pageLimit).toBe(5);
        expect(component.inboxData.count).toBe(1173);
    }));

    it('should call inbox api and get error response', inject([AnnouncementService, ToasterService, ResourceService,
        HttpClient, ConfigService],
        (announcementService, toasterService, resourceService, http, configService) => {
            spyOn(announcementService, 'getInboxData').and.callFake(() => observableThrowError(testData.mockRes.inboxError));
            spyOn(component, 'populateInboxData').and.callThrough();
            spyOn(resourceService, 'getResource').and.callThrough();
            spyOn(toasterService, 'error').and.callThrough();
            spyOn(http, 'get').and.callFake(() => observableOf(testData.mockRes.resourceBundle));
            http.get().subscribe(
                data => {
                    resourceService.messages = data.messages;
                }
            );
            component.populateInboxData(configService.appConfig.ANNOUNCEMENT.INBOX.PAGE_LIMIT, component.pageNumber);
            announcementService.getInboxData({}).subscribe(
                inboxResponse => { },
                err => {
                    expect(err.error.params.errmsg).toBe('Cannot set property of undefined');
                    expect(err.error.params.status).toBe('failed');
                    expect(err.error.responseCode).toBe('CLIENT_ERROR');
                    expect(component.showLoader).toBe(false);
                }
            );
            fixture.detectChanges();
            expect(component.pageNumber).toBe(component.pageNumber);
            expect(component.pageLimit).toBe(configService.appConfig.ANNOUNCEMENT.INBOX.PAGE_LIMIT);
        }));

    it('should call setpage method and set proper page number', inject([ConfigService, Router],
        (configService, route) => {
            component.pager = testData.mockRes.pager;
            component.pager.totalPages = 10;
            component.navigateToPage(3);
            fixture.detectChanges();
            expect(component.pageNumber).toEqual(3);
            expect(component.pageLimit).toEqual(configService.appConfig.ANNOUNCEMENT.INBOX.PAGE_LIMIT);
            expect(route.navigate).toHaveBeenCalledWith(['announcement/inbox', component.pageNumber]);
        }));

    it('should call setpage method and page number should be default, i,e 1', inject([ConfigService, Router],
        (configService, route) => {
            component.pager = testData.mockRes.pager;
            component.pager.totalPages = 0;
            component.navigateToPage(3);
            fixture.detectChanges();
            expect(component.pageNumber).toEqual(1);
            expect(component.pageLimit).toEqual(configService.appConfig.ANNOUNCEMENT.INBOX.PAGE_LIMIT);
        }));

    it('should call read api and get success response', inject([AnnouncementService, ConfigService],
        (announcementService, configService) => {
            component.inboxData = testData.mockRes.inBoxSuccess.result;
            spyOn(announcementService, 'readAnnouncement').and.callFake(() =>
                observableOf({ announcementId: '6f6932b0-db3e-11e7-b902-bf7fe7f2023a' }));
            component.readAnnouncement('6f6932b0-db3e-11e7-b902-bf7fe7f2023a', false);
            announcementService.readAnnouncement().subscribe(
                receivedResponse => { }
            );
            fixture.detectChanges();
            expect(component.pageNumber).toBe(1);
            expect(component.pageLimit).toBe(configService.appConfig.ANNOUNCEMENT.INBOX.PAGE_LIMIT);
            expect(component.inboxData.count).toBe(1173);
        }));

        it('should unsubscribe from all observable subscriptions', () => {
            component.populateInboxData(5, 1);
            component.readAnnouncement('6f6932b0-db3e-11e7-b902-bf7fe7f2023a', false);
            component.ngOnInit();
            spyOn(component.unsubscribe, 'complete');
            component.ngOnDestroy();
            expect(component.unsubscribe.complete).toHaveBeenCalled();
          });
});

