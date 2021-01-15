import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ConnectionService, ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { FileSizeModule } from 'ngx-filesize';
import { of, throwError } from 'rxjs';
import { TelemetryComponent } from './telemetry.component';
import { telemetry } from './telemetry.component.spec.data';

describe('TelemetryComponent', () => {
  let component: TelemetryComponent;
  let fixture: ComponentFixture<TelemetryComponent>;

  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'telemetry',
          pageid: 'telemetry',
          subtype: 'paginate'
        }
      }
    };
  }

  const RouterStub = {
      url: 'http://localhost:9000/browse',
      events: of(new NavigationStart(0, 'http://localhost:9000/search')),
      navigate: jasmine.createSpy('navigate')
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetryComponent ],
      imports: [ TelemetryModule.forRoot(), FileSizeModule, SharedModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useValue: RouterStub },
        { provide: ResourceService, useValue: telemetry.resourceBundle},
        ConnectionService, ToasterService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetryComponent);
    component = fixture.componentInstance;
    component.telemetryImpression = {context: {env: ''}, edata: {type: '', pageid: '', uri: ''}};
    fixture.detectChanges();
  });

  it('should call telemetryActionService', () => {
    expect(component).toBeTruthy();
    spyOn(component['telemetryActionService'], 'getTelemetryInfo').and.returnValue(of(telemetry.info));
    component.getTelemetryInfo();
    component['telemetryActionService'].getTelemetryInfo().subscribe(data => {
      expect(data).toEqual(telemetry.info);
      expect(component.telemetryInfo.totalSize).toEqual(telemetry.info.result.response.totalSize);
    });
  });

  it('should call exportTelemetry', () => {
    expect(component).toBeTruthy();
    spyOn(component['telemetryActionService'], 'exportTelemetry').and.returnValue(of(telemetry.exportSuccess));
    spyOn(component, 'logTelemetry');
    spyOn(component, 'getTelemetryInfo');
    component.exportTelemetry();
    expect(component.logTelemetry).toHaveBeenCalledWith('export-telemetry');
    component['telemetryActionService'].exportTelemetry().subscribe(data => {
      expect(data).toEqual(telemetry.exportSuccess);
      expect(component.getTelemetryInfo).toHaveBeenCalled();
    });
  });

  it('should call logTelemetry', () => {
    expect(component).toBeTruthy();
    component.telemetryInfo = {
      totalSize: 100,
      lastExportedOn: 1584354597446
    };
    spyOn(component['telemetryActionService'], 'exportTelemetry').and.returnValue(throwError(telemetry.exportError));
    spyOn(component['toasterService'], 'error');
    component.exportTelemetry();
    component['telemetryActionService'].exportTelemetry().subscribe(data => {
    }, (err) => {
      expect(err).toEqual(telemetry.exportError);
      expect(component['toasterService'].error).toHaveBeenCalledWith(telemetry.resourceBundle.messages.emsg.desktop.telemetryExportEMsg);
    });
  });
  it('should call get sync status with enable status', () => {
    spyOn(component['telemetryActionService'], 'getSyncTelemetryStatus').and.returnValue(of(telemetry.getSyncStatus.enable));
    component.getSyncStatus();
    component['telemetryActionService'].getSyncTelemetryStatus().subscribe(data => {
      expect(data).toEqual(telemetry.getSyncStatus.enable);
      expect(component.syncStatus).toBeTruthy();
    });
  });
  it('should call get sync status with disable status', () => {
    spyOn(component['telemetryActionService'], 'getSyncTelemetryStatus').and.returnValue(of(telemetry.getSyncStatus.disable));
    component.getSyncStatus();
    component['telemetryActionService'].getSyncTelemetryStatus().subscribe(data => {
      expect(data).toEqual(telemetry.getSyncStatus.disable);
      expect(component.syncStatus).toBeFalsy();
    });
  });

  it('should call handleSyncStatus', () => {
    spyOn(component['telemetryActionService'], 'updateSyncStatus').and.returnValue(of(telemetry.updateSyncStatus));
    spyOn(component, 'setTelemetrySyncStatus');
    const data = {
      'request': {
        'enable': true
      }
    };
    component.handleSyncStatus(data);
    component['telemetryActionService'].updateSyncStatus(data).subscribe(response => {
      expect(response).toEqual(telemetry.updateSyncStatus);
    });
    expect(component.setTelemetrySyncStatus).toHaveBeenCalledWith(data);
  });
  it('should call syncTelemetry and show no internet toaster message', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(component, 'setSyncTelemetry');
    component.isConnected = false;
    component.telemetryInfo = telemetry.info.result.response;
    component.syncTelemetry();
    expect(toasterService.error).
    toHaveBeenCalledWith(telemetry.resourceBundle.messages.emsg.desktop.connectionError);
    expect(component.setSyncTelemetry).toHaveBeenCalledWith();
  });
  it('should call syncTelemetry and throw error while syncing', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(component, 'setSyncTelemetry');
    component.isConnected = true;
    component.telemetryInfo = {
      totalSize: 100,
      lastExportedOn: 1584354597446
    };
    const data  = {
      'request': {
        'type': ['TELEMETRY']
      }
    };
    component.syncTelemetry();
    component['telemetryActionService'].syncTelemtry(data).subscribe(response => {
    }, (err) => {

     expect(component.disableSync).toBeFalsy();
     expect(component.showSyncStatus).toBeFalsy();
      expect(err).toEqual(telemetry.telemetrySync.error);
      expect(toasterService.error).toHaveBeenCalledWith(telemetry.resourceBundle.messages.emsg.desktop.telemetrySyncError);
    });

    expect(component.setSyncTelemetry).toHaveBeenCalledWith();
  });
  it('should call syncTelemetry and sync successfuly', () => {
    const toasterService = TestBed.get(ToasterService);
    component.isConnected = true;
    spyOn(toasterService, 'error');
    spyOn(component, 'setSyncTelemetry');
    spyOn(component, 'getTelemetryInfo');
    component.telemetryInfo = {
      totalSize: 100,
      lastExportedOn: 1584354597446
    };
    const data  = {
      'request': {
        'type': ['TELEMETRY']
      }
    };
    component.syncTelemetry();
    component['telemetryActionService'].syncTelemtry(data).subscribe(response => {
     expect(component.showSyncStatus).toBeFalsy();
     expect(component.getTelemetryInfo).toHaveBeenCalled();
    }, (err) => {
    });
    expect(component.setSyncTelemetry).toHaveBeenCalledWith();
  });
});
