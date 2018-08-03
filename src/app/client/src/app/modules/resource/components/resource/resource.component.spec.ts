
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { SharedModule, ResourceService, ServerResponse, ConfigService, ToasterService, ICaraouselData, IAction } from '@sunbird/shared';
import { PageApiService, PlayerService, LearnerService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceComponent } from './resource.component';
import { Response } from './resource.component.spec.data';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
describe('ResourceComponent', () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;
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
      declarations: [ResourceComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should subscribe to service', () => {
    const pageSectionService = TestBed.get(PageApiService);
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
  it('should call playcontent', () => {
    const playerService = TestBed.get(PlayerService);
    const event = { data: { metaData: { identifier: '0122838911932661768' } } };
    spyOn(playerService, 'playContent').and.callFake(() => observableOf(event.data.metaData));
    component.playContent(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });
  it('should call inview method for visits data', () => {
    spyOn(component, 'prepareVisits').and.callThrough();
    component.prepareVisits(Response.event);
    expect(component.prepareVisits).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
});
