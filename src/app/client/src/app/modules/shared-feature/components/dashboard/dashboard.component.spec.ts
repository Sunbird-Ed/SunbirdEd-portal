import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { GroupsService } from '@sunbird/groups';
import { ToasterService, SharedModule, ConfigService, ResourceService } from '@sunbird/shared';
import { DashletModule } from '@project-sunbird/sb-dashlet-v9';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let activatedRoute;

  const MockDashletData = {
    rows: {
      values: [{
        'District': 'Ariyalur'
      }]
    },
    columns: [{ title: 'District', data: 'District' }]
  };

  const resourceBundle = {
    messages: { fmsg: { m0085: 'Fetching CSV failed, please try again later...' } }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        DashletModule.forRoot(),
        HttpClientTestingModule,
        CoreModule,
        SharedModule,
        RouterTestingModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
      ],
      providers: [
        GroupsService, ToasterService, ConfigService,
        { provide: ResourceService, useValue: resourceBundle },
      ], schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    activatedRoute = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    component.dashletData = MockDashletData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign dashlet data', () => {
    component.dashletData = MockDashletData;
    component.ngOnInit();
    expect(component.DashletRowData).toBeDefined();
    expect(component.columnConfig).toBeDefined();
  });

  it('should call downloadCSV', () => {
    const csvData = 'csv,csv';
    component.lib = {
      instance: {
        exportCsv: () => Promise.resolve(csvData)
      }
    };
    component.downloadCSV();
    component.lib.instance.exportCsv({ 'strict': true }).then(data => {
      expect(data).toEqual(csvData);
    });
  });

  it('should fail downloadCSV', () => {
    const csvData = 'csv,csv';
    component.lib = {
      instance: {
        exportCsv: () => Promise.reject('error')
      }
    };
    spyOn(component['toasterService'], 'error');
    component.downloadCSV();
    component.lib.instance.exportCsv({ 'strict': true }).then(data => { }).catch(err => {
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0085);
    });
  });
});
