export const testData = {
  verifyOtpSuccess: {
    'id': 'api.otp.verify',
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
  verifyOtpError: {
    'id': 'api.otp.verify',
    'ver': 'v1',
    'ts': '2019-01-09 07:22:37:193+0000',
    'error': {
      'params': {
        'resmsgid': null,
        'msgid': 'afb0eefe-a484-4a07-89e0-a1d87ce5904d',
        'err': 'ERROR_INVALID_OTP',
        'status': 'ERROR_INVALID_OTP',
        'errmsg': 'Invalid OTP.'
      }
    },
    'responseCode': 'CLIENT_ERROR',
    'result': {}
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
  resendOtpError: {
    'id': 'api.otp.generate',
    'ver': 'v1',
    'ts': '2019-01-09 07:22:37:193+0000',
    'params': {
      'resmsgid': null,
      'msgid': 'afb0eefe-a484-4a07-89e0-a1d87ce5904d',
      'err': 'ERROR_INVALID_REQUEST',
      'status': 'ERROR_INVALID_REQUEST',
      'errmsg': 'Invalid Request.'
    },
    'responseCode': 'CLIENT_ERROR',
    'result': {}
  },
  resourceBundle: {
    'messages': {
      'fmsg': {
        'm0051': 'There is some technical error',
      }
    },
    'frmelmnts': {
      'lbl': {
        'resentOTP': 'OTP resent'
      }
    }
  }
};
