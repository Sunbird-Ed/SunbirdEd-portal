export const mockUserData = {
    userFeedData:{
        'data': {
            'prospectChannels': [
                'TN',
                'RJ',
                'AP'
            ],
            'order': 1
        }
    },
    feedSuccessResponse: {
        'id': null,
        'ver': null,
        'ts': null,
        'params': null,
        'responseCode': 'OK',
        'result': {
            'response': {
                'userFeed': [
                    {
                        'expireOn': 1574611273492,
                        'data': {
                            'prospectChannels': [
                                'TN',
                                'RJ',
                                'AP'
                            ],
                            'order': 1
                        },
                        'createdBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
                        'closable': false,
                        'channel': 'TN',
                        'feedAction': 'unRead',
                        'id': '01289921810742476874',
                        'category': 'orgMigrationAction',
                        'priority': 1,
                        'userId': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
                        'createdOn': 1574611273492
                    }
                ]
            }
        }
    },
    migrateErrorResponseWithAttemptCount: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:02:21:599+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'invalidUserExternalId',
        'result': {
            'maxAttempt': 2,
            'remainingAttempt': 2,
            'error': true,
            'message': 'provided ext user id bt240 is incorrect'
        }
    },
    migrateErrorResponseWithNoAttemptCount: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:02:21:599+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'invalidUserExternalId',
        'result': {
            'maxAttempt': 2,
            'remainingAttempt': 0,
            'error': true,
            'message': 'provided ext user id bt240 is incorrect'
        }
    },
    migrateSuccessResponse: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:02:28:841+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'errors': []
        }
    },
    migrateErrorResponse: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:01:13:308+0530',
        'error': {
            'params': {
                'resmsgid': null,
                'msgid': null,
                'err': 'USER_MIGRATION_FAILED',
                'status': 'USER_MIGRATION_FAILED',
                'errmsg': 'user is failed to migrate'
            }
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    migrateErrorResponsewithothererror: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:01:13:308+0530',
        'error': {
            'params': {
                'resmsgid': null,
                'msgid': null,
                'err': 'USER_MIGRATION_CANNOT_BE_DONE',
                'status': 'USER_MIGRATION_CANNOT_BE_DONE',
                'errmsg': 'user is failed to migrate'
            }
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    formReadResponse: {
        'id': 'api.form.read',
        'params': {
            'resmsgid': '4e825699-1471-4353-ad83-1805946a57c5',
            'msgid': 'cae4c242-369e-498a-a496-84bd99d2f4fe',
            'status': 'successful'
        },
        'responseCode': 'OK',
        'result': {
            'form': {
                'type': 'user',
                'subtype': 'externalidverification',
                'action': 'onboarding',
                'component': '*',
                'framework': '*',
                'data': {
                    'templateName': 'defaultTemplate',
                    'action': 'onboarding',
                    'fields': [
                        {
                            'code': 'externalIdVerificationLabels',
                            'name': 'externalIdVerification',
                            'range': [
                                {
                                    'headerLabel': 'Are you a government school teacher ?',
                                    'fieldLabel': 'Enter your teacher ID for verification',
                                    'incorrectIDLabel': 'The ID entered is incorrect. Enter the ID again',
                                    'verficationFailureLabel': 'Could not verify teacher profile as the ID entered is incorrect',
                                    'verificationSuccessfulLabel': 'Techer profile verified successfully'
                                }
                            ]
                        }
                    ]
                },
                'created_on': '2019-12-04T13:08:45.998Z',
                'last_modified_on': null,
                'rootOrgId': '*'
            }
        },
        'ts': '2019-12-05T11:14:35.561Z',
        'ver': '1.0'
    }
};
