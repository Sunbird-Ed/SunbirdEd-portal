export const mockSignUpResponse = {
    successResponse: {
        'id': 'api.user.create',
        'ver': 'v1',
        'ts': '2018 - 05 - 02 09: 07: 12: 554 + 0000',
        'params': {
            'resmsgid': null,
            'msgid': 'acda691f - f8c6 - d204 - bbb9 - d0216cfed966',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'accessToken': null,
            'userId': 'ef643cb2 - 1894 - 4fd2-ac45 - e7b67e03d94e'
        }
    },
    failureResponse: {
        'id': 'api.user.create',
        'ver': 'v1',
        'ts': '2018 - 05 - 02 08: 55: 18: 503 + 0000',
        'params': {
            'resmsgid': null,
            'msgid': 'fee56276 - cf8f - 42fa-b3e6 - a0eb7f7f9f91',
            'err': 'PHONE_ALREADY_IN_USE',
            'status': 'PHONE_ALREADY_IN_USE',
            'errmsg': 'Phone already in use.Please provide different phone number.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
    },
    resourceBundle: {
        'messages': {
            'smsg': {
                'm0039': 'Sign up successfully, Please login...'
            }
        }
    }
};
