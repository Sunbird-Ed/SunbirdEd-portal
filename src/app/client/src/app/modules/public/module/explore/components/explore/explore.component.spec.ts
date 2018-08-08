import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { SharedModule, ResourceService, ServerResponse, ConfigService, ToasterService, ICaraouselData, IAction } from '@sunbird/shared';
import { PageApiService, PlayerService, LearnerService, CoreModule, OrgDetailsService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './explore.component.spec.data';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { ExploreComponent } from './explore.component';
import {} from 'jasmine';
import { PublicPlayerService } from './../../../../services';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0007': 'Please search something else',
        'm0006': 'NO result found'
      },
      'fmsg': {
        'm0004': 'fetching details failed'
      }
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ subject: ['English'], sortType: 'desc', sort_by: 'lastUpdatedOn' }),
    snapshot: {
      params: {
        slug: 'ap'
      },
      data: {
        telemetry: {
          env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate'
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule,
        SharedModule.forRoot(), CoreModule.forRoot(), NgInviewModule, TelemetryModule.forRoot()],
      declarations: [ExploreComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute }, OrgDetailsService, PublicPlayerService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should subscribe to service', () => {
    const pageSectionService = TestBed.get(PageApiService);
    const orgManagementService = TestBed.get(OrgDetailsService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(pageSectionService, 'getPageData').and.callFake(() => observableOf(Response.successData.result.response));
    component.populatePageData();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component).toBeTruthy();
    expect(component.showLoader).toBeFalsy();
    expect(component.caraouselData).toBeDefined();
  });

  it('should subscribe to service and no contents', () => {
    const pageSectionService = TestBed.get(PageApiService);
    const orgManagementService = TestBed.get(OrgDetailsService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(pageSectionService, 'getPageData').and.callFake(() => observableOf(Response.secondData.result.response));
    component.populatePageData();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component).toBeTruthy();
    expect(component.showLoader).toBeFalsy();
    expect(component.caraouselData).toBeDefined();
  });

  it('should subscribe to service and contents to be undefined', () => {
    const pageSectionService = TestBed.get(PageApiService);
    const learnerService = TestBed.get(LearnerService);
    const orgManagementService = TestBed.get(OrgDetailsService);
    spyOn(pageSectionService, 'getPageData').and.callFake(() => observableOf(Response.thirdData.result.response));
    component.populatePageData();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component).toBeTruthy();
    expect(component.showLoader).toBeFalsy();
    expect(component.caraouselData).toBeDefined();
  });

  it('should get error', () => {
    const pageSectionService = TestBed.get(PageApiService);
    const learnerService = TestBed.get(LearnerService);
    const orgManagementService = TestBed.get(OrgDetailsService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    const toasterService = TestBed.get(ToasterService);
    spyOn(pageSectionService, 'getPageData').and.callFake(() => observableThrowError(Response.error));
    spyOn(toasterService, 'error').and.callThrough();
    component.populatePageData();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0004);
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
