export const mockRes = {
    successResponse: {
        'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:05:31:230+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'cbda6b44-e60f-e0a1-c7b7-0c4ac6ae607f',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'processId': '01246652828212428826',
            'response': 'SUCCESS'
        }
    },
    errorResponse: {
        'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:16:59:649+0000',
        'params': {
            'resmsgid': null,
            'msgid': '55402d80-917f-4f72-9f5b-2e4e7a68ce86',
            'err': 'INVALID_ORGANIZATION_DATA',
            'status': 'INVALID_ORGANIZATION_DATA',
            'errmsg': `Given Organization Data doesn't exist in our records. Please provide a valid one`
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
    },
    resourceBundle: {
        'messages': {
            'smsg': {
                'm0030': 'Users uploaded successfully'
            },
            'stmsg': {
                'm0080': 'Please upload file in csv formate only'
            },
            'emsg': {
                'm0003': 'You should enter Provider and External Id Or Organization Id'
            },
            'fmsg': {
                'm0051': 'Something went wrong, please try again later...'
            }
        }
    },
    errorUpload: {
        error: {
            'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:16:59:649+0000',
        'params': {
            'resmsgid': null,
            'msgid': '55402d80-917f-4f72-9f5b-2e4e7a68ce86',
            'err': 'INVALID_ORGANIZATION_DATA',
            'status': 'INVALID_ORGANIZATION_DATA',
            'errmsg': 'Invalid column: ﻿"firstName". Valid columns are: firstName, lastName, phone, location,  externalIds.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
        }
    },
    errorForEmpty: {
        error: {
            'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:16:59:649+0000',
        'params': {
            'resmsgid': null,
            'msgid': '55402d80-917f-4f72-9f5b-2e4e7a68ce86',
            'err': 'INVALID_ORGANIZATION_DATA',
            'status': 'INVALID_ORGANIZATION_DATA',
            'errmsg': 'Please provide valid csv file.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
        }
    },
    noErrorMessage: {message: `Something went wrong,\n please try again later...`},
    toasterMessage: {
        invalidColumnSingelLine: `Invalid column: ﻿"firstName". Valid columns are: firstName,\n lastName,\n phone,\n location,\n  externalIds.`,
        emptyFiles: 'Please provide valid csv file.',
        invalidColumnMultipleLines: 'Invalid column: ﻿"firstName".<br/>Valid columns are: firstName, lastName, externalIds.<br/>Please check.'}
};
