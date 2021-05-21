export const mockManageData = {
    geoData: {
        'districts': 10,
        'blocks': 20,
        'schools': 30
    },
    user: {
        'userProfile': {
            'rootOrg': {
                'isSSOEnabled': false
            }
        }
    },
    userSummary: {
        'accounts_unclaimed': 0,
        'accounts_validated': 0,
        'accounts_rejected': 0,
        'FAILED': 0,
        'MULTIMATCH': 0,
        'ORGEXTIDMISMATCH': 0,
        'accounts_failed': 0
    }
};

export const mockRes = {
    successResponse: {
        "id":"api.bulk.user.upload",
        "ver":"v2",
        "ts":"2020-08-17 11:04:03:513+0000",
        "params":{
           "resmsgid":null,
           "msgid":"f0f4031a-a73c-b967-c344-a82b09290c20",
           "err":null,
           "status":"success",
           "errmsg":null
        },
        "responseCode":"OK",
        "result":{
           "processId":"01308805080585011210",
           "response":{
              "isUserExists":true
           }
        }
     },
    errorResponse: {
        'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:16:59:649+0000',
        'params': {
            'resmsgid': null,
            'msgid': '55402d80-917f-4f72-9f5b-2e4e7a68ce86',
            'err': 'INVALID_ORGANIZATION_DATA',
            'status': 'INVALID_ORGANIZATION_DATA',
            'errmsg': `Given Organization Data doesn't exist in our records. Please provide a valid one`
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
    },
    resourceBundle: {
        'messages': {
            'smsg': {
                'm0030': 'Users uploaded successfully'
            },
            'stmsg': {
                'm0080': 'Please upload file in csv formate only'
            },
            'emsg': {
                'm0003': 'You should enter Provider and External Id Or Organization Id'
            },
            'fmsg': {
                'm0051': 'Something went wrong, please try again later...'
            }
        }
    },
    errorUpload: {
        error: {
            "id":"api.bulk.user.upload",
            "ver":"v2",
            "ts":"2020-08-17 08:57:03:340+0000",
            "params":{
               "resmsgid":null,
               "msgid":"38cda4eb-1947-e4de-68b8-50f4c878aa53",
               "err":"MANDATORY_PARAMETER_MISSING",
               "status":"MANDATORY_PARAMETER_MISSING",
               "errmsg":"Mandatory parameter diksha uuid is missing."
            },
            "responseCode":"CLIENT_ERROR",
            "result":{
               "response":{
                  "id":"",
                  "rootOrgId":"",
                  "isUserExists":""
               }
            }
         }
    },
    errorForEmpty: {
        error: {
            'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:16:59:649+0000',
        'params': {
            'resmsgid': null,
            'msgid': '55402d80-917f-4f72-9f5b-2e4e7a68ce86',
            'err': 'INVALID_ORGANIZATION_DATA',
            'status': 'INVALID_ORGANIZATION_DATA',
            'errmsg': 'Please provide valid csv file.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
        }
    },
    tncConfig: {
        'id': 'api',
        'params': {
          'status': 'success',
        },
        'responseCode': 'OK',
        'result': {
          'response': {
            'id': 'orgAdminTnc',
            'field': 'orgAdminTnc',
            'value': '{"latestVersion":"v4","v4":{"url":"http://test.com/tnc.html"}}'
          }
        }
      },
      tncConfigObj: {
        'id': 'api',
        'params': {
          'status': 'success',
        },
        'responseCode': 'OK',
        'result': {
          'response': {
            'id': 'orgAdminTnc',
            'field': 'orgAdminTnc',
            'value': '{"abc":"abc"}'
          }
        }
      },
    noErrorMessage: {message: `Something went wrong,\n please try again later...`},
    toasterMessage: {
        mandatoryParameters: 'Mandatory parameter diksha uuid is missing',
        emptyFiles: 'Please provide valid csv file.',
        invalidColumnMultipleLines: 'Invalid column: ﻿"firstName".<br/>Valid columns are: firstName, lastName, externalIds.<br/>Please check.'}
};
