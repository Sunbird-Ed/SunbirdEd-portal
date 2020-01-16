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
      resourceServiceMockData: {
        messages: {
            stmsg: {
                m0140: 'DOWNLOADING',
                m0138: 'FAILED',
                m0139: 'DOWNLOADED',
            }
        }
    },
};
