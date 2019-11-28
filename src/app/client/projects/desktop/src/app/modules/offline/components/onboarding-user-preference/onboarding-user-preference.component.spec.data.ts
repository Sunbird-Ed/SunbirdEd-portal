export const onboarding_user_preference_test = {
    options: {
        board: {
            'identifier': 'Test',
            'name': 'Test',
            'objectType': 'Framework',
            'relation': 'hasSequenceMember',
            'description': 'Test',
            'index': 3,
            'status': 'Live'
        },
        medium: [{
            'associations': [{
                'identifier': 'as_k-12_topic_socialscience_l1con_9',
                'code': 'socialscience_l1Con_9',
                'name': 'What; Where; When And Why',
                'description': 'What; Where; When And Why',
                'category': 'topic',
                'status': 'Live'
            }],
            'identifier': 'as_k-12_medium_Test',
            'code': 'Test',
            'translations': null,
            'name': 'Test',
            'description': 'Test',
            'index': 1,
            'category': 'medium',
            'status': 'Live'
        }],
        class: [{
            'associations': [{
                'identifier': 'as_k-12_topic_mathematics_l1con_101',
                'code': 'mathematics_l1Con_101',
                'translations': '{\'as\':\'জোখ-মাখ (দৈৰ্ঘ্য)\'}',
                'name': 'Units Of Measurement Of Length',
                'description': 'Units Of Measurement Of Length',
                'category': 'topic',
                'status': 'Live'
            }],
            'identifier': 'as_k-12_gradelevel_class5',
            'code': 'class5',
            'translations': null,
            'name': 'Class 5',
            'description': 'Class 5',
            'index': 1,
            'category': 'gradeLevel',
            'status': 'Live'
        }]
    },
    orgSearch: {
        'id': 'api.org.search',
        'ver': '1.0',
        'ts': '2019-11-25T06:10:17.976Z',
        'params': {
            'resmsgid': 'a2a564fb-bdd3-484f-b477-2c0585b8aa14',
            'msgid': 'f5a699b3-141e-4c40-b5cd-12674f194e1c',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'content': [{
                    'dateTime': null,
                    'preferredLanguage': null,
                    'approvedBy': null,
                    'channel': 'ROOT_ORG',
                    'description': '',
                    'updatedDate': '2017-08-25 06:56:00:887+0000',
                    'addressId': null,
                    'provider': null,
                    'locationId': null,
                    'orgCode': 'ntp',
                    'theme': null,
                    'id': 'ORG_001',
                    'communityId': null,
                    'isApproved': null,
                    'email': null,
                    'slug': 'ntp',
                    'identifier': 'ORG_001',
                    'thumbnail': null,
                    'orgName': 'NTP',
                    'updatedBy': 'user1',
                    'locationIds': [],
                    'externalId': null,
                    'isRootOrg': true,
                    'rootOrgId': null,
                    'approvedDate': null,
                    'imgUrl': null,
                    'homeUrl': null,
                    'orgTypeId': null,
                    'isDefault': true,
                    'contactDetail': null,
                    'createdDate': null,
                    'createdBy': null,
                    'parentOrgId': null,
                    'hashTagId': '505c7c48ac6dc1edc9b08f21db5a571d',
                    'noOfMembers': 1,
                    'status': 1
                }],
                'count': 1
            }
        }
    },
    orgSearch_error: {
        'error': {
            'id': 'api.org.search',
            'ver': '1.0',
            'ts': '2019-10-25T09:39:51.560Z',
            'params': {
                'resmsgid': '9652a082-9677-4ccf-91e9-f138fd80c410',
                'msgid': 'c246387b-a3a6-4a98-b150-73b1bbab7665',
                'status': 'failed',
                'err': 'ERR_INTERNAL_SERVER_ERROR',
                'errmsg': 'Error while processing the request'
            },
            'responseCode': 'INTERNAL_SERVER_ERROR',
            'result': {}
        }
    },
    readChannel: {
        'id': 'api.channel.read',
        'ver': '1.0',
        'ts': '2019-11-25T06:27:26.653Z',
        'params': {
            'resmsgid': 'b1f931df-18f7-4a4a-a195-9bdc5f11bbf9',
            'msgid': 'ccc2b1db-0b63-4224-bfd3-6b53ee92438e',
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
                    'name': 'State (Test)',
                    'objectType': 'Framework',
                    'relation': 'hasSequenceMember',
                    'description': 'as_k-12 Test',
                    'index': 3,
                    'status': 'Live'
                }, {
                    'identifier': 'ka_k-12',
                    'name': 'State (Test 1)',
                    'objectType': 'Framework',
                    'relation': 'hasSequenceMember',
                    'description': 'State (Test 1)',
                    'index': 13,
                    'status': 'Live'
                }, {
                    'identifier': 'ch_k-12',
                    'name': 'State (Test 2)',
                    'objectType': 'Framework',
                    'relation': 'hasSequenceMember',
                    'description': 'State (Test 2)',
                    'index': 5,
                    'status': 'Live'
                }],
                'createdOn': '2018-02-12T11:38:44.292+0000',
                'versionKey': '1518435524292',
                'appId': 'te_portal',
                'name': 'te',
                'lastUpdatedOn': '2018-02-12T11:38:44.292+0000',
                'defaultFramework': 'TEST',
                'status': 'Live'
            }
        }
    },
    readChannel_error: {
        'error': {
            'id': 'api.channel.read',
            'ver': '1.0',
            'ts': '2019-10-25T09:39:51.560Z',
            'params': {
                'resmsgid': '9652a082-9677-4ccf-91e9-f138fd80c410',
                'msgid': 'c246387b-a3a6-4a98-b150-73b1bbab7665',
                'status': 'failed',
                'err': 'ERR_INTERNAL_SERVER_ERROR',
                'errmsg': 'Error while processing the request'
            },
            'responseCode': 'INTERNAL_SERVER_ERROR',
            'result': {}
        }
    },
    framework: {
        'id': 'api.framework.read',
        'ver': '1.0',
        'ts': '2019-11-25T06:54:58.518Z',
        'params': {
            'resmsgid': '886a9527-8ec6-4ca1-9f21-e32165170093',
            'msgid': '9ad9a1a7-2f78-401e-bad9-b180516679d1',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'framework': {
                'identifier': 'as_k-12',
                'code': 'as_k-12',
                'name': 'State (Test)',
                'description': 'as_k-12 Test',
                'graph_id': 'domain',
                'nodeType': 'DATA_NODE',
                'type': 'K-12',
                'node_id': 661142,
                'objectType': 'Framework',
                'categories': [{
                    'identifier': 'as_k-12_board',
                    'code': 'board',
                    'terms': [{
                        'associations': [{
                            'identifier': 'as_k-12_topic_socialscience_l1con_13',
                            'code': 'socialscience_l1Con_13',
                            'name': 'Vedic Age',
                            'description': 'Vedic Age',
                            'category': 'topic',
                            'status': 'Live'
                        }, {
                            'identifier': 'as_k-12_topic_socialscience_l1con_41',
                            'code': 'socialscience_l1Con_41',
                            'name': 'Contribution Of The Mughals To Indian Culture',
                            'description': 'Contribution Of The Mughals To Indian Culture',
                            'category': 'topic',
                            'status': 'Live'
                        }],
                        'identifier': 'as_k-12_board_stateTest',
                        'code': 'stateTest',
                        'translations': null,
                        'name': 'State (Test)',
                        'description': 'State (Test)',
                        'index': 1,
                        'category': 'board',
                        'status': 'Live'
                    }],
                    'translations': null,
                    'name': 'Board',
                    'description': 'Board',
                    'index': 1,
                    'status': 'Live'
                }, {
                    'identifier': 'as_k-12_medium',
                    'code': 'medium',
                    'terms': [{
                        'associations': [{
                            'identifier': 'as_k-12_topic_science_l1con_80',
                            'code': 'science_l1Con_80',
                            'translations': '{\'as\':\'দহন আৰু শিখা\'}',
                            'name': 'Combustion And Flame',
                            'description': 'Combustion And Flame',
                            'category': 'topic',
                            'status': 'Live'
                        }, {
                            'identifier': 'as_k-12_topic_socialscience_l1con_23',
                            'code': 'socialscience_l1Con_23',
                            'translations': '{\'as\':\'কেন্দ্ৰীয় আৰু ৰাজ্য়িক চৰকাৰ\'}',
                            'name': 'Central And State Government',
                            'description': 'Central And State Government',
                            'category': 'topic',
                            'status': 'Live'
                        }],
                        'identifier': 'as_k-12_medium_Test',
                        'code': 'Test',
                        'translations': null,
                        'name': 'Test',
                        'description': 'Test',
                        'index': 1,
                        'category': 'medium',
                        'status': 'Live'
                    }],
                    'translations': null,
                    'name': 'Medium',
                    'description': 'Medium',
                    'index': 2,
                    'status': 'Live'
                }, {
                    'identifier': 'as_k-12_gradelevel',
                    'code': 'gradeLevel',
                    'terms': [{
                        'associations': [{
                            'identifier': 'as_k-12_topic_mathematics_l1con_103',
                            'code': 'mathematics_l1Con_103',
                            'name': 'Application Of Numbers In Daily Life',
                            'description': 'Application Of Numbers In Daily Life',
                            'category': 'topic',
                            'status': 'Live'
                        }],
                        'identifier': 'as_k-12_gradelevel_class5',
                        'code': 'class5',
                        'translations': null,
                        'name': 'Class 5',
                        'description': 'Class 5',
                        'index': 1,
                        'category': 'gradeLevel',
                        'status': 'Live'
                    }],
                    'translations': null,
                    'name': 'Grade',
                    'description': 'Grade',
                    'index': 3,
                    'status': 'Live'
                }]
            }
        }
    },
    framework_error: {
        'error': {
            'id': 'api.framework.read',
            'ver': '1.0',
            'ts': '2019-10-25T09:39:51.560Z',
            'params': {
                'resmsgid': '9652a082-9677-4ccf-91e9-f138fd80c410',
                'msgid': 'c246387b-a3a6-4a98-b150-73b1bbab7665',
                'status': 'failed',
                'err': 'ERR_INTERNAL_SERVER_ERROR',
                'errmsg': 'Error while processing the request'
            },
            'responseCode': 'INTERNAL_SERVER_ERROR',
            'result': {}
        }
    },
    user_save : {
        'id': 'api.desktop.user.create',
        'ver': '1.0',
        'ts': '2019-11-25T08:32:31.280Z',
        'params': {
            'resmsgid': 'aba03caf-640c-45f8-9c17-c044fb6a2ff4',
            'msgid': '4f23a6a7-e2f3-4b44-a482-37ec03b038a7',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'id': '19f3964c-4213-4de3-9d5b-71d036492483'
        }
    },
    user_error: {
        'id': 'api.desktop.user.create',
        'ver': '1.0',
        'ts': '2019-11-25T08:36:07.287Z',
        'params': {
            'resmsgid': '100d6c41-1a32-4af1-8258-a95c5c077dba',
            'msgid': 'df43531f-cabe-4717-abab-c5fbfcad0c1d',
            'status': 'failed',
            'err': 'ERR_INTERNAL_SERVER_ERROR',
            'errmsg': 'User already exist with name guest'
        },
        'responseCode': 'INTERNAL_SERVER_ERROR',
        'result': {}
    },
    tenantInfo: {
        'appLogo': '/appLogo.png',
        'favicon': '/favicon.ico',
        'logo': '/logo.png',
        'titleName': 'te'
    },
    get_user: {
        'id': 'api.desktop.user.read',
        'ver': '1.0',
        'ts': '2019-11-27T12:18:27.289Z',
        'params': {
            'resmsgid': '0ba18248-d9ab-4c6e-a23f-2ec2985f1293',
            'msgid': 'f9ba8652-4e13-4e5c-b90d-a2cda627a98c',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'framework': {
                'id': '505c7c48ac6dc1edc9b08f21db5a571d',
                'board': 'State (Karnataka)',
                'medium': ['English'],
                'gradeLevel': ['Class 4', 'Class 6']
            },
            'formatedName': 'guest',
            'name': 'guest',
            'createdOn': 1574856716829,
            'updatedOn': 1574856716829,
            '_id': 'c18229aa-e42c-4463-bb88-29f67391f400',
            'location': {
                'state': {
                    'code': 'FT_State_Code-1544604001076',
                    'name': 'state_location_nameJMRUXuUbT6',
                    'id': 'bd47e788-e92e-4d12-9f26-b9eb9a4b70a5',
                    'type': 'state'
                },
                'city': {
                    'code': 'FT_District_Code-1544603939757',
                    'name': 'state_location_nameFniQB7lOZt',
                    'id': '8f3f79e8-a52f-42bb-a1f8-af6b3f0e57d8',
                    'type': 'district',
                    'parentId': 'bd47e788-e92e-4d12-9f26-b9eb9a4b70a5'
                }
            }
        }
    },
    get_user_error: {
        'id': 'api.desktop.user.read',
        'ver': '1.0',
        'ts': '2019-11-27T12:26:07.114Z',
        'params': {
            'resmsgid': '0c97824f-264e-4dd4-9205-30ce68500e96',
            'msgid': 'ca7bb07b-15e8-4599-a3d3-ddb91e95196a',
            'status': 'failed',
            'err': 'ERR_DATA_NOT_FOUND',
            'errmsg': 'User not found with name guest'
        },
        'responseCode': 'RESOURCE_NOT_FOUND',
        'result': {}
    }
};


