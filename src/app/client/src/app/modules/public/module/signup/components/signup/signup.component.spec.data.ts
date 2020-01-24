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
  }
};
