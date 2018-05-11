export const mockProfileHeaderData = {
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
    profileResult: {
        'id': 'api.user.update',
        'ver': 'v1',
        'ts': '2018-04-18 08:06:51:626+0000',
        'params': {
            'resmsgid': null,
            'msgid': '093f2a76-fba1-338f-65c7-8a1e234a477a',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': { 'response': 'SUCCESS' }
    },
    profileErr: {
        'id': 'api.user.update',
        'ver': 'v1',
        'ts': '2018-04-18 08:06:51:626+0000',
        'params': {
            'resmsgid': null,
            'msgid': '093f2a76-fba1-338f-65c7-8a1e234a477a',
            'err': 'INVALID_DATA',
            'status': 'INVALID_DATA',
            'errmsg': null
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    resourceBundle: {
        'messages': {
            'imsg': {
                'm0005': 'Please upload a valid image file. Supported file types: jpeg, jpg, png. Max size: 4MB.'
            },
            'smsg': {
                'm0018': 'Profile Image updated successfully'
            }
        }
    }
};
