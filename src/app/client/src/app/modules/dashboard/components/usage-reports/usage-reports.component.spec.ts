import { mockChartData } from './usage-reports.spec.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UsageService, CourseProgressService } from './../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import {SharedModule, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UsageReportsComponent } from './usage-reports.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { DataChartComponent } from '../data-chart/data-chart.component';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('UsageReportsComponent', () => {
  let component: UsageReportsComponent;
  let fixture: ComponentFixture<UsageReportsComponent>;
  const fakeActivatedRoute = {
    snapshot: { data: { telemetry: { pageid: 'org-admin-dashboard', env: 'dashboard', type: 'view' } } }
  };
  const routerStub = { url: '/dashBoard/organization' };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UsageReportsComponent, DataChartComponent],
      providers: [ ToasterService, UserService, NavigationHelperService, CourseProgressService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useValue: routerStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageReportsComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('chartData defaults to: []', () => {
    expect(component.chartData).toEqual([]);
  });
  it('isTableDataLoaded defaults to: false', () => {
    expect(component.isTableDataLoaded).toEqual(false);
  });
  it('makes expected calls of ngOnInit and render the report ', () => {
    const usageService = TestBed.get(UsageService);
    component.slug = 'sunbird';
    spyOn(document, 'getElementById').and.returnValue('sunbird');
    spyOn(component, 'renderReport').and.callThrough();
    spyOn(usageService, 'getData').and.returnValue(observableOf(mockChartData.configData));
    component.ngOnInit();
    expect(component.renderReport).toHaveBeenCalled();
    expect(component.noResult).toBeFalsy();
    expect(component.renderReport).toHaveBeenCalledWith(component.reportMetaData[0]);
    expect(component.reportMetaData).toBeDefined();
    expect(component.chartData.length).toBe(6);
  });
  it('should call downloadCSV method ', () => {
    const usageService = TestBed.get(UsageService);
    const toasterService = TestBed.get(ToasterService);
    component.slug = 'sunbird';
    spyOn(document, 'getElementById').and.returnValue('sunbird');
    spyOn(usageService, 'getData').and.returnValue(observableOf(mockChartData.configData));
    spyOn(component, 'renderReport').and.callThrough();
    spyOn(component, 'downloadCSV').and.callThrough();
    spyOn(toasterService, 'error').and.callThrough();
    component.ngOnInit();
    component.downloadCSV('/reports/sunbird/daily_metrics.csv');
    expect(usageService.getData).toHaveBeenCalled();
    });

    it('should call renderFiles method ', () => {
      const usageService = TestBed.get(UsageService);
      const toasterService = TestBed.get(ToasterService);
      component.slug = 'sunbird';
      spyOn(document, 'getElementById').and.returnValue('sunbird');
      spyOn(usageService, 'getData').and.returnValue(observableOf(mockChartData.configData));
      spyOn(component, 'renderReport').and.callThrough();
      component.ngOnInit();
      expect(component.renderReport).toHaveBeenCalled();
      expect(component.noResult).toBeFalsy();
      expect(component.renderReport).toHaveBeenCalledWith(component.reportMetaData[0]);
      expect(component.reportMetaData).toBeDefined();
      expect(component.files.length).toBe(4);
      expect(component.isFileDataLoaded).toBeTruthy();
      });
});
