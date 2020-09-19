import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ResourceService, ToasterService } from '../../services';
import { OnDemandReportService } from '../../services/on-demand-report/on-demand-report.service';
import * as _ from 'lodash-es';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-on-demand-reports',
  templateUrl: './on-demand-reports.component.html',
  styleUrls: ['./on-demand-reports.component.scss']
})
export class OnDemandReportsComponent implements OnInit, OnChanges {

  @Input() reportTypes;
  @Input() tag;
  @Input() userId;
  @Input() batch;
  public columns = [
    { name: 'Report Type', isSortable: true, prop: 'job_id', placeholder: 'Filter report type' },
    { name: 'Request date', isSortable: true, prop: 'job_stats.dt_job_submitted', placeholder: 'Filter request date' },
    { name: 'Status', isSortable: false, prop: 'status', placeholder: 'Filter status' },
    { name: 'Download link', isSortable: false, prop: 'download_urls', placeholder: 'Filter download link' },
    { name: 'Generated date', isSortable: true, prop: 'job_stats.dt_job_completed', placeholder: 'Filter generated date' },
    // { name: 'Requested by', isSortable: true, prop: 'requested_by', placeholder: 'Filter request by' },
  ];
  public onDemandReportData: any[];
  public isDownloadReport = false;
  public fileName = '';
  public selectedReport;
  public password;
  public message = 'There is no data available';
  public isProcessed = false;
  reportStatus = {
    'processing_request': 'Processing request',
    'processing_success': 'Processing success',
    'processing_failed': 'Processing failed',
    'expired': 'expired',
  };

  constructor(public resourceService: ResourceService,
    public onDemandReportService: OnDemandReportService, public toasterService: ToasterService) {
  }

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    if (this.batch) {
      this.onDemandReportService.getReportList(this.tag).subscribe((data) => {
        if (data) {
          this.onDemandReportData = _.get(data, 'result.jobs');
        }
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
    }
  }

  reportChanged(ev) {
    this.selectedReport = ev;
  }

  ngOnChanges() {
  }

  onDownloadLinkFail(data) {
    this.onDemandReportService.getReport(data.tag, data.requestId).subscribe((data: any) => {
      if (data) {
        const downloadUrls = _.get(data, 'result.download_urls') || [];
        const downloadPath = _.head(downloadUrls);
        if (downloadPath) {
          window.open(downloadPath, '_blank');
        } else {
          this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
        }
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });
  }

  submitRequest() {
    this.password = '';
    const isPendingProcess = this.checkStatus();
    if (!isPendingProcess) {
      this.isProcessed = false;
      const request = {
        request: {
          'tag': this.tag,
          'requestedBy': this.userId,
          'jobId': this.selectedReport.jobId,
          'jobConfig': {
            batchId: this.batch.batchId
          },
          output_format: 'csv'
        }
      };
      this.onDemandReportService.submitRequest(request).subscribe((data: any) => {
        if (data && data.result) {
          this.onDemandReportData.unshift({...data['result']});
          this.onDemandReportData = _.slice(this.onDemandReportData, 0, 10);
          this.onDemandReportData = [...this.onDemandReportData];
        }
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
    } else {
      this.isProcessed = true;
      this.toasterService.error('The request is already in Processed State');
    }
  }

  checkStatus() {
    const processPendingList = this.onDemandReportData.find(x => x.job_id === this.selectedReport.jobId) || null;
    if (processPendingList) {
      return processPendingList['status'] === this.reportStatus.processing_request;
    } else {
      return false;
    }
  }

}
