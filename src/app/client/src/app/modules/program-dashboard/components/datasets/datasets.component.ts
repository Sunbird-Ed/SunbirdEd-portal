import { Component, OnInit } from '@angular/core';


import { ToasterService, NavigationHelperService, LayoutService, ResourceService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { Subject } from 'rxjs';
import { TncService } from '@sunbird/core';
import { first, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';


@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})



export class DatasetsComponent implements OnInit {

  public activatedRoute: ActivatedRoute;

  reportTypes = [];
  programs = ['School Development Program', 'Block Development Program'];
  solutions = ['observation', 'observation_with_rubric', 'project', 'survey'];

  formData = {
    "project": [
      {
        "name": "Task Detail Report",
        "protected": true,
        "accessableTo": [
          "PM"
        ]
      },
      {
        "name": "Status Report",
        "protected": false,
        "accessableTo": [
          "PM",
          "PD"
        ]
      }
    ],
    "observation": [
      {
        "name": "Question Report",
        "protected": true,
        "accessableTo": [
          "PM"
        ]
      },
      {
        "name": "Status Report",
        "protected": false,
        "accessableTo": [
          "PM",
          "PD"
        ]
      }
    ],
    "observation_with_rubric": [
      {
        "name": "Task Detail Report",
        "protected": true,
        "accessableTo": [
          "PM"
        ]
      },
      {
        "name": "Status Report",
        "protected": false,
        "accessableTo": [
          "PM",
          "PD"
        ]
      },
      {
        "name": "Domain Criteria Report",
        "protected": false,
        "accessableTo": [
          "PM",
          "DM"
        ]
      }
    ],
    "survey": [
      {
        "name": "Task Detail Report",
        "protected": true,
        "accessableTo": [
          "PM"
        ]
      },
      {
        "name": "Status Report",
        "protected": false,
        "accessableTo": [
          "PM",
          "PD"
        ]
      }
    ]
  };

  public columns = [
    { name: 'Report type', isSortable: true, prop: 'request_id', placeholder: 'Filter report type' },
    { name: 'Request date', isSortable: true, prop: 'jobStats.dtJobSubmitted', placeholder: 'Filter request date', type: 'date' },
    { name: 'Status', isSortable: false, prop: 'status', placeholder: 'Filter status' },
    { name: 'Report link', isSortable: false, prop: 'download_urls', placeholder: 'Filter download link' },
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
      'download_urls': [
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
    programName: new FormControl(''),
    solution: new FormControl(''),
    reportType: new FormControl(''),
    password: new FormControl('')
  });

  programSelected: any;

  constructor(
    activatedRoute: ActivatedRoute,
    public layoutService: LayoutService,
    public telemetryService: TelemetryService,
    public resourceService: ResourceService
  ) {
    this.activatedRoute = activatedRoute;
  }

  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.initLayout();
    }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  public selectDropdown() {
    if (this.programSelected && this.reportForm.value && this.reportForm.value['solution']) {
      this.reportTypes = this.formData[this.reportForm.value['solution']];

    }
  }


}
