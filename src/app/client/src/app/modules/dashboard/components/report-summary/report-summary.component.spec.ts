import { TelemetryModule } from '@sunbird/telemetry';
import { DashboardModule } from '@sunbird/dashboard';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ReportSummaryComponent } from './report-summary.component';
import { ReportService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReportSummaryComponent', () => {
  let component: ReportSummaryComponent;
  let fixture: ComponentFixture<ReportSummaryComponent>;
  configureTestSuite();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [ReportService],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, DashboardModule, TelemetryModule.forRoot(), RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
