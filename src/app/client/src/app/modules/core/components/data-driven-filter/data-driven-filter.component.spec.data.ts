export const mockRes = {
    // tslint:disable-next-line:max-line-length
    frameworkData: {
        'err': null,
        'framework': 'NCF',
        'frameworkdata': [
            {
                'identifier': 'ncf_board',
                'code': 'board',
                'terms': [
                    {
                        'associations': [
                            {
                                'identifier': 'ncf_gradelevel_kindergarten',
                                'code': 'kindergarten',
                                'name': 'KG',
                                'description': 'KG',
                                'category': 'gradelevel',
                                'status': 'Live'
                            },
                            {
                                'identifier': 'ncf_gradelevel_grade5',
                                'code': 'grade5',
                                'name': 'Class 5',
                                'description': 'Class 5',
                                'category': 'gradelevel',
                                'status': 'Live'
                            }
                        ],
                        'identifier': 'ncf_board_ncert',
                        'code': 'ncert',
                        'name': 'NCERT',
                        'description': '',
                        'index': 1,
                        'category': 'board',
                        'status': 'Live'
                    },
                    {
                        'identifier': 'ncf_board_cbse',
                        'code': 'cbse',
                        'name': 'CBSE',
                        'description': '',
                        'index': 2,
                        'category': 'board',
                        'status': 'Live'
                    },
                    {
                        'identifier': 'ncf_board_others',
                        'code': 'others',
                        'name': 'Other',
                        'description': 'Other',
                        'index': 10,
                        'category': 'board',
                        'status': 'Live'
                    }
                ],
                'name': 'Curriculum',
                'description': '',
                'index': 1,
                'status': 'Live'
            },
            {
                'identifier': 'ncf_gradelevel',
                'code': 'gradeLevel',
                'terms': [
                    {
                        'identifier': 'ncf_gradelevel_kindergarten',
                        'code': 'kindergarten',
                        'name': 'KG',
                        'description': 'KG',
                        'index': 1,
                        'category': 'gradelevel',
                        'status': 'Live'
                    },
                    {
                        'identifier': 'ncf_gradelevel_others',
                        'code': 'others',
                        'name': 'Other',
                        'description': '',
                        'index': 14,
                        'category': 'gradeLevel',
                        'status': 'Live'
                    }
                ],
                'name': 'Class',
                'description': '',
                'index': 2,
                'status': 'Live'
            },
            {
                'identifier': 'xyz',
                'name': 'Concepts',
                'code': 'concepts',
                'description': '',
                'index': 5,
                'status': 'Live',
                'domains': [
                    {
                        'identifier': 'numeracy',
                        'name': 'Numeracy',
                        'objectType': 'Domain',
                        'children': [
                            {
                                'identifier': 'D5',
                                'name': 'Data Handling',
                                'objectType': 'Dimension',
                                'children': []
                            },
                            {
                                'identifier': 'D1',
                                'name': 'Geometry',
                                'objectType': 'Dimension',
                                'children': []
                            },
                            {
                                'identifier': 'testDimension1',
                                'name': 'Measurement',
                                'objectType': 'Dimension',
                                'children': []
                            },
                            {
                                'identifier': 'D4',
                                'name': 'Measurement',
                                'objectType': 'Dimension',
                                'children': []
                            },
                            {
                                'identifier': 'D2',
                                'name': 'Number sense',
                                'objectType': 'Dimension',
                                'children': [
                                    {
                                        'identifier': 'C6',
                                        'name': 'Counting',
                                        'objectType': 'Concept',
                                        'children': [
                                            {
                                                'identifier': 'C49',
                                                'name': 'Counting objects',
                                                'objectType': 'Concept',
                                                'children': [
                                                    {
                                                        'identifier': 'C211',
                                                        'name': 'Count to 20',
                                                        'objectType': 'Concept',
                                                        'children': [
                                                            {
                                                                'identifier': 'C455',
                                                                'name': 'Learner does not know the order of numbers.',
                                                                'objectType': 'Concept',
                                                                'children': []
                                                            },
                                                            {
                                                                'identifier': 'C456',
                                                                'name': 'Learner.',
                                                                'objectType': 'Concept',
                                                                'children': []
                                                            },
                                                            {
                                                                'identifier': 'C451',
                                                                'name': 'Learner.',
                                                                'objectType': 'Concept',
                                                                'children': []
                                                            },
                                                            {
                                                                'identifier': 'C460',
                                                                'name': 'Learner skips all even numbers while counting.',
                                                                'objectType': 'Concept',
                                                                'children': []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        'identifier': 'C8',
                                        'name': 'Place value',
                                        'objectType': 'Concept',
                                        'children': [
                                            {
                                                'identifier': 'C71',
                                                'name': 'Expand a number with respect to place values',
                                                'objectType': 'Concept',
                                                'children': []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    formConfigData: [
        {
            'code': 'concept',
            'name': 'Concepts',
            'label': 'Concepts',
            'description': 'concept',
            'editable': true,
            'inputType': 'select ',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 5,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        },
        {
            // tslint:disable-next-line:max-line-length
            'code': 'board', 'name': 'Board', 'label': 'Board', 'description': 'Education Board (Like MP Board, NCERT, etc)', 'editable': true, 'inputType': 'select', 'required': false, 'displayProperty': 'Editable', 'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 1,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        },
        {
            // tslint:disable-next-line:max-line-length
            'code': 'medium', 'name': 'Medium', 'label': 'Medium', 'description': 'Medium of instruction', 'editable': true, 'inputType': 'select', 'required': false, 'displayProperty': 'Editable', 'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 4,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        },
        {
            // tslint:disable-next-line:max-line-length
            'code': 'subject', 'name': 'Subject', 'label': 'Subject', 'description': 'Subject of the Content to use to teach', 'editable': true, 'inputType': 'select', 'required': false, 'displayProperty': 'Editable', 'visible': true, 'renderingHints': { 'semanticColumnWidth': 'four' }, 'index': 2,
            'allowedRoles': ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION']
        }],
    formData: [
        {
            'code': 'concepts',
            'dataType': 'text',
            'name': 'Concepts',
            'label': 'Concepts',
            'description': 'concept',
            'editable': true,
            'inputType': 'Concept',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'renderingHints': {
                'semanticColumnWidth': 'four'
            },
            'index': 6
        },
        {
            'code': 'contentType',
            'dataType': 'text',
            'name': 'Content Types',
            'label': 'Content Types',
            'description': 'Content Types',
            'editable': true,
            'inputType': 'select',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'range': [
                {
                    'name': 'TextBook'
                },
                {
                    'name': 'Collection'
                },
                {
                    'name': 'LessonPlan'
                },
                {
                    'name': 'Resource'
                }
            ],
            'renderingHints': {
                'semanticColumnWidth': 'four'
            },
            'index': 5
        },
        {
            'code': 'board',
            'dataType': 'text',
            'name': 'Board',
            'label': 'Board',
            'description': 'Education Board (Like MP Board, NCERT, etc)',
            'editable': true,
            'inputType': 'select',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'renderingHints': {
                'semanticColumnWidth': 'four'
            },
            'index': 1
        },
        {
            'code': 'gradeLevel',
            'dataType': 'text',
            'name': 'Class',
            'label': 'Class',
            'description': 'Grade',
            'editable': true,
            'inputType': 'select',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'renderingHints': {
                'semanticColumnWidth': 'four'
            },
            'index': 2
        },
        {
            'code': 'medium',
            'dataType': 'text',
            'name': 'Medium',
            'label': 'Medium',
            'description': 'Medium of instruction',
            'editable': true,
            'inputType': 'select',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'renderingHints': {
                'semanticColumnWidth': 'four'
            },
            'index': 4
        },
        {
            'code': 'subject',
            'dataType': 'text',
            'name': 'Subject',
            'label': 'Subject',
            'description': 'Subject of the Content to use to teach',
            'editable': true,
            'inputType': 'select',
            'required': false,
            'displayProperty': 'Editable',
            'visible': true,
            'renderingHints': {
                'semanticColumnWidth': 'four'
            },
            'index': 3
        }
    ],
    enrichFilterData: {
        'gradeLevel': [
            {
                'name': 'grade 9',
                'count': 7
            },
            {
                'name': 'kindergarten',
                'count': 268
            },
            {
                'name': 'other',
                'count': 161
            },
            {
                'name': 'class 10',
                'count': 5
            },
            {
                'name': 'class 11',
                'count': 8
            },
            {
                'name': 'class 12',
                'count': 6
            },
            {
                'name': 'grade 1',
                'count': 485
            },
            {
                'name': 'english',
                'count': 1
            },
            {
                'name': 'grade 2',
                'count': 273
            },
            {
                'name': 'grade 3',
                'count': 168
            },
            {
                'name': 'grade 4',
                'count': 151
            },
            {
                'name': 'grade 5',
                'count': 143
            },
            {
                'name': 'kg',
                'count': 94
            },
            {
                'name': 'grade 11',
                'count': 7
            },
            {
                'name': 'grade 6',
                'count': 13
            },
            {
                'name': 'grade 10',
                'count': 7
            },
            {
                'name': 'grade 7',
                'count': 8
            },
            {
                'name': 'grade 8',
                'count': 14
            },
            {
                'name': 'grade 12',
                'count': 8
            },
            {
                'name': 'class 1',
                'count': 178
            },
            {
                'name': 'class 3',
                'count': 33
            },
            {
                'name': 'class 2',
                'count': 85
            },
            {
                'name': 'class 5',
                'count': 32
            },
            {
                'name': 'class 4',
                'count': 23
            },
            {
                'name': 'class 7',
                'count': 6
            },
            {
                'name': 'class 6',
                'count': 7
            },
            {
                'name': 'class 9',
                'count': 5
            },
            {
                'name': 'class 8',
                'count': 9
            }
        ],
        'subject': [
            {
                'name': 'chemistry',
                'count': 2
            },
            {
                'name': 'biology',
                'count': 5
            },
            {
                'name': 'mathematics',
                'count': 83
            },
            {
                'name': 'maths',
                'count': 2
            },
            {
                'name': 'punjabi',
                'count': 2
            },
            {
                'name': 'gujarati',
                'count': 8
            },
            {
                'name': 'kannada',
                'count': 6
            },
            {
                'name': 'history',
                'count': 1
            },
            {
                'name': 'assamese',
                'count': 13
            },
            {
                'name': 'literacy',
                'count': 80
            },
            {
                'name': 'marathi',
                'count': 9
            },
            {
                'name': 'tamil',
                'count': 7
            },
            {
                'name': 'malayalam',
                'count': 1
            },
            {
                'name': 'geography',
                'count': 10
            },
            {
                'name': 'physics',
                'count': 3
            },
            {
                'name': 'english',
                'count': 127
            },
            {
                'name': 'hindi',
                'count': 29
            },
            {
                'name': 'bengali',
                'count': 25
            },
            {
                'name': 'urdu',
                'count': 6
            },
            {
                'name': 'numeracy',
                'count': 1
            },
            {
                'name': 'telugu',
                'count': 4
            },
            {
                'name': 'nepali',
                'count': 2
            },
            {
                'name': 'oriya',
                'count': 2
            }
        ],
        'medium': [
            {
                'name': '',
                'count': 147
            },
            {
                'name': 'gujarati',
                'count': 2
            },
            {
                'name': 'kannada',
                'count': 4
            },
            {
                'name': 'assamese',
                'count': 2
            },
            {
                'name': 'marathi',
                'count': 18
            },
            {
                'name': 'tamil',
                'count': 3
            },
            {
                'name': 'malayalam',
                'count': 1
            },
            {
                'name': 'english',
                'count': 103
            },
            {
                'name': 'hindi',
                'count': 37
            },
            {
                'name': 'bengali',
                'count': 10
            },
            {
                'name': 'telugu',
                'count': 8
            },
            {
                'name': 'nepali',
                'count': 1
            },
            {
                'name': 'odia',
                'count': 12
            }
        ],
        'board': [
            {
                'name': 'state (uttar pradesh)',
                'count': 7
            },
            {
                'name': 'up board',
                'count': 5
            },
            {
                'name': 'mscert',
                'count': 3
            },
            {
                'name': 'tn board',
                'count': 1
            },
            {
                'name': 'state (andhra pradesh)',
                'count': 9
            },
            {
                'name': 'state (maharashtra)',
                'count': 10
            },
            {
                'name': 'icse',
                'count': 24
            },
            {
                'name': 'ncert',
                'count': 104
            },
            {
                'name': 'cbse',
                'count': 69
            },
            {
                'name': 'state (tamil nadu)',
                'count': 5
            }
        ]
    },
    userProfile: {
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
                'status': 1
            }
        }
    }
};
