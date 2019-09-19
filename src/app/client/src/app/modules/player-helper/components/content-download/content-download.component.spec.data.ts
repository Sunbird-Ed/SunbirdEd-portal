export const serverRes = {
    result: {
        id: 'api.content.read',
        ver: '1.0',
        ts: '2018-05-03T10:51:12.648Z',
        params: 'params',
        responseCode: 'OK',
        result: {
            content: {
                downloadStatus: 'DOWNLOAD',
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
    failureResult: {
        id: 'api.content.read',
        ver: '1.0',
        ts: '2018-05-03T10:51:12.648Z',
        error: 'SERVER_ERROR',
        params: 'params',
        responseCode: 'OK',
        result: {
            content: {
                mimeType: 'abc',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                status: 'Live',
                me_averageRating: '4',
                description: 'ffgg',
                name: 'ffgh',
                concepts: ['AI', 'ML']
            }
        }
    },
    resourceServiceMockData: {
        messages: {
            imsg: {
                m0027: 'Something went wrong'
            },
            stmsg: {
                m0009: 'error'
            }
        },
        frmelmnts: {
            btn: {
                tryagain: 'tryagain',
                close: 'close'
            },
            lbl: {
                description: 'description'
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
      }

};