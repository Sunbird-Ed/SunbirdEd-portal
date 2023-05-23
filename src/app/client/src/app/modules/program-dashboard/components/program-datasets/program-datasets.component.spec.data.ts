export let mockData = {
  programs: {
    ver: "1.0",
    id: "2823343f-65d8-4061-ad3b-53a9eb943724",
    ts: "2020-09-18T02:56:59.910+00:00",
    params: {
      resmsgid: "2823343f-65d8-4061-ad3b-53a9eb943724",
      status: "successful",
      client_key: null,
    },
    responseCode: "OK",
    result: [
      {
        _id: "5f34e44681871d939950bca6",
        externalId: "TN-Program-1597301830708",
        name: "TN-Program",
        description: "TN01-Mantra4Change-APSWREIS School Leader Feedback",
        role: ["PM"],
        requestForPIIConsent:true
      },
      {
        _id: "5f34ec17585244939f89f90c",
        externalId: "MH-Program-1597303831605",
        name: "MH-Program",
        description: "MH01-Mantra4Change-APSWREIS School Leader Feedback",
        role: ["PM"],
        requestForPIIConsent:false
      },
      {
        _id: "5f75b90454670074deacf087",
        name: "Skilling Teachers -- Google Project",
        externalId: "PGM-2948-KEF-RTLBS-INDIVIDUAL_ASSESSMENT",
        description: "This is a type of individual assessment",
        role: ["PM"],
      },
      {
        _id: "5f7f262e54670074deb99bcb",
        externalId: "PGM_NIQSA_Self_Assessment-Feb2020",
        name: "NIQSA Self Assessment",
        description:
          "This tool is used to assess schools that are part of NISA on five domains of the NIQSA quality charter.",
        role: ["PM"],
      },
    ],
  },
  solutions: {
    ver: "1.0",
    id: "2823343f-65d8-4061-ad3b-53a9eb943724",
    ts: "2020-09-18T02:56:59.910+00:00",
    params: {
      resmsgid: "2823343f-65d8-4061-ad3b-53a9eb943724",
      status: "successful",
      client_key: null,
    },
    responseCode: "OK",
    result: [
      {
        _id: "5f34ec17585244939f89f90d",
        isRubricDriven: true,
        criteriaLevelReport:true,
        externalId:
          "cbd074fa-dd11-11ea-a3bf-000d3af02677-OBSERVATION-TEMPLATE-1597303831612",
        name: "MH01-Mantra4Change-APSWREIS School Leader Feedback",
        description: "MH01-Mantra4Change-APSWREIS School Leader Feedback",
        type: "observation",
        subType: "",
      },
      {
        _id: "5fbb75537380505718640436",
        type: "improvementproject",
        isRubricDriven: false,
        criteriaLevelReport:false,
        subType: "",
        externalId: "7146aa30-2d67-11eb-b70e-55ade5205c81",
        name: "Health Awareness Project",
        description: "",
      },
      {
        _id: "5fbb75537380505718640437",
        type: "improvementproject",
        isRubricDriven: false,
        criteriaLevelReport:false,
        subType: "",
        externalId: "71471f60-2d67-11eb-b70e-55ade5205c81",
        name: "Safe School Project",
        description: "",
      },
      {
        _id: "5fbb75537380505718640438",
        type: "survey",
        isRubricDriven: false,
        criteriaLevelReport:false,
        subType: "",
        externalId: "71471f60-2d67-11eb-b70e-55ade5205c82",
        name: "Safe School survey",
        description: "",
      },
    ],
  },
  FormData: {
    improvementproject: [
      {
        name: "Task Detail Report",
        encrypt: true,
        datasetId: "ml-improvementproject-task-detail-report",
        roles: ["PM"],
      },
      {
        name: "Status Report",
        encrypt: false,
        datasetId: "ml-improvementproject-status-report",
        roles: ["PM"],
      },
      {
        name: "Filtered task detail report",
        encrypt: true,
        datasetId: "ml-filtered-task-detail-exhaust",
        roles: ["PROGRAM_MANAGER"],
        configurableFilters: true,
        uiFilters: [
          {
            label: "Minimum no. of tasks in the project",
            controlType: "number",
            reference: "task_count",
            defaultValue: 5,
          },
          {
            label: "Minimum no. of task evidence",
            controlType: "number",
            reference: "task_evidence_count",
            defaultValue: 2,
          },
          {
            label: "Minimum no. of project evidence",
            controlType: "number",
            reference: "project_evidence_count",
            defaultValue: 1,
          },
        ],
      }
    ],
    observation: [
      {
        name: "Question Report",
        encrypt: true,
        datasetId: "ml-observation-question-report",
        roles: ["PM"],
      },
      {
        name: "Status Report",
        encrypt: false,
        datasetId: "ml-observation-status-report",
        roles: ["PM"],
      }
    ],
    observation_with_rubric: [
      {
        name: "Task Detail Report",
        encrypt: true,
        datasetId: "ml-observation_with_rubric-task-detail-report",
        roles: ["PM"],
      },
      {
        name: "Status Report",
        encrypt: false,
        datasetId: "ml-observation_with_rubric-status-report",
        roles: ["PM"],
      },
      {
        name: "Domain Criteria Report",
        encrypt: false,
        datasetId: "ml-observation_with_rubric-domain-criteria-report",
        roles: ["PM"],
      },
    ],
    assessment: [
      {
        name: "Task Detail Report",
        encrypt: true,
        datasetId: "ml-assessment-task-detail-report",
        roles: ["PM"],
      },
      {
        name: "Status Report",
        encrypt: false,
        datasetId: "ml-assessment-status-report",
        roles: ["PM"],
      },
    ],
    user_detail_report:[
      {
        "name": "User Detail Report",
        "encrypt": true,
        "datasetId": "ml-program-user-exhaust",
        "roles": [
            "PROGRAM_MANAGER"
        ],
        "queryType":"cassandra",
        "filters": [
          {
            "table_name": "program_enrollment",
            "table_filters": [
              {
                "name": "program_id",
                "operator": "==",
                "value": "602512d8e6aefa27d9629bc3"
              },
              {
                "name": "district_id",
                "operator": "==",
                "value": "ed9e0963-0707-443a-99c4-5994fcac7a5f"
              },
              {
                "name": "organisation_id",
                "operator": "==",
                "value": "0126796199493140480"
              },
              {
                "name": "updated_at",
                "operator": ">=",
                "value": "startDate"
              },
              {
                "name": "updated_at",
                "operator": "<=",
                "value": "endDate"
              }
            ]
          },
          {
            "table_name": "user_consent",
            "table_filters": [
              {
                "name": "object_id",
                "operator": "==",
                "value": "602512d8e6aefa27d9629bc3"
              }
            ]
          }
        ]
    }
    ],
  },
  userProfile: {
    userId: "b2cb1e94-1a35-48d3-96dc-b7dfde252aa2",
    lastName: null,
    tcStatus: null,
    maskedPhone: null,
    rootOrgName: "CustROOTOrg10",
    roles: ["PUBLIC", "PROGRAM_MANAGER"],
    channel: "custchannel",
    updatedDate: null,
    prevUsedPhone: "",
    stateValidated: false,
    isDeleted: false,
    organisations: [
      {
        updatedBy: null,
        organisationId: "01285019302823526477",
        orgName: "CustROOTOrg10",
        addedByName: null,
        addedBy: null,
        roles: ["PUBLIC"],
        approvedBy: null,
        updatedDate: null,
        userId: "b2cb1e94-1a35-48d3-96dc-b7dfde252aa2",
        approvaldate: null,
        isDeleted: false,
        parentOrgId: null,
        hashTagId: "01285019302823526477",
        isRejected: null,
        position: null,
        id: "01302569853059072057",
        orgjoindate: "2020-05-21 08:49:17:549+0000",
        isApproved: null,
        orgLeftDate: null,
        identifier: "ORG_001",
      },
    ],
    rootOrg: {
      dateTime: null,
      preferredLanguage: "English",
      approvedBy: null,
      channel: "ROOT_ORG",
      description: "Sunbird",
      updatedDate: "2017-08-24 06:02:10:846+0000",
      addressId: null,
      orgType: null,
      provider: null,
      orgCode: "sunbird",
      theme: null,
      id: "ORG_001",
      communityId: null,
      isApproved: null,
      slug: "sunbird",
      identifier: "ORG_001",
      thumbnail: null,
      orgName: "Sunbird",
      updatedBy: "user1",
      externalId: null,
      isRootOrg: true,
      rootOrgId: null,
      approvedDate: null,
      imgUrl: null,
      homeUrl: null,
      isDefault: null,
      contactDetail: "[{'phone':'213124234234','email':'test@test.com'}]",
      createdDate: null,
      createdBy: null,
      parentOrgId: null,
      hashTagId: "b00bc992ef25f1a9a8d63291e20efc8d",
      noOfMembers: 1,
      status: null,
    },
    managedBy: "8454cb21-3ce9-4e30-85b5-fade097880d8",
    provider: null,
    flagsValue: 0,
    maskedEmail: null,
    id: "b2cb1e94-1a35-48d3-96dc-b7dfde252aa2",
    tempPassword: null,
    recoveryEmail: "",
    email: "",
    identifier: "b2cb1e94-1a35-48d3-96dc-b7dfde252aa2",
    thumbnail: null,
    updatedBy: null,
    accesscode: null,
    profileSummary: null,
    phoneVerified: false,
    tcUpdatedDate: null,
    locationIds: [],
    registryId: null,
    recoveryPhone: "",
    userName: "9885632_y6nj",
    rootOrgId: "01285019302823526477",
    prevUsedEmail: "",
    firstName: "9885632",
    lastLoginTime: null,
    emailVerified: "false",
    tncAcceptedOn: "2020-05-21T08:49:18.211Z",
    framework: {},
    createdDate: "2020-05-21 08:49:14:762+0000",
    phone: "",
    createdBy: null,
    currentLoginTime: null,
    userType: "OTHER",
    tncAcceptedVersion: "v1",
    status: 1,
  },
  reportListResponse: {
    ver: "1.0",
    ts: "2020-09-18T02:56:59.910+00:00",
    params: {
      resmsgid: "2823343f-65d8-4061-ad3b-53a9eb943724",
      status: "successful",
      client_key: null,
    },
    responseCode: "OK",
    result: {
      count: 2,
      jobs: [
        {
          request_id: "A09115FCBEC94CE6ACEB4D9BBFDBCBCF",
          tag: "test-tag:in.ekstep",
          job_id: "assessment-dashboard-metrics",
          requested_by: "client-2",
          requested_channel: "in.ekstep",
          status: "SUBMITTED",
          last_updated: 1599661955303,
          datasetConfig: {
            title: "report 1",
            type: "assessment-dashboard-metrics",
          },
          request_data: {
            batchFilters: ["TPD", "NCFCOPY"],
            contentFilters: {
              request: {
                filters: {
                  identifier: [
                    "do_11305960936384921612216",
                    "do_1130934466492252161819",
                  ],
                  prevState: "Draft",
                },
                sort_by: {
                  createdOn: "desc",
                },
                limit: 10000,
                fields: [
                  "framework",
                  "identifier",
                  "name",
                  "channel",
                  "prevState",
                ],
              },
            },
            reportPath: "course-progress-v2/",
          },
          attempts: 0,
          job_stats: {
            dt_job_submitted: 1599661955303,
            dt_job_completed: 1599661955303,
            execution_time: null,
          },
          downloadUrls: [],
          expires_at: 1600399619,
        },
        {
          request_id: "AE3DDC23B3F189ED2A57B567D6434BE7",
          tag: "test-tag:in.ekstep",
          job_id: "assessment-dashboard-metrics",
          requested_by: "client-1",
          requested_channel: "in.ekstep",
          status: "SUBMITTED",
          last_updated: 1599728944037,
          datasetConfig: {
            title: "report 2",
            type: "assessment-dashboard-metrics",
          },
          request_data: {
            batchFilters: ["TPD", "NCFCOPY"],
            contentFilters: {
              request: {
                filters: {
                  identifier: [
                    "do_11305960936384921612216",
                    "do_1130934466492252161819",
                  ],
                  prevState: "Draft",
                },
                sort_by: {
                  createdOn: "desc",
                },
                limit: 10000,
                fields: [
                  "framework",
                  "identifier",
                  "name",
                  "channel",
                  "prevState",
                ],
              },
            },
            reportPath: "course-progress-v2/",
          },
          attempts: 0,
          job_stats: {
            dt_job_submitted: 1599728944037,
            dt_job_completed: null,
            execution_time: null,
          },
          downloadUrls: [],
          expires_at: 1600399619,
        },
      ],
    },
  },
  districtAndOrganisations: {
    ver: "1.0",
    id: "2823343f-65d8-4061-ad3b-53a9eb943724",
    ts: "2020-09-18T02:56:59.910+00:00",
    params: {
      resmsgid: "2823343f-65d8-4061-ad3b-53a9eb943724",
      status: "successful",
      client_key: null,
    },
    responseCode: "OK",
    result: {
      districts: [
        {
          name: "ANANTAPUR",
          id: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
        },
        {
          name: "EAST GODAVARI",
          id: "aecac7ab-15e4-45c9-ac7b-d716444cd652",
        },
      ],
      organisations: [
        {
          name: "TAMILNADU",
          id: "01269878797503692810",
        },
        {
          name: "JHS NARHARPUR",
          id: "0869878797503692810",
        },
      ],
    },
  },
  reportConfig: {
    count: 1,
    reports: [
      {
        reportid: "88790d2b-c100-41ba-b349-bb3375025de5",
        title: "New Observation with rubric report New New New",
        description:
          "The reports provides the operational and insight charts for observation with rubric forms",
        authorizedroles: ["REPORT_ADMIN", "ORG_ADMIN", "REPORT_VIEWER"],
        status: "draft",
        type: "public",
        reportaccessurl:
          '"https://staging.sunbirded.org"/dashBoard/reports/88790d2b-c100-41ba-b349-bb3375025de5',
        createdon: "2022-07-08T16:57:18.805Z",
        updatedon: "2022-07-08T16:57:18.805Z",
        createdby: "fca2925f-1eee-4654-9177-fece3fd6afc9",
        reportconfig: {
          files: [],
          label: "New Observation with rubric report New New New",
          table: [],
          title: "New Observation with rubric report New New New",
          charts: [
            {
              id: "Big_Number",
              bigNumbers: [
                {
                  footer: " ",
                  header: "Unique users who submitted form",
                  dataExpr: "Total Unique Users",
                },
                {
                  footer: " ",
                  header: "Unique Users who started form",
                  dataExpr: "Unique Users who started form",
                },
                {
                  footer: " ",
                  header: "Total submissions",
                  dataExpr: "Total submissions",
                },
                {
                  footer: " ",
                  header: "Total entities observed",
                  dataExpr: "Total entities observed",
                },
              ],
              dataSource: {
                ids: [
                  "ml_total_unique_users_api_testo_pabitra_new1_one",
                  "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
                  "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
                  "ml_total_submissions_api_test_pabitra_new1_final_two",
                ],
                commonDimension: "Date",
              },
            },
            {
              id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
              colors: [
                {
                  borderColor: "rgb(0, 199, 134)",
                  borderWidth: 2,
                  backgroundColor: "rgba(0, 199, 134, 0.3)",
                },
                {
                  borderColor: "rgb(255, 161, 29)",
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 161, 29, 0.3)",
                },
                {
                  borderColor: "rgb(255, 69, 88)",
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 69, 88, 0.3)",
                },
                {
                  borderColor: "rgb(242, 203, 28)",
                  borderWidth: 2,
                  backgroundColor: "rgba(242, 203, 28, 0.3)",
                },
                {
                  borderColor: "rgb(55, 70, 73)",
                  borderWidth: 2,
                  backgroundColor: "rgba(55, 70, 73, 0.3)",
                },
              ],
              filters: [
                {
                  reference: "district_name",
                  controlType: "multi-select",
                  displayName: "District",
                },
                {
                  reference: "organisation_name",
                  controlType: "multi-select",
                  displayName: "Organisation",
                },
              ],
              options: {
                title: {
                  text: "District-wise unique users who submitted form",
                  display: true,
                  fontSize: 16,
                },
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        autoSkip: false,
                      },
                      scaleLabel: {
                        display: true,
                        labelString: "district_name",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        precision: 0,
                        beginAtZero: true,
                      },
                      scaleLabel: {
                        display: true,
                        labelString: "No. of unique users",
                      },
                    },
                  ],
                },
                tooltips: {
                  mode: "x-axis",
                  intersect: false,
                  bodySpacing: 5,
                  titleSpacing: 5,
                },
                responsive: true,
                showLastUpdatedOn: true,
              },
              datasets: [
                {
                  label: "No of unique users",
                  dataExpr: "No of unique users",
                },
              ],
              chartType: "bar",
              dataSource: {
                ids: [
                  "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
                ],
                commonDimension: "district_name",
              },
              labelsExpr: "district_name",
            },
            {
              id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
              colors: [
                {
                  borderColor: "rgb(0, 199, 134)",
                  borderWidth: 2,
                  backgroundColor: "rgba(0, 199, 134, 0.3)",
                },
                {
                  borderColor: "rgb(255, 161, 29)",
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 161, 29, 0.3)",
                },
                {
                  borderColor: "rgb(255, 69, 88)",
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 69, 88, 0.3)",
                },
                {
                  borderColor: "rgb(242, 203, 28)",
                  borderWidth: 2,
                  backgroundColor: "rgba(242, 203, 28, 0.3)",
                },
                {
                  borderColor: "rgb(55, 70, 73)",
                  borderWidth: 2,
                  backgroundColor: "rgba(55, 70, 73, 0.3)",
                },
              ],
              filters: [
                {
                  reference: "district_name",
                  controlType: "multi-select",
                  displayName: "District",
                },
                {
                  reference: "organisation_name",
                  controlType: "multi-select",
                  displayName: "Organisation",
                },
              ],
              options: {
                title: {
                  text: "District-wise submissions Vs observation status",
                  display: true,
                  fontSize: 16,
                },
                legend: {
                  display: true,
                },
                scales: {
                  xAxes: [
                    {
                      stacked: true,
                      scaleLabel: {
                        display: true,
                        labelString: "district_name",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        precision: 0,
                        beginAtZero: true,
                      },
                      stacked: true,
                      scaleLabel: {
                        display: true,
                        labelString: "No. of submissions",
                      },
                    },
                  ],
                },
                tooltips: {
                  mode: "x-axis",
                  intersect: false,
                  bodySpacing: 5,
                  titleSpacing: 5,
                },
                responsive: true,
                showLastUpdatedOn: true,
              },
              datasets: [
                {
                  label: "Submitted",
                  dataExpr: "Completed",
                },
                {
                  label: "Started",
                  dataExpr: "Started",
                },
                {
                  label: "In Progress",
                  dataExpr: "In Progress",
                },
              ],
              chartType: "bar",
              dataSource: {
                ids: [
                  "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
                ],
                commonDimension: "district_name",
              },
              labelsExpr: "district_name",
            },
            {
              id: "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
              colors: [
                {
                  borderColor: "rgb(0, 199, 134)",
                  borderWidth: 2,
                  backgroundColor: "rgba(0, 199, 134, 0.3)",
                },
                {
                  borderColor: "rgb(255, 161, 29)",
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 161, 29, 0.3)",
                },
                {
                  borderColor: "rgb(255, 69, 88)",
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 69, 88, 0.3)",
                },
                {
                  borderColor: "rgb(242, 203, 28)",
                  borderWidth: 2,
                  backgroundColor: "rgba(242, 203, 28, 0.3)",
                },
                {
                  borderColor: "rgb(55, 70, 73)",
                  borderWidth: 2,
                  backgroundColor: "rgba(55, 70, 73, 0.3)",
                },
              ],
              filters: [
                {
                  reference: "district_name",
                  controlType: "multi-select",
                  displayName: "District",
                },
                {
                  reference: "organisation_name",
                  controlType: "multi-select",
                  displayName: "Organisation",
                },
              ],
              options: {
                title: {
                  text: "District-wise unique entities observed",
                  display: true,
                  fontSize: 16,
                },
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        autoSkip: false,
                      },
                      scaleLabel: {
                        display: true,
                        labelString: "Districts",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        precision: 0,
                        beginAtZero: true,
                      },
                      scaleLabel: {
                        display: true,
                        labelString: "No of entities",
                      },
                    },
                  ],
                },
                tooltips: {
                  mode: "x-axis",
                  intersect: false,
                  bodySpacing: 5,
                  titleSpacing: 5,
                },
                responsive: true,
                showLastUpdatedOn: true,
              },
              datasets: [
                {
                  label: "No of entities",
                  dataExpr: "No of entities",
                },
              ],
              chartType: "bar",
              dataSource: {
                ids: [
                  "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
                ],
                commonDimension: "district_name",
              },
              labelsExpr: "district_name",
            },
            {
              id: "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
              colors: [
                {
                  borderColor: "rgb(255, 69, 88)",
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 69, 88, 0.3)",
                },
                {
                  borderColor: "rgb(242, 203, 28)",
                  borderWidth: 2,
                  backgroundColor: "rgba(242, 203, 28, 0.3)",
                },
                {
                  borderColor: "rgb(0, 199, 134)",
                  borderWidth: 2,
                  backgroundColor: "rgba(0, 199, 134, 0.3)",
                },
                {
                  borderColor: "rgb(26, 26, 255)",
                  borderWidth: 2,
                  backgroundColor: "rgba(26, 26, 255, 0.3)",
                },
                {
                  borderColor: "rgb(179, 0, 179)",
                  borderWidth: 2,
                  backgroundColor: "rgba(179, 0, 179, 0.3)",
                },
              ],
              filters: [
                {
                  reference: "district_name",
                  controlType: "multi-select",
                  displayName: "District",
                },
                {
                  reference: "organisation_name",
                  controlType: "multi-select",
                  displayName: "Organisation",
                },
              ],
              options: {
                title: {
                  text: "Criteria-wise unique entities at each level",
                  display: true,
                  fontSize: 16,
                },
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        autoSkip: false,
                        minRotation: 0,
                      },
                      stacked: true,
                      scaleLabel: {
                        display: true,
                        labelString: "Criterias",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        precision: 0,
                        beginAtZero: true,
                      },
                      stacked: true,
                      scaleLabel: {
                        display: true,
                        labelString: "No. of unique entities",
                      },
                    },
                  ],
                },
                tooltips: {
                  mode: "point",
                  intersect: false,
                  bodySpacing: 5,
                  titleSpacing: 5,
                },
                responsive: true,
                showLastUpdatedOn: true,
                maintainAspectRatio: true,
              },
              datasets: [
                {
                  label: "L1",
                  dataExpr: "L1",
                },
                {
                  label: "L2",
                  dataExpr: "L2",
                },
                {
                  label: "L3",
                  dataExpr: "L3",
                },
                {
                  label: "L4",
                  dataExpr: "L4",
                },
                {
                  label: "L5",
                  dataExpr: "L5",
                },
              ],
              chartType: "bar",
              dataSource: {
                ids: [
                  "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
                ],
                commonDimension: "Criteria",
              },
              labelsExpr: "Criteria",
            },
            {
              id: "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
              colors: [
                {
                  borderColor: "rgb(255, 69, 88)",
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 69, 88, 0.3)",
                },
                {
                  borderColor: "rgb(242, 203, 28)",
                  borderWidth: 2,
                  backgroundColor: "rgba(242, 203, 28, 0.3)",
                },
                {
                  borderColor: "rgb(0, 199, 134)",
                  borderWidth: 2,
                  backgroundColor: "rgba(0, 199, 134, 0.3)",
                },
                {
                  borderColor: "rgb(26, 26, 255)",
                  borderWidth: 2,
                  backgroundColor: "rgba(26, 26, 255, 0.3)",
                },
                {
                  borderColor: "rgb(179, 0, 179)",
                  borderWidth: 2,
                  backgroundColor: "rgba(179, 0, 179, 0.3)",
                },
              ],
              filters: [
                {
                  reference: "district_name",
                  controlType: "multi-select",
                  displayName: "District",
                },
                {
                  reference: "organisation_name",
                  controlType: "multi-select",
                  displayName: "Organisation",
                },
              ],
              options: {
                title: {
                  text: "Domain-wise unique entities at each level",
                  display: true,
                  fontSize: 16,
                },
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [
                    {
                      stacked: true,
                      scaleLabel: {
                        display: true,
                        labelString: "Domains",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        precision: 0,
                        beginAtZero: true,
                      },
                      stacked: true,
                      scaleLabel: {
                        display: true,
                        labelString: "No. of unique entities",
                      },
                    },
                  ],
                },
                tooltips: {
                  mode: "point",
                  intersect: false,
                  bodySpacing: 5,
                  titleSpacing: 5,
                },
                responsive: true,
                showLastUpdatedOn: true,
              },
              datasets: [
                {
                  label: "L1",
                  dataExpr: "L1",
                },
                {
                  label: "L2",
                  dataExpr: "L2",
                },
                {
                  label: "L3",
                  dataExpr: "L3",
                },
                {
                  label: "L4",
                  dataExpr: "L4",
                },
                {
                  label: "L5",
                  dataExpr: "L5",
                },
              ],
              chartType: "bar",
              dataSource: {
                ids: [
                  "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
                ],
                commonDimension: "Domain",
              },
              labelsExpr: "Domain",
            },
          ],
          dataSource: [
            {
              id: "ml_total_unique_users_api_testo_pabitra_new1_one",
              path: "/reports/fetch/$slug/ml_total_unique_users_api_testo_pabitra_new1_one.json",
            },
            {
              id: "ml_total_submissions_api_test_pabitra_new1_final_two",
              path: "/reports/fetch/$slug/ml_total_submissions_api_test_pabitra_new1_final_two.json",
            },
            {
              id: "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
              path: "/reports/fetch/$slug/total_entities_observed_new_new_new_api_test_pabitra_new1_final_three.json",
            },
            {
              id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
              path: "/reports/fetch/$slug/ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four.json",
            },
            {
              id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
              path: "/reports/fetch/$slug/district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five.json",
            },
            {
              id: "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
              path: "/reports/fetch/$slug/ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six.json",
            },
            {
              id: "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
              path: "/reports/fetch/$slug/ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven.json",
            },
            {
              id: "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
              path: "/reports/fetch/$slug/ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight.json",
            },
            {
              id: "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
              path: "/reports/fetch/$slug/ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine.json",
            },
          ],
          description:
            "The reports provides the operational and insight charts for observation with rubric forms",
          downloadUrl:
            "/reports/fetch/$slug/ml_total_unique_users_api_testo_pabitra_new1_one.csv",
          report_type: "program_dashboard",
          report_status: "active",
          solution_type: "observation_with_rubric",
        },
        templateurl: null,
        slug: "hawk-eye",
        reportgenerateddate: "2022-05-27T00:00:00.000Z",
        reportduration: {
          enddate: "12-02-2020",
          startdate: "12-02-2020",
        },
        tags: ["1Bn"],
        updatefrequency: "one-time",
        parameters: ["$slug"],
        report_type: "report",
        accesspath: null,
        visibilityflags: null,
        isParameterized: true,
        hashed_val: "dG4=",
        materialize: true,
      },
    ],
  },
  reportData: {
    charts: [
      {
        chartConfig: {
          id: "Big_Number",
          bigNumbers: [
            {
              footer: " ",
              header: "Unique users who submitted form",
              dataExpr: "Total Unique Users",
            },
            {
              footer: " ",
              header: "Unique Users who started form",
              dataExpr: "Unique Users who started form",
            },
            {
              footer: " ",
              header: "Total submissions",
              dataExpr: "Total submissions",
            },
            {
              footer: " ",
              header: "Total entities observed",
              dataExpr: "Total entities observed",
            },
          ],
          dataSource: {
            ids: [
              "ml_total_unique_users_api_testo_pabitra_new1_one",
              "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
              "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
              "ml_total_submissions_api_test_pabitra_new1_final_two",
            ],
            commonDimension: "Date",
          },
        },
        downloadUrl: [
          {
            id: "ml_total_unique_users_api_testo_pabitra_new1_one",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_total_unique_users_api_testo_pabitra_new1_one.json",
          },
          {
            id: "ml_total_submissions_api_test_pabitra_new1_final_two",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_total_submissions_api_test_pabitra_new1_final_two.json",
          },
          {
            id: "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/total_entities_observed_new_new_new_api_test_pabitra_new1_final_three.json",
          },
          {
            id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four.json",
          },
          {
            id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five.json",
          },
          {
            id: "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six.json",
          },
          {
            id: "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven.json",
          },
          {
            id: "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight.json",
          },
          {
            id: "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine.json",
          },
        ],
        chartData: [
          {
            district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "KRISHNA",
            "Total Unique Users": "1.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total Unique Users": "2.0",
          },
          {
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "CHITTOOR",
            "Total Unique Users": "2.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total Unique Users": "7.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total Unique Users": "1.0",
          },
          null,
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "10.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "2.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
          },
          {
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "2.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "CHITTOOR",
          },
          {
            district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "KRISHNA",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "1.0",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total submissions": "6.0",
          },
          {
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "CHITTOOR",
            "Total submissions": "2.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total submissions": "3.0",
          },
          {
            district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "KRISHNA",
            "Total submissions": "2.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total submissions": "19.0",
          },
        ],
        lastUpdatedOn: 1658135572000,
      },
      {
        chartConfig: {
          id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
          colors: [
            {
              borderColor: "rgb(0, 199, 134)",
              borderWidth: 2,
              backgroundColor: "rgba(0, 199, 134, 0.3)",
            },
            {
              borderColor: "rgb(255, 161, 29)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 161, 29, 0.3)",
            },
            {
              borderColor: "rgb(255, 69, 88)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 69, 88, 0.3)",
            },
            {
              borderColor: "rgb(242, 203, 28)",
              borderWidth: 2,
              backgroundColor: "rgba(242, 203, 28, 0.3)",
            },
            {
              borderColor: "rgb(55, 70, 73)",
              borderWidth: 2,
              backgroundColor: "rgba(55, 70, 73, 0.3)",
            },
          ],
          filters: [
            {
              reference: "district_name",
              controlType: "multi-select",
              displayName: "District",
            },
            {
              reference: "organisation_name",
              controlType: "multi-select",
              displayName: "Organisation",
            },
          ],
          options: {
            title: {
              text: "District-wise submissions Vs observation status",
              display: true,
              fontSize: 16,
            },
            legend: {
              display: true,
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                  scaleLabel: {
                    display: true,
                    labelString: "district_name",
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    precision: 0,
                    beginAtZero: true,
                  },
                  stacked: true,
                  scaleLabel: {
                    display: true,
                    labelString: "No. of submissions",
                  },
                },
              ],
            },
            tooltips: {
              mode: "x-axis",
              intersect: false,
              bodySpacing: 5,
              titleSpacing: 5,
            },
            responsive: true,
            showLastUpdatedOn: true,
          },
          datasets: [
            {
              label: "Submitted",
              dataExpr: "Completed",
            },
            {
              label: "Started",
              dataExpr: "Started",
            },
            {
              label: "In Progress",
              dataExpr: "In Progress",
            },
          ],
          chartType: "bar",
          dataSource: {
            ids: [
              "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
            ],
            commonDimension: "district_name",
          },
          labelsExpr: "district_name",
        },
        downloadUrl: [
          {
            id: "ml_total_unique_users_api_testo_pabitra_new1_one",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_total_unique_users_api_testo_pabitra_new1_one.json",
          },
          {
            id: "ml_total_submissions_api_test_pabitra_new1_final_two",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_total_submissions_api_test_pabitra_new1_final_two.json",
          },
          {
            id: "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/total_entities_observed_new_new_new_api_test_pabitra_new1_final_three.json",
          },
          {
            id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four.json",
          },
          {
            id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five.json",
          },
          {
            id: "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six.json",
          },
          {
            id: "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven.json",
          },
          {
            id: "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight.json",
          },
          {
            id: "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
            path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine.json",
          },
        ],
        chartData: [
          {
            Started: "4.0",
            district_externalId: "f3e5b768-9008-4073-baf5-1dffc3c12b0b",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "0.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "unknown",
          },
          {
            Started: "1.0",
            district_externalId: "87422ed0-d2dd-4672-9d6b-10a4b565dfe3",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "0.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "GUNTUR",
          },
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "2.0",
            Completed: "3.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "9.0",
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "3.0",
            Completed: "2.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "CHITTOOR",
          },
          {
            Started: "26.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "7.0",
            Completed: "19.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "3.0",
            district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "2.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "KRISHNA",
          },
          {
            Started: "1.0",
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "0.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "CHITTOOR",
          },
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "6.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
        ],
        lastUpdatedOn: 1658121421000,
      },
    ],
    tables: [],
    reportMetaData: {
      files: [],
      label: "New Observation with rubric report New New New",
      table: [],
      title: "New Observation with rubric report New New New",
      charts: [
        {
          id: "Big_Number",
          bigNumbers: [
            {
              footer: " ",
              header: "Unique users who submitted form",
              dataExpr: "Total Unique Users",
            },
            {
              footer: " ",
              header: "Unique Users who started form",
              dataExpr: "Unique Users who started form",
            },
            {
              footer: " ",
              header: "Total submissions",
              dataExpr: "Total submissions",
            },
            {
              footer: " ",
              header: "Total entities observed",
              dataExpr: "Total entities observed",
            },
          ],
          dataSource: {
            ids: [
              "ml_total_unique_users_api_testo_pabitra_new1_one",
              "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
              "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
              "ml_total_submissions_api_test_pabitra_new1_final_two",
            ],
            commonDimension: "Date",
          },
        },
        {
          id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
          colors: [
            {
              borderColor: "rgb(0, 199, 134)",
              borderWidth: 2,
              backgroundColor: "rgba(0, 199, 134, 0.3)",
            },
            {
              borderColor: "rgb(255, 161, 29)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 161, 29, 0.3)",
            },
            {
              borderColor: "rgb(255, 69, 88)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 69, 88, 0.3)",
            },
            {
              borderColor: "rgb(242, 203, 28)",
              borderWidth: 2,
              backgroundColor: "rgba(242, 203, 28, 0.3)",
            },
            {
              borderColor: "rgb(55, 70, 73)",
              borderWidth: 2,
              backgroundColor: "rgba(55, 70, 73, 0.3)",
            },
          ],
          filters: [
            {
              reference: "district_name",
              controlType: "multi-select",
              displayName: "District",
            },
            {
              reference: "organisation_name",
              controlType: "multi-select",
              displayName: "Organisation",
            },
          ],
          options: {
            title: {
              text: "District-wise unique users who submitted form",
              display: true,
              fontSize: 16,
            },
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    autoSkip: false,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "district_name",
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    precision: 0,
                    beginAtZero: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "No. of unique users",
                  },
                },
              ],
            },
            tooltips: {
              mode: "x-axis",
              intersect: false,
              bodySpacing: 5,
              titleSpacing: 5,
            },
            responsive: true,
            showLastUpdatedOn: true,
          },
          datasets: [
            {
              label: "No of unique users",
              dataExpr: "No of unique users",
            },
          ],
          chartType: "bar",
          dataSource: {
            ids: [
              "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
            ],
            commonDimension: "district_name",
          },
          labelsExpr: "district_name",
        },
        {
          id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
          colors: [
            {
              borderColor: "rgb(0, 199, 134)",
              borderWidth: 2,
              backgroundColor: "rgba(0, 199, 134, 0.3)",
            },
            {
              borderColor: "rgb(255, 161, 29)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 161, 29, 0.3)",
            },
            {
              borderColor: "rgb(255, 69, 88)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 69, 88, 0.3)",
            },
            {
              borderColor: "rgb(242, 203, 28)",
              borderWidth: 2,
              backgroundColor: "rgba(242, 203, 28, 0.3)",
            },
            {
              borderColor: "rgb(55, 70, 73)",
              borderWidth: 2,
              backgroundColor: "rgba(55, 70, 73, 0.3)",
            },
          ],
          filters: [
            {
              reference: "district_name",
              controlType: "multi-select",
              displayName: "District",
            },
            {
              reference: "organisation_name",
              controlType: "multi-select",
              displayName: "Organisation",
            },
          ],
          options: {
            title: {
              text: "District-wise submissions Vs observation status",
              display: true,
              fontSize: 16,
            },
            legend: {
              display: true,
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                  scaleLabel: {
                    display: true,
                    labelString: "district_name",
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    precision: 0,
                    beginAtZero: true,
                  },
                  stacked: true,
                  scaleLabel: {
                    display: true,
                    labelString: "No. of submissions",
                  },
                },
              ],
            },
            tooltips: {
              mode: "x-axis",
              intersect: false,
              bodySpacing: 5,
              titleSpacing: 5,
            },
            responsive: true,
            showLastUpdatedOn: true,
          },
          datasets: [
            {
              label: "Submitted",
              dataExpr: "Completed",
            },
            {
              label: "Started",
              dataExpr: "Started",
            },
            {
              label: "In Progress",
              dataExpr: "In Progress",
            },
          ],
          chartType: "bar",
          dataSource: {
            ids: [
              "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
            ],
            commonDimension: "district_name",
          },
          labelsExpr: "district_name",
        },
        {
          id: "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
          colors: [
            {
              borderColor: "rgb(0, 199, 134)",
              borderWidth: 2,
              backgroundColor: "rgba(0, 199, 134, 0.3)",
            },
            {
              borderColor: "rgb(255, 161, 29)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 161, 29, 0.3)",
            },
            {
              borderColor: "rgb(255, 69, 88)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 69, 88, 0.3)",
            },
            {
              borderColor: "rgb(242, 203, 28)",
              borderWidth: 2,
              backgroundColor: "rgba(242, 203, 28, 0.3)",
            },
            {
              borderColor: "rgb(55, 70, 73)",
              borderWidth: 2,
              backgroundColor: "rgba(55, 70, 73, 0.3)",
            },
          ],
          filters: [
            {
              reference: "district_name",
              controlType: "multi-select",
              displayName: "District",
            },
            {
              reference: "organisation_name",
              controlType: "multi-select",
              displayName: "Organisation",
            },
          ],
          options: {
            title: {
              text: "District-wise unique entities observed",
              display: true,
              fontSize: 16,
            },
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    autoSkip: false,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Districts",
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    precision: 0,
                    beginAtZero: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "No of entities",
                  },
                },
              ],
            },
            tooltips: {
              mode: "x-axis",
              intersect: false,
              bodySpacing: 5,
              titleSpacing: 5,
            },
            responsive: true,
            showLastUpdatedOn: true,
          },
          datasets: [
            {
              label: "No of entities",
              dataExpr: "No of entities",
            },
          ],
          chartType: "bar",
          dataSource: {
            ids: [
              "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
            ],
            commonDimension: "district_name",
          },
          labelsExpr: "district_name",
        },
        {
          id: "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
          colors: [
            {
              borderColor: "rgb(255, 69, 88)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 69, 88, 0.3)",
            },
            {
              borderColor: "rgb(242, 203, 28)",
              borderWidth: 2,
              backgroundColor: "rgba(242, 203, 28, 0.3)",
            },
            {
              borderColor: "rgb(0, 199, 134)",
              borderWidth: 2,
              backgroundColor: "rgba(0, 199, 134, 0.3)",
            },
            {
              borderColor: "rgb(26, 26, 255)",
              borderWidth: 2,
              backgroundColor: "rgba(26, 26, 255, 0.3)",
            },
            {
              borderColor: "rgb(179, 0, 179)",
              borderWidth: 2,
              backgroundColor: "rgba(179, 0, 179, 0.3)",
            },
          ],
          filters: [
            {
              reference: "district_name",
              controlType: "multi-select",
              displayName: "District",
            },
            {
              reference: "organisation_name",
              controlType: "multi-select",
              displayName: "Organisation",
            },
          ],
          options: {
            title: {
              text: "Criteria-wise unique entities at each level",
              display: true,
              fontSize: 16,
            },
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    autoSkip: false,
                    minRotation: 0,
                  },
                  stacked: true,
                  scaleLabel: {
                    display: true,
                    labelString: "Criterias",
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    precision: 0,
                    beginAtZero: true,
                  },
                  stacked: true,
                  scaleLabel: {
                    display: true,
                    labelString: "No. of unique entities",
                  },
                },
              ],
            },
            tooltips: {
              mode: "point",
              intersect: false,
              bodySpacing: 5,
              titleSpacing: 5,
            },
            responsive: true,
            showLastUpdatedOn: true,
            maintainAspectRatio: true,
          },
          datasets: [
            {
              label: "L1",
              dataExpr: "L1",
            },
            {
              label: "L2",
              dataExpr: "L2",
            },
            {
              label: "L3",
              dataExpr: "L3",
            },
            {
              label: "L4",
              dataExpr: "L4",
            },
            {
              label: "L5",
              dataExpr: "L5",
            },
          ],
          chartType: "bar",
          dataSource: {
            ids: [
              "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
            ],
            commonDimension: "Criteria",
          },
          labelsExpr: "Criteria",
        },
        {
          id: "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
          colors: [
            {
              borderColor: "rgb(255, 69, 88)",
              borderWidth: 2,
              backgroundColor: "rgba(255, 69, 88, 0.3)",
            },
            {
              borderColor: "rgb(242, 203, 28)",
              borderWidth: 2,
              backgroundColor: "rgba(242, 203, 28, 0.3)",
            },
            {
              borderColor: "rgb(0, 199, 134)",
              borderWidth: 2,
              backgroundColor: "rgba(0, 199, 134, 0.3)",
            },
            {
              borderColor: "rgb(26, 26, 255)",
              borderWidth: 2,
              backgroundColor: "rgba(26, 26, 255, 0.3)",
            },
            {
              borderColor: "rgb(179, 0, 179)",
              borderWidth: 2,
              backgroundColor: "rgba(179, 0, 179, 0.3)",
            },
          ],
          filters: [
            {
              reference: "district_name",
              controlType: "multi-select",
              displayName: "District",
            },
            {
              reference: "organisation_name",
              controlType: "multi-select",
              displayName: "Organisation",
            },
          ],
          options: {
            title: {
              text: "Domain-wise unique entities at each level",
              display: true,
              fontSize: 16,
            },
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                  scaleLabel: {
                    display: true,
                    labelString: "Domains",
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    precision: 0,
                    beginAtZero: true,
                  },
                  stacked: true,
                  scaleLabel: {
                    display: true,
                    labelString: "No. of unique entities",
                  },
                },
              ],
            },
            tooltips: {
              mode: "point",
              intersect: false,
              bodySpacing: 5,
              titleSpacing: 5,
            },
            responsive: true,
            showLastUpdatedOn: true,
          },
          datasets: [
            {
              label: "L1",
              dataExpr: "L1",
            },
            {
              label: "L2",
              dataExpr: "L2",
            },
            {
              label: "L3",
              dataExpr: "L3",
            },
            {
              label: "L4",
              dataExpr: "L4",
            },
            {
              label: "L5",
              dataExpr: "L5",
            },
          ],
          chartType: "bar",
          dataSource: {
            ids: [
              "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
            ],
            commonDimension: "Domain",
          },
          labelsExpr: "Domain",
        },
      ],
      dataSource: [
        {
          id: "ml_total_unique_users_api_testo_pabitra_new1_one",
          path: "/reports/fetch/$slug/ml_total_unique_users_api_testo_pabitra_new1_one.json",
        },
        {
          id: "ml_total_submissions_api_test_pabitra_new1_final_two",
          path: "/reports/fetch/$slug/ml_total_submissions_api_test_pabitra_new1_final_two.json",
        },
        {
          id: "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
          path: "/reports/fetch/$slug/total_entities_observed_new_new_new_api_test_pabitra_new1_final_three.json",
        },
        {
          id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
          path: "/reports/fetch/$slug/ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four.json",
        },
        {
          id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
          path: "/reports/fetch/$slug/district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five.json",
        },
        {
          id: "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
          path: "/reports/fetch/$slug/ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six.json",
        },
        {
          id: "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
          path: "/reports/fetch/$slug/ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven.json",
        },
        {
          id: "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
          path: "/reports/fetch/$slug/ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight.json",
        },
        {
          id: "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
          path: "/reports/fetch/$slug/ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine.json",
        },
      ],
      description:
        "The reports provides the operational and insight charts for observation with rubric forms",
      downloadUrl:
        "/reports/fetch/$slug/ml_total_unique_users_api_testo_pabitra_new1_one.csv",
      report_type: "program_dashboard",
      report_status: "active",
      solution_type: "observation_with_rubric",
    },
    lastUpdatedOn: "18-July-2022",
  },
  urlConfig: {
    URLS: {
      KENDRA: {
        TARGETTED_ENTITY_TYPES: "users/mlcore/v1/targetedEntity/",
        PRESIGNED_URLS: "cloud-services/mlcore/v1/files/preSignedUrls",
        PROGRAMS_BY_PLATFORM_ROLES:
          "user-extension/mlcore/v1/programsByPlatformRoles",
        SOLUTIONS_BY_PROGRAMID: "user-extension/mlcore/v1/solutions",
        DISTRICTS_AND_ORGANISATIONS: "solutions/mlcore/v1/read",
      },
    },
  },
  prepTable: {
    tablesArray: [
      {
        id: "ml_district_wise_observation_status_and_entities_observed_new_new_new_new_api_new_dataaa_pabitra_eight",
        name: "District wise observation status and entities observed",
        config: {
          info: true,
          paging: true,
          filters: [
            {
              label: "district_name",
              reference: "district_name",
              searchable: true,
              controlType: "multi-select",
              displayName: "District",
              placeholder: "Select district",
            },
            {
              label: "organisation_name",
              reference: "organisation_name",
              searchable: true,
              controlType: "multi-select",
              displayName: "Organisation",
              placeholder: "Select Organisation",
            },
          ],
          lengthMenu: [10, 25, 50, 100],
          searchable: true,
          columnConfig: [
            {
              data: "district_externalId",
              title: "district_externalId",
            },
            {
              data: "program_id",
              title: "program_id",
            },
            {
              data: "solution_id",
              title: "solution_id",
            },
            {
              data: "organisation_name",
              title: "Organisation",
            },
            {
              data: "organisation_id",
              title: "organisation_id",
            },
            {
              data: "district_name",
              title: "District",
            },
            {
              data: "Program Name",
              title: "Program",
            },
            {
              data: "Observation Name",
              title: "Observation",
            },
            {
              data: "No of users completed",
              title: "No of users completed",
            },
            {
              data: "Total submissions",
              title: "Total submissions",
            },
            {
              data: "No of users started",
              title: "No of users started",
            },
            {
              data: "Entities observed",
              title: "Entities observed",
            },
          ],
          bLengthChange: true,
        },
        valuesExpr: "tableData",
        columnsExpr: "keys",
        downloadUrl:
          "/reports/fetch/$slug/ml_district_wise_observation_status_and_entities_observed_new_new_new_new_api_new_dataaa_pabitra_eight.csv",
      },
    ],
    data: [
      {
        loaded: true,
        result: {
          keys: [
            "Date",
            "parent_channel",
            "organisation_name",
            "district_name",
            "Program name",
            "Observation name",
            "solution_id",
            "district_externalId",
            "organisation_id",
            "program_id",
            "Total Unique Users",
          ],
          tableData: [
            [
              "2022-07-14",
              "SHIKSHALOKAM",
              "Staging Custodian Organization",
              "KRISHNA",
              "Testing program 4.7",
              "Simple Observation-FD272(8 submission)",
              "6214be63c7fe210007b65221",
              "b617e607-0a5b-45a0-9894-7a325ffa45c7",
              "0126796199493140480",
              "62034f90841a270008e82e46",
              "1.0",
            ],
            [
              "2022-07-14",
              "SHIKSHALOKAM",
              "Staging Custodian Organization",
              "CHITTOOR",
              "Testing program 4.7",
              "Simple Observation-FD272(8 submission)",
              "6214be63c7fe210007b65221",
              "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
              "0126796199493140480",
              "62034f90841a270008e82e46",
              "4.0",
            ],
            [
              "2022-07-14",
              "SHIKSHALOKAM",
              "Staging Custodian Organization",
              "ANANTAPUR",
              "Testing program 4.7",
              "Simple Observation-FD272(8 submission)",
              "6214be63c7fe210007b65221",
              "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
              "0126796199493140480",
              "62034f90841a270008e82e46",
              "9.0",
            ],
            [
              "2022-07-14",
              "SHIKSHALOKAM",
              "Staging Custodian Organization",
              "EAST GODAVARI",
              "Testing program 4.7",
              "Simple Observation-FD272(8 submission)",
              "6214be63c7fe210007b65221",
              "aecac7ab-15e4-45c9-ac7b-d716444cd652",
              "0126796199493140480",
              "62034f90841a270008e82e46",
              "2.0",
            ],
          ],
          data: [
            {
              district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
              "Program name": "Testing program 4.7",
              program_id: "62034f90841a270008e82e46",
              "Observation name": "Simple Observation-FD272(8 submission)",
              solution_id: "6214be63c7fe210007b65221",
              organisation_name: "Staging Custodian Organization",
              organisation_id: "0126796199493140480",
              Date: "2022-07-14",
              parent_channel: "SHIKSHALOKAM",
              district_name: "KRISHNA",
              "Total Unique Users": "1.0",
            },
            {
              district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
              "Program name": "Testing program 4.7",
              program_id: "62034f90841a270008e82e46",
              "Observation name": "Simple Observation-FD272(8 submission)",
              solution_id: "6214be63c7fe210007b65221",
              organisation_name: "Staging Custodian Organization",
              organisation_id: "0126796199493140480",
              Date: "2022-07-14",
              parent_channel: "SHIKSHALOKAM",
              district_name: "CHITTOOR",
              "Total Unique Users": "4.0",
            },
            {
              district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
              "Program name": "Testing program 4.7",
              program_id: "62034f90841a270008e82e46",
              "Observation name": "Simple Observation-FD272(8 submission)",
              solution_id: "6214be63c7fe210007b65221",
              organisation_name: "Staging Custodian Organization",
              organisation_id: "0126796199493140480",
              Date: "2022-07-14",
              parent_channel: "SHIKSHALOKAM",
              district_name: "ANANTAPUR",
              "Total Unique Users": "9.0",
            },
            {
              district_externalId: "aecac7ab-15e4-45c9-ac7b-d716444cd652",
              "Program name": "Testing program 4.7",
              program_id: "62034f90841a270008e82e46",
              "Observation name": "Simple Observation-FD272(8 submission)",
              solution_id: "6214be63c7fe210007b65221",
              organisation_name: "Staging Custodian Organization",
              organisation_id: "0126796199493140480",
              Date: "2022-07-14",
              parent_channel: "SHIKSHALOKAM",
              district_name: "EAST GODAVARI",
              "Total Unique Users": "2.0",
            },
          ],
        },
        id: "default",
        lastModifiedOn: "Fri, 15 Jul 2022 14:07:36 GMT",
      },
      {
        loaded: true,
        result: {
          keys: [
            "Date",
            "parent_channel",
            "organisation_name",
            "district_name",
            "Program name",
            "Observation name",
            "solution_id",
            "district_externalId",
            "organisation_id",
            "program_id",
            "Total entities observed",
          ],
          tableData: [
            [
              "2022-07-14",
              "SHIKSHALOKAM",
              "Staging Custodian Organization",
              "ANANTAPUR",
              "Testing program 4.7",
              "Simple Observation-FD272(8 submission)",
              "6214be63c7fe210007b65221",
              "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
              "0126796199493140480",
              "62034f90841a270008e82e46",
              "1.0",
            ],
            [
              "2022-07-14",
              "SHIKSHALOKAM",
              "Staging Custodian Organization",
              "CHITTOOR",
              "Testing program 4.7",
              "Simple Observation-FD272(8 submission)",
              "6214be63c7fe210007b65221",
              "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
              "0126796199493140480",
              "62034f90841a270008e82e46",
              "2.0",
            ],
            [
              "2022-07-14",
              "SHIKSHALOKAM",
              "Staging Custodian Organization",
              "KRISHNA",
              "Testing program 4.7",
              "Simple Observation-FD272(8 submission)",
              "6214be63c7fe210007b65221",
              "b617e607-0a5b-45a0-9894-7a325ffa45c7",
              "0126796199493140480",
              "62034f90841a270008e82e46",
              "1.0",
            ],
            [
              "2022-07-14",
              "SHIKSHALOKAM",
              "Staging Custodian Organization",
              "EAST GODAVARI",
              "Testing program 4.7",
              "Simple Observation-FD272(8 submission)",
              "6214be63c7fe210007b65221",
              "aecac7ab-15e4-45c9-ac7b-d716444cd652",
              "0126796199493140480",
              "62034f90841a270008e82e46",
              "1.0",
            ],
          ],
          data: [
            {
              district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
              "Program name": "Testing program 4.7",
              program_id: "62034f90841a270008e82e46",
              "Observation name": "Simple Observation-FD272(8 submission)",
              solution_id: "6214be63c7fe210007b65221",
              "Total entities observed": "1.0",
              organisation_name: "Staging Custodian Organization",
              organisation_id: "0126796199493140480",
              Date: "2022-07-14",
              parent_channel: "SHIKSHALOKAM",
              district_name: "ANANTAPUR",
            },
            {
              district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
              "Program name": "Testing program 4.7",
              program_id: "62034f90841a270008e82e46",
              "Observation name": "Simple Observation-FD272(8 submission)",
              solution_id: "6214be63c7fe210007b65221",
              "Total entities observed": "2.0",
              organisation_name: "Staging Custodian Organization",
              organisation_id: "0126796199493140480",
              Date: "2022-07-14",
              parent_channel: "SHIKSHALOKAM",
              district_name: "CHITTOOR",
            },
            {
              district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
              "Program name": "Testing program 4.7",
              program_id: "62034f90841a270008e82e46",
              "Observation name": "Simple Observation-FD272(8 submission)",
              solution_id: "6214be63c7fe210007b65221",
              "Total entities observed": "1.0",
              organisation_name: "Staging Custodian Organization",
              organisation_id: "0126796199493140480",
              Date: "2022-07-14",
              parent_channel: "SHIKSHALOKAM",
              district_name: "KRISHNA",
            },
            {
              district_externalId: "aecac7ab-15e4-45c9-ac7b-d716444cd652",
              "Program name": "Testing program 4.7",
              program_id: "62034f90841a270008e82e46",
              "Observation name": "Simple Observation-FD272(8 submission)",
              solution_id: "6214be63c7fe210007b65221",
              "Total entities observed": "1.0",
              organisation_name: "Staging Custodian Organization",
              organisation_id: "0126796199493140480",
              Date: "2022-07-14",
              parent_channel: "SHIKSHALOKAM",
              district_name: "EAST GODAVARI",
            },
          ],
        },
        id: "ml_total_entities_observed_api_new_dataa_pabitra_three",
        lastModifiedOn: "Fri, 15 Jul 2022 14:20:15 GMT",
      },
    ],
    downloadUrl:
      "/reports/fetch/$slug/ml_total_unique_users_new_api_new_dataa_pabitra_one.csv",
    tableId:
      "ml_district_wise_observation_status_and_entities_observed_new_new_new_new_api_new_dataaa_pabitra_eight",
    returnDataSource: {
      keys: [
        "Date",
        "Program Name",
        "Observation Name",
        "organisation_name",
        "district_name",
        "solution_id",
        "district_externalId",
        "organisation_id",
        "program_id",
        "No of users started",
        "No of users completed",
        "Total submissions",
        "Entities observed",
      ],
      tableData: [
        [
          "2022-07-17",
          "Testing program 4.7",
          "Simple Observation-FD272(8 submission)",
          "Staging Custodian Organization",
          "ANANTAPUR",
          "6214be63c7fe210007b65221",
          "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "0126796199493140480",
          "62034f90841a270008e82e46",
          "7.0",
          "9.0",
          "53.0",
          "1.0",
        ],
        [
          "2022-07-17",
          "Testing program 4.7",
          "Simple Observation-FD272(8 submission)",
          "Staging Custodian Organization",
          "KRISHNA",
          "6214be63c7fe210007b65221",
          "b617e607-0a5b-45a0-9894-7a325ffa45c7",
          "0126796199493140480",
          "62034f90841a270008e82e46",
          "1.0",
          "1.0",
          "8.0",
          "1.0",
        ],
      ],
      data: [
        {
          "Entities observed": "1.0",
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          program_id: "62034f90841a270008e82e46",
          solution_id: "6214be63c7fe210007b65221",
          "No of users completed": "9.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "ANANTAPUR",
          "Program Name": "Testing program 4.7",
          "No of users started": "7.0",
          "Observation Name": "Simple Observation-FD272(8 submission)",
          "Total submissions": "53.0",
        },
        {
          "Entities observed": "1.0",
          district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
          program_id: "62034f90841a270008e82e46",
          solution_id: "6214be63c7fe210007b65221",
          "No of users completed": "1.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "KRISHNA",
          "Program Name": "Testing program 4.7",
          "No of users started": "1.0",
          "Observation Name": "Simple Observation-FD272(8 submission)",
          "Total submissions": "8.0",
        },
      ],
    },
    tableDataReturn: {
      id: "ml_district_wise_observation_status_and_entities_observed_new_new_new_new_api_new_dataaa_pabitra_eight",
      name: "District wise observation status and entities observed",
      config: {
        info: true,
        paging: true,
        filters: [
          {
            label: "district_name",
            reference: "district_name",
            searchable: true,
            controlType: "multi-select",
            displayName: "District",
            placeholder: "Select district",
          },
          {
            label: "organisation_name",
            reference: "organisation_name",
            searchable: true,
            controlType: "multi-select",
            displayName: "Organisation",
            placeholder: "Select Organisation",
          },
        ],
        lengthMenu: [10, 25, 50, 100],
        searchable: true,
        columnConfig: [
          {
            data: "district_externalId",
            title: "district_externalId",
          },
          {
            data: "program_id",
            title: "program_id",
          },
          {
            data: "solution_id",
            title: "solution_id",
          },
          {
            data: "organisation_name",
            title: "Organisation",
          },
          {
            data: "organisation_id",
            title: "organisation_id",
          },
          {
            data: "district_name",
            title: "District",
          },
          {
            data: "Program Name",
            title: "Program",
          },
          {
            data: "Observation Name",
            title: "Observation",
          },
          {
            data: "No of users completed",
            title: "No of users completed",
          },
          {
            data: "Total submissions",
            title: "Total submissions",
          },
          {
            data: "No of users started",
            title: "No of users started",
          },
          {
            data: "Entities observed",
            title: "Entities observed",
          },
        ],
        bLengthChange: true,
      },
      data: [
        {
          "Entities observed": "1.0",
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          program_id: "62034f90841a270008e82e46",
          solution_id: "6214be63c7fe210007b65221",
          "No of users completed": "9.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "ANANTAPUR",
          "Program Name": "Testing program 4.7",
          "No of users started": "7.0",
          "Observation Name": "Simple Observation-FD272(8 submission)",
          "Total submissions": "53.0",
        },
        {
          "Entities observed": "1.0",
          district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
          program_id: "62034f90841a270008e82e46",
          solution_id: "6214be63c7fe210007b65221",
          "No of users completed": "1.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "KRISHNA",
          "Program Name": "Testing program 4.7",
          "No of users started": "1.0",
          "Observation Name": "Simple Observation-FD272(8 submission)",
          "Total submissions": "8.0",
        },
      ],
      header: [
        "Date",
        "Program Name",
        "Observation Name",
        "organisation_name",
        "district_name",
        "solution_id",
        "district_externalId",
        "organisation_id",
        "program_id",
        "No of users started",
        "No of users completed",
        "Total submissions",
        "Entities observed",
      ],
      columnsConfiguration: {
        columnConfig: [
          {
            title: "Date",
            data: "Date",
          },
          {
            title: "Program Name",
            data: "Program Name",
          },
          {
            title: "Observation Name",
            data: "Observation Name",
          },
          {
            title: "organisation_name",
            data: "organisation_name",
          },
          {
            title: "district_name",
            data: "district_name",
          },
          {
            title: "solution_id",
            data: "solution_id",
          },
          {
            title: "district_externalId",
            data: "district_externalId",
          },
          {
            title: "organisation_id",
            data: "organisation_id",
          },
          {
            title: "program_id",
            data: "program_id",
          },
          {
            title: "No of users started",
            data: "No of users started",
          },
          {
            title: "No of users completed",
            data: "No of users completed",
          },
          {
            title: "Total submissions",
            data: "Total submissions",
          },
          {
            title: "Entities observed",
            data: "Entities observed",
          },
        ],
        bLengthChange: true,
        info: true,
        lengthMenu: [10, 25, 50, 100],
        paging: true,
        searchable: true,
      },
      downloadUrl:
        "/reports/fetch/6214be63c7fe210007b65221/ml_district_wise_observation_status_and_entities_observed_new_new_new_new_api_new_dataaa_pabitra_eight.csv",
    },
  },
  selectedReport: {
    filters: [
      {
        type: "equals",
        dimension: "program_id",
        value: "$programId",
      },
      {
        type: "equals",
        dimension: "solution_id",
        value: "$solutionId",
      },
      {
        type: "equals",
        dimension: "district_externalId",
        value: "$district_externalId",
      },
      {
        type: "equals",
        dimension: "organisation_id",
        value: "$organisation_id",
      },
    ],
  },
  selectedReportWithConfigurableFilters: [
    {
      name: "Filtered task detail report",
      encrypt: true,
      datasetId: "ml-filtered-task-detail-exhaust",
      roles: ["PROGRAM_MANAGER"],
      configurableFilters: true,
      filters: [
        {
          type: "equals",
          dimension: "private_program",
          value: "false",
        },
        {
          type: "equals",
          dimension: "sub_task_deleted_flag",
          value: "false",
        },
        {
          type: "equals",
          dimension: "task_deleted_flag",
          value: "false",
        },
        {
          type: "equals",
          dimension: "project_deleted_flag",
          value: "false",
        },
        {
          type: "equals",
          dimension: "program_id",
          value: "$programId",
        },
        {
          type: "equals",
          dimension: "solution_id",
          value: "$solutionId",
        },
        {
          type: "equals",
          dimension: "district_externalId",
          value: "$district_externalId",
        },
        {
          type: "equals",
          dimension: "organisation_id",
          value: "$organisation_id",
        },
        {
          type: "greaterthan",
          dimension: "task_count",
          value: "$task_count",
        },
        {
          type: "greaterthan",
          dimension: "task_evidence_count",
          value: "$task_evidence_count",
        },
        {
          type: "greaterthan",
          dimension: "project_evidence_count",
          value: "$project_evidence_count",
        },
      ],
      uiFilters: [
        {
          label: "Minimum no. of tasks in the project",
          controlType: "number",
          reference: "task_count",
          defaultValue: 5,
        },
        {
          label: "Minimum no. of task evidence",
          controlType: "number",
          reference: "task_evidence_count",
          defaultValue: 2,
        },
        {
          label: "Minimum no. of project evidence",
          controlType: "number",
          reference: "project_evidence_count",
          defaultValue: 1,
        },
      ],
    },
    {
      "name": "Status Report",
      "encrypt": false,
      "datasetId": "ml-project-status-exhaust",
      "roles": [
          "PROGRAM_MANAGER",
          "PROGRAM_DESIGNER"
      ],
      "configurableFilters": true,
      "filters": [
          {
              "type": "in",
              "dimension": "status_of_project",
              "values": "$status_of_project"
          },
          {
              "type": "equals",
              "dimension": "private_program",
              "value": "false"
          },
          {
              "type": "equals",
              "dimension": "sub_task_deleted_flag",
              "value": "false"
          },
          {
              "type": "equals",
              "dimension": "task_deleted_flag",
              "value": "false"
          },
          {
              "type": "equals",
              "dimension": "project_deleted_flag",
              "value": "false"
          },
          {
              "type": "equals",
              "dimension": "program_id",
              "value": "$programId"
          },
          {
              "type": "equals",
              "dimension": "solution_id",
              "value": "$solutionId"
          },
          {
              "type": "equals",
              "dimension": "district_externalId",
              "value": "$district_externalId"
          },
          {
              "type": "equals",
              "dimension": "organisation_id",
              "value": "$organisation_id"
          }
      ],
      "uiFilters": [
          {
              "label": "Status",
              "controlType": "multi-select",
              "reference": "status_of_project",
              "placeholder": "Select status",
              "options": [
                  "started",
                  "submitted",
                  "inProgress"
              ]
          }
      ]
  }
  ],
  onDemandReportForSolutionTest:[
    {
        "requestId": "43AAC9A63194A5385555053E08CD9E87",
        "tag": "607d3410e9cce45e22ce90c1_4c4e7a7a-d44e-45cc-9319-d22d84f749bd:01269934121990553633",
        "dataset": "druid-dataset",
        "requestedBy": "4c4e7a7a-d44e-45cc-9319-d22d84f749bd",
        "requestedChannel": "01269934121990553633",
        "status": "SUBMITTED",
        "lastUpdated": 1674618446125,
        "datasetConfig": {
            "type": "ml-project-status-exhaust",
            "params": {
                "end_date": "2023-01-19",
                "filters": [
                    {
                        "type": "in",
                        "dimension": "status_of_project",
                        "values": [
                            "started",
                            "submitted",
                            "inProgress"
                        ]
                    },
                    {
                        "type": "equals",
                        "dimension": "private_program",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "sub_task_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "task_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "project_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "program_id",
                        "value": "607d320de9cce45e22ce90c0"
                    },
                    {
                        "type": "equals",
                        "dimension": "solution_id",
                        "value": "607d3410e9cce45e22ce90c1"
                    }
                ]
            },
            "title": "Status Report"
        },
        "attempts": 0,
        "jobStats": {
            "dtJobSubmitted": 1674618446125,
            "dtJobCompleted": null,
            "executionTime": null
        },
        "downloadUrls": [],
        "expiresAt": 1675405928901,
        "statusMessage": null,
        "title": "Status Report"
    },
    {
        "requestId": "8AC5135EF3353DCAD380C3603F5783A9",
        "tag": "607d3410e9cce45e22ce90c1_4c4e7a7a-d44e-45cc-9319-d22d84f749bd:01269934121990553633",
        "dataset": "druid-dataset",
        "requestedBy": "4c4e7a7a-d44e-45cc-9319-d22d84f749bd",
        "requestedChannel": "01269934121990553633",
        "status": "FAILED",
        "lastUpdated": 1673245705646,
        "datasetConfig": {
            "type": "ml-filtered-task-detail-exhaust",
            "params": {
                "filters": [
                    {
                        "type": "equals",
                        "dimension": "status_of_project",
                        "value": "submitted"
                    },
                    {
                        "type": "equals",
                        "dimension": "private_program",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "sub_task_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "task_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "project_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "program_id",
                        "value": "607d320de9cce45e22ce90c0"
                    },
                    {
                        "type": "equals",
                        "dimension": "solution_id",
                        "value": "607d3410e9cce45e22ce90c1"
                    }
                ]
            },
            "title": "Filtered task detail report"
        },
        "attempts": 3,
        "jobStats": {
            "dtJobSubmitted": 1672895781054,
            "dtJobCompleted": 1673245705646,
            "executionTime": 0
        },
        "downloadUrls": [],
        "expiresAt": 1675405928901,
        "statusMessage": "No data present",
        "title": "Filtered task detail report"
    }
  ],
  onDemandReportForProgramTest:[{
    "requestId": "D6A2781F934CBC9FFC84B7B5145BDB92",
    "tag": "607d320de9cce45e22ce90c0_4c4e7a7a-d44e-45cc-9319-d22d84f749bd:01269934121990553633",
    "dataset": "druid-dataset",
    "requestedBy": "4c4e7a7a-d44e-45cc-9319-d22d84f749bd",
    "requestedChannel": "01269934121990553633",
    "status": "SUBMITTED",
    "lastUpdated": 1675336792963,
    "datasetConfig": {
        "type": "ml-program-user-exhaust",
        "params": {
            "filters": [
                {
                    "table_name": "program_enrollment",
                    "table_filters": [
                        {
                            "name": "program_id",
                            "operator": "==",
                            "value": "607d320de9cce45e22ce90c0"
                        },
                        {
                            "name": "state_id",
                            "operator": "==",
                            "value": "6d884bb0-307f-4f83-abfe-fc21bbd36abb"
                        }
                    ]
                },
                {
                    "table_name": "user_consent",
                    "table_filters": [
                        {
                            "name": "object_id",
                            "operator": "==",
                            "value": "607d320de9cce45e22ce90c0"
                        }
                    ]
                }
            ]
        },
        "title": "User Detail Report"
    },
    "attempts": 0,
    "jobStats": {
        "dtJobSubmitted": 1675336792963,
        "dtJobCompleted": null,
        "executionTime": null
    },
    "downloadUrls": [],
    "expiresAt": 1675664901267,
    "statusMessage": null,
    "title": "User Detail Report"
  }],
  selectedReportForProgramTest:{
    "name": "User Detail Report",
    "encrypt": true,
    "datasetId": "ml-program-user-exhaust",
    "roles": [
        "PROGRAM_MANAGER"
    ],
    "queryType": "cassandra",
    "filters": [
        {
            "table_name": "program_enrollment",
            "table_filters": [
                {
                    "name": "program_id",
                    "operator": "=",
                    "value": "602512d8e6aefa27d9629bc3"
                },
                {
                    "name": "state_id",
                    "operator": "=",
                    "value": "6d884bb0-307f-4f83-abfe-fc21bbd36abb"
                },
                {
                    "name": "district_id",
                    "operator": "=",
                    "value": "ed9e0963-0707-443a-99c4-5994fcac7a5f"
                },
                {
                    "name": "organisation_id",
                    "operator": "=",
                    "value": "0126796199493140480"
                },
                {
                    "name": "updated_at",
                    "operator": ">=",
                    "value": "startDate"
                },
                {
                    "name": "updated_at",
                    "operator": "<=",
                    "value": "endDate"
                }
            ]
        },
        {
            "table_name": "user_consent",
            "table_filters": [
                {
                    "name": "object_id",
                    "operator": "=",
                    "value": "602512d8e6aefa27d9629bc3"
                }
            ]
        }
    ]
  },
  filterForUserDeatilReport:[
    {
      "table_name": "program_enrollment",
      "table_filters": [
        {
          "name": "program_id",
          "operator": "==",
          "value": "5f34ec17585244939f89f90c"
        },
        {
          "name": "district_id",
          "operator": "==",
          "value": "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03"
        },
        {
          "name": "organisation_id",
          "operator": "==",
          "value": "01269878797503692810"
        },
        {
          "name": "updated_at",
          "operator": ">=",
          "value": "10/10/2022"
        }
      ]
    },
    {
      "table_name": "user_consent",
      "table_filters": [
        {
          "name": "object_id",
          "operator": "==",
          "value": "5f34ec17585244939f89f90c"
        }
      ]
    }
  ],
  selectedReportForSolutionTest:{
    "name": "Status Report",
    "encrypt": false,
    "datasetId": "ml-project-status-exhaust",
    "roles": [
        "PROGRAM_MANAGER",
        "PROGRAM_DESIGNER"
    ],
    "configurableFilters": true,
    "filters": [
        {
            "type": "in",
            "dimension": "status_of_project",
            "values": [
                "started",
                "submitted",
                "inProgress"
            ]
        },
        {
            "type": "equals",
            "dimension": "private_program",
            "value": "false"
        },
        {
            "type": "equals",
            "dimension": "sub_task_deleted_flag",
            "value": "false"
        },
        {
            "type": "equals",
            "dimension": "task_deleted_flag",
            "value": "false"
        },
        {
            "type": "equals",
            "dimension": "project_deleted_flag",
            "value": "false"
        },
        {
            "type": "equals",
            "dimension": "program_id",
            "value": "607d320de9cce45e22ce90c0"
        },
        {
            "type": "equals",
            "dimension": "solutionId",
            "value": "607d3410e9cce45e22ce90c1"
        },
        {
            "type": "equals",
            "dimension": "district_externalId"
        },
        {
            "type": "equals",
            "dimension": "organisation_id"
        }
    ],
    "uiFilters": [
        {
            "label": "Status",
            "controlType": "multi-select",
            "reference": "status_of_project",
            "placeholder": "Select status",
            "options": [
                "started",
                "submitted",
                "inProgress"
            ]
        }
    ]
},
  selectedReportUserDetailReport: {
    "name": "User Detail Report",
    "encrypt": true,
    "datasetId": "ml-program-user-exhaust",
    "roles": [
        "PROGRAM_MANAGER"
    ],
    "queryType":"cassandra",
    "filters": [
      {
        "table_name": "program_enrollment",
        "table_filters": [
          {
            "name": "program_id",
            "operator": "==",
            "value": "602512d8e6aefa27d9629bc3"
          },
          {
            "name": "district_id",
            "operator": "==",
            "value": "ed9e0963-0707-443a-99c4-5994fcac7a5f"
          },
          {
            "name": "organisation_id",
            "operator": "==",
            "value": "0126796199493140480"
          },
          {
            "name": "updated_at",
            "operator": ">=",
            "value": "startDate"
          },
          {
            "name": "updated_at",
            "operator": "<=",
            "value": "endDate"
          }
        ]
      },
      {
        "table_name": "user_consent",
        "table_filters": [
          {
            "name": "object_id",
            "operator": "==",
            "value": "602512d8e6aefa27d9629bc3"
          }
        ]
      }
    ]
},
  multipleDataDownloaded: [
    {
      loaded: true,
      result: {
        keys: [
          "Date",
          "parent_channel",
          "district_name",
          "Program name",
          "Observation name",
          "organisation_name",
          "solution_id",
          "district_externalId",
          "organisation_id",
          "program_id",
          "Total Unique Users",
        ],
        tableData: [
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "KRISHNA",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "1.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "unknown",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "unknown",
            "607d320de9cce45e22ce90c0",
            "2.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "CHITTOOR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "2.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "7.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "KirubaOrg2.1",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "0127920475840593920",
            "607d320de9cce45e22ce90c0",
            "1.0",
          ],
        ],
        data: [
          {
            district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "KRISHNA",
            "Total Unique Users": "1.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total Unique Users": "2.0",
          },
          {
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "CHITTOOR",
            "Total Unique Users": "2.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total Unique Users": "7.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total Unique Users": "1.0",
          },
        ],
      },
      id: "ml_total_unique_users_api_testo_pabitra_new1_one",
      lastModifiedOn: "Mon, 18 Jul 2022 09:12:52 GMT",
    },
    {
      loaded: true,
      result: {
        keys: [
          "Date",
          "parent_channel",
          "district_name",
          "Program name",
          "Observation name",
          "organisation_name",
          "solution_id",
          "district_externalId",
          "organisation_id",
          "program_id",
          "Total submissions",
        ],
        tableData: [
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "unknown",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "unknown",
            "607d320de9cce45e22ce90c0",
            "6.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "CHITTOOR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "2.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "KirubaOrg2.1",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "0127920475840593920",
            "607d320de9cce45e22ce90c0",
            "3.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "KRISHNA",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "2.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "19.0",
          ],
        ],
        data: [
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total submissions": "6.0",
          },
          {
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "CHITTOOR",
            "Total submissions": "2.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total submissions": "3.0",
          },
          {
            district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "KRISHNA",
            "Total submissions": "2.0",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
            "Total submissions": "19.0",
          },
        ],
      },
      id: "ml_total_submissions_api_test_pabitra_new1_final_two",
      lastModifiedOn: "Mon, 18 Jul 2022 05:12:20 GMT",
    },
    {
      loaded: true,
      result: {
        keys: [
          "Date",
          "parent_channel",
          "district_name",
          "Program name",
          "Observation name",
          "organisation_name",
          "solution_id",
          "district_externalId",
          "organisation_id",
          "program_id",
          "Total entities observed",
        ],
        tableData: [
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "10.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "unknown",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "unknown",
            "607d320de9cce45e22ce90c0",
            "2.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "CHITTOOR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "2.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "KRISHNA",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "1.0",
          ],
          [
            "2022-07-17",
            "SHIKSHALOKAM",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "KirubaOrg2.1",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "0127920475840593920",
            "607d320de9cce45e22ce90c0",
            "1.0",
          ],
        ],
        data: [
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "10.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "2.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
          },
          {
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "2.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "CHITTOOR",
          },
          {
            district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "KRISHNA",
          },
          {
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Total entities observed": "1.0",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            parent_channel: "SHIKSHALOKAM",
            district_name: "ANANTAPUR",
          },
        ],
      },
      id: "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
      lastModifiedOn: "Mon, 18 Jul 2022 05:10:06 GMT",
    },
    {
      loaded: true,
    },
    {
      loaded: true,
      result: {
        keys: [
          "Date",
          "district_name",
          "Program name",
          "Observation name",
          "organisation_name",
          "solution_id",
          "district_externalId",
          "organisation_id",
          "program_id",
          "Completed",
          "Started",
          "In Progress",
          "Rating Pending",
        ],
        tableData: [
          [
            "2022-07-17",
            "unknown",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "unknown",
            "60a245158eee6c5040d16a4a",
            "f3e5b768-9008-4073-baf5-1dffc3c12b0b",
            "unknown",
            "607d320de9cce45e22ce90c0",
            "0.0",
            "4.0",
            "0.0",
            "0.0",
          ],
          [
            "2022-07-17",
            "GUNTUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "87422ed0-d2dd-4672-9d6b-10a4b565dfe3",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "0.0",
            "1.0",
            "0.0",
            "0.0",
          ],
          [
            "2022-07-17",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "KirubaOrg2.1",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "0127920475840593920",
            "607d320de9cce45e22ce90c0",
            "3.0",
            "1.0",
            "2.0",
            "0.0",
          ],
          [
            "2022-07-17",
            "CHITTOOR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "2.0",
            "9.0",
            "3.0",
            "1.0",
          ],
          [
            "2022-07-17",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "19.0",
            "26.0",
            "7.0",
            "1.0",
          ],
          [
            "2022-07-17",
            "KRISHNA",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "Staging Custodian Organization",
            "60a245158eee6c5040d16a4a",
            "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "0126796199493140480",
            "607d320de9cce45e22ce90c0",
            "2.0",
            "3.0",
            "0.0",
            "0.0",
          ],
          [
            "2022-07-17",
            "CHITTOOR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "unknown",
            "60a245158eee6c5040d16a4a",
            "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "unknown",
            "607d320de9cce45e22ce90c0",
            "0.0",
            "1.0",
            "0.0",
            "0.0",
          ],
          [
            "2022-07-17",
            "ANANTAPUR",
            "Observation led projects testing",
            "Leadership Self Assessment(Percentage)",
            "unknown",
            "60a245158eee6c5040d16a4a",
            "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "unknown",
            "607d320de9cce45e22ce90c0",
            "6.0",
            "1.0",
            "0.0",
            "0.0",
          ],
        ],
        data: [
          {
            Started: "4.0",
            district_externalId: "f3e5b768-9008-4073-baf5-1dffc3c12b0b",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "0.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "unknown",
          },
          {
            Started: "1.0",
            district_externalId: "87422ed0-d2dd-4672-9d6b-10a4b565dfe3",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "0.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "GUNTUR",
          },
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "2.0",
            Completed: "3.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "9.0",
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "3.0",
            Completed: "2.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "CHITTOOR",
          },
          {
            Started: "26.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "7.0",
            Completed: "19.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "3.0",
            district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "2.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "KRISHNA",
          },
          {
            Started: "1.0",
            district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "0.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "CHITTOOR",
          },
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "6.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
        ],
      },
      id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
      lastModifiedOn: "Mon, 18 Jul 2022 05:17:01 GMT",
    },
    {
      loaded: true,
    },
    {
      loaded: true,
    },
    {
      loaded: true,
    },
    {
      loaded: true,
    },
  ],
  charts: [
    {
      chartConfig: {
        id: "Big_Number",
        bigNumbers: [
          {
            footer: " ",
            header: "Unique users who submitted form",
            dataExpr: "Total Unique Users",
          },
          {
            footer: " ",
            header: "Unique Users who started form",
            dataExpr: "Unique Users who started form",
          },
          {
            footer: " ",
            header: "Total submissions",
            dataExpr: "Total submissions",
          },
          {
            footer: " ",
            header: "Total entities observed",
            dataExpr: "Total entities observed",
          },
        ],
        dataSource: {
          ids: [
            "ml_total_unique_users_api_testo_pabitra_new1_one",
            "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
            "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
            "ml_total_submissions_api_test_pabitra_new1_final_two",
          ],
          commonDimension: "Date",
        },
      },
      downloadUrl: [
        {
          id: "ml_total_unique_users_api_testo_pabitra_new1_one",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_total_unique_users_api_testo_pabitra_new1_one.json",
        },
        {
          id: "ml_total_submissions_api_test_pabitra_new1_final_two",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_total_submissions_api_test_pabitra_new1_final_two.json",
        },
        {
          id: "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/total_entities_observed_new_new_new_api_test_pabitra_new1_final_three.json",
        },
        {
          id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four.json",
        },
        {
          id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five.json",
        },
        {
          id: "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six.json",
        },
        {
          id: "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven.json",
        },
        {
          id: "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight.json",
        },
        {
          id: "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine.json",
        },
      ],
      chartData: [
        {
          district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "KRISHNA",
          "Total Unique Users": "1.0",
        },
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "unknown",
          organisation_id: "unknown",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
          "Total Unique Users": "2.0",
        },
        {
          district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "CHITTOOR",
          "Total Unique Users": "2.0",
        },
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
          "Total Unique Users": "7.0",
        },
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "KirubaOrg2.1",
          organisation_id: "0127920475840593920",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
          "Total Unique Users": "1.0",
        },
        null,
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Total entities observed": "10.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
        },
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Total entities observed": "2.0",
          organisation_name: "unknown",
          organisation_id: "unknown",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
        },
        {
          district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Total entities observed": "2.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "CHITTOOR",
        },
        {
          district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Total entities observed": "1.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "KRISHNA",
        },
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Total entities observed": "1.0",
          organisation_name: "KirubaOrg2.1",
          organisation_id: "0127920475840593920",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
        },
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "unknown",
          organisation_id: "unknown",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
          "Total submissions": "6.0",
        },
        {
          district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "CHITTOOR",
          "Total submissions": "2.0",
        },
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "KirubaOrg2.1",
          organisation_id: "0127920475840593920",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
          "Total submissions": "3.0",
        },
        {
          district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "KRISHNA",
          "Total submissions": "2.0",
        },
        {
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          parent_channel: "SHIKSHALOKAM",
          district_name: "ANANTAPUR",
          "Total submissions": "19.0",
        },
      ],
      lastUpdatedOn: 1658135572000,
    },
    {
      chartConfig: {
        id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
        colors: [
          {
            borderColor: "rgb(0, 199, 134)",
            borderWidth: 2,
            backgroundColor: "rgba(0, 199, 134, 0.3)",
          },
          {
            borderColor: "rgb(255, 161, 29)",
            borderWidth: 2,
            backgroundColor: "rgba(255, 161, 29, 0.3)",
          },
          {
            borderColor: "rgb(255, 69, 88)",
            borderWidth: 2,
            backgroundColor: "rgba(255, 69, 88, 0.3)",
          },
          {
            borderColor: "rgb(242, 203, 28)",
            borderWidth: 2,
            backgroundColor: "rgba(242, 203, 28, 0.3)",
          },
          {
            borderColor: "rgb(55, 70, 73)",
            borderWidth: 2,
            backgroundColor: "rgba(55, 70, 73, 0.3)",
          },
        ],
        filters: [
          {
            reference: "district_name",
            controlType: "multi-select",
            displayName: "District",
          },
          {
            reference: "organisation_name",
            controlType: "multi-select",
            displayName: "Organisation",
          },
        ],
        options: {
          title: {
            text: "District-wise submissions Vs observation status",
            display: true,
            fontSize: 16,
          },
          legend: {
            display: true,
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: "district_name",
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  precision: 0,
                  beginAtZero: true,
                },
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: "No. of submissions",
                },
              },
            ],
          },
          tooltips: {
            mode: "x-axis",
            intersect: false,
            bodySpacing: 5,
            titleSpacing: 5,
          },
          responsive: true,
          showLastUpdatedOn: true,
        },
        datasets: [
          {
            label: "Submitted",
            dataExpr: "Completed",
          },
          {
            label: "Started",
            dataExpr: "Started",
          },
          {
            label: "In Progress",
            dataExpr: "In Progress",
          },
        ],
        chartType: "bar",
        dataSource: {
          ids: [
            "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
          ],
          commonDimension: "district_name",
        },
        labelsExpr: "district_name",
      },
      downloadUrl: [
        {
          id: "ml_total_unique_users_api_testo_pabitra_new1_one",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_total_unique_users_api_testo_pabitra_new1_one.json",
        },
        {
          id: "ml_total_submissions_api_test_pabitra_new1_final_two",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_total_submissions_api_test_pabitra_new1_final_two.json",
        },
        {
          id: "total_entities_observed_new_new_new_api_test_pabitra_new1_final_three",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/total_entities_observed_new_new_new_api_test_pabitra_new1_final_three.json",
        },
        {
          id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1_final_four.json",
        },
        {
          id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five.json",
        },
        {
          id: "ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_criteria_wise_unique_entities_at_each_level_api_test_p_new1_final_six.json",
        },
        {
          id: "ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_district_wise_unique_entities_observed_new_new_api_test_pabitra_new1_final_seven.json",
        },
        {
          id: "ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_domain_wise_unique_entities_at_each_level_new_new_new_new_api_test_new_pabitra_new1_final_eight.json",
        },
        {
          id: "ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine",
          path: "/reports/fetch/60a245158eee6c5040d16a4a/ml_unique_users_who_started_form_new_new_api_test_pabitra_new1_final_nine.json",
        },
      ],
      chartData: [
        {
          Started: "4.0",
          district_externalId: "f3e5b768-9008-4073-baf5-1dffc3c12b0b",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "In Progress": "0.0",
          Completed: "0.0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Rating Pending": "0.0",
          organisation_name: "unknown",
          organisation_id: "unknown",
          Date: "2022-07-17",
          district_name: "unknown",
        },
        {
          Started: "1.0",
          district_externalId: "87422ed0-d2dd-4672-9d6b-10a4b565dfe3",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "In Progress": "0.0",
          Completed: "0.0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Rating Pending": "0.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "GUNTUR",
        },
        {
          Started: "1.0",
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "In Progress": "2.0",
          Completed: "3.0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Rating Pending": "0.0",
          organisation_name: "KirubaOrg2.1",
          organisation_id: "0127920475840593920",
          Date: "2022-07-17",
          district_name: "ANANTAPUR",
        },
        {
          Started: "9.0",
          district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "In Progress": "3.0",
          Completed: "2.0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Rating Pending": "1.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "CHITTOOR",
        },
        {
          Started: "26.0",
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "In Progress": "7.0",
          Completed: "19.0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Rating Pending": "1.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "ANANTAPUR",
        },
        {
          Started: "3.0",
          district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "In Progress": "0.0",
          Completed: "2.0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Rating Pending": "0.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "KRISHNA",
        },
        {
          Started: "1.0",
          district_externalId: "b5c35cfc-6c1e-4266-94ef-a425c43c7f4e",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "In Progress": "0.0",
          Completed: "0.0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Rating Pending": "0.0",
          organisation_name: "unknown",
          organisation_id: "unknown",
          Date: "2022-07-17",
          district_name: "CHITTOOR",
        },
        {
          Started: "1.0",
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          "Program name": "Observation led projects testing",
          program_id: "607d320de9cce45e22ce90c0",
          "In Progress": "0.0",
          Completed: "6.0",
          "Observation name": "Leadership Self Assessment(Percentage)",
          solution_id: "60a245158eee6c5040d16a4a",
          "Rating Pending": "0.0",
          organisation_name: "unknown",
          organisation_id: "unknown",
          Date: "2022-07-17",
          district_name: "ANANTAPUR",
        },
      ],
      lastUpdatedOn: 1658121421000,
    },
  ],
   reportListResult1:{
    "id": "ekstep.analytics.dataset.request.list",
    "ver": "1.0",
    "ts": "2023-04-13T07:05:03.365+00:00",
    "params": {
        "resmsgid": "716b2dcd-1abc-443d-ab86-cacb4d1af095",
        "status": "successful",
        "client_key": null
    },
    "responseCode": "OK",
    "result": {
        "count": 1,
        "jobs": [
            {
                "requestId": "41F2DA441C1A6CF50312EF165E424403",
                "tag": "aa29867d8be67713aee439184f663887:01269934121990553633",
                "dataset": "druid-dataset",
                "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
                "requestedChannel": "01269934121990553633",
                "status": "SUBMITTED",
                "lastUpdated": 1681367278218,
                "datasetConfig": {
                    "type": "ml-project-status-exhaust",
                    "params": {
                        "filters": [
                            {
                                "type": "in",
                                "dimension": "status_of_project",
                                "values": [
                                    "started",
                                    "submitted",
                                    "inProgress"
                                ]
                            },
                            {
                                "type": "equals",
                                "dimension": "private_program",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "sub_task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "project_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "program_id",
                                "value": "62034f90841a270008e82e46"
                            },
                            {
                                "type": "equals",
                                "dimension": "solution_id",
                                "value": "620351e0841a270008e82e9e"
                            },
                            {
                                "type": "equals",
                                "dimension": "district_externalId",
                                "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                            }
                        ]
                    },
                    "title": "Status Report"
                },
                "attempts": 0,
                "jobStats": {
                    "dtJobSubmitted": 1681367278218,
                    "dtJobCompleted": null,
                    "executionTime": null
                },
                "downloadUrls": [],
                "expiresAt": 1681371303365,
                "statusMessage": null,
                "title": "Status Report"
            }
        ]
    }
},
  reportListResult2:{
    "id": "ekstep.analytics.dataset.request.list",
    "ver": "1.0",
    "ts": "2023-04-13T07:05:03.421+00:00",
    "params": {
        "resmsgid": "5fc69ba0-fef3-40cd-a505-e1ad366cb3d3",
        "status": "successful",
        "client_key": null
    },
    "responseCode": "OK",
    "result": {
        "count": 2,
        "jobs": [
            {
                "requestId": "EFE2170ECF8C5BC15380B793DD1C2AEA",
                "tag": "620351e0841a270008e82e9e_7b351af1-bb36-4363-bdb9-b7bb7758cae6_kadapa:01269934121990553633",
                "dataset": "druid-dataset",
                "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
                "requestedChannel": "01269934121990553633",
                "status": "FAILED",
                "lastUpdated": 1668581928363,
                "datasetConfig": {
                    "type": "ml-filtered-task-detail-exhaust",
                    "params": {
                        "filters": [
                            {
                                "type": "equals",
                                "dimension": "private_program",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "sub_task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "project_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "program_id",
                                "value": "62034f90841a270008e82e46"
                            },
                            {
                                "type": "equals",
                                "dimension": "solution_id",
                                "value": "620351e0841a270008e82e9e"
                            },
                            {
                                "type": "equals",
                                "dimension": "district_externalId",
                                "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                            },
                            {
                                "type": "greaterthan",
                                "dimension": "task_count",
                                "value": 4
                            },
                            {
                                "type": "greaterthan",
                                "dimension": "task_evidence_count",
                                "value": 1
                            },
                            {
                                "type": "greaterthan",
                                "dimension": "project_evidence_count",
                                "value": 0
                            }
                        ]
                    },
                    "title": "Filtered task detail report"
                },
                "attempts": 3,
                "jobStats": {
                    "dtJobSubmitted": 1668416375628,
                    "dtJobCompleted": 1668581928363,
                    "executionTime": 0
                },
                "downloadUrls": [],
                "expiresAt": 1681371303420,
                "statusMessage": "No data present",
                "title": "Filtered task detail report"
            },
            {
                "requestId": "4FBA324F313FFEF101A0A8D2B5F263F3",
                "tag": "620351e0841a270008e82e9e_7b351af1-bb36-4363-bdb9-b7bb7758cae6_kadapa:01269934121990553633",
                "dataset": "druid-dataset",
                "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
                "requestedChannel": "01269934121990553633",
                "status": "SUCCESS",
                "lastUpdated": 1668507341471,
                "datasetConfig": {
                    "type": "ml-project-status-exhaust",
                    "params": {
                        "filters": [
                            {
                                "type": "equals",
                                "dimension": "private_program",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "sub_task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "project_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "program_id",
                                "value": "62034f90841a270008e82e46"
                            },
                            {
                                "type": "equals",
                                "dimension": "solution_id",
                                "value": "620351e0841a270008e82e9e"
                            },
                            {
                                "type": "equals",
                                "dimension": "district_externalId",
                                "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                            }
                        ]
                    },
                    "title": "Status Report"
                },
                "attempts": 0,
                "jobStats": {
                    "dtJobSubmitted": 1668416346526,
                    "dtJobCompleted": 1668507341471,
                    "executionTime": 4890
                },
                "downloadUrls": [
                    "https://sunbirdstagingprivate.blob.core.windows.net/reports/ml_reports/ml-project-status-exhaust/4FBA324F313FFEF101A0A8D2B5F263F3_20221115.zip?sv=2017-04-17&se=2023-04-13T07%3A35%3A03Z&sr=b&sp=r&sig=uBDPfQy0LmcKZkpGVq0rK6BAtYLXXp%2BrScSZPL/0WXQ%3D"
                ],
                "expiresAt": 1681371303420,
                "statusMessage": "",
                "title": "Status Report"
            }
        ]
    }
},
  reportListCombinedResult:[
    {
        "requestId": "41F2DA441C1A6CF50312EF165E424403",
        "tag": "aa29867d8be67713aee439184f663887:01269934121990553633",
        "dataset": "druid-dataset",
        "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
        "requestedChannel": "01269934121990553633",
        "status": "SUBMITTED",
        "lastUpdated": 1681367278218,
        "datasetConfig": {
            "type": "ml-project-status-exhaust",
            "params": {
                "filters": [
                    {
                        "type": "in",
                        "dimension": "status_of_project",
                        "values": [
                            "started",
                            "submitted",
                            "inProgress"
                        ]
                    },
                    {
                        "type": "equals",
                        "dimension": "private_program",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "sub_task_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "task_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "project_deleted_flag",
                        "value": "false"
                    },
                    {
                        "type": "equals",
                        "dimension": "program_id",
                        "value": "62034f90841a270008e82e46"
                    },
                    {
                        "type": "equals",
                        "dimension": "solution_id",
                        "value": "620351e0841a270008e82e9e"
                    },
                    {
                        "type": "equals",
                        "dimension": "district_externalId",
                        "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                    }
                ]
            },
            "title": "Status Report"
        },
        "attempts": 0,
        "jobStats": {
            "dtJobSubmitted": 1681367278218,
            "dtJobCompleted": null,
            "executionTime": null
        },
        "downloadUrls": [],
        "expiresAt": 1681371303365,
        "statusMessage": null,
        "title": "Status Report"
    },
    {
      "requestId": "EFE2170ECF8C5BC15380B793DD1C2AEA",
      "tag": "620351e0841a270008e82e9e_7b351af1-bb36-4363-bdb9-b7bb7758cae6_kadapa:01269934121990553633",
      "dataset": "druid-dataset",
      "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
      "requestedChannel": "01269934121990553633",
      "status": "FAILED",
      "lastUpdated": 1668581928363,
      "datasetConfig": {
          "type": "ml-filtered-task-detail-exhaust",
          "params": {
              "filters": [
                  {
                      "type": "equals",
                      "dimension": "private_program",
                      "value": "false"
                  },
                  {
                      "type": "equals",
                      "dimension": "sub_task_deleted_flag",
                      "value": "false"
                  },
                  {
                      "type": "equals",
                      "dimension": "task_deleted_flag",
                      "value": "false"
                  },
                  {
                      "type": "equals",
                      "dimension": "project_deleted_flag",
                      "value": "false"
                  },
                  {
                      "type": "equals",
                      "dimension": "program_id",
                      "value": "62034f90841a270008e82e46"
                  },
                  {
                      "type": "equals",
                      "dimension": "solution_id",
                      "value": "620351e0841a270008e82e9e"
                  },
                  {
                      "type": "equals",
                      "dimension": "district_externalId",
                      "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                  },
                  {
                      "type": "greaterthan",
                      "dimension": "task_count",
                      "value": 4
                  },
                  {
                      "type": "greaterthan",
                      "dimension": "task_evidence_count",
                      "value": 1
                  },
                  {
                      "type": "greaterthan",
                      "dimension": "project_evidence_count",
                      "value": 0
                  }
              ]
          },
          "title": "Filtered task detail report"
      },
      "attempts": 3,
      "jobStats": {
          "dtJobSubmitted": 1668416375628,
          "dtJobCompleted": 1668581928363,
          "executionTime": 0
      },
      "downloadUrls": [],
      "expiresAt": 1681371303420,
      "statusMessage": "No data present",
      "title": "Filtered task detail report"
    },
    {
      "requestId": "4FBA324F313FFEF101A0A8D2B5F263F3",
      "tag": "620351e0841a270008e82e9e_7b351af1-bb36-4363-bdb9-b7bb7758cae6_kadapa:01269934121990553633",
      "dataset": "druid-dataset",
      "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
      "requestedChannel": "01269934121990553633",
      "status": "SUCCESS",
      "lastUpdated": 1668507341471,
      "datasetConfig": {
          "type": "ml-project-status-exhaust",
          "params": {
              "filters": [
                  {
                      "type": "equals",
                      "dimension": "private_program",
                      "value": "false"
                  },
                  {
                      "type": "equals",
                      "dimension": "sub_task_deleted_flag",
                      "value": "false"
                  },
                  {
                      "type": "equals",
                      "dimension": "task_deleted_flag",
                      "value": "false"
                  },
                  {
                      "type": "equals",
                      "dimension": "project_deleted_flag",
                      "value": "false"
                  },
                  {
                      "type": "equals",
                      "dimension": "program_id",
                      "value": "62034f90841a270008e82e46"
                  },
                  {
                      "type": "equals",
                      "dimension": "solution_id",
                      "value": "620351e0841a270008e82e9e"
                  },
                  {
                      "type": "equals",
                      "dimension": "district_externalId",
                      "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                  }
              ]
          },
          "title": "Status Report"
      },
      "attempts": 0,
      "jobStats": {
          "dtJobSubmitted": 1668416346526,
          "dtJobCompleted": 1668507341471,
          "executionTime": 4890
      },
      "downloadUrls": [
          "https://sunbirdstagingprivate.blob.core.windows.net/reports/ml_reports/ml-project-status-exhaust/4FBA324F313FFEF101A0A8D2B5F263F3_20221115.zip?sv=2017-04-17&se=2023-04-13T07%3A35%3A03Z&sr=b&sp=r&sig=uBDPfQy0LmcKZkpGVq0rK6BAtYLXXp%2BrScSZPL/0WXQ%3D"
      ],
      "expiresAt": 1681371303420,
      "statusMessage": "",
      "title": "Status Report"
    }
  ]
};