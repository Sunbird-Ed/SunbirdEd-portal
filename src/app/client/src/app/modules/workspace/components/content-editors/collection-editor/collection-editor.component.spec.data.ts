export const mockRes = {
    successResult: {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2018-04-10T13:02:45.415Z',
        'params': {
            'resmsgid': '76311b70-3cbf-11e8-8758-7f5b4fe67033',
            'msgid': '762582b0-3cbf-11e8-bfb0-2527c99bf99d',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'identifier': 'do_21247940906829414411032',
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'mimeType': 'application/vnd.ekstep.content-collection',
                'languageCode': 'en',
                'status': 'Review'
            }
        }
    },
    errorResult: {
        'responseCode': 'OK',
        'result': {
            'content': {
                'identifier': 'do_21247940906829414411032',
                'createdBy': '68777b59-b28b-4aee-88d6-50d46e4c3509',
                'mimeType': 'application/vnd.ekstep.content-collections',
                'languageCode': 'en',
                'status': 'listed'
            }
        }
    },
    resourceBundle: {
        'messages': {
            'emsg': {
                'm0004': 'Cannot preview now.Try again later'
            }
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
        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'emailVerified': null,
        'firstName': 'Cretation',
        'lastLoginTime': 1519809987692,
        'createdDate': '2017-10-31 10:47:04:723+0000',
        'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45'
    },
    validateModal: {
        state: ['upForReview',
            'review',
            'published',
            'flagged',
            'limitedPublish'],
        status: ['Review', 'Draft', 'Live', 'Flagged', 'Unlisted'],
        mimeType: 'application/vnd.ekstep.content-collection'
    },
    tenantMockData: {
        'id': 'api.tenant.info',
        'ver': '1.0',
        'ts': '2018-04-10 15:34:45:875+0530',
        'params': {
            'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
            'msgid': null,
            'status': 'successful',
            'err': '',
            'errmsg': ''
        },
        'responseCode': 'OK',
        'result': {
            'titleName': 'Sunbird',
            'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'favicon': 'http://localhost:3000/assets/images/favicon.ico',
            'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'
        }
    }
};
