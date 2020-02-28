import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryImportComponent } from './telemetry-import.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { FileSizeModule } from 'ngx-filesize';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, } from '@angular/router';
import { of, throwError } from 'rxjs';
import { telemetryData } from './telemetry-import.component.spec.data';
import { TelemetryActionsService } from './../../../offline/services';
import { ElectronDialogService } from '../../../offline/services';

describe('TelemetryImportComponent', () => {
  let component: TelemetryImportComponent;
  let fixture: ComponentFixture<TelemetryImportComponent>;

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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryImportComponent],
      imports: [TelemetryModule.forRoot(), FileSizeModule, SharedModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
         TelemetryActionsService, ElectronDialogService,
         { provide: ResourceService, useValue: telemetryData.resourceBundle}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetryImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getImportedFilesList', () => {
    const telemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(telemetryActionsService, 'telemetryImportList').and.returnValue(of(telemetryData.importList));
    component.apiCallSubject.next();
    component.telemetryActionsService.telemetryImportList().subscribe(data => {
      expect(data).toEqual(telemetryData.importList);
    });
  });
  it('should call openImportTelemetryDialog', () => {
    const electronDialogService = TestBed.get(ElectronDialogService);
    spyOn(electronDialogService, 'showTelemetryImportDialog');
    spyOn(component, 'setImportTelemetry');
    component.openImportTelemetryDialog();
    expect(component.setImportTelemetry).toHaveBeenCalledWith();
    expect(electronDialogService.showTelemetryImportDialog).toHaveBeenCalled();
  });
  it('should call reyTryTelemetryImport and success case', () => {
    const telemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(component, 'setRetryImportTelemetry');
    spyOn(telemetryActionsService, 'reyTryTelemetryImport').and.returnValue(of(telemetryData.retrySuccess));
    component.reTryImport(telemetryData.filedetails);
    component.telemetryActionsService.reTryTelemetryImport(telemetryData.filedetails).subscribe(data => {
      expect(data).toEqual(telemetryData.retrySuccess);
    });
    expect(component.setRetryImportTelemetry).toHaveBeenCalledWith(telemetryData.filedetails);
  });
  it('should call reyTryTelemetryImport and error case', () => {
    const telemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(component, 'setRetryImportTelemetry');
    spyOn(component['toasterService'], 'error');
    spyOn(telemetryActionsService, 'reyTryTelemetryImport').and.returnValue(of(telemetryData.retryError));
    component.reTryImport(telemetryData.filedetails);
    component.telemetryActionsService.reTryTelemetryImport(telemetryData.filedetails).subscribe(data => {
    }, error => {
      expect(error).toEqual(telemetryData.retryError);
      expect(component['toasterService'].error).
      toHaveBeenCalledWith(telemetryData.resourceBundle.messages.desktop.etmsg.telemetryImportError);

    });
    expect(component.setRetryImportTelemetry).toHaveBeenCalledWith(telemetryData.filedetails);
  });

});
