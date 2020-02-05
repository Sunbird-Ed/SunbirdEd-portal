export const contentUploadComponentInput = {
    action: 'preview',
    contentId: 'do_1129159525832540161668',
    'config': {
      'config': {
        'filesConfig': {
          'accepted': 'pdf, mp4, webm, youtube',
          'size': '50'
        },
        'formConfiguration': [
          {
            'code': 'learningOutcome',
            'dataType': 'list',
            'description': 'Learning Outcomes For The Content',
            'editable': true,
            'inputType': 'multiselect',
            'label': 'Learning Outcome',
            'name': 'LearningOutcome',
            'placeholder': 'Select Learning Outcomes',
            'required': false,
            'visible': true
          },
          {
            'code': 'bloomslevel',
            'dataType': 'list',
            'description': 'Learning Level For The Content',
            'editable': true,
            'inputType': 'select',
            'label': 'Learning Level',
            'name': 'LearningLevel',
            'placeholder': 'Select Learning Levels',
            'required': true,
            'visible': true,
            'defaultValue': [
              'remember',
              'understand',
              'apply',
              'analyse',
              'evaluate',
              'create'
            ]
          },
          {
            'code': 'creator',
            'dataType': 'text',
            'description': 'Enter The Author Name',
            'editable': true,
            'inputType': 'text',
            'label': 'Author',
            'name': 'Author',
            'placeholder': 'Enter Author Name',
            'required': true,
            'visible': true
          },
          {
            'code': 'license',
            'dataType': 'list',
            'description': 'License For The Content',
            'editable': true,
            'inputType': 'select',
            'label': 'License',
            'name': 'License',
            'placeholder': 'Select License',
            'required': true,
            'visible': true
          }
        ],
        'resourceTitleLength': '200',
        'tenantName': 'SunbirdEd'
      }
    },
    programContext: {
      config: {
        actions: {
          showChangeFile: {
            roles: [1]
          },
          showRequestChanges: {
            roles: [2]
          },
          showPublish: {
            roles: [2]
          },
          showSubmit: {
            roles: [1]
          },
          showSave: {
            roles: [1]
          },
          showEdit: {
            roles: [1]
          }
        },
        components: [
          {
            id: 'ng.sunbird.uploadComponent',
            ver: '1.0',
            compId: 'uploadContentComponent',
            author: 'Kartheek',
            description: '',
            publishedDate: '',
            data: {},
            config: {
              filesConfig: {
                accepted: 'pdf, mp4, webm, youtube',
                size: '50'
              },
              formConfiguration: [
                {
                  code: 'learningOutcome',
                  dataType: 'list',
                  description: 'Learning Outcomes For The Content',
                  editable: true,
                  inputType: 'multiselect',
                  label: 'Learning Outcome',
                  name: 'LearningOutcome',
                  placeholder: 'Select Learning Outcomes',
                  required: false,
                  visible: true
                },
                {
                  code: 'bloomslevel',
                  dataType: 'list',
                  description: 'Learning Level For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'Learning Level',
                  name: 'LearningLevel',
                  placeholder: 'Select Learning Levels',
                  required: true,
                  visible: true,
                  defaultValue: [
                    'Knowledge (Remembering)',
                    'Comprehension (Understanding)',
                    'Application (Transferring)',
                    'Analysis (Relating)',
                    'Evaluation (Judging)',
                    'Synthesis (Creating)'
                  ]
                },
                {
                  code: 'creator',
                  dataType: 'text',
                  description: 'Enter The Author Name',
                  editable: true,
                  inputType: 'text',
                  label: 'Author',
                  name: 'Author',
                  placeholder: 'Enter Author Name',
                  required: true,
                  visible: true
                },
                {
                  code: 'license',
                  dataType: 'list',
                  description: 'License For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'License',
                  name: 'License',
                  placeholder: 'Select License',
                  required: true,
                  visible: true
                }
              ]
            }
          }
        ],
        config: {
          filesConfig: {accepted: 'pdf, mp4, webm, youtube', size: '50'},
          formConfiguration:  [
            {
              code: 'learningOutcome',
              dataType: 'list',
              defaultValue: ['Spelling Practice', 'Memorizing Practice', 'Writing Practice', 'Searching', 'Patience', 'Computation skill'],
              description: 'Learning Outcomes For The Content',
              editable: true,
              inputType: 'multiselect',
              label: 'Learning Outcome',
              name: 'LearningOutcome',
              placeholder: 'Select Learning Outcomes',
              required: false,
              visible: true
            }
          ],
          resourceTitleLength: '200',
          tenantName: 'SunbirdEd'
        }
      },
      defaultRoles: ['CONTRIBUTOR'],
      programId: '8a038e90-35f5-11ea-af1e-17ee2cf27b43',
      userDetails: {
        enrolledOn: '2020-01-16T05:31:25.798Z',
        onBoarded: true,
        onBoardingData: {school: 'My School'},
        programId: '608de690-3821-11ea-905b-d9320547e5be',
        roles: ['CONTRIBUTOR'],
        userId: '874ed8a5-782e-4f6c-8f36-e0288455901e'
      }
    },
    sessionContext: {
      bloomsLevel: undefined,
      board: 'NCERT',
      channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
      collection: 'do_1127639035982479361130',
      collectionName: 'बाल रामकथा(HINDHI)',
      collectionStatus: undefined,
      collectionType: undefined,
      currentRole: 'CONTRIBUTOR',
      currentRoleId: 1,
      framework: 'NCFCOPY',
      medium: 'English',
      onBoardSchool: undefined,
      program: 'CBSE',
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1'
    },
    templateDetails: {
      filesConfig: {
        accepted: 'pdf',
        size: '50',
        label: 'Explanation'
      },
      metadata: {
        appIcon:
        // tslint:disable-next-line:max-line-length
          'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
        audience: ['Learner'],
        contentType: 'ExplanationResource',
        description: 'ExplanationResource',
        marks: 5,
        name: 'Explanation Resource',
        resourceType: 'Read'
      }
    },
    selectedSharedContext: {
      framework: 'NCFCOPY',
      topic: ['Topic 1']
    },
    unitIdentifier: 'do_1127639059664486401136'
  };

  export const contentMetaData = {
    result: {
      content: {
        SYS_INTERNAL_LAST_UPDATED_ON: '2019-12-18T07:34:33.262+0000',
        appId: 'sunbird.env.sunbird.ins.portal',
        artifactUrl:
          // tslint:disable-next-line:max-line-length
          'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_1129159525832540161668/5-mbsamplepdffile_5mb.pdf',
        audience: ['Learner'],
        channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
        code: '3ec87ece-39c4-d8e1-cb77-7a51db464a02',
        compatibilityLevel: 1,
        consumerId: '4190d121-3206-4c9e-b0d4-903fcd87c2ff',
        contentDisposition: 'inline',
        contentEncoding: 'identity',
        contentType: 'ExplanationResource',
        createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
        createdOn: '2019-12-18T07:32:48.074+0000',
        creator: 'Creation',
        dialcodeRequired: 'No',
        framework: 'NCFCOPY',
        idealScreenDensity: 'hdpi',
        idealScreenSize: 'normal',
        identifier: 'do_1129159525832540161668',
        language: ['English'],
        languageCode: ['en'],
        lastStatusChangedOn: '2019-12-18T07:32:48.074+0000',
        lastUpdatedOn: '2019-12-18T07:34:33.219+0000',
        license: 'CC BY 4.0',
        mediaType: 'content',
        mimeType: 'application/pdf',
        name: 'Explanation',
        os: ['All'],
        osId: 'org.ekstep.quiz.app',
        ownershipType: ['createdBy'],
        resourceType: 'Learn',
        status: 'Draft',
        version: 2,
        versionKey: '1576654473219',
        visibility: 'Default'
      }
    }
  };

  export const playerConfig = {
    config: {},
    data: {},
    context: {
      pdata: {
        pid: ''
      }
    },
    metadata: {}
  };

  export const frameworkDetails = {
    err: null,
    frameworkdata: {
      NCFCOPY: {
        categories: [
          {
            code: 'board',
            description: '',
            identifier: 'ncfcopy_board',
            index: 1,
            name: 'Curriculum',
            status: 'Live',
            terms: [
              {
                associations: [
                  {
                    category: 'gradeLevel',
                    code: 'kindergarten',
                    description: '',
                    identifier: 'ncfcopy_gradelevel_kindergarten',
                    name: 'Kindergarten',
                    status: 'Live'
                  }
                ],
                category: 'board',
                code: 'ncert',
                description: '',
                identifier: 'ncfcopy_board_ncert',
                index: 1,
                name: 'NCERT',
                status: 'Live'
              }
            ]
          }
        ]
      }
    }
  };

  export const licenseDetails = {
    count: 2,
    license: [
      {
        IL_FUNC_OBJECT_TYPE: 'License',
        IL_SYS_NODE_TYPE: 'DATA_NODE',
        IL_UNIQUE_ID: 'abc-04',
        createdOn: '2019-11-29T12:13:43.783+0000',
        description: 'abc',
        graph_id: 'domain',
        identifier: 'abc-04',
        lastStatusChangedOn: '2019-11-29T12:13:43.783+0000',
        lastUpdatedOn: '2019-11-29T12:13:43.783+0000',
        name: 'ABC 04',
        nodeType: 'DATA_NODE',
        node_id: 357772,
        objectType: 'License',
        status: 'Live',
        url: 'www.url.com',
        versionKey: '1575029623783'
      },
      {
        consumerId: '02bf5216-c947-492f-929b-af2e61ea78cd',
        createdOn: '2019-11-25T13:33:07.797+0000',
        description: 'This license is Creative Commons Attribution',
        graph_id: 'domain',
        identifier: 'cc-by-4.0',
        lastStatusChangedOn: '2019-11-25T13:33:07.797+0000',
        lastUpdatedOn: '2019-12-12T12:10:41.648+0000',
        name: 'CC BY 4.0',
        nodeType: 'DATA_NODE',
        node_id: 341092,
        objectType: 'License',
        status: 'Live',
        url: 'https://creativecommons.org/licenses/by/4.0/legalcode',
        versionKey: '1576152641648'
      }
    ]
  };

  export const updateContentResponse = {
    result: {
      identifier: 'do_1129159525832540161668',
      node_id: 'do_1129159525832540161668',
      versionKey: '1577098360997'
    }
  };

  export const getPreSignedUrl = {
    result: {
      content_id: 'do_112919628453183488190',
      pre_signed_url:
        // tslint:disable-next-line:max-line-length
        'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_112919628453183488190/samplevideo_1280x720_1mb.mp4?sv=2017-04-17&se=2019-12-23T12%3A52%3A28Z&sr=b&sp=w&sig=GAnjDsJZxtoIfefWIEqyaWSBYmVk/NeYgK8zQhgEiYE%3D',
      url_expiry: '600'
    }
  };

  export const contentMetaData1 = {
    result: {
      content: {
        SYS_INTERNAL_LAST_UPDATED_ON: '2019-12-18T07:34:33.262+0000',
        appId: 'sunbird.env.sunbird.ins.portal',
        artifactUrl:
          // tslint:disable-next-line:max-line-length
          'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_1129159525832540161668/5-mbsamplepdffile_5mb.pdf',
        audience: ['Learner'],
        channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
        code: '3ec87ece-39c4-d8e1-cb77-7a51db464a02',
        compatibilityLevel: 1,
        consumerId: '4190d121-3206-4c9e-b0d4-903fcd87c2ff',
        contentDisposition: 'inline',
        contentEncoding: 'identity',
        contentType: 'ExplanationResource',
        createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
        createdOn: '2019-12-18T07:32:48.074+0000',
        creator: 'Creation',
        dialcodeRequired: 'No',
        framework: 'NCFCOPY',
        idealScreenDensity: 'hdpi',
        idealScreenSize: 'normal',
        identifier: 'do_1129159525832540161668',
        language: ['English'],
        languageCode: ['en'],
        lastStatusChangedOn: '2019-12-18T07:32:48.074+0000',
        lastUpdatedOn: '2019-12-18T07:34:33.219+0000',
        license: 'CC BY 4.0',
        mediaType: 'content',
        mimeType: 'application/pdf',
        name: 'Explanation',
        os: ['All'],
        osId: 'org.ekstep.quiz.app',
        ownershipType: ['createdBy'],
        resourceType: 'Learn',
        status: 'Review',
        version: 2,
        versionKey: '1576654473219',
        visibility: 'Default'
      }
    }
  };
  export const contentUploadComponentInput1 = {
    action: 'preview',
    contentId: 'do_1129159525832540161668',
    'config': {
      'config': {
        'filesConfig': {
          'accepted': 'pdf, mp4, webm, youtube',
          'size': '50'
        },
        'formConfiguration': [
          {
            'code': 'learningOutcome',
            'dataType': 'list',
            'description': 'Learning Outcomes For The Content',
            'editable': true,
            'inputType': 'multiselect',
            'label': 'Learning Outcome',
            'name': 'LearningOutcome',
            'placeholder': 'Select Learning Outcomes',
            'required': false,
            'visible': true
          },
          {
            'code': 'bloomslevel',
            'dataType': 'list',
            'description': 'Learning Level For The Content',
            'editable': true,
            'inputType': 'select',
            'label': 'Learning Level',
            'name': 'LearningLevel',
            'placeholder': 'Select Learning Levels',
            'required': true,
            'visible': true,
            'defaultValue': [
              'remember',
              'understand',
              'apply',
              'analyse',
              'evaluate',
              'create'
            ]
          },
          {
            'code': 'creator',
            'dataType': 'text',
            'description': 'Enter The Author Name',
            'editable': true,
            'inputType': 'text',
            'label': 'Author',
            'name': 'Author',
            'placeholder': 'Enter Author Name',
            'required': true,
            'visible': true
          },
          {
            'code': 'license',
            'dataType': 'list',
            'description': 'License For The Content',
            'editable': true,
            'inputType': 'select',
            'label': 'License',
            'name': 'License',
            'placeholder': 'Select License',
            'required': true,
            'visible': true
          }
        ],
        'resourceTitleLength': '200',
        'tenantName': 'SunbirdEd'
      }
    },
    programContext: {
      config: {
        actions: {
          showChangeFile: {
            roles: [1]
          },
          showRequestChanges: {
            roles: [2]
          },
          showPublish: {
            roles: [2]
          },
          showSubmit: {
            roles: [1]
          },
          showSave: {
            roles: [1]
          },
          showEdit: {
            roles: [1]
          }
        },
        components: [
          {
            id: 'ng.sunbird.uploadComponent',
            ver: '1.0',
            compId: 'uploadContentComponent',
            author: 'Kartheek',
            description: '',
            publishedDate: '',
            data: {},
            config: {
              filesConfig: {
                accepted: 'pdf, mp4, webm, youtube',
                size: '50'
              },
              formConfiguration: [
                {
                  code: 'learningOutcome',
                  dataType: 'list',
                  description: 'Learning Outcomes For The Content',
                  editable: true,
                  inputType: 'multiselect',
                  label: 'Learning Outcome',
                  name: 'LearningOutcome',
                  placeholder: 'Select Learning Outcomes',
                  required: false,
                  visible: true
                },
                {
                  code: 'bloomslevel',
                  dataType: 'list',
                  description: 'Learning Level For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'Learning Level',
                  name: 'LearningLevel',
                  placeholder: 'Select Learning Levels',
                  required: true,
                  visible: true,
                  defaultValue: [
                    'Knowledge (Remembering)',
                    'Comprehension (Understanding)',
                    'Application (Transferring)',
                    'Analysis (Relating)',
                    'Evaluation (Judging)',
                    'Synthesis (Creating)'
                  ]
                },
                {
                  code: 'creator',
                  dataType: 'text',
                  description: 'Enter The Author Name',
                  editable: true,
                  inputType: 'text',
                  label: 'Author',
                  name: 'Author',
                  placeholder: 'Enter Author Name',
                  required: true,
                  visible: true
                },
                {
                  code: 'license',
                  dataType: 'list',
                  description: 'License For The Content',
                  editable: true,
                  inputType: 'select',
                  label: 'License',
                  name: 'License',
                  placeholder: 'Select License',
                  required: true,
                  visible: true
                }
              ]
            }
          }
        ],
        config: {
          filesConfig: {accepted: 'pdf, mp4, webm, youtube', size: '50'},
          formConfiguration:  [
            {
              code: 'learningOutcome',
              dataType: 'list',
              defaultValue: ['Spelling Practice', 'Memorizing Practice', 'Writing Practice', 'Searching', 'Patience', 'Computation skill'],
              description: 'Learning Outcomes For The Content',
              editable: true,
              inputType: 'multiselect',
              label: 'Learning Outcome',
              name: 'LearningOutcome',
              placeholder: 'Select Learning Outcomes',
              required: false,
              visible: true
            }
          ],
          resourceTitleLength: '200',
          tenantName: 'SunbirdEd'
        }
      },
      defaultRoles: ['CONTRIBUTOR'],
      programId: '8a038e90-35f5-11ea-af1e-17ee2cf27b43',
      userDetails: {
        enrolledOn: '2020-01-16T05:31:25.798Z',
        onBoarded: true,
        onBoardingData: {school: 'My School'},
        programId: '608de690-3821-11ea-905b-d9320547e5be',
        roles: ['CONTRIBUTOR'],
        userId: '874ed8a5-782e-4f6c-8f36-e0288455901e'
      }
    },
    sessionContext: {
      bloomsLevel: undefined,
      board: 'NCERT',
      channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
      collection: 'do_1127639035982479361130',
      collectionName: 'बाल रामकथा(HINDHI)',
      collectionStatus: undefined,
      collectionType: undefined,
      currentRole: 'CONTRIBUTOR',
      currentRoleId: 2,
      framework: 'NCFCOPY',
      medium: 'English',
      onBoardSchool: undefined,
      program: 'CBSE',
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1'
    },
    templateDetails: {
      filesConfig: {
        accepted: 'pdf',
        size: '50',
        label: 'Explanation'
      },
      metadata: {
        appIcon:
        // tslint:disable-next-line:max-line-length
          'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
        audience: ['Learner'],
        contentType: 'ExplanationResource',
        description: 'ExplanationResource',
        marks: 5,
        name: 'Explanation Resource',
        resourceType: 'Read'
      }
    },
    selectedSharedContext: {
      framework: 'NCFCOPY',
      topic: ['Topic 1']
    },
    unitIdentifier: 'do_1127639059664486401136'
  };
