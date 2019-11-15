import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offline-report-issues',
  templateUrl: './offline-report-issues.component.html',
  styleUrls: ['./offline-report-issues.component.scss']
})
export class OfflineReportIssuesComponent implements OnInit {
  issueReportText = false;
  showNormalModal = false;
  constructor() { }

  ngOnInit() {
  }
  submitIssue() {
    this.issueReportText = !this.issueReportText;
  }
}
