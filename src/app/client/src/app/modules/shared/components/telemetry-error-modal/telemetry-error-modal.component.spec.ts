import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryErrorModalComponent } from './telemetry-error-modal.component';

describe('TelemetryErrorModalComponent', () => {
  let component: TelemetryErrorModalComponent;
  let fixture: ComponentFixture<TelemetryErrorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetryErrorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetryErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should catch telemetry event', () => {
    component.ngOnInit();
    var mockTelEvent = {"eid":"INTERACT","ets":1594279207141,"ver":"3.0","mid":"INTERACT:2a44e5e066c7438ddde627aba350d6d3","actor":{"id":"c1526b161339fe4fc544be6b78f2ae66","type":"User"},"context":{"channel":"0123166374296453124","pdata":{"id":"dev.sunbird.portal","ver":"3.1.0","pid":"sunbird-portal"},"env":"home","sid":"dfb26f00-33c6-6240-f65b-24e90b7147bc","did":"c1526b161339fe4fc544be6b78f2ae66","cdata":[{"id":"Desktop","type":"Device"}],"rollup":{"l1":"0123166374296453124"}},"object":{},"tags":["0123166374296453124"],"edata":{"id":"groups-tab","type":"click","pageid":"groups"}}
    document.dispatchEvent(new CustomEvent("TelemetryEvent", {'detail': mockTelEvent}));
  });
});
