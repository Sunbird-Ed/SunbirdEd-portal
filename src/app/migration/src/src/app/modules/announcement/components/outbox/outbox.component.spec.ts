import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as testData from './outbox.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { OutboxComponent } from '../index';
import { AnnouncementService } from '@sunbird/core';
import { SharedModule, ResourceService, PaginationService, ToasterService, ConfigService, DateFormatPipe } from '@sunbird/shared';

describe('OutboxComponent', () => {
    let component: OutboxComponent;
    let fixture: ComponentFixture<OutboxComponent>;
    const fakeActivatedRoute = { 'params': Observable.from([{ 'pageNumber': 1 }]) };
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OutboxComponent],
            imports: [HttpClientTestingModule, Ng2IziToastModule,
                SuiModule, RouterTestingModule,
                SharedModule],
            providers: [HttpClientModule, AnnouncementService, ConfigService,
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
        spyOn(announcementService, 'getOutboxData').and.callFake(() => Observable.of(testData.mockRes.outBoxSuccess));
        component.renderOutbox(5, 1);
        const params = { pageNumber: 2, limit: 1 };
        announcementService.getOutboxData(params).subscribe(
            outboxResponse => {
                component.outboxData = outboxResponse;
            }
        );
        fixture.detectChanges();
        expect(component.showLoader).toBe(false);
        expect(component.pageNumber).toBe(1);
        expect(component.pageLimit).toBe(5);
        expect(component.outboxData.responseCode).toBe('OK');
        expect(component.outboxData.result.count).toBe(1169);
        expect(component.outboxData.params.status).toBe('successful');
    }));

    it('should call outbox api and get error response', inject([AnnouncementService, ToasterService],
        (announcementService, toasterService) => {
            spyOn(announcementService, 'getOutboxData').and.callFake(() => Observable.throw(testData.mockRes.outboxError));
            spyOn(toasterService, 'error').and.callThrough();
            component.renderOutbox(10, 3);
            const params = {};
            announcementService.getOutboxData({}).subscribe(
                outboxResponse => { },
                err => {
                    expect(err.error.params.errmsg).toBe('Cannot set property of undefined');
                    expect(err.error.params.status).toBe('failed');
                    expect(err.error.responseCode).toBe('CLIENT_ERROR');
                    expect(toasterService.error).toHaveBeenCalledWith(err.error.params.errmsg);
                }
            );
            fixture.detectChanges();
            expect(component.showLoader).toBe(false);
            expect(component.pageNumber).toBe(3);
            expect(component.pageLimit).toBe(10);
        }));

    it('should call setpage method and set proper page number', inject([ConfigService, Router],
        (configService, route) => {
            component.pager = {};
            component.pager.totalPages = 10;
            component.setPage(3);
            fixture.detectChanges();
            expect(component.pageNumber).toEqual(3);
            expect(component.pageLimit).toEqual(configService.pageConfig.OUTBOX.PAGE_LIMIT);
            expect(route.navigate).toHaveBeenCalledWith(['announcement/outbox', component.pageNumber]);
        }));

    it('should call setpage method and page number should be default, i,e 1', inject([ConfigService, Router],
        (configService, route) => {
            component.pager = {};
            component.pager.totalPages = 0;
            component.setPage(3);
            fixture.detectChanges();
            expect(component.pageNumber).toEqual(1);
            expect(component.pageLimit).toEqual(configService.pageConfig.OUTBOX.PAGE_LIMIT);
        }));
});
