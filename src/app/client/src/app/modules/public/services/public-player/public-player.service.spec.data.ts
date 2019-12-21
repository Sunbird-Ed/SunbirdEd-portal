export const serverRes = {
    successResult: {
        id: 'api.content.read',
        ver: '1.0',
        ts: '2018-05-03T10:51:12.648Z',
        params: 'params',
        responseCode: 'OK',
        result: {
            content: {
                mimeType: 'application/vnd.ekstep.ecml-archive',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                downloadStatus: 'FAILED',
            }
        }
    },
    download_list : {
      'id': 'api.content.download.list',
      'ver': '1.0',
      'ts': '2019-12-21T10:33:14.983Z',
      'params': {
        'resmsgid': '71557329-59c9-487a-8aed-3352f62693b8',
        'msgid': '0c87a07a-3762-4b7d-98cb-dad427a204b3',
        'status': 'successful',
        'err': null,
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'response': {
          'contents': [{
            'id': '5efd0589-9ef3-4c4e-94e0-86e3a8a43e3f',
            'contentId': 'domain_66675',
            'resourceId': 'domain_66675',
            'mimeType': 'application/vnd.ekstep.ecml-archive',
            'name': '10 ಗಣಿತ ಭಾಗ 1',
            'status': 'failed',
            'createdOn': 1576923938092,
            'pkgVersion': 2,
            'contentType': 'TextBook',
            'totalSize': 1283937260,
            'addedUsing': 'download'
          }]
        }
      }
    },
      resourceServiceMockData: {
        messages: {
            stmsg: {
                m0140: 'DOWNLOADING',
                m0138: 'FAILED',
                m0139: 'DOWNLOADED',
                m0143: 'DOWNLOAD',
            }
        }
    },
};
