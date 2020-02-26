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
    component.getImportedFilesList();
    component.telemetryActionsService.telemetryImportList().subscribe(data => {
      expect(data).toEqual(telemetryData.importList);
      expect(component.importFilesList).toEqual(telemetryData.importList.result.response);
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
  it('should call reyTryTelemetryImport', () => {
    const telemetryActionsService = TestBed.get(TelemetryActionsService);
    spyOn(component, 'setRetryImportTelemetry');
    spyOn(telemetryActionsService, 'reyTryTelemetryImport').and.returnValue(of(telemetryData.importList));
    component.reyTryTelemetryImport(telemetryData.filedetails);
    component.telemetryActionsService.reyTryTelemetryImport(telemetryData.filedetails).subscribe(data => {
      expect(data).toEqual(telemetryData.importList);
    });
    expect(component.setRetryImportTelemetry).toHaveBeenCalledWith(telemetryData.filedetails);
  });
});
