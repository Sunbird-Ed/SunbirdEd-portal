export const mockResponse = {
    resourceBundle: {
        'messages': {
            'fmsg': {
                'm0079': 'Assigning badge failed, please try again later...',
                'm0078': 'Fetching badge failed, please try again later...',
                'm0052' : 'Creating batch failed, please try again later...'
            },
            'smsg': {
                'm0034': 'batch updated succesfully',
                'm0044': 'Badge assigned successfully'
            },
            'stmsg': {
                'm0119': 'We are updating batch...'
            },
        }
    },
    req: {
        'request': {
            'courseId': 'do_112470675618004992181',
            'name': 'raghavendra 1',
            'description': 'about this batch',
            'enrollmentType': 'open',
            'startDate': '2018-06-06T18:30:00.000Z',
            'endDate': '2018-06-19T18:30:00.000Z',
            'createdBy': '8036594d-c0cf-4869-a29c-7ffd0ee2bc90',
            'createdFor': [
                '01230654510633779230',
                'ORG_001'
            ],
            'mentors': [
                '44c3a14c-d9b3-4269-ab28-946418de4030'
            ]
        }
    },
    returnValue: {
        'id': 'api.course.batch.create',
        'ver': 'v1',
        'ts': '2018-06-06 11:12:35:315+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'acad8b25-ccae-4732-b84f-2ca76a0e9076',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'batchId': '01251970679178035216'
        }
    },
    errorResponse: {
        'id': 'api.course.batch.create',
        'ver': 'v1',
        'ts': '2018-09-23 15:57:41:341+0000',
        'params': {
          'resmsgid': null,
          'msgid': 'ba91b180-185d-e583-eb64-6015fe9aa9c7',
          'err': 'END_DATE_ERROR',
          'status': 'END_DATE_ERROR',
          'errmsg': 'End date should be greater than start date.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    userMockData: {
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
    getUserList: {
        'id': 'api.user.search',
        'ver': 'v1',
        'ts': '2018-07-03 09:51:55:738+0000',
        'params': {
            'resmsgid': null,
            'msgid': '1e1b8708-6342-931b-8b29-b0fef2dbbb9b',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'count': 3,
                'content': [
                    {
                        'lastName': '',
                        'webPages': [],
                        'tcStatus': null,
                        'education': [],
                        'gender': null,
                        'regOrgId': null,
                        'subject': [],
                        'roles': [
                            'CONTENT_CREATOR',
                            'CONTENT_CREATION',
                            'CONTENT_REVIEWER',
                            'CONTENT_REVIEW',
                            'FLAG_REVIEWER'
                        ],
                        'language': [],
                        'updatedDate': '2017-08-17 06:46:20:422+0000',
                        'skills': [],
                        'isDeleted': true,
                        'organisations': [],
                        'provider': null,
                        'countryCode': '+91',
                        'id': '27d5a117-e1a1-4202-8476-6be21fd76a5c',
                        'tempPassword': null,
                        'email': 'po******@gmail.com',
                        'identifier': '27d5a117-e1a1-4202-8476-6be21fd76a5c',
                        'thumbnail': null,
                        'address': [],
                        'jobProfile': [],
                        'profileSummary': null,
                        'tcUpdatedDate': null,
                        'avatar': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/media/comm-landing_1502271728363.png',
                        'rootOrgId': 'ORG_001',
                        'badges': [],
                        'emailVerified': null,
                        'firstName': 'poonam',
                        'lastLoginTime': null,
                        'createdDate': '2017-08-08 09:09:05:461+0000',
                        'createdBy': null,
                        'phone': '******8098',
                        'dob': null,
                        'grade': [],
                        'currentLoginTime': null,
                        'location': null,
                        'status': 0
                    },
                    {
                        'lastName': 'Test',
                        'webPages': [],
                        'tcStatus': null,
                        'education': [],
                        'gender': null,
                        'subject': [],
                        'roles': [
                            'PUBLIC'
                        ],
                        'channel': null,
                        'language': [],
                        'updatedDate': null,
                        'skills': [],
                        'badgeAssertions': [],
                        'isDeleted': false,
                        'organisations': [],
                        'countryCode': '+91',
                        'id': '3e6c6eb7-8c0c-45b6-9114-e36b59e1aa8b',
                        'tempPassword': null,
                        'email': '',
                        'phoneverified': null,
                        'identifier': '3e6c6eb7-8c0c-45b6-9114-e36b59e1aa8b',
                        'thumbnail': null,
                        'address': [],
                        'jobProfile': [],
                        'profileSummary': null,
                        'tcUpdatedDate': null,
                        'avatar': null,
                        'rootOrgId': 'ORG_001',
                        'emailVerified': false,
                        'firstName': 'User 3525',
                        'lastLoginTime': null,
                        'createdDate': '2018-06-07 18:52:54:407+0000',
                        'createdBy': '',
                        'phone': null,
                        'dob': null,
                        'grade': [],
                        'currentLoginTime': null,
                        'location': 'location',
                        'status': 1
                    },
                    {
                        'lastName': 'creator_org_001',
                        'webPages': [],
                        'tcStatus': null,
                        'education': [],
                        'gender': null,
                        'subject': [],
                        'roles': [
                            'PUBLIC'
                        ],
                        'channel': null,
                        'language': [],
                        'updatedDate': '2018-03-23 12:05:34:090+0000',
                        'skills': [
                            {
                                'skillName': 'test',
                                'addedAt': '2018-05-21',
                                'endorsersList': [
                                    {
                                        'endorseDate': '2018-05-21',
                                        'userId': 'b2479136-8608-41c0-b3b1-283f38c338ed'
                                    },
                                    {
                                        'endorseDate': '2018-05-23',
                                        'userId': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45'
                                    },
                                    {
                                        'endorseDate': '2018-05-23',
                                        'userId': '6d4da241-a31b-4041-bbdb-dd3a898b3f85'
                                    }
                                ],
                                'addedBy': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                                'endorsementcount': 2,
                                'id': '71cfd844ec57b7828ae93fce192e961932de293e45635bc06012a197d4adb929',
                                'skillNameToLowercase': 'test',
                                'userId': 'b2479136-8608-41c0-b3b1-283f38c338ed'
                            }
                        ],
                        'badgeAssertions': [],
                        'isDeleted': null,
                        'organisations': [
                            {
                                'organisationId': 'ORG_001',
                                'updatedBy': null,
                                'addedByName': 'Rg==',
                                'addedBy': '781c21fc-5054-4ee0-9a02-fbb1006a4fdd',
                                'roles': [
                                    'BOOK_CREATOR',
                                    'COURSE_MENTOR'
                                ],
                                'approvedBy': '781c21fc-5054-4ee0-9a02-fbb1006a4fdd',
                                'updatedDate': null,
                                'userId': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                                'approvaldate': '2018-03-16 10:44:22:327+0000',
                                'isDeleted': false,
                                'isRejected': false,
                                'id': '0124616467103580163',
                                'position': null,
                                'isApproved': true,
                                'orgjoindate': '2018-03-16 10:44:22:327+0000',
                                'orgLeftDate': null
                            }
                        ],
                        'countryCode': '+91',
                        'id': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                        'tempPassword': null,
                        'email': null,
                        'phoneverified': null,
                        'identifier': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                        'thumbnail': null,
                        'address': [
                            {
                                'country': null,
                                'updatedBy': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                                'city': 'xcv',
                                'updatedDate': '2018-03-23 12:05:34:100+0000',
                                'userId': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                                'zipcode': null,
                                'addType': 'current',
                                'createdDate': '2018-03-23 12:05:10:103+0000',
                                'isDeleted': null,
                                'createdBy': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                                'addressLine1': 'vxcv',
                                'addressLine2': null,
                                'id': '0124666424917360640',
                                'state': null
                            },
                            {
                                'country': null,
                                'updatedBy': null,
                                'city': 'sdfsd',
                                'updatedDate': null,
                                'userId': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                                'zipcode': null,
                                'addType': 'permanent',
                                'createdDate': '2018-03-23 12:05:34:108+0000',
                                'isDeleted': null,
                                'createdBy': 'b2479136-8608-41c0-b3b1-283f38c338ed',
                                'addressLine1': 'zcfsdf',
                                'addressLine2': null,
                                'id': '0124666450913771521',
                                'state': null
                            }
                        ],
                        'jobProfile': [],
                        'profileSummary': null,
                        'tcUpdatedDate': null,
                        'avatar': null,
                        'rootOrgId': 'ORG_001',
                        'emailVerified': false,
                        'firstName': 'book',
                        'lastLoginTime': null,
                        'createdDate': '2018-03-16 10:43:28:156+0000',
                        'createdBy': '',
                        'phone': '',
                        'dob': null,
                        'grade': [],
                        'currentLoginTime': null,
                        'location': null,
                        'status': 1
                    }
                ]
            }
        }
    },
     updateBatchDetails : {
        'identifier': '012596992049307648442',
        'createdFor': [
          '01232002070124134414',
          '012315809814749184151'
        ],
        'courseAdditionalInfo': {
          'courseName': 'Testing with 60 charsTesting with 60 charsTesting with 60 chars characters',
          'leafNodesCount': '1',
          'description': 'Testing to see if this breaks',
          'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amaartifact/course_icon_1_1505730143591.thumb.png',
          'tocUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazo3567152009216001249/artifact/do_2123567152009216001249toc.json',
          'status': 'Live'
        },
        'endDate': null,
        'description': 'sfasfs',
        'countIncrementStatus': false,
        'createdDate': '2018-09-23 15:57:04:518+0000',
        'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
        'courseCreator': 'd4dbcab1-4f99-4edc-8dc6-a8f66149cfbe',
        'hashTagId': '012596992049307648442',
        'mentors': [],
        'name': 'fassfsaf',
        'countDecrementStatus': false,
        'id': '012596992049307648442',
        'enrollmentType': 'invite-only',
        'courseId': 'do_2123567152009216001249',
        'startDate': '2018-09-23',
        'status': 1
      }
};

