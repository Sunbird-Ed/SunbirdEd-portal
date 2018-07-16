export const mockProfilePageData = {
    userMockData: {

        'lastName': 'User',
        'loginId': 'ntptest102',
        'regOrgId': '0123653943740170242',
        'roles': [
            'public'
        ],
        'rootOrg': {
            'dateTime': null,
            'preferredLanguage': 'English',
            'approvedBy': null,
            'channel': 'ROOT_ORG',
            'description': 'Sunbird',
            'updatedDate': '2017-08-24 06:02:10:846+0000',
            'addressId': null,
            'orgType': null,
            'provider': null,
            'orgCode': 'sunbird',
            'theme': null,
            'id': 'ORG_001',
            'communityId': null,
            'isApproved': null,
            'slug': 'sunbird',
            'identifier': 'ORG_001',
            'thumbnail': null,
            'orgName': 'Sunbird',
            'updatedBy': 'user1',
            'externalId': null,
            'isRootOrg': true,
            'rootOrgId': null,
            'approvedDate': null,
            'imgUrl': null,
            'homeUrl': null,
            'isDefault': null,
            'contactDetail':
                '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'},{\'phone\':\'+91213124234234\',\'email\':\'test1@test.com\'}]',
            'createdDate': null,
            'createdBy': null,
            'parentOrgId': null,
            'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'noOfMembers': 1,
            'status': null
        },
        'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'profileSummary': 'asdd',
        'tcUpdatedDate': null,
        'avatar': 'https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png',
        'userName': 'ntptest102',
        'rootOrgId': 'ORG_001',
        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'emailVerified': null,
        'firstName': 'Cretation',
        'lastLoginTime': 1519809987692,
        'createdDate': '2017-10-31 10:47:04:723+0000',
        'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45'
    },
    profileResult: {
        'id': 'api.user.update',
        'ver': 'v1',
        'ts': '2018-04-18 08:06:51:626+0000',
        'params': {
            'resmsgid': null,
            'msgid': '093f2a76-fba1-338f-65c7-8a1e234a477a',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': { 'response': 'SUCCESS' }
    },
    profileErr: {
        'id': 'api.user.update',
        'ver': 'v1',
        'ts': '2018-04-18 08:06:51:626+0000',
        'params': {
            'resmsgid': null,
            'msgid': '093f2a76-fba1-338f-65c7-8a1e234a477a',
            'err': 'INVALID_DATA',
            'status': 'INVALID_DATA',
            'errmsg': null
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    success: {
        'id': 'api.v1.search',
        'ver': '1.0',
        'ts': '2018-04-18T09:54:51.318Z',
        'params': {
            'resmsgid': '899c6d60-42ee-11e8-9525-3b7922bb1423',
            'msgid': '899122c0-42ee-11e8-8610-f51744d7b4c5',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'count': 15,
            'content': [
                {
                    'previewUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/ecml/do_112484375073890304147-latest',
                    'subject': 'Mathematics',
                    'channel': '505c7c48ac6dc1edc9b08f21db5a571d',
                    'downloadUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files
                    /do_112484375073890304147/test-8_1523971722055_do_112484375073890304147_1.0.ecar`,
                    'language': [
                        'English'
                    ],
                    'mimeType': 'application/vnd.ekstep.ecml-archive',
                    'variants': {
                        'spine': {
                            'ecarUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_112484375073890304147
                            /test-8_1523971722142_do_112484375073890304147_1.0_spine.ecar`,
                            'size': 88434
                        }
                    },
                    'editorState': `{\'plugin\':{\'noOfExtPlugins\':5,\'extPlugins\':[{\'plugin\':\'org.ekstep.contenteditorfunctions
                    \',\'version\':\'1.0\'},{\'plugin\':\'org.ekstep.keyboardshortcuts\',\'version\':\'1.0\'},{\'plugin\':\
                    'org.ekstep.richtext\',\'version\':\'1.0\'},{\'plugin\':\'org.ekstep.iterator\',\'version\':\'1.0\'},
                    {\'plugin\':\'org.ekstep.navigation\',\'version\':\'1.0\'}]},\'stage\':{\'noOfStages\':1,\'currentStage\
                    ':\'a2bd0785-9464-410c-bdcb-cdecd1ddd2a2\'},\'sidebar\':{\'selectedMenu\':\'settings\'}}`,
                    'objectType': 'Content',
                    'gradeLevel': [
                        'Grade 1'
                    ],
                    'appIcon': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/
                    do_112484375073890304147/artifact/10_1466418041535.thumb.jpg`,
                    'appId': 'dev.sunbird.portal',
                    'contentEncoding': 'gzip',
                    'artifactUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/
                    content/do_112484375073890304147/artifact/1523971721838_do_112484375073890304147.zip`,
                    'contentType': 'Resource',
                    'identifier': 'do_112484375073890304147',
                    'lastUpdatedBy': '104',
                    'audience': [
                        'Learner'
                    ],
                    'visibility': 'Default',
                    'consumerId': '72e54829-6402-4cf0-888e-9b30733c1b88',
                    'mediaType': 'content',
                    'osId': 'org.ekstep.quiz.app',
                    'graph_id': 'domain',
                    'nodeType': 'DATA_NODE',
                    'lastPublishedBy': '104',
                    'prevState': 'Review',
                    'concepts': [
                        'C6'
                    ],
                    'size': 92479,
                    'lastPublishedOn': '2018-04-17T13:28:42.055+0000',
                    'IL_FUNC_OBJECT_TYPE': 'Content',
                    'name': 'Test-8',
                    'status': 'Live',
                    'code': 'org.sunbird.wrKbiD',
                    'medium': 'English',
                    'idealScreenSize': 'normal',
                    'posterImage': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/10_1466418041535.jpg',
                    'createdOn': '2018-04-17T13:26:06.636+0000',
                    'contentDisposition': 'inline',
                    'lastUpdatedOn': '2018-04-17T13:28:41.581+0000',
                    'SYS_INTERNAL_LAST_UPDATED_ON': '2018-04-17T13:28:42.337+0000',
                    'createdFor': [
                        '0123653943740170242',
                        'ORG_001'
                    ],
                    'creator': 'Cretation User',
                    'IL_SYS_NODE_TYPE': 'DATA_NODE',
                    'os': [
                        'All'
                    ],
                    'resourcetype': 'Academic calendar',
                    'pkgVersion': 1,
                    'versionKey': '1523971721581',
                    'idealScreenDensity': 'hdpi',
                    'framework': 'NCF',
                    's3Key': 'ecar_files/do_112484375073890304147/test-8_1523971722055_do_112484375073890304147_1.0.ecar',
                    'lastSubmittedOn': '2018-04-17T13:28:06.187+0000',
                    'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                    'compatibilityLevel': 2,
                    'IL_UNIQUE_ID': 'do_112484375073890304147',
                    'board': 'CBSE',
                    'resourceType': 'Story',
                    'node_id': 35015
                },
            ]
        }
    },
    zeroData: {
              'id': 'api.v1.search',
                'ver': '1.0',
                'ts': '2018-04-18T09:54:51.318Z',
                'params': {
                    'resmsgid': '899c6d60-42ee-11e8-9525-3b7922bb1423',
                    'msgid': '899122c0-42ee-11e8-8610-f51744d7b4c5',
                    'status': 'successful',
                    'err': null,
                    'errmsg': null
                },
                'responseCode': 'OK',
                'result': {
                    'count': 0
                }
            },
    event: {
        'inview': [
            {
                'id': 0,
                'data': {
                    'previewUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com
                    /assets/do_1125083916608880641165/codpaste-teachingpack.pdf`,
                    'subject': 'English',
                    'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
                    'downloadUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files
                    /do_1125083916608880641165/pdf-testing_1527765788034_do_1125083916608880641165_2.0.ecar`,
                    'language': [
                        'English'
                    ],
                    'mimeType': 'application/pdf',
                    'variants': {
                        'spine': {
                            'ecarUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/
                            do_1125083916608880641165/pdf-testing_1527765790300_do_1125083916608880641165_2.0_spine.ecar`,
                            'size': 7187
                        }
                    },
                    'objectType': 'Content',
                    'gradeLevel': [
                        'KG'
                    ],
                    'appIcon': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/
                    do_1124784977749278721133/artifact/emi_calculater_blue_1523254123025.png`,
                    'appId': 'dev.sunbird.portal',
                    'artifactUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/
                    assets/do_1125083916608880641165/codpaste-teachingpack.pdf`,
                    'contentEncoding': 'identity',
                    'contentType': 'Resource',
                    'lastUpdatedBy': '3b34c469-460b-4c20-8756-c5fce2de9e69',
                    'identifier': 'do_1125083916608880641165',
                    'audience': [
                        'Learner'
                    ],
                    'publishChecklist': [
                        'No Hate speech, Abuse, Violence, Profanity',
                        'No Sexual content, Nudity or Vulgarity',
                        'No Discrimination or Defamation',
                        'Relevant Keywords',
                        'Is suitable for children',
                        'Appropriate tags such as Resource Type, Concepts',
                        'Correct Board, Grade, Subject, Medium',
                        'Appropriate Title, Description',
                        'Content plays correctly',
                        'Can see the content clearly on Desktop and App',
                        'Audio (if any) is clear and easy to understand',
                        'No Spelling mistakes in the text',
                        'Language is simple to understand'
                    ],
                    'visibility': 'Default',
                    'consumerId': '72e54829-6402-4cf0-888e-9b30733c1b88',
                    'mediaType': 'content',
                    'osId': 'org.ekstep.quiz.app',
                    'graph_id': 'domain',
                    'nodeType': 'DATA_NODE',
                    'lastPublishedBy': '3b34c469-460b-4c20-8756-c5fce2de9e69',
                    'pragma': [
                        'external'
                    ],
                    'prevState': 'Live',
                    'concepts': [
                        'do_112300246933831680110'
                    ],
                    'size': 23049385,
                    'lastPublishedOn': '2018-05-31T11:23:08.034+0000',
                    'name': 'PDf testing',
                    'status': 'Live',
                    'code': 'a1bd4930-3513-497d-b715-d27d35361358',
                    'description': 'sds',
                    'medium': 'Hindi',
                    'idealScreenSize': 'normal',
                    'createdOn': '2018-05-21T11:47:58.916+0000',
                    'contentDisposition': 'inline',
                    'lastUpdatedOn': '2018-05-31T11:23:07.416+0000',
                    'SYS_INTERNAL_LAST_UPDATED_ON': '2018-05-31T11:23:10.469+0000',
                    'creator': 'Sunil Pandith',
                    'createdFor': [
                        '0123673542904299520',
                        '0123673689120112640',
                        'ORG_001'
                    ],
                    'os': [
                        'All'
                    ],
                    'pkgVersion': 2,
                    'versionKey': '1527765787416',
                    'idealScreenDensity': 'hdpi',
                    'framework': 'NCF',
                    's3Key': 'ecar_files/do_1125083916608880641165/pdf-testing_1527765788034_do_1125083916608880641165_2.0.ecar',
                    'lastSubmittedOn': '2018-05-21T12:06:53.195+0000',
                    'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                    'compatibilityLevel': 4,
                    'board': 'NCERT',
                    'resourceType': 'Learn',
                    'node_id': 29506
                }
            }
        ],
        'direction': 'up'
    },
    telemetryData: {
        context: {
            env: 'workspace'
        },
        edata: {
            type: 'list',
            pageid: '',
            subtype: 'scroll',
            uri: '',
            visits: []
        }
    }
};
