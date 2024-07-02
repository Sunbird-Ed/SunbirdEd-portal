export const mockResponse = {
  userMockData: {
    'userRoles': [
      'PUBLIC',
      'BOOK_CREATOR',
      'COURSE_MENTOR',
      'FLAG_REVIEWER',
      'CONTENT_CREATOR',
      'TEACHER_BADGE_ISSUER'
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
    'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45',
    'email': 'abcd@test.com'
  },
  userMockData1: {
    'userRoles': [
      'PUBLIC',
      'BOOK_CREATOR',
      'COURSE_MENTOR',
      'FLAG_REVIEWER',
      'CONTENT_CREATOR',
      'TEACHER_BADGE_ISSUER'
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
    'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45',
    'phone': '1234567890'
  },
  resendOtpSuccess: {
    'id': 'api.otp.generate',
    'ver': 'v1',
    'ts': '2019-01-09 06:59:19:838+0000',
    'params': {
      'resmsgid': null,
      'msgid': null,
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': 'SUCCESS'
    }
  },
  resendPhoneOtpError: {
    'id': 'api.otp.generate',
    'ver': 'v1',
    'ts': '2019-01-09 07:22:37:193+0000',
    'error': {
      'params': {
        'resmsgid': null,
        'msgid': 'afb0eefe-a484-4a07-89e0-a1d87ce5904d',
        'err': 'ERROR_INVALID_REQUEST',
        'status': 'PHONE_ALREADY_IN_USE',
        'errmsg': 'Invalid emailAddress or phone number.'
      },
    },
    'responseCode': 'CLIENT_ERROR',
    'result': {}
  },
  resendEmailOtpError: {
    'id': 'api.otp.generate',
    'ver': 'v1',
    'ts': '2019-01-09 07:22:37:193+0000',
    'error': {
      'params': {
        'resmsgid': null,
        'msgid': 'afb0eefe-a484-4a07-89e0-a1d87ce5904d',
        'err': 'ERROR_INVALID_REQUEST',
        'status': 'EMAIL_IN_USE',
        'errmsg': 'Invalid emailAddress or phone number.'
      },
    },
    'responseCode': 'CLIENT_ERROR',
    'result': {}
  },
  resendOtpError: {
    'id': 'api.otp.generate',
    'ver': 'v1',
    'ts': '2019-01-09 07:22:37:193+0000',
    'error': {
      'params': {
        'resmsgid': null,
        'msgid': 'afb0eefe-a484-4a07-89e0-a1d87ce5904d',
        'err': 'ERROR_INVALID_REQUEST',
        'status': 'ERROR',
        'errmsg': 'Invalid emailAddress or phone number.'
      },
    },
    'responseCode': 'CLIENT_ERROR',
    'result': {}
  },
}