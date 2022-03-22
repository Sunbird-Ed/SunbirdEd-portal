import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SharedModule, ResourceService, ConnectionService } from '@sunbird/shared';
import { SuiModalModule } from 'ng2-semantic-ui-v9';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import * as _ from 'lodash-es';
import { LoadContentComponent } from './load-content.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { ElectronDialogService } from '../../services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Old One
xdescribe('LoadContentComponent', () => {
  let component: LoadContentComponent;
  let fixture: ComponentFixture<LoadContentComponent>;
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
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadContentComponent ],
      imports: [ SuiModalModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
    HttpClientTestingModule, BrowserAnimationsModule ],
    providers: [ { provide: ActivatedRoute, useClass: FakeActivatedRoute },
      { provide: ResourceService, useValue: resourceBundle }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const connectionService = TestBed.inject(ConnectionService);
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


  it('should call showContentImportDialog', () => {
    const electronDialogService = TestBed.inject(ElectronDialogService);
    spyOn(electronDialogService, 'showContentImportDialog');
    component.openImportContentDialog();
    expect(electronDialogService.showContentImportDialog).toHaveBeenCalled();
  });

  it('should call addFontWeight on changeofevent ', () => {
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
    component.selectedValue = 'import';
    component.navigate();
    expect(component.openImportContentDialog).toHaveBeenCalled();

  });


});
