import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportTelemetryComponent } from './export-telemetry.component';

describe('ExportTelemetryComponent', () => {
  let component: ExportTelemetryComponent;
  let fixture: ComponentFixture<ExportTelemetryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportTelemetryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTelemetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
