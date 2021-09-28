import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { TelemetryService } from '@sunbird/telemetry';
import { TelemetryErrorModalComponent } from './telemetry-error-modal.component';
import { configureTestSuite } from '@sunbird/test-util';
import { SbDatatableComponent } from '../sb-datatable/sb-datatable.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TelemetryErrorModalComponent', () => {
  let component: TelemetryErrorModalComponent;
  let fixture: ComponentFixture<TelemetryErrorModalComponent>;
  const telemetryEventMock = {'eid': 'ERROR', 'ets': 1594271968355, 'ver': '3.0', 'mid': 'INTERACT:2bc0d36dcd4721df6639d213a66c5077', 'actor': {'id': 'c1526b161339fe4fc544be6b78f2ae66', 'type': 'User'}, 'context': {'channel': '0123166374296453124', 'pdata': {'id': 'dev.sunbird.portal', 'ver': '3.1.0', 'pid': 'sunbird-portal'}, 'env': 'groups', 'sid': 'ce3e4e47-1041-9ced-27fd-bb7e7f6c6b49', 'did': 'c1526b161339fe4fc544be6b78f2ae66', 'cdata': [{'id': 'Desktop', 'type': 'Device'}], 'rollup': {'l1': '0123166374296453124'}}, 'object': {}, 'tags': ['0123166374296453124'], 'edata': {'err': 'PBK-CRT01', 'errType': 'Invalid data', 'traceid': 'rs3e4e47-1041-9ced-27fd-bb7e7f6c56bc', 'stacktrace': 'Error: Unkknown error at server.js'}};

  configureTestSuite();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetryErrorModalComponent ],
      imports: [SuiModule],
      providers: [SbDatatableComponent, TelemetryService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetryErrorModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show any elements by default ', () => {
    const telemetryService = TestBed.get(TelemetryService);
    telemetryService.telemetryEvents = [telemetryEventMock];

    component.ngOnInit();
    expect(component.showTelemetryEventsModal).not.toBeTruthy();
    expect(component.telemetryEventsArr).toEqual(telemetryService.telemetryEvents);
  });

  xit('should open telemetry events popup on telemetry button click', () => {
    const buttonElement = fixture.debugElement.query(By.css('#telemetry-btn'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.showTelemetryEventsModal).toBeTruthy();
    });
  });

  it('should close telemetry events popup on popup close button click', () => {
    component.closeModal();
    expect(component.showTelemetryEventsModal).not.toBeTruthy();
  });
});
