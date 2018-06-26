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
            'course': [
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
            'content': [
                {}]
        }
    },
    errorCourse: {
        'id': 'api.course.search',
        'ver': '1.0',
        'ts': '2018-04-17T09:11:29.891Z', 'params': {
            'resmsgid': 'UnAutorized', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
            'status': 'UnAutorized', 'err': 'UnAutorized', 'errmsg': 'UnAutorized'
        }, 'responseCode': 'Err',
        'result': {
            'courses': []
        }
    },
    courseSuccess: {
        'id': 'api.course.getbyuser', 'params': {
            'resmsgid': 'null', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
            'status': 'success', 'err': 'null', 'errmsg': 'null'
        }, 'responseCode': 'OK',
        'result': {
            'courses': [
                {
                    'active': 'true', 'courseId': 'do_2123412199319552001265', 'courseName': '27-sept',
                    'description': 'test', 'leafNodesCount': '0', 'progress': '0', 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
                }]
        }
    },
    enrolledCourses: {
        'enrolledCourses': [
            {
                'courseId': 'do_2123412199319552001265', 'courseName': '27-sept',
                'description': 'test', 'leafNodesCount': 0, 'progress': 0, 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }
        ]
    },
    noCourses: {
        'enrolledCourses': []
    },
    sameIdentifier: {
        'enrolledCourses': [
            {
                'courseId': 'do_2124765386384179201514', 'courseName': '27-sept',
                'description': 'test', 'leafNodesCount': 0, 'progress': 0, 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }
        ]
    },
    pager: {
        'totalItems': 1173, 'currentPage': 3, 'pageSize': 25, 'totalPages': 47,
        'startPage': 30, 'endPage': 34, 'startIndex': 725, 'endIndex': 749, 'pages': [30, 31, 32, 33, 34]
    },
    event: {
        'inview': [
          {
            'id': 0,
            'data': {
              'name': 'Aman15thMay Book',
              'image': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content
              /do_1125041330714050561226/artifact/4272f16cf3fd329b18dd116315601ad0_1476257845556.thumb.jpeg`,
              'description': 'Untitled Collection sadasd asd asd as',
              'action': {
                'right': {
                  'class': 'trash large icon',
                  'eventName': 'delete',
                  'displayType': 'icon'
                },
                'onImage': {
                  'eventName': 'onImage'
                }
              },
              'ribbon': {
                'right': {
                  'name': 'TextBook',
                  'class': 'ui black right ribbon label'
                }
              },
              'metaData': {
                'identifier': 'do_1125041330714050561226',
                'mimeType': 'application / vnd.ekstep.content - collection',
                'framework': 'NCF',
                'contentType': 'TextBook'
              }
            }
          },
          {
            'id': 1,
            'data': {
              'name': 'Untitled Collection',
              'description': 'Untitled Collection',
              'action': {
                'right': {
                  'class': 'trash large icon',
                  'eventName': 'delete',
                  'displayType': 'icon'
                },
                'onImage': {
                  'eventName': 'onImage'
                }
              },
              'ribbon': {
                'right': {
                  'name': 'Resource',
                  'class': 'ui black right ribbon label'
                }
              },
              'metaData': {
                'identifier': 'do_112514006444826624126',
                'mimeType': 'application / vnd.ekstep.ecml - archive',
                'framework': 'NCF',
                'contentType': 'Resource'
              }
            }
          }
        ],
        'direction': 'up'
      }

};

