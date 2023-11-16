export const mockData = {
  managedUserList: {
    'id': 'api.user.search',
    'ver': 'v1',
    'ts': '2020-05-27 04:18:41:911+0000',
    'responseCode': 'OK',
    'result': {
      'response': {
        'count': 1,
        'content': [{
          'roles': ['PUBLIC'],
          'firstName': 'firstName',
          'managedBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
          'id': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2'
        }]
      }
    }
  },
  createManagedUserList: {
    'id': '', 'ver': 'v4', 'ts': '2020-06-03 09:56:20:964+0000', 'params':
      {
        'resmsgid': null, 'msgid': '86461789-0856-45f2-2ef4-e1bc18ad89b4', 'err': null,
        'status': 'success', 'errmsg': null
      }, 'responseCode': 'OK', 'result': {'response': 'SUCCESS', 'userId': '0008ccab-2103-46c9-adba-6cdf84d37f06'}
  },
  userProfile: {
    'userId': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
    'lastName': null,
    'tcStatus': null,
    'maskedPhone': null,
    'rootOrgName': 'CustROOTOrg10',
    'roles': [
      'PUBLIC'
    ],
    'channel': 'custchannel',
    'updatedDate': null,
    'prevUsedPhone': '',
    'stateValidated': false,
    'isDeleted': false,
    'organisations': [
      {
        'updatedBy': null,
        'organisationId': '01285019302823526477',
        'orgName': 'CustROOTOrg10',
        'addedByName': null,
        'addedBy': null,
        'roles': [
          'PUBLIC'
        ],
        'approvedBy': null,
        'updatedDate': null,
        'userId': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
        'approvaldate': null,
        'isDeleted': false,
        'parentOrgId': null,
        'hashTagId': '01285019302823526477',
        'isRejected': null,
        'position': null,
        'id': '01302569853059072057',
        'orgjoindate': '2020-05-21 08:49:17:549+0000',
        'isApproved': null,
        'orgLeftDate': null
      }
    ],
    'managedBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
    'provider': null,
    'flagsValue': 0,
    'maskedEmail': null,
    'id': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
    'tempPassword': null,
    'recoveryEmail': '',
    'email': '',
    'identifier': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
    'thumbnail': null,
    'updatedBy': null,
    'accesscode': null,
    'profileSummary': null,
    'phoneVerified': false,
    'tcUpdatedDate': null,
    'locationIds': [],
    'registryId': null,
    'recoveryPhone': '',
    'userName': '9885632_y6nj',
    'rootOrgId': '01285019302823526477',
    'prevUsedEmail': '',
    'firstName': '9885632',
    'lastLoginTime': null,
    'emailVerified': false,
    'tncAcceptedOn': '2020-05-21T08:49:18.211Z',
    'framework': {},
    'createdDate': '2020-05-21 08:49:14:762+0000',
    'phone': '',
    'createdBy': null,
    'currentLoginTime': null,
    'userType': 'OTHER',
    'tncAcceptedVersion': 'v1',
    'status': 1
  },
  userList: [{
    'roles': ['PUBLIC'],
    'firstName': 'firstName',
    'title': 'firstName',
    'initial': 'f',
    'selected': false,
    'managedBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
    'id': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2'
  }],
  apiErrorResponse: {
    'ver': '1.0',
    'ts': '2018-04-10 15:34:45:875+0530',
    'params': {
      'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
      'msgid': null,
      'status': 'failed'
    },
    'responseCode': 'CLIENT_ERROR'
  },
  selectedUser: {
    'roles': ['PUBLIC'],
    'firstName': 'firstName',
    'title': 'firstName',
    'initial': 'f',
    'selected': true,
    'managedBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
    'id': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
    'identifier': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2'
  },
  userReadApiResponse: {
    'id': 'api.user.read',
    'responseCode': 'OK',
    'result': {
      'response': {
        'lastName': 'User',
        'webPages': [
          {
            'type': 'fb',
            'url': 'https://www.facebook.com/gjh'
          }
        ],
        'tcStatus': null,
        'loginId': 'ntptest102',
        'education': [],
        'gender': 'female',
        'regOrgId': '0123653943740170242',
        'subject': [
          'Gujarati',
          'Kannada'
        ],
        'roles': [
          'public'
        ],
        'language': [
          'Bengali'
        ],
        'updatedDate': '2018-02-21 08:54:46:436+0000',
        'isDeleted': null,
        'organisations': [
          {
            'organisationId': '0123653943740170242',
            'updatedBy': null,
            'addedByName': null,
            'addedBy': null,
            'roles': [
              'CONTENT_CREATION',
              'PUBLIC'
            ],
            'approvedBy': null,
            'updatedDate': null,
            'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
            'approvaldate': null,
            'isDeleted': false,
            'isRejected': null,
            'id': '01236539426110668816',
            'position': 'ASD',
            'isApproved': null,
            'orgjoindate': '2017-10-31 10:47:04:732+0000',
            'orgLeftDate': null
          }
        ],
        'provider': null,
        'countryCode': null,
        'id': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'tempPassword': null,
        'email': 'us********@testss.com',
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
            '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'}]',
          'createdDate': null,
          'createdBy': null,
          'parentOrgId': null,
          'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
          'noOfMembers': 1,
          'status': null
        },
        'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'profileVisibility': {
          'skills': 'private',
          'address': 'private',
          'profileSummary': 'private'
        },
        'thumbnail': null,
        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'address': [],
        'profileSummary': 'asdd',
        'tcUpdatedDate': null,
        'userName': 'ntp',
        'rootOrgId': 'ORG_001',
        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'emailVerified': null,
        'firstName': 'Cretation',
        'lastLoginTime': 1519809987692,
        'createdDate': '2017-10-31 10:47:04:723+0000',
        'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45',
        'phone': '******4412',
        'dob': null,
        'registeredOrg': {
          'dateTime': null,
          'preferredLanguage': null,
          'approvedBy': null,
          'channel': null,
          'description': null,
          'updatedDate': '2017-11-17 09:00:59:342+0000',
          'addressId': null,
          'orgType': null,
          'provider': null,
          'orgCode': null,
          'locationId': '0123668622585610242',
          'theme': null,
          'id': '0123653943740170242',
          'communityId': null,
          'isApproved': null,
          'slug': null,
          'identifier': '0123653943740170242',
          'thumbnail': null,
          'orgName': 'QA ORG',
          'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
          'externalId': null,
          'isRootOrg': false,
          'rootOrgId': 'ORG_001',
          'approvedDate': null,
          'imgUrl': null,
          'homeUrl': null,
          'orgTypeId': null,
          'isDefault': null,
          'contactDetail': [],
          'createdDate': '2017-10-31 10:43:48:600+0000',
          'createdBy': null,
          'parentOrgId': null,
          'hashTagId': '0123653943740170242',
          'noOfMembers': null,
          'status': 1
        },
        'grade': [
          'Grade 2'
        ],
        'status': 1
      }
    }
  },
  LogoutInteractEdata: {
    id: 'logout',
    type: 'click',
    pageid: 'resources'
  },
  telemetryEventClassic: {
    context: {env: 'main-header', cdata: []},
    edata: {id: 'switch-theme', type: 'click', pageid: '/', subtype: 'classic'}
  },
  telemetryEventJoy: {
    context: {env: 'main-header', cdata: []},
    edata: {id: 'switch-theme', type: 'click', pageid: '/', subtype: 'joy'}
  },
  categoryData: {
    'tn_k-12_5': {
      teacher: [{
        name: 'observation',
        icon: {
          web: 'assets/images/mask-image/observation.png'
        }
      }]
    }
  },
  formData: [
    {
      'index': 0,
      'title': 'frmelmnts.tab.courses',
      'desc': 'frmelmnts.tab.courses',
      'menuType': 'Content',
      'contentType': 'course',
      'isEnabled': true,
      'isDefault': true,
      'default': true,
      'goToBasePath' : 'http://sunbird.com',
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': ''
      },
      'search': {
        'facets': ['topic', 'purpose', 'medium', 'gradeLevel', 'subject', 'channel'],
        'fields': [],
        'filters': {
          'contentType': [
            'Course'
          ]
        }
      },
      'anonumousUserRoute': {
        'route': '/explore-course',
        'queryParam': 'course'
      },
      'loggedInUserRoute': {
        'route': '/learn',
        'queryParam': 'course'
      },
      'limit': 20,
    },
    {
      'index': 0,
      'title': 'frmelmnts.lbl.desktop.mylibrary',
      'desc': 'frmelmnts.lbl.desktop.mylibrary',
      'menuType': 'Content',
      'contentType': 'mydownloads',
      'isEnabled': true,
      'isDesktopOnly': true,
      'isOnlineOnly': false,
      'theme': {
          'baseColor': '',
          'textColor': '',
          'supportingColor': '',
          'className': 'myDownloads',
          'imageName': 'textbooks-banner-img.svg'
      },
      'anonumousUserRoute': {
          'route': '/mydownloads',
          'queryParam': 'mydownloads'
      },
      'loggedInUserRoute': {
          'route': '/mydownloads',
          'queryParam': 'mydownloads'
      },
      'search': {
          'facets': [
              'board',
              'gradeLevel',
              'subject',
              'medium',
              'primaryCategory',
              'mimeType',
              'publisher',
              'audience'
          ],
          'fields': [
              'name',
              'appIcon',
              'mimeType',
              'gradeLevel',
              'identifier',
              'medium',
              'pkgVersion',
              'board',
              'subject',
              'resourceType',
              'primaryCategory',
              'contentType',
              'channel',
              'organisation',
              'trackable',
              'audience'
          ],
          'filters': {
              'primaryCategory': [
                  'Collection',
                  'Resource',
                  'Content Playlist'
              ]
          }
      }
    },
    {
      'index': 1,
      'title': 'frmelmnts.lbl.textbooks',
      'desc': 'frmelmnts.lbl.textbooks',
      'menuType': 'Content',
      'contentType': 'textbook',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': ''
      },
      'search': {
        'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType', 'concepts'],
        'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier', 'medium',
          'pkgVersion', 'board',
          'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
        'filters': {
          'contentType': [
            'TextBook'
          ]
        }
      },
      'anonumousUserRoute': {
        'route': '/explore',
        'queryParam': 'textbook'
      },
      'loggedInUserRoute': {
        'route': '/resources',
        'queryParam': 'textbook'
      },
      'limit': 100,
    },
    {
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
        'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier',
          'medium', 'pkgVersion', 'board', 'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
        'filters': {
          'contentType': [
            'Collection', 'TextBook', 'LessonPlan', 'Resource', 'SelfAssess', 'PracticeResource', 'LearningOutcomeDefinition', 'ExplanationResource', 'CurriculumCourse', 'Course'
          ]
        }
      },
      'limit': 100
    }
  ]
};
