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
        'identifier': 'do_2124339707713126401772',
        'name': 'Test_Collection_19_mar_2018_20001'
      }, {
        'identifier': 'do_2124339707713126401772',
        'name': 'Untitled Course'
      }]
    }
  },
  searchSuccessWithCountZero: {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'count': 0,
      'content': []
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
  pager: {
    'totalItems': 72, 'currentPage': 3, 'pageSize': 9, 'totalPages': 8,
    'startPage': 1, 'endPage': 8, 'startIndex': 1, 'endIndex': 72, 'pages': [1, 2, 3, 4, 5]
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
  userMockData: {

        'lastName': 'User',
        'loginId': 'ntptest102',
        'regOrgId': '0123653943740170242',
        'roles': [
            'public'
        ],
        'rootOrg': {
            'dateTime': null,
            'preferredLanguage': 'English',
            'approvedBy': null,
            'channel': 'ROOT_ORG',
            'description': 'Sunbird',
            'updatedDate': '2017-08-24 06:02:10:846+0000',
            'addressId': null,
            'orgType': null,
            'provider': null,
            'orgCode': 'sunbird',
            'theme': null,
            'id': 'ORG_001',
            'communityId': null,
            'isApproved': null,
            'slug': 'sunbird',
            'identifier': 'ORG_001',
            'thumbnail': null,
            'orgName': 'Sunbird',
            'updatedBy': 'user1',
            'externalId': null,
            'isRootOrg': true,
            'rootOrgId': null,
            'approvedDate': null,
            'imgUrl': null,
            'homeUrl': null,
            'isDefault': null,
            'contactDetail':
                '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'},{\'phone\':\'+91213124234234\',\'email\':\'test1@test.com\'}]',
            'createdDate': null,
            'createdBy': null,
            'parentOrgId': null,
            'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'noOfMembers': 1,
            'status': null
        },
        'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'profileSummary': 'asdd',
        'tcUpdatedDate': null,
        'avatar': 'https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png',
        'userName': 'ntptest102',
        'rootOrgId': 'ORG_001',
        'userid': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'emailVerified': null,
        'firstName': 'Cretation',
        'lastLoginTime': 1519809987692,
        'createdDate': '2017-10-31 10:47:04:723+0000',
        'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45'
    },
};
