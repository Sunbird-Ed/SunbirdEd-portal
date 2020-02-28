import { telemetry } from './telemetry.component.spec.data';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { FileSizeModule } from 'ngx-filesize';
import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryComponent } from './telemetry.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetryComponent ],
      imports: [ TelemetryModule.forRoot(), FileSizeModule, SharedModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useValue: RouterStub },
        { provide: ResourceService, useValue: telemetry.resourceBundle}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call telemetryActionService', () => {
    expect(component).toBeTruthy();
    spyOn(component['telemetryActionService'], 'getTelemetryInfo').and.returnValue(of(telemetry.info));
    component.getTelemetryInfo();
    component['telemetryActionService'].getTelemetryInfo().subscribe(data => {
      expect(data).toEqual(telemetry.info);
      expect(component.telemetryInfo).toEqual(telemetry.info.result.response);
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
    component.telemetryInfo = telemetry.info.result.response;
    spyOn(component['telemetryActionService'], 'exportTelemetry').and.returnValue(throwError(telemetry.exportError));
    spyOn(component['toasterService'], 'error');
    component.exportTelemetry();
    component['telemetryActionService'].exportTelemetry().subscribe(data => {
    }, (err) => {
      expect(err).toEqual(telemetry.exportError);
      expect(component['toasterService'].error).toHaveBeenCalledWith(telemetry.resourceBundle.messages.emsg.desktop.telemetryExportEMsg);
    });
  });
  // it('should call onChangeTelemetrySyncStatus', () => {
  //   spyOn(component, 'setTelemetrySyncStatus');
  //   spyOn(component['telemetryActionService'], 'telemetrySyncStatus').and.returnValue(of('true'));
  //   component.onChangeTelemetrySyncStatus('true');
  //   component['telemetryActionService'].telemetrySyncStatus('true').subscribe(data => {
  //   }, (err) => {

  //   });
  //   expect(component.setTelemetrySyncStatus).toHaveBeenCalledWith('true');
  // });
  // it('should call syncTelemetry', () => {
  //   component.telemetryInfo = telemetry.info.result.response;
  //   spyOn(component, 'setSyncTelemetry');
  //   spyOn(component['telemetryActionService'], 'syncTelemtry').and.returnValue(of('true'));
  //   component.syncTelemetry();
  //   component['telemetryActionService'].syncTelemtry(component.telemetryInfo).subscribe(data => {
  //   }, (err) => {

  //   });
  //   expect(component.setSyncTelemetry).toHaveBeenCalled();
  // });
});
