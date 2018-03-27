import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { mockRes } from './view-org-type.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { ViewOrgTypeComponent, OrgTypeService, IorgTypeData } from '@sunbird/org-management';
import { LearnerService } from '@sunbird/core';

import {
    SharedModule, ResourceService, PaginationService, ToasterService, ServerResponse
} from '@sunbird/shared';

describe('ViewOrgTypeComponent', () => {
    let component: ViewOrgTypeComponent;
    let fixture: ComponentFixture<ViewOrgTypeComponent>;
    const fakeActivatedRoute = { 'params': Observable.from([{ 'pageNumber': 1 }]) };
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewOrgTypeComponent],
            imports: [HttpClientTestingModule, Ng2IziToastModule,
                RouterTestingModule,
                SharedModule],
            providers: [HttpClientModule, OrgTypeService, HttpClient,
                PaginationService, ToasterService, ResourceService, LearnerService,
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useValue: fakeActivatedRoute },
                { provide: RouterOutlet, useValue: fakeActivatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewOrgTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('populateOrgType should return success', () => {
        const learnerService = TestBed.get(LearnerService);
        spyOn(learnerService, 'get').and.returnValue(Observable.of(mockRes.orgTypeSuccess));
        component.populateOrgType();
        expect(component.orgTypes[0].name).toBe('Test org type');
        expect(component.orgTypes[0].id).toBe('0123602925782302725');
        expect(component.showLoader).toBe(false);
    });

    it('populateOrgType should return error', () => {
        const toasterService = TestBed.get(ToasterService);
        spyOn(toasterService, 'error').and.callThrough();
        const resourceService = TestBed.get(ResourceService);
        resourceService.messages = mockRes.resourceBundle.messages;
        const learnerService = TestBed.get(LearnerService);
        spyOn(learnerService, 'get').and.returnValue(Observable.throw(mockRes.orgTypeError));
        component.populateOrgType();
        expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
        expect(component.showLoader).toBe(false);
    });


    it('should call orgTypeUpdateEvent emitter', () => {
        const orgTypeService = TestBed.get(OrgTypeService);
        component.orgTypes = mockRes.orgTypeSuccess.result.response;
        orgTypeService.orgTypeUpdateEvent.emit();
        spyOn(orgTypeService, 'orgTypeUpdateEvent').and.callFake(() =>
            Observable.of({ 'name': 'Test org type', 'id': '0123602925782302725' }));
        orgTypeService.orgTypeUpdateEvent().subscribe(
            data => {
                expect(data.id).toEqual(component.orgTypes[0].id);
            }
        );
    });
});
