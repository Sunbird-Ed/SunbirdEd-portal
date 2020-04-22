export const response = {
  success: {
    'id': 'api.tenant.info',
    'ver': '1.0',
    'ts': '2018-04-10 15:34:45:875+0530',
    'params': {
      'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
      'msgid': null,
      'status': 'successful',
      'err': '',
      'errmsg': ''
    },
    'responseCode': 'OK',
    'result': {
      'titleName': 'Sunbird',
      'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
      'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
      'favicon': 'http://localhost:3000/assets/images/favicon.ico',
      'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'
    }
  },
  default: {
    'titleName': 'Sunbird',
    'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
    'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
    'favicon': 'http://localhost:3000/assets/images/favicon.ico',
    'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'

  },
  failure: {
    'id': 'api.tenant.info',
    'ver': '1.0',
    'ts': '2018-04-10 15:34:45:875+0530',
    'params': {
      'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
      'msgid': null,
      'status': 'failed'
    },
    'responseCode': 'CLIENT_ERROR'
  },
  tenantConfigInvalid: {
    'id': 'api.system.settings.get.tn',
    'ver': 'v1',
    'ts': '2020-04-16 13:27:29:548+0000',
    'params': {
      'resmsgid': null,
      'msgid': null,
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {}
  },
  tenantConfigValid: {
    'id': 'api.system.settings.get.tn',
    'ver': 'v1',
    'ts': '2020-04-16 13:27:29:548+0000',
    'params': {
      'resmsgid': null,
      'msgid': null,
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'id': 'tn',
        'field': 'tn',
        'value': '{\"helpCenterLink\":\"help/getting-started/explore-sunbird/index.html\",\"helpdeskEmail\":\"support-ka@abc.com\",' +
        '\"playstoreLink\":\"https://play.google.com/store/apps/details?id=in.sunbird.app&referrer=utm_content=' +
        'https://sunbird.in/explore-course?channel=sb&role=other\"}'
      }
    }
  },
  defaultTenant: 'sunbird'
};
