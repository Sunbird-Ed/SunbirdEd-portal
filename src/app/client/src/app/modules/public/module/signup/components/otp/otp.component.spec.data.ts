export const OtpComponentMockResponse = {
    signupData: {
        'controls': {
            'contactType': {
                'value': 'phone'
            }
        }
    },
    resourceBundle: {
        'frmelmnts': {
            'lbl': {
                'unableToVerifyPhone': 'Unable to verify Phone Number?',
                'createUserSuccessWithPhone': 'Your Phone Number has been verified. Sign in to continue.'
            },
            'instn': {
                't0081': `Thank you for signing up on {instance}. We have sent an sms OTP for verification.
                 Verify your phone number with the OTP to complete the registration process.`
            }
        },
        'messages': {
            'fmsg': {
                'm0085': 'There was a technical error. Try again.'
            }
        }
    },
    otpForm: {
        'controls': {
            'otp': {
                'value': '45789'
            }
        }
    },
    verifyOtpErrorResponse: {
        'headers': {
            'normalizedNames': {},
            'lazyUpdate': null
        },
        'status': 400,
        'statusText': 'Bad Request',
        'url': 'http://localhost:3000/learner/otp/v1/verify',
        'ok': false,
        'name': 'HttpErrorResponse',
        'message': 'Http failure response for http://localhost:3000/learner/otp/v1/verify: 400 Bad Request',
        'error': {
            'id': 'api.otp.verify',
            'ver': 'v1',
            'ts': '2019-06-21 09:02:32:745+0000',
            'params': {
                'resmsgid': null,
                'msgid': 'bd9357ee-9e5c-66c2-8075-8c21365466ad',
                'err': 'ERROR_INVALID_OTP',
                'status': 'ERROR_INVALID_OTP',
                'errmsg': 'Invalid OTP.'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
        }
    },
    verifyOtpSuccessResponse: {
        'id': 'api.otp.verify',
        'ver': 'v1',
        'ts': '2019-06-21 09:02:32:745+0000',
        'params': {
            'resmsgid': '0ea98baa-5a9e-49fd-a568-7967bc1e0ab8',
            'msgid': null,
            'err': null,
            'status': 'successful',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {}
    },

    generateOtpSuccessResponse: {
        'id': 'api.otp.generate',
        'ver': 'v1',
        'ts': '2019-06-21 10:00:38:172+0000',
        'params': {
            'resmsgid': null,
            'msgid': '64371ad2-572d-8225-b94f-03b823e542f9',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS'
        }
    },

    createUserSuccessResponse: {
        'id': 'api.user.create',
        'ver': 'v2',
        'ts': '2019-06-21 11:28:11:602+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'a1294b2b-85d8-f783-ad4c-95ef497fd521',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'userId': '0e54e75e-acfc-46e8-876f-3d5894857154',
            'errors': []
        }
    },
    createUserErrorResponse: {
        'headers': {
            'normalizedNames': {},
            'lazyUpdate': null
        },
        'status': 400,
        'statusText': 'Bad Request',
        'url': 'http://localhost:3000/learner/otp/v1/create',
        'ok': false,
        'name': 'HttpErrorResponse',
        'message': 'Http failure response for http://localhost:3000/learner/otp/v1/create: 400 Bad Request',
        'error': {
            'id': 'api.otp.create',
            'ver': 'v1',
            'ts': '2019-06-21 09:02:32:745+0000',
            'params': {
                'resmsgid': null,
                'msgid': 'bd9357ee-9e5c-66c2-8075-8c21365466ad',
                'err': 'ERROR_INVALID_OTP',
                'status': 'ERROR_INVALID_OTP',
                'errmsg': 'Invalid OTP.'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
        }
    }
};
