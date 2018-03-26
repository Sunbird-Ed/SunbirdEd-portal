import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { mockRes } from './view-org-type.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SuiModule } from 'ng2-semantic-ui';
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
                SuiModule, RouterTestingModule,
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



    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('populateOrgType should return success', () => {
        const orgTypeService = TestBed.get(OrgTypeService);
        // const learnerService = TestBed.get(LearnerService);
        // spyOn(learnerService, 'get').and.returnValue(Observable.of(mockRes.orgTypeSuccess));
        orgTypeService.getOrgTypes();
        fixture.detectChanges();
        component.populateOrgType();
        fixture.detectChanges();
    });
});
