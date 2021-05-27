import { Component, OnInit,ViewChild } from '@angular/core';


import { ToasterService,  IUserData, IUserProfile, LayoutService, ResourceService,ConfigService,OnDemandReportService } from '@sunbird/shared';
import {  TelemetryService } from '@sunbird/telemetry';
import { from, Subject,Subscription } from 'rxjs';
import { TncService,KendraService,UserService,FormService } from '@sunbird/core';
import { first, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import * as _ from 'lodash-es';
// import { programManagerService } from ''


@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})



export class DatasetsComponent implements OnInit {

  public activatedRoute: ActivatedRoute;
  public showConfirmationModal = false;
  public confirmationPopupInput = { title: "Do you want to continue", event: 'ok', body: "string" };
  config;
  reportTypes = [];
  programs = [];
  solutions = [];
  @ViewChild('modal', {static: false}) modal;
  popup:boolean  = false;
  awaitPopUp:boolean =false;

  // formData = {
  //   "improvementproject": [
  //     {
  //       "datasetId":"",
  //       "name": "Task Detail Report",
  //       "encrypt": true,
  //       "accessableTo": [
  //         "PM"
  //       ]
  //     },
  //     {
  //       "datasetId":"",
  //       "name": "Status Report",
  //       "encrypt": false,
  //       "accessableTo": [
  //         "PM",
  //         "PD"
  //       ]
  //     }
  //   ],
  //   "observation": [
  //     {
  //       "datasetId":"",
  //       "name": "Question Report",
  //       "encrypt": true,
  //       "accessableTo": [
  //         "PM"
  //       ]
  //     },
  //     {
  //       "datasetId":"",
  //       "name": "Status Report",
  //       "encrypt": false,
  //       "accessableTo": [
  //         "PM",
  //         "PD"
  //       ]
  //     }
  //   ],
  //   "observation_with_rubric": [
  //     {
  //       "datasetId":"",
  //       "name": "Task Detail Report",
  //       "encrypt": true,
  //       "accessableTo": [
  //         "PM"
  //       ]
  //     },
  //     {
  //       "datasetId":"",
  //       "name": "Status Report",
  //       "encrypt": false,
  //       "accessableTo": [
  //         "PM",
  //         "PD"
  //       ]
  //     },
  //     {
  //       "datasetId":"",
  //       "name": "Domain Criteria Report",
  //       "encrypt": false,
  //       "accessableTo": [
  //         "PM",
  //         "DM"
  //       ]
  //     }
  //   ],
  //   "survey": [
  //     {
  //       "datasetId":"",
  //       "name": "Task Detail Report",
  //       "encrypt": true,
  //       "accessableTo": [
  //         "PM"
  //       ]
  //     },
  //     {
  //       "datasetId":"",
  //       "name": "Status Report",
  //       "encrypt": false,
  //       "accessableTo": [
  //         "PM",
  //         "PD"
  //       ]
  //     }
  //   ]
  // };

  formData:Object;
  public columns = [
    { name: 'Report type', isSortable: true, prop: 'request_id', placeholder: 'Filter report type' },
    { name: 'Request date', isSortable: true, prop: 'jobStats.dtJobSubmitted', placeholder: 'Filter request date', type: 'date' },
    { name: 'Status', isSortable: false, prop: 'status', placeholder: 'Filter status' },
    { name: 'Report link', isSortable: false, prop: 'downloadUrls', placeholder: 'Filter download link' },
    { name: 'Generated date', isSortable: true, prop: 'jobStats.dtJobCompleted', placeholder: 'Filter generated date', type: 'dateTime' },
    // { name: 'Requested by', isSortable: true, prop: 'requested_by', placeholder: 'Filter request by' },
  ];

  public data =  [
    {
      
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'progress-exhaust',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing request',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com', 'https://www.google.com',
      ],
      'expires_at': '2020-08-20'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com',
      ],
      'expires_at': '2020-09-20'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing failed',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-09-22'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Expired',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-08-20'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-09-30'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-07-20'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-10-20'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-09-10'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-09-20'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-09-20'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-09-20'
    }, {
      'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
      'tag': 'test-tag:in.ekstep',
      'job_id': 'assessment-dashboard-metrics',
      'requested_by': 'client-1',
      'requested_channel': 'in.ekstep',
      'status': 'Processing success',
      'last_updated': 1599728944037,
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      },
      'attempts': 0,
      'jobStats': {
        'dtJobSubmitted': 1599728944037,
        'dtJobCompleted': null,
        'execution_time': null
      },
      'downloadUrls': [
        'https://www.google.com'
      ],
      'expires_at': '2020-09-20'
    },
  ]

  downloadCSV = true;
  name = "";
  public message = 'There is no data available';
  isColumnsSearchable = false;

  reportForm = new FormGroup({
    programName: new FormControl('',[Validators.required]),
    solution: new FormControl('',[Validators.required]),
    reportType: new FormControl('', [Validators.required])
  });

  passwordForm = new FormGroup({
    password : new FormControl('', [Validators.minLength(8), Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')])
  });

  programSelected: any;

  constructor(
    activatedRoute: ActivatedRoute,
    public layoutService: LayoutService,
    public telemetryService: TelemetryService,
    public resourceService: ResourceService,
    public kendraService:KendraService,
    public userService: UserService,
    public onDemandReportService:OnDemandReportService,
    config: ConfigService,
    public toasterService:ToasterService,
    public formService:FormService
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
  private userRoles: Array<string> = [];
  public userId:string;
  public selectedReport;

  getProgramsList() {
    const paramOptions = {
      url:
        this.config.urlConFig.URLS.KENDRA.PROGRAMS_BY_PLATFORM_ROLES
    };
    console.log(":data.result");
    this.kendraService.get(paramOptions).subscribe(data => {
      if(data && data.result){
        console.log("programs --",data.result);
        this.programs = data.result;
      }
    }, error => {
    })

 }
 
 getSolutionList(program) {
  
  const paramOptions = {
    url:
      this.config.urlConFig.URLS.KENDRA.SOLUTIONS_BY_PROGRAMID+"/"+program._id+"?role="+program.role
  };
  this.kendraService.get(paramOptions).subscribe(data => {
    if(data && data.result){
      console.log("solutions----------- ",data.result);
      this.solutions = data.result;
    }
  }, error => {
  })

 }

  ngOnInit() {

    this.userDataSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.userRoles = user.userProfile.userRoles;
          this.userId = user.userProfile.id;
         console.log("this.userRoles",user); 
        }
      });

    this.initLayout();
    this.getProgramsList();
    this.getFormDetails();
    

  }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  public programSelection($event){

    let program = this.programs.filter( data =>{
        if(data._id==$event){  
          return data
         }
       })

    this.solutions = [];
    this.reportTypes =[];
    this.getSolutionList(program[0]);
    
  }
  public selectSolution($event) {
    
    if (this.programSelected && this.reportForm.value && this.reportForm.value['solution']) {
      let solution = this.solutions.filter( data =>{
        if(data._id==$event){  
          return data
         }
       })
      this.reportTypes = this.formData[solution[0].type];
    }
  }

  public closeModal(): void {
    // if (this.modal) {
    //   this.modal.deny();
    // }
    this.popup =false;
    // this.closeModalEvent.emit(true);
  }

  public csvRequest(){

    this.popup =false; 
    this.submitRequest();
    this.awaitPopUp =true;
  }
  
  public requestDataset(){

    if(this.selectedReport.encrypt==true){
      this.popup =true; 
    } else {
      this.showConfirmationModal =true;
    }
    
  }

  private closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  public handleConfirmationEvent(event: boolean) {
    this.closeConfirmationModal();
    if (event ==true) {
      
      this.submitRequest();
      this.awaitPopUp =true;
      
    } 
  }
  public closeConfirmModal(){
    this.awaitPopUp =false;
  }

  loadReports(batchDetails?: any) {
    if(batchDetails){
      // this.batch = batchDetails;
      // this.tag = batchDetails.courseId+'_'+batchDetails.batchId;
    }
    // if (this.batch) {
      this.onDemandReportService.getReportList("this.tag").subscribe((data) => {
        if (data) {
          // const reportData = _.get(data, 'result.jobs');
          // this.data = _.map(reportData, (row) => this.dataModification(row));
          // this.data = [...this.onDemandReportData];
        }
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
    // }
  }

  reportChanged(ev) {
    this.selectedReport = ev;
  }

  submitRequest() {
    // const isRequestAllowed = this.checkStatus();
    // if (isRequestAllowed) {
      // this.isProcessed = false;

      console.log("this.reportForm.value",this.reportForm.value);
      const request = {
        request: {
          tag: "PROGRAM-REPORT",
          requestedBy: this.userId,
          dataset: "ml-observation",
          datasetConfig: {
            // batchId: this.batch.batchId
          },
          output_format: 'csv'
        }
      };
      // if (this.selectedReport.encrypt === 'true') {
      //   request.request['encryptionKey'] = this.reportForm.controls.password.value;
      // }
      console.log('submit the report',request);
      this.onDemandReportService.submitRequest(request).subscribe((data: any) => {
        if (data && data.result) {

          console.log("submit request",data.result);
          // if (data.result.status === this.reportStatus.failed) {
          //   const error = _.get(data, 'result.statusMessage') || _.get(this.resourceService, 'frmelmnts.lbl.requestFailed');
          //   this.toasterService.error(error);
          // }
          // data = this.dataModification(data['result']);
          // const updatedReportList = [data, ...this.onDemandReportData];
          // this.onDemandReportData = _.slice(updatedReportList, 0, 10);
        }
        // this.reportForm.reset();
      }, error => {
        // this.reportForm.reset();
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
    // } else {
    //   this.isProcessed = true;
    //   setTimeout(()=>{
    //     this.isProcessed = false;
    //   }, 5000)
    //   this.toasterService.error(_.get(this.resourceService, 'frmelmnts.lbl.requestFailed'));
    // }
  }

  public getFormDetails() {
    const formServiceInputParams = {
      formType: 'program-dashboard',
      formAction: 'reportData',
      contentType: "csv-dataset",
      component: 'portal'
     };
    
     this.formService.getFormConfig(formServiceInputParams).subscribe((formData) => {

      if(formData){
        this.formData = formData;
      }
      // fields.forEach(item => { item.title = this.resourceService.frmelmnts.lbl[item.title]; });
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });

  }

}
