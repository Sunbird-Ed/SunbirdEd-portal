import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../services';

interface ReportSummary {
  label: string;
  text: Array<string>;
}

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {

  @Input() inputData: Array<ReportSummary>;

  constructor(public reportService: ReportService) { }

  ngOnInit() {
  }

}
