import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SharedModule, ResourceService, ConnectionService } from '@sunbird/shared';
import { SuiModalModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as _ from 'lodash-es';
import { LoadOfflineContentComponent } from './load-offline-content.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('LoadOfflineContentComponent', () => {
  let component: LoadOfflineContentComponent;
  let fixture: ComponentFixture<LoadOfflineContentComponent>;
  class FakeActivatedRoute {
    snapshot = {
      data: {
        telemetry: { env: 'library', pageid: 'library', type: 'view', subtype: 'paginate' }
      }
    };
  }
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        offline: 'You are offline',
        import: 'Import Books to access while offline',
        online: 'You are online',
        downloadBooks: 'Download books to access while offline',
      },
      btn: {
        loadContent: 'Load Content',
        browse: 'Browse Online'
      }
    },
    instance: 'tenant'
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ SuiModalModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterModule.forRoot([]),
    HttpClientTestingModule ],
    providers: [ { provide: ActivatedRoute, useClass: FakeActivatedRoute },
      { provide: ResourceService, useValue: resourceBundle }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadOfflineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    spyOn(component, 'addFontWeight');
    spyOn(component, 'setTelemetryData');
    component.ngOnInit();
    expect(component.instance).toEqual(_.upperCase(resourceBundle.instance));
    expect(connectionService.monitor).toHaveBeenCalled();
    expect(component.isConnected).toBeTruthy();
    expect(component.addFontWeight).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.cancelTelemetryInteractEdata.id).toEqual('cancel-load-content');
    expect(component.continueTelemetryInteractEdata.id).toEqual('load-content-from-browse');
  });

  it('should show content import model', () => {
    component.handleImportContentDialog();
    expect(component.showLoadContentModal).toBeTruthy();
  });

  it('should call showContentImportDialog', () => {
    component.showLoadContentModal = true;
    const electronDialogService = TestBed.get(ElectronService);
    spyOn(electronDialogService, 'get').and.returnValue(of({status: 'success'}));
    component.openImportContentDialog();
    expect(electronDialogService.get).toHaveBeenCalled();
  });

  it('should call addFontWeight on changeofevent ', () => {
    component.showLoadContentModal = true;
    fixture.detectChanges();
    spyOn(component, 'addFontWeight');
    spyOn(component, 'setTelemetryData');
    component.onChange('import');
    expect(document.getElementById('online')['checked']).toBeFalsy();
    expect(component.selectedValue).toEqual('import');
    expect(component.addFontWeight).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should call addFontWeight on changeofevent ', () => {
    spyOn(component, 'openImportContentDialog');
    component.showLoadContentModal = true;
    fixture.detectChanges();
    component.selectedValue = 'import';
    component.navigate();
    expect(component.openImportContentDialog).toHaveBeenCalled();
  });


});
