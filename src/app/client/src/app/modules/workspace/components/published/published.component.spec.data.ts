export const mockRes = {
  searchSuccess: {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'count': 65,
      'content': [{
        'identifier': 'do_2124339707713126401772',
        'name': 'Test_Collection_19_mar_2018_20001'
      }]
    }
  },
  searchSuccessWithCountTwo: {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'count': 65,
      'content': [{
        'identifier': 'do_2124645801147023361261',
        'name': 'ntitled textbook',
        'description': 'Untitled textbook',
      }, {
        'identifier': 'do_2124341006465925121871',
        'name': 'Batch EnrolFeb',
        'description': 'Test Description ',
      }]
    }
  },
  deleteSuccess: {
    'id': 'api.content.retire",', 'ver': '1.0', 'ts': '2018-03-21T13:22:47.263Z"',
    'params': {
      'resmsgid': '8ab1aff0-16e6-11e8-b881-f9ecfdfe4059', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''
    },
    'responseCode': 'OK',
    'result': []
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
  },
  telemetryData: {
    context: {
      env: 'workspace'
    },
    edata: {
      type: 'list',
      pageid: 'workspace-content-unlisted',
      subtype: 'scroll',
      uri: '',
      visits: []
    }
  },
  pager: { 'totalItems': 72, 'currentPage': 3, 'pageSize': 9, 'totalPages': 8,
  'startPage': 1, 'endPage': 8, 'startIndex': 1, 'endIndex': 72, 'pages': [1, 2, 3, 4, 5]},
  searchedCollection: {
    'id': 'api.search-service.search',
    'ver': '3.0',
    'ts': '2020-09-07T13:44:30ZZ',
    'params': {
        'resmsgid': '15ce98a8-4b85-4b2a-bef8-57e0422d121c',
        'msgid': null,
        'err': null,
        'status': 'successful',
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'count': 1,
        'content': [
            {
                'ownershipType': [
                    'createdBy'
                ],
                'copyright': 'Odisha',
                'year': '2020',
                'subject': [
                    'Mathematics'
                ],
                'channel': '0124784842112040965',
                'downloadUrl': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_2131027638862725121259/book1_1599458607811_do_2131027638862725121259_1.0_spine.ecar',
                'organisation': [
                    'Odisha'
                ],
                'language': [
                    'English'
                ],
                'mimeType': 'application/vnd.ekstep.content-collection',
                'variants': {
                    'online': {
                        'ecarUrl': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_2131027638862725121259/book1_1599458607873_do_2131027638862725121259_1.0_online.ecar',
                        'size': 4745.0
                    },
                    'spine': {
                        'ecarUrl': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_2131027638862725121259/book1_1599458607811_do_2131027638862725121259_1.0_spine.ecar',
                        'size': 79433.0
                    }
                },
                'leafNodes': [
                    'do_2131027620732764161258'
                ],
                'objectType': 'Content',
                'gradeLevel': [
                    'Class 10'
                ],
                'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2131027638862725121259/artifact/1500_1560755661944.thumb.jpg',
                'children': [
                    'do_2131027620732764161258'
                ],
                'appId': 'staging.diksha.portal',
                'contentEncoding': 'gzip',
                'lockKey': 'fbd61641-d170-4e73-b353-69ddf3b7e93e',
                'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':1,\'application/vnd.ekstep.ecml-archive\':1}',
                'totalCompressedSize': 102633.0,
                'contentType': 'TextBook',
                'identifier': 'do_2131027638862725121259',
                'audience': [
                    'Learner'
                ],
                'visibility': 'Default',
                'toc_url': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2131027638862725121259/artifact/do_2131027638862725121259_toc.json',
                'contentTypesCount': '{\'TextBookUnit\':1,\'LessonPlan\':1}',
                'consumerId': 'a9cb3a83-a164-4bf0-aa49-b834cebf1c07',
                'childNodes': [
                    'do_2131027620732764161258',
                    'do_2131027641506119681226'
                ],
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'graph_id': 'domain',
                'nodeType': 'DATA_NODE',
                'lastPublishedBy': 'dca7518d-5886-4251-94aa-360c762b1182',
                'version': 2,
                'license': 'CC BY 4.0',
                'prevState': 'Review',
                'size': 79433.0,
                'lastPublishedOn': '2020-09-07T06:03:27.768+0000',
                'IL_FUNC_OBJECT_TYPE': 'Content',
                'name': 'book1',
                'status': 'Live',
                'code': 'org.sunbird.QFA7h2',
                'prevStatus': 'Processing',
                'description': 'Enter description for TextBook',
                'medium': [
                    'Hindi'
                ],
                'idealScreenSize': 'normal',
                'posterImage': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2127857103817932801565/artifact/1500_1560755661944.jpg',
                'createdOn': '2020-09-07T06:01:22.213+0000',
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2020-09-07T06:03:27.597+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-09-07T06:03:27.938+0000',
                'dialcodeRequired': 'No',
                'creator': 'Qualitrix Content Creator Cr',
                'createdFor': [
                    '0124784842112040965'
                ],
                'lastStatusChangedOn': '2020-09-07T06:03:27.932+0000',
                'IL_SYS_NODE_TYPE': 'DATA_NODE',
                'os': [
                    'All'
                ],
                'pkgVersion': 1.0,
                'versionKey': '1599458607597',
                'idealScreenDensity': 'hdpi',
                'framework': 'rj_k-12_2',
                'depth': 0,
                's3Key': 'ecar_files/do_2131027638862725121259/book1_1599458607811_do_2131027638862725121259_1.0_spine.ecar',
                'lastSubmittedOn': '2020-09-07T06:02:54.742+0000',
                'createdBy': 'ab467e6e-1f32-453c-b1d8-c6b5fa6c7b9e',
                'compatibilityLevel': 1,
                'leafNodesCount': 1,
                'IL_UNIQUE_ID': 'do_2131027638862725121259',
                'board': 'State (Rajasthan)',
                'resourceType': 'Book',
                'node_id': 545166
            }
        ]
    }
 },
 channelDetail: {
    'id': 'api.search-service.search',
    'ver': '3.0',
    'ts': '2020-09-07T13:44:30ZZ',
    'params': {
        'resmsgid': '15ce98a8-4b85-4b2a-bef8-57e0422d121c',
        'msgid': null,
        'err': null,
        'status': 'successful',
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'count': 1,
        'channel': [
            {
                'code': '0124784842112040965',
                'name': 'Sunbird'
            }
        ]
    }
 }
};
