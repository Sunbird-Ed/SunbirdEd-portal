export const mockRes = {
    validfile: [{
        name: 'organizations.csv',
        orgName: 'new org',
        isRootOrg: 'TRUE',
        channel: 'channel110001',
        externalId: 'ugc0001',
        provider: 'technical002',
        description: 'desc',
        homeUrl: 'googlehomeurl',
        orgCode: 'orgcode12345',
        orgType: '',
        preferredLanguage: 'hindi',
        theme: 'goodtheme',
        contactDetail: ''
    }],
    invalidfile: [{
        name: 'users.csv',
        firstName: 'Vaish',
        lastName: 'M',
        phone: '7899918811',
        email: 'vaish@gmail.com',
        userName: 'vaishnavi',
        password: 'vaish',
        provider: '',
        phoneVerified: '',
        emailVerified: ''
    }],
    errorfile: [{
        name: 'test.png'
    }],
    successResponse: {
        'id': 'api.org.upload',
        'ver': 'v1',
        'ts': '2018-03-22 07:24:16:379+0000',
        'params': {
            'resmsgid': null,
            'msgid': '7f0dcd10-4ec1-1595-7651-9a606f3596df',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'processId': '012465801157754880647',
            'response': 'SUCCESS'
        }
    },
    errorResponse: {
        error: {
            'id': 'api.org.upload',
            'ver': 'v1',
            'ts': '2018-03-23 10:05:16:003+0000',
            'params': {
                'resmsgid': null,
                'msgid': '340c2ea1-76e5-d639-0383-81688227f64c',
                'err': 'INVALID_COLUMN_NAME',
                'status': 'INVALID_COLUMN_NAME',
                'errmsg': 'Invalid column: "orgName". Valid columns are: orgName, channel, isRootOrg, provider, externalId, Code.'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {
            }
        }
    },
    resourceBundle: {
        'messages': {
            'stmsg': {
                'm0080': 'Please upload file in csv formate only'
            },
            'smsg': {
                'm0031': 'Organizations uploaded successfully'
            },
            'fmsg': {
                'm0051': 'Something went wrong, please try again later...'
            }
        }
    },
    errorForEmpty: {
        error: {
            'id': 'api.org.upload',
            'ver': 'v1',
            'ts': '2018-03-23 10:05:16:003+0000',
            'params': {
                'resmsgid': null,
                'msgid': '340c2ea1-76e5-d639-0383-81688227f64c',
                'err': 'INVALID_COLUMN_NAME',
                'status': 'INVALID_COLUMN_NAME',
                'errmsg': 'Please provide valid csv file.'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {
            }
        }
    },
    emptyFile: [{
        name: 'users.csv',
    }],
    errorFormultipleLines: {
        error: {
            'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:16:59:649+0000',
        'params': {
            'resmsgid': null,
            'msgid': '55402d80-917f-4f72-9f5b-2e4e7a68ce86',
            'err': 'INVALID_ORGANIZATION_DATA',
            'status': 'INVALID_ORGANIZATION_DATA',
            'errmsg': 'Invalid column: ﻿"firstName". Valid columns are: firstName, lastName, externalIds. Please check.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
        }
    },
    noErrorMessage: {message: 'An invalid response was received from the upstream server'},
    toasterMessage: {
    invalidColumnSingelLine: 'Invalid column: "orgName".<br/>Valid columns are: orgName, channel, isRootOrg, provider, externalId, Code.',
    emptyFiles: 'Please provide valid csv file.',
    invalidColumnMultipleLines: 'Invalid column: ﻿"firstName".<br/>Valid columns are: firstName, lastName, externalIds.<br/>Please check.'}
};
