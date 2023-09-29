export const mockRes = {
    formData: [{
        'code': 'name',
        'dataType': 'text',
        'name': 'Name',
        'label': 'Name',
        'description': 'Enter your name',
        'editable': true,
        'inputType': 'input',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'fieldColumnWidth': 'twelve'
        },
        'index': 1
    }, {
        'code': 'tnc',
        'dataType': 'text',
        'name': 'tnc',
        'label': 'I understand and accept the {instance} Terms of Use.',
        'description': '',
        'editable': true,
        'inputType': 'checkbox',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'fieldColumnWidth': 'twelve'
        },
        'index': 2
    }],
    tncParsedConfigData: {
        'latestVersion': 'v1',
        'v1': {
            'url': 'https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html'
        },
        'v2': {
            'url': 'https://preprodall.blob.core.windows.net/termsandcond/terms-and-conditions-v2.html'
        },
        'v4': {
            'url': 'https://preprodall.blob.core.windows.net/termsandcond/terms-and-conditions-v4.html'
        }
    },
    tncConfigData: {
        'id': 'api.system.settings.get.tncConfig',
        'ver': 'v1',
        'ts': '2020-05-26 09:10:12:378+0000',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'id': 'tncConfig',
                'field': 'tncConfig',
                'value': '{\'latestVersion\':\'v1\',\'v1\':{\'url\':\'https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html\'},\'v2\':{\'url\':\'https://preprodall.blob.core.windows.net/termsandcond/terms-and-conditions-v2.html\'},\'v4\':{\'url\':\'https://preprodall.blob.core.windows.net/termsandcond/terms-and-conditions-v4.html\'}}'
            }
        }
    },
    createUser: {
        'id': '',
        'ver': 'v4',
        'ts': '2020-05-26 09:46:38:598+0000',
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
            'userId': '4da27444-7c96-48f3-a85f-d7d82709519d'
        }
    },
    tncAccept: {
        'id': 'api.user.tnc.accept',
        'ver': 'v1',
        'ts': '2020-05-26 09:46:38:767+0000',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS'
        }
    },
    userData: {
        'tcStatus': null,
        'maskedPhone': null,
        'rootOrgName': 'CustROOTOrg10',
        'subject': [],
        'channel': 'custchannel',
        'language': [],
        'updatedDate': '2020-05-19 06:49:26:828+0000',
        'flagsValue': 2,
        'id': 'fd4227f7-9de8-40b4-af82-edb8cbd14fb1',
        'recoveryEmail': '',
        'identifier': 'fd4227f7-9de8-40b4-af82-edb8cbd14fb1',
        'thumbnail': null,
        'profileVisibility': {
            'lastName': 'public',
            'webPages': 'private',
            'jobProfile': 'private',
            'address': 'private',
            'education': 'private',
            'gender': 'private',
            'profileSummary': 'public',
            'subject': 'private',
            'language': 'private',
            'avatar': 'private',
            'userName': 'public',
            'skills': 'private',
            'firstName': 'public',
            'badgeAssertions': 'private',
            'phone': 'private',
            'countryCode': 'private',
            'dob': 'private',
            'grade': 'private',
            'location': 'private',
            'email': 'private'
        },
        'updatedBy': 'fd4227f7-9de8-40b4-af82-edb8cbd14fb1',
        'accesscode': null,
        'externalIds': [],
        'registryId': null,
        'roleList': [{
            'name': 'Content Curation',
            'id': 'CONTENT_CURATION'
        }, {
            'name': 'Content Creator',
            'id': 'CONTENT_CREATOR'
        }, {
            'name': 'Official TextBook Badge Issuer',
            'id': 'OFFICIAL_TEXTBOOK_BADGE_ISSUER'
        }, {
            'name': 'Admin',
            'id': 'ADMIN'
        }, {
            'name': 'Course Mentor',
            'id': 'COURSE_MENTOR'
        }, {
            'name': 'Org Admin',
            'id': 'ORG_ADMIN'
        }, {
            'name': 'Content Review',
            'id': 'CONTENT_REVIEW'
        }, {
            'name': 'Flag Reviewer',
            'id': 'FLAG_REVIEWER'
        }, {
            'name': 'Announcement Sender',
            'id': 'ANNOUNCEMENT_SENDER'
        }, {
            'name': 'System Administration',
            'id': 'SYSTEM_ADMINISTRATION'
        }, {
            'name': 'Book Creator',
            'id': 'BOOK_CREATOR'
        }, {
            'name': 'Course Creator',
            'id': 'COURSE_CREATOR'
        }, {
            'name': 'Report Viewer',
            'id': 'REPORT_VIEWER'
        }, {
            'name': 'Flag Reviewer',
            'id': 'FLAG_REVIEWER '
        }, {
            'name': 'Membership Management',
            'id': 'MEMBERSHIP_MANAGEMENT'
        }, {
            'name': 'Content Creation',
            'id': 'CONTENT_CREATION'
        }, {
            'name': 'Book Reviewer',
            'id': 'BOOK_REVIEWER'
        }, {
            'name': 'Teacher Badge Issuer',
            'id': 'TEACHER_BADGE_ISSUER'
        }, {
            'name': 'Org Management',
            'id': 'ORG_MANAGEMENT'
        }, {
            'name': 'Course Admin',
            'id': 'COURSE_ADMIN'
        }, {
            'name': 'Org Moderator',
            'id': 'ORG_MODERATOR'
        }, {
            'name': 'Public',
            'id': 'PUBLIC'
        }, {
            'name': 'Content Reviewer',
            'id': 'CONTENT_REVIEWER'
        }, {
            'name': 'Report Admin',
            'id': 'REPORT_ADMIN'
        }],
        'rootOrgId': '01285019302823526477',
        'prevUsedEmail': '',
        'firstName': 'create user',
        'tncAcceptedOn': '2020-05-06T11:21:44.896Z',
        'phone': '',
        'dob': null,
        'grade': [],
        'currentLoginTime': null,
        'userType': 'OTHER',
        'status': 1,
        'lastName': null,
        'tncLatestVersion': 'v1',
        'gender': null,
        'roles': ['PUBLIC'],
        'prevUsedPhone': '',
        'stateValidated': false,
        'badgeAssertions': [],
        'isDeleted': false,
        'organisations': [{
            'updatedBy': null,
            'organisationId': '01285019302823526477',
            'orgName': 'CustROOTOrg10',
            'addedByName': null,
            'addedBy': null,
            'roles': ['PUBLIC'],
            'approvedBy': null,
            'channel': 'custchannel',
            'locationIds': [],
            'updatedDate': null,
            'userId': 'fd4227f7-9de8-40b4-af82-edb8cbd14fb1',
            'approvaldate': null,
            'isDeleted': false,
            'parentOrgId': null,
            'hashTagId': '01285019302823526477',
            'isRejected': null,
            'locations': [],
            'position': null,
            'id': '01301515981459456053',
            'orgjoindate': '2020-05-06 11:19:24:087+0000',
            'isApproved': null,
            'orgLeftDate': null
        }, {
            'updatedBy': null,
            'organisationId': 'ORG_001',
            'orgName': 'Sunbird',
            'addedByName': null,
            'addedBy': null,
            'roles': ['COURSE_MENTOR', 'COURSE_CREATOR', 'PUBLIC'],
            'approvedBy': null,
            'channel': 'ROOT_ORG',
            'locationIds': ['969dd3c1-4e98-4c17-a994-559f2dc70e18'],
            'updatedDate': '2020-05-11 06:45:33:340+0000',
            'userId': 'fd4227f7-9de8-40b4-af82-edb8cbd14fb1',
            'approvaldate': '2020-05-06 11:20:26:813+0000',
            'isDeleted': false,
            'parentOrgId': null,
            'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'isRejected': false,
            'locations': [{
                'code': '29',
                'name': 'Karnataka',
                'id': '969dd3c1-4e98-4c17-a994-559f2dc70e18',
                'type': 'state'
            }],
            'position': null,
            'id': '01301516308463616054',
            'orgjoindate': '2020-05-06 11:20:26:813+0000',
            'isApproved': true,
            'orgLeftDate': null
        }],
        'provider': null,
        'countryCode': '+91',
        'tncLatestVersionUrl': 'https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html',
        'maskedEmail': 'co***********@yopmail.com',
        'tempPassword': null,
        'email': 'co***********@yopmail.com',
        'rootOrg': {
            'dateTime': null,
            'preferredLanguage': null,
            'keys': {},
            'channel': 'custchannel',
            'approvedBy': null,
            'description': null,
            'updatedDate': null,
            'addressId': null,
            'orgType': null,
            'provider': 'custchannel',
            'orgCode': null,
            'locationId': null,
            'theme': null,
            'id': '01285019302823526477',
            'isApproved': null,
            'communityId': null,
            'slug': 'custchannel',
            'email': null,
            'identifier': '01285019302823526477',
            'thumbnail': null,
            'updatedBy': null,
            'orgName': 'CustROOTOrg10',
            'address': {},
            'locationIds': [],
            'externalId': 'custexternalid',
            'isRootOrg': true,
            'rootOrgId': '01285019302823526477',
            'imgUrl': null,
            'approvedDate': null,
            'orgTypeId': null,
            'homeUrl': null,
            'isDefault': null,
            'createdDate': '2019-09-16 09:40:27:984+0000',
            'parentOrgId': null,
            'createdBy': null,
            'hashTagId': '01285019302823526477',
            'noOfMembers': null,
            'status': 1
        },
        'defaultProfileFieldVisibility': 'private',
        'profileSummary': null,
        'phoneVerified': false,
        'tcUpdatedDate': null,
        'userLocations': [{
            'code': '29',
            'name': 'Karnataka',
            'id': '969dd3c1-4e98-4c17-a994-559f2dc70e18',
            'type': 'state'
        }, {
            'code': '2901',
            'name': 'BELAGAVI',
            'id': '88b8894d-ff3a-4cc7-aef7-fd90f9a66c2b',
            'type': 'district',
            'parentId': '969dd3c1-4e98-4c17-a994-559f2dc70e18'
        }],
        'recoveryPhone': '',
        'userName': 'coursecreator',
        'userId': 'fd4227f7-9de8-40b4-af82-edb8cbd14fb1',
        'promptTnC': false,
        'emailVerified': true,
        'framework': {},
        'createdDate': '2020-05-06 11:19:24:053+0000',
        'managedby': null,
        'createdBy': null,
        'location': null,
        'tncAcceptedVersion': 'v1',
        'skills': [],
        'rootOrgAdmin': false,
        'userRoles': ['PUBLIC', 'COURSE_MENTOR', 'COURSE_CREATOR'],
        'orgRoleMap': {
            '01285019302823526477': ['PUBLIC'],
            'ORG_001': ['COURSE_MENTOR', 'COURSE_CREATOR', 'PUBLIC']
        },
        'organisationIds': ['01285019302823526477', 'ORG_001'],
        'hashTagIds': ['01285019302823526477', 'b00bc992ef25f1a9a8d63291e20efc8d'],
        'roleOrgMap': {
            'PUBLIC': ['01285019302823526477', 'ORG_001'],
            'COURSE_MENTOR': ['01285019302823526477', 'ORG_001'],
            'COURSE_CREATOR': ['01285019302823526477', 'ORG_001']
        },
        'userOrgDetails': {
            'PUBLIC': {
                'orgId': '01285019302823526477',
                'orgName': 'ORG_001'},
            'COURSE_MENTOR': {
                'orgId': '01285019302823526477', 'orgName': 'ORG_001'},
            'COURSE_CREATOR': {
                'orgId': '01285019302823526477',  'orgName': 'ORG_001'}
        },
        'organisationNames': ['CustROOTOrg10', 'Sunbird']
    }
};
