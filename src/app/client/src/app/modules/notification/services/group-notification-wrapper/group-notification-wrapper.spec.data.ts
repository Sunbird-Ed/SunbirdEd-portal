import { GroupEntityStatus, GroupMembershipType, GroupMemberRole } from '@project-fmps/client-services/models/group';

export const notificationData = {
    data: {
      'expireOn': null,
      'updatedBy': '4cd4c690-eab6-4938-855a-447c7b1b8ea9',
      'createdBy': 'fbe926ac-a395-40e4-a65b-9b4f711d7642',
      'action': {
          'template': {
              'ver': '4.3.0',
              'data': '{"title": "3.7 Book with Collaborator has been assigned to zen by TNORGADMIN"}',
              'type': 'JSON'
          },
          'createdBy': {
              'name': 'TNORGADMIN',
              'id': 'fbe926ac-a395-40e4-a65b-9b4f711d7642',
              'type': 'user'
          },
          'additionalInfo': {
              'activity': {
                  'id': 'do_21322315085421772811333',
                  'type': 'Digital Textbook',
                  'name': '3.7 Book with Collaborator'
              },
              'groupRole': 'member',
              'group': {
                  'name': 'zen',
                  'id': '2ae1e555-b9cc-4510-9c1d-2f90e94ded90'
              }
          },
          'type': 'member-added',
          'category': 'group'
      },
      'id': '86972448-dfd6-4877-bdcd-d83c5b886951',
      'updatedOn': 1632118806779,
      'category': 'group',
      'priority': 1,
      'createdOn': 1631870811982,
      'userId': '4cd4c690-eab6-4938-855a-447c7b1b8ea9',
      'version': null,
      'status': 'read'
  }
  };
  export const MockResponse = {
    successResult: {
        id: 'api.content.read',
        ver: '1.0',
        ts: '2018-05-03T10:51:12.648Z',
        params: 'params',
        responseCode: 'OK',
        result: {
            content: {
                mimeType: 'application/vnd.ekstep.ecml-archive',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823'
            }
        }
    },
    collectionHierarchy: {
        'id': 'api.course.hierarchy',
        'ver': '1.0',
        'ts': '2019-09-10T08:43:24.333Z',
        'params': {
            'resmsgid': '0d0aedd0-d3a7-11e9-953c-0be7c8ef2b37',
            'msgid': '341222c0-58a8-2a3c-f090-62ba91c105e1',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'ownershipType': [
                    'createdBy'
                ],
                'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
                'organisation': [
                    'Sunbird'
                ],
                'language': [
                    'English'
                ],
                'variants': {
                    'online': {
                        'size': 4039
                    },
                    'spine': {
                        'size': 38624
                    }
                },
                'mimeType': 'application/vnd.ekstep.content-collection',
                'leafNodes': [
                    'do_112831862871203840114'
                ],
                'objectType': 'Content',
                'collections': [

                ],
                'children': [
                    {
                        'parent': 'do_112832377710125056110',
                        'identifier': 'do_112832377987080192111',
                        'copyright': 'Sunbird',
                        'lastStatusChangedOn': '2019-08-22T05:39:51.001+0000',
                        'code': '3d7973a7-243d-4489-aea5-b6e40591671c',
                        'visibility': 'Parent',
                        'index': 1,
                        'mimeType': 'application/vnd.ekstep.content-collection',
                        'createdOn': '2019-08-22T05:39:51.001+0000',
                        'versionKey': '1566452391001',
                        'framework': 'tpd',
                        'depth': 1,
                        'children': [
                            {
                                'ownershipType': [
                                    'createdBy'
                                ],
                                'copyright': 'ORG_002',
                                'channel': '01246944855007232011',
                                'questions': [

                                ],
                                'organisation': [
                                    'ORG_002'
                                ],
                                'showNotification': true,
                                'language': [
                                    'English'
                                ],
                                'mimeType': 'video/mp4',
                                'variants': {
                                    'spine': {
                                        'size': 35757
                                    }
                                },
                                'collections': [
                                    {
                                        'identifier': 'do_11283192356041523212',
                                        'name': 'TestCoursePradCert',
                                        'objectType': 'Content',
                                        'relation': 'hasSequenceMember',
                                        'description': 'certificate course',
                                        'status': 'Live'
                                    },
                                    {
                                        'identifier': 'do_11283193441064550414',
                                        'name': 'test prad course cert',
                                        'objectType': 'Content',
                                        'relation': 'hasSequenceMember',
                                        'description': 'Enter description for Course',
                                        'status': 'Live'
                                    },
                                    {
                                        'identifier': 'do_11283183576849612818',
                                        'name': 'Test Course',
                                        'objectType': 'Content',
                                        'relation': 'hasSequenceMember',
                                        'description': 'Enter description for Course',
                                        'status': 'Live'
                                    }
                                ],
                                'children': [

                                ],
                                'appId': 'dev.sunbird.portal',
                                'usesContent': [

                                ],
                                'contentEncoding': 'identity',
                                'lockKey': 'be6bc445-c75e-471d-b46f-71fefe4a1d2f',
                                'contentType': 'Resource',
                                'item_sets': [

                                ],
                                'lastUpdatedBy': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad',
                                'identifier': 'do_112831862871203840114',
                                'audience': [
                                    'Learner'
                                ],
                                'visibility': 'Default',
                                'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
                                'mediaType': 'content',
                                'osId': 'org.ekstep.quiz.app',
                                'lastPublishedBy': 'System',
                                'version': 1,
                                'prevState': 'Draft',
                                'license': 'Creative Commons Attribution (CC BY)',
                                'lastPublishedOn': '2019-08-21T12:15:13.652+0000',
                                'size': 416488,
                                'concepts': [

                                ],
                                'name': 'Test Resource Cert',
                                'status': 'Live',
                                'code': '7e6630c7-3818-4319-92ac-4d08c33904d8',
                                'methods': [

                                ],
                                'idealScreenSize': 'normal',
                                'createdOn': '2019-08-21T12:11:50.644+0000',
                                'contentDisposition': 'inline',
                                'lastUpdatedOn': '2019-08-21T12:15:13.020+0000',
                                'SYS_INTERNAL_LAST_UPDATED_ON': '2019-08-21T12:30:16.783+0000',
                                'dialcodeRequired': 'No',
                                'creator': 'Pradyumna',
                                'lastStatusChangedOn': '2019-08-21T12:15:14.384+0000',
                                'createdFor': [
                                    '01246944855007232011'
                                ],
                                'os': [
                                    'All'
                                ],
                                'libraries': [

                                ],
                                'pkgVersion': 1,
                                'versionKey': '1566389713020',
                                'idealScreenDensity': 'hdpi',
                                'framework': 'K-12',
                                'createdBy': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad',
                                'compatibilityLevel': 1,
                                'resourceType': 'Learn',
                                'index': 1,
                                'depth': 2
                            }
                        ],
                        'name': 'U1',
                        'lastUpdatedOn': '2019-08-22T05:40:22.424+0000',
                        'contentType': 'CourseUnit',
                        'status': 'Live',
                        'compatibilityLevel': 1,
                        'lastPublishedOn': '2019-08-22T05:40:22.472+0000',
                        'pkgVersion': 1,
                        'leafNodesCount': 1,
                    }
                ],
                'appId': 'dev.sunbird.portal',
                'contentEncoding': 'gzip',
                'lockKey': '8d11f1c0-97bf-4555-81d5-ed7bdcb920d8',
                'mimeTypesCount': '{"application/vnd.ekstep.content-collection":1,"video/mp4":1}',
                'totalCompressedSize': 416488,
                'contentType': 'Course',
                'identifier': 'do_112832377710125056110',
                'audience': [
                    'Learner'
                ],
                'visibility': 'Default',
                'contentTypesCount': '{\'CourseUnit\':1,\'Resource\':1}',
                'childNodes': [
                    'do_112831862871203840114',
                    'do_112832377987080192111'
                ],
                'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': 'System',
                'version': 2,
                'prevState': 'Draft',
                'license': 'Creative Commons Attribution (CC BY)',
                'lastPublishedOn': '2019-08-22T05:40:22.472+0000',
                'size': 38624,
                'name': 'Test Certificate Course Showcase',
                'status': 'Live',
                'code': 'org.sunbird.MwT2Oh',
                'description': 'test',
                'idealScreenSize': 'normal',
                'createdOn': '2019-08-22T05:39:17.192+0000',
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2019-08-22T05:40:22.424+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2019-08-22T05:40:23.643+0000',
                'dialcodeRequired': 'No',
                'creator': 'Creation',
                'lastStatusChangedOn': '2019-08-22T05:40:23.638+0000',
                'createdFor': [
                    'ORG_001'
                ],
                'os': [
                    'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1566452422424',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_112832377710125056110/do_112832377710125056110_1.0_spine.ecar',
                'depth': 0,
                'framework': 'tpd',
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'leafNodesCount': 1,
                'compatibilityLevel': 4,
                'usedByContent': [

                ],
                'resourceType': 'Course',
                'reservedDialcodes': {
                    'W1F6Z2': 0
                },
                'c_sunbird_dev_open_batch_count': 0,
                'certVideoUrl': 'https://sunbirddev.blob.core.windows.net/do_112831862871203840114/small.mp4',
                'certTemplate': [
                    {
                        'name': '100PercentCompletionCertificate',
                        'issuer': {
                            'name': 'Gujarat Council of Educational Research and Training',
                            'url': 'https://gcert.gujarat.gov.in/gcert/',
                            'publicKey': [
                                '1',
                                '2'
                            ]
                        },
                        'signatoryList': [
                            {
                                'name': 'CEO Gujarat',
                                'id': 'CEO',
                                'designation': 'CEO',
                                'image': 'https://cdn.pixabay.com/photo/2014/11/09/08/06/signature-523237__340.jpg'
                            }
                        ],
                        'htmlTemplate': 'https://drive.google.com/uc?authuser=1&id=1ryB71i0Oqn2c3aqf9N6Lwvet-MZKytoM&export=download',
                        'notifyTemplate': {
                            'subject': 'Course completion certificate',
                            'stateImgUrl': 'https://sunbirddev.blob.core.windows.net/orgemailtemplate/img/File-0128212938260643843.png',
                            'regardsperson': 'Chairperson',
                            'regards': 'Minister of Gujarat',
                            'emailTemplateType': 'defaultCertTemp'
                        }
                    }
                ]
            }
        }
    },
    contentMetadata: {
        'contentType': 'Course',
        'primaryCategory': 'Course',
        'framework': 'tpd',
        'identifier': 'do_1130206856421867521137',
        'mimeType': 'application/vnd.ekstep.content-collection'
    }
};
export const modifiedActivities = {
    'ACTIVITY_COURSE_TITLE': [
      {
        'name': '05-03-19-course',
        'identifier': 'do_21271200473210880012152',
        'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21271200473210880012152/artifact/20180817101627-30120_1544767085980.thumb.png',
        'organisation': [
          'Sachin 2808'
        ],
        'subject': 'Political Science',
        'type': 'Course',
        'contentType': 'Course',
        'cardImg': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21271200473210880012152/artifact/20180817101627-30120_1544767085980.thumb.png'
      }
    ],
    'ACTIVITY_TEXTBOOK_TITLE': [
      {
        'name': '28ShallowCopy-6',
        'identifier': 'do_2130093660325806081984',
        'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2130093660325806081984/artifact/44870761_1067305270146427_8127580563721682944_n_1576750191164.thumb.jpg',
        'organisation': [
          'test'
        ],
        'subject': 'Mathematics',
        'type': 'TextBook',
        'contentType': 'TextBook',
        'cardImg': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2130093660325806081984/artifact/44870761_1067305270146427_8127580563721682944_n_1576750191164.thumb.jpg'
      }
    ]
  };
  export const groupData = {
    'membershipType': GroupMembershipType.INVITE_ONLY,
    'updatedBy': '97961992-b2ee-4b41-8f85-dc0e6f466697',
    'createdBy': '97961992-b2ee-4b41-8f85-dc0e6f466697',
    'activitiesGrouped': [
      {
        'title': 'ACTIVITY_COURSE_TITLE',
        'count': 4,
        'items': [
          {
            'id': 'do_21271200473210880012152',
            'type': 'Course',
            'activityInfo': {
              'name': '05-03-19-course',
              'identifier': 'do_21271200473210880012152',
              'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21271200473210880012152/artifact/20180817101627-30120_1544767085980.thumb.png',
              'organisation': [
                'Sachin 2808'
              ],
              'subject': 'Political Science',
              'type': 'Course',
              'contentType': 'Course'
            }
          },
        ],
        isEnabled: true,
        objectType: 'content'
      },
      {
        'title': 'ACTIVITY_TEXTBOOK_TITLE',
        'count': 1,
        'items': [
          {
            'id': 'do_2130093660325806081984',
            'type': 'TextBook',
            'activityInfo': {
              'name': '28ShallowCopy-6',
              'identifier': 'do_2130093660325806081984',
              'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2130093660325806081984/artifact/44870761_1067305270146427_8127580563721682944_n_1576750191164.thumb.jpg',
              'organisation': [
                'test'
              ],
              'subject': 'Mathematics',
              'type': 'TextBook',
              'contentType': 'TextBook',

            }
          }
        ],
        isEnabled: true,
        objectType: 'content'
      }
    ],
    'members': [
      {
        'userId': '97961992-b2ee-4b41-8f85-dc0e6f466697',
        'groupId': '4130b072-fb0a-453b-a07b-4c93812c741b',
        'role': GroupMemberRole.ADMIN,
        'status': GroupEntityStatus.ACTIVE,
        'createdOn': '2020-07-13 17:23:15:503+0000',
        'createdBy': '97961992-b2ee-4b41-8f85-dc0e6f466697',
        'updatedOn': null,
        'updatedBy': null,
        'removedOn': null,
        'removedBy': null,
        'name': 'robert'
      }
    ],
    'name': 'Group test edit',
    'description': 'And here is the description',
    'updatedOn': '2020-07-13 18:11:53:022+0000',
    'id': '4130b072-fb0a-453b-a07b-4c93812c741b',
    'createdOn': '2020-07-13 17:23:15:496+0000',
    'status': GroupEntityStatus.ACTIVE,
    active: true,
    isActive () { return true; },
  };
