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
    collection: 'do_1127639035982479361130',
    collectionName: 'बाल रामकथा(HINDHI)',
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
          contentType: 'TextBookUnit',
          identifier: 'do_1127639059664486401136',
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
          contentType: 'TextBookUnit',
          identifier: 'do_1127639059664568321137',
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
                parent: 'do_1129365666867363841260',
                subject: ['English'],
                medium: ['English'],
                gradeLevel: ['Kindergarten'],
                contentType: 'PracticeQuestionSet',
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
              contentType: 'TextBookUnit',
              identifier: 'do_112931801879011328152',
              name: 'Unit 1.1',
              parent: 'do_112931687703855104137',
              status: 'Draft',
              topic: ['Topic 2'],
              versionKey: '1578589096559',
              visibility: 'Parent'
            }
          ],
          contentType: 'TextBookUnit',
          identifier: 'do_1127639059664568321138',
          name: 'दो वरदान',
          parent: 'do_1127639035982479361130',
          status: 'Draft',
          topic: ['Topic 1 child'],
          versionKey: '1558093990046',
          visibility: 'Parent'
        }
      ],
      contentType: 'TextBook',
      createdBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
      createdFor: ['ORG_001'],
      creator: 'Creation',
      framework: 'NCFCOPY',
      gradeLevel: ['Kindergarten'],
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
      contentType: 'ExplanationResource',
      name: 'Explanation Resource',
    },
    mimeType: ['application/pdf'],
    onClick: 'uploadComponent'
  },
  type: 'next'
};
