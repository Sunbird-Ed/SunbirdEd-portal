export const chapterListComponentInput = {
  sessionContext: {
    framework: 'NCFCOPY',
    currentRole: 'CONTRIBUTOR',
    programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1',
    program: 'CBSE 2',
    onBoardSchool: 'My School',
    board: 'NCERT',
    channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
    medium: ['English'],
    gradeLevel: ['Grade 1'],
    subject: ['English'],
    topic: null,
    currentRoleId: 1,
    frameworkData: [
      {
        identifier: 'ncfcopy_board',
        code: 'board',
        terms: [
          {
            associations: [
              {
                identifier: 'ncfcopy_gradelevel_kindergarten',
                code: 'kindergarten',
                translations: '{"hi":"बाल विहार"}',
                name: 'Kindergarten',
                description: '',
                category: 'gradeLevel',
                status: 'Live'
              },
              {
                identifier: 'ncfcopy_gradelevel_grade5',
                code: 'grade5',
                translations: null,
                name: 'Grade 5',
                description: '',
                category: 'gradeLevel',
                status: 'Live'
              },
              {
                identifier: 'ncfcopy_gradelevel_grade1',
                code: 'grade1',
                translations: null,
                name: 'Grade 1',
                description: '',
                category: 'gradeLevel',
                status: 'Live'
              },
              {
                identifier: 'ncfcopy_gradelevel_grade2',
                code: 'grade2',
                translations: null,
                name: 'Grade 2',
                description: '',
                category: 'gradeLevel',
                status: 'Live'
              },
              {
                identifier: 'ncfcopy_gradelevel_grade4',
                code: 'grade4',
                translations: null,
                name: 'Grade 4',
                description: '',
                category: 'gradeLevel',
                status: 'Live'
              },
              {
                identifier: 'ncfcopy_gradelevel_grade3',
                code: 'grade3',
                translations: null,
                name: 'Grade 3',
                description: '',
                category: 'gradeLevel',
                status: 'Live'
              }
            ],
            identifier: 'ncfcopy_board_ncert',
            code: 'ncert',
            translations: null,
            name: 'NCERT',
            description: '',
            index: 1,
            category: 'board',
            status: 'Live'
          }
        ],
        translations: null,
        name: 'Curriculum',
        description: '',
        index: 1,
        status: 'Live'
      }
    ],
    collection: 'do_1127639035982479361130',
    collectionName: 'बाल रामकथा(HINDHI)',
    hierarchyObj: {
      hierarchy: {
        do_1127639035982479361130: {
          name: 'बाल रामकथा(HINDHI)',
          contentType: 'TextBook',
          children: [
            'do_1127639059664486401136',
            'do_1127639059664568321137',
            'do_1127639059664568321138',
            'do_1127639059664568321139',
            'do_1127639059664650241140',
            'do_1127639059664650241141'
          ],
          root: true
        }
      }
    },
    topicList: [
      {
        identifier: 'ncfcopy_topic_topic1',
        code: 'topic1',
        translations: null,
        name: 'Topic, topic 1',
        description: 'Mathematics',
        index: 1,
        category: 'topic',
        status: 'Live'
      }
    ]
  },
  collection: {
    name: 'बाल रामकथा(HINDHI)',
    image:
      // tslint:disable-next-line:max-line-length
      'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
    description: 'Enter description for TextBook',
    rating: '0',
    subject: ['Hindi'],
    medium: ['English'],
    orgDetails: {},
    gradeLevel: 'Kindergarten',
    contentType: 'TextBook',
    topic: '',
    subTopic: '',
    metaData: {
      identifier: 'do_1127639035982479361130',
      mimeType: 'application/vnd.ekstep.content-collection',
      framework: 'NCFCOPY',
      contentType: 'TextBook'
    }
  },
  config: {
    id: 'ng.sunbird.chapterList',
    ver: '1.0',
    compId: 'chapterListComponent',
    author: 'Kartheek',
    description: '',
    publishedDate: '',
    data: {},
    config: {
      contentTypes: {
        value: [
          {
            id: 'explanationContent',
            label: 'Explanation',
            onClick: 'uploadComponent',
            mimeType: ['application/pdf'],
            metadata: {
              name: 'Explanation Resource',
              description: 'ExplanationResource',
              resourceType: 'Read',
              contentType: 'ExplanationResource',
              audience: ['Learner'],
              appIcon:
                // tslint:disable-next-line:max-line-length
                'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
              marks: 5
            },
            filesConfig: {
              accepted: 'pdf',
              size: '50'
            }
          }
        ],
        defaultValue: [
          {
            id: 'vsaPracticeQuestionContent',
            label: 'Practice Sets',
            onClick: 'questionSetComponent',
            mimeType: ['application/vnd.ekstep.ecml-archive'],
            metadata: {
              name: 'Practice QuestionSet',
              description: 'Practice QuestionSet',
              resourceType: 'Learn',
              contentType: 'PracticeQuestionSet',
              audience: ['Learner'],
              appIcon: '',
              marks: 5
            },
            questionCategories: ['vsa']
          }
        ]
      }
    }
  },
  programContext: {
    programId: '4bc66d00-279f-11ea-8e51-77f851f90140',
    config: {
      framework: 'NCFCOPY',
      roles: [
        {
          id: 1,
          name: 'CONTRIBUTOR',
          default: true,
          defaultTab: 1,
          tabs: [1]
        },
        {
          id: 2,
          name: 'REVIEWER',
          defaultTab: 2,
          tabs: [2]
        }
      ],
      header: {
        id: 'ng.sunbird.header',
        ver: '1.0',
        compId: 'headerComp',
        author: 'Venkat',
        description: '',
        publishedDate: '',
        data: {},
        config: {
          tabs: [
            {
              index: 1,
              label: 'Contribute',
              onClick: 'collectionComponent',
              visibility: true
            },
            {
              index: 2,
              label: 'Review',
              onClick: 'collectionComponent'
            },
            {
              index: 3,
              label: 'Dashboard',
              onClick: 'dashboardComponent'
            }
          ]
        }
      },
      components: [
        {
          id: 'ng.sunbird.chapterList',
          ver: '1.0',
          compId: 'chapterListComponent',
          author: 'Kartheek',
          description: '',
          publishedDate: '',
          data: {},
          config: {
            contentTypes: {
              value: [
                {
                  id: 'explanationContent',
                  label: 'Explanation',
                  onClick: 'uploadComponent',
                  mimeType: ['application/pdf'],
                  metadata: {
                    name: 'Explanation Resource',
                    description: 'ExplanationResource',
                    resourceType: 'Read',
                    contentType: 'ExplanationResource',
                    audience: ['Learner'],
                    appIcon:
                      // tslint:disable-next-line:max-line-length
                      'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                    marks: 5
                  },
                  filesConfig: {
                    accepted: 'pdf',
                    size: '50'
                  }
                }
              ],
              defaultValue: [
                {
                  id: 'vsaPracticeQuestionContent',
                  label: 'Practice Sets',
                  onClick: 'questionSetComponent',
                  mimeType: ['application/vnd.ekstep.ecml-archive'],
                  metadata: {
                    name: 'Practice QuestionSet',
                    description: 'Practice QuestionSet',
                    resourceType: 'Learn',
                    contentType: 'PracticeQuestionSet',
                    audience: ['Learner'],
                    appIcon: '',
                    marks: 5
                  },
                  questionCategories: ['vsa']
                }
              ]
            }
          }
        }
      ],
      actions: {
        showTotalContribution: {
          roles: [1, 2]
        },
        showMyContribution: {
          roles: [1]
        },
        showRejected: {
          roles: [1]
        },
        showUnderReview: {
          roles: [1]
        },
        showTotalUnderReview: {
          roles: [2]
        },
        showAcceptedByMe: {
          roles: [2]
        },
        showRejectedByMe: {
          roles: [2]
        },
        showFilters: {
          roles: [1, 2, 3]
        },
        showAddResource: {
          roles: [1]
        },
        showEditResource: {
          roles: [1]
        },
        showMoveResource: {
          roles: [1]
        },
        showDeleteResource: {
          roles: [1]
        },
        showPreviewResource: {
          roles: [2]
        },
        showDashboard: {
          roles: [3]
        },
        showCert: {
          roles: [4]
        },
        showSave: {
          roles: [1]
        },
        showEdit: {
          roles: [1]
        },
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
        showCreatorView: {
          roles: [1]
        },
        showReviewerView: {
          roles: [2]
        },
        showCountPanel: {
          roles: [1, 2]
        },
        showAawaitingReview: {
          roles: [2]
        },
        showCreateQuestion: {
          roles: [1]
        },
        showDeleteQuestion: {
          roles: [1]
        },
        showContribution: {
          roles: [1]
        },
        showUpforReview: {
          roles: [2]
        }
      },
      sharedContext: [
        'channel',
        'framework',
        'board',
        'medium',
        'gradeLevel',
        'subject',
        'topic'
      ]
    },
    defaultRoles: ['CONTRIBUTOR'],
    userDetails: {
      programId: '4bc66d00-279f-11ea-8e51-77f851f90140',
      userId: '874ed8a5-782e-4f6c-8f36-e0288455901e',
      onBoardingData: {
        school: 'My School'
      },
      roles: ['CONTRIBUTOR']
    }
  },
  role: {
    currentRole: 'CONTRIBUTOR'
  }
};

export const responseSample = {
  result: {
    content: {
      appId: 'dev.sunbird.portal',
      audience: ['Learner'],
      board: 'NCERT',
      channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
      childNodes: [
        'do_1127639059664650241140',
        'do_1127639059664650241141',
        'do_1127639059664486401136',
        'do_1127639059664568321137',
        'do_1127639059664568321139',
        'do_1127639059664568321138'
      ],
      children: [
        {
          children: [{
            ownershipType: ['createdBy'],
            parent: 'do_1129365666867363841261',
            subject: ['English'],
            medium: ['English'],
            gradeLevel: ['Kindergarten'],
            contentType: 'PracticeQuestionSet',
            dialcodeRequired: 'No',
            identifier: 'do_1129365739663605761192',
            creator: 'Creation',
            version: 2,
            versionKey: '1579171626757',
            license: 'CC BY 4.0',
            name: 'Practice QuestionSet',
            topic: ['Topic 3'],
            board: 'NCERT',
            resourceType: 'Learn',
            status: 'Review',
            prevStatus: 'Draft',
            createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e'
          }],
          code: 'do_1127639059664486401136',
          contentType: 'TextBookUnit',
          createdOn: '2019-05-17T11:53:10.045+0000',
          depth: 1,
          dialcodeRequired: 'No',
          framework: 'NCFCOPY',
          identifier: 'do_1127639059664486401136',
          index: 1,
          lastStatusChangedOn: '2019-05-17T11:53:10.045+0000',
          lastUpdatedOn: '2019-05-17T12:19:32.850+0000',
          mimeType: 'application/vnd.ekstep.content-collection',
          name: 'अवधपुरी मे राम',
          objectType: 'Content',
          parent: 'do_1127639035982479361130',
          status: 'Draft',
          topic: ['Topic 1'],
          versionKey: '1558093990045',
          visibility: 'Parent'
        },
        {
          children: [],
          code: '997b18a6-4688-42e9-8e44-d3c86a6066e0',
          contentType: 'TextBookUnit',
          createdOn: '2019-05-17T11:53:10.046+0000',
          depth: 1,
          dialcodeRequired: 'No',
          framework: 'NCFCOPY',
          identifier: 'do_1127639059664568321137',
          index: 2,
          lastStatusChangedOn: '2019-05-17T11:53:10.046+0000',
          lastUpdatedOn: '2019-05-17T11:53:10.046+0000',
          mimeType: 'application/vnd.ekstep.content-collection',
          name: 'जंगल और जनकपुर',
          parent: 'do_1127639035982479361130',
          status: 'Draft',
          topic: ['Topic 2'],
          versionKey: '1558093990046',
          visibility: 'Parent'
        },
        {
          children: [
            {
              children: [{
                ownershipType: ['createdBy'],
                parent: 'do_1129365666867363841260',
                subject: ['English'],
                medium: ['English'],
                gradeLevel: ['Kindergarten'],
                contentType: 'PracticeQuestionSet',
                dialcodeRequired: 'No',
                identifier: 'do_1129365739663605761192',
                creator: 'Creation',
                version: 2,
                versionKey: '1579171626757',
                license: 'CC BY 4.0',
                name: 'Practice QuestionSet',
                topic: ['Topic 3'],
                board: 'NCERT',
                resourceType: 'Learn',
                status: 'Draft',
                prevStatus: 'Review',
                createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e'
              }],
              code: '30bc460c-8d92-4865-9097-bd64b772bb24',
              contentType: 'TextBookUnit',
              createdOn: '2020-01-09T16:58:16.559+0000',
              depth: 2,
              dialcodeRequired: 'No',
              framework: 'NCFCOPY',
              identifier: 'do_112931801879011328152',
              index: 3,
              lastStatusChangedOn: '2020-01-09T16:58:16.559+0000',
              lastUpdatedOn: '2020-01-09T16:58:16.559+0000',
              mimeType: 'application/vnd.ekstep.content-collection',
              name: 'Unit 1.1',
              parent: 'do_112931687703855104137',
              status: 'Draft',
              topic: ['Topic 2'],
              versionKey: '1578589096559',
              visibility: 'Parent'
            }
          ],
          code: '93910a43-2c5c-4cc5-a438-63489dab41c8',
          contentType: 'TextBookUnit',
          createdOn: '2019-05-17T11:53:10.046+0000',
          depth: 1,
          dialcodeRequired: 'No',
          framework: 'NCFCOPY',
          identifier: 'do_1127639059664568321138',
          index: 3,
          lastStatusChangedOn: '2019-05-17T11:53:10.046+0000',
          lastUpdatedOn: '2019-05-17T11:53:10.046+0000',
          mimeType: 'application/vnd.ekstep.content-collection',
          name: 'दो वरदान',
          parent: 'do_1127639035982479361130',
          status: 'Draft',
          topic: ['Topic 1 child'],
          versionKey: '1558093990046',
          visibility: 'Parent'
        }
      ],
      code: 'org.sunbird.L9HqTc',
      compatibilityLevel: 1,
      consumerId: '9393568c-3a56-47dd-a9a3-34da3c821638',
      contentDisposition: 'inline',
      contentEncoding: 'gzip',
      contentType: 'TextBook',
      createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
      createdFor: ['ORG_001'],
      createdOn: '2019-05-17T11:48:20.958+0000',
      creator: 'Creation',
      depth: 0,
      description: 'Enter description for TextBook',
      dialcodeRequired: 'No',
      framework: 'NCFCOPY',
      gradeLevel: ['Kindergarten'],
      idealScreenDensity: 'hdpi',
      idealScreenSize: 'normal',
      identifier: 'do_1127639035982479361130',
      language: ['English'],
      mediaType: 'content',
      medium: ['English'],
      mimeType: 'application/vnd.ekstep.content-collection',
      name: 'बाल रामकथा(HINDHI)',
      organisation: ['Sunbird'],
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1',
      resourceType: 'Book',
      status: 'Draft',
      subject: ['Hindi'],
      version: 2,
      versionKey: '1558095572854',
      visibility: 'Default'
    }
  }
};

export const fetchedQueCount = {
  result: {
    facets: [{ values: [{ count: 66, name: 'topic 1' }] }]
  }
};

export const templateSelectionEvent = {
  template: 'explanationContent',
  templateDetails: {
    filesConfig: { accepted: 'pdf', size: '50' },
    id: 'explanationContent',
    label: 'Explanation',
    metadata: {
      // tslint:disable-next-line:max-line-length
      appIcon:
        // tslint:disable-next-line:max-line-length
        'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
      audience: ['Learner'],
      contentType: 'ExplanationResource',
      description: 'ExplanationResource',
      marks: 5,
      name: 'Explanation Resource',
      resourceType: 'Read'
    },
    mimeType: ['application/pdf'],
    onClick: 'uploadComponent'
  },
  type: 'next'
};
