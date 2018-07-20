export const mockRes = {
    successResponse: {
        'id': 'api.upload.status',
        'ver': 'v1',
        'ts': '2018-03-22 10:11:17:147+0000',
        'params': {
            'resmsgid': null,
            'msgid': '49a712f9-1973-96f6-fca3-ec6ecd9353a0',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': [
                {
                    'failureResult': [
                    ],
                    'processId': '012465880638177280660',
                    'retryCount': null,
                    'successResult': [
                        {
                            'lastName': 'M',
                            'loginId': 'vaishnavi',
                            'gender': null,
                            'subject': null,
                            'regOrgId': '01246588157255680056',
                            'roles': [
                                'CONTENT_CREATOR',
                                'PUBLIC'
                            ],
                            'language': null,
                            'password': '*****',
                            'provider': null,
                            'email': 'vaish@gmail.com',
                            'profileSummary': null,
                            'phoneVerified': null,
                            'userName': 'vaishnavi',
                            'rootOrgId': '01246588157255680056',
                            'userId': 'f5520099-afc4-4a87-8ee1-8be50322893a',
                            'firstName': 'Vaish',
                            'emailVerified': null,
                            'phone': '7899918811',
                            'dob': null,
                            'grade': null,
                            'location': null,
                            'position': null
                        }
                    ],
                    'objectType': 'user'
                }
            ]
        }
    },
    failureResponse: {
        'id': 'api.upload.status',
        'ver': 'v1',
        'ts': '2018-03-22 09:46:36:991+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'fc0c4447-8156-b77c-a6ca-1ab3a6a31b24',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': [
                {
                    'failureResult': [
                        {
                            'homeUrl': 'googlehomeurl',
                            'orgType': 'Anuj 3Org',
                            'preferredLanguage': 'hindi',
                            'orgName': null,
                            'contactDetail': `[{'address':'Bangalore','phone':'8088404715','fax':'abctest@tests.com'}]`,
                            'provider': 'technical002',
                            'orgCode': 'orgcode12345',
                            'channel': 'channel110001',
                            'externalId': 'ugc0001',
                            'description': 'googleeeeehome',
                            'theme': 'goodtheme',
                            'isRootOrg': 'true',
                            'err_msg': 'Invalid OrgType.'
                        },
                        {
                            'homeUrl': 'googlehomeurl',
                            'orgType': 'Anuj Org',
                            'preferredLanguage': 'hindi',
                            'orgName': 'hello3001',
                            'contactDetail': `[{'address':'Bangalore','phone':'8088404715','fax':'abctest@tests.com'}]`,
                            'provider': 'technical003',
                            'orgCode': 'orgcode12345',
                            'channel': 'channel110002',
                            'externalId': 'ugc0001',
                            'description': 'googleeeeehome',
                            'theme': 'goodtheme',
                            'isRootOrg': 'true',
                            'err_msg': 'Invalid OrgType.'
                        }
                    ],
                    'processId': '012465866750427136656',
                    'retryCount': null,
                    'successResult': [
                    ],
                    'objectType': 'organisation'
                }
            ]
        }
    },
    errorResponse: {
        'id': 'api.upload.status',
        'ver': 'v1',
        'ts': '2018-03-22 10:27:32:878+0000',
        'params': {
            'resmsgid': null,
            'msgid': '7752d1e7-21f4-98af-6284-5cfa3bb8a7f9',
            'err': 'INVALID_PROCESS_ID',
            'status': 'INVALID_PROCESS_ID',
            'errmsg': 'Invalid Process Id.'
        },
        'responseCode': 'RESOURCE_NOT_FOUND',
        'result': {
        }
    },
    resourceBundle: {
        'messages': {
            'smsg': {
                'm0032': 'Status fetched successfully'
            },
            'fmsg': {
                'm0051': 'Something went wrong, please try again later...'
            },
            'stmsg': {
                'm0006': 'No results found'
            }
        }
    }
};
