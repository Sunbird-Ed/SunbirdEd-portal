import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineReportIssuesComponent } from './offline-report-issues.component';

xdescribe('OfflineReportIssuesComponent', () => {
  let component: OfflineReportIssuesComponent;
  let fixture: ComponentFixture<OfflineReportIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineReportIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineReportIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
