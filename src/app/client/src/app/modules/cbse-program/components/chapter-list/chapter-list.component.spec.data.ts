export const chapterListComponentInput = {
    sessionContext: {
      framework: 'NCFCOPY',
      programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1',
      board: 'NCERT',
      channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
      hierarchyObj: {
        hierarchy: {
          do_11282684038818201618: {
            // tslint:disable-next-line:max-line-length
            name: 'Question Bank', contentType: 'TextBookUnit', children: [ 'do_1129159369778708481511'], root: false
          }, do_1129159369778708481511: {
            name: 'Practice Sets', contentType: 'PracticeQuestionSet', children: [], root: false
          },
        }
      },
      topicList: [{
          // tslint:disable-next-line:max-line-length
          identifier: 'ncfcopy_topic_topic1', code: 'topic1', translations: null, name: 'Topic, topic 1', description: 'Mathematics', index: 1, category: 'topic', status: 'Live'
        }]
    },
    collection: {
      name: 'बाल रामकथा(HINDHI)',
      image:
        // tslint:disable-next-line:max-line-length
        'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
      subject: ['Hindi'],
      medium: ['English'],
      gradeLevel: 'Kindergarten',
      contentType: 'TextBook',
      resourceType: 'Book'
    },
    config: {
      config: {
        contentTypes: {
          value: [
            {
              id: 'explanationContent',
              onClick: 'uploadComponent',
              mimeType: ['application/pdf'],
              metadata: {
                contentType: 'ExplanationResource'
              },
              filesConfig: { accepted: 'pdf', size: '50' }
            }
          ],
          defaultValue: [
            {
                id: 'explanationContent',
                onClick: 'uploadComponent',
                mimeType: ['application/pdf'],
                metadata: {
                  contentType: 'ExplanationResource'
                },
                filesConfig: { accepted: 'pdf', size: '50' }
            }
          ]
        }
      }
    },
    programContext: {
      programId: '4bc66d00-279f-11ea-8e51-77f851f90140',
      config: {
       roles: [
          {
            id: 1,
            name: 'CONTRIBUTOR',
            default: true,
            defaultTab: 1,
            tabs: [1]
          }
        ],
        header: { config: { tabs: [{
                index: 1,
                label: 'Contribute',
                onClick: 'collectionComponent',
                visibility: true
        }]}},
        components: [
          {
            id: 'ng.sunbird.collection',
            config: {
              collectionType: 'Textbook',
              collectionList: [],
              status: ['Draft', 'Live']
            }
          },
          {
            id: 'ng.sunbird.chapterList',
            config: {
              contentTypes: {
                value: [{
                    id: 'explanationContent',
                    onClick: 'uploadComponent',
                    mimeType: ['application/pdf'],
                    metadata: {
                      name: 'Explanation Resource',
                      contentType: 'ExplanationResource'
                    },
                    filesConfig: { accepted: 'pdf', size: '50' }
                }]
              }
            }
          }
        ],
        actions: {
          showTotalContribution: {
            roles: [1]
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
            roles: [1]
          },
          showAcceptedByMe: {
            roles: [1]
          },
          showRejectedByMe: {
            roles: [1]
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
          showContribution: {
            roles: [1]
          },
          showUpforReview: {
            roles: [1]
          }
        },
        sharedContext: ['channel', 'framework', 'board', 'medium', 'gradeLevel', 'subject', 'topic' ]
      },
      defaultRoles: ['CONTRIBUTOR'],
      name: 'CBSE 2',
      rootOrgId: 'ORG_001',
      startDate: '2019-12-20T07:20:30.000Z',
      type: 'private',
      userDetails: {
        programId: '4bc66d00-279f-11ea-8e51-77f851f90140',
        userId: '874ed8a5-782e-4f6c-8f36-e0288455901e',
        onBoarded: true,
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
            children: [],
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
            // children: [
            //   {
            //     children: [],
            //     code: "30bc460c-8d92-4865-9097-bd64b772bb24",
            //     contentType: "TextBookUnit",
            //     createdOn: "2020-01-09T16:58:16.559+0000",
            //     depth: 2,
            //     dialcodeRequired: "No",
            //     framework: "NCFCOPY",
            //     identifier: "do_112931801879011328152",
            //     index: 3,
            //     lastStatusChangedOn: "2020-01-09T16:58:16.559+0000",
            //     lastUpdatedOn: "2020-01-09T16:58:16.559+0000",
            //     mimeType: "application/vnd.ekstep.content-collection",
            //     name: "Unit 1.1",
            //     parent: "do_112931687703855104137",
            //     status: "Draft",
            //     topic: ["Topic 2"],
            //     versionKey: "1578589096559",
            //     visibility: "Parent"
            //   }
            // ],
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
            visibility: 'Parent',
            children: [
              { name: 'Question Bank', identifier: 'do_1127639059664568321138' }
            ]
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
        lastStatusChangedOn: '2019-05-17T11:55:29.702+0000',
        lastUpdatedBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
        lastUpdatedOn: '2019-05-17T12:19:32.854+0000',
        lockKey: 'eed6ec88-b388-42c1-aa23-3b24b03c9b89',
        mediaType: 'content',
        medium: ['English'],
        mimeType: 'application/vnd.ekstep.content-collection',
        name: 'बाल रामकथा(HINDHI)',
        organisation: ['Sunbird'],
        os: ['All'],
        osId: 'org.ekstep.quiz.app',
        ownedBy: 'ORG_001',
        owner: 'Sunbird',
        ownershipType: ['createdFor'],
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
      metadata: {
        appIcon:
          // tslint:disable-next-line:max-line-length
          'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
        contentType: 'ExplanationResource',
        name: 'Explanation Resource',
      },
      mimeType: ['application/pdf'],
      onClick: 'uploadComponent'
    },
    type: 'next'
  };
