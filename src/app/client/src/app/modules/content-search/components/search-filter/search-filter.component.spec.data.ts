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
    },
    filterValue: {
        'board': [{
            'associations': [{
                'identifier': 'ncfcopy_gradelevel_kindergarten',
                'code': 'kindergarten',
                'translations': '{\'hi\':\'बाल विहार\'}',
                'name': 'Kindergarten',
                'description': '',
                'index': 0,
                'category': 'gradeLevel',
                'status': 'Live'
            }, {
                'identifier': 'ncfcopy_gradelevel_grade5',
                'code': 'grade5',
                'translations': null,
                'name': 'Grade 5',
                'description': '',
                'index': 0,
                'category': 'gradeLevel',
                'status': 'Live'
            }, {
                'identifier': 'ncfcopy_gradelevel_grade1',
                'code': 'grade1',
                'translations': null,
                'name': 'Grade 1',
                'description': '',
                'index': 0,
                'category': 'gradeLevel',
                'status': 'Live'
            }, {
                'identifier': 'ncfcopy_gradelevel_grade2',
                'code': 'grade2',
                'translations': null,
                'name': 'Grade 2',
                'description': '',
                'index': 0,
                'category': 'gradeLevel',
                'status': 'Live'
            }, {
                'identifier': 'ncfcopy_gradelevel_grade4',
                'code': 'grade4',
                'translations': null,
                'name': 'Grade 4',
                'description': '',
                'index': 0,
                'category': 'gradeLevel',
                'status': 'Live'
            }, {
                'identifier': 'ncfcopy_gradelevel_grade3',
                'code': 'grade3',
                'translations': null,
                'name': 'Grade 3',
                'description': '',
                'index': 0,
                'category': 'gradeLevel',
                'status': 'Live'
            }],
            'identifier': 'ncfcopy_board_ncert',
            'code': 'ncert',
            'translations': null,
            'name': 'NCERT',
            'description': '',
            'index': 1,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_cbse',
            'code': 'cbse',
            'translations': null,
            'name': 'CBSE',
            'description': '',
            'index': 2,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_icse',
            'code': 'icse',
            'translations': null,
            'name': 'ICSE',
            'description': '',
            'index': 3,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_upboard',
            'code': 'upboard',
            'translations': '{\'hi\':\'टेस्ट फ़्रेम्वर्क\',\'ka\':\'ೂಾೇೂ ಿೀೋಸಾೈದೀಕ\'}',
            'name': 'UP Board',
            'description': '',
            'index': 4,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_apboard',
            'code': 'apboard',
            'translations': null,
            'name': 'AP Board',
            'description': '',
            'index': 5,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_tnboard',
            'code': 'tnboard',
            'translations': null,
            'name': 'TN Board',
            'description': '',
            'index': 6,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_ncte',
            'code': 'ncte',
            'translations': null,
            'name': 'NCTE',
            'description': '',
            'index': 7,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_mscert',
            'code': 'mscert',
            'translations': '{\'hi\':\'टेस्ट फ़्रेम्वर्क\',\'ka\':\'ೂಾೇೂ ಿೀೋಸಾೈದೀಕ\'}',
            'name': 'MSCERT',
            'description': '',
            'index': 8,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_bser',
            'code': 'bser',
            'translations': null,
            'name': 'BSER',
            'description': '',
            'index': 9,
            'category': 'board',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_board_others',
            'code': 'others',
            'translations': null,
            'name': 'Others',
            'description': '',
            'index': 10,
            'category': 'board',
            'status': 'Live'
        }],
        'medium': [{
            'identifier': 'ncfcopy_medium_english',
            'code': 'english',
            'translations': '{\'hi\':\'अंग्रेज़ी\'}',
            'name': 'English',
            'description': '',
            'index': 1,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_hindi',
            'code': 'hindi',
            'translations': null,
            'name': 'Hindi',
            'description': '',
            'index': 2,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_oriya',
            'code': 'oriya',
            'translations': null,
            'name': 'Oriya',
            'description': '',
            'index': 3,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_telugu',
            'code': 'telugu',
            'translations': null,
            'name': 'Telugu',
            'description': '',
            'index': 4,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_kannada',
            'code': 'kannada',
            'translations': null,
            'name': 'Kannada',
            'description': '',
            'index': 5,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_marathi',
            'code': 'marathi',
            'translations': null,
            'name': 'Marathi',
            'description': '',
            'index': 6,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_assamese',
            'code': 'assamese',
            'translations': null,
            'name': 'Assamese',
            'description': '',
            'index': 7,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_bengali',
            'code': 'bengali',
            'translations': null,
            'name': 'Bengali',
            'description': '',
            'index': 8,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_gujarati',
            'code': 'gujarati',
            'translations': null,
            'name': 'Gujarati',
            'description': '',
            'index': 9,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_urdu',
            'code': 'urdu',
            'translations': null,
            'name': 'Urdu',
            'description': '',
            'index': 10,
            'category': 'medium',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_medium_other',
            'code': 'other',
            'translations': null,
            'name': 'Other',
            'description': '',
            'index': 11,
            'category': 'medium',
            'status': 'Live'
        }],
        'gradeLevel': [{
            'identifier': 'ncfcopy_gradelevel_grade1',
            'code': 'grade1',
            'translations': null,
            'name': 'Grade 1',
            'description': '',
            'index': 1,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_kindergarten',
            'code': 'kindergarten',
            'translations': '{\'hi\':\'बाल विहार\'}',
            'name': 'Kindergarten',
            'description': '',
            'index': 2,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade3',
            'code': 'grade3',
            'translations': null,
            'name': 'Grade 3',
            'description': '',
            'index': 3,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade4',
            'code': 'grade4',
            'translations': null,
            'name': 'Grade 4',
            'description': '',
            'index': 4,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade5',
            'code': 'grade5',
            'translations': null,
            'name': 'Grade 5',
            'description': '',
            'index': 5,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade6',
            'code': 'grade6',
            'translations': null,
            'name': 'Grade 6',
            'description': '',
            'index': 6,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade7',
            'code': 'grade7',
            'translations': null,
            'name': 'Grade 7',
            'description': '',
            'index': 7,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade8',
            'code': 'grade8',
            'translations': null,
            'name': 'Grade 8',
            'description': '',
            'index': 8,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade9',
            'code': 'grade9',
            'translations': null,
            'name': 'Grade 9',
            'description': '',
            'index': 9,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade10',
            'code': 'grade10',
            'translations': null,
            'name': 'Grade 10',
            'description': '',
            'index': 10,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade11',
            'code': 'grade11',
            'translations': null,
            'name': 'Grade 11',
            'description': '',
            'index': 11,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_grade12',
            'code': 'grade12',
            'translations': null,
            'name': 'Grade 12',
            'description': '',
            'index': 12,
            'category': 'gradeLevel',
            'status': 'Live'
        }, {
            'identifier': 'ncfcopy_gradelevel_others',
            'code': 'others',
            'translations': null,
            'name': 'Others',
            'description': '',
            'index': 14,
            'category': 'gradeLevel',
            'status': 'Live'
        }],
        'subject': []
    }
};
