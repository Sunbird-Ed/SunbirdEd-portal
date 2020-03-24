import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../services';

interface reportSummary {
  label: string;
  text: Array<string>;
}

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {

  @Input() inputData: Array<reportSummary>;

  constructor(private reportService: ReportService) { }

  ngOnInit() {
  }

}
