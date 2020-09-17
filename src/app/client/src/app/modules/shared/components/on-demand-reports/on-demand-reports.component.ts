import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ToasterService } from '../../services';
import { OnDemandReportService } from '../../services/on-demand-report/on-demand-report.service';
import * as _ from 'lodash-es';
import * as dayjs from 'dayjs';


@Component({
  selector: 'app-on-demand-reports',
  templateUrl: './on-demand-reports.component.html',
  styleUrls: ['./on-demand-reports.component.scss']
})
export class OnDemandReportsComponent implements OnInit {

  @Input() reportTypes;
  @Input() tag;
  @Input() userId;
  @Input() batchId;
  public columns = [
    { name: 'Report Type', isSortable: true, prop: 'job_id', placeholder: 'Filter report type' },
    { name: 'Request date', isSortable: true, prop: 'job_stats.dt_job_submitted', placeholder: 'Filter request date' },
    { name: 'Status', isSortable: false, prop: 'status', placeholder: 'Filter status' },
    { name: 'Download link', isSortable: false, prop: 'download_urls', placeholder: 'Filter download link' },
    { name: 'Generated date', isSortable: true, prop: 'job_stats.dt_job_completed', placeholder: 'Filter generated date' },
    // { name: 'Requested by', isSortable: true, prop: 'requested_by', placeholder: 'Filter request by' },
  ]
  public onDemandReportData = [];
  public isDownloadReport = false;
  public searchFields = [];
  public fileName = '';
  public reportType;
  public password;

  constructor(public resourceService: ResourceService,
    public onDemandReportService: OnDemandReportService, public toasterService: ToasterService) {
  }

  ngOnInit() {
    if(this.batchId) {
      this.onDemandReportService.getReportList(this.tag).subscribe((data) => {
        if(data){
          this.onDemandReportData = _.get(data, 'result.jobs');
        }
      },error => {
        // error message
      });
    }
  }

  reportChanged(ev) {
    this.reportType = ev;
  }

  onDownloadLinkFail(data) {
    this.onDemandReportService.getReport(data.tag || 'tag', data.requestId || 'id').subscribe((data) => {
      if(data){
      const downloadUrls = _.get(data, 'result.download_urls');
      const downloadPath = _.head(downloadUrls);
      if (downloadPath) {
        window.open(downloadPath, '_blank');
      } else {
        this.toasterService.error('nothing to donwdload');
      }
      }
    }, error => {
      // error message 
    })
  }

  submitRequest() {
    this.password = '';
    const request = {
      "tag": this.tag,
      "requestedBy": this.userId,
      "jobId": this.reportType.jobId,
      "jobConfig": {
        batchId: this.batchId
      }
    };
    // this.reportType use to create req
    //TODO deveshvenkat: generate request here
    // error handling
    this.onDemandReportService.submitRequest(request).subscribe((data) => {
      if(data){
        this.onDemandReportData.unshift({ ...data['result'] });
        this.onDemandReportData = [...this.onDemandReportData];
      }
    },error => {
      //error message
    })
  }

}
