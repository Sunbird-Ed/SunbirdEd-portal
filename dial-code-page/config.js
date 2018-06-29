const version = '1.7.1';
const pid = 'sunbird-portal';

module.exports = {
  'development': {
    'hostURL': 'https://dev.open-sunbird.org',
    'telemetry': {
      'pdata': {
        id: 'dev.sunbird.portal',
        ver: version,
        pid: pid
      }
    }
  },
  'staging': {
    'hostURL': 'https://staging.ntp.net.in',
    'telemetry': {
      'pdata': {
        id: 'staging.diksha.portal',
        ver: version,
        pid: pid
      }
    }
  },
  'production': {
    'hostURL': 'https://diksha.gov.in',
    'telemetry': {
      'pdata': {
        id: 'prod.diksha.portal',
        ver: version,
        pid: pid
      }
    }
  }
}