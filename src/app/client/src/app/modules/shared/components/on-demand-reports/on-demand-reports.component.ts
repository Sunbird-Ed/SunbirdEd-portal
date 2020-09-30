import {Component, OnInit, Input} from '@angular/core';
import {ResourceService, ToasterService} from '../../services';
import {OnDemandReportService} from '../../services/on-demand-report/on-demand-report.service';
import * as _ from 'lodash-es';
import {Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-on-demand-reports',
  templateUrl: './on-demand-reports.component.html',
  styleUrls: ['./on-demand-reports.component.scss']
})
export class OnDemandReportsComponent implements OnInit {

  @Input() reportTypes;
  @Input() tag;
  @Input() userId;
  @Input() batch;
  public columns = [
    {name: 'Report type', isSortable: true, prop: 'title', placeholder: 'Filter report type'},
    {name: 'Request date', isSortable: true, prop: 'jobStats.dtJobSubmitted', placeholder: 'Filter request date',type: 'date'},
    {name: 'Status', isSortable: false, prop: 'status', placeholder: 'Filter status'},
    {name: 'Report link', isSortable: false, prop: 'downloadUrls', placeholder: 'Filter download link'},
    {name: 'Generated date', isSortable: true, prop: 'jobStats.dtJobCompleted', placeholder: 'Filter generated date',type: 'date'},
    // { name: 'Requested by', isSortable: true, prop: 'requested_by', placeholder: 'Filter request by' },
  ];
  tableConfig = {'footerHeight': 0, 'limit': 10}
  public onDemandReportData: any[];
  public isDownloadReport = false;
  public fileName = '';
  public selectedReport;
  public password = new FormControl('', [Validators.minLength(6), Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]);
  public message = 'There is no data available';
  public isProcessed = false;
  reportStatus = {
    'submitted': 'SUBMITTED',
    'processing': 'PROCESSING',
    'failed': 'FAILED',
    'success': 'SUCCESS',
  };
  instance: string;

  constructor(public resourceService: ResourceService,
    public onDemandReportService: OnDemandReportService, public toasterService: ToasterService) {
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
  }

  loadReports(batchDetails?: any) {
    if(batchDetails){
      this.batch = batchDetails;
      this.tag = batchDetails.courseId+'_'+batchDetails.batchId;
    }
    if (this.batch) {
      this.onDemandReportService.getReportList(this.tag).subscribe((data) => {
        if (data) {
          const reportData = _.get(data, 'result.jobs');
          this.onDemandReportData = _.map(reportData, (row) => this.dataModification(row));
          this.onDemandReportData = [...this.onDemandReportData];
        }
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
    }
  }

  reportChanged(ev) {
    this.selectedReport = ev;
  }

  onDownloadLinkFail(data) {
    this.onDemandReportService.getReport(data.tag, data.requestId).subscribe((data: any) => {
      if (data) {
        const downloadUrls = _.get(data, 'result.downloadUrls') || [];
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
    const isRequestAllowed = this.checkStatus();
    if (isRequestAllowed) {
      this.isProcessed = false;
      const request = {
        request: {
          tag: this.tag,
          requestedBy: this.userId,
          dataset: this.selectedReport.dataset,
          datasetConfig: {
            batchId: this.batch.batchId
          },
          output_format: 'csv'
        }
      };
      if (this.selectedReport.encrypt === 'true') {
        request.request['encryptionKey'] = this.password.value;
      }
      console.log('submit the report');
      this.onDemandReportService.submitRequest(request).subscribe((data: any) => {
        if (data && data.result) {
          if (data.result.status === this.reportStatus.failed) {
            const error = _.get(data, 'result.statusMessage') || _.get(this.resourceService, 'frmelmnts.lbl.requestFailed');
            this.toasterService.error(error);
          }
          data = this.dataModification(data['result']);
          const updatedReportList = [data, ...this.onDemandReportData];
          this.onDemandReportData = _.slice(updatedReportList, 0, 10);
        }
        this.password.reset();
      }, error => {
        this.password.reset();
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
    } else {
      this.isProcessed = true;
      setTimeout(()=>{
        this.isProcessed = false;
      }, 5000)
      this.toasterService.error(_.get(this.resourceService, 'frmelmnts.lbl.requestFailed'));
    }
  }

  checkStatus() {
    const selectedReportList = [];
    _.forEach(this.onDemandReportData, (value) => {
      if (value.dataset === this.selectedReport.dataset) {
        selectedReportList.push(value);
      }
    });
    const sortedReportList = _.sortBy(selectedReportList, [(data) => {
      return data && data.jobStats && data.jobStats.dtJobSubmitted;
    }]);
    const reportListData = _.last(sortedReportList) || {};
    let batchEndDate;
    if (this.batch.endDate) {
      batchEndDate = new Date(`${this.batch.endDate} 00:00:00`).getTime();
    }
    if (!_.isEmpty(reportListData)) { // report is already submitted so dont allow to req again
      if (this.onDemandReportService.isInProgress(reportListData, this.reportStatus)) {
        return this.onDemandReportService.canRequestReport(_.get(reportListData, 'jobStats.dtJobSubmitted'), batchEndDate);
      }
      return false;
    }
    return true;
  }


  dataModification(row) {
    const dataSet = _.find(this.reportTypes, {dataset: row.dataset}) || {};
    row.title = dataSet.title;
    return row;
  }
}
