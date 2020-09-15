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
  columns = [];
  onDemandReportData = [];
  isDownloadReport = false;
  searchFields = [];
  fileName = '';
  reportType;

  constructor(public resourceService: ResourceService, public http: HttpClient,
              public onDemandReportService: OnDemandReportService) {
  }

  ngOnInit() {
    this.onDemandReportService.getReportList(this.tag).subscribe((data) => {
      this.onDemandReportData = _.get(data, 'result.jobs');
    });
    this.columns = [
      {name: 'Report Type', isSortable: true, prop: 'job_id', placeholder: 'Filter report type'},
      {name: 'Request date', isSortable: true, prop: 'last_updated', placeholder: 'Filter request date'},
      {name: 'Status', isSortable: false, prop: 'status', placeholder: 'Filter status'},
      {name: 'Download link', isSortable: false, prop: 'download_urls', placeholder: 'Filter download link'},
      {name: 'Generated date', isSortable: true, prop: 'last_updated', placeholder: 'Filter generated date'},
      {name: 'Requested by', isSortable: true, prop: 'requested_by', placeholder: 'Filter request by'},
    ]

  }

  reportChanged(ev) {
    this.reportType = ev
  }

  submitRequest() {
    const request = {};
    // this.reportType use to create req
    //TODO deveshvenkat: generate request here
    this.onDemandReportService.submitRequest(request).subscribe((data) => {
      this.onDemandReportData.unshift({...data['result']});
      this.onDemandReportData = [...this.onDemandReportData];
    })
  }

}
