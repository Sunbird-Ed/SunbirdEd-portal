
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as testData from './outbox.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { IAnnouncementListData, IPagination, IAnnouncementDetails } from '@sunbird/announcement';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { OutboxComponent } from '../index';
import { AnnouncementService } from '@sunbird/core';
import {
    SharedModule, ResourceService, PaginationService, ToasterService,
    ConfigService, DateFormatPipe, ServerResponse
} from '@sunbird/shared';

describe('OutboxComponent', () => {
    let component: OutboxComponent;
    let fixture: ComponentFixture<OutboxComponent>;
    const fakeActivatedRoute = {
        'params': observableOf({ 'pageNumber': 1 }),
        snapshot: {
            params: [
                {
                    announcementId: '123456',
                }
            ],
            data: {
                telemetry: {
                    env: 'announcement', pageid: 'announcement-outbox', type: 'workflow',
                    object: { type: 'announcement', ver: '1.0' }
                }
            }
        }
    };
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OutboxComponent],
            imports: [HttpClientTestingModule, Ng2IziToastModule,
                SuiModule, RouterTestingModule,
                SharedModule.forRoot(), TelemetryModule.forRoot(), NgInviewModule],
            providers: [HttpClientModule, AnnouncementService, ConfigService, HttpClient,
                PaginationService, ToasterService, ResourceService, DateFormatPipe,
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useValue: fakeActivatedRoute },
                { provide: RouterOutlet, useValue: fakeActivatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OutboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call outbox api and get success response', inject([AnnouncementService], (announcementService) => {
        spyOn(announcementService, 'getOutboxData').and.callFake(() => observableOf(testData.mockRes.outBoxSuccess));
        component.populateOutboxData(5, 1);
        const params = { pageNumber: 2, limit: 1 };
        announcementService.getOutboxData(params).subscribe(
            outboxResponse => {
                component.outboxData = outboxResponse.result;
                component.outboxData.count = outboxResponse.result.count;
                expect(outboxResponse.params.status).toBe('successful');
            }
        );
        fixture.detectChanges();
        expect(component.showLoader).toBe(false);
        expect(component.pageNumber).toBe(1);
        expect(component.pageLimit).toBe(5);
        expect(component.outboxData.count).toBe(1173);
    }));

    it('should call outbox api and get error response', inject([AnnouncementService, ToasterService, ResourceService,
        HttpClient, ConfigService],
        (announcementService, toasterService, resourceService, http, configService) => {
            spyOn(announcementService, 'getOutboxData').and.callFake(() => observableThrowError(testData.mockRes.outboxError));
            spyOn(component, 'populateOutboxData').and.callThrough();
            spyOn(resourceService, 'getResource').and.callThrough();
            spyOn(toasterService, 'error').and.callThrough();
            spyOn(http, 'get').and.callFake(() => observableOf(testData.mockRes.resourceBundle));
            http.get().subscribe(
                data => {
                    resourceService.messages = data.messages;
                }
            );
            component.populateOutboxData(configService.appConfig.ANNOUNCEMENT.OUTBOX.PAGE_LIMIT, component.pageNumber);
            announcementService.getOutboxData({}).subscribe(
                outboxResponse => { },
                err => {
                    expect(err.error.params.errmsg).toBe('Cannot set property of undefined');
                    expect(err.error.params.status).toBe('failed');
                    expect(err.error.responseCode).toBe('CLIENT_ERROR');
                    expect(component.showLoader).toBe(false);
                }
            );
            fixture.detectChanges();
            expect(component.pageNumber).toBe(component.pageNumber);
            expect(component.pageLimit).toBe(configService.appConfig.ANNOUNCEMENT.OUTBOX.PAGE_LIMIT);
        }));

    it('should call setpage method and set proper page number', inject([ConfigService, Router],
        (configService, route) => {
            component.pager = testData.mockRes.pager;
            component.pager.totalPages = 10;
            component.navigateToPage(3);
            fixture.detectChanges();
            expect(component.pageNumber).toEqual(3);
            expect(component.pageLimit).toEqual(configService.appConfig.ANNOUNCEMENT.OUTBOX.PAGE_LIMIT);
            expect(route.navigate).toHaveBeenCalledWith(['announcement/outbox', component.pageNumber]);
        }));

    it('should call setpage method and page number should be default, i,e 1', inject([ConfigService, Router],
        (configService, route) => {
            component.pager = testData.mockRes.pager;
            component.pager.totalPages = 0;
            component.navigateToPage(3);
            fixture.detectChanges();
            expect(component.pageNumber).toEqual(1);
            expect(component.pageLimit).toEqual(configService.appConfig.ANNOUNCEMENT.OUTBOX.PAGE_LIMIT);
        }));

    it('should call announcementDeleteEvent emitter', inject([AnnouncementService],
        (announcementService) => {
            component.outboxData = testData.mockRes.outBoxSuccess.result;
            announcementService.announcementDeleteEvent.emit();
            spyOn(announcementService, 'announcementDeleteEvent').and.callFake(() =>
                observableOf('1f1a50f0-e4a3-11e7-b47d-4ddf97f76f43'));
            announcementService.announcementDeleteEvent().subscribe(
                data => {
                    expect(data).toEqual('1f1a50f0-e4a3-11e7-b47d-4ddf97f76f43');
                }
            );
        }));

    it('should unsubscribe from all observable subscriptions', () => {
            component.populateOutboxData(5, 1);
            component.ngOnInit();
            spyOn(component.unsubscribe, 'complete');
            component.ngOnDestroy();
            expect(component.unsubscribe.complete).toHaveBeenCalled();
          });
});
