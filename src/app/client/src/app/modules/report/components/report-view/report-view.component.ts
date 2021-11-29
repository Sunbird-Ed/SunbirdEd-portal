import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { DhitiService } from '@sunbird/core';
import {
  ConfigService,
  LayoutService,
  INoResultMessage,
  ResourceService,
  ToasterService,
  ILoaderMessage
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
})
export class ReportViewComponent implements OnInit {
  state: any = {};
  segmentValue: string;
  data: any;
  config;
  error: { result: boolean; message: string };
  reportSections: any;
  filters: any;
  layoutConfiguration: any;
  public noResultMessage: INoResultMessage;
  public showComponent = true;
  public segmentfilter = false;
  public filterModal = false;
  @ViewChild('lib', { static: false }) lib: any;
  @ViewChild('modal') modal;
  selectedListCount = 0;
  name = ['filter'];
  modalFilterData: any;
  filteredData = [];
  key: any;
  questionId: any;
  public active: boolean[] = [];
  public tabs: { header: string }[] = [
    { header: this.resourceService.frmelmnts.lbl.question },
  ];
  public noResult = false;
  showLoader = true;
  public showPdf = false;
  public showEvidence = false;
  evidenceParam: any;
  public unsubscribe$ = new Subject<void>();
  loaderMessage: ILoaderMessage;
  constructor(
    private dhitiService: DhitiService,
    config: ConfigService,
    public layoutService: LayoutService,
    public location: Location,
    public resourceService: ResourceService,
    private routerParam: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    public toasterService: ToasterService,
    public locations: LocationStrategy
  ) {
    this.config = config;
    this.locations.onPopState(() => {
      this.modal.deny();
   });

    //  this.state = this.router.getCurrentNavigation().extras.state;
    this.routerParam.queryParams.subscribe((data: any) => {
      this.state['entityId'] = data.entityId;
      this.state['observationId'] = data.observationId;
      this.state['entityType'] = data.entityType;
      this.state['solutionId'] = data.solutionId;
      if (data.filter) {
        this.state['filter'] = { questionId: [] };
        this.state['criteriaWise'] = false;
      }
      data.scores == 'true'
        ? (this.state['scores'] = true)
        : (this.state['scores'] = false);
      data.observation == 'true'
        ? (this.state['observation'] = true)
        : (this.state['observation'] = false);
    });

  }
  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }


  ngOnInit() {
    this.initLayout();
    this.noResultMessage = {
          messageText: 'messages.stmsg.reportNotReady',
        };
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.segmentValue = 'Questions';
    this.state['pdf'] = false;
    this.getReport();
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().subscribe((layoutConfig) => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  getReport() {
    // remove null and undefined
    this.state = _.omitBy(this.state, _.isNil);
    this.error = null;
    const config = {
      url: this.config.urlConFig.URLS.DHITI.GENERIC_REPORTS,
      data: this.state,
    };
    this.dhitiService.post(config).subscribe(
      (success: any) => {
        if (success.result === true && success.reportSections) {
          this.data = success;
          this.reportSections = this.filterBySegment();

          if (this.data.filters && !this.filters) {
            this.filters = this.data.filters;
          }

          if (this.data.filters) {
            const modalFilter = this.data.filters.filter(
              (filter) => filter.filter.type == 'modal'
            )[0];
            this.filters = this.filters.map((filter) => {
              if (filter.filter.type == 'modal') {
                filter = modalFilter;
              }
              return filter;
            });
          }
        } else {
          this.noResult = true;
          this.showLoader = false;
        }
        this.filters.forEach((element) => {
          if (element.filter.type == 'segment') {
            if (this.tabs.length == 1) {
              this.active.push(true);
              this.tabs.push({
                header: this.resourceService.frmelmnts.lbl.criteria,
              });
            }
            this.segmentfilter = true;
          }
        });
        this.showLoader = false;
      },
      (err) => {
        this.reportSections = [];
        this.error = err;
        if (!this.error.result) {
          this.noResult = true;
          this.showLoader = false;
        }
      }
    );
  }

  gotoSolutionListPage() {
    this.location.back();
  }

  filterBySegment() {
    if (this.segmentValue == 'Questions') {
      const reportSections = [{ questionArray: this.data.reportSections }];
      return reportSections;
    }

    return this.data.reportSections;
  }

  getData(element) {
    const data = {
      values: element.chart.data.datasets[0].data,
    };
    return data;
  }

  getconfig(element) {
    const config = {
      labels: element.chart.data.labels,
      datasets: [{ data: element.chart.data.datasets[0].data }],
      options: element.chart.options,
      colors: [
        { backgroundColor: element.chart.data.datasets[0].backgroundColor },
      ],
      legend: true,
    };
    return config;
  }

  handleParameterChange(event) {
    this.state['submissionId'] = event._id;
    this.getReport();
  }

  segmentChanged(segment) {
    segment === 'Criteria'
      ? (this.state.criteriaWise = true)
      : (this.state.criteriaWise = false);
    this.state.filter = null;
    this.modalFilterData = null;
    this.segmentValue = segment;
    this.getReport();
  }

  openFile(file) {
    window.open(file.url, '_blank');
  }

  filterModalPopup(data, keyToSend) {
    this.key = keyToSend;
    this.modalFilterData ? null : (this.modalFilterData = data);
    let filteredData;
    if (this.state.filter && this.state.filter.length) {
      filteredData = this.state.filter[keyToSend];
    } else {
      filteredData = data.map((d) => d._id);
    }

    this.state.criteriaWise ? 'criteria' : 'question';
    this.filteredData = filteredData;
    this.selectedListCount = this.modalFilterData.length;
    this.filterModal = true;
  }

  public closeModal() {
    this.modal.approve();
    this.filterModal = false;
  }

  onQuestionClick(id) {
    if (this.filteredData.includes(id)) {
      const indexOfQuestion = this.filteredData.indexOf(id);
      this.filteredData.splice(indexOfQuestion, 1);
    } else {
      this.filteredData.push(id);
    }
  }

  applyFilter() {
    if (!this.filteredData.length) {
      const msgData =
        this.segmentValue == 'Questions'
          ? 'messages.smsg.selectquestions'
          : 'messages.smsg.selectcriteria';
      this.toasterService.error(_.get(this.resourceService, msgData));
    } else {
      this.state.filter = {};
      this.state.filter[this.key] = this.filteredData;
      this.getReport();
      this.filterModal = false;
    }
  }

  async download() {
    const url: any = await this.callApi();
    window.location.href = url;
  }

  callApi() {
    return new Promise((resolve, reject) => {
      const payload = Object.assign({}, this.state, { pdf: true }); // will not change state obj
      const config = {
        url: this.config.urlConFig.URLS.DHITI.GENERIC_REPORTS,
        data: payload,
      };
      this.dhitiService.post(config).subscribe((res: any) => {
        if (res.status != 'success' && !res.pdfUrl) {
          reject();
        }
        resolve(res.pdfUrl);
      });
    });
  }

  async getAllEvidence(element) {
    this.questionId = element.order;
    const payload = {
      submissionId: this.state.submissionId,
      observationId: this.state.observationId,
      entityId: this.state.entityId,
      questionId: element.order,
      entityType: this.state.entityType,
      solutionId: this.state.solutionId,
    };
    this.evidenceParam = payload;
    this.showEvidence = true;
  }

  modalClose(event) {
    this.showEvidence = false;
  }

  selectedTabChange(event) {
    const { tabHeader } = _.get(event, 'tab.textLabel');
    tabHeader && this.segmentChanged(tabHeader);
  }

}
