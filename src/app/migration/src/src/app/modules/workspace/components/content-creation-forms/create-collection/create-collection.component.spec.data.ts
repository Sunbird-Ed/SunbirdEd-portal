export const mockRes = {
    createCollectionData: {
        'id': 'api.content.create',
        'ver': '1.0',
        'ts': '2018-03-29T10:59:03.398Z',
        'params': {
           'resmsgid': '315e3060-3340-11e8-b827-71ac9e68d601',
           'msgid': '31522270-3340-11e8-a6e1-b781c42eeb65',
           'status': 'successful',
           'err': null,
           'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
           'content_id': 'do_2124708548063559681134',
           'versionKey': '1522321143354'
        }
     },
     errResponseData: {
            'id': 'api.content.create',
            'ver': '1.0',
            'ts': '2018-03-29T11:55:33.387Z',
            'params': {
               'resmsgid': '15f575b0-3348-11e8-8790-a9a884632bdf',
               'msgid': null,
               'status': 'failed',
               'err': 'ERR_CONTENT_CREATE_FIELDS_MISSING',
               'errmsg': 'Required fields for create content are missing'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {

            }
     },
    requestBody: {
        content: {
            'mimeType': 'application/vnd.ekstep.content-collection',
            'contentType': 'Collection',
            'createdBy': '68777b59-b28b-4aee-88d6-50d46e4c3509',
            'createdFor': ['01232002070124134414', '012315809814749184151'],
            'creator': 'BOSS Name',
            'name': 'Untitled collection',
            'organization': [],
            'organisationIds': ['01232002070124134414', '012315809814749184151'],
            'userRoles': ['public', 'CONTENT_REVIEWER', 'PUBLIC', 'CONTENT_CREATOR']
        }
    },
    errBody: {
        content: {
            'mimeType': 'application/vnd.ekstep.content-collection',
            'contentType': '',
            'createdBy': '68777b59-b28b-4aee-88d6-50d46e4c3509',
            'createdFor': ['01232002070124134414', '012315809814749184151'],
            'creator': '',
            'name': 'Untitled collection',
            'organization': [],
            'organisationIds': ['01232002070124134414', '012315809814749184151'],
            'userRoles': ['public', 'CONTENT_REVIEWER', 'PUBLIC', 'CONTENT_CREATOR']
        }
    },
    resourceBundle: {
        'messages': {
          'fmsg': {
              'm0010': 'Something went wrong, please try in some time...'
          }
      }
      },
 userMockData : {

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
        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'emailVerified': null,
        'firstName': 'Cretation',
        'lastLoginTime': 1519809987692,
        'createdDate': '2017-10-31 10:47:04:723+0000',
        'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45'
        }
};
