import {Component, OnInit, Input} from '@angular/core';
import {ResourceService} from '../../services/index';
import {OnDemandReportService} from '../../services/on-demand-report/on-demand-report.service';
import * as _ from 'lodash-es';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-on-demand-reports',
  templateUrl: './on-demand-reports.component.html',
  styleUrls: ['./on-demand-reports.component.scss']
})
export class OnDemandReportsComponent implements OnInit {

  @Input() reportTypes;
  @Input() tag;

  constructor(public resourceService: ResourceService, public http: HttpClient,
              public onDemandReportService: OnDemandReportService) {
  }

  ngOnInit() {
    this.onDemandReportService.getReportList(this.tag).subscribe((data) => {
      console.log('%%%%%%%%%%');
      console.log(data);

    });


  }

  reportChanged(report) {
    console.log('report type changes------', report)
  }


}
