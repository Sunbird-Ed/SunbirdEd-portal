import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService, IUserData, IUserProfile, LayoutService, ResourceService, ConfigService, OnDemandReportService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { Subject, Subscription } from 'rxjs';
import { KendraService, UserService, FormService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { Location } from '@angular/common';

@Component({
  selector: 'app-datasets',
  templateUrl: './program-datasets.component.html',
  styleUrls: ['./program-datasets.component.scss']
})

export class DatasetsComponent implements OnInit {

  public activatedRoute: ActivatedRoute;
  public showConfirmationModal = false;

  config;
  reportTypes = [];
  programs = [];
  solutions = [];
  public message = 'There is no data available';
  instance: string;

  @ViewChild('modal', { static: false }) modal;
  popup: boolean = false;
  awaitPopUp: boolean = false;
  reportStatus = {
    'submitted': 'SUBMITTED',
    'processing': 'PROCESSING',
    'failed': 'FAILED',
    'success': 'SUCCESS',
  };

  public isProcessed = false;
  formData: Object;
  public columns = [
    { name: 'Report type', isSortable: true, prop: 'datasetConfig.title', placeholder: 'Filter report type' },
    { name: 'Request date', isSortable: true, prop: 'jobStats.dtJobSubmitted', placeholder: 'Filter request date', type: 'date' },
    { name: 'Status', isSortable: false, prop: 'status', placeholder: 'Filter status' },
    { name: 'Report link', isSortable: false, prop: 'downloadUrls', placeholder: 'Filter download link' },
    { name: 'Generated date', isSortable: true, prop: 'jobStats.dtJobCompleted', placeholder: 'Filter generated date', type: 'dateTime' },
  ];

  public onDemandReportData = [];

  downloadCSV = true;
  isColumnsSearchable = false;
  tag: string;

  reportForm = new FormGroup({
    programName: new FormControl('', [Validators.required]),
    solution: new FormControl('', [Validators.required]),
    reportType: new FormControl('', [Validators.required])
  });

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.minLength(8), Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')])
  });

  programSelected: any;
  solutionSelected: any;

  constructor(
    activatedRoute: ActivatedRoute,
    public layoutService: LayoutService,
    public telemetryService: TelemetryService,
    public resourceService: ResourceService,
    public kendraService: KendraService,
    public userService: UserService,
    public onDemandReportService: OnDemandReportService,
    config: ConfigService,
    public toasterService: ToasterService,
    public formService: FormService,
    public router: Router,
    public location: Location
  ) {
    this.config = config;
    this.activatedRoute = activatedRoute;
  }

  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();
  userDataSubscription: Subscription;
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * all user role
   */
  public userRoles: Array<string> = [];
  public userId: string;
  public selectedReport;
  public selectedSolution: string;

  getProgramsList() {
    const paramOptions = {
      url:
        this.config.urlConFig.URLS.KENDRA.PROGRAMS_BY_PLATFORM_ROLES+"?role="+this.userRoles.toString()
    };
    this.kendraService.get(paramOptions).subscribe(data => {
      if (data && data.result) {
        this.programs = data.result;
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    })

  }

  getSolutionList(program) {

    const paramOptions = {
      url:
        this.config.urlConFig.URLS.KENDRA.SOLUTIONS_BY_PROGRAMID + "/" + program._id + "?role=" + program.role
    };
    this.kendraService.get(paramOptions).subscribe(data => {
      if (data && data.result) {
        this.solutions = data.result;
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    })

  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.userDataSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.userRoles = user.userProfile.userRoles;
          this.userId = user.userProfile.id;
          
        }
      });
    this.initLayout();
    this.getProgramsList();
    this.getFormDetails();
  }


  public programSelection($event) {

    this.reportForm.reset();
    let program = this.programs.filter(data => {
      if (data._id == $event) {
        return data
      }
    })

    this.solutions = [];
    this.reportTypes = [];
    this.onDemandReportData = [];
    this.getSolutionList(program[0]);
    this.reportForm.controls.programName.setValue($event);
  }

  public selectSolution($event) {

    if (this.programSelected && this.reportForm.value && this.reportForm.value['solution']) {
      let solution = this.solutions.filter(data => {
        if (data._id == $event) {
          return data
        }
      });
      this.tag = solution[0]._id+"_"+this.userId;
      this.loadReports();

      let program = this.programSelected;
      this.reportForm.reset();
      this.reportForm.controls.solution.setValue($event);
      this.reportForm.controls.programName.setValue(program);

      if (solution[0].isRubricDriven == true && solution[0].type == "observation") {
        let type = solution[0].type + "_with_rubric";
        this.reportTypes = this.formData[type];
      } else {
        if(this.formData[solution[0].type]){
          this.reportTypes = this.formData[solution[0].type];
        } else {
          this.reportTypes = [];
        }
      }

    }
  }

  public closeModal(): void {
    this.popup = false;
  }

  public csvRequest() {
    this.popup = false;
    this.submitRequest();
  }

  public requestDataset() {
    if (this.selectedReport.encrypt == true) {
      this.popup = true;
    } else {
      this.showConfirmationModal = true;
    }
  }

  private closeConfirmationModal() {
    this.showConfirmationModal = false;
  }
  goBack() {
    this.location.back();
  }

  public handleConfirmationEvent(event: boolean) {
    this.closeConfirmationModal();
    if (event == true) {
      this.submitRequest();
    }
  }
  public closeConfirmModal() {
    this.awaitPopUp = false;
  }

  loadReports() {
    this.onDemandReportService.getReportList(this.tag).subscribe((data) => {
      if (data) {
        const reportData = _.get(data, 'result.jobs');
        this.onDemandReportData = _.map(reportData, (row) => this.dataModification(row));
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });
  }

  reportChanged(selectedReportData) {
    this.selectedReport = selectedReportData;
  }

  submitRequest() {
    this.selectedSolution = this.reportForm.controls.solution.value;
    const isRequestAllowed = this.checkStatus();
    if (isRequestAllowed) {
      this.isProcessed = false;
      let config = {
        type: this.selectedReport['datasetId'],
        params:{
          programId: this.programSelected,
          solutionId: this.reportForm.controls.solution.value,
        },
        title: this.selectedReport.name
      }
      let request = {
        request: {
          dataset:'druid-dataset',
          tag: this.tag,
          requestedBy: this.userId,
          datasetConfig: config,
          output_format: 'csv'

        }
      };
     
      if (this.selectedReport.encrypt === true) {
        request.request['encryptionKey'] = this.passwordForm.controls.password.value;
      }

      this.onDemandReportService.submitRequest(request).subscribe((data: any) => {
        if (data && data.result) {
          if (data.result.status === this.reportStatus.failed) {
            const error =  _.get(this.resourceService, 'frmelmnts.lbl.reportRequestFailed');
            this.toasterService.error(error);
          } else {

            if(data['result'] && data['result']['requestId']){

            let dataFound=  this.onDemandReportData.filter(function(submittedReports){
                 if( submittedReports['requestId']== data['result']['requestId']){
                  return data;
                }
                
              });

              if(dataFound && dataFound.length > 0){              
                this.popup = false;
                this.isProcessed = true;
                setTimeout(() => {
                  this.isProcessed = false;
                }, 5000)
                this.toasterService.error(_.get(this.resourceService, 'frmelmnts.lbl.reportRequestFailed'));
                this.passwordForm.reset();

              } else {
                data = this.dataModification(data['result']);
                const updatedReportList = [data, ...this.onDemandReportData];
                this.onDemandReportData = updatedReportList;
                this.awaitPopUp = true;
                this.passwordForm.reset();

              }
            }
          }
        
        }
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });

    } else {
      this.popup = false;
      this.isProcessed = true;
      setTimeout(() => {
        this.isProcessed = false;
      }, 5000)
      this.toasterService.error(_.get(this.resourceService, 'frmelmnts.lbl.reportRequestFailed'));
      this.passwordForm.reset();
    }
  }

  public getFormDetails() {

    const formServiceInputParams = {
      formType: 'program-dashboard',
      formAction: 'reportData',
      contentType: "csv-dataset",
      component: 'portal'
    };

    this.formService.getFormConfig(formServiceInputParams).subscribe((formData) => {
      if (formData) {
        if (this.userRoles.includes('PROGRAM_DESIGNER')) {
          let formReportTypes = Object.keys(formData);
          formReportTypes.map(key => {
            let filteredReportTypes = formData[key].filter(ele => {
              if (ele.roles.includes("PROGRAM_DESIGNER")) {
                return ele
              }
            })
            formData[key] = filteredReportTypes;
          });
          this.formData = formData;
        } else {
          this.formData = formData;
        }
      }
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });

  }
  
  checkStatus() {
    let requestStatus = true;
    const selectedReportList = [];
    _.forEach(this.onDemandReportData, (value) => {
      if (value.datasetConfig.type == this.selectedReport.datasetId  && value.datasetConfig.params.solutionId == this.selectedSolution) {
        selectedReportList.push(value);
      }
    });
    const sortedReportList = _.sortBy(selectedReportList, [(data) => {
      return data && data.jobStats && data.jobStats.dtJobSubmitted;
    }]);
  
    const reportListData = _.last(sortedReportList) || {};
    if (!_.isEmpty(reportListData)) { 
      let isInProgress = this.onDemandReportService.isInProgress(reportListData, this.reportStatus); 
      if (!isInProgress) {
        requestStatus = true;
      } else {
        requestStatus = false; 
      }
    }
    return requestStatus;
  }
  onDownloadLinkFail(data) {
    const tagId = data && data.tag && data.tag.split(':');
    this.onDemandReportService.getReport(_.head(tagId), data.requestId).subscribe((data: any) => {
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
  dataModification(row) {
    row.title = row.datasetConfig.title;
    return row;
  }

}
