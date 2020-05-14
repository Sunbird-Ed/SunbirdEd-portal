export const SignUpComponentMockData = {
  tncConfig: {
    'id': 'api',
    'params': {
      'status': 'success',
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'id': 'tncConfig',
        'field': 'tncConfig',
        'value': '{"latestVersion":"v4","v4":{"url":"http://test.com/tnc.html"}}'
      }
    }
  },
  tncConfigIncorrectData: {
    'id': 'api',
    'params': {
      'status': 'success',
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'id': 'tncConfig',
        'field': 'tncConfig',
        'value': '{"latestVersion":"v4","v4":{"url":}}'
      }
    }
  },
  interactEDataUnSelected: {
    context: {
      env: 'self-signup',
      cdata: [
        {id: 'user:tnc:accept', type: 'Feature'},
        {id: 'SB-16663', type: 'Task'}
      ]
    },
    edata: {
      id: 'user:tnc:accept',
      type: 'click',
      subtype: 'unselected',
      pageid: 'self-signup'
    }
  },
  interactEDataSelected: {
    context: {
      env: 'self-signup',
      cdata: [
        {id: 'user:tnc:accept', type: 'Feature'},
        {id: 'SB-16663', type: 'Task'}
      ]
    },
    edata: {
      id: 'user:tnc:accept',
      type: 'click',
      subtype: 'selected',
      pageid: 'self-signup'
    }
  },
  telemetryLogError: {
    context: {
      env: 'self-signup'
    },
    edata: {
      type: 'fetch-terms-condition',
      level: 'ERROR',
      message: 'fetch-terms-condition failed'
    }
  },
  telemetryLogSuccess: {
    context: {
      env: 'self-signup'
    },
    edata: {
      type: 'fetch-terms-condition',
      level: 'SUCCESS',
      message: 'fetch-terms-condition success'
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
