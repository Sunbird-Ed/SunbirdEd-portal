export const response = {
    cutodianOrgData: {
        'id': 'api.system.settings.get.custodianOrgId',
        'ver': '1.0',
        'ts': '2019-12-05T04:36:57.303Z',
        'params': {
            'resmsgid': '620244d0-289f-418a-a329-b5c3927bfb61',
            'msgid': '56d3e56f-2fd7-413e-924c-adc74c055659',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'id': 'custodianOrgId',
                'field': 'custodianOrgId',
                'value': '01285019302823526477'
            }
        }
    },
    userData: {
        'framework': {
            'id': '505c7c48ac6dc1edc9b08f21db5a571d',
            'board': 'State test 2',
            'medium': ['English'],
            'gradeLevel': ['Class 4', 'Class 6']
        },
        'formatedName': 'guest',
        'name': 'guest',
        'createdOn': 1575441443724,
        'updatedOn': 1575441443724,
        '_id': '4add04b9-43e0-4f1e-81eb-03ff1a131faa',
        'location': {
            'state': {
                'code': '29',
                'name': 'test_state_1',
                'id': '4a6d77a1-6653-4e30-9be8-93371b6b53b5',
                'type': 'state'
            },
            'city': {
                'code': '2907',
                'name': 'test_district_1',
                'id': 'cde02789-5803-424b-a3f5-10db347280e9',
                'type': 'district',
                'parentId': '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
            }
        }
    },
    channelData: {
        'id': 'api.channel.read',
        'ver': '1.0',
        'ts': '2019-12-05T05:10:35.812Z',
        'params': {
            'resmsgid': '3ef10620-f456-48b6-8c94-8bc7c9d9f00e',
            'msgid': 'b17d8bcf-3f66-44d4-b036-6fe49462a610',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'channel': {
                'identifier': '505c7c48ac6dc1edc9b08f21db5a571d',
                'code': '505c7c48ac6dc1edc9b08f21db5a571d',
                'consumerId': '0aa13c48-dda0-4259-9007-c795dacd7b9c',
                'channel': 'test',
                'description': 'This is test channel',
                'suggested_frameworks': [{
                    'identifier': 'test_k-12',
                    'code': 'test_k-12',
                    'name': 'Test Framework',
                    'objectType': 'Framework'
                }],
                'frameworks': [{
                    'identifier': 'as_k-12',
                    'name': 'State Test 1',
                    'objectType': 'Framework',
                    'relation': 'hasSequenceMember',
                    'description': 'as_k-12 test',
                    'index': 3,
                    'status': 'Live'
                }, {
                    'identifier': 'ka_k-12',
                    'name': 'State test 2',
                    'objectType': 'Framework',
                    'relation': 'hasSequenceMember',
                    'description': 'State test 2',
                    'index': 13,
                    'status': 'Live'
                }],
                'createdOn': '2018-02-12T11:38:44.292+0000',
                'versionKey': '1518435524292',
                'appId': 'sunbird_portal',
                'name': 'sunbird',
                'lastUpdatedOn': '2018-02-12T11:38:44.292+0000',
                'defaultFramework': 'TEST',
                'status': 'Live'
            }
        }
    },
    frameWorkData: {
        'id': 'api.framework.read',
        'ver': '1.0',
        'ts': '2019-12-05T05:16:44.720Z',
        'params': {
            'resmsgid': '96e5758a-3111-4fac-8b3f-985d924eebb4',
            'msgid': 'd632dcef-eaff-4802-8ad6-2ce05dbc2545',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'framework': {
                'identifier': 'ka_k-12',
                'code': 'ka_k-12',
                'name': 'State (Test 1)',
                'description': 'State (Test 1)',
                'categories': [{
                    'identifier': 'ka_k-12_board',
                    'code': 'board',
                    'terms': [{
                        'associations': [{
                            'identifier': 'ka_k-12_topic_e42568e0c6a050c1baf66eb391bcc4d5fc7a7226',
                            'code': 'e42568e0c6a050c1baf66eb391bcc4d5fc7a7226',
                            'translations': null,
                            'name': 'Light',
                            'description': 'Light',
                            'category': 'topic',
                            'status': 'Live'
                        }]
                    }],
                    'translations': null,
                    'name': 'Board',
                    'description': 'Board',
                    'index': 1,
                    'status': 'Live'
                }, {
                    'identifier': 'ka_k-12_medium',
                    'code': 'medium',
                    'terms': [{
                        'associations': [{
                            'identifier': 'ka_k-12_topic_1a94dc890ceb6b19695bf72108cbb64d1e2ba89b',
                            'code': '1a94dc890ceb6b19695bf72108cbb64d1e2ba89b',
                            'translations': null,
                            'name': 'English',
                            'description': 'English',
                            'category': 'medium',
                            'status': 'Live'
                        }]
                    }],
                    'translations': null,
                    'name': 'Medium',
                    'description': 'Medium',
                    'index': 2,
                    'status': 'Live'
                }, {
                    'identifier': 'ka_k-12_gradelevel',
                    'code': 'gradeLevel',
                    'terms': [{
                        'associations': [{
                            'identifier': 'ka_k-12_topic_1a94dc890ceb6b19695bf72108cbb64d1e2ba89b',
                            'code': '1a94dc890ceb6b19695bf72108cbb64d1e2ba89b',
                            'translations': null,
                            'name': 'Class 5',
                            'description': 'class 5',
                            'category': 'gradeLevel',
                            'status': 'Live'
                        }]
                    }],
                    'translations': null,
                    'name': 'Grade',
                    'description': 'Grade',
                    'index': 3,
                    'status': 'Live'
                }],
                'type': 'K-12',
                'objectType': 'Framework'
            }
        }
    },
    selectedBoard: {
        'identifier': 'ka_k-12',
        'name': 'State test 2',
        'objectType': 'Framework',
        'relation': 'hasSequenceMember',
        'description': 'State test 2',
        'index': 13,
        'status': 'Live'
    }
};
