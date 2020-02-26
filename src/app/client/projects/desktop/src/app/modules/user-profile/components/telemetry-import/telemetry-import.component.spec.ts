import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryImportComponent } from './telemetry-import.component';

xdescribe('TelemetryImportComponent', () => {
  let component: TelemetryImportComponent;
  let fixture: ComponentFixture<TelemetryImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetryImportComponent ]
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
});
