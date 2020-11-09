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
      { provide: ResourceService, useValue: telemetryData.resourceBundle }
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
    spyOn(component.apiCallSubject, 'next');
    spyOn(telemetryActionsService, 'telemetryImportList').and.returnValue(of(telemetryData.importList));
    component.ngOnInit();
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });
  it('should call openImportTelemetryDialog', () => {
    const electronDialogService = TestBed.get(ElectronDialogService);
    spyOn(electronDialogService, 'showTelemetryImportDialog');
    spyOn(component, 'setImportTelemetry');
    component.openImportTelemetryDialog();
    expect(component.setImportTelemetry).toHaveBeenCalledWith();
    expect(electronDialogService.showTelemetryImportDialog).toHaveBeenCalled();
  });
  it('should call reTryTelemetryImport and success case', () => {
    const telemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(component, 'setRetryImportTelemetry');
    spyOn(component.apiCallSubject, 'next');
    spyOn(telemetryActionsService, 'reTryTelemetryImport').and.returnValue(of(telemetryData.retrySuccess));
    component.reTryImport(telemetryData.filedetails);
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(component.setRetryImportTelemetry).toHaveBeenCalledWith(telemetryData.filedetails);
  });
  it('should call reTryTelemetryImport and error case', () => {
    const telemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(component, 'setRetryImportTelemetry');
    spyOn(component.apiCallSubject, 'next');
    spyOn(component.toasterService, 'error');
    spyOn(telemetryActionsService, 'reTryTelemetryImport').and.returnValue(throwError(telemetryData.retryError));
    component.reTryImport(telemetryData.filedetails);
    expect(component.toasterService.error).
      toHaveBeenCalledWith(telemetryData.resourceBundle.messages.etmsg.desktop.telemetryImportError);
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(component.setRetryImportTelemetry).toHaveBeenCalledWith(telemetryData.filedetails);
  });

  it('should call getTotalSizeImportedFiles', () => {
    component.importFilesList = telemetryData.importList.result.response.items;
    component.importedFilesSize = 0;
    component.getTotalSizeImportedFiles();
    expect(component.importedFilesSize).toEqual(8260);
  });
});
