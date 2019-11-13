export const response = {
    downloadListStatus: {

            'id': 'api.content.download.list',
            'ver': '1.0',
            'ts': '2019-06-26T12:17:22.217Z',
            'params': {
               'resmsgid': 'd1c668cf-4aa4-413c-b62f-6f41a99ab0e2',
               'msgid': 'e712a76e-6d4c-4190-b5ec-cb5aa882e4a6',
               'status': 'successful',
               'err': null,
               'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
               'response': {
                  'downloads': {
                     'submitted': [

                     ],
                     'inprogress': [

                     ],
                     'failed': [

                     ],
                     'completed': [

                     ]
                  }
               }
            }
      },

      downloadSuccess: {

            'id': 'api.content.download',
            'ver': '1.0',
            'ts': '2019-06-26T12:48:40.459Z',
            'params': {
               'resmsgid': 'bc7bc38f-c20d-4017-8b3d-d2d96cb9276d',
               'msgid': 'd4c81b77-660f-4c37-a463-ce8497f90b31',
               'status': 'successful',
               'err': null,
               'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
               'downloadId': '18debcd2-55dc-4d88-8a15-ecc3170546d5'
            }


    },

    exportSuccess : {

            'id': 'api.content.export',
            'ver': '1.0',
            'ts': '2019-06-26T13:01:49.939Z',
            'params': {
               'resmsgid': '0e4d11da-e662-4b8d-bce7-008799a22ba0',
               'msgid': '9cead28c-03c0-4e1c-8360-0f0a5de0734e',
               'status': 'successful',
               'err': null,
               'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
               'response': {
                  'url': 'http://localhost:9000/temp/The Squirrel.ecar'
               }
            }

    },
    data: {
      id: 'api.content.read',
      ver: '1.0',
      ts: '2018-05-03T10:51:12.648Z',
      params: 'params',
      responseCode: 'OK',
      result: {
          content: {
              downloadStatus: '',
              mimeType: 'application/vnd.ekstep.ecml-archive',
              body: 'body',
              identifier: 'domain_66675',
              versionKey: '1497028761823',
              status: 'Live',
              me_averageRating: '4',
              description: 'ffgg',
              name: 'ffgh',
              concepts: ['AI', 'ML'],
              contentType: '',
              code: '',
              framework: '',
              userId: '',
              userName: '',
              desktopAppMetadata: {
                addedUsing: 'download',
                createdOn: 1569830943591,
                ecarFile: 'domain_66675.ecar',
                lastUpdateCheckedOn: 1569832294531,
                updatedOn: 1569832294531,
                updateAvailable: true
              }
          }
      }
  },
  content_update_success:
  {
    'id': 'api.content.update',
    'ver': '1.0',
    'ts': '2019-09-30T08:09:02.218Z',
    'params':
    {
      'resmsgid': '29be8811-c09f-4d37-9eba-c7b38f736829',
      'msgid': '3b6b29ea-4d9f-4151-a9e3-e4a2490b2aa2',
      'status': 'successful', 'err': null, 'errmsg': null
    },
    'responseCode': 'OK',
    'result': '9226b2c8-9bc5-4020-bfda-48048883445d'
  },
  content_update_error :
  {
    'id': 'api.content.update',
    'ver': '1.0',
    'ts': '2019-09-30T08:12:51.751Z',
    'params': {
      'resmsgid': '3428302f-3022-4900-b075-e941616d5a6c',
      'msgid': 'f60dffe9-cc6d-4d68-b7ff-46d9a3c29955',
      'status': 'failed',
      'err': 'ERR_INTERNAL_SERVER_ERROR',
      'errmsg': 'getaddrinfo ENOTFOUND dev.sunbirded.org dev.sunbirded.org:443'
    },
    'responseCode': 'INTERNAL_SERVER_ERROR',
    'result': {
    }
  }
};
