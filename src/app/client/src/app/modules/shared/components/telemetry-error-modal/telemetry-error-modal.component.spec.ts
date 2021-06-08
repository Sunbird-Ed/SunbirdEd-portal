import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { TelemetryService } from '@sunbird/telemetry';
import { TelemetryErrorModalComponent } from './telemetry-error-modal.component';
import { configureTestSuite } from '@sunbird/test-util';
import { SbDatatableComponent } from '../sb-datatable/sb-datatable.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TelemetryErrorModalComponent', () => {
  let component: TelemetryErrorModalComponent;
  let fixture: ComponentFixture<TelemetryErrorModalComponent>;
  const telemetryEventMock = {"eid":"INTERACT","ets":1594279207141,"ver":"3.0","mid":"INTERACT:2a44e5e066c7438ddde627aba350d6d3","actor":{"id":"c1526b161339fe4fc544be6b78f2ae66","type":"User"},"context":{"channel":"0123166374296453124","pdata":{"id":"dev.sunbird.portal","ver":"3.1.0","pid":"sunbird-portal"},"env":"home","sid":"dfb26f00-33c6-6240-f65b-24e90b7147bc","did":"c1526b161339fe4fc544be6b78f2ae66","cdata":[{"id":"Desktop","type":"Device"}],"rollup":{"l1":"0123166374296453124"}},"object":{},"tags":["0123166374296453124"],"edata":{"id":"groups-tab","type":"click","pageid":"groups"}}
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
    // document.dispatchEvent(new CustomEvent("TelemetryEvent", {'detail': telemetryEventMock}));
    // document.dispatchEvent(new CustomEvent("TelemetryEvent", {'detail': telemetryEventMock}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show any elements by default ', () => {
    let telemetryService = TestBed.get(TelemetryService);
    telemetryService.telemetryEvents = [telemetryEventMock];
    let buttonElement = fixture.debugElement.query(By.css('#telemetry-btn'));
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      // expect((buttonElement.nativeElement as HTMLElement).style.display).toBe('none');
    });

    component.ngOnInit();
    expect(component.showTelemetryEventsModal).not.toBeTruthy();
    expect(component.telemetryEventsArr).toEqual(telemetryService.telemetryEvents);
  });

  it('should open telemetry events popup on telemetry button click', () => {
    let buttonElement = fixture.debugElement.query(By.css('#telemetry-btn'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(component.showTelemetryEventsModal).toBeTruthy();
    });
  })

  it('should open telemetry events popup on telemetry button click', () => {
    let buttonElement = fixture.debugElement.query(By.css('#telemetry-btn'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(component.showTelemetryEventsModal).toBeTruthy();
    });
  })

  it('should close telemetry events popup on popup close button click', () => {
    // let buttonElement = fixture.debugElement.query(By.css('#telemetry-btn'));
    // buttonElement.triggerEventHandler('click', null);
    // fixture.detectChanges();
    component.closeModal();
    expect(component.showTelemetryEventsModal).not.toBeTruthy();
    
  })
});
