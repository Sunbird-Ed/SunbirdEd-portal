export const mockData: any = {
    telemetry: {
        'userOrgDetails': {
            'userId': '781c21fc-5054-4ee0-9a02-fbb1006a4fdd',
            'rootOrgId': 'ORG_001',
            'rootOrg': {
                'dateTime': null,
                'preferredLanguage': 'English',
                'approvedBy': null,
                'channel': 'ROOT_ORG',
                'description': 'Andhra State Boardsssssss',
                'updatedDate': '2018-04-20 12:31:12:435+0000',
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
                'updatedBy': '1d7b85b0-3502-4536-a846-d3a51fd0aeea',
                'address': {
                    'country': 'India',
                    'zipCode': '560035',
                    'createdDate': '2017-07-12 03:46:11:112+0530',
                    'updatedBy': '781c21fc-5054-4ee0-9a02-fbb1006a4fdd',
                    'city': 'bangalore',
                    'createdBy': '7d086e8c-68ac-4aaa-8b91-d75ff922bae5',
                    'state': 'Karnataka',
                    'id': '01247011624949350416'
                },
                'externalId': null,
                'isRootOrg': true,
                'rootOrgId': 'ORG_001',
                'approvedDate': null,
                'imgUrl': null,
                'homeUrl': null,
                'isDefault': null,
                'contactDetail': [],
                'createdDate': null,
                'createdBy': null,
                'parentOrgId': null,
                'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
                'noOfMembers': 1,
                'status': null
            },
            'organisationIds': [
                'ORG_001'
            ]
        },
        'config': {
            'pdata': {
                'id': 'org.sunbird',
                'ver': '1.0.0',
                'pid': '2345243'
            },
            'endpoint': 'http://localhost:3000',
            'apislug': '/data/v1/telemetry',
            'uid': '781c21fc-5054-4ee0-9a02-fbb1006a4fdd',
            'sid': 'RjdZzr-H6lTYm-0pqLMeCGj6GssHTpac',
            'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'env': 'home'
        }
    },
    telemetryEvent: {
        'contentId': '34ae4320-388d-11e8-b47d-596d7600c985',
        'contentVer': '1.0',
        'options': {

        },
        'edata': {
            'type': 'announcement',
            'mode': 'announcement',
            'pageid': 'annoluncement-create',
            'uaspec': {}
        }
    },
    startInputData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '34ae4320-388d-11e8-b47d-596d7600c985',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'type': 'workflow',
            'pageid': 'announcement-create',
            'mode': 'create'
        }
    },
    impressionInputData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'type': 'announcement',
            'subtype': 'announcement',
            'pageid': 'announcement-create',
            'uri': '/announcement/create'
        }
    },
    interactEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'id': '123456',
            'pageid': 'announcement-create',
            'type': 'click',
            'subtype': ''
        }
    },
    shareEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'dir': 'out',
            'type': 'link',
            'items': []
        }

    },
    errorEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'err': '500',
            'errtype': 'SERVER_ERROR',
            'stacktrace': 'error'
        }
    },
    endEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'contentId': '34ae4320-388d-11e8-b47d-596d7600c985',
            'pageid': 'announcement-create',
            'type': 'announcement',
            'mode': 'announcement',
            'summary': []
        }
    },
    logEventData: {
        'context': {
            'env': 'announcement'
        },
        'object': {
            'id': '',
            'type': 'announcement',
            'ver': '1.0'
        },
        'edata': {
            'type': 'api_call',
            'level': '1',
            'message': 'api to load inbox'
        }
    },
    userSessionData: {
        'userId': '99733cb8-588a-42af-8161-57e783351a0e'
    }
};
