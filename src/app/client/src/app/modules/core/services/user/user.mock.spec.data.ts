export const mockUserData = {
    registerSuccess: {
        'id': '',
        'ver': 'v4',
        'ts': '2020-06-03 09:56:20:964+0000',
        'params': {
            'resmsgid': null,
            'msgid': '86461789-0856-45f2-2ef4-e1bc18ad89b4',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'userId': '0008ccab-2103-46c9-adba-6cdf84d37f06'
        }
    },
    tenantSuccess:
    {
        'id': 'api.tenant.info',
        'ver': '1.0',
        'ts': '2018-04-10 15:34:45:875+0530',
        'params': {
            'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
            'msgid': null,
            'status': 'successful',
            'err': '',
            'errmsg': ''
        },
        'responseCode': 'OK',
        'result': {
            'titleName': 'SUNBIRD',
            'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'favicon': 'http://localhost:3000/assets/images/favicon.ico',
            'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'
        }
    },
    tenantFailure: {
        'id': 'api.tenant.info',
        'ver': '1.0',
        'ts': '2018-04-10 15:34:45:875+0530',
        'params': {
            'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
            'msgid': null,
            'status': 'failed'
        },
        'responseCode': 'CLIENT_ERROR'
    },
    tenantDefault: {
        'titleName': 'Sunbird',
        'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
        'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
        'favicon': 'http://localhost:3000/assets/images/favicon.ico',
        'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'

    },
    error: {
        'id': 'api.user.read',
        'ver': 'v1',
        'ts': '2018-02-28 12:07:33:518+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'bdf695fd-3916-adb0-2072-1d53deb14aea',
            'err': null,
            'status': 'error',
            'errmsg': null
        },
        'responseCode': 'CLINTERROR',
        'result': {}
    },
    success: {
        'id': 'api.user.read',
        'ver': 'v1',
        'ts': '2018-02-28 12:07:33:518+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'bdf695fd-3916-adb0-2072-1d53deb14aea',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'missingFields': [
                    'dob',
                    'location'
                ],
                'lastName': 'User',
                'webPages': [
                    {
                        'type': 'fb',
                        'url': 'https://www.facebook.com/gjh'
                    }
                ],
                'tcStatus': null,
                'loginId': 'ntptest102',
                'education': [
                    {
                        'updatedBy': null,
                        'yearOfPassing': 0,
                        'degree': 'hhj',
                        'updatedDate': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressId': null,
                        'duration': null,
                        'courseName': null,
                        'createdDate': '2017-11-30 13:19:47:276+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardOrUniversity': '',
                        'grade': '',
                        'percentage': null,
                        'name': 'g',
                        'id': '0123867019537448963'
                    },
                    {
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'yearOfPassing': 2000,
                        'degree': 'ahd',
                        'updatedDate': '2017-12-06 13:52:13:291+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressId': null,
                        'duration': null,
                        'courseName': null,
                        'createdDate': '2017-12-06 13:50:59:915+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardOrUniversity': '',
                        'grade': 'F',
                        'percentage': 999,
                        'name': 'djd',
                        'id': '0123909651904757763'
                    }
                ],
                'gender': 'female',
                'regOrgId': '0123653943740170242',
                'subject': [
                    'Gujarati',
                    'Kannada'
                ],
                'roles': [
                    'public'
                ],
                'language': [
                    'Bengali'
                ],
                'updatedDate': '2018-02-21 08:54:46:436+0000',
                'completeness': 88,
                'skills': [
                    {
                        'skillName': 'bnn',
                        'addedAt': '2018-02-17',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-02-17',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'f2f8f18e45d2ede1eb93f40dd53e11290814fd5999d056181d919f219c9fda03',
                        'skillNameToLowercase': 'bnn',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'as',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '8ef363f359f68c7db0e1422f29e97632229d2ce92ad95cbd2525b068f8cbc2cf',
                        'skillNameToLowercase': 'as',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'java',
                        'addedAt': '2017-11-19',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-19',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '9f96b0187dff50353a1ca9bb5177324f61d6c725fe7f050938b0c530ad2d82d8',
                        'skillNameToLowercase': 'java',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'kafka123',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'abefe2638ec556faad62ca18d9214e8175584e87ff70c27e566c74727789790f',
                        'skillNameToLowercase': 'kafka123',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asllfhsal',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'e00543bb0c0fc0822136eaf17223be0d7c2fc8f4b5f5c2a0a2c902c5aaed4a1f',
                        'skillNameToLowercase': 'asllfhsal',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'purescript',
                        'addedAt': '2017-11-17',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-17',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'ee5c047f3b2f552f7cd31dffefc87bdcd34d9adac9a44ed79e44498136ff821d',
                        'skillNameToLowercase': 'purescript',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'angular',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '65fc8fb2cc0f5a54f30d3fe412631184820abc73a390ee66bea000680af2b0ff',
                        'skillNameToLowercase': 'angular',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'graph database - neo4g',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '5bdf5759b63e106897a22ce960fdeca108da759e105d25cf2ccb0fb8e8fb54b8',
                        'skillNameToLowercase': 'graph database - neo4g',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'kafka',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '17759f5c8024ab470190c2b2da1554ed693a2a5d93aba9bcc27c42889146eaea',
                        'skillNameToLowercase': 'kafka',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'apis design',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'a05fc5f9e82344b4adbc8b5a51b10f7133946667e1724bf7df1705e8b8c1e462',
                        'skillNameToLowercase': 'apis design',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asflashf',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '0f419edad82dd10f6d49b0f38622a12365a8ce8356100004fa4aa17352b7a32f',
                        'skillNameToLowercase': 'asflashf',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asfajsfh',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '50985029eea591602cc64e243ceb2679688639fe5f3cdccde79eb94248dfc303',
                        'skillNameToLowercase': 'asfajsfh',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'akka',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '8f8ced5c48869be76c3fde50be6221a7cd34ddae4887959f612ddb3e7ba34ed9',
                        'skillNameToLowercase': 'akka',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'test',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'cdbfc1812b172e1362e384bdd42ea13360333d8ad6140064a5a81d8ec3d72002',
                        'skillNameToLowercase': 'test',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'afjalskf',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '28acdc61a6865a2cf571083dbc50684878f718efde54502c12e0b02c729a932b',
                        'skillNameToLowercase': 'afjalskf',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'cassandra',
                        'addedAt': '2017-11-19',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-19',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '54b258bb673e38b7159de94a3746ab60f232535364ee05bce0d91bcc215236d7',
                        'skillNameToLowercase': 'cassandra',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    }
                ],
                'isDeleted': null,
                'organisations': [
                    {
                        'organisationId': '0123653943740170242',
                        'updatedBy': null,
                        'addedByName': null,
                        'addedBy': null,
                        'hashTagId': '0123653943740170242',
                        'roles': [
                            'CONTENT_CREATION',
                            'PUBLIC'
                        ],
                        'approvedBy': null,
                        'updatedDate': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'approvaldate': null,
                        'isDeleted': false,
                        'isRejected': null,
                        'id': '01236539426110668816',
                        'position': 'ASD',
                        'isApproved': null,
                        'orgjoindate': '2017-10-31 10:47:04:732+0000',
                        'orgLeftDate': null
                    }
                ],
                'provider': null,
                'countryCode': null,
                'id': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'tempPassword': null,
                'email': 'us********@testss.com',
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
                        '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'}]',
                    'createdDate': null,
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
                    'noOfMembers': 1,
                    'status': null
                },
                'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'profileVisibility': {
                    'skills': 'private',
                    'address': 'private',
                    'profileSummary': 'private'
                },
                'thumbnail': null,
                'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'address': [
                    {
                        'country': 'dsfg',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'city': 'dsf',
                        'updatedDate': '2018-02-21 08:54:46:451+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'zipcode': '560015',
                        'addType': 'current',
                        'createdDate': '2018-01-28 17:31:11:677+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressLine1': 'sadf',
                        'addressLine2': 'sdf',
                        'id': '01242858643843481618',
                        'state': 'dsfff'
                    },
                    {
                        'country': 'zxc',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'city': 'dszfx',
                        'updatedDate': '2018-02-21 08:54:46:515+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'zipcode': '560017',
                        'addType': 'current',
                        'createdDate': '2018-01-28 17:30:35:711+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressLine1': 'sdsf',
                        'addressLine2': 'sdf',
                        'id': '01242858632795750422',
                        'state': 'ds'
                    }
                ],
                'jobProfile': [
                    {
                        'jobName': 'hhH',
                        'orgName': 'hhh',
                        'role': 'bnmnghbgg',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endDate': null,
                        'isVerified': null,
                        'subject': [
                            'Assamese'
                        ],
                        'joiningDate': '2017-10-19',
                        'updatedDate': '2018-02-21 08:49:05:880+0000',
                        'isCurrentJob': false,
                        'verifiedBy': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardName': null,
                        'orgId': null,
                        'addressId': null,
                        'createdDate': '2017-12-06 16:15:28:684+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'verifiedDate': null,
                        'isRejected': null,
                        'id': '01239103162216448010'
                    },
                    {
                        'jobName': 'dcv',
                        'orgName': 'dsf',
                        'role': 'dfgdd',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endDate': null,
                        'isVerified': null,
                        'subject': [
                            'Bengali'
                        ],
                        'joiningDate': '2018-02-06',
                        'updatedDate': '2018-02-21 08:49:05:886+0000',
                        'isCurrentJob': false,
                        'verifiedBy': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardName': null,
                        'orgId': null,
                        'addressId': null,
                        'createdDate': '2018-02-18 05:47:58:561+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'verifiedDate': null,
                        'isRejected': null,
                        'id': '0124430985025290242'
                    }
                ],
                'profileSummary': 'asdd',
                'tcUpdatedDate': null,
                'avatar':
                    'https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png',
                'userName': 'ntptest102',
                'rootOrgId': 'ORG_001',
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'emailVerified': null,
                'firstName': 'Cretation',
                'lastLoginTime': 1519809987692,
                'createdDate': '2017-10-31 10:47:04:723+0000',
                'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45',
                'phone': '******4412',
                'dob': null,
                'registeredOrg': {
                    'dateTime': null,
                    'preferredLanguage': null,
                    'approvedBy': null,
                    'channel': null,
                    'description': null,
                    'updatedDate': '2017-11-17 09:00:59:342+0000',
                    'addressId': null,
                    'orgType': null,
                    'provider': null,
                    'orgCode': null,
                    'locationId': '0123668622585610242',
                    'theme': null,
                    'id': '0123653943740170242',
                    'communityId': null,
                    'isApproved': null,
                    'slug': null,
                    'identifier': '0123653943740170242',
                    'thumbnail': null,
                    'orgName': 'QA ORG',
                    'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                    'externalId': null,
                    'isRootOrg': false,
                    'rootOrgId': 'ORG_001',
                    'approvedDate': null,
                    'imgUrl': null,
                    'homeUrl': null,
                    'orgTypeId': null,
                    'isDefault': null,
                    'contactDetail': [],
                    'createdDate': '2017-10-31 10:43:48:600+0000',
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': '0123653943740170242',
                    'noOfMembers': null,
                    'status': 1
                },
                'grade': [
                    'Grade 2'
                ],
                'currentLoginTime': null,
                'location': '',
                'status': 1,
                'userOrgDetails': {
                    'PUBLIC': {
                        'orgId': '01285019302823526477',
                        'orgName': 'ORG_001'
                    },
                    'COURSE_MENTOR': {
                        'orgId': '01285019302823526477', 'orgName': 'ORG_001'
                    },
                    'COURSE_CREATOR': {
                        'orgId': '01285019302823526477', 'orgName': 'ORG_001'
                    }
                }
            }
        }
    },
    rootOrgSuccess: {
        'id': 'api.user.read',
        'ver': 'v1',
        'ts': '2018-02-28 12:07:33:518+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'bdf695fd-3916-adb0-2072-1d53deb14aea',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'missingFields': [
                    'dob',
                    'location'
                ],
                'lastName': 'User',
                'webPages': [
                    {
                        'type': 'fb',
                        'url': 'https://www.facebook.com/gjh'
                    }
                ],
                'tcStatus': null,
                'loginId': 'ntptest102',
                'education': [
                    {
                        'updatedBy': null,
                        'yearOfPassing': 0,
                        'degree': 'hhj',
                        'updatedDate': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressId': null,
                        'duration': null,
                        'courseName': null,
                        'createdDate': '2017-11-30 13:19:47:276+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardOrUniversity': '',
                        'grade': '',
                        'percentage': null,
                        'name': 'g',
                        'id': '0123867019537448963'
                    },
                    {
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'yearOfPassing': 2000,
                        'degree': 'ahd',
                        'updatedDate': '2017-12-06 13:52:13:291+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressId': null,
                        'duration': null,
                        'courseName': null,
                        'createdDate': '2017-12-06 13:50:59:915+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardOrUniversity': '',
                        'grade': 'F',
                        'percentage': 999,
                        'name': 'djd',
                        'id': '0123909651904757763'
                    }
                ],
                'gender': 'female',
                'regOrgId': '0123653943740170242',
                'subject': [
                    'Gujarati',
                    'Kannada'
                ],
                'language': [
                    'Bengali'
                ],
                'updatedDate': '2018-02-21 08:54:46:436+0000',
                'completeness': 88,
                'skills': [
                    {
                        'skillName': 'bnn',
                        'addedAt': '2018-02-17',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-02-17',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'f2f8f18e45d2ede1eb93f40dd53e11290814fd5999d056181d919f219c9fda03',
                        'skillNameToLowercase': 'bnn',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'as',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '8ef363f359f68c7db0e1422f29e97632229d2ce92ad95cbd2525b068f8cbc2cf',
                        'skillNameToLowercase': 'as',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'java',
                        'addedAt': '2017-11-19',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-19',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '9f96b0187dff50353a1ca9bb5177324f61d6c725fe7f050938b0c530ad2d82d8',
                        'skillNameToLowercase': 'java',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'kafka123',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'abefe2638ec556faad62ca18d9214e8175584e87ff70c27e566c74727789790f',
                        'skillNameToLowercase': 'kafka123',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asllfhsal',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'e00543bb0c0fc0822136eaf17223be0d7c2fc8f4b5f5c2a0a2c902c5aaed4a1f',
                        'skillNameToLowercase': 'asllfhsal',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'purescript',
                        'addedAt': '2017-11-17',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-17',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'ee5c047f3b2f552f7cd31dffefc87bdcd34d9adac9a44ed79e44498136ff821d',
                        'skillNameToLowercase': 'purescript',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'angular',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '65fc8fb2cc0f5a54f30d3fe412631184820abc73a390ee66bea000680af2b0ff',
                        'skillNameToLowercase': 'angular',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'graph database - neo4g',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '5bdf5759b63e106897a22ce960fdeca108da759e105d25cf2ccb0fb8e8fb54b8',
                        'skillNameToLowercase': 'graph database - neo4g',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'kafka',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '17759f5c8024ab470190c2b2da1554ed693a2a5d93aba9bcc27c42889146eaea',
                        'skillNameToLowercase': 'kafka',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'apis design',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'a05fc5f9e82344b4adbc8b5a51b10f7133946667e1724bf7df1705e8b8c1e462',
                        'skillNameToLowercase': 'apis design',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asflashf',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '0f419edad82dd10f6d49b0f38622a12365a8ce8356100004fa4aa17352b7a32f',
                        'skillNameToLowercase': 'asflashf',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'asfajsfh',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '50985029eea591602cc64e243ceb2679688639fe5f3cdccde79eb94248dfc303',
                        'skillNameToLowercase': 'asfajsfh',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'akka',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '8f8ced5c48869be76c3fde50be6221a7cd34ddae4887959f612ddb3e7ba34ed9',
                        'skillNameToLowercase': 'akka',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'test',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': 'cdbfc1812b172e1362e384bdd42ea13360333d8ad6140064a5a81d8ec3d72002',
                        'skillNameToLowercase': 'test',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'afjalskf',
                        'addedAt': '2018-01-28',
                        'endorsersList': [
                            {
                                'endorseDate': '2018-01-28',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '28acdc61a6865a2cf571083dbc50684878f718efde54502c12e0b02c729a932b',
                        'skillNameToLowercase': 'afjalskf',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    },
                    {
                        'skillName': 'cassandra',
                        'addedAt': '2017-11-19',
                        'endorsersList': [
                            {
                                'endorseDate': '2017-11-19',
                                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                            }
                        ],
                        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endorsementcount': 0,
                        'id': '54b258bb673e38b7159de94a3746ab60f232535364ee05bce0d91bcc215236d7',
                        'skillNameToLowercase': 'cassandra',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    }
                ],
                'isDeleted': null,
                'organisations': [
                    {
                        'organisationId': 'ORG_001',
                        'updatedBy': null,
                        'addedByName': null,
                        'addedBy': null,
                        'roles': [
                            'CONTENT_CREATION',
                            'PUBLIC',
                            'ORG_ADMIN'
                        ],
                        'approvedBy': null,
                        'updatedDate': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'approvaldate': null,
                        'isDeleted': false,
                        'isRejected': null,
                        'id': '01236539426110668816',
                        'position': 'ASD',
                        'isApproved': null,
                        'orgjoindate': '2017-10-31 10:47:04:732+0000',
                        'orgLeftDate': null
                    }
                ],
                'provider': null,
                'countryCode': null,
                'id': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'tempPassword': null,
                'email': 'us********@testss.com',
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
                        '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'}]',
                    'createdDate': null,
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
                    'noOfMembers': 1,
                    'status': null
                },
                'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'profileVisibility': {
                    'skills': 'private',
                    'address': 'private',
                    'profileSummary': 'private'
                },
                'thumbnail': null,
                'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'address': [
                    {
                        'country': 'dsfg',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'city': 'dsf',
                        'updatedDate': '2018-02-21 08:54:46:451+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'zipcode': '560015',
                        'addType': 'current',
                        'createdDate': '2018-01-28 17:31:11:677+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressLine1': 'sadf',
                        'addressLine2': 'sdf',
                        'id': '01242858643843481618',
                        'state': 'dsfff'
                    },
                    {
                        'country': 'zxc',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'city': 'dszfx',
                        'updatedDate': '2018-02-21 08:54:46:515+0000',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'zipcode': '560017',
                        'addType': 'current',
                        'createdDate': '2018-01-28 17:30:35:711+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'addressLine1': 'sdsf',
                        'addressLine2': 'sdf',
                        'id': '01242858632795750422',
                        'state': 'ds'
                    }
                ],
                'jobProfile': [
                    {
                        'jobName': 'hhH',
                        'orgName': 'hhh',
                        'role': 'bnmnghbgg',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endDate': null,
                        'isVerified': null,
                        'subject': [
                            'Assamese'
                        ],
                        'joiningDate': '2017-10-19',
                        'updatedDate': '2018-02-21 08:49:05:880+0000',
                        'isCurrentJob': false,
                        'verifiedBy': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardName': null,
                        'orgId': null,
                        'addressId': null,
                        'createdDate': '2017-12-06 16:15:28:684+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'verifiedDate': null,
                        'isRejected': null,
                        'id': '01239103162216448010'
                    },
                    {
                        'jobName': 'dcv',
                        'orgName': 'dsf',
                        'role': 'dfgdd',
                        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'endDate': null,
                        'isVerified': null,
                        'subject': [
                            'Bengali'
                        ],
                        'joiningDate': '2018-02-06',
                        'updatedDate': '2018-02-21 08:49:05:886+0000',
                        'isCurrentJob': false,
                        'verifiedBy': null,
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'boardName': null,
                        'orgId': null,
                        'addressId': null,
                        'createdDate': '2018-02-18 05:47:58:561+0000',
                        'isDeleted': null,
                        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                        'verifiedDate': null,
                        'isRejected': null,
                        'id': '0124430985025290242'
                    }
                ],
                'profileSummary': 'asdd',
                'tcUpdatedDate': null,
                'avatar':
                    'https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png',
                'userName': 'ntptest102',
                'rootOrgId': 'ORG_001',
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'emailVerified': null,
                'firstName': 'Cretation',
                'lastLoginTime': 1519809987692,
                'createdDate': '2017-10-31 10:47:04:723+0000',
                'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45',
                'phone': '******4412',
                'dob': null,
                'registeredOrg': {
                    'dateTime': null,
                    'preferredLanguage': null,
                    'approvedBy': null,
                    'channel': null,
                    'description': null,
                    'updatedDate': '2017-11-17 09:00:59:342+0000',
                    'addressId': null,
                    'orgType': null,
                    'provider': null,
                    'orgCode': null,
                    'locationId': '0123668622585610242',
                    'theme': null,
                    'id': '0123653943740170242',
                    'communityId': null,
                    'isApproved': null,
                    'slug': null,
                    'identifier': '0123653943740170242',
                    'thumbnail': null,
                    'orgName': 'QA ORG',
                    'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                    'externalId': null,
                    'isRootOrg': false,
                    'rootOrgId': 'ORG_001',
                    'approvedDate': null,
                    'imgUrl': null,
                    'homeUrl': null,
                    'orgTypeId': null,
                    'isDefault': null,
                    'contactDetail': [],
                    'createdDate': '2017-10-31 10:43:48:600+0000',
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': '0123653943740170242',
                    'noOfMembers': null,
                    'status': 1
                },
                'grade': [
                    'Grade 2'
                ],
                'currentLoginTime': null,
                'location': '',
                'status': 1,
                'roles': [
                    {
                        'role': 'CONTENT_CREATOR',
                        'createdDate': null,
                        'updatedBy': '1405f334-ee59-42fc-befb-51986221881e',
                        'createdBy': 'fbe926ac-a395-40e4-a65b-9b4f711d7642',
                        'scope': [
                            {
                                'organisationId': '01269878797503692810'
                            }
                        ],
                        'updatedDate': null
                    },
                    {
                        'role': 'ORG_ADMIN',
                        'createdDate': null,
                        'updatedBy': '1405f334-ee59-42fc-befb-51986221881e',
                        'createdBy': 'fbe926ac-a395-40e4-a65b-9b4f711d7642',
                        'scope': [
                            {
                                'organisationId': '01269878797503692810'
                            }
                        ],
                        'updatedDate': null
                    }
                ]
            }
        }
    },
    feedSuccessResponse: {
        'id': null,
        'ver': null,
        'ts': null,
        'params': null,
        'responseCode': 'OK',
        'result': {
            'response': {
                'userFeed': [
                    {
                        'expireOn': 1574611273492,
                        'feedData': {
                            'channel': [
                                'TN',
                                'RJ',
                                'AP'
                            ],
                            'order': 1
                        },
                        'createdBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
                        'closable': false,
                        'channel': 'TN',
                        'feedAction': 'unRead',
                        'id': '01289921810742476874',
                        'category': 'orgMigrationAction',
                        'priority': 1,
                        'userId': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
                        'createdOn': 1574611273492
                    }
                ]
            }
        }
    },
    migrateSuccessResponse: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:02:28:841+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'errors': []
        }
    },
    userProfile: {
        'missingFields': [
            'dob',
            'location'
        ],
        'lastName': 'User',
        'webPages': [
            {
                'type': 'fb',
                'url': 'https://www.facebook.com/gjh'
            }
        ],
        'tcStatus': null,
        'loginId': 'ntptest102',
        'education': [
            {
                'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'yearOfPassing': 2000,
                'degree': 'ahd',
                'updatedDate': '2017-12-06 13:52:13:291+0000',
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'addressId': null,
                'duration': null,
                'courseName': null,
                'createdDate': '2017-12-06 13:50:59:915+0000',
                'isDeleted': null,
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'boardOrUniversity': '',
                'grade': 'F',
                'percentage': 999,
                'name': 'djd',
                'id': '0123909651904757763'
            }
        ],
        'gender': 'female',
        'regOrgId': '0123653943740170242',
        'subject': [
            'Gujarati',
            'Kannada'
        ],
        'roles': [
            'public'
        ],
        'language': [
            'Kannada'
        ],
        'updatedDate': '2017-12-06 13:52:13:291+0000',
        'completeness': 88,
        'skills': [
            {
                'skillName': 'bnn',
                'addedAt': '2018-02-17',
                'endorsersList': [
                    {
                        'endorseDate': '2018-02-17',
                        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
                    }
                ],
                'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'endorsementcount': 0,
                'id': 'f2f8f18e45d2ede1eb93f40dd53e11290814fd5999d056181d919f219c9fda03',
                'skillNameToLowercase': 'bnn',
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
            }
        ],
        'isDeleted': false,
        'provider': null,
        'countryCode': null,
        'id': '0123867019537448963',
        'tempPassword': null,
        'email': 'us********@testss.com',
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
                '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'}]',
            'createdDate': null,
            'createdBy': null,
            'parentOrgId': null,
            'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'noOfMembers': 1,
            'status': null
        },
        'identifier': '0123653943740170242',
        'profileVisibility': {
            'skills': 'private',
            'address': 'private',
            'profileSummary': 'private'
        },
        'thumbnail': null,
        'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'address': [
            {
                'country': 'dsfg',
                'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'city': 'dsf',
                'updatedDate': '2018-02-21 08:54:46:451+0000',
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'zipcode': '560015',
                'addType': 'current',
                'createdDate': '2018-01-28 17:31:11:677+0000',
                'isDeleted': null,
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'addressLine1': 'sadf',
                'addressLine2': 'sdf',
                'id': '01242858643843481618',
                'state': 'dsfff'
            }
        ],
        'jobProfile': [
            {
                'jobName': 'hhH',
                'orgName': 'hhh',
                'role': 'bnmnghbgg',
                'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'endDate': null,
                'isVerified': null,
                'subject': [
                    'Assamese'
                ],
                'joiningDate': '2017-10-19',
                'updatedDate': '2018-02-21 08:49:05:880+0000',
                'isCurrentJob': false,
                'verifiedBy': null,
                'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'boardName': null,
                'orgId': null,
                'addressId': null,
                'createdDate': '2017-12-06 16:15:28:684+0000',
                'isDeleted': null,
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'verifiedDate': null,
                'isRejected': null,
                'id': '01239103162216448010'
            }
        ],
        'profileSummary': 'asdd',
        'tcUpdatedDate': null,
        'avatar': null,
        'userName': 'ntptest102',
        'rootOrgId': 'ORG_001',
        'userId': '0008ccab-2103-46c9-adba-6cdf84d37f06',
        'emailVerified': 'true',
        'firstName': 'test',
        'lastLoginTime': 123456,
        'createdDate': '2017-12-06 16:15:28:684+0000',
        'createdBy': '0008ccab-2103-46c9-adba-6cdf84d37f06',
        'phone': '1234567890',
        'dob': '2021',
        'registeredOrg': {
            'dateTime': null,
            'preferredLanguage': null,
            'approvedBy': null,
            'channel': null,
            'description': null,
            'updatedDate': '2017-11-17 09:00:59:342+0000',
            'addressId': null,
            'orgType': null,
            'provider': null,
            'orgCode': null,
            'locationId': '0123668622585610242',
            'theme': null,
            'id': '0123653943740170242',
            'communityId': null,
            'isApproved': null,
            'slug': null,
            'identifier': '0123653943740170242',
            'thumbnail': null,
            'orgName': 'QA ORG',
            'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
            'externalId': null,
            'isRootOrg': false,
            'rootOrgId': 'ORG_001',
            'approvedDate': null,
            'imgUrl': null,
            'homeUrl': null,
            'orgTypeId': null,
            'isDefault': null,
            'contactDetail': [],
            'createdDate': '2017-10-31 10:43:48:600+0000',
            'createdBy': null,
            'parentOrgId': null,
            'hashTagId': '0123653943740170242',
            'noOfMembers': null,
            'status': 1
        },
        'currentLoginTime': null,
        'location': '',
        'status': 1
    },
    UserOrganization: {
        'organisationId': '01269878797503692810',
        'identifier': '0123653943740170242',
        'orgName': 'QA ORG',
        'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
        'addedByName': null,
        'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'roles': [
            'public'
        ],
        'approvedBy': null,
        'updatedDate': '2017-11-17 09:00:59:342+0000',
        'userId': '0008ccab-2103-46c9-adba-6cdf84d37f06',
        'approvaldate': '2017-11-17 09:00:59:342+0000',
        'isDeleted': null,
        'isRejected': null,
        'id': '01239103162216448010',
        'position': 'ASD',
        'isApproved': null,
        'orgjoindate': '2017-10-31 10:47:04:732+0000',
        'orgLeftDate': null,
        'hashTagId': '0123653943740170242',
    }
};

