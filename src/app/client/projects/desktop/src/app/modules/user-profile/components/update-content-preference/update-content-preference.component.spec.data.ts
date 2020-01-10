export const user_content_preferences_Data = {

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
    custodianOrgId:
    {
        'id': 'api.system.settings.get.custodianOrgId',
        'ver': '1.0',
        'ts': '2019-12-15T15:53:04.963Z',
        'params': {
            'resmsgid': '8eb4cb9d-2218-4427-9d5e-38b92553de3a',
            'msgid': 'abf2c645-ee4f-4e3d-8460-dfe10b19a869',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'id': 'custodianOrgId',
                'field': 'custodianOrgId',
                'value': '0126684405014528002'
            }
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
    success_update_preferences: {
        'id': 'api.desktop.user.update',
        'ver': '1.0',
        'ts': '2019-12-19T12:50:57.390Z',
        'params': {
            'resmsgid': '010d00e3-2f64-4d6e-8b72-56bdd782d6c8',
            'msgid': '8e67e664-1d7c-44a4-83ef-daf0415ec6e6',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'identifier': '9783dc11-206c-4a3e-917a-cf4853ce23a2'
        }
    },
    error_update_preferences: {
            'id': 'api.desktop.user.update',
            'ver': '1.0',
            'ts': '2019-12-19T12:52:08.561Z',
            'params': {
                'resmsgid': 'c17703c2-1362-477c-9495-346c9da45787',
                'msgid': '1ff811ec-45a6-455f-a121-05f60c978086',
                'status': 'failed',
                'err': 'ERR_BAD_REQUEST',
                'errmsg': 'Error while processing the request '
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
    },

    resourceBundle: {
        messages: {
            smsg: {
                m0058: 'User preference updated successfully...'
            },
            emsg: {
                m0022: 'Unable to update user preference. Please try again after some time'
            }
        }
    },
    update_content_api_body: {
        subjects: [
            {
                category: 'subject',
                code: 'science',
                description: 'Science',
                identifier: 'ka_k-12_subject_science',
                index: 1,
                name: 'Science',
                status: 'Live',
                translations: null
            }
        ],
        medium: [
            {
                category: 'medium',
                code: 'english',
                description: 'English',
                identifier: 'ka_k-12_medium_english',
                index: 1,
                name: 'English',
                status: 'Live',
                translations: null
            }
        ],
        class: [
            {
                category: 'gradeLevel',
                code: 'class6',
                description: 'Class 6',
                identifier: 'ka_k-12_gradelevel_class6',
                index: 3,
                name: 'Class 6',
                status: 'Live',
                translations: null
            }
        ],
        board: {
            description: 'State (Karnataka)',
            identifier: 'ka_k-12',
            index: 13,
            name: 'State (Karnataka)',
            objectType: 'Framework',
            relation: 'hasSequenceMember',
            status: 'Live'
        }
    },
    request_body: {
        'request': {
            'framework': {
                'board': 'State (Karnataka)',
                'medium': ['English'],
                'gradeLevel': ['Class 10'],
                'subjects': []
            },

            'identifier': '9783dc11-206c-4a3e-917a-cf4853ce23a2'
        }
    }

};

