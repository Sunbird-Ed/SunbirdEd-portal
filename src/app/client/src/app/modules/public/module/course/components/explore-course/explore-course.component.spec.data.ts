export const Response = {
  successData: {
    'id': 'api.course.search',
    'ver': '1.0',
    'ts': '2018-04-17T09:11:29.891Z',
    'params': {
        'resmsgid': '50a06b30-421f-11e8-aff0-874e9450fe3b',
        'msgid': '507626e0-421f-11e8-abea-5f1cb2054cae',
        'status': 'successful',
        'err': null,
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'count': 549,
        'content': [
            {
                'keywords': [
                    'AILP'
                ],
                'subject': 'Machine Learning',
                'channel': '0124806738824970246',
                'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124765386384179201514_spine.ecar',
                'language': [
                    'English'
                ],
                'mimeType': 'application/vnd.ekstep.content-collection',
                'variants': {
                    'spine': {
                        'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ailp-april_1523017594571__spine.ecar',
                        'size': 26356
                    }
                },
                'objectType': 'Content',
                'gradeLevel': [
                    'Basic'
                ],
                'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/1-1_1485252935201.thumb.png',
                'children': [],
                'appId': 'staging.sunbird.portal',
                'contentEncoding': 'gzip',
                'mimeTypesCount': '{\'application/vnd.ekstep.html-archive\':1,\':1,\'application/vnd.ekstep.content-collection\':1}',
                'contentType': 'Course',
                'identifier': 'do_2124765386384179201514',
                'lastUpdatedBy': '7d3dd6ec-e9bb-4298-b260-12b95200984e',
                'audience': [
                    'Learner'
                ],
                'visibility': 'Default',
                'toc_url': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124765386384179201514toc.json',
                'contentTypesCount': '{\'CourseUnit\':1,\'Resource\':2}',
                'consumerId': 'a1e30e28-0bb9-4582-b6e9-bc6aee7cd38d',
                'childNodes': [
                    'do_2124742570044129281182',
                    'do_2124636232165949441550',
                    'do_2124765554540298241518'
                ],
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'graph_id': 'domain',
                'nodeType': 'DATA_NODE',
                'lastPublishedBy': '7d3dd6ec-e9bb-4298-b260-12b95200984e',
                'prevState': 'Review',
                'size': 26356,
                'lastPublishedOn': '2018-04-06T12:26:34.561+0000',
                'concepts': [
                    'AI33'
                ],
                'IL_FUNC_OBJECT_TYPE': 'Content',
                'name': 'AILP April',
                'topic': 'Machine Learning',
                'status': 'Live',
                'code': 'org.sunbird.f5tewv',
                'description': 'April session for AILP course',
                'idealScreenSize': 'normal',
                'posterImage': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/1-1_1485252935201.png',
                'createdOn': '2018-04-06T11:42:50.509+0000',
                'c_sunbird_private_batch_count': 1,
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2018-04-06T12:26:33.903+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2018-04-12T07:45:01.474+0000',
                'subtopic': 'Machine Learning',
                'creator': 'Content Creator',
                'createdFor': [
                    '0124453662635048969'
                ],
                'IL_SYS_NODE_TYPE': 'DATA_NODE',
                'os': [
                    'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1523017593903',
                'idealScreenDensity': 'hdpi',
                'c_sunbird_open_batch_count': 1,
                'framework': 'atl',
                's3Key': 'ecar_files/do_2124765386384179201514/ailp-april_1523017594571_do_2124765386384179201514_1.0_spine.ecar',
                'lastSubmittedOn': '2018-04-06T12:20:22.978+0000',
                'createdBy': '6d113327-45ba-4d6d-9802-515ea05e3af6',
                'compatibilityLevel': 4,
                'leafNodesCount': 2,
                'IL_UNIQUE_ID': 'do_2124765386384179201514',
                'resourceType': 'Story',
                'node_id': 101378
            }
        ]
    }
  },
  noResult: {
    'id': 'api.course.search',
    'ver': '1.0',
    'ts': '2018-04-17T09:11:29.891Z',
    'params': {
        'resmsgid': '50a06b30-421f-11e8-aff0-874e9450fe3b',
        'msgid': '507626e0-421f-11e8-abea-5f1cb2054cae',
        'status': 'successful',
        'err': null,
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'count': 0,
        'course': [
            {}]
    }
},
    pager: {
      'totalItems': 1173, 'currentPage': 3, 'pageSize': 25, 'totalPages': 47,
      'startPage': 30, 'endPage': 34, 'startIndex': 725, 'endIndex': 749, 'pages': [30, 31, 32, 33, 34]
    },
    requestParam: {
      'filters': {
        'contentType': [
          'Collection',
          'TextBook',
          'LessonPlan',
          'Resource',
          'Story',
          'Worksheet',
          'Game'
        ],
        'board': ['CBSE'],
        'channel': '0123166367624478721'
      },
      'limit': 20,
      'pageNumber': 1,
      'query': 'hello',
      'softConstraints': {
        'badgeAssertions': 98, 'board': 99, 'channel': 100
      },
      'facets': undefined
    },
    requestParam2: {
      'filters': {
        'contentType': [
          'Collection',
          'TextBook',
          'LessonPlan',
          'Resource',
          'Story',
          'Worksheet',
          'Game'
        ],
        'channel': '0123166367624478721'
      },
      'limit': 20,
      'pageNumber': 3,
      'query': 'hello',
    },
    requestParam3: {
      'filters': {
        'contentType': [
          'Collection',
          'TextBook',
          'LessonPlan',
          'Resource',
          'Story',
          'Worksheet',
          'Game'
        ],
        'channel': '0123166367624478721'
      },
      'limit': 20,
      'pageNumber': 3,
      'query': 'hello'
    },
    orgDetailsSuccessData: {
      'dateTime': null,
      'preferredLanguage': 'English',
      'approvedBy': null,
      'channel': 'AP',
      'description': 'AP',
      'updatedDate': null,
      'addressId': '0123166355817267202',
      'orgType': 'Training',
      'provider': null,
      'orgCode': 'AP',
      'theme': null,
      'id': '0123166367624478721',
      'communityId': null,
      'isApproved': null,
      'slug': 'ap',
      'identifier': '0123166367624478721',
      'thumbnail': null,
      'orgName': 'AP',
      'updatedBy': null,
      'address': {
        'country': 'India',
        'updatedBy': null,
        'city': 'AP',
        'updatedDate': null,
        'userId': null,
        'zipcode': '123456',
        'addType': null,
        'createdDate': '2017-08-23 13:29:09:359+0000',
        'isDeleted': null,
        'createdBy': '{{user_id}}',
        'addressLine1': null,
        'addressLine2': null,
        'id': '0123166355817267202',
        'state': 'AP'
      },
      'externalId': null,
      'isTenant': true,
      'rootOrgId': 'ORG_001',
      'approvedDate': null,
      'imgUrl': null,
      'homeUrl': null,
      'isDefault': null,
      'contactDetail': null,
      'createdDate': '2017-08-23 13:29:09:359+0000',
      'createdBy': '{{user_id}}',
      'parentOrgId': null,
      'hashTagId': '0123166367624478721',
      'noOfMembers': null,
      'status': null
    },
    inviewData:
    {
      'inview':
        [{
          'id': 0,
          'data': {
            'name': 'Untitled lesson plan',
            'image': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content
            /do_112485064432762880125/artifact/2_1466487176189.thumb.jpg`,
            'rating': '0',
            'action': { 'onImage': { 'eventName': 'onImage' } },
            'ribbon': {
              'left': { 'class': 'ui blue left ribbon label' },
              'right': { 'name': 'LessonPlan', 'class': 'ui black right ribbon label' }
            },
            'metaData': {
              'identifier': 'do_112485064432762880125',
              'mimeType': 'application/vnd.ekstep.content-collection', 'framework': 'NCF', 'contentType': 'LessonPlan'
            }
          }
        },
        {
          'id': 1,
          'data':
          {
            'name': 'mp4 post',
            'description': 'Test_QA',
            'rating': '0',
            'action': { 'onImage': { 'eventName': 'onImage' } },
            'ribbon': {
              'left': { 'name': 'cert123', 'class': 'ui blue left ribbon label' },
              'right': { 'name': 'LessonPlan', 'class': 'ui black right ribbon label' }
            },
            'metaData': {
              'identifier': 'do_112460783576416256145',
              'mimeType': 'application/vnd.ekstep.content-collection', 'framework': 'NCF', 'contentType': 'LessonPlan'
            }
          }
        }]
    },
    facetData:
      [
        {
          'values': [
            {
              'name': 'grade 7',
              'count': 8
            },
            {
              'name': 'class 2',
              'count': 85
            }
          ],
          'name': 'gradeLevel'
        },
        {
          'values': [
            {
              'name': 'chemistry',
              'count': 2
            },
            {
              'name': 'marathi',
              'count': 9
            }
          ],
          'name': 'subject'
        },
        {
          'values': [
            {
              'name': 'nepali',
              'count': 1
            },
            {
              'name': 'odia',
              'count': 12
            }
          ],
          'name': 'medium'
        },
        {
          'values': [
            {
              'name': 'state (uttar pradesh)',
              'count': 7
            },
            {
              'name': 'state (tamil nadu)',
              'count': 5
            }
          ],
          'name': 'board'
        }
      ],
      filters: [
        {
          'code': 'board',
          'dataType': 'text',
          'name': 'Board',
          'label': 'Board',
          'description': 'Education Board (Like MP Board, NCERT, etc)',
          'editable': true,
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'renderingHints': {
            'semanticColumnWidth': 'three'
          },
          'index': 1,
          'range': [
            {
              'identifier': 'ncf_board_ncert',
              'code': 'ncert',
              'name': 'NCERT',
              'description': '',
              'index': 2,
              'category': 'board',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_board_cbse',
              'code': 'cbse',
              'name': 'CBSE',
              'description': '',
              'index': 1,
              'category': 'board',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_board_icse',
              'code': 'icse',
              'name': 'ICSE',
              'description': '',
              'index': 3,
              'category': 'board',
              'status': 'Live'
            }
          ]
        },
        {
          'code': 'medium',
          'dataType': 'text',
          'name': 'Medium',
          'label': 'Medium',
          'description': 'Medium of instruction',
          'editable': true,
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'renderingHints': {
            'semanticColumnWidth': 'three'
          },
          'index': 2,
          'range': [
            {
              'identifier': 'ncf_medium_english',
              'code': 'english',
              'name': 'English',
              'description': '',
              'index': 1,
              'category': 'medium',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_medium_hindi',
              'code': 'hindi',
              'name': 'Hindi',
              'description': '',
              'index': 2,
              'category': 'medium',
              'status': 'Live'
            }
          ]
        },
        {
          'code': 'subject',
          'dataType': 'text',
          'name': 'Subject',
          'label': 'Subject',
          'description': 'Subject of the Content to use to teach',
          'editable': true,
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'renderingHints': {
            'semanticColumnWidth': 'three'
          },
          'index': 3,
          'range': [
            {
              'identifier': 'ncf_subject_mathematics',
              'code': 'mathematics',
              'name': 'Mathematics',
              'description': '',
              'index': 1,
              'category': 'subject',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_subject_english',
              'code': 'english',
              'name': 'English',
              'description': '',
              'index': 2,
              'category': 'subject',
              'status': 'Live'
            }
          ]
        },
        {
          'code': 'gradeLevel',
          'dataType': 'text',
          'name': 'Grade',
          'label': 'Grade',
          'description': 'Grade',
          'editable': true,
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'renderingHints': {
            'semanticColumnWidth': 'three'
          },
          'index': 4,
          'range': [
            {
              'identifier': 'ncf_gradelevel_kindergarten',
              'code': 'kindergarten',
              'name': 'KG',
              'description': 'KG',
              'index': 1,
              'category': 'gradelevel',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_gradelevel_grade1',
              'code': 'grade1',
              'name': 'Class 1',
              'description': 'Class 1',
              'index': 2,
              'category': 'gradelevel',
              'status': 'Live'
            }
          ]
        }
      ],
      formData: [{
        'index': 1,
        'title': 'frmelmnts.tab.courses',
        'desc': 'frmelmnts.tab.courses',
        'menuType': 'Content',
        'isEnabled': true,
        'theme': {
          'baseColor': '',
          'textColor': '',
          'supportingColor': ''
        },
        'search': {
          'facets': ['topic', 'purpose', 'medium', 'gradeLevel', 'subject', 'channel'],
          'fields': [],
          'filters': {
            'contentType': ['Course']
          },
          'limit': 20
        }
      }, {
        'index': 0,
        'title': 'frmelmnts.lbl.textbooks',
        'desc': 'frmelmnts.lbl.textbooks',
        'menuType': 'Content',
        'isEnabled': true,
        'theme': {
          'baseColor': '',
          'textColor': '',
          'supportingColor': ''
        },
        'search': {
          'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType', 'concepts'],
          'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier', 'medium', 'pkgVersion', 'board', 'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
          'filters': {
            'contentType': ['TextBook']
          },
          'limit': 100
        }
      }, {
        'index': 2,
        'title': 'frmelmnts.tab.all',
        'desc': 'frmelmnts.tab.all',
        'menuType': 'Content',
        'isEnabled': false,
        'theme': {
          'baseColor': '',
          'textColor': '',
          'supportingColor': ''
        },
        'search': {
          'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType', 'concepts'],
          'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier', 'medium', 'pkgVersion', 'board', 'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
          'filters': {
            'contentType': ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'SelfAssess', 'PracticeResource', 'LearningOutcomeDefinition', 'ExplanationResource', 'CurriculumCourse', 'Course']
          },
          'limit': 100
        }
      }]
  };
