export const serverRes = {
    app_update: {
        'id': 'api.desktop.update',
        'ver': '1.0',
        'ts': '2019-10-25T11:57:22.838Z',
        'params': {
          'resmsgid': '15c43971-efb2-4675-8d89-9249b8a2c713',
          'msgid': 'e14f2638-d1af-486f-baec-f502cfa44089',
          'status': 'successful',
          'err': null,
          'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
          'updateAvailable': true,
          'url': 'https://dev.sunbirded.org/desktop/latest/artifactUrl/dev.0.0_64bit.dmg'
        }
    },
    error: {
            'error': {
              'id': 'api.desktop.update',
              'ver': '1.0',
              'ts': '2019-10-25T09:39:51.560Z',
              'params': {
                'resmsgid': '9652a082-9677-4ccf-91e9-f138fd80c410',
                'msgid': 'c246387b-a3a6-4a98-b150-73b1bbab7665',
                'status': 'failed',
                'err': 'ERR_INTERNAL_SERVER_ERROR',
                'errmsg': 'Error while processing the request'
              },
              'responseCode': 'INTERNAL_SERVER_ERROR',
              'result': {}
            }
        },
    appInfoSuccess: {
      'id': 'api.app.info',
      'ver': '1.0',
      'ts': '2019-12-17T08:43:46.117Z',
      'params': {
        'resmsgid': '522beb8d-1c1c-4324-9eb3-6c95a8ed0d6b',
        'msgid': 'bef374a8-59b3-4b93-b31a-691a913231bf',
        'status': 'successful',
        'err': null,
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'termsOfUseUrl': 'http://localhost:4000/abc.html',
        'version': '1.0.2',
        'releaseDate': '',
        'deviceId': 'did1234456',
        'languages': 'English, Hindi',
        'updateInfo': {
          'updateAvailable': true,
          'url': 'http://localhost:3000/app/v1/pdf',
          'version': '1.0.3'
        }
      }
    },
    appInfoFailureCase: {
        'id': 'api.app.info',
        'ver': '1.0',
        'ts': '2019-12-17T08:43:46.117Z',
        'params': {
          'resmsgid': '522beb8d-1c1c-4324-9eb3-6c95a8ed0d6b',
          'msgid': 'bef374a8-59b3-4b93-b31a-691a913231bf',
          'status': 'successful',
          'err': null,
          'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
          'termsOfUseUrl': 'http://localhost:4000/abc.html',
          'version': '1.0.2',
          'releaseDate': '',
          'deviceId': 'did1234456',
          'languages': 'English, Hindi'
        }
    }
};
