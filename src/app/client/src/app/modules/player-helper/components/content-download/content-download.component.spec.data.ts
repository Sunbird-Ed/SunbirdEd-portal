export const serverRes = {
    result: {
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
                userName: ''
            }
        }
    },
    result1: {
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
    resourceServiceMockData: {
        messages: {
            fmsg: {
                m0027: 'Something went wrong',
                m0090: 'Could not download. Try again later',
                m0096: 'Could not Update. Try again later'
            },
            stmsg: {
                m0009: 'error',
                m0140: 'DOWNLOADING',
                m0138: 'FAILED',
                m0139: 'DOWNLOADED',
            },
            smsg: {
                m0056: 'You should be in online to update the content: {contentName}'
            }
        },
        frmelmnts: {
            btn: {
                tryagain: 'tryagain',
                close: 'close'
            },
            lbl: {
                description: 'description',
                updatecontent: 'Update Content',
                updatecollection: 'Update All'
            }
        }
    },
     download_success : {
        id: 'api.content.download',
        ver: '1.0',
        ts: '2019-08-16T04:54:02.569Z',
        params: {
          resmsgid: 'efe1bb13-a3a4-4458-baf1-234b1a109ea0',
          msgid: 'c1932b9d-2a36-4036-ba57-2b80be4b3355',
          status: 'successful',
          err: null,
          errmsg: null,
        },
        responseCode: 'OK',
        result: { downloadId: '5e1ae60e-ecd8-459e-9e13-fe8ecf7c9487' },
      },
    download_error : {
        id: 'api.content.download',
        ver: '1.0',
        ts: '2019-08-16T12:28:15.856Z',
        params: {
          resmsgid: 'dbbf8bd4-4da8-492b-bc5b-6c73351f1161',
          msgid: '845ee75b-72e9-4d33-a0a2-1b38bf132b83',
          status: 'failed',
          err: 'ERR_INTERNAL_SERVER_ERROR',
          errmsg: 'Error while processing the request',
        },
        responseCode: 'INTERNAL_SERVER_ERROR',
        result: {},
      },
       download_list : {
        id: 'api.content.download.list',
        ver: '1.0',
        ts: '2019-08-22T05:07:39.363Z',
        params: {
          resmsgid: 'f2da2305-75c9-4b54-a454-72cfe6433ebe',
          msgid: '2025a654-e573-4546-b87d-0a293f2f6564',
          status: 'successful',
          err: null,
          errmsg: null,
        },
        responseCode: 'OK',
        result: {
          response: {
            downloads: {
              submitted: [],
              inprogress: [],
              failed: [
               {
                   id: '9922bfb2-d94a-4724-8613-e8172cf3937f',
                   contentId: 'do_112271823894691840181',
                   mimeType: 'application/vnd.ekstep.content-collection',
                   name: 'Math for dummies',
                   status: 'FAILED',
                   createdOn: 1566450435237,
                   pkgVersion: 1,
                   contentType: 'TextBook',
                 },
                 {   id: '9922bfb2-d94a-4724-8613-e8172cf3789g',
                     contentId: 'domain_66675',
                     mimeType: 'application/vnd.ekstep.ecml-archive',
                     name: 'ffgh',
                     status: 'FAILED',
                     createdOn: 1566450435237,
                     pkgVersion: 1,
                     contentType: '',
                 },
              ],
              completed: [],
            },
          },
        },
      },
      downloading_content: {
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
                badgeAssertions: [
                    {
                     'issuerId': 'issuerslug-93',
                     'assertionId': 'b0a33a07-7b06-4faf-a0a4-e0cbba009227',
                     'badgeClassImage': `https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/
                     issuer_badgeclass_ba684c5c-5490-4c16-a091-759f1e689723`,
                     'badgeId': 'badgeslug-8',
                     'badgeClassName': 'something',
                     'createdTS': 1531907304511,
                     'status': 'active'
                    }
                   ]
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
