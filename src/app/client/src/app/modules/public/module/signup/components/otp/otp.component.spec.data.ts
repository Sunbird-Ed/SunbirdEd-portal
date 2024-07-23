export const OtpComponentMockResponse = {
  data : {
    'firstName': 'test',
    'password': 'Test@123',
    'email': 'otptest10@yopmail.com',
    'emailVerified': true,
    'validator': `{
      \"iv\":\"c541833780a389a6f01b65c192e207c3\",
      \"encryptedData\":
      \"c3eaeb67799ebc684ea2a696ab9916fe8f3de4f0
      833c4ccd5173c32a9a60d6bc2f47fe7c5741c9b2280
      5bb5562d1fc9f0af2c6b254788c4672758aebbce09db9\"
    }`
},
  signupData: {
    'controls': {
      'contactType': {
        'value': 'phone'
      },
      name: {
        value: 'firstName'
      },
      password: {
        value: 'password'
      },
      email: {
        value: 'email@gmail.com'
      },
      tncAccepted: {
        value: true,
        status: 'VALID'
      }

    }
  },
  telemetryCreateUserError: {
    context: {
      env: 'self-signup'
    },
    edata: {
      type: 'sign-up',
      level: 'ERROR',
      message: 'sign-up failed'
    }
  },
  telemetryCreateUserSuccess: {
    context: {
      env: 'self-signup'
    },
    edata: {
      type: 'sign-up',
      level: 'SUCCESS',
      message: 'sign-up success'
    }
  },
  telemetryTncError: {
    context: {
      env: 'self-signup'
    },
    edata: {
      type: 'accept-tnc',
      level: 'ERROR',
      message: 'accept-tnc failed'
    }
  },
  telemetryTncSuccess: {
    context: {
      env: 'self-signup'
    },
    edata: {
      type: 'accept-tnc',
      level: 'SUCCESS',
      message: 'accept-tnc success'
    }
  },
  tncAcceptResponse: {
    id: 'api.user.tnc.accept',
    params: {
      err: null,
      status: 'success',
      errType: null
    },
    responseCode: 'OK',
    result: {response: 'Success'}
  },
    resourceBundle: {
        'frmelmnts': {
            'lbl': {
                'unableToVerifyPhone': 'Unable to verify Phone Number?',
                'unableToVerifyEmail':'Unable to verify email address?',
                'createUserSuccessWithPhone': 'Your Phone Number has been verified. Sign in to continue.',
                'OTPresendMaxretry': 'You can request for an OTP only 4 times. You have to register again',
                'wrongPhoneOTP':'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.'
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
        'url': 'http://localhost:3000/learner/otp/v2/verify',
        'ok': false,
        'name': 'HttpErrorResponse',
        'message': 'Http failure response for http://localhost:3000/learner/otp/v2/verify: 400 Bad Request',
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
            'result': {'remainingAttempt':1}
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
    },
  generateOtpMinor: {
    'request': {
      'key': '9999999999',
      'type': 'phone',
      'templateId': 'wardLoginOTP'
    }
  },
  generateOtp: {
    'request': {
      'key': '9999999999',
      'type': 'phone'
    }
  }
};
